<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="上传表格"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-upload v-decorator="['xls', rules.xls]" name="xls" :beforeUpload="beforeUploadXls" :showUploadList="true" @change="blurXls">
        <a-button icon="upload">选择表格</a-button>
      </a-upload>
    </a-form-item>
    <a-form-item
      label="上传图片"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      hasFeedback
    >
      <a-upload v-decorator="['img', rules.img]" name="img" :beforeUpload="beforeUpload" :showUploadList="true" @change="blurImg">
        <a-button icon="upload">选择图片</a-button>
      </a-upload>
    </a-form-item>
  </a-form>
</template>

<script>
const XLSX = require('xlsx')
// import pick from 'lodash.pick'
// import { complaintActivity } from '@/api/stud'
// const fields = ['title', 'startAt', 'owner', 'description']
const rules = {
  xls: {
    rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
  },
  img: {
    rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
  }
}
export default {
  name: 'SignForm',
  props: {
    record: {
      type: Object,
      default: null
    },
    classs: {
      type: String,
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
      rules
    }
  },
  watch: {
    editVis: {
      handler (newVal) {
        if (!newVal) {
          // 解决二次打开弹框试，均为必填校验
          this.rules = {
            xls: {
              rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
            },
            img: {
              rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
            }
          }
        }
      },
      immediate: true
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
        const that = this
        return new Promise(resolve => {
          resolve(true)
          const reader = new FileReader()
          reader.onload = () => {
            const workbook = XLSX.read(reader.result, {
                  type: 'binary'
                }) // 读取数据
            const ws = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) // 取第一张表
            console.log('stuList', ws)
            that.$router.push({ path: '/profile/basic', query: { actID: that.record.ID, record: that.record, stuList: ws, classs: that.classs } })
          }
          reader.readAsBinaryString(value.xls.file.originFileObj)
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
    beforeUploadXls (file) {
      if (/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        return new Promise((resolve, reject) => { resolve(file) })
      }
      this.rules = {
        xls: {
          rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
        },
        img: {
          rules: [{ required: true, message: '请上传Excel表格文件或图片!' }]
        }
      }
      this.$notification.error({
                  message: '格式有误',
                  description: '文件格式有误，请上传Excel表格类型文件！'
                })
      return new Promise((resolve, reject) => { reject(file) })
    },
    beforeUpload (file) { // 参考src\views\account\settings\AvatarModal.vue和src\views\account\settings\BasicSetting.vue
      // const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      // reader.readAsDataURL(file)
      // reader.onload = () => {
      //   console.log('reader.result', reader.result)
      // }
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      console.log('file', file)
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
    },
    blurImg (e) {
      this.form.validateFields(['img'], (errors, values) => {
        this.rules.xls.rules[0].required = !!errors
        this.$nextTick(() => {
          this.form.validateFields(['xls'], { force: true })
        })
      })
    },
    blurXls (e) {
      this.form.validateFields(['xls'], (errors, values) => {
        this.rules.img.rules[0].required = !!errors && values
        this.$nextTick(() => {
          this.form.validateFields(['img'], { force: true })
        })
      })
    }
  }
}
</script>
