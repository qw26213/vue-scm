<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="display:inline-block;line-height:28px">账套信息</span>
            <el-button v-if="!!userInfo.glBookEntity" type="primary" style="float: right;margin-right:10px" size="small" @click="handleCompile">编辑</el-button>
            <el-button v-if="!!userInfo.glBookEntity" type="danger" style="float: right;margin-right:20px" size="small" @click="resetAcc">重置</el-button>
            <el-button v-if="!!!userInfo.glBookEntity" type="primary" style="float: right;margin-right:10px" size="small" @click="handleAdd">建账</el-button>
          </div>
          <div class="listItem"><label>企业代码:</label>{{ managementInfo.orgCode }}</div>
          <div class="listItem"><label>企业名称:</label>{{ managementInfo.orgName }}</div>
          <div class="listItem"><label>所属行业:</label>{{ managementInfo.industryName }}</div>
          <div class="listItem"><label>所属区域:</label>{{ managementInfo.areaName }}</div>
          <div class="listItem">
            <label>纳税类型:</label>{{ managementInfo.taxFilingCategoryName }}
            <el-button v-if="managementInfo.taxFilingCategoryId==0" type="default" style="margin-left:20px" size="small" @click="handleTransfer">转为一般纳税人</el-button>
            <el-button v-if="managementInfo.taxFilingCategoryId==1" type="default" style="margin-left:20px" size="small" @click="handleTransfer">转为小规模纳税人</el-button>
          </div>
          <div class="listItem"><label>试用期:</label>{{ managementInfo.bizExpirationDate }}</div>
          <div class="listItem"><label>账簿名称:</label>{{ managementInfo.bookName }}</div>
          <!-- <div class="listItem"><label>审核级次:</label>{{managementInfo.auditLevel}}</div> -->
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getmanagementInfo, resetAccount, updateTaxFilingCategory, getAccount } from '@/api/user'
export default {
  name: 'createBill',
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: 'create',
      managementInfo: {},
      accountInfo: {},
      userInfo: {},
      codingRuleArr: [4, 2, 2, 2, 2, 2, 2, 2],
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
        codingRule: '4-2-2-2-2',
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
        isAuxProj: 0,
        isAuxStaff: 0,
        isAuxSupplier: 0,
        isQuantity: 0
      },
      rules1: {
        orgName: [{ required: true, message: '企业全称不能为空', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择企业所在地', trigger: 'change' }],
        industryId: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
        taxFilingCategoryId: [{ required: true, message: '请选择纳税类型', trigger: 'change' }]
      },
      userInfo: JSON.parse(sessionStorage.userInfo)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    autoTransferChange(val) {
      if (val) {
        this.temp.autoAuditFlag = 1
      }
    },
    handleTransfer() {
      const obj = {
        categoryId: this.managementInfo.taxFilingCategoryId == 0 ? '1' : '0'
      }
      updateTaxFilingCategory(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.$message.success(res.data.msg)
          this.getData()
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    resetAcc() {
      this.$confirm('账套的所有初始数据,包括科目,科目余额表等将全部被重置,确定要重置这个账套吗?', '警告', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetAccount().then(res => {
          if (res.data.errorCode == 0) {
            this.$message.success(res.data.msg)
            this.$store.dispatch('user/logout').then(() => {
              this.$router.replace('/login')
            })
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    handleCompile() {
      this.$router.push('/init/modifybook')
    },
    handleAdd() {
      var txt = '科目体系、本位币、启用期间、科目编码规则在建账后不可再更改；科目如果已被使用,则该科目的数量核算和辅助核算选择不可再更改。'
      this.$confirm(txt, '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/init/buildbook')
      }).catch(() => {
        console.log('取消')
      })
    },
    formatNum(num) {
      if (!num) { return 0 }
      if (String(num).indexOf('.') < 0) {
        return num.toFixed(0)
      } else {
        return num.toFixed(2)
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
            this.accountInfo.defaultTaxRateStr = this.formatNum(this.accountInfo.defaultTaxRate * 100)
            this.accountInfo.isAutoJtfjs7 = this.formatNum(this.accountInfo.isAutoJtfjs7 * 100)
            this.accountInfo.isAutoJtfjs2 = this.formatNum(this.accountInfo.isAutoJtfjs2 * 100)
            this.accountInfo.isAutoJtfjs3 = this.formatNum(this.accountInfo.isAutoJtfjs3 * 100)
            this.accountInfo.isAutoJzcb = this.formatNum(this.accountInfo.isAutoJzcb * 100)
            this.accountInfo.isAutoJtsds = this.formatNum(this.accountInfo.isAutoJtsds * 100)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
    .card-panel-col {
        margin-bottom: 32px;
    }
}

/deep/.el-card__header {
    padding: 10px 15px
}

/deep/.el-card__body {
    padding: 10px 20px 15px;
}
/deep/ .el-input__inner{
    padding: 0 5px;
}
/deep/.el-form-item {
    margin-bottom: 16px;
}
</style>
<style scoped>
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
