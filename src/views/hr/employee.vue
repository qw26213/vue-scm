<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
      <el-button size="mini" type="primary" @click="downloadModel">下载模板</el-button>
      <el-button size="mini" type="primary" @click="handDownload">人员导入</el-button>
    </div>
    <input enctype="multipart/form-data" id="uploadFile" type="file" @change="importDevice($event)" />
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证照类型" width="150">
        <template slot-scope="{row}">
          <span>{{row.certificateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证照号码" width="200">
        <template slot-scope="{row}">
          <span>{{row.certificateNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="国籍" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.nationalityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{row.status==1?'正常':'不正常'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职日期" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.comeDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="离职日期" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.endDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="残疾/烈属/孤老" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.isIncomplete==1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否雇员" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{row.isEmployee==1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="left" width="100">
        <template slot-scope="{row}">
          <span>{{row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="showBind1(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogStatus=='create'?'新增员工':'编辑员工'" :visible.sync="dialogFormVisible" width="620px">
      <el-form ref="dataForm" :model="temp" :rules="rules" inline label-position="left" label-width="72px" style="margin-left:20px;">
        <el-form-item label="编码" style="margin-right:20px" prop="code">
          <el-input v-model="temp.code" placeholder="编码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="国籍" style="margin-right:20px">
          <el-select v-model="temp.nationalityType" placeholder="国籍" style="width:185px" class="filter-item">
              <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select v-model="temp.certificateType" placeholder="证件类型" style="width:185px" class="filter-item">
              <el-option v-for="item in certificateList" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" style="margin-right:20px">
          <el-input v-model="temp.certificateNumber" placeholder="证件号码" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="temp.tel" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="入职日期" style="margin-right:20px">
          <el-date-picker :editable="false" v-model="temp.comeDate" type="date" placeholder="入职日期" style="width:185px" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职日期">
          <el-date-picker :editable="false" v-model="temp.endDate" type="date" placeholder="离职日期" style="width:185px" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="部门" style="margin-right:20px">
          <el-select v-model="temp.deptId" placeholder="部门" style="width:185px" class="filter-item">
              <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-radio v-model="temp.status" label="1">正常</el-radio>
          <el-radio v-model="temp.status" label="0">不正常</el-radio>
        </el-form-item>
        <el-form-item label="" prop="isIncomplete">
            <el-checkbox v-model="temp.isIncomplete" false-label="0" true-label="1" style="margin-right:20px">残疾/烈属/孤老</el-checkbox>
        </el-form-item>
        <el-form-item label="" prop="isEmployee">
            <el-checkbox v-model="temp.isEmployee" false-label="0" true-label="1">雇员</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave()">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getEmployee,getNationalityType,getCertificateType,saveEmployee } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'employeeList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      nationList:[],
      certificateList:[],
      deptList:[],
      listQuery: {},
      temp: {
        id:'',
        code: '',
        name: '',
        nationalityType:'',
        certificateType:'',
        certificateNumber:'',
        comDate:'',
        deptId:'',
        endDate:'',
        isEmployee:0,
        status: '1',
        isIncomplete:0,
        tel:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules:{
        name: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        code: [{ required: true, message: '编码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getNationalityType().then(res=>{
      this.nationList = res.data.data
    })
    getCertificateType().then(res=>{
      this.certificateList = res.data.data
    })
    getDept().then(res=>{
      this.deptList = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getEmployee().then(res => {
        this.listLoading = false
        this.tableData = res.data.body
      }).catch(err=>{
        this.listLoading = false
      })
    },
    downloadModel(){

    },
    handDownload(){

    },
    handleAdd() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      for(var key in this.temp){
        this.temp[key] = ''
      }
      this.temp.isEmployee = '0';
      this.temp.status = '1';
      this.temp.isIncomplete = '0';
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for(var key in this.temp){
        this.temp[key] = String(obj[key])
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave(){
      saveEmployee(this.temp).then(res => {
        if(res.data.errorCode==0){
          this.dialogFormVisible = false
          this.$message.success(this.temp.id==''?'新增':'修改'+'人员成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.filter-item{position: relative;}
#uploadFile{display: none;}
</style>
