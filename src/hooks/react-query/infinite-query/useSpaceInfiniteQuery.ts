import { useInfiniteQuery } from '@tanstack/react-query';

import { infiniteQueryKeys } from './queryKeys';
import { UseInfiniteQuery } from './types';

import { APIError, getSpaces, Space } from '../../../apis/index';

interface UseSpacesInfiniteQueryParams {
  userToken: string | null;
}

interface UseSpaceInfiniteQuery extends UseInfiniteQuery {
  spaces: Space[] | undefined;
}

function useSpacesInfiniteQuery({
  userToken,
}: UseSpacesInfiniteQueryParams): UseSpaceInfiniteQuery {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    fetchPreviousPage,
    fetchNextPage,
  } = useInfiniteQuery(
    infiniteQueryKeys.space,
    async ({ pageParam }) => {
      try {
        if (!userToken) throw 'Token not exist';

        return await getSpaces(userToken, pageParam);
      } catch (error) {
        let errorMessage: string;

        if (error instanceof APIError) {
          errorMessage = error.issues.detail;
        } else {
          errorMessage = error as string;
        }

        console.error(errorMessage);
      }
    },
    {
      getNextPageParam: (lastSpace) => lastSpace?.cursor ?? undefined,
      /*
        FIXME

        previous page에 대한 cursor는 현재 getSpaces에서 데이터 포맷시 내려주지 않고있다.
        위 작업을 진행 후 새로 바꿀 예정
      */
      getPreviousPageParam: (lastSpace) => lastSpace?.cursor ?? undefined,
    }
  );

  return {
    spaces: data?.pages.flatMap((page) => (page ? page.spaces : [])),
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    fetchPreviousPage,
    fetchNextPage,
  };
}

export default useSpacesInfiniteQuery;
