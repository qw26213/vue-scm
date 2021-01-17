<template>
  <div class="app-container">
    <div class="contentDiv">
      <div class="tx-r" style="margin-bottom: 10px">
        <el-button size="small" type="primary" :loading="saveloading" @click="saveData(0)">保存</el-button>
        <el-button size="small" type="primary" @click="showSum()">试算平衡汇总</el-button>
      </div>
      <el-table v-loading="listLoading" class="balance" :data="tableData" border fit resize empty-text="暂无相关数据" style="width: 100%;" :height="tableHeight">
        <el-table-column label="科目编码" min-width="90">
          <template slot-scope="scope">
            <span class="tabletxt">{{ scope.row.coaCode }}</span>
            <el-button v-if="scope.row.leaf == 1 && scope.row.type ==1 && scope.row.isAuxiliary == 1 && balanceStatus == 1" type="primary" icon="el-icon-plus" circle size="mini" style="margin-left:10px" @click="showSuplyConfig(scope.$index)" />
            <el-button v-if="scope.row.leaf == 1 && scope.row.type !=1 && scope.row.isAuxiliary == 1 && balanceStatus == 1" type="danger" icon="el-icon-delete" circle size="mini" style="margin-left:10px" @click="removeRow(scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="110" style="padding-right:100px;" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="plr10 tabletxt">{{ scope.row.showCoaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方向" width="100" align="center">
          <template slot-scope="{row}">
            <span class="tabletxt">{{ row.crDr==1?'借':row.crDr==0?'平':'贷' }}</span>
          </template>
        </el-table-column>
        <!-- type0为余额表节点 1为科目节点 -->
        <el-table-column :label="'期初余额('+userInfo.glBookEntity.enablePeriodCode+')'" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.beginBalance" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @focus="focusThis($event)" @input="inputChange($event, 'beginBalance', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.beginBalanceQty" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @focus="focusThis($event)" @input="inputChange($event, 'beginBalanceQty', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'本年借方累计'+ (userInfo.glBookEntity.enablePeriodNum > 1 ? '(1-' + (userInfo.glBookEntity.enablePeriodNum - 1) + '月)':'')" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.yearNetDr" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1) || userInfo.glBookEntity.enablePeriodNum == 1" @focus="focusThis($event)" @input="inputChange($event, 'yearNetDr', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.yearNetQtyDr" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1) || userInfo.glBookEntity.enablePeriodNum == 1" @focus="focusThis($event)" @input="inputChange($event, 'yearNetQtyDr', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'本年贷方累计'+ (userInfo.glBookEntity.enablePeriodNum > 1 ? '(1-' + (userInfo.glBookEntity.enablePeriodNum - 1) + '月)':'')" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.yearNetCr" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1) || userInfo.glBookEntity.enablePeriodNum == 1" @focus="focusThis($event)" @input="inputChange($event, 'yearNetCr', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <input v-model.trim="scope.row.yearNetQtyCr" class="tx-r" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1) || userInfo.glBookEntity.enablePeriodNum == 1" @focus="focusThis($event)" @input="inputChange($event, 'yearNetQtyCr', scope.$index)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" title="试算平衡汇总" :visible.sync="dialogFormVisible1" width="720px">
      <el-table :data="[balanceObj]" border fit resize empty-text="无同步数据" style="width: 100%;" size="small">
        <el-table-column align="center" label="项目">
          <template slot-scope="{row}">
            <span>金额</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="期初借方">
          <template slot-scope="{row}">
            <span>{{ row.sumBalanceDr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="期初贷方">
          <template slot-scope="{row}">
            <span>{{ row.sumBalanceCr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="差额">
          <template slot-scope="{row}">
            <span>{{ row.diffBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="借方发生额">
          <template slot-scope="{row}">
            <span>{{ row.sumYearNetDr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="贷方发生额">
          <template slot-scope="{row}">
            <span>{{ row.sumYearNetCr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="差额">
          <template slot-scope="{row}">
            <span>{{ row.diffYearNet }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否平衡">
          <template slot-scope="{row}">
            <span>{{ row.diffBalance == 0 && row.diffYearNet == 0?'平衡':'不平衡' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="设置辅助核算" :visible.sync="dialogFormVisible2" width="660px">
      <el-form ref="dataForm" class="auditform" :rules="rules" :model="temp" :inline="true" label-position="top" style="width: 600px; margin-left:15px;">
        <el-form-item label="期初余额" prop="beginBalance">
          <el-input v-model="temp.beginBalance" size="small" placeholder="期初余额" style="width:185px" />
        </el-form-item>
        <el-form-item label="本年累计借方金额" prop="yearNetDr" label-width="140px">
          <el-input v-model="temp.yearNetDr" size="small" placeholder="本年累计借方金额" style="width:185px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="本年累计贷方金额" prop="yearNetCr" label-width="140px">
          <el-input v-model="temp.yearNetCr" size="small" placeholder="本年累计贷方金额" style="width:185px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="期初数量" prop="beginBalanceQty" label-width="80px">
          <el-input v-model="temp.beginBalanceQty" size="small" placeholder="期初数量" style="width:185px" />
        </el-form-item>
        <el-form-item label="本年累计借方数量" prop="yearNetQtyDr" label-width="140px">
          <el-input v-model="temp.yearNetQtyDr" size="small" placeholder="本年累计借方数量" style="width:185px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="本年累计贷方数量" prop="yearNetQtyCr" label-width="140px">
          <el-input v-model="temp.yearNetQtyCr" size="small" placeholder="本年累计贷方数量" style="width:185px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(0)=='1'" label="供应商" prop="supplierId">
          <el-select ref="supplierSelect" v-model="temp.supplierId" size="small" placeholder="供应商" style="width:185px">
            <el-option v-for="(item,index) in supplierList" :key="item.supplierCode" :data-code="item.supplierCode" :label="item.supplierName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(1)=='1'" label="客户" prop="custId" label-width="140px">
          <el-select ref="custSelect" v-model="temp.custId" size="small" placeholder="客户" style="width:185px">
            <el-option v-for="(item,index) in custList" :key="item.custCode" :data-code="item.custCode" :label="item.custName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(2)=='1'" label="部门" prop="deptId" label-width="140px">
          <el-select ref="deptSelect" v-model="temp.deptId" size="small" placeholder="部门" style="width:185px">
            <el-option v-for="(item,index) in deptList" :key="item.deptCode" :data-code="item.deptCode" :label="item.deptName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(3)=='1'" label="职员" prop="staffId" label-width="80px">
          <el-select ref="staffSelect" v-model="temp.staffId" size="small" placeholder="职员" style="width:185px">
            <el-option v-for="(item,index) in staffList" :key="item.staffCode" :data-code="item.staffCode" :label="item.staffName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(4)=='1'" label="品类" prop="invCatgId" label-width="140px">
          <el-select ref="invCatgSelect" v-model="temp.invCatgId" size="small" placeholder="品类" style="width:185px">
            <el-option v-for="(item,index) in invCatgList" :key="item.invCatgCode" :data-code="item.invCatgCode" :label="item.invCatgName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(5)=='1'" label="存货" prop="itemId" label-width="140px">
          <el-select ref="itemSelect" v-model="temp.itemId" size="small" placeholder="存货" style="width:185px">
            <el-option v-for="(item,index) in itemList" :key="item.itemCode" :data-code="item.itemCode" :label="item.itemName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(6)=='1'" label="项目" prop="projId">
          <el-select ref="projSelect" v-model="temp.projId" size="small" placeholder="项目" style="width:185px">
            <el-option v-for="(item,index) in projList" :key="item.projCode" :data-code="item.projCode" :label="item.projName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="balanceStatus == 1" slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="saveAuxiliaryConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getBalance, getPeriodList, updateListForSetBegin, getOpeningBalanceStatus } from '@/api/user'
import { getProj, getDept, getStaff, getSupplier, getCust, getItem, getinvCatg } from '@/api/user'
import { getNowDate, deepClone, toNumStr, validateVal } from '@/utils'
var userInfo = JSON.parse(sessionStorage.userInfo)
var hexCas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']
export default {
  name: 'initialBalance',
  filters: {
    toFix(val) {
      if (!val) { return '0.00' }
      return parseFloat(val).toFix(2)
    }
  },
  data() {
    return {
      listQuery: {
        periodCode1: '',
        isOnlyAdjustNet: '1'
      },
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      curShowIndex: 0,
      auxiliaryTypeArr: [],
      saveloading: false,
      auxiliaryData: [],
      tableHeight: document.body.clientHeight - 183, // document.querySelector(".app-main").clientHeight - 83,
      temp: {
        auxiliary: '000000000000000',
        beginBalance: 0,
        yearNetDr: 0,
        yearNetCr: 0,
        beginBalanceQty: 0,
        yearNetQtyDr: 0,
        yearNetQtyCr: 0,
        supplierId: '',
        custId: '',
        staffId: '',
        projId: '',
        itemId: '',
        deptId: '',
        invCatgId: ''
      },
      resetTemp: {
        beginBalance: 0,
        yearNetDr: 0,
        yearNetCr: 0,
        beginBalanceQty: 0,
        yearNetQtyDr: 0,
        yearNetQtyCr: 0,
        supplierId: '',
        custId: '',
        staffId: '',
        projId: '',
        itemId: '',
        deptId: '',
        invCatgId: ''
      },
      rules: {
        beginBalance: [{ required: true, message: '不能为空', trigger: 'change' }],
        yearNetDr: [{ required: true, message: '不能为空', trigger: 'change' }],
        yearNetCr: [{ required: true, message: '不能为空', trigger: 'change' }],
        beginBalanceQty: [{ required: true, message: '不能为空', trigger: 'change' }],
        yearNetQtyDr: [{ required: true, message: '不能为空', trigger: 'change' }],
        yearNetQtyCr: [{ required: true, message: '不能为空', trigger: 'change' }],
        supplierId: [{ required: true, message: '不能为空', trigger: 'change' }],
        custId: [{ required: true, message: '不能为空', trigger: 'change' }],
        staffId: [{ required: true, message: '不能为空', trigger: 'change' }],
        projId: [{ required: true, message: '不能为空', trigger: 'change' }],
        itemId: [{ required: true, message: '不能为空', trigger: 'change' }],
        deptId: [{ required: true, message: '不能为空', trigger: 'change' }],
        invCatgId: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      custList: [],
      deptList: [],
      itemList: [],
      supplierList: [],
      staffList: [],
      projList: [],
      invCatgList: [],
      userInfo: userInfo,
      periodList: [],
      tableData: [],
      listLoading: false,
      balanceStatus: 1,
      balanceObj: {}
    }
  },
  mounted() {
    this.getData()
    this.getBalanceStatus()
    getCust().then(res => {
      this.custList = res.data.data
    })
    getDept().then(res => {
      this.deptList = res.data.data
    })
    getStaff().then(res => {
      this.staffList = res.data.data
    })
    getSupplier().then(res => {
      this.supplierList = res.data.data
    })
    getItem().then(res => {
      this.itemList = res.data.data
    })
    getProj().then(res => {
      this.projList = res.data.data
    })
    getinvCatg().then(res => {
      this.invCatgList = res.data.data
    })
  },
  methods: {
    inputChange(e, param, index) {
      var num = validateVal(e.currentTarget.value)
      this.$set(this.tableData[index], param, num)
    },
    focusThis(e) {
      e.currentTarget.select()
    },
    getPeriod() {
      getPeriodList().then(res => {
        this.periodList = res.data.data
        this.listQuery.periodCode1 = res.data.data[0].id
        this.getData('0')
      })
    },
    getBalanceStatus() {
      var obj = {
        periodCode: userInfo.glBookEntity.enablePeriodCode
      }
      getOpeningBalanceStatus(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.balanceStatus = res.data.data
        }
      })
    },
    showSum() {
      this.getBalanceObj()
      this.dialogFormVisible1 = true
    },
    removeRow(index) {
      var row = this.tableData[index]
      this.$set(row, 'beginBalance', 0)
      this.$set(row, 'beginBalanceQty', 0)
      this.$set(row, 'yearNetDr', 0)
      this.$set(row, 'yearNetQtyDr', 0)
      this.$set(row, 'yearNetCr', 0)
      this.$set(row, 'yearNetQtyCr', 0)
      this.calculate(row)
      this.$nextTick(() => {
        this.tableData.splice(index, 1)
      })
    },
    getBalanceObj() {
      var obj = {
        sumBalanceDr: 0,
        sumBalanceCr: 0,
        sumYearNetDr: 0,
        sumYearNetCr: 0,
        diffBalance: 0,
        diffYearNet: 0
      }
      const arr = this.tableData
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].leaf == 0 || arr[i].type == 1 && arr[i].isAuxiliary == '1') {
          continue
        }
        var tmpCrDr = arr[i].crDr // 方向
        var tmpBeginBalance = Number(arr[i].beginBalance) // 期初金额
        var tmpBeginBalanceQty = Number(arr[i].beginBalanceQty) // 期初数量
        var tmpYearNetDr = Number(arr[i].yearNetDr) // 借方金额
        var tmpYearNetQtyDr = Number(arr[i].yearNetQtyDr) // 借方数量
        var tmpYearNetCr = Number(arr[i].yearNetCr) // 贷方金额
        var tmpYearNetQtyCr = Number(arr[i].yearNetQtyCr) // 贷方数量
        if (tmpCrDr == 1) {
          obj.sumBalanceDr += tmpBeginBalance
        } else {
          obj.sumBalanceCr += tmpBeginBalance
        }
        obj.sumYearNetDr += tmpYearNetDr
        obj.sumYearNetCr += tmpYearNetCr
      }
      obj.diffBalance = obj.sumBalanceDr - obj.sumBalanceCr
      obj.diffYearNet = obj.sumYearNetDr - obj.sumYearNetCr
      this.balanceObj = obj
    },
    valChange(row) {
      this.$nextTick(() => {
        const crDr = row.crDr
        const balance = toNumStr(row.beginBalance)
        const balanceQty = toNumStr(row.beginBalanceQty)
        const yearNetDr = toNumStr(row.yearNetDr)
        const yearNetQtyDr = toNumStr(row.yearNetQtyDr)
        const yearNetCr = toNumStr(row.yearNetCr)
        const yearNetQtyCr = toNumStr(row.yearNetQtyCr)
        row.beginBalance = balance
        row.beginBalanceQty = balanceQty
        row.yearNetDr = yearNetDr
        row.yearNetQtyDr = yearNetQtyDr
        row.yearNetCr = yearNetCr
        row.yearNetQtyCr = yearNetQtyCr
        if (crDr == 1) {
          row.beginBalanceDr = balance
          row.beginBalanceQtyDr = balanceQty
          row.beginBalanceCr = 0
          row.beginBalanceQtyCr = 0
        } else {
          row.beginBalanceDr = 0
          row.beginBalanceQtyDr = 0
          row.beginBalanceCr = balance
          row.beginBalanceQtyCr = balanceQty
        }
        if (row.type == 0) { // 是辅助核算科目，或是末级科目
          this.calculate(row)
        } else {
          if (row.coaCode.length > 4) {
            this.calculateTop(row.coaCode)
          }
        }
      })
    },
    calculate(row) {
      var amount1 = 0
      var amount2 = 0
      var amount3 = 0
      var amount4 = 0
      var amount5 = 0
      var amount6 = 0
      var coaCode = row.coaCode
      const len = coaCode.length
      const parentCode = coaCode.substr(0, len - 2)
      console.log('type=' + row.type)
      if (row.isAuxiliary === 1) {
        this.tableData.forEach(item => {
          if (item.coaCode == coaCode && item.type == 0) {
            console.log('开始计算1')
            amount1 += Number(item.beginBalance)
            amount2 += Number(item.beginBalanceQty)
            amount3 += Number(item.yearNetDr)
            amount4 += Number(item.yearNetQtyDr)
            amount5 += Number(item.yearNetCr)
            amount6 += Number(item.yearNetQtyCr)
          }
        })
      } else {
        this.tableData.forEach(item => {
          if (item.coaCode.substr(0, item.coaCode.length - 2) == parentCode && item.type == 0) {
            console.log('开始计算2')
            amount1 += Number(item.beginBalance)
            amount2 += Number(item.beginBalanceQty)
            amount3 += Number(item.yearNetDr)
            amount4 += Number(item.yearNetQtyDr)
            amount5 += Number(item.yearNetCr)
            amount6 += Number(item.yearNetQtyCr)
          }
        })
      }
      this.tableData.forEach(item => {
        if ((item.coaCode == coaCode && item.type == 1) || (item.coaCode == parentCode && item.type == 1)) {
          this.$set(item, 'beginBalance', amount1)
          this.$set(item, 'beginBalanceQty', amount2)
          this.$set(item, 'yearNetDr', amount3)
          this.$set(item, 'yearNetQtyDr', amount4)
          this.$set(item, 'yearNetCr', amount5)
          this.$set(item, 'yearNetQtyCr', amount6)
          if (item.coaCode.length > 4) {
            this.calculateTop(row.coaCode)
          }
        }
      })
    },
    calculateTop(coaCode) { // 向上汇总
      const len = coaCode.length
      const parentCode = coaCode.substr(0, len - 2)
      var amount1 = 0
      var amount2 = 0
      var amount3 = 0
      var amount4 = 0
      var amount5 = 0
      var amount6 = 0
      this.tableData.forEach(item => {
        if (item.coaCode.substr(0, item.coaCode.length - 2) == parentCode && item.type == 1) {
          amount1 += Number(item.beginBalance)
          amount2 += Number(item.beginBalanceQty)
          amount3 += Number(item.yearNetDr)
          amount4 += Number(item.yearNetQtyDr)
          amount5 += Number(item.yearNetCr)
          amount6 += Number(item.yearNetQtyCr)
        }
      })
      this.tableData.forEach(item => {
        if (item.coaCode == parentCode && item.type == 1) {
          this.$set(item, 'beginBalance', amount1)
          this.$set(item, 'beginBalanceQty', amount2)
          this.$set(item, 'yearNetDr', amount3)
          this.$set(item, 'yearNetQtyDr', amount4)
          this.$set(item, 'yearNetCr', amount5)
          this.$set(item, 'yearNetQtyCr', amount6)
          if (item.coaCode.length > 4) {
            this.calculateTop(item.coaCode)
          }
        }
      })
    },
    showSuplyConfig(index) {
      this.dialogFormVisible2 = true
      this.curShowIndex = index
      this.temp.auxiliary = this.tableData[index].auxiliary
      for (const key in this.resetTemp) {
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveAuxiliaryConfig() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var editIndex = this.curShowIndex
          var curObj = deepClone(this.auxiliaryData[editIndex])
          var auxiliary = curObj.auxiliary
          if (auxiliary != null && auxiliary.length > 0) {
            var auxiliaryCode = ''
            var auxiliaryName = ''
            var auxiliaries = auxiliary.split('')
            var AuxiliaryType = ['supplier', 'cust', 'dept', 'staff', 'invCatg', 'item', 'proj']
            for (var i = 0; i < AuxiliaryType.length; i++) {
              if (auxiliaries[i] != null && auxiliaries[i] == 1) {
                // 显示对应的辅助核算项 1-26
                var auxiliaryType = AuxiliaryType[i]
                /* 获取当前辅助核算项的值 */
                console.log(auxiliaryType)
                var selectId = this.$refs[auxiliaryType + 'Select'].selected.value
                var selectText = this.$refs[auxiliaryType + 'Select'].selected.label
                var modelCode = this.$refs[auxiliaryType + 'Select'].selected.$attrs['data-code']
                auxiliaryCode += '_' + hexCas[AuxiliaryType.indexOf(auxiliaryType)] + modelCode
                auxiliaryName += '_' + selectText
                curObj[auxiliaryType] = selectId
                curObj[auxiliaryType + 'Id'] = selectId
              }
            }
            curObj.coaCobinationCode = auxiliaryCode.substring(1)
            curObj.coaCobinationName = auxiliaryName.substring(1)
            curObj.showCoaCode = curObj.coaCode + '_' + curObj.coaCobinationCode
            curObj.showCoaName = curObj.coaName + '_' + curObj.coaCobinationName
          }
          curObj.leaf = 1
          curObj.type = 0
          curObj.isAuxiliary = 1
          curObj.beginBalance = this.temp.beginBalance
          curObj.beginBalanceQty = this.temp.beginBalanceQty
          curObj.yearNetDr = this.temp.yearNetDr
          curObj.yearNetQtyDr = this.temp.yearNetQtyDr
          curObj.yearNetCr = this.temp.yearNetCr
          curObj.yearNetQtyCr = this.temp.yearNetQtyCr
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.tableData.splice(this.curShowIndex + 1, 0, curObj)
              this.dialogFormVisible2 = false
              this.$nextTick(() => {
                this.calculate(curObj)
              })
            }
          })
        }
      })
    },
    saveData(type) {
      var info = ''
      this.getBalanceObj()
      if (this.balanceObj.diffBalance !== 0) {
        info = '借贷方期初余额不等,'
      }
      if (this.balanceObj.diffYearNet !== 0) {
        info = '借贷方发生额不等,'
      }
      this.saveloading = true
      this.auxiliaryData = deepClone(this.tableData)
      updateListForSetBegin(this.auxiliaryData).then(res => {
        this.saveloading = false
        this.dialogFormVisible2 = false
        if (res.data.errorCode === '0') {
          if (type === 0) {
            this.$message.success(info + '期初余额保存完成!')
          }
          if (type === 1) {
            this.$message.success('辅助核算设置完成!')
          }
          if (type === 2) {
            this.$message.success('关闭辅助核算设置完成!')
          }
          this.getData()
        }
      }).catch(() => {
        this.saveloading = false
      })
    },
    getData() {
      this.listLoading = true
      var obj = {
        periodId: userInfo.glBookEntity.enablePeriodId,
        periodCode: userInfo.glBookEntity.enablePeriodCode,
        periodName: userInfo.glBookEntity.enablePeriodName,
        periodYear: userInfo.glBookEntity.enablePeriodYear,
        periodNum: userInfo.glBookEntity.enablePeriodNum,
        coaHierarchyId: userInfo.glBookEntity.coahierarchyId
      }
      getBalance(obj).then(res => {
        this.listLoading = false
        this.tableData = res.data.data || []
        this.auxiliaryData = this.tableData
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
input{display:block;width:100%;height:100%;;font-size: 12px;padding-right:8px;border:none}
input[disabled]{background: #f9f9f9;}
>>> .tx-r input{text-align:right}
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}
>>> .el-table .cell{padding:0;height:32px;}
>>> .el-table td {padding:0px;}

.label:first-child {
    margin-left: 0
}
>>> .el-form-item{margin-bottom: 20px;}

>>> .el-table.balance th {
    padding: 5px 0;
}
.tabletxt{display:inline-block;line-height:32px}
>>> .el-button--mini.is-circle{padding: 4px;}
>>> .auditform .el-form-item__label{line-height:24px;padding-bottom:0px}
</style>
