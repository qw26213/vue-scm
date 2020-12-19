<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.periodCode1" size="small" :picker-options="startDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="开始月份" @change="pickerChange" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.periodCode2" size="small" :picker-options="endDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="结束月份" />
      <label class="label ml10">凭证字</label>
      <el-select v-model="listQuery.jeCatogeryId" placeholder="凭证字" size="small">
        <el-option v-for="item in catogeryList" :key="item.id" :label="item.catogeryName" :value="item.id" />
      </el-select>
      <label class="label ml10">科目级次</label>
      <el-select v-model="listQuery.coaLevel1" placeholder="科目级次" size="small">
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.coaLevel2" placeholder="科目级次" size="small">
        <el-option v-for="item in [1,2,3,4,5,6,7,8]" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="科目编码">
          <template slot-scope="{row}">
            <span>{{ row.coaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="100">
          <template slot-scope="{row}">
            <span v-html="row.pageCoaName" />
          </template>
        </el-table-column>
        <el-table-column label="方向" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crDrStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期初余额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.beginBalance | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="借方金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.accountedCr | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.accountedDr | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="期末余额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.endBalance | Fixed }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getVoucherTable, getCatogery } from '@/api/accbook'
import { getYearsById } from '@/api/voucher'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'voucherTable',
  filters: {
    Fixed: function(str) {
      return parseFloat(str).toFixed(2)
    }
  },
  data() {
    return {
      startDateOptions: null,
      endDateOptions: null,
      tableKey: 0,
      tableData: [],
      catogeryList: [],
      listLoading: true,
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        jeCatogeryId: '',
        coaLevel1: 1,
        coaLevel2: 8
      }
    }
  },
  created() {
    getCatogery().then(res => {
      this.catogeryList = res.data.data
      this.listQuery.jeCatogeryId = res.data.data[0].id
      this.getList()
    })
    getYearsById().then(res => {
      const list = res.data.data
      const s = new Date(list[0]+'-01-01 00:00:00').getTime()
      const e = new Date(list[list.length - 1] + '-12-31 00:00:00').getTime()
      this.startDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
      this.endDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
    })
  },
  methods: {
    pickerChange() {
      const startDate = this.listQuery.queryParam.date1 + '-01 00:00:00'
      const endDate = startDate.substr(0, 4) + '-12-31 00:00:00'
      this.endDateOptions = { disabledDate: (time) => time.getTime() < new Date(startDate) || time.getTime() > new Date(endDate) }
    },
    getList() {
      this.listLoading = true
      getVoucherTable(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 5px 0 0;
}

.ml10 {
    margin-left: 10px
}
</style>
