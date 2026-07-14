export interface Faq {
  id: string;
  question: string;
  answer: string;
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateFaqInput {
  question?: string;
  answer?: string;
}

export interface FaqListQuery {
  page?: number;
  limit?: number;
  search?: string;
}
