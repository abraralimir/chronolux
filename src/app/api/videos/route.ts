import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const videos = await kv.get('videos');
    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    const message = (error as Error).message;
    console.error('Get Videos API Error:', message);
    console.error('KV_URL:', process.env.KV_REST_API_URL ? 'Loaded' : 'MISSING');
    console.error('KV_TOKEN:', process.env.KV_REST_API_TOKEN ? 'Loaded' : 'MISSING');
    return NextResponse.json(
      { error: `Failed to retrieve videos: ${message}` },
      { status: 500 }
    );
  }
}
