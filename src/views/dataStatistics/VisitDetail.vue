<template>
  <div class="page-header-index-wide">
    <a-row>
      <a-col :span="24">
        <div class="card-container">
          <a-tabs type="card">
            <a-tab-pane key="internal">
              <span slot="tab">
                <a-icon type="pushpin" />详细访问数据
              </span>

              <!-- Mobile -->
              <!--todo-->
              <a-list
                v-if="isMobile()"
                itemLayout="vertical"
                size="large"
              >
              </a-list>

              <!-- Desktop -->
              <a-table
                :dataSource="data"
                :columns="columns"
                :pagination="false"
                style="word-break: break-all"
              >
              </a-table>
              <div class="page-wrapper">
                <a-pagination
                  class="pagination"
                  :total="pagination.total"
                  :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
                  showSizeChanger
                  @showSizeChange="handlePaginationChange"
                  @change="handlePaginationChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane key="custom">
              <span slot="tab">
                <a-icon type="fork" />访问曲线图
              </span>

              <!-- Mobile -->
              <a-list
                v-if="isMobile()"
                itemLayout="vertical"
                size="large"
                :pagination="false"
                :loading="dataStatisticsLoading"
              >
              </a-list>

              <!-- Desktop -->
              <div>
                <span>统计时间段: </span>
                <a-select defaultValue="31" style="width: 120px" @change="handleChange">
                  <a-select-option value="31">一个月</a-select-option>
                  <a-select-option value="90">三个月</a-select-option>
                  <a-select-option value="180">六个月</a-select-option>
                  <a-select-option value="365">一年</a-select-option>
                </a-select>
                <ve-histogram :data="chartData" :extend="extend"></ve-histogram>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin.js'
import moment from 'moment'
import dataStatisticsApi from '@/api/dataStatistics'
import VCharts from 'v-charts'

const data = []

const columns = [
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    customRender: (value, row, index) => {
      return moment(new Date(value)).format('YYYY-MM-DD HH:mm:ss')
    },
    scopedSlots: {
      customRender: 'customRender'
    }
  },
  {
    title: '路径',
    dataIndex: 'path',
    width: '500px'
  },
  {
    title: '国家',
    dataIndex: 'country'
  },
  {
    title: '市',
    dataIndex: 'city'
  },
  {
    title: 'ISP',
    dataIndex: 'isp'
  }
]
export default {
  components: {
    've-histogram': VCharts.VeHistogram
  },
  mixins: [mixin, mixinDevice],
  data() {
    this.extend = {
      series: {
        label: { show: true, position: 'top' }
      }
    }
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        sort: null
      },
      queryParam: {
        page: 0,
        size: 10,
        sort: null,
        ip: null
      },
      data,
      columns,
      dayCount: 31, // 默认是一个月
      chartData: {
        columns: ['date', 'count'],
        rows: []
      }
    }
  },
  created() {
    this.loadDataStatistics()
    this.loadChart()
  },
  methods: {
    loadDataStatistics() {
      this.dataStatisticsLoading = true
      this.queryParam.page = this.pagination.current - 1
      this.queryParam.size = this.pagination.pageSize
      this.queryParam.sort = this.pagination.sort
      dataStatisticsApi.queryList(this.queryParam).then(response => {
        this.data = response.data.data.content
        this.pagination.total = response.data.data.total
        this.dataStatisticsLoading = false
      })
    },
    handlePaginationChange(page, pageSize) {
      this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.loadDataStatistics()
    },
    loadChart() {
      dataStatisticsApi.countByDate({ dayCount: this.dayCount }).then(response => {
        this.chartData.rows = response.data.data
      })
    },
    handleChange(value, option) {
      this.dayCount = value
      this.loadChart()
    }
  }
}
</script>
