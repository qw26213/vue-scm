<template>
  <div class="main">
    <div class="filterDiv">
      <label class="label">会计期间：</label>
      <el-select v-model="periodCode" size="small" placeholder="会计期间" @change="initBillStatus">
        <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
      <span style="font-size:14px;margin:0 20px">本期凭证数：{{ voucherNumber }}条</span>
      <el-button v-if="adjustmentPeriodFlag == 1" size="small" type="primary" style="width:100px" @click="executePeriodClose">结账</el-button>
      <el-button v-else size="small" type="primary" style="width:100px" @click="executeBackPeriodClose">反结账</el-button>
      <el-button size="small" type="default" style="width:100px" @click="getLog">日志</el-button>
    </div>
    <div class="contentDiv">
      <el-row :gutter="30">
        <el-col v-for="(item, index) in nameArr" :key="index" :span="6" style="margin-bottom: 20px">
          <el-card class="box-card" style="text-align:center;height:110px">
            <div class="itemTit">{{ item }}</div>
            <el-button v-if="jzCodeStrs.indexOf(codeArr[index])>=0" type="default" :disabled="isSeasonEnd&&index==4" plain @click="showJzVoucher(index)">查看凭证</el-button>
            <el-button v-else type="primary" size="small" :disabled="isSeasonEnd&&index==4" plain @click="createVoucher(index)">生成凭证</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog :close-on-click-modal="false" :title="curIndex==3?'设置附加税率':'设置企业所得税率'" :visible.sync="rateConfigVisiable" width="420px">
      <el-form ref="dataForm" :rules="rules" :model="rateForm" label-position="left" label-width="100px" style="width: 360px; margin-left:10px;">
        <el-form-item label="计提方式:" prop="month">
          <el-radio v-model="rateForm.month" :label="1">按月</el-radio>
          <el-radio v-model="rateForm.month" :label="3">按季</el-radio>
        </el-form-item>
        <el-form-item :label="curIndex==3?'城市建设税':'企业所得税'" prop="percent">
          <el-input v-model="rateForm.percent" :placeholder="curIndex==3?'城市建设税':'企业所得税'" style="width:240px;text-align:right" size="small" @input="formatInput($event)" /> <span>%</span>
        </el-form-item>
        <el-form-item v-if="curIndex == 3" label="教育费附加：" prop="percent1">
          <el-input v-model="rateForm.percent1" placeholder="教育费附加" style="width:240px;text-align:right" size="small" @input="formatInput($event)" /> <span>%</span>
        </el-form-item>
        <el-form-item v-if="curIndex == 3" label="地方教育费附加:" prop="percent2" label-width="120px">
          <el-input v-model="rateForm.percent2" placeholder="地方教育费附加" style="width:220px;text-align:right" size="small" @input="formatInput($event)" /> <span>%</span>
        </el-form-item>
        <p class="f12">注：请输入0-100的数</p>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="rateConfigVisiable = false">取消</el-button>
        <el-button type="primary" @click="saveRateConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="'生成结转凭证——'+nameArr[curIndex]" :visible.sync="dialogVisiable" width="1320px" top="5%">
      <voucherArea ref="voucherAdd" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getNowDate } from '@/utils'
