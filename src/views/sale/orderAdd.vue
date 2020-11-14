<template>
  <div class="app-container">
    <div class="dataTable">
      <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
        <el-form-item label="单据日期:" prop="billDate">
          <el-date-picker v-model="temp.billDate" :editable="false" type="date" placeholder="单据日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="单据号:" prop="billNo">
          <el-input v-model="temp.billNo" size="small" placeholder="单据号" disabled />
        </el-form-item>
        <el-form-item label="业务员:" prop="staffId">
          <staffList :disabled="!userInfo.isAdmin" :select-id="temp.staffId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="客户:" prop="custId">
          <custList key-type="custId" :contact="1" :select-id="temp.custId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="售达客户:" prop="settleCustId">
          <custList key-type="settleCustId" :contact="1" :select-id="temp.settleCustId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="联系人:" prop="contact">
          <el-input v-model="temp.contact" size="small" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model="temp.tel" size="small" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="收货地址:" prop="addr">
          <el-input v-model="temp.addr" size="small" placeholder="收货地址" />
        </el-form-item>
        <el-form-item label="仓库:" prop="warehouseId">
          <warehouseList key-type="warehouseId" allow-null="1" :select-id="temp.warehouseId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="车辆:" prop="truckId">
          <truckList key-type="truckId" allow-null="1" :select-id="temp.truckId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="收款方式:" prop="paymentTypeId">
          <paymentTypeList :select-id="temp.paymentTypeId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="收款到期日:" prop="paymentDueDate">
          <el-date-picker v-model="temp.paymentDueDate" :editable="false" type="date" placeholder="收款到期日" size="small" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="合计金额:" prop="itemAmount">
          <el-input v-model="temp.itemAmount" size="small" placeholder="合计金额" disabled />
        </el-form-item>
        <el-form-item label="现结金额:" prop="currPayAmount">
          <el-input v-model="temp.currPayAmount" size="small" placeholder="现结金额" style="width:75px" disabled />
          <el-button size="small" style="width:45px;padding:8px" @click="showSettleType">选择</el-button>
        </el-form-item>
        <el-form-item label="销售费用:" prop="expensesAmount">
          <el-input v-model="temp.expensesAmount" size="small" placeholder="销售费用" disabled />
        </el-form-item>
        <el-form-item label="使用预收:" prop="advPayAmount">
          <el-input v-model="temp.advPayAmount" size="small" placeholder="使用预收" disabled />
        </el-form-item>
        <el-form-item label="应收金额:" prop="receivableAmount">
          <el-input v-model="temp.receivableAmount" size="small" placeholder="应收金额" disabled />
        </el-form-item>
        <el-form-item label="发票:" prop="statusInvoice">
          <el-select v-model="temp.statusInvoice" size="small">
            <el-option label="不开发票" :value="0" />
            <el-option label="待开发票" :value="1" />
            <el-option label="已开发票" :value="9" />
          </el-select>
        </el-form-item>
        <el-form-item label="配送状态" prop="statusDelivery">
          <el-select v-model="temp.statusDelivery" size="small">
            <el-option label="未配送" :value="0" />
            <el-option label="配送中" :value="1" />
            <el-option label="完成" :value="9" />
            <el-option label="订单作废" :value="-9" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态" prop="statusPayment">
          <el-select v-model="temp.statusPayment" size="small">
            <el-option label="未支付" :value="0" />
            <el-option label="预付定金" :value="1" />
            <el-option label="已支付" :value="9" />
            <el-option label="订单作废" :value="-9" />
          </el-select>
        </el-form-item>
        <el-form-item label="自动匹配预收款:" prop="autoAdvr" label-width="110px">
          <el-checkbox v-model="temp.autoAdvr" :false-label="0" :true-label="1" />
        </el-form-item>
      </el-form>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="商品" width="300">
          <template slot-scope="scope">
            <itemList :select-id="scope.row.itemId" :index="scope.$index" :item-list="item_list" @changeVal="changeVal" />
          </template>
        </el-table-column>
        <el-table-column label="规格">
          <template slot-scope="{row}">
            <input v-model="row.norms" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="{row}">
            <input v-model="row.uom" type="text" class="inputCell tx-c" disabled>
          </template>
        </el-table-column>
        <el-table-column label="批号">
          <template slot-scope="{row}">
            <input v-model="row.batchNo" type="text" class="inputCell tx-r">
          </template>
        </el-table-column>
        <el-table-column label="生产日期" width="120">
          <template slot-scope="{row}">
            <el-date-picker v-model="row.productionDate" :editable="false" type="date" placeholder="" size="small" style="width:100%" :clearable="false" value-format="yyyy-MM-dd" />
          </template>
        </el-table-column>
        <el-table-column label="保质期(天)">
          <template slot-scope="{row}">
            <input v-model="row.qualityDays" type="text" class="inputCell tx-r">
          </template>
        </el-table-column>
        <el-table-column label="含税价(元)">
          <template slot-scope="scope">
            <input v-model="scope.row.vatPrice" type="text" class="inputCell tx-r" :disables="userInfo.salePriceType + scope.row.salePriceType <= 1" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <input v-model="scope.row.qty" type="text" class="inputCell tx-r" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="价税合计">
          <template slot-scope="{row}">
            <input v-model="row.vatAmount||0" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column label="销售方式">
          <template slot-scope="scope">
            <salesTypeList :select-id="scope.row.salesTypeCode" :index="scope.$index" @selectChange="salesTypeChange" />
          </template>
        </el-table-column>
        <el-table-column label="税率(%)">
          <template slot-scope="scope">
            <input v-model="scope.row.taxRate" type="text" class="inputCell tx-r" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="税额">
          <template slot-scope="{row}">
            <input v-model="row.taxAmount" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
      </el-table>
      <div class="dataTable" style="margin-top: 10px">
        <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
          <el-form-item label="制单日期:" prop="recordDate">
            <el-date-picker v-model="temp.recordDate" :editable="false" type="date" placeholder="制单日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="制单人:" prop="recorderId">
            <el-input v-model="temp.recorder" size="small" placeholder="制单人" />
          </el-form-item>
          <el-form-item label="审核日期:" prop="auditDate">
            <el-date-picker v-model="temp.auditDate" :editable="false" type="date" placeholder="审核日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="审核人:" prop="auditorId">
            <el-input v-model="temp.auditor" size="small" placeholder="审核人" />
          </el-form-item>
        </el-form>
      </div>
      <div class="tx-c" style="margin-top:15px">
        <el-button v-if="$route.path.indexOf('etail') < 0" class="submitBtn" type="primary" @click="save">保 存</el-button>
        <el-button v-else class="submitBtn" type="primary" @click="$store.dispatch('tagsView/delView', $route);$router.replace('/sale/saleOrder')">返 回</el-button>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="392px">
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
import { saveSalesOrder, getSalesOrderById } from '@/api/sale'
import { deleteEmptyProp, addNullObj2 } from '@/utils'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import truckList from '@/components/selects/truckList'
import warehouseList from '@/components/selects/warehouseList'
import paymentTypeList from '@/components/selects/paymentTypeList'
import itemList from '@/components/selects/saleItemList'
import settleTypeList from '@/components/selects/settleTypeList'
import salesTypeList from '@/components/selects/salesTypeList'
import { getResPageByFuzzyCustId } from '@/api/store'
import { getName, getNowDate } from '@/utils/auth'
export default {
  name: 'OrderAdd',
  components: { staffList, warehouseList, custList, truckList, paymentTypeList, itemList, settleTypeList, salesTypeList },
  data() {
    return {
      id: '',
      status: this.$route.query.status,
      settleData: [{}, {}, {}, {}, {}],
      dialogFormVisible: false,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      keys: ['itemId', 'itemCode', 'itemName', 'norms', 'uom', 'subUom', 'exchangeRate', 'batchNo', 'productionDate', 'qualityName', 'qualityDays', 'qty', 'vatPrice', 'amount', 'taxRate', 'taxAmount', 'vatAmount', 'invoiceNo', 'salesTypeCode'],
      item_list: [],
      temp: {
        billDate: getNowDate(),
        billNo: '',
        bizTypeId: '',
        autoAdvr: 1,
        custId: '',
        custName: '',
        contact: '',
        tel: '',
        addr: '',
        settleCustId: '',
        warehouseId: '',
        warehouseName: '',
        truckId: '',
        truckName: '',
        staffId: '',
        paymentTypeId: '',
        paymentDueDate: '',
        currPayAmount: 0,
        itemAmount: 0,
        statusInvoice: 1,
        advPayAmount: 0,
        receivableAmount: 0,
        rebateAmount: 0,
        withoutPayAmount: 0,
        auditDate: '',
        auditor: '',
        recordDate: getNowDate() + ' 00:00:00',
        recorder: getName()
      }
    }
  },
  computed: {
    ...mapGetters([
      'settleTypeArr',
      'userInfo'
    ])
  },
  created() {
    this.$store.dispatch('basedata/getSalesTypeArr')
    this.$store.dispatch('basedata/getSalesSettleType')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      var billDate = this.$route.query.billDate
      getSalesOrderById({ id: this.id, billDate: billDate }).then(res => {
        if (res.data.data) {
          for (var key in this.temp) {
            this.temp[key] = res.data.data[key]
          }
          this.temp.autoAdvr = true
          for (var i = 0; i < res.data.data.salesLine.length; i++) {
            for (var j = 0; j < this.keys.length; j++) {
              this.tableData[i][this.keys[j]] = res.data.data.salesLine[i][this.keys[j]]
              if (this.tableData[i].taxRate < 1) {
                this.tableData[i].taxRate = this.tableData[i].taxRate * 100
              }
            }
          }
          this.settleData = addNullObj2(res.data.data.settleTypeDetail || [])
          this.getItemList()
        }
      })
    }
  },
  methods: {
    calculate(index) {
      var vatPrice = this.tableData[index].vatPrice // 含税价
      var qty = this.tableData[index].qty // 数量
      if (qty && vatPrice) {
        var vatAmount = parseFloat(Number(qty) * Number(vatPrice)).toFixed(2)
        this.$set(this.tableData[index], 'vatAmount', vatAmount)
        var taxRate = this.tableData[index].taxRate
        if (taxRate) {
          var amount = parseFloat(Number(qty) * Number(price)).toFixed(2)
          var taxAmount = parseFloat(Number(vatAmount) - Number(amount)).toFixed(2)
          this.$set(this.tableData[index], 'taxAmount', taxAmount)
        } else {
          this.$set(this.tableData[index], 'taxRate', 0)
        }
        this.calculateTotal()
      }
    },
    calculate1(index) {
      var amount = 0
      for (var i = 0; i < this.settleData.length; i++) {
        if (this.settleData[i] && this.settleData[i].amount) {
          amount += Number(this.settleData[i].amount)
        }
      }
      this.temp.currPayAmount = parseFloat(amount).toFixed(2)
    },
    calculateTotal() {
      var amount = 0
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i] && this.tableData[i].vatAmount) {
          amount += Number(this.tableData[i].vatAmount)
        }
      }
      this.temp.itemAmount = parseFloat(amount).toFixed(2)
    },
    showSettleType() {
      this.dialogFormVisible = true
    },
    settleTypeChange(obj) {
      for (var key in obj) {
        this.settleData[obj.index][key] = obj[key]
      }
    },
    salesTypeChange(obj) {
      for (var key in obj) {
        this.tableData[obj.index][key] = obj[key]
      }
    },
    selectChange(obj) {
      for (var key in obj) {
        this.temp[key] = obj[key]
      }
      if (obj && obj.warehouseId) {
        this.temp.warehouseName = obj.warehouseName
        this.temp.truckId = ''
        this.temp.truckName = ''
      }
      if (obj && obj.truckId) {
        this.temp.truckName = obj.truckName
        this.temp.warehouseName = ''
        this.temp.warehouseId = ''
      }
      if (obj.custId) {
        this.getItemList()
      }
    },
    getItemList() {
      const obj = {
        pageIndex: 1,
        pageNum: 100,
        queryParam: {
          custId: this.temp.custId
        }
      }
      getResPageByFuzzyCustId(obj).then(res => {
        this.item_list = res.data.data
      })
    },
    changeVal(obj) {
      for (var key in obj) {
        this.tableData[obj.index][key] = obj[key]
      }
    },
    save() {
      this.temp.id = this.id
      this.temp.salesLine = deleteEmptyProp(this.tableData)
      this.temp.advPayAmount = Number(this.temp.advPayAmount)
      this.temp.settleTypeDetail = this.settleData
      saveSalesOrder(this.temp).then(res => {
        if (res.data.errorCode === '0') {
          this.$message.success(this.id == '' ? '新增成功' : '修改成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/sale/saleOrder')
        }
      }).catch(() => {
        this.$message.error('保存失败，请稍后重试！')
      })
    }
  }
}
</script>
