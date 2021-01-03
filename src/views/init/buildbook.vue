<template>
  <div class="app-container">
    <div class="contentDiv">
      <div class="title">{{ $route.path === '/init/buildbook' ? '新建账套' : '编辑账套' }}</div>
      <el-form ref="dataForm" :rules="rules1" inline :model="temp" label-position="left" label-width="70px" style="width: 1030px; margin-left:10px;">
        <el-form-item label="账套名称" prop="bookName">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-input v-model="temp.bookName" size="small" placeholder="账套名称" style="width:205px" @focus="focusThis($event)" />
        </el-form-item>
        <el-form-item label="科目体系" prop="coahierarchyId">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-select v-model="temp.coahierarchyId" size="small" style="width:185px" :disabled="!!userInfo.glBookEntity">
            <el-option v-for="item in coaHierarchyList" :key="item.id" :label="item.coaHierarchyName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="本位币" prop="baseCurrencyCode" label-width="56px">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-select v-model="temp.baseCurrencyCode" size="small" style="width:125px" disabled>
            <el-option v-for="item in currencyList" :key="item.id" :label="item.text" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用期间" prop="enablePeriodYear">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-select v-model="temp.enablePeriodYear" size="small" style="width: 90px" :disabled="!!userInfo.glBookEntity">
            <el-option v-for="item in [2018,2019,2020,2021,2022]" :key="item" :value="item" :label="item" />
          </el-select>
          <label>年</label>
          <el-select v-model="temp.enablePeriodNum" size="small" style="width: 75px" :disabled="!!userInfo.glBookEntity">
            <el-option v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="item" :value="item" :label="item" />
          </el-select>
          <label>月</label>
        </el-form-item>
        <el-form-item label="科目级次" prop="coaLevel">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-select v-model="temp.coaLevel" size="small" style="width:80px" :disabled="!!userInfo.glBookEntity">
            <el-option v-for="item in [4,5,6,7,8]" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目编码规则" label-width="100px" prop="codingRule">
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <span class="">4 - 2 - 2 -</span>
          <select v-model="codingRuleArr[3]" class="inputItem" :disabled="!!userInfo.glBookEntity">
            <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="temp.coaLevel>4">-</span>
          <select v-if="temp.coaLevel>4" v-model="codingRuleArr[4]" class="inputItem" :disabled="!!userInfo.glBookEntity">
            <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="temp.coaLevel>5">-</span>
          <select v-if="temp.coaLevel>5" v-model="codingRuleArr[5]" class="inputItem" :disabled="!!userInfo.glBookEntity">
            <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="temp.coaLevel>6">-</span>
          <select v-if="temp.coaLevel>6" v-model="codingRuleArr[6]" class="inputItem" :disabled="!!userInfo.glBookEntity">
            <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
          </select>
          <span v-if="temp.coaLevel>7">-</span>
          <select v-if="temp.coaLevel>7" v-model="codingRuleArr[7]" class="inputItem" :disabled="!!userInfo.glBookEntity">
            <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
          </select>
        </el-form-item>
        <el-form-item>
          <span>自定义增值税率</span>
          <el-tooltip class="item" effect="dark" content="提示提示提示提示提示提示" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-input v-model="temp.defaultTaxRateStr" placeholder="" size="mini" style="width:50px;margin-right:5px" />%
          <span style="font-size:12px;margin-right:10px">(小规模纳税人为3%，一般纳税人为13%)</span>
          <el-checkbox v-model="temp.isDispName" :false-label="0" :true-label="1" style="margin-right:10px">科目名称显示路径</el-checkbox>
          <el-checkbox v-model="temp.isCoaCobinationCode" :false-label="0" :true-label="1" style="margin-right:10px">凭证中显示辅助项编码组合</el-checkbox>
        </el-form-item>
        <el-form-item label="新增凭证时默认凭证日期" label-width="180px">
          <el-radio-group v-model="temp.isVoucherMaxDate">
            <el-radio :label="0" style="margin-right:10px">当前日期</el-radio>
            <el-radio :label="1">最大凭证日期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="temp.isQuantity" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用数量核算</el-checkbox>
          <el-checkbox v-model="temp.isCurrency" :false-label="0" :true-label="1" style="margin-right:500px" disabled>启用币种核算</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="temp.isAuxSupplier" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用供应商核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxCust" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用客户核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxDept" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用部门核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxStaff" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用职员核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxInv" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用品类核算(一级)</el-checkbox>
          <el-checkbox v-model="temp.isAuxItem" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用存货核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxProj" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用项目核算</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="temp.isAutoAuditWhenAutoSave" :false-label="0" :true-label="1" style="margin-right:10px">自动凭证在保存时自动审核</el-checkbox>
          <el-checkbox v-model="temp.autoAuditFlag" :false-label="0" :true-label="1" style="margin-right:10px" :disabled="temp.isAutoTransfer==1">结账时自动审核凭证</el-checkbox>
          <el-checkbox v-model="temp.isAutoTransfer" :false-label="0" :true-label="1" style="margin-right:10px" @change="autoTransferChange">期末自动结转、结账</el-checkbox>
          <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJzdtfy" :false-label="0" :true-label="1" style="margin-right:10px">自动结转待摊费用</el-checkbox>
          <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJzwjzzs" :false-label="0" :true-label="1" style="margin-right:10px">自动结转未缴增值税</el-checkbox>
          <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJtzj" :false-label="0" :true-label="1" style="margin-right:10px">自动计提折旧</el-checkbox>
          <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJtgz" :false-label="0" :true-label="1" style="margin-right:10px">自动计提工资</el-checkbox>
          <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJzwfplr" :false-label="0" :true-label="1" style="margin-right:10px">自动结转未分配利润(年末结转)</el-checkbox>
        </el-form-item>
        <el-form-item v-if="temp.isAutoTransfer==1" label="自动计提附加税" prop="isAutoJtfjs" label-width="120px" style="margin-right:20px">
          <el-radio-group v-model="temp.isAutoJtfjs">
            <el-radio :label="0" style="margin-right:10px">不计提</el-radio>
            <el-radio :label="1" style="margin-right:10px">按月</el-radio>
            <el-radio :label="3">按季</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.isAutoTransfer==1" label="自动结转损益(期末结转)" prop="isAutoJzsy" label-width="170px" style="margin-left:10px">
          <el-radio-group v-model="temp.isAutoJzsy">
            <el-radio :label="0" style="margin-right:10px">不结转</el-radio>
            <el-radio :label="1" style="margin-right:10px">合并结转</el-radio>
            <el-radio :label="2">分开结转</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.isAutoTransfer==1">
          <span>城市建设维护税</span>
          <el-input v-model="temp.isAutoJtfjs7" style="width:45px" size="small" />%
          <span style="margin-left:5px">教育附加</span>
          <el-input v-model="temp.isAutoJtfjs3" style="width:45px" size="small" />%
          <span style="margin-left:5px">地方教育附加</span>
          <el-input v-model="temp.isAutoJtfjs2" style="width:45px" size="small" />%
          <span style="margin-left:5px">自动结转成本</span>
          <el-input v-model="temp.isAutoJzcb" style="width:45px" size="small" disabled />%
          <span style="margin-left:5px">自动计提所得税</span>
          <el-input v-model="temp.isAutoJtsds" style="width:45px" size="small" />%
        </el-form-item>
        <div v-if="temp.isAutoTransfer==1" style="margin-bottom: 3px"><label style="font-size:14px">自动生成凭证</label></div>
        <el-form-item v-if="temp.isAutoTransfer==1">
          <el-checkbox v-model="temp.isPurchase" :false-label="0" :true-label="1">进货单</el-checkbox>
          <el-checkbox v-model="temp.isPurchaseReturned" :false-label="0" :true-label="1">采购退货单</el-checkbox>
          <el-checkbox v-model="temp.isSales" :false-label="0" :true-label="1">销售单/销售订单</el-checkbox>
          <el-checkbox v-model="temp.isSalesReturned" :false-label="0" :true-label="1">销售退货单</el-checkbox>
          <el-checkbox v-model="temp.isPresale" :false-label="0" :true-label="1">预收单</el-checkbox>
          <el-checkbox v-model="temp.isPresaleReturned" :false-label="0" :true-label="1">预收退款单</el-checkbox>
          <el-checkbox v-model="temp.isReceipt" :false-label="0" :true-label="1">收款单</el-checkbox>
          <el-checkbox v-model="temp.isPayment" :false-label="0" :true-label="1">付款单</el-checkbox>
          <el-checkbox v-model="temp.isInventory" :false-label="0" :true-label="1">盘点单</el-checkbox>
        </el-form-item>
        <div v-if="temp.isAutoTransfer==1 || temp.autoAuditFlag == 1" style="margin-bottom: 8px"><label style="font-size:14px">自动凭证制单/审核/记账签名</label></div>
        <div v-if="temp.isAutoTransfer==1 || temp.autoAuditFlag == 1" class="staffDiv">
          <el-form-item label="制单人:" label-width="60px" prop="jeRecorderId">
            <el-select ref="staff1" v-model="temp.jeRecorderId" style="width:110px" placeholder="制单人" size="small" @change="changeVal1">
              <el-option label="无" :value="null" />
              <el-option v-for="item in userlist" :key="item.id" :label="item.text" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="签名:" label-width="45px" prop="sign1">
            <el-input v-model="temp.sign1" size="small" placeholder="制单人签名" />
          </el-form-item>
          <el-form-item label="审核人:" label-width="60px" prop="jeAuditorId">
            <el-select ref="staff2" v-model="temp.jeAuditorId" style="width:110px" placeholder="审核人" size="small" @change="changeVal2">
              <el-option label="无" :value="null" />
              <el-option v-for="item in userlist" :key="item.id" :label="item.text" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="签名:" label-width="45px" prop="sign2">
            <el-input v-model="temp.sign2" size="small" placeholder="审核人签名" />
          </el-form-item>
          <el-form-item label="记账人:" label-width="60px" prop="jePosterId">
            <el-select ref="staff3" v-model="temp.jePosterId" style="width:110px" placeholder="记账人" size="small" @change="changeVal3">
              <el-option label="无" :value="null" />
              <el-option v-for="item in userlist" :key="item.id" :label="item.text" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="签名:" label-width="45px" prop="sign3">
            <el-input v-model="temp.sign3" size="small" placeholder="记账人签名" />
          </el-form-item>
        </div>
      </el-form>
      <div class="tx-c" style="margin-top:25px">
        <el-button @click="$store.dispatch('tagsView/delView', $route);$router.replace('/init/book')">取 消</el-button>
        <el-button type="primary" @click="saveData()">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getmanagementInfo, registerLoadTaxfilingcategory, saveBook, getCurrencyList, getCoaHierarchy, getAccount, getUsers } from '@/api/user'
