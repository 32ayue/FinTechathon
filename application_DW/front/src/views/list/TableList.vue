<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <!-- <a-form-item label="用户角色">
                <a-select v-model="queryParam.role" placeholder="请选择" default-value="student" :disabled="this.role === 'teacher'">
                  <a-select-option value="student">学生</a-select-option>
                  <a-select-option value="club">社团</a-select-option>
                  <a-select-option value="teacher">教师</a-select-option>
                </a-select>
              </a-form-item> -->
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="模糊搜索">
                <a-input v-model="queryParam.word" placeholder=""/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="用户ID">
                  <a-input-number v-model="queryParam.ID" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input v-model="queryParam.name" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input-number v-model="queryParam.phoneNumber" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="学院">
                  <a-input-number v-model="queryParam.college" style="width: 100%"/>
                  <!-- <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/> -->
                </a-form-item>
              </a-col>
              <!-- <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">keyong</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => { this.queryParam = { role: 'student' };$refs.table.refresh(true) }">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd" v-if="this.role !== 'teacher'">导入用户名单</a-button>
        <a-dropdown :disabled="selectedRowKeys.length < 1" v-if="this.role !== 'teacher'">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="dele1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <!-- <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item> -->
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="ID"
        :columns="columns"
        :data="loadData"
        :alert="this.role === 'club'"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
        <span slot="sex" slot-scope="i">
          {{ i === '1' ? '男' : i === '2' ? '女' : '' }}
        </span>
        <!-- <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span> -->
        <span slot="description" slot-scope="text">
          <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="permissionLevel" slot-scope="record">
          <a-tag :key="0">审核活动</a-tag>
          <a-tag :key="1">审核成果</a-tag>
          <a-tag :key="2" v-show="record === 2">审核申诉</a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="dele(record)" :disabled="role === 'teacher'">删除</a>
            <a-divider type="vertical" />
            <a @click="edit(record)">找回密码</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
// import { getServiceList } from '@/api/manage'
import { searchAllUser, deleteUser, addUser } from '@/api/admin'
// import { getRoleList, getServiceList } from '@/api/manage'
import InfoAct from './components/InfoAct'
import storage from 'store'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const XLSX = require('xlsx')

