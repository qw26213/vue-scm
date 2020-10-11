<template>
  <div class="app-container">
    <div class="dataTable">
      <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
        <el-form-item label="单据日期:" prop="billDate" label-width="72px">
          <el-date-picker v-model="temp.billDate" :editable="false" type="date" placeholder="单据日期" size="small" style="width:140px" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="单据号:" prop="billNo" label-width="50px">
          <el-input v-model="temp.billNo" size="small" placeholder="单据号" disabled />
        </el-form-item>
        <el-form-item label="客户:" prop="custId" label-width="40px">
          <custList key-type="custId" :select-id="temp.custId" :select-name="temp.custName" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="业务员:" prop="staffId" label-width="50px">
          <staffList :select-id="temp.staffId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="现结金额:" prop="amount" label-width="72px">
          <el-input v-model="temp.amount" size="small" placeholder="现结金额" style="width:75px" disabled />
          <el-button size="small" style="width:45px;padding:8px" @click="showSettleType">选择</el-button>
        </el-form-item>
        <el-button size="small" style="margin-top:3px" :disabled="!temp.custId" type="primary" @click="showSaleBill">选择采购单</el-button>
      </el-form>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" max-height="600">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="单据日期" align="center">
          <template slot-scope="{row}">
            <span v-html="row.billDate" />
          </template>
        </el-table-column>
        <el-table-column label="单据号" align="center">
          <template slot-scope="{row}">
            <span v-html="row.billNo" />
          </template>
        </el-table-column>
        <el-table-column label="单据金额" align="right">
          <template slot-scope="{row}">
            <span v-html="row.billAmount" />
          </template>
        </el-table-column>
        <el-table-column label="应收余额" align="right">
          <template slot-scope="{row}">
            <span v-html="row.billBalance" />
          </template>
        </el-table-column>
        <el-table-column label="收款金额" align="right">
          <template slot-scope="{row}">
            <input v-model="row.amount" class="amount" @focus="$event.target.select()">
          </template>
        </el-table-column>
      </el-table>
      <div v-if="status!=1&&status!=2" class="tx-c" style="margin-top:15px">
        <el-button class="filter-item" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="选择销售单" :visible.sync="dialogFormVisible1" width="720px">
      <div class="filter-container">
        <span class="zhi" style="font-weight:bold; margin:0 5px">起止日期</span>
        <el-date-picker v-model="modalQuery.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:140px;" />
        <span class="zhi">至</span>
        <el-date-picker v-model="modalQuery.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:140px;" />
        <el-button size="small" type="primary" @click="getSaleList">查询</el-button>
      </div>
      <el-table ref="dataTable" :data="modalData" border fit highlight-current-row style="width: 100%;" size="small" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" :reserve-selection="true" />
        <el-table-column label="客户" align="center">
          <template slot-scope="{row}">
            <span v-html="row.custName" />
          </template>
        </el-table-column>
        <el-table-column label="单据日期" align="center">
          <template slot-scope="{row}">
            <span v-html="row.billDate" />
          </template>
        </el-table-column>
        <el-table-column label="单据号" align="center">
          <template slot-scope="{row}">
            <span v-html="row.billNo" />
          </template>
        </el-table-column>
        <el-table-column label="单据金额" align="right">
          <template slot-scope="{row}">
            <span v-html="row.billAmount" />
          </template>
        </el-table-column>
        <el-table-column label="应收余额" align="right">
          <template slot-scope="{row}">
            <span v-html="row.billBalance" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" size="small" @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" size="small" @click="saveSelect">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="420px">
      <el-table :data="settleData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell">
        <el-table-column label="名称" width="146">
          <template slot-scope="scope">
            <settleTypeList :settle-type-arr="settleTypeArr" :select-code="scope.row.settleTypeCode" :select-arap="scope.row.arAp" :select-name="scope.row.settleTypeName" :index="scope.$index" @settleTypeChange="settleTypeChange" />
          </template>
        </el-table-column>
        <el-table-column label="预付应付标志" width="120">
          <template slot-scope="{row}">
            <input v-model="row.arAp" type="text" class="inputCell tx-l" disabled>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <input v-model="scope.row.amount" type="text" class="inputCell tx-l" @change="calculate1(scope.$index)">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getByHeaderId, saveReceiptPayment, getSalesListByCustId } from '@/api/rp'
