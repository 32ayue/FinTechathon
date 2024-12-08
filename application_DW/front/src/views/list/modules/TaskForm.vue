<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="反馈内容"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-textarea v-decorator="['info', {rules:[{required: true, message: '请输入反馈信息'}]}]"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { allTeacher, allCopllege, updateActivity, addScore, removeScore, addFeedback } from '@/api/club'
// 需要导入插件https://ant.design/components/
import { Slider, Select } from 'ant-design-vue'
import Vue from 'vue'
import moment from 'moment'
Vue.use(Slider)
Vue.use(Select)
// const moment = require('moment')

function getData (t) {
  allTeacher().then((res) => {
    t.teachers = res.data
  })
  allCopllege().then((res) => {
    console.log(res)
    t.colleges = res.data
  }).catch(e => {
    console.log(e)
  })
}

const fields = ['name', 'info', 'fe_T', 'website', 'T_start', 'T_end', 'toll', 'teaID']

export default {
  name: 'TaskForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    getData(this)
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      teachers: [],
      colleges: [],
      T_start: '',
      T_end: '',
      toll: 0,
      scores: [
        { ID: 0, score: 0.1, name: '参与者' },
        { ID: 1, score: 0.2, name: '工作人员' },
        { ID: 2, score: 1.0, name: '一等奖' },
        { ID: 3, score: 0.5, name: '二等奖' },
        { ID: 4, score: 0.3, name: '三等奖' }
      ]
    }
  },
  mounted () {
    // this.record && this.form.setFieldsValue(pick(this.record, fields))
    if (this.record != null) {
      console.log('日期', this.record.website)
      var availCollege = []
      for (const x in this.record.raw.availCollege.split(',')) {
        availCollege.push(parseInt(this.record.raw.availCollege.split(',')[x]))
      }
      this.form.setFieldsValue(pick(this.record, fields))
      this.form.setFieldsValue({ availCollege: availCollege })
      this.form.setFieldsValue({ website: this.record.website })
      // this.toll = this.record.toll
      this.form.setFieldsValue({ fe_T: this.record.date })
      // var scores = []
      // for (const i in this.record.raw.scores) {
      //   scores.push(this.scores.findIndex((currentValue) => { return currentValue.score === this.record.raw.scores[i].score }))
      // }
      // this.form.setFieldsValue({ score: scores })
    }
  },
  methods: {
    onOk () {
      console.log('监听了 modal ok 事件')
      const { form: { validateFields } } = this
      var err = null
      var res = null
      validateFields((errors, values) => {
        err = errors
        if (moment(values.T_start) > moment(values.T_end)) {
          err = true
          this.$notification.error({
            message: '时间有误',
            description: '活动开始时间应该早于活动结束时间'
          })
        }
        if (moment(values.enrollStart) > moment(values.enrollEnd)) {
          err = true
          this.$notification.error({
            message: '时间有误',
            description: '活动报名时间应该早于活动报名结束时间'
          })
        }
        if (moment(values.enrollEnd) > moment(values.T_end)) {
          err = true
          this.$notification.error({
            message: '时间有误',
            description: '活动报名结束时间应该早于活动结束时间'
          })
        }
        res = values
      })
      if (!err) {
        res.availCollege = String(res.availCollege)
        res.website = this.record.website
        console.log('values', res)
        if (this.record !== null) {
          addFeedback(res).then((r) => {
            console.log('r is', r)
            if (r.code === 1) {
              this.$notification.success({
                message: '反馈成功',
                description: '反馈成功，管理员将在未来进行改进！'
              })
              res.ID = r.ID
              for (var x in res.score) {
                addScore({ actID: res.ID, name: this.scores[res.score[x]].name, score: this.scores[res.score[x]].score })
              }
            }
          })
        } else {
          const { record: { ID } } = this // 直接获取不到this，这样子写
          res.ID = ID
          updateActivity(res).then((r) => {
            console.log(r)
            if (r.code === 1) {
              this.$notification.success({
                message: '修改成功',
                description: '活动修改成功，请等待老师审核！'
              })
            }
          })
          removeScore({ actID: res.ID }).then(() => {
            for (var j in res.score) {
              addScore({ actID: res.ID, name: this.scores[res.score[j]].name, score: this.scores[res.score[j]].score })
            }
          })
        }
        return new Promise(resolve => {
          resolve(true)
        })
      }
    },
    onCancel () {
      console.log('监听了 modal cancel 事件')
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
      })
    },
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleToll (value) {
      this.toll = value || 0
      this.form.setFieldsValue({ toll: value || 0 })
    }
  }
}
</script>
