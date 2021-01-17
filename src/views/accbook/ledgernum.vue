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
      <el-select v-model="listQuery.coaLevel1" size="small" class="sw60" placeholder="级次" filterable>
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.coaLevel2" size="small" class="sw60" placeholder="级次" filterable>
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <el-popover placement="bottom" title="更多" width="240" trigger="click">
        <div>
          <p>
            <el-checkbox v-model="listQuery.isShowAuxiliary" :false-label="0" :true-label="1">显示辅助核算</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isQuantity" :false-label="0" :true-label="1">只显示数量核算科目</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isShowNetAndBalanceNotEqualToZero" :false-label="0" :true-label="1">发生额为0且余额为0不显示</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isTotal" :false-label="0" :true-label="1">不分期间</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isOneLine" :disabled="listQuery.isTotal==1" :false-label="0" :true-label="1">一行显示</el-checkbox>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isBeginYearNet" :disabled="listQuery.isOneLine==1" :false-label="0" :true-label="1">显示期初本年累计</el-checkbox>
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
        <el-table-column label="科目编码" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.coaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span style="padding-left:10px" v-html="row.pageCoaName" />
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
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginQty | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginUnitPrice | Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalance | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期借方">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetQtyDr | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetDr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期贷方">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetQtyCr | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.periodNetCr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本年借方">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetQtyDr | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetDr | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本年贷方">
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetQtyCr | zeroNull }}</span>
            </template>
          </el-table-column>
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
          <el-table-column label="数量" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balanceQty | zeroNull }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balanceUnitPrice | Fixed }}</span>
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
import { getLedgernum, exportLedgernum, printLedgernum } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'ledgernum',
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
        coaLevel1: 1,
        coaLevel2: 8,
        isShowAuxiliary: 1,
        isTotal: 0,
        isBeginYearNet: 0,
        isOneLine: 0,
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
    this.$store.dispatch('voucher/getCoaList', 0)
    this.getList()
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
      this.listQuery.pageIndex = 1
      getLedgernum(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
        this.getDataByPage()
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportLedgernum(this.listQuery)
    },
    printBook() {
      printLedgernum(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
