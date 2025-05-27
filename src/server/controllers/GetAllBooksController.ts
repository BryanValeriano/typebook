import Book from "../entities/Book";
import IBooksRepository from "../repositories/IBooksRepository";
import GetAllBooksService from "../useCases/getAllBoks/getAllBooksService";

type GetAllBooksControllerProps = {
  bookRepository: IBooksRepository;
};

export default class GetAllBooksController {
  private booksRepository: IBooksRepository;
  private getAllBooksService: GetAllBooksService;

  constructor({ bookRepository }: GetAllBooksControllerProps) {
    this.booksRepository = bookRepository;
    this.getAllBooksService = new GetAllBooksService({
      booksRepository: this.booksRepository,
    });
  }

  public async handle(): Promise<Book[]> {
    console.log("GetAllBooksController: handle called");
    return await this.getAllBooksService.execute();
  }
}
