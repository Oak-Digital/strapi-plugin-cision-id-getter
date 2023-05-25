import qs from 'qs';
import { CisionNewsfeedResponse } from '../../types/cision';

export const getNewsFeed = async (newsFeedId: string | number, page: number = 1) => {
  const params = {
    pageIndex: page,
    format: 'json',
  }
  const url = `https://publish.ne.cision.com/papi/NewsFeed/${newsFeedId}?${qs.stringify(params)}`;

  const response = await fetch(url);
  const json: CisionNewsfeedResponse = await response.json();

  return json;
};
