<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模型名称">
              <a-input v-model="word" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="禁用">禁用</a-select-option>
                <a-select-option value="使用中">使用中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => { this.word = '';$refs.table.refresh(true) }">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-upload
        name="upload_file"
        :multiple="true"
        :openFileDialogOnClick="true"
        :file-list="fileList"
        :action="'/admin/addFileList'"
        :headers="headers"
        :showUploadList="false"
        @change="uploadChange"
      >
          <a-button  :disabled='uploadLoading'  @click="uploadById(Id)"> <a-icon type="upload" />上传模型
          </a-button>
      </a-upload>
    </div>
    <!-- <div class="table-operator">
        <a-button type="primary" icon="plus"  >导入用户名单</a-button>
        <a-dropdown >
          <a-menu slot="overlay">
          </a-menu>
        </a-dropdown>
      </div> -->

    <!-- <s-table :columns="columns" :data="loadData">

      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionList" :key="index">{{ action.describe }}</a-tag>
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table> -->

    <s-table
      ref="table"
      size="default"
      rowKey="ID"
      :columns="columnsTea"
      :data="loadDataTea"
      showPagination="auto"
    >
      <!-- <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span> -->
      <!-- <span slot="status" slot-scope="status">
        {{ status === '0' ? '未启用' : status === '1' ? '使用中' : '' }}
      </span> -->
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <!-- <span slot="description" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span> -->
      <!-- <span slot="actions" slot-scope="record">
        <a-tag :key="0">审核活动</a-tag>
        <a-tag :key="1">审核成果</a-tag>
        <a-tag :key="2" v-show="record === 2">审核申诉</a-tag>
      </span> -->
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
        </template>
      </span>
    </s-table>

    <a-modal
      title="修改权限"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :form="form">

        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一识别码" v-model="mdl.id" id="no" disabled="disabled" />
        </a-form-item> -->

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模型名称"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="模型状态"
          hasFeedback
          validateStatus="success"
        >
          <a-select v-decorator="['status', { rules: [{ required: true, message: '请选择' }] }]">
            <a-select-option value="禁用">禁用</a-select-option>
            <a-select-option value="使用中">启用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上传者"
          hasFeedback
        >
          <!-- <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe"/> -->
          <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name" disabled="disabled" />
        </a-form-item>

        <a-divider />

        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="赋予权限"
          hasFeedback
        >
          <a-select
            style="width: 100%"
            mode="multiple"
            v-model="mdl.actions"
            :allowClear="true"
          >
            <a-select-option v-for="(action, index) in permissionList" :key="index" :value="action.value">{{ action.label }}</a-select-option>
          </a-select>
        </a-form-item> -->

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { searchAllModels, updateTea } from '@/api/admin'
const columnsTea = [
  {
    title: 'ID',
    sorter: true,
    dataIndex: 'ID'
  },
  {
    title: '模型名称',
    dataIndex: 'name'
  },
  {
    title: 'score',
    dataIndex: 'score'
    // scopedSlots: { customRender: 'sex' }
  },
  {
    title: '上传时间',
    dataIndex: 'up_T'
  },
  {
    title: '状态',
    dataIndex: 'status'
    // scopedSlots: { customRender: 'status' }
    // scopedSlots: { customRender: 'actions' }
  },
  {
    title: '上传者',
    dataIndex: 'admin.name'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      word: '',

      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columnsTea,
      // 向后端拉取可以用的操作列表
      permissionList: null,
      // 加载数据方法 必须为 Promise 对象
      loadDataTea: parameter => {
        return searchAllModels({
          word: this.word || '',
          model: 'model'
          }).then(res => {
            console.log(res)
            return {
              data: res.data,
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalCount: res.data.length || 0
            }
          })
      }
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '使用中',
        1: '关闭'
      }
      return statusMap[status]
    }
  },
  created () {
    this.loadPermissionList()
    // 防止表单未注册
    this.form.getFieldDecorator('permissionLevel')
  },
  methods: {
    loadPermissionList () {
      // permissionList
      new Promise(resolve => {
        const data = [
          { label: '新增', value: 'add', defaultChecked: false },
          { label: '查询', value: 'get', defaultChecked: false },
          { label: '修改', value: 'update', defaultChecked: false },
          { label: '列表', value: 'query', defaultChecked: false },
          { label: '删除', value: 'delete', defaultChecked: false },
          { label: '导入', value: 'import', defaultChecked: false },
          { label: '导出', value: 'export', defaultChecked: false }
        ]
        setTimeout(resolve(data), 1500)
      }).then(res => {
        this.permissionList = res
      })
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      console.log(record.permissionLevel)
      this.form.setFieldsValue({ 'permissionLevel': String(record.permissionLevel) })
      this.visible = true
    },
    uploadChange (info) {
      const that = this
      const { fileList } = info
      const status = info.file.status
      if (status !== 'uploading') { // 上传中
        that.uploadLoading = this.$message.loading('文件上传中...')
      }
      if (status === 'done') { // 上传完成后
        if (this.fileData.length < 1) { // 这里是上传单个文件，上传多个可把if判断取消
          // 选择自己需要保存的数据进行重组（可以输出一下info看哪些信息是自己需要的）
          this.fileData.push({
            id: info.file.response.data.rows[0].id,
            path: info.file.response.data.rows[0].url,
            name: info.file.response.data.rows[0].fileName,
            size: info.file.response.data.rows[0].fileSize
          })
          // 用来保存到数据库
          that.$post({
            url: '/api/admin/addFileList',
            data: { bid: this.uploadOrderNo, fileList: this.fileData }
          }).then(res => {
            if (res.rel) {
              this.$message.success('上传成功')
              setTimeout(that.uploadLoading, 0)
              // 如果需要在上传后进行置空要在这里进行操作（主要表格列表里面会用到此操作）
              // this.fileList = []
              // this.fileData = []
            }
          })
        } else {
          this.$message.warning('请等待上个文件上传')
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
      // 重点（因上传的fileList需要使用三次，因此需要此操作）
      this.fileList = [...fileList]
    },
    handleOk () {
      updateTea({ ID: this.mdl.ID, status: this.form.getFieldValue('status') }).then(res => {
        if (res.code === 1) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
        this.$refs.table.refresh()
        this.visible = false
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
