import { useInfiniteQuery } from '@tanstack/react-query';

import { infiniteQueryKeys } from './queryKeys';
import { UseInfiniteQuery } from './types';

import { APIError, getAlarm, Alarm } from '../../../apis/index';

interface UseAlarmInfiniteQueryParams {
  userToken: string | null;
}

interface UseAlarmInfiniteQuery extends UseInfiniteQuery {
  alarms: Alarm[] | undefined;
}

function useAlarmInfiniteQuery({ userToken }: UseAlarmInfiniteQueryParams): UseAlarmInfiniteQuery {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    fetchPreviousPage,
    fetchNextPage,
  } = useInfiniteQuery(
    infiniteQueryKeys.alarm,
    async ({ pageParam }) => {
      try {
        if (!userToken) throw 'Token not exist';

        return await getAlarm(userToken, pageParam);
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
      getNextPageParam: (lastAlarm) => lastAlarm?.cursor ?? undefined,
      /*
        FIXME

        previous page에 대한 cursor는 현재 getSpaces에서 데이터 포맷시 내려주지 않고있다.
        위 작업을 진행 후 새로 바꿀 예정
      */
      getPreviousPageParam: (lastAlarm) => lastAlarm?.cursor ?? undefined,
    }
  );

  return {
    alarms: data?.pages.flatMap((page) => (page ? page.alarms : [])),
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    fetchPreviousPage,
    fetchNextPage,
  };
}

export default useAlarmInfiniteQuery;
