<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker editable="false" size="small" class="filter-item" v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
import { getWarehousing,saveWarehousing,delWarehousing,auditWarehousing,buildWarehousingEntry} from '@/api/store'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'checkList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      dateTime:"",
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        date1: '',
        date2: ''
      },
      temp: {
        billNo: '',
        billDate: '',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        billNo: [{ required: true, message: '单据号不能为空', trigger: 'change' }],
        billDate: [{ required: true, message: '单据日期不能为空', trigger: 'change' }],
        isDisable:[{required:true}]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getWarehousing(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.body
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
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.WarehousingName = ''
      this.temp.WarehousingCode = ''
      this.temp.parentCode = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.WarehousingName = obj.WarehousingName
      this.temp.WarehousingCode = obj.WarehousingCode
      this.temp.parentCode = obj.parentCode
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveWarehousing(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.$message.success('修改成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveWarehousing(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      })
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
