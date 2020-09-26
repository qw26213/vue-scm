<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input size="small" v-model="listQuery.measName" placeholder="计量单位代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="100" align="center">
        </el-table-column>
        <el-table-column label="计量单位代码">
          <template slot-scope="{row}">
            <span>{{row.measCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="计量单位名称">
          <template slot-scope="{row}">
            <span>{{row.measName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="{row}">
            <span>{{row.isDisable==0?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button type="text" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增计量单位':'修改计量单位'" :visible.sync="dialogFormVisible" width="456px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
        <el-form-item label="计量单位代码" prop="measCode">
          <el-input v-model="temp.measCode" placeholder="计量单位代码" />
        </el-form-item>
        <el-form-item label="计量单位名称" prop="measName">
          <el-input v-model="temp.measName" placeholder="计量单位名称" />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input v-model="temp.seq" placeholder="顺序" />
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
import { getMeas,saveMeas,delMeas,updateMeasDisabled } from '@/api/basedata'
import { parseTime } from '@/utils'
export default {
  name: 'baseMeas',
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        measCode: ''
      },
      temp: {
        id: '',
        measName: '',
        measCode: '',
        seq:'',
        isDisable: 0
      },
      resetTemp: {
        id: '',
        measName: '',
        measCode: '',
        seq:'',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        measName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        measCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        seq: [{ required: true, message: '上级代码不能为空', trigger: 'change' }],
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
      getMeas(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for (var key in this.temp) {
        this.temp = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(row) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (var key in this.temp) {
        this.temp[key] = row[key]
      }
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
      updateMeasDisabled(obj).then(res => {
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
          saveMeas(this.temp).then(res => {
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
          saveMeas(this.temp).then(res => {
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
      delMeas(id).then(res => {
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
