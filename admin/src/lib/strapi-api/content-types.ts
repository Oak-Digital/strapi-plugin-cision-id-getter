import { request } from "@strapi/helper-plugin";

export const getContentTypes = async () => {
  const response = await request("/content-type-builder/content-types", {
    method: "GET",
  });

  return response.data as Array<{
    apiId: string;
    uid: string;
    schema: {
      attributes: {
        [key: string]: {
          type: string;
          required?: boolean;
        };
      };
      collectionName: string;
      displayName: string;
      visible: boolean;
      // ...
    };
  }>;
};
