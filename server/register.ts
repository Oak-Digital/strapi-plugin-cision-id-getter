import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    plugin: 'cision-id-getter',
    name: 'cisionUrlToId',
    type: 'string',
  });
};
