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

    const userID = request.headers.get("x-user-id");
    if (!userID) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    body.userID = parseInt(userID);

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
