export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  details?: unknown;
}

export interface ListResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface ListQuery {
  page?: number;
  limit?: number;
}
