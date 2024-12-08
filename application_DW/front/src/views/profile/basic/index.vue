<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-descriptions title="活动信息">
        <a-descriptions-item label="活动ID">{{ record.ID }}</a-descriptions-item>
        <a-descriptions-item label="活动名称">{{ record.name || record.title }}</a-descriptions-item>
        <a-descriptions-item label="活动负责社团">{{ record.clubName || record.raw.club.clubName }}</a-descriptions-item>
        <a-descriptions-item label="审核状态"><a-badge :status="record.auditStatus === 1?'success':(record.auditStatus === 0?'processing':'error')" :text="record.auditStatus === 1?'通过': (record.auditStatus === 0?'待审':'驳回')"/></a-descriptions-item>
        <a-descriptions-item label="活动开始时间">{{ record.T_start || record.startAt }}</a-descriptions-item>
        <a-descriptions-item label="活动结束时间">{{ record.T_end || record.endAt }}</a-descriptions-item>
        <a-descriptions-item label="报名情况">已报名 {{ record.tolled || String(0) }} / 可报名 {{ record.toll }}</a-descriptions-item>
        <a-descriptions-item label="报名开始时间">{{ record.enrollStart }}</a-descriptions-item>
        <a-descriptions-item label="报名结束时间">{{ record.enrollEnd }}</a-descriptions-item>
        <a-descriptions-item label="活动简介">{{ record.info || record.description }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions title="活动角色">
        <a-descriptions-item v-for="score in record.scores" :key="score.ID">{{ score.name }}({{ score.score }}分)</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions title="活动成果" v-if="achievements.length > 0">
        <a-descriptions-item v-for="achievement in achievements" :key="achievement.ID">
          <div style="display: flex">
            <div style="folat: left; width: 60%">
              <p style="font-weight: bold; color: rgb(0, 0, 0)">{{ achievement.name }}</p>
              <p style="margin-left: 20px">成果等级：{{ achievement.level }}</p>
              <p style="margin-left: 20px">导入时间：{{ achievement.time }}</p>
              <p style="margin-left: 20px">审核情况：{{ achievement.status === 0 ? '成果待审核' : '已通过审核' }}</p>
              <p style="margin-left: 20px;">成果详情：</p>
              <!-- <p style="margin-left: 20px; text-indent:2em" v-for="(ach,index) in achievement.info.split('\n')" :key="index">{{ ach }}</p> -->
              <p style="margin-left: 20px; text-indent:2em">{{ achievement.info.split('\n')[0] }}</p>
            </div>
            <div style="folat: right; width: 40%;margin-left: 10px">
              <img :src="'http://localhost:7100/' + achievement.file" style="height: auto; width: auto; max-width: 100%; max-height: 100%;">
            </div>
          </div>
          <p style="margin-left: 20px; text-indent:2em" v-for="(ach,index) in achievement.info.split('\n').slice(1)" :key="index">{{ ach }}</p>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px" v-if="achievements.length > 0"/>

      <div class="title">已报名学生</div>
      <s-table
        style="margin-bottom: 24px"
        row-key="stuID"
        :columns="stuListColumns"
        :data="stuList">
      </s-table>
      <a-divider style="margin-bottom: 32px" v-if="classs !== '详情'"/>
      <div class="title" v-if="classs !== '详情'">待{{ classs }}学生</div>
      <s-table
        v-if="classs !== '详情'"
        style="margin-bottom: 24px"
        row-key="学号"
        :columns="astuListColumns"
        :data="astuList">
      </s-table>
      <a-button
        v-if="classs !== '详情'"
        type="primary"
        style="width: 100%"
        icon="check"
        @click="check"
        :disabled="checked || stuWait.length === 0">
        确认{{ classs }}
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable } from '@/components'
import { sign } from '@/api/club'

