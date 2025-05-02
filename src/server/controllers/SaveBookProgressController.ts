import { z } from "zod";
import BookProgress from "../entities/BookProgress";
import IBookProgressRepository from "../repositories/IBookProgressRepository";
import SaveBookProgressService from "../useCases/saveBookProgress/saveBookProgressService";

type Input = Omit<BookProgress, "id" | "updatedAt">;
type SaveBookProgressControllerProps = {
  bookProgressRepository: IBookProgressRepository;
}

export default class SaveBookProgressController {
  private bookProgressRepository: IBookProgressRepository;
  private saveBookProgressService: SaveBookProgressService;
  private requestBodySchema = z.object({
    userID: z.number(),
    bookID: z.number(),
    currentChunkIndex: z.number(),
    totalTypedCharacters: z.number(),
    totalMistakes: z.number(),
  })

  constructor({ bookProgressRepository }: SaveBookProgressControllerProps) {
    this.bookProgressRepository = bookProgressRepository;
    this.saveBookProgressService = new SaveBookProgressService({
      bookProgressRepository: this.bookProgressRepository,
    });
  }

  public async handle(input: Input): Promise<BookProgress | void> {
    const parsedInput = this.requestBodySchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error("Invalid input: ", parsedInput.error);
    }
    const BookProgressInput = parsedInput.data;
    return await this.saveBookProgressService.execute(BookProgressInput)
  }
}
