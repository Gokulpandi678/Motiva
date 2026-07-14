import type { Faq } from '../common/types/models';
import { BadRequestError, NotFoundError } from '../common/errors';
import type { PaginationMeta } from '../http/response';
import { buildPaginationMeta, toSkip } from '../http/pagination';
import { ticketRepository } from '../repositories/ticket.repository';
import { faqRepository } from '../repositories/faq.repository';
import type { ListFaqsQuery, UpdateFaqInput } from '../validation/faq.validation';

class FaqService {
  async generateFromTicket(userId: string, ticketId: string): Promise<Faq> {
    const ticket = await ticketRepository.findById(userId, ticketId);
    if (!ticket) throw new NotFoundError(`Ticket ${ticketId} not found`);

    const resolution = ticket.resolution;
    if (!resolution?.trim()) {
      throw new BadRequestError('Add a resolution to this ticket before generating a FAQ');
    }

    const question = `How do you resolve: ${ticket.title}?`;
    const answer = resolution;

    return faqRepository.upsertForTicket(userId, ticket.id, question, answer);
  }

  async listFaqs(userId: string, query: ListFaqsQuery): Promise<{ faqs: Faq[]; meta: PaginationMeta }> {
    const filter = { search: query.search };
    const pagination = { page: query.page, limit: query.limit };

    const [faqs, total] = await Promise.all([
      faqRepository.findMany(userId, filter, toSkip(pagination), pagination.limit),
      faqRepository.count(userId, filter),
    ]);

    return { faqs, meta: buildPaginationMeta(total, pagination) };
  }

  async getFaqById(userId: string, id: string): Promise<Faq> {
    const faq = await faqRepository.findById(userId, id);
    if (!faq) throw new NotFoundError(`FAQ ${id} not found`);
    return faq;
  }

  async updateFaq(userId: string, id: string, input: UpdateFaqInput): Promise<Faq> {
    await this.getFaqById(userId, id);
    return faqRepository.update(userId, id, input);
  }

  async deleteFaq(userId: string, id: string): Promise<void> {
    await this.getFaqById(userId, id);
    await faqRepository.delete(userId, id);
  }
}

export const faqService = new FaqService();
