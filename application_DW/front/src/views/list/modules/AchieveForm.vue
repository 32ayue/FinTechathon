<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="成果名称"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-input v-decorator="['name', {rules:[{required: true, message: '请输入成果名称'}]}]" />
    </a-form-item>
    <a-form-item
      label="成果等级"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-input v-decorator="['level', {rules:[{required: true, message: '请输入成果等级'}]}]" />
    </a-form-item>
    <a-form-item
      label="成果详情"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-textarea v-decorator="['info', {rules:[{required: true, message: '请输入成果详情'}]}]"></a-textarea>
    </a-form-item>
    <a-form-item
      label="上传文件"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-upload v-decorator="['file', {rules:[{required: true, message: '请上传文件'}]}]" name="file" :beforeUpload="beforeUpload" :showUploadList="false">
        <a-button icon="upload">选择图片</a-button>
      </a-upload>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { addAchievement } from '@/api/club'
// const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'AchieveForm',
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
      loading: false,
      fileData: null
    }
  },
  mounted () { // 自动选择
    // this.record && this.form.setFieldsValue(pick(this.record, fields))
    // this.form.setFieldsValue({ owner: this.record.scores[0].ID })
    // this.value = this.record.scores[0].ID
  },
  methods: {
    onOk () {
      console.log('监听了 modal ok 事件', this.value)
      const { form: { validateFields } } = this
      var err = null
      var value = null
      validateFields((errors, values) => {
        err = errors
        value = values
        console.log(values)
      })
      if (!err) {
        // console.log('监听了 modal ok 事件', this.form.getForm().getFieldProps())
        // 关闭窗口

        // const reader = new FileReader()
        // reader.readAsDataURL(value.file.file.originFileObj)
        // reader.readAsText(value.file.file.originFileObj)
        // reader.readAsBinaryString(value.file.file.originFileObj)
        // reader.readAsArrayBuffer(value.file.file.originFileObj)
        // reader.onload = () => {
        //   value.fileData = reader.result
        //   value.fileName = value.file.file.name
        //   // console.log('value', pick(value, ['actID', 'name', 'info', 'level', 'fileData']))
        //   console.log('value', value)
        //   addAchievement(value)
        // }
        value.actID = this.record.ID
        const formData = new FormData()
        formData.append('file', value.file.file.originFileObj, value.file.file.name)
        formData.append('info', JSON.stringify(pick(value, ['actID', 'name', 'info', 'level'])))
        addAchievement(formData)

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
    handleChange (UploadChangeParam) {
      console.log('UploadChangeParam', UploadChangeParam)
    },
    beforeUpload (file) { // 参考src\views\account\settings\AvatarModal.vue和src\views\account\settings\BasicSetting.vue
      // const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      // reader.readAsDataURL(file)
      // reader.onload = () => {
      //   console.log('reader.result', reader.result)
      // }
      // console.log('file', file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      // console.log('reader', reader)

      // const formData = new FormData()
      // formData.append('file', data, this.fileName)
      // const _this = this
      // this.$http.post('https:', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        // .then((response) => {
        //   _this.$message.success('上传成功')
        //   _this.$emit('ok', response.url)
        // }

      // return false
    }
  }
}
</script>
