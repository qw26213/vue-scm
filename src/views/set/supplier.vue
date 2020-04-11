<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.supplierName" placeholder="供应商代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="供应商代码">
        <template slot-scope="{row}">
          <span>{{row.supplierCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商名称">
        <template slot-scope="{row}">
          <span>{{row.supplierName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称">
        <template slot-scope="{row}">
          <span>{{row.abbr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="{row}">
          <span>{{row.contact}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="{row}">
          <span>{{row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信号">
        <template slot-scope="{row}">
          <span>{{row.wechat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行">
        <template slot-scope="{row}">
          <span>{{row.bank}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户账号">
        <template slot-scope="{row}">
          <span>{{row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增供应商':'修改供应商'" :visible.sync="dialogFormVisible" width="680px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="100px" style="width: 610px; margin-left:30px;">
        <el-form-item label="供应商代码" prop="supplierCode">
          <el-input v-model="temp.supplierCode" placeholder="供应商代码" />
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="temp.supplierName" placeholder="供应商名称" />
        </el-form-item>
        <el-form-item label="简称" prop="abbr">
          <el-input v-model="temp.abbr" placeholder="简称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="temp.contact" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="temp.wechat" placeholder="微信号" />
        </el-form-item>
        <el-form-item label="开户行" prop="bank">
          <el-input v-model="temp.bank" placeholder="开户行" />
        </el-form-item>
        <el-form-item label="开户账号" prop="account">
          <el-input v-model="temp.account" placeholder="开户账号" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="详细地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable">
          <el-radio v-model="temp.isDisable" label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" label="1">否</el-radio>
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
import { getSupplier,saveSupplier,delSupplier,updateSupplierDisabled } from '@/api/basedata'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'baseSupplier',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        supplierName: ''
      },
      temp: {
        supplierName: '',
        supplierCode: '',
        abbr: '',
        contact: '',
        tel: '',
        email: '',
        wechat: '',
        bank: '',
        account: '',
        addr: '',
        remarks:'',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        supplierName: [{ required: true, message: '供应商名称不能为空', trigger: 'change' }],
        supplierCode: [{ required: true, message: '供应商代码不能为空', trigger: 'change' }],
        abbr: [{ required: false, message: '供应商简称不能为空', trigger: 'change' }],
        contact: [{ required: false, message: '联系人不能为空', trigger: 'change' }],
        tel: [{ required: false, message: '电话不能为空', trigger: 'change' }],
        email: [{ required: false, message: '邮箱地址不能为空', trigger: 'change' }],
        wechat: [{ required: false, message: '微信号不能为空', trigger: 'change' }],
        bank: [{ required: false, message: '开户行不能为空', trigger: 'change' }],
        account: [{ required: false, message: '银行账号不能为空', trigger: 'change' }],
        addr: [{ required: false, message: '地址不能为空', trigger: 'change' }],
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
      getSupplier(this.listQuery).then(response => {
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
      for(var key in this.temp){
        this.temp[key] = ''
      }
      this.temp.isDisable = '0'
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
      this.temp.id = obj.id
      this.temp.isDisable = String(obj.isDisable)
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
      updateSupplierDisabled(obj).then(res => {
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
        this.delItem(id);
      });
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveSupplier(this.temp).then(res => {
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
          saveSupplier(this.temp).then(res => {
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
      delSupplier(id).then(res => {
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