const columns = [
  {
    title: 'ID',
    sorter: true,
    dataIndex: 'ID'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  // {
  //   title: '学院',
  //   dataIndex: 'college.name'
  // },
  {
    title: '手机号',
    dataIndex: 'phoneNumber'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const columnsTea = [
  {
    title: 'ID',
    sorter: true,
    dataIndex: 'ID'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' }
  },
  // {
  //   title: '学院',
  //   dataIndex: 'college.name'
  // },
  {
    title: '权限等级',
    dataIndex: 'permissionLevel',
    scopedSlots: { customRender: 'permissionLevel' }
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const columnsClub = [
  {
    title: 'ID',
    sorter: true,
    dataIndex: 'ID'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '信息',
    dataIndex: 'info',
    scopedSlots: { customRender: 'description' }
  },
  // {
  //   title: '学院',
  //   dataIndex: 'college.name'
  // },
  {
    title: '部长',
    dataIndex: 'leader'
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

// const columns = [
//   {
//     title: '#',
//     scopedSlots: { customRender: 'serial' }
//   },
//   {
//     title: '规则编号',
//     dataIndex: 'no'
//   },
//   {
//     title: '描述',
//     dataIndex: 'description',
//     scopedSlots: { customRender: 'description' }
//   },
//   {
//     title: '服务调用次数',
//     dataIndex: 'callNo',
//     sorter: true,
//     needTotal: true,
//     customRender: (text) => text + ' 次'
//   },
//   {
//     title: '状态',
//     dataIndex: 'status',
//     scopedSlots: { customRender: 'status' }
//   },
//   {
//     title: '更新时间',
//     dataIndex: 'updatedAt',
//     sorter: true
//   },
//   {
//     title: '操作',
//     dataIndex: 'action',
//     width: '150px',
//     scopedSlots: { customRender: 'action' }
//   }
// ]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    // this.columns = columns
    const that = this
    console.log(storage.get('ROLE'))
    return {
      role: storage.get('ROLE'),
      columns: columns,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: { role: 'student' },
      // 加载数据方法 必须为 Promise 对象
      nowRows: [],
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        this.columns = this.queryParam.role === 'club' ? columnsClub : (this.queryParam.role === 'student' ? columns : columnsTea)
        return searchAllUser({
          word: this.queryParam.word || '',
          model: this.queryParam.role
          }).then(res => {
            console.log(res)
            var data = res.data
            if (requestParameters.sortOrder || '' === 'descend') {
              data.sort((a, b) => a.ID - b.ID)
            }
            if (requestParameters.sortOrder || '' === 'ascend') {
              data.sort((a, b) => b.ID - a.ID)
            }
            that.nowRows = res.data
            return {
              data: res.data,
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalCount: res.data.length || 0
            }
          })
        // return getServiceList(requestParameters)
        //   .then(res => {
        //     console.log(res.result)
        //     return res.result
        //   })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  // created () {
  //   getRoleList({ t: new Date() })
  //   console.log(getRoleList({ t: new Date() }))
  // },
  computed: {
    rowSelection () {
      console.log({
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      })
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors && /\.(xls|xlsx)$/.test(values.xls.file.name.toLowerCase())) {
          console.log('values', values)
          const reader = new FileReader()
          reader.onload = () => {
            const workbook = XLSX.read(reader.result, {
                  type: 'binary'
                }) // 读取数据
            const ws = []
            ws.push(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]))
            ws.push(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]))
            ws.push(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]]))
            console.log('List Name', workbook.SheetNames)
            console.log('List', ws)
            if (workbook.SheetNames.toString() === ['学生', '社团', '教师'].toString()) {
              addUser({ roles: ['student', 'club', 'teacher'], datas: ws }).then(res => {
                console.log(res)
                if (res.code === 1) {
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      resolve()
                    }, 500)
                  }).then(r => {
                    this.visible = false
                    this.confirmLoading = false
                    form.resetFields()
                    this.$refs.table.refresh()
                    this.$message.success('新增成功')
                    this.mkl = null
                  })
                } else {
                  this.$message.error('新增失败')
                }
              })
            } else {
              this.confirmLoading = false
              this.$message.error('请检查文件是否为账号导入样表格式')
            }
          }
          reader.readAsBinaryString(values.xls.file.originFileObj)
          // if (values.id > 0) {
          //   // 修改 e.g.
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       resolve()
          //     }, 1000)
          //   }).then(res => {
          //     this.visible = false
          //     this.confirmLoading = false
          //     // 重置表单数据
          //     form.resetFields()
          //     // 刷新表格
          //     this.$refs.table.refresh()

          //     this.$message.info('修改成功')
          //   })
          // } else {
          //   // 新增
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       resolve()
          //     }, 1000)
          //   }).then(res => {
          //     this.visible = false
          //     this.confirmLoading = false
          //     // 重置表单数据
          //     form.resetFields()
          //     // 刷新表格
          //     this.$refs.table.refresh()

          //     this.$message.info('新增成功')
          //   })
          // }
        } else {
          this.confirmLoading = false
          this.$message.error('请检查文件格式')
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        role: 'student',
        date: moment(new Date())
      }
    },
    dele (record) {
      console.log(record)
      const form = this.$refs.createModal.form
      this.$dialog(InfoAct,
        // component props
        {
          title: '是 否 删 除 ？',
          value: '请确认是否完全删除账户“' + record.name + '”。',
          bordered: false,
          on: {
            ok: () => {
              console.log('ok 回调', { ID: [record.ID] })
              deleteUser({ ID: [record.ID] }).then((res) => {
                console.log(res)
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.success('删除成功')
              })
            }
          }
        },
        // modal props
        {
          title: '删除账户',
          width: 400,
          centered: true,
          maskClosable: false
        })
    },
    dele1 () {
      console.log(this.selectedRowKeys)
      console.log(this.selectedRows)
      const form = this.$refs.createModal.form
      // 切换页面后，之前选中的或删除的ID仍被选中，需要进行过滤，取交集
      var nowRowKeys = []
      this.nowRows.forEach(element => {
        nowRowKeys.push(element.ID)
      })
      nowRowKeys = nowRowKeys.filter((val) => new Set(this.selectedRowKeys).has(val))
      console.log('nowRowKeys', nowRowKeys)
      // console.log('form', form)
      this.$dialog(InfoAct,
        // component props
        {
          title: '是 否 删 除 ？',
          value: '请确认是否完全删除选中的' + String(nowRowKeys.length) + '个账户。',
          bordered: false,
          on: {
            ok: () => {
              console.log('ok 回调', { ID: nowRowKeys })
              deleteUser({ ID: nowRowKeys }).then((res) => {
                console.log(res)
                this.visible = false
                this.confirmLoading = false
                // 重置表单数据
                form.resetFields()
                // 刷新表格
                this.$refs.table.refresh()
                this.$message.info('删除成功')
              })
            }
          }
        },
        // modal props
        {
          title: '删除账户',
          width: 400,
          centered: true,
          maskClosable: false
        })
    },
    edit (record) {
      this.$notification.info({
        message: '找回密码',
        description: record.name + '的密码为：' + String(record.password)
      })
    }
  }
}
</script>
