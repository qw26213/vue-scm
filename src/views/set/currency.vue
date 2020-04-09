<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.currencyName" placeholder="币种名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.currencyCode" placeholder="币种代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="60" align="center">
      </el-table-column>
      <el-table-column label="币种代码">
        <template slot-scope="{row}">
          <span>{{row.currencyCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种名称">
        <template slot-scope="{row}">
          <span>{{row.currencyName}}{{row.isDefault==1?'（默认）':''}}{{row.isBasecurrency==1?'（本位币）':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种符号">
        <template slot-scope="{row}">
          <span>{{row.symbol}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位">
        <template slot-scope="{row}">
          <span>{{row.uom}}</span>
        </template>
      </el-table-column>
      <el-table-column label="汇率">
        <template slot-scope="{row}">
          <span>{{row.exchangerate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增币种':'修改币种'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 300px; margin-left:50px;">
        <el-form-item label="币种代码" prop="currencyCode">
          <el-input v-model="temp.currencyCode" placeholder="币种代码" />
        </el-form-item>
        <el-form-item label="币种名称" prop="currencyName">
          <el-input v-model="temp.currencyName" placeholder="币种名称" />
        </el-form-item>
        <el-form-item label="单位" prop="uom">
          <el-input v-model="temp.uom" placeholder="单位" />
        </el-form-item>
        <el-form-item label="币种符号" prop="symbol">
          <el-input v-model="temp.symbol" placeholder="币种符号" />
        </el-form-item>
        <el-form-item label="汇率" prop="exchangerate">
          <el-input v-model="temp.exchangerate" placeholder="汇率" />
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
import { getCurrency,saveCurrency,delCurrency,updateCurrencyDisabled } from '@/api/basedata'
export default {
  name: 'baseCurrency',
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        currencyCode: '',
        currencyName: ''
      },
      temp: {
        id: '',
        currencyName: '',
        currencyCode: '',
        uom:'',
        symbol: '',
        exchangerate:'',
        isDisable: 0
      },
      resetTemp: {
        id: '',
        currencyName: '',
        currencyCode: '',
        uom:'',
        symbol: '',
        exchangerate:'',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        currencyName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        currencyCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        uom: [{ required: true, message: '单位不能为空', trigger: 'change' }],
        symbol: [{ required: true, message: '币种符号不能为空', trigger: 'change' }],
        exchangerate: [{ required: false, message: '汇率不能为空', trigger: 'change' }],
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
      getCurrency(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for(var key in this.temp){
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for(var key in this.temp){
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
      updateCurrencyDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList()
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveCurrency(this.temp).then(res => {
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
          saveCurrency(this.temp).then(res => {
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
      delCurrency(id).then(res => {
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
