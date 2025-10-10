'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { put } from '@vercel/blob';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    try {
      const blob = await put(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // In a real app, you'd save blob.url to your database
      console.log('File uploaded successfully:', blob.url);
      
      toast({
        title: 'Upload Complete',
        description: `"${file.name}" has been successfully uploaded. URL: ${blob.url}`,
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
        setUploadProgress(100); // Simulate completion for UI
        setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Upload Video to Vercel Blob</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="video/mp4,video/quicktime" onChange={handleFileChange} ref={fileInputRef} disabled={isUploading} />
          {isUploading && (
            <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">Uploading... this may take a moment.</p>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {uploadProgress > 0 && !isUploading && (
             <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-center text-muted-foreground">Upload Finished!</p>
            </div>
          )}
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Uploading...</> : 'Upload'}
          </Button>
           <p className="text-xs text-muted-foreground text-center">After uploading, you can find the URL in your browser's developer console.</p>
        </CardContent>
      </Card>
    </main>
  );
}