export default {
  name: 'Buildbook',
  data() {
    return {
      dialogFormVisible: false,
      managementInfo: {},
      accountInfo: {},
      userInfo: {},
      codingRuleArr: [4, 2, 2, 2, 2, 2, 2, 2],
      userlist: [],
      temp: {
        id: '',
        bookName: '',
        baseCurrencyCode: 'CNY',
        enablePeriodYear: new Date().getFullYear(),
        enablePeriodNum: new Date().getMonth() + 1,
        coahierarchyId: '2',
        defaultTaxRateStr: '',
        isAutoAuditWhenAutoSave: 1,
        coaLevel: 5,
        codingRule: '4-2-2-2-2-2-2-2',
        isAutoJtfjs: 0,
        isCoaCobinationCode: 0,
        autoVoucherType: 0,
        isVoucherMaxDate: 0,
        isDispName: 0,
        isAutoJtfjs2: 2,
        isAutoJtfjs3: 3,
        isAutoJtfjs7: 7,
        isAutoJzwjzzs: 0,
        isAutoJtgz: 0,
        autoAuditFlag: 0,
        isAutoJtsds: 25,
        isAutoJtzj: 0,
        isAutoJzcb: 100,
        isAutoJzdtfy: 0,
        isAutoJzsy: 0,
        isAutoJzwfplr: 0,
        isAutoTransfer: 0,
        isAuxCust: 0,
        isAuxDept: 0,
        isAuxItem: 0,
        isAuxInv: 0,
        isAuxProj: 0,
        isAuxStaff: 0,
        isAuxSupplier: 0,
        isQuantity: 0,
        jeRecorderId: '',
        jeAuditorId: '',
        jePosterId: '',
        sign1: '',
        sign2: '',
        sign3: '',
        isPurchase: 1,
        isPurchaseReturned: 1,
        isSales: 1,
        isSalesReturned: 1,
        isPresale: 1,
        isPresaleReturned: 1,
        isReceipt: 1,
        isPayment: 1,
        isInventory: 1
      },
      rules1: {
        orgName: [{ required: true, message: '企业全称不能为空', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择企业所在地', trigger: 'change' }],
        industryId: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
        taxFilingCategoryId: [{ required: true, message: '请选择纳税类型', trigger: 'change' }]
      },
      userInfo: JSON.parse(sessionStorage.userInfo),
      userList: {},
      currencyList: [],
      coaHierarchyList: [],
      taxfillingcategoryList: []
    }
  },
  mounted() {
    this.getData()
    registerLoadTaxfilingcategory().then(res => {
      this.taxfillingcategoryList = res.data.data
    })
    getCurrencyList().then(res => {
      this.currencyList = res.data.data
    })
    getCoaHierarchy().then(res => {
      this.coaHierarchyList = res.data.data
    })
    getUsers().then(res => {
      this.userlist = res.data.data
    })
  },
  methods: {
    focusThis(e) {
      e.currentTarget.select()
    },
    changeVal1() {
      this.$nextTick(() => {
        this.temp.sign1 = this.$refs.staff1.selected.label
      })
    },
    changeVal2() {
      this.$nextTick(() => {
        this.temp.sign2 = this.$refs.staff2.selected.label
      })
    },
    changeVal3() {
      this.$nextTick(() => {
        this.temp.sign3 = this.$refs.staff3.selected.label
      })
    },
    autoTransferChange(val) {
      if (val) {
        this.temp.autoAuditFlag = 1
      }
    },
    saveData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.temp.codingRule = this.codingRuleArr.join('-')
          saveBook(this.temp).then(res => {
            this.$message.success(res.data.msg)
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace('/init/book')
          })
        }
      })
    },
    getNum(num) {
      var x = String(num).indexOf('.') + 1// 得到小数点的位置
      var y = String(num).length - x// 小数点的位数
      if (y == 0) {
        return x
      }
      if (y > 0) {
        return y
      }
    },
    formatNum(num) {
      if (!num) { return 0 }
      if (this.getNum(num) == 2) {
        return Number(num * 100).toFixed(0)
      } else {
        return Number(num * 100).toFixed(2)
      }
    },
    getData() {
      getmanagementInfo().then(res => {
        if (res.data.errorCode === '0') {
          this.managementInfo = res.data.data[0] || {}
        }
      })
      getAccount().then(res => {
        if (res.data.errorCode === '0') {
          this.accountInfo = res.data.data[0] || {}
          if (this.accountInfo != {}) {
            this.accountInfo.defaultTaxRateStr = this.formatNum(this.accountInfo.defaultTaxRate)
            this.accountInfo.isAutoJtfjs7 = this.formatNum(this.accountInfo.isAutoJtfjs7)
            this.accountInfo.isAutoJtfjs2 = this.formatNum(this.accountInfo.isAutoJtfjs2)
            this.accountInfo.isAutoJtfjs3 = this.formatNum(this.accountInfo.isAutoJtfjs3)
            this.accountInfo.isAutoJzcb = this.formatNum(this.accountInfo.isAutoJzcb)
            this.accountInfo.isAutoJtsds = this.formatNum(this.accountInfo.isAutoJtsds)
          }
        }
        if (this.$route.path === '/init/buildbook') {
          this.codingRuleArr = [4, 2, 2, 2, 2, 2, 2, 2]
          this.temp.bookName = this.managementInfo.orgName
        } else {
          for (var key in this.temp) {
            this.temp[key] = this.accountInfo[key]
          }
          this.temp.isAutoJzcb = 100
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-form-item__label{padding-right: 5px;}
.panel-group {
    .card-panel-col {
        margin-bottom: 32px;
    }
}

/deep/ .el-card__header {
    padding: 10px 15px
}

/deep/ .el-card__body {
    padding: 10px 20px 15px;
}

/deep/ .el-input__inner{
    padding: 0 5px;
}

/deep/ .el-form-item {
    margin-bottom: 16px;
}
/deep/ .staffDiv .el-input{width: 96px;}
</style>
<style scoped>
.title{margin-bottom: 15px; font-size: 16px; font-weight: bold; }
.listItem {
    height: 42px;
    line-height: 42px;
    border-bottom: 1px #eee solid;
    font-size: 14px;
    color: #333
}

.spanItem1 {
    width: 20px;
    line-height: 28px;
    display: inline-block;
    text-align: center;
}

.spanItem2 {
    width: 60px;
    line-height: 28px;
    display: inline-block;
    text-align: center;
}

.inputItem {
    width: 32px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}

.listItem:last-child {
    border-bottom: none
}

.listItem label {
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
    width: 80px;
}
</style>
