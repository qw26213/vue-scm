everyday<template>
  <div class="app-container">
    <div class="dataTable">
      <el-form :inline="true" label-position="left" label-width="120px" style="width:750px; margin:10px auto;">
        <el-form-item label="单据日期:" prop="billDate">
          <el-date-picker v-model="temp.billDate" :editable="false" class="input-item" type="date" placeholder="单据日期" size="small" :clearable="false" value-format="yyyy-MM-dd" disabled />
        </el-form-item>
        <el-form-item label="单据号:" prop="billNo">
          <el-input v-model="temp.billNo" size="small" class="input-item" placeholder="单据号" disabled />
        </el-form-item>
        <el-form-item label="开始日期:" prop="billDate">
          <el-date-picker v-model="temp.beginDate" :editable="false" class="input-item" type="date" placeholder="单据日期" size="small" :picker-options="pickerOptions" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="结束日期:" prop="billDate">
          <el-date-picker v-model="temp.endDate" :editable="false" class="input-item" type="date" placeholder="单据日期" size="small" :picker-options="pickerOptions" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="业务员:" prop="staffId">
          <el-select v-model="temp.staffId" style="width:240px" disabled placeholder="选择业务员" size="small">
            <el-option v-for="item in stafflist" :key="item.id" :label="item.staffName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="销售单数:" prop="soBillNum">
          <el-input v-model="temp.soBillNum" size="small" class="input-item" placeholder="销售单数" disabled />
        </el-form-item>
        <el-form-item label="销售退款单数:" prop="soReturnedBillNum">
          <el-input v-model="temp.soReturnedBillNum" size="small" class="input-item" placeholder="销售单数" disabled />
        </el-form-item>
        <el-form-item label="预收单数:" prop="psBillNum">
          <el-input v-model="temp.psBillNum" size="small" class="input-item" placeholder="预收单数" disabled />
        </el-form-item>
        <el-form-item label="预收退款单数:" prop="psReturnedBillNum">
          <el-input v-model="temp.psReturnedBillNum" size="small" class="input-item" placeholder="预收退款单数" disabled />
        </el-form-item>
        <el-form-item label="收款单数:" prop="receiptBillNum">
          <el-input v-model="temp.receiptBillNum" size="small" class="input-item" placeholder="收款单数" disabled />
        </el-form-item>
        <el-form-item label="付款单数:" prop="paymentNum">
          <el-input v-model="temp.paymentNum" size="small" class="input-item" placeholder="付款单数" disabled />
        </el-form-item>
        <el-form-item label="销售现金金额:" prop="soCurrAmount">
          <el-input v-model="temp.soCurrAmount" size="small" class="input-item" placeholder="销售现金金额" disabled />
        </el-form-item>
        <el-form-item label="销售退款现金金额:" prop="soReturnedCurrAmount">
          <el-input v-model="temp.soReturnedCurrAmount" size="small" class="input-item" placeholder="销售退款现金金额" disabled />
        </el-form-item>
        <el-form-item label="预收款现金金额:" prop="psCurrAmount">
          <el-input v-model="temp.psCurrAmount" size="small" class="input-item" placeholder="预收款现金金额" disabled />
        </el-form-item>
        <el-form-item label="预收款退款现金金额:" prop="psReturnedCurrAmount">
          <el-input v-model="temp.psReturnedCurrAmount" size="small" class="input-item" placeholder="预收款退款现金金额" disabled />
        </el-form-item>
        <el-form-item label="收款现金金额:" prop="receiptCurrAmount">
          <el-input v-model="temp.receiptCurrAmount" size="small" class="input-item" placeholder="收款现金金额" disabled />
        </el-form-item>
        <el-form-item label="付款现金金额:" prop="paymentCurrAmount">
          <el-input v-model="temp.paymentCurrAmount" size="small" class="input-item" placeholder="付款现金金额" disabled />
        </el-form-item>
        <el-form-item label="现金合计:" prop="sumCurrAmount">
          <el-input v-model="temp.sumCurrAmount" size="small" class="input-item" placeholder="现金合计" disabled />
        </el-form-item>
        <el-form-item label="开始余额:" prop="beginBalance">
          <el-input v-model="temp.beginBalance" size="small" class="input-item" placeholder="开始余额" disabled />
        </el-form-item>
        <el-form-item label="交款金额:" prop="settleCurrAmount">
          <el-input v-model="temp.settleCurrAmount" size="small" class="input-item" placeholder="交款金额" />
        </el-form-item>
        <el-form-item label="余额:" prop="balance">
          <el-input v-model="temp.balance" size="small" class="input-item" placeholder="余额" disabled />
        </el-form-item>
      </el-form>
      <div class="tx-c" style="margin-top:15px">
        <el-button v-if="$route.path.indexOf('etail') < 0" class="submitBtn" type="primary" @click="save">保 存</el-button>
        <el-button v-else class="submitBtn" type="primary" @click="$store.dispatch('tagsView/delView', $route);$router.replace('/sale/everyday')">返 回</el-button>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="选择截止日期" :visible.sync="dialogFormVisible" :show-close="false" width="420px">
      <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="88px" style="width:400px; margin:10px 25px;">
        <el-form-item label="业务员:" prop="staffId">
          <el-select v-model="form.staffId" style="width:240px" placeholder="选择业务员" size="small">
            <el-option v-for="item in stafflist" :key="item.id" :label="item.staffName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期:" prop="endDate">
          <el-date-picker v-model="form.endDate" :editable="false" class="input-item" type="date" placeholder="截止日期" size="small" :clearable="false" :picker-options="pickerOptions" value-format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="initEveryday">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveEverydayTotal, queryDataByStaffId, getEverydayTotalById } from '@/api/sale'
import { getStaff } from '@/api/basedata'
export default {
  name: 'EverydayAdd',
  data() {
    return {
      id: '',
      isDisabled: false,
      status: this.$route.query.status,
      invCatgList: [],
      stafflist: [],
      temp: {
        billNo: '',
        staffId: '',
        beginDate: '',
        endDate: '',
        beginBalance: '',
        auditDate: '',
        auditor: '',
        balance: 0
      },
      form: {
        staffId: '',
        endDate: ''
      },
      dialogFormVisible: false,
      settleData: [{}, {}, {}, {}, {}],
      rules: {
        staffId: [{ required: true, message: '业务员不能为空', trigger: 'change' }],
        endDate: [{ required: true, message: '截止日期不能为空', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    getStaff().then(res => {
      this.stafflist = res.data.data || []
    })
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      getEverydayTotalById(this.id).then(res => {
        for (var key in this.temp) {
          this.temp[key] = res.data.data[key]
        }
      })
    } else {
      this.showModal()
    }
  },
  beforeDestroy() {
    this.dialogFormVisible = false
  },
  methods: {
    showModal() {
      this.dialogFormVisible = true
    },
    initEveryday() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.form
          queryDataByStaffId(data).then(res => {
            this.temp = res.data.data
            this.dialogFormVisible = false
          })
        }
      })
    },
    save() {
      this.temp.id = this.id
      saveEverydayTotal(this.temp).then(res => {
        if (res.data.errorCode === '0') {
          this.$message.success(this.temp.id === '' ? '新增成功' : '修改成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/sale/everyday')
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('保存失败，请稍后重试！')
      })
    }
  }
}
</script>
<style scoped>
.input-item{width: 240px;}
</style>

