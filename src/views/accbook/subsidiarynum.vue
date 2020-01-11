<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.date1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.date2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" type="primary" @click="getList">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" show-summary>
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="科目编码" align="center">
        <template slot-scope="{row}">
          <span>{{row.coaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="{row}">
          <span>{{row.jeDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="凭证字号">
        <template slot-scope="{row}">
          <span>{{row.jeCatogery}}</span>
        </template> 
      </el-table-column>
      <el-table-column label="摘要">
        <template slot-scope="{row}">
          <span>{{row.summary}}</span>
        </template>
      </el-table-column>
      <el-table-column label="辅助项名称">
        <template slot-scope="{row}">
          <span>{{row.coaCobinationName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量(借方)">
        <template slot-scope="{row}">
          <span>{{row.qtyDr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(借方)">
        <template slot-scope="{row}">
          <span>{{row.unitpriceDr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(借方)">
        <template slot-scope="{row}">
          <span>{{row.accountedDr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量(贷方)">
        <template slot-scope="{row}">
          <span>{{row.qtyCr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(贷方)">
        <template slot-scope="{row}">
          <span>{{row.unitpriceCr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额(贷方)">
        <template slot-scope="{row}">
          <span>{{row.accountedCr}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getTotalAccount } from '@/api/accbook'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'grossprofit2',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        date1: new Date(),
        date2: new Date(),
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getTotalAccount(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    }
  }
}
</script>