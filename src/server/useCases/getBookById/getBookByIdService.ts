import IBooksRepository from "@/server/repositories/IBooksRepository";

type Dependencies = {
  bookRepository: IBooksRepository;
};

export default class GetBookByIdService {
  private bookRepository: IBooksRepository;

  constructor({ bookRepository }: Dependencies) {
    this.bookRepository = bookRepository;
  }

  public async execute(bookId: string) {
    const book = await this.bookRepository.getBookById(bookId);
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    return book;
  }
}
