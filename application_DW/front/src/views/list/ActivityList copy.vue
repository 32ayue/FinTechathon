<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <info title="待核实的反馈" v-model="audit[0]" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="通过审核的反馈" v-model="audit[1]" :bordered="true" />
        </a-col>
        <a-col :sm="8" :xs="24">
          <info title="被驳回的反馈" v-model="audit[2]" /> <!--  value="24个"  v-model="actJoined" -->
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="活动">

      <div slot="extra">
        <!-- <a-radio-group v-model="status" @change="changeRecomm">
          <a-radio-button value="all">全部</a-radio-button>
          <a-radio-button value="recomm">自动推荐</a-radio-button>
        </a-radio-group> -->
        <a-button type="primary" icon="plus" @click="add">添加</a-button>
        <a-input-search style="margin-left: 16px; width: 272px;" @search="search" placeholder="搜索活动名称或内容" />
      </div>

      <!-- <div class="operate">
      </div> -->

      <a-list size="large" :pagination="{showSizeChanger: false, showQuickJumper: true, pageSize: pageSize, total: data.length, onChange: changePage}">
        <a-list-item :key="index" v-for="(item, index) in data.slice(pageNum*pageSize, pageNum*pageSize+pageSize)">
          <a-list-item-meta :description="item.info.substring(0,10)+'...'">
            <!-- .substring(0,10)+'...' 省略后面的字 -->
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title" @click="info(item)">{{ item.name }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)" :disabled="item.auditStatus===1">修改</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a @click="infoFull(item)">查看详情</a></a-menu-item>
                <a-menu-item><a @click="dele(item)" :disabled="item.auditStatus === 1">删除活动</a></a-menu-item>
                <a-menu-item><a @click="achi(item)" :disabled="item.auditStatus !== 1">导入成果</a></a-menu-item>
                <a-menu-item><a @click="siin(item)" :disabled="item.auditStatus !== 1">活动签到</a></a-menu-item>
                <a-menu-item><a @click="siot(item)" :disabled="item.auditStatus !== 1">活动签退</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>审核状态</span>
              <!-- a-badge :status= Enum{ 'success', 'processing, 'default', 'error', 'warning' } -->
              <p><a-badge :status="item.auditStatus === 1?'success':(item.auditStatus === 0?'processing':'error')" :text="item.auditStatus === 1?'通过': (item.auditStatus === 0?'待审':'驳回')"/></p>
            </div>
            <div class="list-content-item">
              <span>反馈时间</span>
              <p>{{ item.T_start }}</p>
            </div>
            <!-- <div class="list-content-item">
              <span>活动结束时间</span>
              <p>{{ item.T_end }}</p>
            </div>
            <div class="list-content-item">
              <span>报名开始时间</span>
              <p>{{ item.enrollStart }}</p>
            </div>
            <div class="list-content-item">
              <span>报名结束时间</span>
              <p>{{ item.enrollEnd }}</p>
            </div> -->
            <div class="list-content-item">
              <span>可报名人数</span>
              <p>{{ item.toll }}</p>
            </div>
            <div class="list-content-item">
              <span>报名情况</span>
              <p><a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 100px" /></p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import { searchActivity, removeActivity } from '@/api/club'
import TaskForm from './modules/TaskForm'
import EnrollForm from './modules/EnrollForm'
import CompForm from './modules/CompForm'
import RatingForm from './modules/RatingForm'
import Info from './components/Info'
import InfoAct from './components/InfoAct'
import AchieveForm from './modules/AchieveForm'
import SignForm from './modules/SignForm'

function allActivity (word) {
  const data = []
  searchActivity({ word: word || '' }).then(res => {
    console.log(res)
    for (var act in res.data) {
      data.push({
        ID: res.data[act].ID,
        name: res.data[act].name,
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        info: res.data[act].info,
        clubName: res.data[act].club.clubName,
        T_start: res.data[act].T_start,
        T_end: res.data[act].T_end,
        enrollStart: res.data[act].enrollStart,
        enrollEnd: res.data[act].enrollEnd,
        toll: res.data[act].toll,
        scores: res.data[act].scores,
        auditStatus: res.data[act].auditStatus,
        tolled: res.data[act].enrolls.length,
        progress: {
          value: Math.ceil(res.data[act].enrolls.length / res.data[act].toll * 100)
        },
        raw: res.data[act]
      })
    }
  })
  return data
}
const data = allActivity()

function grtAudit (t) {
  t.data = allActivity(t.searchValue)
  searchActivity().then(res => {
    t.audit = res.audit
  })
}

export default {
  name: 'ActivityList',
  components: {
    EnrollForm,
    TaskForm,
    CompForm,
    RatingForm,
    Info,
    InfoAct,
    AchieveForm,
    SignForm
  },
  data () {
    grtAudit(this)
    return {
      data: data,
      pageSize: 6,
      pageNum: 0,
      searchValue: '',
      audit: ['0', '0', '0']
    }
  },
  methods: {
    changePage (pageNum) {
      this.pageNum = pageNum - 1
    },
    add () {
      const _t = this
      this.$dialog(TaskForm,
        // component props
        {
          record: null,
          on: {
            ok: () => {
              console.log('ok 回调')
              setTimeout(() => { grtAudit(_t) }, 300)
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
          title: '新增',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    edit (record) {
      const _t = this
      this.$dialog(TaskForm,
        // component props
        {
          record,
          on: {
            ok: () => {
              console.log('ok 回调')
              // 延时刷新数据！！！！
              setTimeout(() => { grtAudit(_t) }, 500)
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
          title: '修改',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    info (record) {
      console.log('record', record)
      this.$dialog(InfoAct,
        // component props
        {
          title: record.name,
          value: record.info,
          bordered: false,
          on: {
            ok: () => {
              this.$router.push({ path: '/profile/basic', query: { actID: record.ID, record: record, stuList: [], classs: '详情' } })
            }
          }
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
    search (value) {
      console.log(value)
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
      this.searchValue = value
      this.data = allActivity(value)
    },
    dele (item) {
      this.$dialog(InfoAct,
        // component props
        {
          title: '是 否 删 除 ？',
          value: '请确认是否完全删除活动“' + item.name + '”。',
          bordered: false,
          on: {
            ok: () => {
              console.log('ok 回调')
              // 延时刷新数据！！！！
              // setTimeout(() => { this.data = allActivity(this.searchValue); grtAudit(this) }, 500)
              removeActivity({ actID: item.ID }).then(() => {
                this.$notification.success({
                  message: '删除成功',
                  description: '活动删除成功！'
                })
                this.data = allActivity(this.searchValue)
                grtAudit(this)
              })
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
          title: '删除活动',
          width: 300,
          centered: true,
          maskClosable: false
        })
    },
    achi (record) {
      this.$dialog(AchieveForm,
        // component props
        {
          record,
          on: {
            ok: () => {
              console.log('ok 回调')
              // 延时刷新数据！！！！
              // setTimeout(() => { this.data = allActivity(this.searchValue); grtAudit(this) }, 500)
                this.$notification.success({
                  message: '新增成功',
                  description: '活动成果导入成功！'
                })
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
          title: '详情',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    siin (record) {
      this.$dialog(SignForm,
        // component props
        {
          record,
          classs: '签到'
        },
        // modal props
        {
          title: '签到',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    siot (record) {
      this.$dialog(SignForm,
        // component props
        {
          record,
          classs: '签退'
        },
        // modal props
        {
          title: '签退',
          width: 700,
          centered: true,
          maskClosable: false
        })
    },
    infoFull (record) {
      console.log('record', record)
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
}
</style>
