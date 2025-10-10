import { handleUpload, type HandleUploadBody } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
          tokenPayload: JSON.stringify({
            // Optional: pass-through data to verify on completion
            // For example, you could pass the user ID here.
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This callback is called after the file is uploaded to Vercel Blob.
        // You can perform any necessary actions here, like saving the blob.url to your database.
        console.log('Blob upload completed', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json(
      { error: message },
      { status: 400, statusText: 'Bad Request' }
    );
  }
}
