<template>
  <div class="app-container" style="min-width:1300px">
    <div class="filterDiv">
      <label class="label">期间</label>
      <PeriodList :start="listQuery.periodCode1" :end="listQuery.periodCode2" />
      <label class="label">科目</label>
      <el-select ref="coaRef" v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable @change="coaChange">
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :data-dir="item.crDr" :value="item.coaCode" />
      </el-select>
      <el-popover placement="bottom" title="更多" width="320" trigger="click">
        <div>
          <p><span>科目级次：</span>
            <el-radio v-model="listQuery.isShowChildren" label="">全部</el-radio>
            <el-radio v-model="listQuery.isShowChildren" :label="1">下级</el-radio>
            <el-radio v-model="listQuery.isShowChildren" :label="0">末级</el-radio>
          </p>
          <p>
            <el-checkbox v-model="listQuery.isOnlyShowLeaf" :false-label="0" :true-label="1">显示明细栏余额</el-checkbox>
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
        <el-table-column label="余额" align="center">
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
        </el-table-column>
        <el-table-column :label="crDr==1?'借方':'贷方'" align="center">
          <el-table-column v-for="(it, i) in columns" :key="i" :label="it" align="right">
            <template slot-scope="{row}">
              <span>{{ row.listCoaNet[i] | Fixed }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>
<script>
import { getMultisubsidiary, exportMultisubsidiary, printMultisubsidiary } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import PeriodList from '@/components/voucher/periodList'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'manyAccount',
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
      crDr: '',
      listLoading: true,
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        coaCode1: '',
        isShowChildren: 1,
        isShowNetAndBalanceNotEqualToZero: 1,
        isOnlyShowLeaf: 1,
        pageIndex: 1
      },
      columns: []
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
    coaChange(val) {
      this.$nextTick(() => {
        this.crDr = this.$refs.coaRef.selected.$attrs['data-dir']
      })
    },
    getDataByPage() {
      var pageIndex = this.listQuery.pageIndex
      var arr = []
      var min = pageIndex * 10 - 10
      var max = pageIndex * 10 <= this.total ? pageIndex * 20 : this.total
      for (var i = min; i < max; i++) {
        arr.push(this.tableData[i])
      }
      this.pageData = arr
    },
    getList() {
      this.listLoading = true
      this.listQuery.pageIndex = 1
      getMultisubsidiary(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
        this.getDataByPage()
        if (this.total > 0) {
          this.columns = res.data.data[0].listCoaName
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportBook() {
      exportMultisubsidiary(this.listQuery)
    },
    printBook() {
      printMultisubsidiary(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
