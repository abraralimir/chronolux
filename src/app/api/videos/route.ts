import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { config } from 'dotenv';

config();

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const videos = await kv.get('videos');
    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    console.error('Failed to fetch videos from KV:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve videos.' },
      { status: 500 }
    );
  }
}
