import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: 'No filename or file body provided.' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    // After successful upload, save metadata to Vercel KV
    const video = {
      id: blob.pathname,
      title: filename.replace(/\.[^/.]+$/, ""), // Remove file extension for title
      src: blob.url,
    };
    
    // We'll store all videos under a single key 'videos' which is an array
    const videos = await kv.get<any[]>('videos') || [];
    const updatedVideos = [...videos, video];
    await kv.set('videos', updatedVideos);

    return NextResponse.json(blob);
  } catch (error) {
    const message = (error as Error).message;
     console.error('Upload API Error:', message);
     console.error('KV_URL:', process.env.KV_REST_API_URL ? 'Loaded' : 'MISSING');
     console.error('KV_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Loaded' : 'MISSING');
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
