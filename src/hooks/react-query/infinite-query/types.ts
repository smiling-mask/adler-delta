import { APIType } from '../types';

type QueryType = 'InfiniteQuery';

type DataType = 'space' | 'alarm';

type InfiniteQueryKeyType<DataType> = [APIType, QueryType, DataType];

export type InfiniteQueryKeys = Record<DataType, InfiniteQueryKeyType<DataType>>;

export interface UseInfiniteQuery {
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
  isLoading: boolean;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
}
