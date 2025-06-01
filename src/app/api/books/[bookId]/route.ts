import { container } from "@/server/container";
import GetBookByIdController from "@/server/controllers/GetBookByIdController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  try {
    const { booksRepository } = container();
    const getBookByIdController = new GetBookByIdController({
      booksRepository: booksRepository,
    });
    const param = await params;

    const bookId = param.bookId;
    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId in params" }, { status: 400 });
    }

    const response = await getBookByIdController.handle(bookId);
    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500 });
  }
}
