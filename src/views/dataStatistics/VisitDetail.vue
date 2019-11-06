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
              <a-table :dataSource="data" :columns="columns">
                <div
                  slot="filterDropdown"
                  slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                  style="padding: 8px"
                >
                  <a-input
                    v-ant-ref="c => searchInput = c"
                    :placeholder="`Search ${column.dataIndex}`"
                    :value="selectedKeys[0]"
                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                    @pressEnter="() => handleSearch(selectedKeys, confirm)"
                    style="width: 188px; margin-bottom: 8px; display: block;"
                  />
                  <a-button
                    type="primary"
                    @click="() => handleSearch(selectedKeys, confirm)"
                    icon="search"
                    size="small"
                    style="width: 90px; margin-right: 8px"
                  >Search</a-button
                  >
                  <a-button
                    @click="() => handleReset(clearFilters)"
                    size="small"
                    style="width: 90px"
                  >Reset</a-button
                  >
                </div>
                <a-icon
                  slot="filterIcon"
                  slot-scope="filtered"
                  type="search"
                  :style="{ color: filtered ? '#108ee9' : undefined }"
                />
                <template slot="customRender" slot-scope="text">
                  <span v-if="searchText">
                    <template
                      v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                    >
                      <mark
                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                      >{{ fragment }}</mark
                      >
                      <template
                        v-else
                      >{{ fragment }}</template
                      >
                    </template>
                  </span>
                  <template
                    v-else
                  >{{ text }}</template
                  >
                </template>
              </a-table>
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
                :loading="sheetsLoading"
              >
              </a-list>

              <!-- Desktop -->
              <a-table
                v-else
                :rowKey="sheet => sheet.id"
                :pagination="false"
                :loading="sheetsLoading"
              >
              </a-table>
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
const data = []

const columns = [
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        }, 0)
      }
    }
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender: (value, row, index) => {
      return moment(new Date(value)).format('YYYY-MM-DD HH:mm:ss')
    },
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.age.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        })
      }
    }
  },
  {
    title: '国家',
    dataIndex: 'country',
    key: 'country',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        })
      }
    }
  },
  {
    title: '市',
    dataIndex: 'city',
    key: 'city',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        })
      }
    }
  },
  {
    title: 'ISP',
    dataIndex: 'isp',
    key: 'isp',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender'
    },
    onFilter: (value, record) => record.address.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          this.searchInput.focus()
        })
      }
    }
  }
]
export default {
  mixins: [mixin, mixinDevice],
  data() {
    return {
      data,
      searchText: '',
      searchInput: null,
      columns
    }
  },
  created() {
    this.loadSheets()
  },
  methods: {
    loadSheets() {
      this.sheetsLoading = true
      dataStatisticsApi.queryList().then(response => {
        this.data = response.data.data
        this.sheetsLoading = false
      })
    },
    onSheetSettingsClose() {
      this.sheetSettingVisible = false
      this.selectedSheet = {}
      setTimeout(() => {
        this.loadSheets()
      }, 500)
    },
    onRefreshSheetFromSetting(sheet) {
      this.selectedSheet = sheet
    }
  }
}
</script>
