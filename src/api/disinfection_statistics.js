import request from '@/utils/request'
import {baseUrl} from './const'
import moment from 'moment';

/**
 * 街道列表
 * @param {*} params: {}
 * @returns
 */
export function getStreetList(params) {
  return request({
    url: `${baseUrl}/volunteer/user/getStreetList`,
    method: 'get',
    params
  })
}

/**
 * 居委会列表
 * @param {*} params: {street}
 * @returns
 */
export function getNeighborhoodList(params) {
  return request({
    url: `${baseUrl}/volunteer/user/getNeighborhoodList`,
    method: 'get',
    params
  })
}

/**
 * 社区列表
 * @param {*} params: {street}
 * @returns
 */
 export function getCommunityList(params) {
  return request({
    url: `${baseUrl}/volunteer/user/getCommunityList`,
    method: 'get',
    params
  })
}

function formatStatsParam(params) {
  const {date, ...others} = params;
  let [startTime, endTime] = date || [];
  startTime = startTime ? moment(startTime).format('YYYY-MM-DD') : '';
  endTime = endTime ? moment(endTime).format('YYYY-MM-DD') : '';
  return {
    ...others,
    startTime,
    endTime,
    _timeStamp: new Date().getTime()
  }
}

/**
 * 统计数据
 * @param {*} params: {street, neighborhood, startTime, endTime}
 * @returns
 */
export function getStatisticsData(params) {
  return request({
    url: `${baseUrl}/volunteer/user/pcStatistic`,
    method: 'get',
    params: formatStatsParam(params)
  })
}


export const downloadUrl = `${baseUrl}/volunteer/user/pcStatisticExport`

//
export function getDowloadFileName(params) {
  return request({
    url: downloadUrl,
    method: 'get',
    params: formatStatsParam(params)
  })
}

export const downloadFileUrl = `${baseUrl}/common/download`;

// 文件下载地址
export function getDowloadFileUrl({fileName}) {
  return `${downloadFileUrl}?fileName=${encodeURI(fileName)}&delete=true`
}
