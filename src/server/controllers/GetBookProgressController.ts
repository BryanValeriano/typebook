import { z } from "zod";
import BookProgress from "../entities/BookProgress";
import IBookProgressRepository from "../repositories/IBookProgressRepository";
import GetBookProgressService from "../useCases/getBookProgress/getBookProgressService";

type GetBookProgressControllerProps = {
  bookProgressRepository: IBookProgressRepository;
};

export default class GetBookProgressController {
  private bookProgressRepository: IBookProgressRepository;
  private getBookProgressService: GetBookProgressService;
  private requestBodySchema = z.object({
    userID: z.string(),
    bookID: z.string(),
  });

  constructor({ bookProgressRepository }: GetBookProgressControllerProps) {
    this.bookProgressRepository = bookProgressRepository;
    this.getBookProgressService = new GetBookProgressService({
      bookProgressRepository: this.bookProgressRepository,
    });
  }

  public async handle(userID: string, bookID: string): Promise<BookProgress | void> {
    const parsedInput = this.requestBodySchema.safeParse({ userID, bookID });
    if (!parsedInput.success) {
      throw new Error("Invalid input: ", parsedInput.error);
    }
    return await this.getBookProgressService.execute(userID, bookID);
  }
}
