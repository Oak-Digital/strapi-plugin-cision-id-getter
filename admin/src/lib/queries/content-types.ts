import { useQuery, UseQueryOptions } from "react-query";
import pluginId from "../../pluginId";
import { getContentTypes } from "../strapi-api/content-types";

export const useContentTypes = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getContentTypes>>,
    unknown,
    Awaited<ReturnType<typeof getContentTypes>>
  >
) => {
  return useQuery<
    Awaited<ReturnType<typeof getContentTypes>>,
    unknown,
    Awaited<ReturnType<typeof getContentTypes>>
  >(
    [pluginId, "content-types"],
    async () => {
      return await getContentTypes();
    },
    {
      staleTime: Infinity,
      ...options,
    }
  );
};

export const useVisibleContentTypes = (
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getContentTypes>>,
    unknown,
    Awaited<ReturnType<typeof getContentTypes>>
  >
) => {
  return useContentTypes({
    ...options,
    select: (data) => {
      return data.filter((contentType) => contentType.schema.visible);
    },
  });
};
