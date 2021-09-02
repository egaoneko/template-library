export interface BasePropsType {
  pathname?: string | null;
}

export interface ListResult<T> {
  count: number;
  list: T[];
}
