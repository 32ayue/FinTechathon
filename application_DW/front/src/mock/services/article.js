import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const titles = [
  '实践部 | 考研分享沙龙',
  '实践部 | 声声不息配音大赛',
  '科创部 | 挑战杯等你来战',
  '留学协会 | 留学经验分享会',
  '人工智能协会 | 人工智能体验',
  '青协 | 亚运会志愿者培训',
  '文艺部 | 操舞大赛'
]

const avatar = [
  // 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
]

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png'
]

const owner = [
  '毛立晨',
  '李靓',
  '徐军军',
  '宝华',
  '冯李哲'
]

const content = '12345'
// const description = '大家快来报名吧！！！'
const description = [
  '大家快来报名吧！！！',
  '活动报名即将截止',
  '活动预计推迟三天举行，请同学互相转告',
  '由于场地正在装修，本活动转移至西操',
  '大家快来报名吧！！！',
  '活动报名即将截止',
  '活动预计推迟三天举行，请同学互相转告'
]
const href = '异常网址检测系统'

const updatedAt = [
  '2022-05-01 14:02:56',
  '2022-04-20 13:58:01',
  '2022-03-11 08:32:05',
  '2022-02-01 14:00:01',
  '2022-02-01 14:00:01',
  '2022-02-01 14:00:01',
  '2022-02-01 14:00:01'
]
const article = (options) => {
  const queryParameters = getQueryParameters(options)
  console.log('queryParameters', queryParameters)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 4
  }
  const data = []
  for (let i = 0; i < queryParameters.count; i++) {
    const tmpKey = i + 1
    // const num = parseInt(Math.random() * (4 + 1), 10)
    const num = i % 7
    data.push({
      id: tmpKey,
      avatar: avatar[num],
      owner: owner[num],
      content: content,
      star: Mock.mock('@integer(1, 999)'),
      percent: Mock.mock('@integer(1, 999)'),
      like: Mock.mock('@integer(1, 999)'),
      message: Mock.mock('@integer(1, 999)'),
      description: description[num],
      href: href,
      title: titles[ i % 8 ],
      // updatedAt: Mock.mock('@datetime'),
      updatedAt: updatedAt[num],
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3'
        }
      ],
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)]
    })
  }
  return builder(data)
}

Mock.mock(/\/list\/article/, 'get', article)
