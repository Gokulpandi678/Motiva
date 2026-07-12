import type { Difficulty, TicketStatus } from '../../common/enums';
import type { Faq, Tag, Ticket } from '../../common/types/models';

export interface TicketWithRelations extends Ticket {
  tags: Tag[];
  faq: Faq | null;
}

export interface TicketFilter {
  tag?: string;
  difficulty?: Difficulty;
  status?: TicketStatus;
}