import { getMeas, getInvCatg } from '@/api/basedata'
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import settleTypeList from '@/components/selects/settleTypeList'
import { getName, getNowDate } from '@/utils/auth'
export default {
  name: 'ReceiptAdd',
  components: { staffList, custList, settleTypeList },
  data() {
    return {
      id: '',
      isDisabled: false,
      status: this.$route.query.status,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      invCatgList: [],
      measList: [],
      modalQuery: {
        custId: '',
        billDate1: '2020-01-01',
        billDate2: getNowDate(),
        desc: 0
      },
      temp: {
        billNo: '',
        billDate: getNowDate(),
        custName: '',
        staffId: '',
        custId: '',
        crDr: 1,
        amount: 0
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      selectedData: [],
      settleData: [{}, {}, {}, {}, {}],
      modalData: []
    }
  },
  computed: {
    ...mapGetters([
      'settleTypeArr'
    ])
  },
  created() {
    this.$store.dispatch('basedata/getReceiptSettleType', { crDr: 1 })
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      getByHeaderId(this.id).then(res => {
        for (var key in this.temp) {
          this.temp[key] = res.data.data[key]
        }
        this.tableData = addNullObj(res.data.data.billLine || [])
        this.settleData = addNullObj2(res.data.data.settleTypeDetail || [])
      })
    } else {
      this.getSaleList()
    }
  },
  methods: {
    handleSelectionChange(selection, row) {
      this.selectedData = addNullObj(selection)
    },
    focusThis(event) {
      event.currentTarget.selected()
    },
    showSaleBill() {
      this.dialogFormVisible1 = true
    },
    showSettleType() {
      this.dialogFormVisible = true
    },
    selectChange(obj) {
      for (var key in obj) {
        this.temp[key] = obj[key]
      }
      this.getSaleList()
      if (this.selectedData.length > 0) {
        this.$refs.dataTable.clearSelection()
        this.selectedData = []
      }
      this.tableData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    },
    settleTypeChange(obj) {
      for (var key in obj) {
        this.settleData[obj.index][key] = obj[key]
      }
    },
    saveSelect() {
      if (this.selectedData.length == 0) {
        this.$message.warning('请选择销售单据')
        return
      }
      this.tableData = this.selectedData
      this.dialogFormVisible1 = false
    },
    calculate1(index) {
      var amount = 0
      for (var i = 0; i < this.settleData.length; i++) {
        if (this.settleData[i] && this.settleData[i].amount) {
          amount += Number(this.settleData[i].amount)
        }
      }
      this.temp.amount = parseFloat(amount).toFixed(2)
    },
    getSaleList() {
      this.modalQuery.custId = this.temp.custId
      this.modalQuery.staffId = this.temp.staffId
      this.modalQuery.crDr = 1
      getSalesListByCustId(this.modalQuery).then(res => {
        this.modalData = res.data.data || []
      })
    },
    save() {
      if (this.selectedData.length == 0) {
        this.$message.warning('收款明细不能为空')
        return
      }
      this.temp.id = this.id
      this.temp.billLine = deleteEmptyProp(this.tableData)
      this.temp.settleTypeDetail = this.settleData
      saveReceiptPayment(this.temp).then(res => {
        if (res.data.errorCode == 0) {
          this.$message.success(this.temp.id == '' ? '新增收款单成功' : '修改收款单成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/rp/receipt')
        } else {
          this.$message.warning(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('保存失败，请稍后重试！')
      })
    }
  }
}
</script>
<style scoped>
.amount{width: 100%;height:30px;border:none;display: block;outline: none;text-align: right;padding-right: 5px}
</style>
