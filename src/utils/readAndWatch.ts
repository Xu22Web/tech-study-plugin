import { getNewsList, getVideoList } from '../api/data';
import { NewsVideoList } from '../types';
import { log } from './log';

/**
 * @description 获取新闻列表
 * @param need
 */
async function getNews(need: number) {
  log(`剩余 ${need} 个新闻`);
  // 文章
  const news: NewsVideoList = [];
  // 获取新闻
  const data = await getNewsList();
  if (data && data.length) {
    // 最新新闻
    const latestItems = data.slice(0, 100);
    // 当前年份
    const currentYear = new Date().getFullYear().toString();
    // 查找今年新闻
    while (news.length < need) {
      const randomIndex = ~~(Math.random() * latestItems.length);
      // 新闻
      const item = latestItems[randomIndex];
      // 是否存在
      if (item.publishTime.startsWith(currentYear) && item.type === 'tuwen') {
        news.push(item);
      }
    }
  }
  return news;
}

/**
 * @description 获取视频列表
 */
async function getVideos(need: number) {
  log(`剩余 ${need} 个视频`);
  // 视频
  const videos: NewsVideoList = [];
  // 获取视频
  const data = await getVideoList();
  if (data && data.length) {
    // 最新视频
    const latestItems = data.slice(0, 100);
    // 当前年份
    const currentYear = new Date().getFullYear().toString();
    // 查找今年视频
    while (videos.length < need) {
      const randomIndex = ~~(Math.random() * latestItems.length);
      // 新闻
      const item = latestItems[randomIndex];
      // 是否存在
      if (
        item.publishTime.startsWith(currentYear) &&
        (item.type === 'shipin' || item.type === 'juji')
      ) {
        videos.push(item);
      }
    }
  }
  return videos;
}

export { getNews, getVideos };
