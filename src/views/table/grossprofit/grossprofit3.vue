<template>
  <div class="app-container">
    <div class="filterDiv">
      <label class="label">统计期间</label>
      <el-date-picker :editable="false" v-model="listQuery.date1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.date2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" fit highlight-current-row style="width: 100%;" size="small" show-summary>
        <el-table-column label="序号" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="单据日期" align="center">
          <template slot-scope="{row}">
            <span>{{row.billDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据号">
          <template slot-scope="{row}">
            <span>{{row.billNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用预付款金额">
          <template slot-scope="{row}">
            <span>{{row.advPayAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="现结金额">
          <template slot-scope="{row}">
            <span>{{row.currPayAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="返利金额">
          <template slot-scope="{row}">
            <span>{{row.rebateAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合计金额">
          <template slot-scope="{row}">
            <span>{{row.itemAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款到期日">
          <template slot-scope="{row}">
            <span>{{row.paymentDueDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核日期">
          <template slot-scope="{row}">
            <span>{{row.auditDate}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { getData3 } from '@/api/table'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'grossprofit6',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        date1: '',
        date2: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getData3(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    }
  }
}
</script>