import { backPeriodClose, periodClose, getPeriodState, getIdByPeriodJzCode, transLogList } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
import voucherArea from './add.vue'
export default {
  name: 'closePeriod',
  components: { coaList, summaryList, Pagination, voucherArea },
  data() {
    return {
      nameArr: ['结转成本', '结转待摊费用', '结转未缴增值税', '计提附加税', '计提折旧', '计提工资', '计提所得税', '结转收入', '结转费用', '结转损益(合并)', '结转未分配利润'],
      codeArr: ['jzcb', 'jzdtfy', 'jzwjzzs', 'jtfjs', 'jtzj', 'jtgz', 'jtsds', 'jzsr', 'jzfy', 'jzsy', 'jzwfplr'],
      curMonth: new Date().getMonth() + 1,
      searchPeriodId: '',
      searchPeriodYear: '',
      searchPeriodNum: 0,
      searchPeriodName: '',
      periodCode: '',
      voucherNumber: 0,
      curIndex: 0,
      isSeasonEnd: false,
      adjustmentPeriodFlag: -1,
      rateConfigVisiable: false,
      dialogVisiable: false,
      jzType: '',
      jzCode: '',
      createdVouterCount: 0,
      voucherList: [],
      rateForm: {},
      rules: {},
      jzCodeStrs: ''
    }
  },
  computed: {
    ...mapGetters([
      'periodArr',
      'coaArr',
      'summaryArr',
      'auxiliaryArr',
      'templetTypeList'
    ])
  },
  watch: {
    curMonth(val) {
      this.isSeasonEnd = val == '03' || val == '06' || val == '09' || val == '12'
    }
  },
  watch: {
    periodArr(val) {
      if (val.length > 0) {
        this.periodCode = val[0].id
        this.initBillStatus(this.periodCode)
      }
    }
  },
  created() {
    this.$store.dispatch('voucher/getCoaList', 0)
    this.$store.dispatch('voucher/getSummaryList')
    this.$store.dispatch('voucher/getTempletType')
    this.$store.dispatch('voucher/getAuxiliaryTypeList')
    this.$store.dispatch('voucher/getPeriod')
  },
  methods: {
    getLog() {
      transLogList(this.periodCode).then(res => {
        this.$alert(res.data.msg, '提示')
      })
    },
    formatInput(event) {
      event.currentTarget.value = event.currentTarget.replace(/[^\d.]/g, '')
    },
    closeModal() {
      this.dialogVisiable = false
    },
    createVoucher(index) {
      this.curIndex = index
      if (index == 3) {
        this.rateConfigVisiable = true
        this.rateForm = {
          month: 1,
          percent: 7,
          percent1: 3,
          percent2: 2
        }
      } else if (index == 6) {
        this.rateConfigVisiable = true
        this.rateForm = {
          month: 1,
          percent: 25
        }
      } else {
        this.dialogVisiable = true
        this.$nextTick(() => {
          this.$refs.voucherAdd.initJzVoucher(this.codeArr[index], this.periodCode, null)
        })
      }
    },
    saveRateConfig() {
      this.rateConfigVisiable = false
      this.$refs.voucherAdd.initJzVoucher(this.codeArr[this.curIndex], this.periodCode, this.rateForm)
    },
    initBillStatus(str) {
      getPeriodState(str).then(res => {
        this.searchPeriodId = res.data.data.glPeriod.id
        this.searchPeriodYear = res.data.data.glPeriod.periodYear
        this.searchPeriodNum = res.data.data.glPeriod.periodNum
        this.searchPeriodName = res.data.data.glPeriod.periodName
        this.periodCode = res.data.data.glPeriod.periodCode
        this.voucherNumber = res.data.data.jeHeaderCount
        this.adjustmentPeriodFlag = res.data.data.glPeriod.adjustmentPeriodFlag
        this.createdVouterCount = res.data.data.count
        if (this.createdVouterCount > 0) {
          this.voucherList = res.data.data.voucher
          var codeStrs = []
          this.voucherList.forEach(item => {
            codeStrs.push(item.jzCode)
          })
          this.jzCodeStrs = codeStrs
        }
      })
    },
    showJzVoucher(index) {
      const code = this.codeArr[index]
      const voucher = this.voucherList.find(item => {
        return item.jzCode === code
      })
      var obj = {
        periodCode: voucher.periodCode,
        jzCode: code
      }
      getIdByPeriodJzCode(obj).then(res => {
        this.dialogVisiable = true
        this.$nextTick(() => {
          this.$refs.voucherAdd.getJzVoucher(res.data.data)
        })
      })
    },
    // 反结账
    executeBackPeriodClose() {
      if (this.periodCode === '') {
        this.$message.warning('请选择会计期间!')
        return
      }
      const obj = {
        periodYear: this.periodCode.split('-')[0],
        periodNum: this.periodCode.split('-')[1],
        periodCode: this.periodCode
      }
      backPeriodClose(obj).then(res => {
        if (res.data.success) {
          this.$message.success(obj.periodCode + '及其之后期间反结转完成!')
          this.initBillStatus(obj.periodCode)
        }
        // } else {
        //   if (res.data.errorCode == '101') {
        //     this.$message.warning('期间' + obj.periodCode + '没有找到!')
        //   }
        //   if (res.data.errorCode == '102') {
        //     this.$message.warning('无法反结转，期间' + obj.periodCode + '没有结转!')
        //   }
        // }
      })
    },
    // 结账
    executePeriodClose() {
      if (this.periodCode === '') {
        this.$message.warning('请选择会计期间!')
        return
      }
      const obj = {
        periodYear: this.periodCode.split('-')[0],
        periodNum: this.periodCode.split('-')[1],
        periodCode: this.periodCode
      }
      periodClose(obj).then(res => {
        if (res.data.errorCode == '0') {
          this.$message.success(obj.periodYear + '年第' + obj.periodNum + '期结账完成!')
          this.initBillStatus(obj.periodCode)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/voucher.scss';
.main {
    min-width: 1200px;
    padding: 20px 24px;
}
.itemTit {
    color: #333;
    font-size: 16px;
    margin-bottom: 15px;
}
</style>