export default {
  components: {
    STable
  },
  data () {
    console.log(this.$route.query) // 跨路由传参数
    try {
      const stuList = this.$route.query.stuList
      const record = this.$route.query.record
      const classs = this.$route.query.classs
      const achievements = record.raw.achievements || []
      const stuWait = []
      for (const i in record.raw.enrolls) {
        record.raw.enrolls[i].role = record.raw.scores.find(value => value.ID === record.raw.enrolls[i].scoreID)
        // console.log(i, record.raw.enrolls[i].role)
        record.raw.enrolls[i].roleName = record.raw.enrolls[i].role.name
        record.raw.enrolls[i].roleScore = record.raw.enrolls[i].role.score
        record.raw.enrolls[i].signINS = (record.raw.enrolls[i].signIN || 0) === 0 ? '未签到' : '已签到'
        record.raw.enrolls[i].signOUTS = (record.raw.enrolls[i].signOUT || 0) === 0 ? '未签退' : '已签退'
      }
      if (classs !== '详情') {
        for (const j in stuList) {
          const res = record.raw.enrolls.find(value => String(value.stuID) === stuList[j].学号)
          if (res) {
            if ((res.signIN === 1 && classs === '签到') || (res.signOUT === 1 && classs === '签退')) {
              stuList[j].roleName = '该学生已' + classs
              stuList[j].roleScore = '该学生已' + classs
              stuList[j].enrolled = false
            } else {
              stuList[j].roleName = res.roleName
              stuList[j].roleScore = res.roleScore
              stuList[j].enrolled = true
              stuWait.push(stuList[j].学号)
              // switch (classs) {
              //   case '签到':
              //     stuWait.push({ actID: record.ID, stuID: Number(stuList[j].学号), signIN: 1 })
              //     break
              //   case '签退':
              //     stuWait.push({ actID: record.ID, stuID: Number(stuList[j].学号), signOUT: 1 })
              //     break
              // }
            }
          } else {
            stuList[j].roleName = '该学生未报名'
            stuList[j].roleScore = '该学生未报名'
            stuList[j].enrolled = false
          }
        }
      }
      return {
        checked: false,
        record: record,
        classs: classs, // 签到or签退
        stuWait: stuWait,
        achievements: achievements,
        astuList: (v) => {
          console.log(v)
          // 加载数据方法 必须为 Promise 对象
          return new Promise(resolve => {
            resolve({
              data: stuList.slice((v.pageNo - 1) * v.pageSize, v.pageNo * v.pageSize),
              totalCount: stuList.length,
              pageSize: 10,
              pageNo: v.pageNo,
              totalPage: Math.ceil(stuList.length / v.pageSize)
            })
          })
        },
        astuListColumns: [
          {
            title: '学号',
            dataIndex: '学号',
            key: '学号'
          },
          {
            title: '角色',
            dataIndex: 'roleName',
            key: 'roleName'
          },
          {
            title: '分值',
            dataIndex: 'roleScore',
            key: 'roleScore'
          }
        ],
        stuList: (v) => {
          console.log(v)
          // 加载数据方法 必须为 Promise 对象
          return new Promise(resolve => {
            resolve({
              data: record.raw.enrolls.slice((v.pageNo - 1) * v.pageSize, v.pageNo * v.pageSize),
              totalCount: record.raw.enrolls.length,
              pageSize: 10,
              pageNo: v.pageNo,
              totalPage: Math.ceil(record.raw.enrolls.length / v.pageSize)
            })
          })
        },
        stuListColumns: [
          {
            title: '学号',
            dataIndex: 'stuID',
            key: 'stuID'
          },
          {
            title: '角色',
            dataIndex: 'roleName',
            key: 'roleName'
          },
          {
            title: '分值',
            dataIndex: 'roleScore',
            key: 'roleScore'
          },
          {
            title: '报名时间',
            dataIndex: 'enrollTime',
            key: 'enrollTime'
          },
          {
            title: '签到情况',
            dataIndex: 'signINS',
            key: 'signINS'
          },
          {
            title: '签退情况',
            dataIndex: 'signOUTS',
            key: 'signOUTS'
          }
        ]
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  methods: {
    check () {
      console.log('check', this.stuWait)
      // sign({ valueArr: this.stuWait }).then((res) => console.log(res))
      var newSign = {}
      switch (this.classs) {
        case '签到':
          newSign = { signIN: 1 }
          break
        case '签退':
          newSign = { signOUT: 1 }
          break
      }
      sign({ actID: this.record.ID, stuIDs: this.stuWait, newSign: newSign }).then((res) => {
        console.log(res)
        this.$notification.success({
            message: this.classs + '成功',
            description: String(res.data[0]) + '位同学' + this.classs + '成功!'
          }
        )
        this.checked = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
