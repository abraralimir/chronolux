import { handleUpload, type HandleUploadBody } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // This function runs on the server before generating a token for the client
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime'],
          tokenPayload: JSON.stringify({
            // Optional: pass-through data to verify on completion
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This function runs on the server after upload is complete
        console.log('blob upload completed', blob, tokenPayload);

        try {
          // You can perform any logic here, like saving the blob URL to a database
        } catch (error) {
          throw new Error('Could not process upload');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
