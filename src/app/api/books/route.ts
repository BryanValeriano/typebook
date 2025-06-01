import { NextResponse } from 'next/server';
import { container } from '@/server/container';
import GetAllBooksController from '@/server/controllers/GetAllBooksController';

export async function GET() {
  try {
    const { booksRepository } = container();
    const getAllBooksController = new GetAllBooksController({ bookRepository: booksRepository });
    const response = await getAllBooksController.handle();
    return NextResponse.json({ success: true, response }, { status: 200 });
  } catch (error) {
    console.error('Error reading books directory:', error);
    return NextResponse.json([], { status: 500 });
  }
}
