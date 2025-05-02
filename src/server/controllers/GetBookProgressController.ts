import BookProgress from "../entities/BookProgress";
import IBookProgressRepository from "../repositories/IBookProgressRepository";
import GetBookProgressService from "../useCases/getBookProgress/getBookProgressService";

type GetBookProgressControllerProps = {
  bookProgressRepository: IBookProgressRepository;
};

export default class GetBookProgressController {
  private bookProgressRepository: IBookProgressRepository;
  private getBookProgressService: GetBookProgressService;

  constructor({ bookProgressRepository }: GetBookProgressControllerProps) {
    this.bookProgressRepository = bookProgressRepository;
    this.getBookProgressService = new GetBookProgressService({
      bookProgressRepository: this.bookProgressRepository,
    });
  }

  public async handle(userID: number, bookID: number): Promise<BookProgress | void> {
    return await this.getBookProgressService.execute(userID, bookID);
  }
}
