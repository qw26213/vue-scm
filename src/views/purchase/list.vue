<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker editable="false" size="small" class="filter-item" v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增入库单</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="单据日期" width="100">
        <template slot-scope="{row}">
          <span>{{row.billDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据号" width="100">
        <template slot-scope="{row}">
          <span>{{row.billNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据类型">
        <template slot-scope="{row}">
          <span>{{row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票类型">
        <template slot-scope="{row}">
          <span>{{row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商">
        <template slot-scope="{row}">
          <span>{{row.supplierName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务员">
        <template slot-scope="{row}">
          <span>{{row.staffName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库">
        <template slot-scope="{row}">
          <span>{{row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <span>{{row.status==1?'已审核':'未审核'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="{row}">
          <span class="ctrl" @click="handleCompile(row.id)">编辑</span>
          <span class="ctrl" @click="handleDel(row.id)">删除</span>
          <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
          <span class="ctrl" @click="handleCreateBill(row.id)">生成进货单</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getWarehousing,saveWarehousing,delWarehousing,auditWarehousing,buildWarehousingEntry} from '@/api/store'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'purchaseList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      dateTime:[],
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        date1: '',
        date2: '',
        billNo:"IC01",
        id:'',
        total: 0
      },
      temp: {
        billNo: '',
        billDate: '',
        isDisable: "0"
      }
    }
  },
  created() {
    this.getList();
    this.listQuery.date1 = '2019-01-01';
    this.listQuery.date2 = '2019-12-31';
    this.dateTime = [this.listQuery.date1,this.listQuery.date2]
  },
  methods: {
    getList() {
      this.listLoading = true
      getWarehousing(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    timeChange(e){
      if(e){
        this.listQuery.date1 = e[0] + ' 00:00:00'
        this.listQuery.date2 = e[1] + ' 23:59:59'
      }else{
        this.listQuery.date1 = ''
        this.listQuery.date2 = ''
      }
    },
    handleCheck(id){
      this.$confirm('你确认要审核通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkItem(id)
      });
    },
    checkItem(id){
      auditWarehousing(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('审核成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleCreateBill(id){
      buildWarehousingEntry(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('生成进货单成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleAdd() {
      this.$router.push('/purchase/buyadd')
    },
    handleCompile(id) {
      this.$router.push('/purchase/buyadd?id='+id)
    },
    handleDel(id){
      this.$confirm('你确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      });
    },
    delItem(id) {
      delWarehousing(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>