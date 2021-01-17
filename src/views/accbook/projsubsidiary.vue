<template>
  <div class="app-container">
    <div class="filterDiv">
      <label class="label">期间</label>
      <PeriodList :start="listQuery.periodCode1" :end="listQuery.periodCode2" />
      <label class="label">科目</label>
      <el-select v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable>
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <el-select v-model="listQuery.auxiliaryType" size="small" placeholder="辅助类别" @change="auxiliaryChange">
        <el-option v-for="item in auxiliaryArr" :key="item.auxiliaryTypeCode" :label="item.auxiliaryTypeName" :value="item.auxiliaryTypeCode" />
      </el-select>
      <el-select v-model="listQuery.auxiliaryCode" size="small" placeholder="辅助名称">
        <el-option label="全部" :value="null" />
        <el-option v-for="item in modalList" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
      <el-popover placement="bottom" title="更多" width="280" trigger="click">
        <div>
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
        <el-table-column label="日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.jeDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="凭证字号">
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
        <el-table-column label="借方金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.accountedDr | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.accountedCr | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方向" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crDrStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.balance | Fixed }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getDataByPage" />
    </div>
  </div>
</template>
<script>
import { getProjsubsidiary, exportProjsubsidiary, printProjsubsidiary } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { getProj, getDept, getStaff, getSupplier, getItem, getinvCatg, getCust } from '@/api/user'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
import { getCoas } from '@/api/voucher'
export default {
  name: 'projsubsidiary',
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
      },
      coaArr: []
    }
  },
  computed: {
    ...mapGetters([
      'auxiliaryArr'
    ])
  },
  created() {
    var obj = { includeRoot: 0, isAuxiliary: 1 }
    getCoas(obj).then(res => {
      this.coaArr = res.data.data || []
    })
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
        getCust().then(res => {
          this.modalList = res.data.data || []
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
      if (code === 'inv') {
        getinvCatg().then(res => {
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
      this.listQuery.auxiliaryCode = ''
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
      getProjsubsidiary(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
        this.getDataByPage()
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportProjsubsidiary(this.listQuery)
    },
    printBook() {
      printProjsubsidiary(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
