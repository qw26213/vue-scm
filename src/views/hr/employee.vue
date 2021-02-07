<template>
  <div class="app-container">
    <div class="contentDiv">
      <div class="tx-r" style="margin-bottom:15px">
        <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
        <el-button size="small" type="primary" @click="downloadModel">下载模板</el-button>
        <el-button-group style="margin-left:12px">
          <el-button size="small" type="primary" @click="handImport">导入</el-button>
          <el-button size="small" type="primary" @click="exportBook">导出</el-button>
        </el-button-group>
      </div>
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="姓名" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.employeeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证照类型" min-width="100">
          <template slot-scope="{row}">
            <span>{{ row.certificateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证照号码" min-width="160">
          <template slot-scope="{row}">
            <span>{{ row.certificateNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="国籍" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.nationalityName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'正常':'不正常' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="left" width="100">
          <template slot-scope="{row}">
            <span>{{ row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入职日期" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.comeDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="离职日期" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否雇员" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.isEmployee==1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="left" width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :title="dialogStatus=='create'?'新增员工':'编辑员工'" :visible.sync="dialogVisible1" width="620px">
      <el-form ref="dataForm" :model="temp" :rules="rules" inline label-position="left" label-width="72px" style="margin-left:20px;">
        <el-form-item label="员工编号" style="margin-right:20px" prop="code">
          <el-input v-model="temp.employeeCode" placeholder="员工编号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.employeeName" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="国籍" style="margin-right:20px">
          <el-select v-model="temp.nationalityType" placeholder="国籍" style="width:185px" class="filter-item">
            <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件类型">
          <el-select v-model="temp.certificateType" placeholder="证件类型" style="width:185px" class="filter-item">
            <el-option v-for="item in certificateList" :key="item.id" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码" style="margin-right:20px">
          <el-input v-model="temp.certificateNumber" placeholder="证件号码" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="temp.tel" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="入职日期" style="margin-right:20px">
          <el-date-picker v-model="temp.comeDate" :editable="false" type="date" placeholder="入职日期" style="width:185px" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="离职日期">
          <el-date-picker v-model="temp.endDate" :editable="false" type="date" placeholder="离职日期" style="width:185px" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="部门" style="margin-right:20px">
          <el-select v-model="temp.deptId" placeholder="部门" style="width:185px" class="filter-item">
            <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-radio v-model="temp.status" :label="1">正常</el-radio>
          <el-radio v-model="temp.status" :label="0">非正常</el-radio>
        </el-form-item>
        <el-form-item label="" prop="isEmployee">
          <el-checkbox v-model="temp.isEmployee" :false-label="0" :true-label="1">雇员</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="handleSave()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="人员导入" :visible.sync="dialogVisible2" width="500px">
      <el-form ref="importForm" :model="importForm" label-position="left" label-width="80px" style="margin-left:10px;">
        <el-form-item label="选择文件" prop="fileName" :rules="fileRule">
          <input ref="uploadFile" enctype="multipart/form-data" type="file" @change="importFile($event)">
        </el-form-item>
        <p style="margin-top:28px">
          <el-checkbox v-model="importForm.updateDept" :false-label="0" :true-label="1">如果部门编码不存在,同时在-设置-基本档案中新增部门</el-checkbox>
        </p>
        <p>
          <el-checkbox v-model="importForm.updateStaff" :false-label="0" :true-label="1">如果员工编码不存在,同时在-设置-基本档案中新增员工</el-checkbox>
        </p>
        <p>注：如果按证照类型+证照号码存在人员重复,会按最新数据自动更新人员</p>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="handleImport()">上传并导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployee, getNationalityType, getCertificateType, saveEmployee, employeeImport, delEmployee, exportEmployee } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { parseTime, debounce, getNowMonth } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'employee',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      downloadModel: debounce(this.downloadFile, 1000, true),
      tableData: null,
      total: 0,
      listLoading: true,
      nationList: [],
      certificateList: [],
      deptList: [],
      listQuery: {},
      importForm: {
        fileName: '',
        updateDept: 1,
        updateStaff: 1
      },
      fileRule: [{ required: true, message: '请选择要导入的文件！', trigger: 'change' }],
      temp: {
        id: '',
        employeeCode: '',
        employeeName: '',
        nationalityType: '',
        certificateType: '',
        certificateNumber: '',
        comDate: '',
        deptId: '',
        comeDate: '',
        endDate: '',
        isEmployee: 0,
        status: 1,
        tel: ''
      },
      formData: null,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogStatus: '',
      rules: {
        employeeName: [{ required: true, message: '姓名不能为空', trigger: 'change' }],
        employeeCode: [{ required: true, message: '编码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getNationalityType().then(res => {
      this.nationList = res.data.data
    })
    getCertificateType().then(res => {
      this.certificateList = res.data.data
    })
    getDept().then(res => {
      this.deptList = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getEmployee().then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    downloadFile() {
      window.location.href = '/drp/business/employee.xlsx'
    },
    handImport() {
      this.dialogVisible2 = true
    },
    handFileImport() {
      this.$refs.uploadFile.click()
    },
    importFile(event) {
      this.formData = new FormData()
      var fileObj = event.currentTarget.files[0]
      if (fileObj == null || fileObj == undefined) { return }
      this.formData.append('file', fileObj)
      this.formData.append('fileName', 'employee.xlsx')
      this.formData.append('updateDept', this.importForm.updateDept)
      this.formData.append('updateStaff', this.importForm.updateStaff)
      this.importForm.fileName = 'emplpoyee'
    },
    handleImport() {
      this.$refs.importForm.validate(valid => {
          if (valid) {
            const obj = this.formData
            this.$axios({
              url: '/drp/hr/employee/importData',
              method: 'POST',
              data: obj,
              timeout: 10000,
              headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
              if (res.status == 200) {
                this.$message.success('人员导入成功')
                this.dialogVisible2 = false
                this.getList()
              }
            })
          } else {
            return false
          }
      })
    },
    handleAdd() {
      this.dialogVisible1 = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      for (var key in this.temp) {
        this.temp[key] = ''
      }
      this.temp.isEmployee = 0
      this.temp.status = 1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogVisible1 = true
      this.dialogStatus = 'update'
      for (var key in this.temp) {
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSave() {
      saveEmployee(this.temp).then(res => {
        if (res.data.errorCode == 0) {
          this.dialogVisible1 = false
          this.$message.success(this.temp.id == '' ? '新增' : '修改' + '人员成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    exportBook() {
      exportEmployee(this.listQuery)
    },
    handleDel(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定', closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delEmployee(id).then(res => {
          if (res.data.errorCode == 0) {
            this.getList()
            this.dialogFormVisible = false
            this.$message.success('删除成功')
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-item {
    position: relative;
}
/deep/.el-form-item{margin-bottom: 18px}
</style>
