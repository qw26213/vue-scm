<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.date1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.date2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" show-summary>
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="网点代码">
        <template slot-scope="{row}">
          <span>{{row.deptCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点名称">
        <template slot-scope="{row}">
          <span>{{row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品代码">
        <template slot-scope="{row}">
          <span>{{row.itemCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="{row}">
          <span>{{row.itemName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售员代码">
        <template slot-scope="{row}">
          <span>{{row.staffCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售员名称">
        <template slot-scope="{row}">
          <span>{{row.staffName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类代码">
        <template slot-scope="{row}">
          <span>{{row.invCatgCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类名称">
        <template slot-scope="{row}">
          <span>{{row.invCatgName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="收入">
        <template slot-scope="{row}">
          <span>{{row.income}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="成本">
        <template slot-scope="{row}">
          <span>{{row.cost}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="销售数量">
        <template slot-scope="{row}">
          <span>{{row.incomeNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="采购数量">
        <template slot-scope="{row}">
          <span>{{row.costNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="销售平均价">
        <template slot-scope="{row}">
          <span>{{row.incomePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="采购平均价">
        <template slot-scope="{row}">
          <span>{{row.costPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="毛利">
        <template slot-scope="{row}">
          <span>{{row.grossProfit}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="采购数量">
        <template slot-scope="{row}">
          <span>{{row.costNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="毛利率(%)">
        <template slot-scope="{row}">
          <span>{{row.grossProfitMargin}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getData2 } from '@/api/grossprofit'
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
      getData2(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    }
  }
}
</script>
