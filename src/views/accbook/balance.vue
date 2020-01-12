<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" type="primary" @click="getList">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" show-summary :span-method="arraySpanMethod">
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="科目编码" align="center">
        <template slot-scope="{row}">
          <span>{{row.coaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目名称">
        <template slot-scope="{row}">
          <span>{{row.pageCoaName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="期初余额">
        <el-table-column label="借方">
          <template slot-scope="{row}">
            <span>{{row.beginBalanceDr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方">
          <template slot-scope="{row}">
            <span>{{row.beginBalanceCr}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="本期发生额">
        <el-table-column label="借方">
          <template slot-scope="{row}">
            <span>{{row.periodNetDr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方">
          <template slot-scope="{row}">
            <span>{{row.periodNetCr}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="本年累计发生额">
        <el-table-column label="借方">
          <template slot-scope="{row}">
            <span>{{row.yearNetDr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方">
          <template slot-scope="{row}">
            <span>{{row.yearNetCr}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="期末余额">
        <el-table-column label="借方">
          <template slot-scope="{row}">
            <span>{{row.balanceDr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="贷方">
          <template slot-scope="{row}">
            <span>{{row.balanceCr}}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getBalance } from '@/api/accbook'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination' 
export default {
  name: 'balance',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        periodCode1:getNowDate(),
        periodCode2:getNowDate(),
        page:1,
        limit:20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex % 2 === 0) {
        if (rowIndex === 0) {
          return [1, 2];
        }
      }
    },
    getList() {
      this.listLoading = true
      getBalance(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    }
  }
}
</script>