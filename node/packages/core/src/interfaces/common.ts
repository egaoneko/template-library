export interface BasePropsType {
  pathname?: string | null;
}

export interface ListResult<T> {
  nextCursor?: number;
  count?: number;
  list: T[];
}
