<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.bizProcName" placeholder="业务流程代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
      <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
      <el-table-column label="业务类型">
        <template slot-scope="{row}">
          <span>{{row.bizTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务流程代码">
        <template slot-scope="{row}">
          <span>{{row.bizProcCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务流程名称">
        <template slot-scope="{row}">
          <span>{{row.bizProcName}}</span>
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
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
          <el-button type="text" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增业务流程':'修改业务流程'" :visible.sync="dialogFormVisible" width="456px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
        <el-form-item label="业务类型" prop="bizTypeId">
          <el-select v-model="temp.bizTypeId" style="width:100%" class="filter-item">
            <el-option v-for="item in bizTypeList" :key="item.id" :label="item.bizTypeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务流程代码" prop="bizProcCode">
          <el-input v-model="temp.bizProcCode" placeholder="业务流程代码" />
        </el-form-item>
        <el-form-item label="业务流程名称" prop="bizProcName">
          <el-input v-model="temp.bizProcName" placeholder="业务流程名称" />
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
import { getBizProc,saveBizProc,delBizProc,updateBizProcDisabled,getBizType} from '@/api/basedata'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseBizType',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      bizTypeList:[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        bizProcName: ''
      },
      temp: {
        id: '',
        bizProcName: '',
        bizProcCode: '',
        bizTypeId:'',
        isDisable: 0,
        remarks:''
      },
      resetTemp: {
        id: '',
        bizProcName: '',
        bizProcCode: '',
        bizTypeId:'',
        isDisable: 0,
        remarks:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        bizProcName: [{ required: true, message: '业务流程名称不能为空', trigger: 'change' }],
        bizProcCode: [{ required: true, message: '业务流程代码不能为空', trigger: 'change' }],
        bizTypeId: [{ required: true, message: '业务类型必须选择', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getBizType({}).then(res => {
      this.bizTypeList = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getBizProc(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for (var key in this.temp){
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (var key in this.temp){
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
      updateBizProcDisabled(obj).then(res => {
        if(res.data.errorCode==0){
            this.getList();
        this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
          }else{
            this.$message.error(res.data.msg)
          }
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
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveBizProc(this.temp).then(res => {
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
          saveBizProc(this.temp).then(res => {
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
      delBizProc(id).then(res => {
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
