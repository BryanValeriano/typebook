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

  constructor({ bookProgressRepository }: SaveBookProgressControllerProps) {
    this.bookProgressRepository = bookProgressRepository;
    this.saveBookProgressService = new SaveBookProgressService({
      bookProgressRepository: this.bookProgressRepository,
    });
  }

  public async execute(input: Input): Promise<BookProgress | void> {
    return await this.saveBookProgressService.execute(input)
  }
}
