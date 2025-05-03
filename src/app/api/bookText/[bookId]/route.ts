import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

function chunkText(fullText: string, chunkSize: number = 100): string[] {
  return fullText
    .split(/\s+/)
    .reduce((result: string[][], word, index) => {
      const i = Math.floor(index / chunkSize);
      if (!result[i]) result[i] = [];
      result[i].push(word);
      return result;
    }, [])
    .map(chunk => chunk.join(' '));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId?: string } }
) {
  const bookId = params.bookId;

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId in params" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'public/books', `${params.bookId}.txt`);
    const fileBuffer = await fs.readFile(filePath, 'utf-8');
    const chunks = chunkText(fileBuffer);
    return NextResponse.json({ chunks });
  } catch (error) {
    console.error('Failed to load book text:', error);
    return NextResponse.json({ chunks: [] }, { status: 404 });
  }
}
