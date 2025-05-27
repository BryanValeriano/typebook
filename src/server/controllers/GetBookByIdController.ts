import Book from "../entities/Book";
import IBooksRepository from "../repositories/IBooksRepository";
import GetBookByIdService from "../useCases/getBookById/getBookByIdService";
import { z } from "zod";

type GetBookByIdControllerProps = {
  booksRepository: IBooksRepository;
};

export default class GetBookByIdController {
  private booksRepository: IBooksRepository;
  private getBookByIdService: GetBookByIdService;
  private requestBodySchema = z.object({
    bookId: z.string(),
  });

  constructor({ booksRepository }: GetBookByIdControllerProps) {
    this.booksRepository = booksRepository;
    this.getBookByIdService = new GetBookByIdService({
      booksRepository: this.booksRepository,
    });
  }

  public async handle(bookId: string): Promise<Book | void> {
    const parsedInput = this.requestBodySchema.safeParse({ bookId });
    if (!parsedInput.success) {
      throw new Error("Invalid input: ", parsedInput.error);
    }
    return await this.getBookByIdService.execute(bookId);
  }
}
