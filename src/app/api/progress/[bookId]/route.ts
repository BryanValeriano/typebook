import { container } from "@/server/container";
import GetBookProgressController from "@/server/controllers/GetBookProgressController";
import SaveBookProgressController from "@/server/controllers/SaveBookProgressController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  try {
    const { bookProgressRepository } = container();
    const getBookProgressController = new GetBookProgressController({ bookProgressRepository });
    const userID = "3";

    const response = await getBookProgressController.handle(
      parseInt(userID),
      parseInt(params.bookId),
    );

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: { bookId: string } }) {
  try {
    const { bookProgressRepository } = container();
    const saveBookProgressController = new SaveBookProgressController({ bookProgressRepository });

    const body = await request.json();
    const bookID = parseInt(context.params.bookId);

    const response = await saveBookProgressController.handle({
      ...body,
      bookID: bookID,
    });

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
