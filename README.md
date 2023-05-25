# Strapi plugin cision-id-getter

This plugin provides a custom field for getting the `EncryptedId` field of a release on cision based on the url.

The idea is to just save the id in a field on a content type and then some custom logic can be written to fetch the entire release either in strapi or the frontend.


## Custom field options

The custom field has a single option for the newsfeed id.
The newsfeed id is necessary, because the custom field can then fetch all releases in that newsfeed and find the one that has the same url as provided.
The newsfeed id is the one in the end of the newsfeed api url `https://publish.ne.cision.com/papi/NewsFeed/<ID>`

## Getting started

Install the plugin with your package manager

```bash
npm install @oak-digital/cision-id-getter
```

## Configuration

This plugin currently has no configuration options

## Contribution

If you find any bugs or have feature request, you are welcome to open an issue or a pull request.

## Publishing

```
npm version # patch | minor | major
npm run build
npm publish
```
