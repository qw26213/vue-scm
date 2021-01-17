<template>
  <div class="app-container">
    <div class="filterDiv">
      <label class="label">期间</label>
      <PeriodList :start="listQuery.periodCode1" :end="listQuery.periodCode2" />
      <label class="label">科目</label>
      <el-select v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable>
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <el-popover placement="bottom" title="更多" width="240" trigger="click">
        <div>
          <p>
            <el-checkbox v-model="listQuery.isQuantity" :false-label="0" :true-label="1">只显示数量核算科目</el-checkbox>
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
      <el-table :key="tableKey" v-loading="listLoading" :data="pageData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.jeDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="凭证字号" align="center">
          <template slot-scope="{row}">
            <a href="javascript:" @click="$router.push('/voucher/add?id='+row.jeHeaderId)">{{ row.catogeryNameSeq }}</a>
          </template>
        </el-table-column>
        <el-table-column label="摘要">
          <template slot-scope="{row}">
            <span>{{ row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column label="辅助项名称">
          <template slot-scope="{row}">
            <span>{{ row.coaCobinationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="借方发生额">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.qtyDr | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="right">
            <template slot-scope="{row}">
              <span>{{ row.unitpriceDr | Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.accountedDr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="贷方发生额">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.qtyCr | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="right">
            <template slot-scope="{row}">
              <span>{{ row.unitpriceCr | Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.accountedCr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="余额">
          <el-table-column label="方向" align="center">
            <template slot-scope="{row}">
              <span>{{ row.crDrStr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balanceQty | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="right">
            <template slot-scope="{row}">
              <span>{{ row.averagePrice | Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balance | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getDataByPage" />
    </div>
  </div>
</template>
<script>
import { getSubsidiarynum, exportSubsidiaryNum, printSubsidiaryNum } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'subsidiarynum',
  components: { Pagination, PeriodList },
  filters: {
    zeroNull: function(num) {
      return num ? num : ''
    },
    Fixed: function(num) {
      if (!num) { return '' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      pageData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        coaCode1: '',
        coaCode2: '',
        isQuantity: 1,
        isShowNetAndBalanceNotEqualToZero: 1,
        pageIndex: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'coaArr'
    ])
  },
  created() {
    this.$store.dispatch('voucher/getCoaList', 0).then(res => {
      this.$nextTick(() => {
        if (this.coaArr.length > 0) {
          this.listQuery.coaCode1 = this.coaArr[0].coaCode
        }
        this.getList()
      })
    })
  },
  methods: {
    changeVal(obj) {
      for (const key in obj) {
        this.listQuery[key] = obj[key]
      }
    },
    getDataByPage() {
      var pageIndex = this.listQuery.pageIndex
      var arr = []
      var min = pageIndex * 20 - 20
      var max = pageIndex * 20 <= this.total ? pageIndex * 20 : this.total
      for (var i = min; i < max; i++) {
        arr.push(this.tableData[i])
      }
      this.pageData = arr
    },
    getList() {
      this.listLoading = true
      getSubsidiarynum(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
        this.getDataByPage()
      }).catch(() => {
        this.listLoading = false
      })
    },
    printBook() {
      printSubsidiaryNum(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportSubsidiaryNum(this.listQuery)
    }
  }
}
</script>
