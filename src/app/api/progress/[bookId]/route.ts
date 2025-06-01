import { container } from "@/server/container";
import GetBookProgressController from "@/server/controllers/GetBookProgressController";
import SaveBookProgressController from "@/server/controllers/SaveBookProgressController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  try {
    const { bookProgressRepository } = container();
    const getBookProgressController = new GetBookProgressController({ bookProgressRepository });

    const userID = request.headers.get("x-user-id");
    if (!userID) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const bookId = params.bookId;
    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId in params" }, { status: 400 });
    }

    const response = await getBookProgressController.handle(userID, bookId);
    console.log("Response from getBookProgressController:", response);
    if (response === undefined) {
      return NextResponse.json({ success: false, error: "No progress found for this book" }, { status: 404 });
    }
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
    const bookID = context.params.bookId;
    if (!bookID) {
      return NextResponse.json({ error: "Missing bookId in params" }, { status: 400 });
    }

    const userID = request.headers.get("x-user-id");
    if (!userID) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const response = await saveBookProgressController.handle({
      userID: userID,
      bookID: bookID,
      ...body,
    });

    return NextResponse.json({ success: true, response }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
