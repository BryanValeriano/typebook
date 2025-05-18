import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const booksDir = path.join(process.cwd(), 'public/books');
    const bookFiles = await fs.readdir(booksDir);

    // Filter for .txt files and remove the .txt extension
    const books = bookFiles
      .filter(file => file.endsWith('.txt'))
      .map(file => file.replace('.txt', ''));

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error reading books directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}

