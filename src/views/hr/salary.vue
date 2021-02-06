<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.periodCode1" :editable="false" type="month" placeholder="开始月份" size="small" value-format="yyyy-MM" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.periodCode2" :editable="false" type="month" placeholder="结束月份" size="small" value-format="yyyy-MM" />
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="copyPay">复制工资表</el-button>
      <el-button size="small" type="primary" @click="downloadModel">下载模板</el-button>
      <el-button-group style="float:right">
        <el-button size="small" type="primary" @click="handImport">导入</el-button>
        <el-button size="small" type="primary" @click="exportBook">导出</el-button>
      </el-button-group>
    </div>
    <input ref="uploadFile" enctype="multipart/form-data" style="display:none" type="file" @change="importFile($event)">
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="会计期间" align="center">
          <template slot-scope="{row}">
            <span>{{row.periodCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建/修改时间" align="center">
          <template slot-scope="{row}">
            <span>{{row.updateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否导入" align="center">
          <template slot-scope="{row}">
            <span>{{row.importFlag==1?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleDetail(row)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog title="复制往期薪酬" :visible.sync="dialogVisible1" width="460px">
      <el-form ref="dataForm" :model="temp1" label-position="left" label-width="72px" style="margin-left:10px;width:400px">
        <el-form-item label="工资类型">
          <el-select v-model="temp1.salaryType" placeholder="工资类型" style="width:100%" class="filter-item">
            <el-option label="正常工资" value="1" />
            <el-option label="劳务报酬" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="期间选择">
          <el-date-picker v-model="temp1.periodStar" :editable="false" type="month" placeholder="月份" style="width:152px" value-format="yyyy-MM" />
          <span>至</span>
          <el-date-picker v-model="temp1.periodEnd" :editable="false" type="month" placeholder="月份" style="width:152px" value-format="yyyy-MM" />
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
    <el-dialog title="薪酬导入" :visible.sync="dialogVisible2" width="460px">
      <el-form ref="dataForm" :model="temp2" label-position="left" label-width="72px" style="margin-left:10px;width:400px">
        <el-form-item label="选择月份">
          <el-date-picker v-model="temp2.periodCode" :editable="false" type="month" placeholder="选择月份" style="width:100%" value-format="yyyy-MM" />
        </el-form-item>
        <el-form-item label="选择文件">
          <input ref="uploadFile" enctype="multipart/form-data" type="file" @change="importFile($event)">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="handleImport()">上传并导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPayData, getNationalityType, getCertificateType, saveEmployee, paydetailImport, exportSalary } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { debounce, getNowMonth, getNowDate } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'salary',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      downloadModel: debounce(this.downloadFile, 1000, true),
      listQuery: {
        periodCode1: getNowMonth(),
        periodCode2: getNowMonth(),
        page: 1,
        limit: 20
      },
      temp1: {
        salaryType: '',
        periodStar: '',
        periodEnd: '',
        cover: '1'
      },
      temp2: {
        periodCode: getNowMonth()
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
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    copyPay() {
      this.dialogVisible1 = true
    },
    handleSave() {
      copySalary(this.temp1).then(res => {
        if (res.status == 200) {
          this.$message.success('复制成功')
          this.dialogVisible2 = false
          this.getList()
        } else {
          this.$message.error('系统错误')
        }
      })
    },
    handleDetail() {
      this.$router.push('/hr/salarydetail?id=' + row.id)
    },
    downloadFile() {
      window.location.href = '/drp/business/salary.xlsx'
    },
    handImport() {
      this.dialogVisible2 = true
    },
    importFile(event) {
      this.formData = new FormData()
      var fileObj = event.currentTarget.files[0]
      if (fileObj == null || fileObj == undefined) { return }
      this.formData.append('file', fileObj)
      this.formData.append('fileName', 'salary.xlsx')
      this.formData.append('periodCode', this.temp2.periodCode)
    },
    exportBook() {
      exportSalary(this.listQuery)
    },
    handleImport() {
      const obj = this.formData
      this.$axios({
        url: '/drp/hr/salaryDetail/importData',
        method: 'POST',
        data: obj,
        timeout: 10000,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        if (res.status == 200) {
          this.$message.success('薪酬导入成功')
          this.dialogVisible2 = false
          this.getList()
        } else {
          this.$message.error('系统错误')
        }
      }).catch(res => {
        this.$message.error('导入失败,请稍后重试')
      })
    }
  }
}
</script>
<style scoped>
.filter-item{position: relative;}
</style>
