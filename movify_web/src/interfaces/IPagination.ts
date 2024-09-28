export interface IPagination<T> {
    list: T[];
    totalResults: number;
    page: number;
}