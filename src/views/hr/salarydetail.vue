<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.periodCode1" :editable="false" type="month" placeholder="开始月份" size="small" value-format="yyyy-MM" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.periodCode2" :editable="false" type="month" placeholder="结束月份" size="small" value-format="yyyy-MM" />
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="copyPay">复制工资表</el-button>
      <el-button size="small" type="primary" @click="downloadModel">下载模板</el-button>
      <el-button size="small" type="primary" @click="handImport">薪酬导入</el-button>
    </div>
    <input ref="uploadFile" enctype="multipart/form-data" style="display:none" type="file" @change="importFile($event)">
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="员工编号" min-width="100" prop="name" />
        <el-table-column label="姓名" min-width="100" prop="employeeName" />
        <el-table-column label="部门" align="center" width="100" prop="deptName" />
        <el-table-column label="证照类型" min-width="100" prop="certificateName" />
        <el-table-column label="证照号码" min-width="100" prop="certificateNumber" />
        <el-table-column label="手机号" align="center" width="100" prop="tel" />
        <el-table-column label="费用类型" align="center" width="100" prop="expensesType" />
        <el-table-column label="基本工资" align="right" width="100" prop="endDate" />
        <el-table-column label="奖金及提成" align="right" width="100" prop="endDate" />
        <el-table-column label="合计" align="right" width="100" prop="revenue" />
        <el-table-column label="餐补" align="right" width="100" prop="endDate" />
        <el-table-column label="交通补" align="right" width="100" prop="endDate" />
        <el-table-column label="通讯补" align="right" width="100" prop="remarks" />
        <el-table-column label="其它" align="right" width="100" prop="endDate" />
        <el-table-column label="合计" align="right" width="100" prop="endDate" />
        <el-table-column label="考勤扣款" align="right" width="100" prop="remarks" />
        <el-table-column label="工资总额" align="right" width="100" prop="remarks" />
        <el-table-column label="免征额" align="right" width="100" prop="remarks" />
        <el-table-column label="养老保险" align="right" width="100" prop="endowment" />
        <el-table-column label="医疗保险" align="right" width="100" prop="medical" />
        <el-table-column label="失业" align="right" width="100" prop="unemployment" />
        <el-table-column label="公积金" align="right" width="100" prop="housing" />
        <el-table-column label="合计" align="right" width="100" prop="summation" />
        <el-table-column label="子女教育" align="right" width="100" prop="remarks" />
        <el-table-column label="继续教育" align="right" width="100" prop="remarks" />
        <el-table-column label="房贷利息" align="right" width="100" prop="remarks" />
        <el-table-column label="房租" align="right" width="100" prop="remarks" />
        <el-table-column label="赡养父母" align="right" width="100" prop="remarks" />
        <el-table-column label="其它" align="right" width="100" prop="remarks" />
        <el-table-column label="合计" align="right" width="100" prop="delSummation" />
        <el-table-column label="当月扣除" align="right" width="100" prop="remarks" />
        <el-table-column label="应交所得税" align="right" width="100" prop="taxable" />
        <el-table-column label="代扣个税" align="right" width="100" prop="personal" />
        <el-table-column label="实发工资" align="right" width="100" prop="actualwages" />
        <el-table-column label="本年工资累计" align="right" width="120" prop="remarks" />
        <el-table-column label="本年扣除累计" align="right" width="120" prop="remarks" />
        <el-table-column label="本年个税累计" align="right" width="120" prop="remarks" />
        <el-table-column label="签字" align="right" width="100" prop="remarks" />
        <el-table-column label="备注" align="right" width="100" prop="remarks" />
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
  </div>
</template>

<script>
import { getSalaryData, getNationalityType, getCertificateType, saveEmployee, paydetailImport } from '@/api/hr'
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
      dialogVisible1: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const id = this.$route.query.id
      getSalaryData(id).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    copyPay() {
      this.dialogVisible1 = true
    },
    importFile(event) {
      this.formData = new FormData()
      var fileObj = event.currentTarget.files[0]
      if (fileObj == null || fileObj == undefined) { return }
      this.formData.append('file', fileObj)
      this.formData.append('fileName', 'salary.xlsx')
      this.formData.append('periodCode', this.temp2.periodCode)
    }
  }
}
</script>
<style scoped>
.filter-item{position: relative;}
</style>
