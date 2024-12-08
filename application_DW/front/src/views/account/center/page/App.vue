<template>
  <div class="app-list">
    <a-list
      :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }"
      :dataSource="dataSource">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :hoverable="true">
          <a-card-meta>
            <div style="margin-bottom: 3px" slot="title">{{ item.title }}</div>
            <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="small"/>
            <div class="meta-cardInfo" slot="description">
              <div>
                <p>活动得分</p>
                <p>
                  <span>0.1</span>
                </p>
              </div>
              <div>
                <p>报名人数</p>
                <p>{{ item.newUser | NumberFormat }}</p>
              </div>
            </div>
          </a-card-meta>
          <template class="ant-card-actions" slot="actions">
            <a>
              <a-icon type="download"/>
            </a>
            <a>
              <a-icon type="edit"/>
            </a>
            <a>
              <a-icon type="share-alt"/>
            </a>
            <a>
              <a-dropdown>
                <a class="ant-dropdown-link" href="javascript:;">
                  <a-icon type="ellipsis"/>
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;">修改报名信息</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">取消报名</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;">分享活动</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a>
          </template>
        </a-card>
      </a-list-item>
    </a-list>

  </div>
</template>

<script>
import Mock from 'mockjs2'
const dataSource = []
const titles = [
  '考研分享沙龙',
  '声声不息配音大赛',
  '挑战杯等你来战',
  '留学经验分享会',
  '人工智能体验',
  '亚运会志愿者培训',
  '操舞大赛'
]
for (let i = 0; i < 7; i++) {
  dataSource.push({
    title: titles[i],
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    activeUser: Mock.mock('@integer(1, 99)'),
    newUser: Mock.mock('@integer(1, 2000)')
  })
}

export default {
  name: 'Article',
  components: {},
  data () {
    return {
      dataSource
    }
  }
}
</script>

<style lang="less" scoped>

  .app-list {

    .meta-cardInfo {
      zoom: 1;
      margin-top: 16px;

      > div {
        position: relative;
        text-align: left;
        float: left;
        width: 50%;

        p {
          line-height: 32px;
          font-size: 24px;
          margin: 0;

          &:first-child {
            color: rgba(0, 0, 0, .45);
            font-size: 12px;
            line-height: 20px;
            margin-bottom: 4px;
          }
        }

      }
    }
  }

</style>
