import qs from 'qs';
import { CisionNewsfeedResponse } from '../../types/cision';

export const getNewsFeed = async (newsFeedId: string | number, page: number = 1) => {
  const params = {
    pageIndex: page,
    format: 'json',
  }
  const url = `https://publish.ne.cision.com/papi/NewsFeed/${newsFeedId}?${qs.stringify(params)}`;

  const response = await fetch(url);
  const json: CisionNewsfeedResponse | { Message: string } = await response.json();

  if ('Message' in json) {
    throw new Error(json.Message);
  }

  return json;
};
