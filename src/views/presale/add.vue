<template>
  <div class="app-container">
    <div class="dataTable">
      <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
        <el-form-item label="单据日期" prop="billDate">
          <el-date-picker v-model="temp.billDate" :editable="false" type="date" placeholder="单据日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="单据号" prop="billNo">
          <el-input v-model="temp.billNo" size="small" placeholder="单据号" disabled />
        </el-form-item>
        <el-form-item label="客户" prop="custId">
          <custList key-type="custId" :select-id="temp.custId" :select-name="temp.custName" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="业务员" prop="staffId">
          <staffList :select-id="temp.staffId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="预收类型" prop="presaleType">
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              按现金预收，可用于任何商品<br/>按商品，预收款只能用于此商品，锁定价格<br/>按品类，预收款只能用于此品类下的商品，锁定价格
            </div>
            <i class="el-icon-question" style="margin-left:0;margin-right:5px" />
          </el-tooltip>
          <el-select v-model="temp.presaleType" placeholder="预收类型" size="small" @change="initTable">
            <el-option label="按现金" value="0" />
            <el-option label="按商品" value="1" />
            <el-option label="按品类" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效日期" prop="expirationDate">
          <el-date-picker v-model="temp.expirationDate" :editable="false" :disabled="temp.presaleType==0" type="date" placeholder="有效日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="预收合计" prop="amount">
          <el-input v-model="temp.amount" size="small" placeholder="预收合计" disabled />
        </el-form-item>
        <el-form-item label="现结金额" prop="beginBalance">
          <el-input v-model="temp.beginBalance" size="small" placeholder="现结金额" style="width:75px" disabled />
          <el-button size="small" style="width:45px;padding:6px" @click="showSettleType">选择</el-button>
        </el-form-item>
        <el-form-item v-if="status==1" label="余额" prop="balance">
          <el-input v-model="temp.balance" size="small" placeholder="余额" />
        </el-form-item>
      </el-form>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell" max-height="600">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column v-if="temp.presaleType=='1'" label="商品" width="300">
          <template slot-scope="scope">
            <itemList :select-code="scope.row.itemCode" :select-id="scope.row.itemId" :index="scope.$index" @changeVal="changeVal" />
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='1'" label="规格">
          <template slot-scope="{row}">
            <input v-model="row.norms" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='1'" label="单位">
          <template slot-scope="{row}">
            <input v-model="row.uom" type="text" class="inputCell tx-c" disabled>
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='1'" label="辅助单位">
          <template slot-scope="{row}">
            <input v-model="row.subUom" type="text" class="inputCell tx-c" disabled>
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='2'" key="1" label="品类代码" width="150">
          <template slot-scope="scope">
            <invCatgList :resdata="invCatgList" :select-id="scope.row.invCatgId" :index="scope.$index" @changeVal="changeVal1" />
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='2'" key="2" label="品类名称" width="160">
          <template slot-scope="{row}">
            <input v-model="row.invCatgName" type="text" class="inputCell" disabled>
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='2'" key="3" label="计量单位" width="150">
          <template slot-scope="scope">
            <measList :resdata="measList" :select-id="scope.row.measId" key-type="meas" :index="scope.$index" @changeVal="changeVal1" />
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='2'" key="4" label="辅助单位" width="150">
          <template slot-scope="scope">
            <measList :resdata="measList" :select-id="scope.row.subMeasId" key-type="subMeas" :index="scope.$index" @changeVal="changeVal1" />
          </template>
        </el-table-column>
        <el-table-column v-if="temp.presaleType=='2'||temp.presaleType=='1'" key="5" label="换算率" width="100">
          <template slot-scope="{row}">
            <input v-model="row.exchangeRate" type="text" class="inputCell tx-c" :disabled="temp.presaleType=='1'">
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <input v-model="scope.row.price" type="text" class="inputCell tx-r" :disabled="temp.presaleType==0" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <input v-model="scope.row.beginBalanceQty" type="text" class="inputCell tx-r" :disabled="temp.presaleType==0" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="{row}">
            <input v-model="row.beginBalance" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column label="余量">
          <template slot-scope="{row}">
            <input v-if="temp.presaleType=='2'||temp.presaleType=='1'&&status==1" v-model="row.balanceQty" type="text" class="inputCell tx-r">
          </template>
        </el-table-column>
        <el-table-column label="余额">
          <template slot-scope="{row}">
            <input v-if="temp.presaleType=='2'||temp.presaleType=='1'&&status==1" v-model="row.balance" type="text" class="inputCell tx-r">
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="{row}">
            <input v-model="row.remarks" type="text" class="inputCell tx-r" :disabled="temp.presaleType==0">
          </template>
        </el-table-column>
      </el-table>
      <div class="dataTable" style="margin-top: 10px">
        <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
          <el-form-item label="备 注" prop="remarks">
            <el-input v-model="temp.remarks" size="small" placeholder="备注" style="width:790px" />
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
          <el-form-item label="制单日期" prop="recordDate">
            <el-date-picker v-model="temp.recordDate" :editable="false" type="date" placeholder="制单日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="制单人" prop="recorderId">
            <el-input v-model="temp.recorder" size="small" placeholder="制单人" />
          </el-form-item>
          <el-form-item label="审核日期" prop="auditDate">
            <el-date-picker v-model="temp.auditDate" :editable="false" type="date" placeholder="审核日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd" />
          </el-form-item>
          <el-form-item label="审核人" prop="auditorId">
            <el-input v-model="temp.auditor" size="small" placeholder="审核人" />
          </el-form-item>
        </el-form>
      </div>
      <div class="tx-c" style="margin-top:15px">
        <el-button v-if="$route.path.indexOf('etail') < 0" class="submitBtn" type="primary" @click="save">保 存</el-button>
        <el-button v-else class="submitBtn" type="primary" @click="$store.dispatch('tagsView/delView', $route);$router.replace('/presale/data')">返 回</el-button>
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
          <template slot-scope="{row}">
            <input v-model="row.amount" type="text" class="inputCell tx-l" @change="calculate1()">
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
import { savePresale, getPresaleById } from '@/api/store'
import { getMeas, getInvCatg } from '@/api/basedata'
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import itemList from '@/components/selects/itemList'
import bizTypeList from '@/components/selects/bizTypeList'
import invCatgList from '@/components/selects/invCatgList'
import settleTypeList from '@/components/selects/settleTypeList'
import measList from '@/components/selects/measList'
import { getName, getNowDate } from '@/utils/auth'
export default {
  name: 'PresaleAdd',
  components: {
    staffList, custList, bizTypeList, itemList, invCatgList, settleTypeList, measList
  },
  data() {
    return {
      id: '',
      isDisabled: false,
      status: this.$route.query.status,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      keys: ['invCatgName', 'invCatgid', 'itemId', 'norms', 'uom', 'subUom', 'exchangeRate', 'beginBalanceQty', 'vatPrice', 'taxRate', 'taxAmount', 'vatAmount', 'remarks', 'salesTypeCode', 'measId'],
      invCatgList: [],
      measList: [],
      temp: {
        billNo: '',
        remarks: '',
        amount: '',
        expirationDate: '',
        billDate: getNowDate(),
        custName: '',
        presaleType: '1',
        staffId: '',
        custId: '',
        bizTypeId: '',
        beginBalance: '',
        auditDate: '',
        auditor: '',
        balance: 0,
        recordDate: getNowDate() + ' 00:00:00',
        recorder: getName()
      },
      dialogFormVisible: false,
      settleData: [{}, {}, {}, {}, {}]
    }
  },
  computed: {
    ...mapGetters([
      'settleTypeArr',
      'truckList'
    ])
  },
  created() {
    this.$store.dispatch('basedata/getPresaleSettleType')
    this.$store.dispatch('basedata/getitemlist')
    getMeas().then(res => {
      this.measList = res.data.data
    })
    getInvCatg().then(res => {
      this.invCatgList = res.data.data
    })
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      getPresaleById(this.id).then(res => {
        for (var key in this.temp) {
          this.temp[key] = res.data.data[key]
          if (key == 'presaleType') {
            this.temp[key] = String(res.data.data[key])
          }
        }
        for (var i = 0; i < res.data.data.presaleLine.length; i++) {
          for (var j = 0; j < this.keys.length; j++) {
            const key = this.keys[j]
            const val = res.data.data.presaleLine[i][key]
            this.$set(this.tableData[i], key, val)
          }
        }
        this.settleData = addNullObj2(res.data.data.settleTypeDetail)
        this.calculateTotal()
      })
    }
  },
  methods: {
    initTable(val) {
      this.tableData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    },
    showSettleType() {
      this.dialogFormVisible = true
    },
    settleTypeChange(obj) {
      for (var key in obj) {
        this.settleData[obj.index][key] = obj[key]
      }
    },
    changeVal1(obj) {
      for (var key in obj) {
        this.tableData[obj.index][key] = obj[key]
      }
    },
    calculate(index) {
      var qty = this.tableData[index].beginBalanceQty
      var price = this.tableData[index].price
      if (qty && price) {
        var beginBalance = parseFloat(Number(qty) * Number(price)).toFixed(2)
        this.$set(this.tableData[index], 'beginBalance', beginBalance)
        this.calculateTotal()
      }
    },
    calculate1() {
      var amount = 0
      for (var i = 0; i < this.settleData.length; i++) {
        if (this.settleData[i] && this.settleData[i].amount) {
          amount += Number(this.settleData[i].amount)
        }
      }
      this.temp.beginBalance = parseFloat(amount).toFixed(2)
    },
    calculateTotal() {
      var amount = 0
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i] && this.tableData[i].beginBalance) {
          amount += Number(this.tableData[i].beginBalance)
        }
      }
      this.temp.amount = parseFloat(amount).toFixed(2)
    },
    selectChange(obj) {
      for (var key in obj) {
        this.temp[key] = obj[key]
      }
    },
    changeVal(obj) {
      for (var key in obj) {
        this.tableData[obj.index][key] = obj[key]
      }
      if (obj.index + 1 == this.tableData.length) {
        this.tableData.push({})
      }
    },
    save() {
      this.temp.id = this.id
      this.temp.presaleLine = deleteEmptyProp(this.tableData)
      this.temp.settleTypeDetail = this.settleData
      savePresale(this.temp).then(res => {
        if (res.data.errorCode == 0) {
          this.$message.success(this.temp.id == '' ? '新增成功' : '修改成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/presale/data')
        }
      }).catch(() => {
        this.$message.error('保存失败，请稍后重试！')
      })
    }
  }
}
</script>
