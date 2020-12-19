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
      <el-popover placement="bottom" title="更多" width="280" trigger="click">
        <div>
          <p>
            <span>辅助类别：</span>
            <el-select v-model="listQuery.auxiliaryType" size="small" placeholder="辅助类别" @change="auxiliaryChange">
              <el-option v-for="item in auxiliaryArr" :key="item.auxiliaryTypeCode" :label="item.auxiliaryTypeName" :value="item.auxiliaryTypeCode" />
            </el-select>
          </p>
          <p>
            <span>辅助名称：</span>
            <el-select v-model="listQuery.auxiliaryCode" size="small" placeholder="辅助名称">
              <el-option v-for="item in modalList" :key="item.id" :label="item.text" :value="item.id" />
            </el-select>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isShowCoa" :false-label="0" :true-label="1">显示末级科目</el-checkbox>
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
        <el-table-column label="项目编码" align="left">
          <template slot-scope="{row}">
            <span>{{ row.auxiliaryCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称">
          <template slot-scope="{row}">
            <span>{{ row.auxiliaryName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期初余额">
          <el-table-column label="借方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalanceDr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="贷方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalanceCr }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期发生额">
          <el-table-column label="借方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalanceDr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="贷方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.beginBalanceCr }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本年累计发生额">
          <el-table-column label="借方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetDr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="贷方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.yearNetCr }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末余额">
          <el-table-column label="借方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balanceDr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="贷方" align="right">
            <template slot-scope="{row}">
              <span>{{ row.balanceCr }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getDataByPage" />
    </div>
  </div>
</template>
<script>
import { getProjbalance, exportProjbalance, printProjbalance } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { getProj, getDept, getStaff, getSupplier, getItem } from '@/api/user'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'checkBalance',
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
      tableData: [],
      pageData: [],
      total: 0,
      listLoading: true,
      modalList: [],
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        coaCode1: '',
        coaCode2: '',
        auxiliaryType: '',
        auxiliaryCode: '',
        isShowCoa: 1,
        isShowNetAndBalanceNotEqualToZero: 1,
        pageIndex: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'auxiliaryArr',
      'coaArr'
    ])
  },
  created() {
    this.$store.dispatch('voucher/getCoaList')
    this.$store.dispatch('voucher/getAuxiliaryTypeList')
    this.getList()
  },
  methods: {
    changeVal(obj) {
      for (const key in obj) {
        this.listQuery[key] = obj[key]
      }
    },
    auxiliaryChange(code) {
      if (code === 'supplier') {
        getSupplier().then(res => {
          this.modalList = res.data.data || []
        })
      }
      if (code === 'cust') {
        getSupplier().then(res => {
          this.custList = res.data.data || []
        })
      }
      if (code === 'proj') {
        getProj().then(res => {
          this.modalList = res.data.data || []
        })
      }
      if (code === 'staff') {
        getStaff().then(res => {
          this.modalList = res.data.data || []
        })
      }
      if (code === 'dept') {
        getDept().then(res => {
          this.modalList = res.data.data || []
        })
      }
      if (code === 'item') {
        getItem().then(res => {
          this.modalList = res.data.data || []
        })
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
      getProjbalance(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
        this.getDataByPage()
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportProjbalance(this.listQuery)
    },
    printBook() {
      printProjbalance(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
