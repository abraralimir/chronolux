'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { put } from '@vercel/blob';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a video file to upload.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const blob = await put(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // In a real app, you'd save blob.url to your database
      console.log('File uploaded successfully:', blob.url);
      
      toast({
        title: 'Upload Complete',
        description: `"${file.name}" has been successfully uploaded.`,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Something went wrong during the upload. Please try again.',
      });
    } finally {
        setIsUploading(false);
        setFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
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
          <Input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleFileChange} ref={fileInputRef} disabled={isUploading} />
          
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</> : 'Upload'}
          </Button>

          {isUploading && (
            <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-sm text-muted-foreground">Uploading, please wait...</p>
            </div>
          )}

           <p className="text-xs text-muted-foreground text-center">After uploading, the URL will be available in the browser console. This will be integrated into the app later.</p>
        </CardContent>
      </Card>
    </main>
  );
}
