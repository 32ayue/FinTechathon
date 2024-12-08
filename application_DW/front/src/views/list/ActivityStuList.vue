<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <info title="已获得学分 / 未获得学分" v-model="gotscore" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="已报名待参加活动" v-model="enrolled" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="已成功参与活动" v-model="actJoined" /> <!--  value="24个" -->
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="活动">

      <div slot="extra">
        <a-radio-group v-model="status" @change="changeRecomm">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="recomm">自动推荐</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" @search="search" placeholder="搜索活动名称或内容" />
      </div>

      <!-- <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="add">添加</a-button>
      </div> -->

      <a-list size="large" :pagination="{showSizeChanger: false, showQuickJumper: true, pageSize: pageSize, total: data.length, onChange: changePage}">
        <a-list-item :key="index" v-for="(item, index) in data.slice(pageNum*pageSize, pageNum*pageSize+pageSize)">
          <a-list-item-meta :description="item.joined?'已以' + item.joinedScore.name + '角色参加':item.description.substring(0,10)+'...'">
            <!-- .substring(0,10)+'...' 省略后面的字 -->
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title" @click="info(item)">{{ item.title }}</a>
            <!-- <a v-if="item.joined">{{ '已以' + item.joinedScore.name + '角色参加' }}</a> -->
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)" :disabled="item.enrolled">{{ item.joined?'已参加':(item.enrolled?'已报名':'报名') }}</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a @click="infoFull(item)">查看详情</a></a-menu-item>
                <a-menu-item><a @click="undo(item)" :disabled="!((item.enrolled) && (!item.joined))">取消报名</a></a-menu-item>
                <a-menu-item><a @click="comp(item)" :disabled="!item.enrolled">活动申诉</a></a-menu-item>
                <a-menu-item><a @click="rate(item)" :disabled="!item.joined">活动评分</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>举办方</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>活动开始时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <span>活动结束时间</span>
              <p>{{ item.endAt }}</p>
            </div>
            <div class="list-content-item">
              <span>报名开始时间</span>
              <p>{{ item.enrollStart }}</p>
            </div>
            <div class="list-content-item">
              <span>报名结束时间</span>
              <p>{{ item.enrollEnd }}</p>
            </div>
            <div class="list-content-item">
              <span>可报名人数</span>
              <p>{{ item.toll }}</p>
            </div>
            <div class="list-content-item">
              <span>报名情况</span>
              <p v-if="!item.enrolled"><a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 100px" /></p>
              <p v-if="item.enrolled" style="color: rgba(0, 0, 0, 0.8)">{{ item.joinedScore.name }}({{ item.joinedScore.score }}分)</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import { searchActivity, unenrollActivity, getRecommendation, searchTotalScore, addClick } from '@/api/stud'
import TaskForm from './modules/TaskForm'
import EnrollForm from './modules/EnrollForm'
import CompForm from './modules/CompForm'
import RatingForm from './modules/RatingForm'
import InfoAct from './components/InfoAct'
import Info from './components/Info'
import storage from 'store'

function allActivity (value) {
  const data = []
  searchActivity({ word: value }).then(res => {
    for (var act in res.data) {
      // console.log(res.data[act].scores.find(v => v.ID === (res.data[act].enrolls.find(v => v.stuID === storage.get('ID')) || { scoreID: null }).scoreID) || { ID: 0, actID: 0, name: '', score: 0 })
      data.push({
        ID: res.data[act].ID,
        title: res.data[act].name,
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        description: res.data[act].info,
        owner: res.data[act].club.clubName,
        startAt: res.data[act].T_start,
        endAt: res.data[act].T_end,
        enrollStart: res.data[act].enrollStart,
        enrollEnd: res.data[act].enrollEnd,
        toll: res.data[act].toll,
        scores: res.data[act].scores,
        progress: {
          value: Math.ceil(res.data[act].enrolls.length / res.data[act].toll * 100)
        },
        enrolled: false,
        joined: false,
        raw: res.data[act],
        joinedScore: res.data[act].scores.find(v => v.ID === (res.data[act].enrolls.find(v => v.stuID === storage.get('ID')) || { scoreID: null }).scoreID) || { ID: 0, actID: 0, name: '', score: 0 }
      })
    }
  })
  return data
}
const data = allActivity()

function getTotalScore (t) { // 解决异步调用问题！！！！先声明，后更新值，所以要将this传过来
  searchTotalScore().then(res => {
    t.gotscore = String(res.data.score.toFixed(2)) + ' / ' + String((3 - res.data.score).toFixed(2))
    t.enrolledActID = res.data.enrolled
    t.enrolled = String(res.data.enrolled.length) + '个'
    t.actJoined = String(res.data.len) + '个'
    for (const i in t.data) {
      if (t.enrolledActID.find((value) => { return value === t.data[i].ID })) {
        t.data[i].enrolled = true
      }
      if (res.data.joined.find((value) => { return value === t.data[i].ID })) {
        t.data[i].enrolled = true
        t.data[i].joined = true
      }
    }
  })
}

