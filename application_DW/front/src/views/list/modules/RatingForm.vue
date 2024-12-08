<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="活动评分"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-rate allow-half v-decorator="['rating', {rules:[{required: true, message: '请滑动评分'}]}]" style="margin-left: 10px" />
    </a-form-item>
  </a-form>
</template>

<script>
import { ratingActivity } from '@/api/stud'
// 需要导入插件https://ant.design/components/
import { Rate } from 'ant-design-vue'
import Vue from 'vue'
Vue.use(Rate)

export default {
  name: 'RatingForm',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
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
      rating: 0
    }
  },
  methods: {
    onOk () {
      var quality = 0
      var err = null
      console.log('监听了 modal ok 事件', this.value)
      this.form.validateFields((errors, values) => {
        err = errors
        if (!errors) {
          quality = values.rating
        }
      })
      if (!err) {
        ratingActivity({ actID: this.record.ID, quality: quality }).then((res) => {
              console.log('报名结果', res)
              if (res.code === 1) {
                this.$message.success(res.data)
                this.$notification.success({
                  message: res.data,
                  description: res.data
                })
              } else {
                this.$message.error(res.data)
                this.$notification.error({
                  message: res.data,
                  description: res.message
                })
              }
            })
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
    }
  }
}
</script>
