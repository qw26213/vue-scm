<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.periodCode" :editable="false" type="month" placeholder="选择月份" size="small" value-format="yyyy-MM" />
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="copyPay">复制工资表</el-button>
      <el-button-group style="float:right">
        <el-button type="primary" size="small" @click="exportBook">导出</el-button>
      </el-button-group>
    </div>
    <input ref="uploadFile" enctype="multipart/form-data" style="display:none" type="file" @change="importFile($event)">
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="员工编号" min-width="100" prop="employeeCode" />
        <el-table-column label="姓名" min-width="100" prop="employeeName" />
        <el-table-column label="部门" align="center" width="100" prop="deptName" />
        <el-table-column label="证照类型" min-width="100" prop="certificateName" />
        <el-table-column label="证照号码" min-width="100" prop="certificateNumber" />
        <el-table-column label="手机号" align="center" width="100" prop="tel" />
        <el-table-column label="费用类型" align="center" width="100" prop="expensesName" />
        <el-table-column label="基本工资" align="right" width="100" prop="basicSalary" />
        <el-table-column label="奖金及提成" align="right" width="100" prop="bonus" />
        <el-table-column label="合计" align="right" width="100" prop="salary" />
        <el-table-column label="餐补" align="right" width="100" prop="mealAllowance" />
        <el-table-column label="交通补贴" align="right" width="100" prop="travelAllowance" />
        <el-table-column label="通讯补贴" align="right" width="100" prop="phoneAllowance" />
        <el-table-column label="其它" align="right" width="100" prop="otherAllowance" />
        <el-table-column label="合计" align="right" width="100" prop="allowanceSum" />
        <el-table-column label="考勤扣款" align="right" width="100" prop="dockPay" />
        <el-table-column label="工资总额" align="right" width="100" prop="income" />
        <el-table-column label="免征额" align="right" width="100" prop="taxExemption" />
        <el-table-column label="养老保险" align="right" width="100" prop="endowment" />
        <el-table-column label="医疗保险" align="right" width="100" prop="medical" />
        <el-table-column label="失业保险" align="right" width="100" prop="unemployment" />
        <el-table-column label="住房公积金" align="right" width="100" prop="housingFund" />
        <el-table-column label="合计" align="right" width="100" prop="withholdingSum" />
        <el-table-column label="子女教育" align="right" width="100" prop="childrenEdu" />
        <el-table-column label="继续教育" align="right" width="100" prop="continuingEdu" />
        <el-table-column label="房贷利息" align="right" width="100" prop="housingLoan" />
        <el-table-column label="房租" align="right" width="100" prop="housingRent" />
        <el-table-column label="赡养父母" align="right" width="100" prop="supportingParents" />
        <el-table-column label="其它" align="right" width="100" prop="other" />
        <el-table-column label="合计" align="right" width="100" prop="specialDeductionSum" />
        <el-table-column label="当月扣除" align="right" width="100" prop="deductedSum" />
        <el-table-column label="应税所得额" align="right" width="100" prop="taxable" />
        <el-table-column label="代扣个税" align="right" width="100" prop="tax" />
        <el-table-column label="实发工资" align="right" width="100" prop="actualWages" />
        <el-table-column label="本年工资累计" align="right" width="120" prop="yearIncome" />
        <el-table-column label="本年扣除累计" align="right" width="120" prop="yearDeducted" />
        <el-table-column label="本年个税累计" align="right" width="120" prop="yearTax" />
        <el-table-column label="备注" align="left" width="100" prop="remarks" />
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog title="复制薪酬" :visible.sync="dialogVisible" width="460px">
        <el-form ref="dataForm" :model="copyForm" label-position="left" label-width="72px" style="margin-left:10px;width:400px">
            <el-form-item label="目标月份">
                <el-date-picker v-model="copyForm.periodCode" :editable="false" type="month" placeholder="目标月份" style="width:200px" value-format="yyyy-MM" />
            </el-form-item>
            <el-form-item label="是否覆盖">
                <el-radio v-model="copyForm.isCover" :label="1">是</el-radio>
                <el-radio v-model="copyForm.isCover" :label="0">否</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave()">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSalaryData, getNationalityType, getCertificateType, saveEmployee, paydetailImport, exportSalary, copySalary } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { debounce, getNowMonth, getNowDate } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'salarydetail',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      downloadModel: debounce(this.downloadFile, 1000, true),
      listQuery: {
        periodCode: this.$route.query.pericode,
        page: 1,
        limit: 20
      },
      copyForm: {
          headerId: '',
          periodCode: getNowMonth(),
          isCover: 1
      },
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const pericode = this.listQuery.periodCode
      getSalaryData(pericode).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleSave() {
      copySalary(this.copyForm).then(res => {
        if (res.data.errorCode == 0) {
          this.$message.success('复制成功')
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    copyPay(row) {
      this.copyForm.headerId = this.$route.query.id
      this.dialogVisible = true
    },
    exportBook() {
        const obj = { periodCode: this.listQuery.periodCode, headerId: this.$route.query.id }
        exportSalary(obj)
    }
  }
}
</script>
<style scoped>
.filter-item{position: relative;}
</style>
