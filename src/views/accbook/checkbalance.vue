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
      <el-table-column label="操作" align="center" width="260">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button v-if="row.status==0" type="warning" size="mini" @click="handleCheck(row.id)">审核</el-button>
          <el-button type="default" size="mini" @click="handleCreateBill(row.id)">生成进货单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增进货单':'修改进货单'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 300px; margin-left:50px;">
        <el-form-item label="单据号" prop="billNo">
          <el-input v-model="temp.billNo" placeholder="单据号" />
        </el-form-item>
        <el-form-item label="单据日期" prop="billDate">
          <el-date-picker editable="false" size="small" class="filter-item" v-model="temp.billDate" type="datetime" placeholder="单据日期" @change="timeChange" default-time="00:00:00"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
      </div>
    </el-dialog>

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