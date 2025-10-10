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
          allowedContentTypes: ['video/mp4', 'video/quicktime'],
          tokenPayload: JSON.stringify({
            // Optional: pass-through data to verify on completion
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('blob upload completed', blob, tokenPayload);

        try {
          // In a real app, you would save the blob.url to a database here.
        } catch (error) {
          throw new Error('Could not process upload completion');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = (error as Error).message;
    return NextResponse.json(
      { error: message },
      { status: 400, statusText: message }
    );
  }
}
