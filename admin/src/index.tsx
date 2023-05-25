import React from "react";
import { prefixPluginTranslations } from "@strapi/helper-plugin";

import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    console.log("registering plugin");
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "[request]" */ "./pages/App"
        );

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.customFields.register({
      pluginId: "cision-id-getter",
      name: "cisionUrlToId",
      type: "string",
      intlLabel: {
        id: "cision-id-getter.fields.cisionUrlToId",
        defaultMessage: "Cision URL to ID",
      },
      intlDescription: {
        id: "cision-id-getter.fields.cisionUrlToId.description",
        defaultMessage: "Input the url to a cision article to get the id",
      },
      components: {
        Input: async () => {
          console.log("starting to load component");
          const component = await import(
            /* webpackChunkName: "cision-link-input-component" */ "./components/CisionLinkInput"
          );
          console.log("component loaded");
          return component;
        },
      },
      options: {
        base: [
          {
            name: "options.newsFeedId",
            type: "string",
            intlLabel: {
              id: "cision-id-getter.fields.newsFeedId",
              defaultMessage: "News Feed ID",
            },
            description:
              "The ID of the news feed to get articles from (https://publish.ne.cision.com/papi/NewsFeed/<ID>)",
          },
        ],
      },
    });

    app.registerPlugin(plugin);

    console.log(app.customFields);
  },

  bootstrap(app: any) { },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
