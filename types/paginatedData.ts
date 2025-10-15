export type IPaginatedData<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
  };
  total: number;
};