export default {
  name: 'ActivityStuList',
  components: {
    EnrollForm,
    TaskForm,
    CompForm,
    RatingForm,
    Info,
    InfoAct
  },
  data () {
    getTotalScore(this)
    return {
      data,
      status: 'all',
      pageSize: 6,
      pageNum: 0,
      gotscore: '',
      enrolled: '',
      actJoined: '个',
      enrolledActID: []
    }
  },
  methods: {
    changePage (pageNum) {
      this.pageNum = pageNum - 1
    },
    // add () {
    //   this.$dialog(TaskForm,
    //     // component props
    //     {
    //       record: {},
    //       on: {
    //         ok: () => {
    //           console.log('ok 回调')
    //         },
    //         cancel () {
    //           console.log('cancel 回调')
    //         },
    //         close () {
    //           console.log('modal close 回调')
    //         }
    //       }
    //     },
    //     // modal props
    //     {
    //       title: '新增',
    //       width: 700,
    //       centered: true,
    //       maskClosable: false
    //     })
    // },
    edit (record) {
      console.log('record', record)
      this.$dialog(EnrollForm,
        // component props
        {
          record,
          on: {
            ok () {
              console.log('ok 回调')
              // enrollActivity({actID:record.ID, })
              record.enrolled = true
              // getTotalScore(this)
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '报名',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    info (record) {
      console.log('record', record)
      addClick({ actID: record.ID })
      this.$dialog(InfoAct,
        // component props
        {
          title: record.title,
          value: record.description,
          bordered: false
        },
        // modal props
        {
          title: '详情',
          width: 700,
          centered: true,
          maskClosable: false,
          footer: null
        })
    },
    comp (record) {
      this.$dialog(CompForm,
        // component props
        {
          record,
          on: {
            ok: () => {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '申诉',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    rate (record) {
      this.$dialog(RatingForm,
        // component props
        {
          record,
          on: {
            ok: () => {
              console.log('ok 回调')
            },
            cancel () {
              console.log('cancel 回调')
            },
            close () {
              console.log('modal close 回调')
            }
          }
        },
        // modal props
        {
          title: '活动评分',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    undo (record) {
      unenrollActivity({ actID: record.ID }).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.data)
          this.$notification.success({
            message: res.data,
            description: res.data
          })
          record.enrolled = false
        } else {
          this.$message.error(res.data)
          this.$notification.error({
            message: res.data,
            description: res.message
          })
        }
      })
    },
    search (value) {
      console.log(value)
      if (this.status === 'all') {
        this.data = allActivity(value)
      } else {
        const data = this.data
        const newData = []
        getRecommendation().then((recommendations) => {
          console.log(recommendations.data)
          for (var i in recommendations.data) {
            for (var j in data) {
              if (data[j].ID === recommendations.data[i][0]) { newData.push(data[j]) }
            }
          }
        })
        this.data = newData
      }
      getTotalScore(this)
      // const data = []
      // searchActivity({ word: value }).then(res => {
      //   // console.log('Activity', res.data)
      //   for (var act in res.data) {
      //     console.log('Activity', act)
      //     data.push({
      //       ID: res.data[act].ID,
      //       title: res.data[act].name,
      //       avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      //       description: res.data[act].info,
      //       owner: res.data[act].club.clubName,
      //       startAt: res.data[act].T_start,
      //       endAt: res.data[act].T_end,
      //       enrollStart: res.data[act].enrollStart,
      //       enrollEnd: res.data[act].enrollEnd,
      //       toll: res.data[act].toll,
      //       scores: res.data[act].scores,
      //       progress: {
      //         value: Math.ceil(res.data[act].enrolls.length / res.data[act].toll * 100)
      //       }
      //     })
      //   }
      // })
      // this.data = data
    },
    changeRecomm () {
      this.pageNum = 0
      if (this.status === 'all') {
        this.data = allActivity()
      } else {
        const data = this.data
        const newData = []
        getRecommendation().then((recommendations) => {
          console.log(recommendations.data)
          for (var i in recommendations.data) {
            for (var j in data) {
              if (data[j].ID === recommendations.data[i][0]) { newData.push(data[j]) }
            }
          }
        })
        this.data = newData
      }
      getTotalScore(this)
    },
    infoFull (record) {
      addClick({ actID: record.ID })
      console.log('record', record)
      record.auditStatus = record.raw.auditStatus
      this.$router.push({ path: '/profile/basic', query: { actID: record.ID, record: record, stuList: [], classs: '详情' } })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
}

.list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 20px;
    span {
        width: 100%;
        line-height: 20px;
        text-align:center;
        display: inline-block;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
        text-align:center;
    }
    ant-progress-text {
    display: inline-block;
    /* width: 2em; */
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 1em;
    line-height: 1;
    white-space: nowrap;
    text-align: left;
    vertical-align: middle;
    word-break: normal;
}
}
</style>
