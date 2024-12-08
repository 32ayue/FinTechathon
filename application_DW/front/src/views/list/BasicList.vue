<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="12" :xs="24">
          <info title="待审核反馈" v-model="counts[0]" :bordered="true" />
        </a-col>
        <!-- <a-col :sm="8" :xs="24">
          <info title="待审核成果" v-model="counts[1]" :bordered="true" />
        </a-col> -->
        <a-col :sm="12" :xs="24">
          <info title="已审核申诉" v-model="counts[2]" />
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="审核列表">

      <div slot="extra">
        <a-radio-group v-model="status" @change="$refs.table.refresh()">
          <a-radio-button value="act">反馈审核</a-radio-button>
          <!-- <a-radio-button value="ach">成果</a-radio-button> -->
          <!-- <a-radio-button value="com">申诉</a-radio-button> -->
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" v-model="search" @search="$refs.table.refresh()" />
      </div>

      <!-- <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="add">添加</a-button>
      </div> -->

      <s-table
        ref="table"
        size="default"
        rowKey="ID"
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >

        <span v-if="status === 'act'" slot="clubName" slot-scope="text, item">
          {{ item.club.clubName }}
        </span>
        <!-- <span v-if="status === 'act'" slot="website" slot-scope="record">
          <a-tag v-for="(score, index) in record" :key="index">{{ score.name }}({{ score.score }}分)</a-tag>
        </span> -->
        <span v-if="status === 'act'" slot="website" slot-scope="text, item">
          {{ item.website }}
        </span>
        <span v-if="status === 'act'" slot="info" slot-scope="text, item">
          {{ item.info }}
        </span>
        <span v-if="status === 'act'" slot="fe_T" slot-scope="text, item">
          {{ item.fe_T }}
        </span>
        <span v-if="status === 'act'" slot="audit" slot-scope="text, item">
          {{ item.auditStatus === 1?'通过': (item.auditStatus === 0?'待审':'驳回') }}
        </span>

        <!-- <span v-if="status === 'ach'" slot="ach" slot-scope="ach">
          《{{ ach.name }}》 {{ ach.level }} {{ ach.time }}
        </span>
        <span v-if="status === 'com'" slot="com" slot-scope="com, record">
          学生{{ com.stuID }}申请由
          <a-tag>{{ record.act.scores.find(v => v.ID === com.scoreID_pre).name }}({{ record.act.scores.find(v => v.ID === com.scoreID_pre).score }}分)</a-tag>
          角色修改为
          <a-tag>{{ record.act.scores.find(v => v.ID === com.scoreID_new).name }}({{ record.act.scores.find(v => v.ID === com.scoreID_new).score }}分)</a-tag>
          ，原因是：{{ com.info }}
        </span> -->
        <!-- <span v-if="status !== 'act'" slot="act" slot-scope="act">
          {{ act.club.clubName }} {{ act.name }}
        </span> -->

        <span slot="action" slot-scope="text, record">
          <template v-if="status === 'act'">
            <a @click="info(record)">查看详情</a>
            <a-divider type="vertical" />
            <a @click="reso(record)" :disabled="record.auditStatus !== 0">通过</a>
            <a-divider type="vertical" />
            <a @click="reje(record)" :disabled="record.auditStatus !== 0">驳回</a>
          </template>
          <template v-if="status === 'ach'">
            <a @click="info1(record)">查看详情</a>
            <a-divider type="vertical" />
            <a @click="auditAch(record, 1)">通过</a>
            <a-divider type="vertical" />
            <a @click="auditAch(record, 2)">驳回</a>
          </template>
          <template v-if="status === 'com'">
            <a @click="info1(record)">查看详情</a>
            <a-divider type="vertical" />
            <a @click="auditCom(record, 1)">通过</a>
            <a-divider type="vertical" />
            <a @click="auditCom(record, 2)">驳回</a>
          </template>
        </span>

      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Info from './components/Info'
import { STable } from '@/components'
import { auditComplaint, auditAchievement } from '@/api/teacher'
import { searchFeedback, auditFeedback } from '@/api/club'

