<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <!-- <chart-card :loading="loading" title="总活动数量" :total="String(myData.actNum || 0) + '个'"> -->
        <chart-card :loading="loading" title="总检测数量" :total="String(1246840) + '个'">
          <a-tooltip title="总检测数量(正常和异常网址),包含重复" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">今日审核</span>
              3个
            </trend>
            <trend flag="down">
              <span slot="term">累计审核</span>
              21个
            </trend>
          </div>
          <template slot="footer">月均新增反馈<span> 9个</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <!-- <chart-card :loading="loading" title="访问量" :total="myData.clickNum | NumberFormat"> -->
        <chart-card :loading="loading" title="访问量" :total="730">
          <a-tooltip title="异常网址检测网站点击量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">日最高访问量<span> {{ '12' | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <!-- <chart-card :loading="loading" title="报名学生数" :total="myData.enrollNum | NumberFormat"> -->
        <chart-card :loading="loading" title="已检测异常网址数" :total="1231">
          <a-tooltip title="累计检测异常网址数量数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">月平均检测异常网址数<span> 451</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="异常网址占比" total="13%">
          <a-tooltip title="检测到异常网址所占所有网站的比重" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :percentage="26" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">历史最低</span>
              3%
            </trend>
            <trend flag="up">
              <span slot="term">历史最高</span>
              21%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <!-- <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>{{ $t('dashboard.analysis.all-day') }}</a>
              <a>{{ $t('dashboard.analysis.all-week') }}</a>
              <a>{{ $t('dashboard.analysis.all-month') }}</a>
              <a>{{ $t('dashboard.analysis.all-year') }}</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>
          <a-tab-pane loading="true" tab="活动参加情况" key="1">
            <a-row>
              <a-col :xl="16" :lg="32" :md="24" :sm="24" :xs="24">
                <bar :data="myData.barData || []" title="学生参加量趋势" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="学生活动参加量排名" :list="(myData.rankList || []).slice(0,7)"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="学生活动报名量排名" :list="myData.rankList || []"/>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="部门成果统计" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="myData.barData1 || []" title="成果新增趋势" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="成果新增量排名" :list="myData.rankList1 || []"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card> -->

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="常见类别" :style="{ height: '100%' }">
            <!-- <a-dropdown :trigger="['click']" placement="bottomLeft" slot="extra">
              <a class="ant-dropdown-link" href="#">
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown> -->
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <!-- <number-info :total="myData.clickNum | NumberFormat" :sub-total="'17.1%'"> -->
                  <number-info :total="24" :sub-total="'17.1%'">
                  <span slot="subtitle">
                    <span>刷单诈骗</span>
                    <a-tooltip title="刷单诈骗网址数量及其占总异常网站的比重" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData" :scale="searchUserScale" />
                </div>
              </a-col>
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <!-- <number-info :total="myData.enrollNum | NumberFormat" :sub-total="'26.2%'" status="down"> -->
                <number-info :total="39" :sub-total="'26.2%'" status="down">
                  <span slot="subtitle">
                    <span>信贷理财</span>
                    <a-tooltip title="信贷理财网址数量及其占总异常网址的比重" slot="action">
                      <a-icon type="info-circle-o" :style="{ marginLeft: '8px' }" />
                    </a-tooltip>
                  </span>
                </number-info>
                <!-- miniChart -->
                <div>
                  <mini-smooth-area :style="{ height: '45px' }" :dataSource="searchUserData1" :scale="searchUserScale" />
                </div>
              </a-col>
            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="searchTableColumns"
                :dataSource="myData.achCE"
                :pagination="{ pageSize: 5 }"
              >
                <!-- <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span> -->
              </a-table>
            </div>
          </a-card>
        </a-col>
        <!-- <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="'学院活跃度'" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;"> -->
              <!-- style="bottom: 12px;display: inline-block;" -->
              <!-- <span class="dashboard-analysis-iconGroup">
                <a-dropdown :trigger="['click']" placement="bottomLeft">
                  <a-icon type="ellipsis" class="ant-dropdown-link" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-one') }}</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">{{ $t('dashboard.analysis.dropdown-option-two') }}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span> -->
              <!-- <div class="analysis-salesTypeRadio">
                <a-radio-group defaultValue="a">
                  <a-radio-button value="a">{{ $t('dashboard.analysis.channel.all') }}</a-radio-button>
                  <a-radio-button value="b">{{ $t('dashboard.analysis.channel.online') }}</a-radio-button>
                  <a-radio-button value="c">{{ $t('dashboard.analysis.channel.stores') }}</a-radio-button>
                </a-radio-group>
              </div> -->

            <!-- </div>
            <h4>学院活跃度</h4>
            <div>
              style="width: calc(100% - 240px);"
              <div>
                <v-chart :force-fit="true" :height="405" :data="myData.pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="name*percent" />
                  <v-axis />
                  position="right" :offsetX="-140"
                  <v-legend dataKey="name"/>
                  <v-pie position="percent" color="name" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </div> -->
          <!-- </a-card>
        </a-col> -->
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
// import { getAnalysis } from '@/api/club'

const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserData1 = []
for (let i = 0; i < 7; i++) {
  searchUserData1.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '该类别数量',
    min: 0,
    max: 10
  }]

const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 }
]

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    // const that = this
    // getAnalysis().then((res) => {
    //   that.myData = res.data
    //   that.myData.barData = []
    //   for (const i in res.data.enrollNumPremon) {
    //     that.myData.barData.push({
    //       x: i.slice(0, 4) + '年' + i.slice(4) + `月`,
    //       y: res.data.enrollNumPremon[i]
    //     })
    //   }
    //   that.myData.barData1 = []
    //   for (const i in res.data.achNumPremon) {
    //     that.myData.barData1.push({
    //       x: i.slice(0, 4) + '年' + i.slice(4) + `月`,
    //       y: res.data.achNumPremon[i]
    //     })
    //   }
    //   that.myData.rankList = []
    //   for (const i in res.data.enrollStuNumPremon) {
    //     that.myData.rankList.push({
    //       name: i,
    //       total: res.data.enrollStuNumPremon[i]
    //     })
    //   }
    //   that.myData.rankList1 = []
    //   for (const i in res.data.achNumPerclub) {
    //     that.myData.rankList1.push({
    //       name: i,
    //       total: res.data.achNumPerclub[i]
    //     })
    //   }
    //   const dv = new DataSet.View().source(res.data.collAct)
    //   dv.transform({
    //     type: 'percent',
    //     field: 'count',
    //     dimension: 'name',
    //     as: 'percent'
    //   })
    //   that.myData.pieData = dv.rows
    //   console.log(that.myData)
    // })

    return {
      myData: {},

      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserData1,
      searchUserScale,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  computed: {
    searchTableColumns () {
        return [
      {
        dataIndex: 'index',
        title: '排名',
        width: 90
      },
      {
        dataIndex: 'name',
        title: '异常网址'
      },
      {
        dataIndex: 'clickNum',
        title: '检索量'
      },
      {
        dataIndex: 'enrollNum',
        title: '反馈量'
      }
      // {
      //   dataIndex: 'range',
      //   title: '周涨幅',
      //   align: 'right',
      //   sorter: (a, b) => a.range - b.range,
      //   scopedSlots: { customRender: 'range' }
      // }
      ]
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
