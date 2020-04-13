<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.salesTypeName" placeholder="销售类型代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="销售类型代码">
        <template slot-scope="{row}">
          <span>{{row.salesTypeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售类型名称">
        <template slot-scope="{row}">
          <span>{{row.salesTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="正常销售">
        <template slot-scope="{row}">
          <span>{{row.priceRatio}}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应科目代码">
        <template slot-scope="{row}">
          <span>{{row.coaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增销售类型':'修改销售类型'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 300px; margin-left:50px;">
        <el-form-item label="销售类型代码" prop="salesTypeCode">
          <el-input v-model="temp.salesTypeCode" placeholder="销售类型代码" />
        </el-form-item>
        <el-form-item label="销售类型名称" prop="salesTypeName">
          <el-input v-model="temp.salesTypeName" placeholder="销售类型名称" />
        </el-form-item>
        <el-form-item label="正常销售" prop="priceRatio">
          <el-radio v-model="temp.priceRatio" :label="1">是</el-radio>
          <el-radio v-model="temp.priceRatio" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="对应科目代码" prop="coaCode">
          <el-input v-model="temp.coaCode" placeholder="对应科目代码" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable">
          <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
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
import { getSalesType,saveSalesType,delSalesType,updateSalesTypeDisabled } from '@/api/basedata'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'baseSalesType',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        salesTypeName: ''
      },
      temp: {
        salesTypeName: '',
        salesTypeCode: '',
        priceRatio: 0,
        coaCode:"",
        remarks:'',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        salesTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        salesTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        priceRatio: [{ required: true, message: '价格比不能为空', trigger: 'change' }],
        coaCode: [{ required: true, message: '对应科目代码不能为空', trigger: 'change' }],
        isDisable:[{required:false}]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSalesType(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.salesTypeName = ''
      this.temp.salesTypeCode = ''
      this.temp.priceRatio = 0
      this.temp.coaCode = ''
      this.temp.remarks = ''
      this.temp.isDisable = 0
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.salesTypeName = obj.salesTypeName
      this.temp.salesTypeCode = obj.salesTypeCode
      this.temp.priceRatio = obj.priceRatio
      this.temp.coaCode = obj.coaCode
      this.temp.remarks = obj.remarks
      this.temp.isDisable = obj.isDisable
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data){
      this.$confirm('确定'+(data.isDisable==1?'解禁？':'禁用？'), '提示', {
        confirmButtonText: '确定',closeOnClickModal:false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data);
      });
    },
    changeAvaiable(data){
      var obj = {id:data.id,isDisable:data.isDisable==1?0:1}
      updateSalesTypeDisabled(obj).then(res => {
            if(res.data.errorCode==0){
              this.getList();
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
    },
    handleDel(id){
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',closeOnClickModal:false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      });
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveSalesType(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.dialogFormVisible = false
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
          saveSalesType(this.temp).then(res => {
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
      delSalesType(id).then(res => {
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
