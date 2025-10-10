'use client';

import { useState, useRef } from 'react';
import type { PutBlobResult } from '@vercel/blob';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    if (!inputFileRef.current?.files) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a video file to upload.',
      });
      setIsUploading(false);
      return;
    }

    const file = inputFileRef.current.files[0];

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Upload failed');
      }

      const newBlob = (await response.json()) as PutBlobResult;

      console.log('File uploaded successfully:', newBlob.url);
      toast({
        title: 'Upload Complete',
        description: `"${newBlob.pathname}" has been successfully uploaded.`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: message,
      });
    } finally {
      setIsUploading(false);
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUpload}>
            <Input
              name="file"
              ref={inputFileRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              required
              disabled={isUploading}
            />
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full mt-4"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </form>

          {isUploading && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-sm text-muted-foreground">
                Uploading, please wait...
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            After uploading, the URL will be available in the browser console.
            This will be integrated into the app later.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
