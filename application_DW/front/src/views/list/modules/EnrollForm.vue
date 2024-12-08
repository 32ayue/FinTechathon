<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="报名角色"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-select v-decorator="['owner', {rules:[{required: true, message: '请选择报名角色'}]}]" @change="handleChange">
        <!-- <a-select-option :value="0">付晓晓</a-select-option> -->
        <!-- <a-select-option :value="1">周毛毛</a-select-option> -->
        <a-select-option v-for="score in record.scores" :key="score.ID" :value="score.ID"> {{ score.name }}({{ score.score }}分) </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
// import pick from 'lodash.pick'
import { enrollActivity } from '@/api/stud'

// const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'EnrollForm',
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
      value: 0
    }
  },
  mounted () { // 自动选择
    // this.record && this.form.setFieldsValue(pick(this.record, fields))
    this.form.setFieldsValue({ owner: this.record.scores[0].ID })
    this.value = this.record.scores[0].ID
  },
  methods: {
    onOk () {
      console.log('监听了 modal ok 事件', this.value)
      // console.log('监听了 modal ok 事件', this.form.getForm().getFieldProps())
      enrollActivity({ actID: this.record.ID, scoreID: this.value }).then((res) => {
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
      this.value = value
    }
  }
}
</script>
