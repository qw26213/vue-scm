<template>
  <div class="app-container">
    <div class="filterDiv">
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
      <el-select v-model="listQuery.coaLevel1" size="small" style="width:100px" placeholder="科目级次" filterable>
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.coaLevel2" size="small" style="width:100px" placeholder="科目级次" filterable>
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
    <div class="contentDiv">
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
            <p v-for="(item,index) in row.listPeriodCode" :key="index" clss="pCell" style="text-align:center">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="摘要">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listSummary" :key="index" clss="pCell tx-c" style="width:max-content;min-width:100%">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="借方金额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listNetDr" :key="index" clss="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listNetCr" :key="index" clss="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="方向">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listCrDrStr" :key="index" clss="pCell" style="text-align:center">{{ item }}</p>
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.listBalance" :key="index" clss="pCell" style="text-align:right">{{ item | Fixed }}</p>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getDataByPage" />
    </div>
  </div>
</template>
<script>
import { getTotalAccount, printLedger, exportLedger } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'totalAccount',
  components: { Pagination, PeriodList },
  filters: {
    Fixed: function(num) {
      if (!num) { return '' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      periodList: [],
      tableData: [],
      pageData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        coaCode1: '',
        coaCode2: '',
        coaLevel1: '',
        coaLevel2: '',
        isShowAuxiliary: 1,
        isShowNetAndBalanceNotEqualToZero: 1,
        pageIndex: 1
      }
    }
  },
  computed: {
    ...mapGetters([
      'coaArr'
    ])
  },
  created() {
    this.$store.dispatch('voucher/getCoaList')
    this.getList()
  },
  methods: {
    changeVal(obj) {
      for (const key in obj) {
        this.$set(this.listQuery, key, obj[key])
      }
    },
    getDataByPage() {
      var pageIndex = this.listQuery.pageIndex
      var arr = []
      var min = pageIndex * 10 - 10
      var max = pageIndex * 10 <= this.total ? pageIndex * 10 : this.total
      for (var i = min; i < max; i++) {
        arr.push(this.tableData[i])
      }
      this.pageData = arr
    },
    getList() {
      this.listLoading = true
      this.listQuery.pageIndex = 1
      getTotalAccount(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
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