<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" type="primary" @click="getList">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="{row}">
          <span>{{row.jeDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="凭证字号" align="center">
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
      <el-table-column label="借方金额" align="right">
        <template slot-scope="{row}">
          <span>{{row.accountedDr | Fixed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="贷方金额" align="right">
        <template slot-scope="{row}">
          <span>{{row.accountedCr | Fixed }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getSubsidiary } from '@/api/accbook'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination' 
export default {
  name: 'grossprofit2',
  components: { Pagination },
  filters: {
      Fixed: function (num) {
          if (!num) { return '0.00' }
          return parseFloat(num).toFixed(2);
      }
  },
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
    getList() {
      this.listLoading = true
      getSubsidiary(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    }
  }
}
</script>