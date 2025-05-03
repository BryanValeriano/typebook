import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Temporary: Read all books as if they're in the user's library
    const booksDir = path.join(process.cwd(), 'public/books');
    const bookFiles = await fs.readdir(booksDir);

    const books = bookFiles
      .filter(file => file.endsWith('.txt'))
      .map(file => file.replace('.txt', ''));

    return NextResponse.json(books);
  } catch (error) {
    console.error('Failed to load user books:', error);
    return NextResponse.json([], { status: 500 });
  }
}
