
const formatNum = (val) => {
  return Number.parseFloat(val, 10).toFixed(0)
}

export const TABLE_CONF = [{
    type: 5,
    label: '入口(缓冲区)',
    areaVal1: '入口数',
    getAreaVal2: (item, data) => {
      return data.entrance
    }
  },
  {
    type: 2,
    label: '入室（即转即消）',
    areaVal1: '面积（m2）',
    getAreaVal2: (item, data) => {
      return formatNum(data.area)
    }
  },
  {
    type: 1,
    label: '涉疫楼栋（公共部位/区域）',
    areaVal1: '楼栋数/面积',
    getAreaVal2: (item, data) => {
      return `${data.buildingNum}/${formatNum(data.area)}`
    }
  },
  {
    type: 4,
    label: '无疫楼栋',
    areaVal1: '楼栋数/面积',
    getAreaVal2: (item, data) => {
      return `${data.buildingNum}/${formatNum(data.area)}`
    }
  },
  {
    type: 3,
    label: '公共区域',
    areaVal1: '面积（m2）',
    getAreaVal2: (item, data) => {
      return formatNum(data.area)
    }
  },
]

export const XIAODU_TPYE = {
  1: '终末消毒',
  2: '预防性消毒'
}


export const allVals = ['', '全部', 'all']

export const wuziList = [{
    label: '工作服',
    field: 'gongzuofu',
  },
  {
    label: '一次性帽子',
    field: 'yicixingmaozi',
  },
  {
    label: '医用防护口罩 ',
    field: 'yiyongfanghukouzhao',
  },
  {
    label: 'KN95/N95 ',
    field: 'kn95n95',
  },
  {
    label: '护目镜',
    field: 'humujing',
  },
  {
    label: '防护面屏',
    field: 'fanghumianping',
  },
  {
    label: '医用防护服',
    field: 'yiyongfanghufu',
  },
  {
    label: '一次性手套',
    field: 'yicixingshoutao',
  },
  {
    label: '一次性鞋套',
    field: 'yicixingxietao',
  },
  {
    label: '消毒剂',
    field: 'xiaoduji',
  },
  {
    label: '喷壶',
    field: 'penhu',
  },
  {
    label: '隔离衣',
    field: 'geliyi',
  },
]
