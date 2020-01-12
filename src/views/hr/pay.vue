<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button size="mini" type="primary" @click="getList">查询</el-button>
      <el-button size="mini" type="primary" @click="copyPay">复制工资表</el-button>
      <el-button size="mini" type="primary" @click="downloadModel">下载模板</el-button>
      <el-button size="mini" type="primary" @click="handImport">薪酬导入</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="会计期间">
        <template slot-scope="{row}">
          <span>{{row.periodCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建/修改时间">
        <template slot-scope="{row}">
          <span>{{row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否导入">
        <template slot-scope="{row}">
          <span>{{row.importFlag==1?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="showBind1(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="复制往期薪酬" :visible.sync="dialogVisible1" width="410px">
      <el-form ref="dataForm" :model="temp1" label-position="left" label-width="72px" style="margin-left:20px;">
        <el-form-item label="工资类型">
          <el-select v-model="temp1.salaryType" placeholder="工资类型" style="width:250px" class="filter-item">
            <el-option label="正常工资" value="1"></el-option>
            <el-option label="劳务报酬" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期间选择" style="margin-right:20px">
          <el-date-picker :editable="false" v-model="temp1.periodStar" type="date" placeholder="开始日期" style="width:115px" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
          <span>至</span>
          <el-date-picker :editable="false" v-model="temp1.periodEnd" type="date" placeholder="结束日期" style="width:115px" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="是否覆盖">
          <el-radio v-model="temp1.cover" label="1">是</el-radio>
          <el-radio v-model="temp1.cover" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="handleSave()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="薪酬导入" :visible.sync="dialogVisible2" width="400px">
      <el-form ref="dataForm" :model="temp2" label-position="left" label-width="72px" style="margin-left:20px;">
        <el-form-item label="选择月份" style="margin-right:20px">
          <el-date-picker :editable="false" v-model="temp2.fileperiodCode" type="month" placeholder="选择月份" style="width:230px" :clearable="false" value-format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-button size="small" type="primary"><i class="el-icon-upload" style="margin-right:5px"></i>点击上传</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="handleImport()">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPayData,getNationalityType,getCertificateType,saveEmployee } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { getNowDate } from '@/utils/auth'
import { debounce } from '@/utils/index'
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
      downloadModel:debounce(this.downloadFile,1000,true),
      listQuery: {
        periodCode1:getNowDate(),
        periodCode2:getNowDate(),
        page:1,
        limit:20
      },
      temp1: {
        certificateType:'',
        comDate:'',
        deptId:'',
        endDate:''
      },
      temp2: {
        fileperiodCode:'',
        status:'',
        deptId:'',
        endDate:''
      },
      dialogVisible1: false,
      dialogVisible2: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPayData(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.body
      }).catch(err=>{
        this.listLoading = false
      })
    },
    copyPay(){
      this.dialogVisible1 = true
    },
    downloadFile(){
      window.location.href = 'http://49.232.47.16/drp/business/employee.xlsx'
    },
    handImport(){
      this.dialogVisible2 = true
    },
    handleImport(){
      this.dialogVisible2 = false
    }
  }
}
</script>
<style scoped>
.filter-item{position: relative;}
#uploadFile{display: none;}
</style>
