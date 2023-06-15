import { useMemo, useState } from "react";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import pluginId from "../../pluginId";
import { getNewsFeed } from "../cision/newsfeed";

export const useNewsfeed = (
  newsfeedId: string | number,
  options: UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getNewsFeed>>,
    unknown,
    Awaited<ReturnType<typeof getNewsFeed>>
  > = {}
) => {
  return useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) => {
      return await getNewsFeed(newsfeedId, pageParam);
    },
    queryKey: [pluginId, "newsfeed"],
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.Releases.length < 50) {
        return undefined;
      }

      return pages.length + 1;
    },
    ...options,
  });
};

type IdState =
  | { valid: false }
  | {
    valid: true;
    found: false;
    isLoading: boolean;
  }
  | {
    valid: true;
    found: true;
    isLoading: boolean;
    id: string | number;
  };

export const useIdFromUrl = (url: string, newsfeedId: string): IdState => {
  // validate url
  let valid = true;
  try {
    new URL(url);
  } catch (err) {
    valid = false;
  }

  const { data, isLoading, hasNextPage, fetchNextPage } = useNewsfeed(
    newsfeedId,
    {
      enabled: valid,
    }
  );

  const id = useMemo<number | string | null>(() => {
    // find the specific release
    if (!valid) {
      return null;
    }
    if (!data) {
      return null;
    }

    for (let i = 0; i < data.pages.length; i++) {
      const page = data.pages[i];
      for (let j = 0; j < page.Releases.length; j++) {
        const release = page.Releases[j];
        if (release.CisionWireUrl === url) {
          return release.EncryptedId;
        }
      }
    }
    return null;
  }, [url, data, valid]);

  return useMemo(() => {
    if (!valid) {
      return { valid: false };
    }

    if (id === null) {
      if (isLoading) {
        return { valid: true, found: false, isLoading: true };
      }
      if (!hasNextPage) {
        return { valid: true, found: false, isLoading: false };
      }
      fetchNextPage();
      return { valid: true, found: false, isLoading: true };
    }

    return { valid: true, found: true, isLoading: false, id: id };
  }, [valid, id, isLoading, hasNextPage, fetchNextPage]);
};
