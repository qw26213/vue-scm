<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.settleTypeName" placeholder="结算方式名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.settleTypeCode" placeholder="结算方式代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="结算方式代码">
        <template slot-scope="{row}">
          <span>{{row.settleTypeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算方式名称">
        <template slot-scope="{row}">
          <span>{{row.settleTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应科目代码">
        <template slot-scope="{row}">
          <span>{{row.coaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收付标志">
        <template slot-scope="{row}">
          <span>{{row.arAp|format}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
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

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增结算方式':'修改结算方式'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 380px; margin-left:35px;">
        <el-form-item label="结算方式代码" prop="settleTypeCode">
          <el-input v-model="temp.settleTypeCode" placeholder="结算方式代码" />
        </el-form-item>
        <el-form-item label="结算方式名称" prop="settleTypeName">
          <el-input v-model="temp.settleTypeName" placeholder="结算方式名称" />
        </el-form-item>
        <el-form-item label="对应科目代码" prop="coaCode">
          <el-input v-model="temp.coaCode" placeholder="对应科目代码" />
        </el-form-item>
        <el-form-item label="收付标志" prop="arAp">
          <el-radio v-model="temp.arAp" label="">无</el-radio>
          <el-radio v-model="temp.arAp" label="AR">应收(赊销)</el-radio>
          <el-radio v-model="temp.arAp" label="AP">应付</el-radio>
          <el-radio v-model="temp.arAp" label="ADVR">预收</el-radio>
          <el-radio v-model="temp.arAp" label="ADVP">预付</el-radio>
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
import { getSettleType,saveSettleType,delSettleType,updateSettleTypeDisabled } from '@/api/basedata'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'baseSettleType',
  components: { Pagination },
  filters: {
      format: function(str) {
          if (!str) { return '无' }
          if (str=='AR') { return '应收(赊销)' }
          if (str=='AP') { return '应付' }
          if (str=='ADVP') { return '预付' }
          if (str=='ADVR') { return '预收' }
      }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        settleTypeCode: '',
        settleTypeName: ''
      },
      temp: {
        settleTypeName: '',
        settleTypeCode: '',
        coaCode:'',
        arAp:'',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        settleTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        settleTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        coaCode: [{ required: true, message: '对应科目代码不能为空', trigger: 'change' }],
        arAp:[{required:true}],
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
      getSettleType(this.listQuery).then(response => {
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
      this.temp.settleTypeName = ''
      this.temp.settleTypeCode = ''
      this.temp.coaCode = ''
      this.temp.arAp = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.settleTypeName = obj.settleTypeName
      this.temp.settleTypeCode = obj.settleTypeCode
      this.temp.coaCode = obj.coaCode
      this.temp.arAp = obj.arAp==null?'':obj.arAp;
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
      updateSettleTypeDisabled(obj).then(res => {
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
          saveSettleType(this.temp).then(res => {
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
          saveSettleType(this.temp).then(res => {
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
      delSettleType(id).then(res => {
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