const columnsAct = [
  {
    title: '编号',
    dataIndex: 'ID',
    scopedSlots: { customRender: 'ID' }
  },
  {
    title: '用户名',
    dataIndex: 'clubName',
    scopedSlots: { customRender: 'clubName' }
  },
  {
    title: '反馈网址',
    dataIndex: 'website'
  },
  {
    title: '反馈信息',
    dataIndex: 'info',
    scopedSlots: { customRender: 'info' }
  },
  {
    title: '用户反馈时间',
    dataIndex: 'fe_T',
    scopedSlots: { customRender: 'fe_T' }
  },
  {
    title: '审核答复时间',
    dataIndex: 're_T'
  },
  // {
  //   title: '活动开始时间',
  //   dataIndex: 'T_start'
  // },
  // {
  //   title: '活动结束时间',
  //   dataIndex: 'T_end'
  // },
  // {
  //   title: '可报名人数',
  //   dataIndex: 'toll'
  // },
  // {
  //   title: '可参与学院',
  //   dataIndex: 'availCollege',
  //   scopedSlots: { customRender: 'Colleges' }
  // },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    scopedSlots: { customRender: 'audit' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]
const columnsACH = [
  {
    title: '成果信息',
    dataIndex: 'ach',
    scopedSlots: { customRender: 'ach' }
  },
  {
    title: '活动信息',
    dataIndex: 'act',
    scopedSlots: { customRender: 'act' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]
const columnsCom = [
  {
    title: '申诉信息',
    dataIndex: 'info',
    scopedSlots: { customRender: 'info' }
  },
  {
    title: '申诉网站',
    dataIndex: 'act',
    scopedSlots: { customRender: 'act' }
  },
  {
    title: '审核状态',
    dataIndex: 'act',
    scopedSlots: { customRender: 'act' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }]
const columnsAll = {
  'act': columnsAct,
  'ach': columnsACH,
  'com': columnsCom
 }

const dealData = (res) => {
  const data = {}
  for (var act in res.data) {
    data[res.data[act].ID] = {
      ID: res.data[act].ID,
      name: res.data[act].name,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      info: res.data[act].info,
      clubName: res.data[act].club.clubName,
      fe_T: res.data[act].fe_T,
      re_T: res.data[act].re_T,
      // enrollStart: res.data[act].enrollStart,
      // enrollEnd: res.data[act].enrollEnd,
      // toll: res.data[act].toll,
      // scores: res.data[act].scores,
      auditStatus: res.data[act].auditStatus,
      // tolled: res.data[act].enrolls.length,
      // progress: {
      //   value: Math.ceil(res.data[act].enrolls.length / res.data[act].toll * 100)
      // },
      raw: res.data[act]
    }
  }
  console.log('data name is 1', data[10].clubName)
  return data
}

export default {
  name: 'StandardList',
  components: {
    Info,
    STable
  },
  data () {
    return {
      data: null,
      status: 'act',
      search: '',
      columnsAll: columnsAll,
      columns: [],
      records: [],
      colleges: [],
      counts: ['0个', '0个', '0个'],
      loadData: parameter => {
        console.log('this.search', this.search)
        console.log('this.status', this.status)
        return searchFeedback().then(res => {
          const Data = {}
          console.log('res.data is', res)
          this.columns = columnsAll[this.status]
          // this.colleges = res.colleges
          this.record = dealData(res)
          this.counts[0] = String(res.data.filter(v => v.auditStatus === 0).length) + '个'
          this.counts[1] = 0
          // var ach = []
          this.counts[1] = 0
          // res.data.filter(v => v.achievements.length > 0).forEach(element => {
          //   element.achievements.forEach(e => {
          //     if (e.status === '0') this.counts[1] += 1
          //     if (e.status === '0') ach.push({ ach: e, act: element, ID: e.ID })
          //   })
          // })
          // this.counts[1] = String(this.counts[1]) + '个'
          // var com = []
          // this.counts[2] = 0
          // res.data.filter(v => v.complaints.length > 0).forEach(element => {
          //   element.complaints.forEach(e => {
          //     if (e.status === 0) this.counts[2] += 1
          //     if (e.status === 0) com.push({ com: e, act: element, ID: e.ID })
          //   })
          // })
          this.counts[2] = String(res.data.filter(v => v.auditStatus !== 0).length) + '个'
          Data['act'] = {
            data: res.data
            // pageNo: parameter.pageNo,
            // pageSize: parameter.pageSize,
            // totalCount: res.data.length || 0
          }
          // Data['ach'] = {
          //   data: ach,
          //   pageNo: parameter.pageNo,
          //   pageSize: parameter.pageSize,
          //   totalCount: ach.length || 0
          // }
          // Data['com'] = {
          //   data: com,
          //   pageNo: parameter.pageNo,
          //   pageSize: parameter.pageSize,
          //   totalCount: com.length || 0
          // }
          console.log('Data', Data)
          return Data[this.status]
        })
      }
    }
  },
  methods: {
    info (record) {
      console.log(record)
      this.$router.push({ path: '/profile/basic', query: { actID: record.ID, record: this.record[record.ID], stuList: [], classs: '详情' } })
    },
    info1 (record) {
      console.log(record)
      this.$router.push({ path: '/profile/basic', query: { actID: record.act.ID, record: this.record[record.act.ID], stuList: [], classs: '详情' } })
    },
    reso (record) {
      console.log('record is', record.ID)
      auditFeedback({ ID: record.ID, auditStatus: 1 }).then(res => {
        console.log(res)
        this.$refs.table.refresh()
        this.$message.success('审核完成')
      })
    },
    reje (record) {
      console.log('record is', record)
      auditFeedback({ ID: record.ID, auditStatus: 2 }).then(res => {
        console.log(res)
        this.$refs.table.refresh()
        this.$message.success('审核完成')
      })
    },
    auditAch (record, auditStatus) {
        console.log({ ID: record.ID, auditStatus: auditStatus })
      auditAchievement({ ID: record.ID, auditStatus: auditStatus }).then(res => {
        console.log(res)
        this.$refs.table.refresh()
        this.$message.success('审核完成')
      })
    },
    auditCom (record, auditStatus) {
      auditComplaint({ ID: record.ID, auditStatus: auditStatus }).then(res => {
        console.log(res)
        this.$refs.table.refresh()
        this.$message.success('审核完成')
      })
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
    margin-left: 40px;
    span {
        line-height: 20px;
    }
    p {
        margin-top: 4px;
        margin-bottom: 0;
        line-height: 22px;
    }
}
</style>
