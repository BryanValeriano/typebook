import Book from "@/server/entities/Book";
import IBooksRepository from "@/server/repositories/IBooksRepository";

type Dependencies = {
  booksRepository: IBooksRepository;
};

export default class GetBookByIdService {
  private booksRepository: IBooksRepository;

  constructor({ booksRepository }: Dependencies) {
    this.booksRepository = booksRepository;
  }

  public async execute(bookId: string): Promise<Book | void> {
    const book = await this.booksRepository.getBookById(bookId);
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    return book;
  }
}
