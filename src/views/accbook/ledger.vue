<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="传统样式" name="1" />
        <el-tab-pane label="分期间" name="2" />
        <el-tab-pane label="汇总样式" name="3" />
      </el-tabs>
      <label class="label">期间</label>
      <PeriodList :start="listQuery.periodCode1" :end="listQuery.periodCode2" />
      <label class="label">科目</label>
      <el-select v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable>
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.coaCode2" size="small" placeholder="科目" filterable>
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <label class="label">科目级次</label>
      <el-select v-model="listQuery.coaLevel1" size="small" class="sw60" placeholder="科目级次" filterable>
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.coaLevel2" size="small" class="sw60" placeholder="科目级次" filterable>
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <el-popover placement="bottom" title="更多" width="240" trigger="click">
        <div>
          <p>
            <el-checkbox v-model="listQuery.isShowAuxiliary" :false-label="0" :true-label="1">显示辅助核算</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isShowNetAndBalanceNotEqualToZero" :false-label="0" :true-label="1">发生额为0且余额为0不显示</el-checkbox>
          </p>
        </div>
        <el-button slot="reference" size="small">更多<i class="el-icon-arrow-right el-icon--right" /></el-button>
      </el-popover>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-printer" title="打印" @click="printBook" />
        <el-button type="primary" size="small" icon="el-icon-document" title="导出" @click="exportBook" />
      </el-button-group>
    </div>
    <div class="contentDiv" v-if="activeTab == 1">
      <el-table :key="tableKey" v-loading="listLoading" :data="pageData" cell-class-name="tpCell" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="科目编码" align="left" show-overflow-tooltip>
          <template slot-scope="{row}">
            <a href="javascript:" style="padding-left:10px" @click="$router.push('/accbook/detailaccount?coaCode='+row.coaCode)">{{ row.coaCode }}</a>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span style="padding-left:10px" v-html="row.pageCoaName" />
          </template>
        </el-table-column>
        <el-table-column label="期间">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listPeriodCode" :key="index" class="pCell" style="text-align:center">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="摘要">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listSummary" :key="index" class="pCell tx-c" style="width:max-content;min-width:100%">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="借方金额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listNetDr" :key="index" class="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listNetCr" :key="index" class="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="方向">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listCrDrStr" :key="index" class="pCell" style="text-align:center">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listBalance" :key="index" class="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" @pagination="getDataByPage" />
    </div>
    <div class="contentDiv" v-show="activeTab == 2 || activeTab == 3">
      <el-table :key="tableKey" v-loading="listLoading" :data="pageData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="科目编码" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.coaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-html="row.pageCoaName" />
          </template>
        </el-table-column>
        <el-table-column label="单位">
          <template slot-scope="{row}">
            <span>{{ row.uom }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期初余额">
          <el-table-column label="方向" align="center">
            <template slot-scope="{row}">
              <span>{{ row.crDrStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalance | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期借方">
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetDr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期贷方">
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetCr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本年借方">
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetDr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本年贷方">
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetCr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末余额">
          <el-table-column label="方向" align="center">
            <template slot-scope="{row}">
              <span>{{ row.crDrStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balance | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getDataByPage" />
    </div>
  </div>
</template>
<script>
import { getLedger, printLedger, exportLedger } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth, deepClone } from '@/utils/index'
export default {
  name: 'ledger',
  components: { Pagination, PeriodList },
  filters: {
    Fixed: function(num) {
      if (!num) { return '' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      activeTab: '1',
      tableKey: 0,
      periodList: [],
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      pageData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        coaCode1: '',
        coaCode2: '',
        coaLevel1: 1,
        coaLevel2: 8,
        isShowAuxiliary: 1,
        isShowNetAndBalanceNotEqualToZero: 1,
        pageIndex: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'coaArr'
    ])
  },
  watch: {
    activeTab(val) {
      this.changeTab(val)
    }
  },
  created() {
    this.$store.dispatch('voucher/getCoaList', 0)
    this.getList()
  },
  methods: {
    changeVal(obj) {
      for (const key in obj) {
        this.$set(this.listQuery, key, obj[key])
      }
    },
    changeTab(val) {
      const tableData = this['tableData' + val]
      this.tableData = tableData
      this.total = tableData.length
      this.listQuery.pageIndex = 1
      this.getDataByPage()
    },
    getDataByPage() {
      const tableData = this['tableData' + this.activeTab]
      var pageIndex = this.listQuery.pageIndex
      const pageSize = this.activeTab == 1 ? 10 : 20
      var arr = []
      var min = pageIndex * pageSize - pageSize
      var max = pageIndex * pageSize <= this.total ? pageIndex * pageSize : this.total
      for (var i = min; i < max; i++) {
        arr.push(tableData[i])
      }
      this.pageData = arr
    },
    getList() {
      console.log('ledger')
      this.listLoading = true
      this.listQuery.pageIndex = 1
      getLedger(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData1 = res.data.data && res.data.data.style1
        this.tableData2 = res.data.data && res.data.data.style2
        this.tableData3 = res.data.data && res.data.data.style3
        this.tableData = deepClone(this.tableData1)
        this.total = this.tableData.length
        this.getDataByPage()
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportLedger(this.listQuery)
    },
    printBook() {
      printLedger(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>