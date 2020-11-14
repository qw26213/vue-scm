<template>
  <div class="app-container">
    <div class="contentDiv">
      <div class="tx-r" style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="saveData(0)">保存</el-button>
        <el-button size="small" type="primary" @click="showTable()">试算平衡汇总</el-button>
      </div>
      <el-table v-loading="listLoading" class="balance" :data="tableData" border fit resize empty-text="暂无相关数据" style="width: 100%;" :height="tableHeight">
        <el-table-column label="科目编码" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.coaCode }}</span>
            <el-button v-if="scope.row.leaf == 1 && scope.row.type ==1 && scope.row.isAuxiliary == 1 && balanceStatus == 1" type="primary" size="mini" style="margin-left:10px" @click="showSuplyConfig(scope.$index)">设置</el-button>
            <el-button v-if="scope.row.leaf == 1 && scope.row.type !=1 && scope.row.isAuxiliary == 1 && balanceStatus == 1" type="danger" size="mini" style="margin-left:10px" @click="removeRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="110" style="padding-right:100px;" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.showCoaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方向" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crDr==1?'借':row.crDr==0?'平':'贷' }}</span>
          </template>
        </el-table-column>
        <!-- type0为余额表节点 1为科目节点 -->
        <el-table-column :label="'期初余额('+userInfo.glBookEntity.enablePeriodCode+')'" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.beginBalance" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.beginBalanceQty" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'本年借方累计'+ (userInfo.glBookEntity.enablePeriodNum > 1 ? '(1-' + (userInfo.glBookEntity.enablePeriodNum - 1) + '月)':'')" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.periodNetDr" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.periodNetQtyDr" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'本年贷方累计'+ (userInfo.glBookEntity.enablePeriodNum > 1 ? '(1-' + (userInfo.glBookEntity.enablePeriodNum - 1) + '月)':'')" min-width="240">
          <el-table-column label="金额(元)" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.periodNetCr" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="80" align="right">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.periodNetQtyCr" class="tx-r" size="small" :disabled="scope.row.leaf==0||(scope.row.isAuxiliary==1&&scope.row.type==1)" @change="valChange(scope.row)" />
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
            <span>{{ row.sumPeriodNetDr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="贷方发生额">
          <template slot-scope="{row}">
            <span>{{ row.sumPeriodNetCr }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="差额">
          <template slot-scope="{row}">
            <span>{{ row.diffPeriodNet }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否平衡">
          <template slot-scope="{row}">
            <span>{{ row.diffBalance == 0 && row.diffPeriodNet == 0?'平衡':'不平衡' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="设置辅助核算" :visible.sync="dialogFormVisible2" width="820px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="80px" style="width: 760px; margin-left:15px;">
        <el-form-item label="期初余额" prop="beginBalance" label-width="80px">
          <el-input v-model="temp.beginBalance" placeholder="期初余额" style="width:120px" />
        </el-form-item>
        <el-form-item label="本年累计借方金额" prop="periodNetDr" label-width="140px">
          <el-input v-model="temp.periodNetDr" placeholder="本年累计借方金额" style="width:120px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="本年累计贷方金额" prop="periodNetCr" label-width="140px">
          <el-input v-model="temp.periodNetCr" placeholder="本年累计贷方金额" style="width:120px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="期初数量" prop="beginBalanceQty" label-width="80px">
          <el-input v-model="temp.beginBalanceQty" placeholder="期初数量" style="width:120px" />
        </el-form-item>
        <el-form-item label="本年累计借方数量" prop="periodNetQtyDr" label-width="140px">
          <el-input v-model="temp.periodNetQtyDr" placeholder="本年累计借方数量" style="width:120px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item label="本年累计贷方数量" prop="periodNetQtyCr" label-width="140px">
          <el-input v-model="temp.periodNetQtyCr" placeholder="本年累计贷方数量" style="width:120px" :disabled="userInfo.glBookEntity.enablePeriodNum == 1" />
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(0)=='1'" label="供应商" prop="supplierId">
          <el-select ref="supplierSelect" v-model="temp.supplierId" placeholder="供应商" style="width:120px">
            <el-option v-for="(item,index) in supplierList" :key="item.supplierCode" :label="item.supplierName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(1)=='1'" label="客户" prop="custId">
          <el-select ref="custSelect" v-model="temp.custId" placeholder="客户" style="width:120px">
            <el-option v-for="(item,index) in custList" :key="item.custCode" :label="item.custName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(2)=='1'" label="部门" prop="deptId">
          <el-select ref="deptSelect" v-model="temp.deptId" placeholder="部门" style="width:120px">
            <el-option v-for="(item,index) in deptList" :key="item.deptCode" :label="item.deptName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(3)=='1'" label="职员" prop="staffId">
          <el-select ref="staffSelect" v-model="temp.staffId" placeholder="职员" style="width:120px">
            <el-option v-for="(item,index) in staffList" :key="item.staffCode" :label="item.staffName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(4)=='1'" label="存货" prop="itemId">
          <el-select ref="itemSelect" v-model="temp.itemId" placeholder="存货" style="width:120px">
            <el-option v-for="(item,index) in itemList" :key="item.itemCode" :label="item.itemName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.auxiliary && temp.auxiliary.charAt(5)=='1'" label="项目" prop="projId">
          <el-select ref="projSelect" v-model="temp.projId" placeholder="项目" style="width:120px">
            <el-option v-for="(item,index) in projList" :key="item.projCode" :label="item.projName" :value="item.id" />
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
import { getProj, getDept, getStaff, getSupplier, getCust, getItem } from '@/api/user'
import { getNowDate, deepClone, toNumStr } from '@/utils'
var userInfo = JSON.parse(sessionStorage.userInfo)
var hexCas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
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
      auxiliaryData: [],
      tableHeight: document.body.clientHeight - 183, // document.querySelector(".app-main").clientHeight - 83,
      temp: {
        auxiliary: '000000000000000',
        beginBalance: 0,
        periodNetDr: 0,
        periodNetCr: 0,
        beginBalanceQty: 0,
        periodNetQtyDr: 0,
        periodNetQtyCr: 0
      },
      rules: {
        beginBalance: [{ required: true, message: '不能为空', trigger: 'change' }],
        periodNetDr: [{ required: true, message: '不能为空', trigger: 'change' }],
        periodNetCr: [{ required: true, message: '不能为空', trigger: 'change' }],
        beginBalanceQty: [{ required: true, message: '不能为空', trigger: 'change' }],
        periodNetQtyDr: [{ required: true, message: '不能为空', trigger: 'change' }],
        periodNetQtyCr: [{ required: true, message: '不能为空', trigger: 'change' }],
        supplierId: [{ required: true, message: '不能为空', trigger: 'change' }],
        custId: [{ required: true, message: '不能为空', trigger: 'change' }],
        staffId: [{ required: true, message: '不能为空', trigger: 'change' }],
        projId: [{ required: true, message: '不能为空', trigger: 'change' }],
        itemId: [{ required: true, message: '不能为空', trigger: 'change' }],
        deptId: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      custList: [],
      deptList: [],
      itemList: [],
      supplierList: [],
      staffList: [],
      projList: [],
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
  },
  methods: {
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
    showTable() {
      this.getBalanceObj()
      this.dialogFormVisible1 = true
    },
    removeRow(index) {
      this.tableData.splice(index, 1)
      // this.saveData(2)
    },
    getBalanceObj() {
      var obj = {
        sumBalanceDr: 0,
        sumBalanceCr: 0,
        sumPeriodNetDr: 0,
        sumPeriodNetCr: 0,
        diffBalance: 0,
        diffPeriodNet: 0
      }
      const arr = this.tableData
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].leaf == 0 || arr[i].type == 1 && arr[i].isAuxiliary == '1') {
          continue
        }
        var tmpCrDr = arr[i].crDr // 方向
        var tmpBeginBalance = Number(arr[i].beginBalance) // 期初金额
        var tmpBeginBalanceQty = Number(arr[i].beginBalanceQty) // 期初数量
        var tmpPeriodNetDr = Number(arr[i].periodNetDr) // 借方金额
        var tmpPeriodNetQtyDr = Number(arr[i].periodNetQtyDr) // 借方数量
        var tmpPeriodNetCr = Number(arr[i].periodNetCr) // 贷方金额
        var tmpPeriodNetQtyCr = Number(arr[i].periodNetQtyCr) // 贷方数量
        if (tmpCrDr == 1) {
          obj.sumBalanceDr = obj.sumBalanceDr + tmpBeginBalance
        } else {
          obj.sumBalanceCr = obj.sumBalanceCr + tmpBeginBalance
        }
        obj.sumPeriodNetDr = obj.sumPeriodNetDr + arr[i].periodNetDr
        obj.sumPeriodNetCr = obj.sumPeriodNetCr + arr[i].periodNetCr
      }
      obj.diffBalance = obj.sumBalanceDr - obj.sumBalanceCr
      obj.diffPeriodNet = obj.sumPeriodNetDr - obj.sumPeriodNetCr
      this.balanceObj = obj
    },
    valChange(row) {
      this.$nextTick(() => {
        const crDr = row.crDr
        const balance = toNumStr(row.beginBalance)
        const balanceQty = toNumStr(row.beginBalanceQty)
        const periodNetDr = toNumStr(row.periodNetDr)
        const periodNetQtyDr = toNumStr(row.periodNetQtyDr)
        const periodNetCr = toNumStr(row.periodNetCr)
        const periodNetQtyCr = toNumStr(row.periodNetQtyCr)
        row.beginBalance = balance
        row.beginBalanceQty = balanceQty
        row.periodNetDr = periodNetDr
        row.periodNetQtyDr = periodNetQtyDr
        row.periodNetCr = periodNetCr
        row.periodNetQtyCr = periodNetQtyCr
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
        if (row.type == 0) {
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
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].coaCode == coaCode && this.tableData[i].type == 0) {
          amount1 += Number(this.tableData[i].beginBalance)
          amount2 += Number(this.tableData[i].beginBalanceQty)
          amount3 += Number(this.tableData[i].periodNetDr)
          amount4 += Number(this.tableData[i].periodNetQtyDr)
          amount5 += Number(this.tableData[i].periodNetCr)
          amount6 += Number(this.tableData[i].periodNetQtyCr)
        }
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].coaCode == coaCode && this.tableData[i].type == 1) {
          this.$set(this.tableData[i], 'beginBalance', amount1)
          this.$set(this.tableData[i], 'beginBalanceQty', amount2)
          this.$set(this.tableData[i], 'periodNetDr', amount3)
          this.$set(this.tableData[i], 'periodNetQtyDr', amount4)
          this.$set(this.tableData[i], 'periodNetCr', amount5)
          this.$set(this.tableData[i], 'periodNetQtyCr', amount6)
          if (this.tableData[i].coaCode.length > 4) {
            this.calculateTop(row.coaCode)
          }
        }
      }
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
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].coaCode.substr(0, this.tableData[i].coaCode.length - 2) == parentCode && this.tableData[i].type == 1) {
          amount1 += Number(this.tableData[i].beginBalance)
          amount2 += Number(this.tableData[i].beginBalanceQty)
          amount3 += Number(this.tableData[i].periodNetDr)
          amount4 += Number(this.tableData[i].periodNetQtyDr)
          amount5 += Number(this.tableData[i].periodNetCr)
          amount6 += Number(this.tableData[i].periodNetQtyCr)
        }
      }
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].coaCode == parentCode && this.tableData[i].type == 1) {
          this.$set(this.tableData[i], 'beginBalance', amount1)
          this.$set(this.tableData[i], 'beginBalanceQty', amount2)
          this.$set(this.tableData[i], 'periodNetDr', amount3)
          this.$set(this.tableData[i], 'periodNetQtyDr', amount4)
          this.$set(this.tableData[i], 'periodNetCr', amount5)
          this.$set(this.tableData[i], 'periodNetQtyCr', amount6)
          if (this.tableData[i].coaCode.length > 4) {
            this.calculateTop(this.tableData[i].coaCode)
          }
        }
      }
    },
    showSuplyConfig(index) {
      this.dialogFormVisible2 = true
      this.curShowIndex = index
      this.temp = this.tableData[index]
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveAuxiliaryConfig() {
      var editIndex = this.curShowIndex
      var curObj = this.auxiliaryData[editIndex]
      var auxiliary = curObj.auxiliary
      if (auxiliary != null && auxiliary.length > 0) {
        var auxiliaryCode = ''
        var auxiliaryName = ''
        var auxiliaries = auxiliary.split('')
        var AuxiliaryType = ['supplier', 'cust', 'dept', 'staff', 'item', 'proj']
        for (var i = 0; i < auxiliaries.length; i++) {
          if (auxiliaries[i] != null && auxiliaries[i] == 1) {
            // 显示对应的辅助核算项 1-26
            var auxiliaryType = AuxiliaryType[i]
            /* 获取当前辅助核算项的值 */
            var selectId = this.$refs[auxiliaryType + 'Select'].selected.value
            var selectText = this.$refs[auxiliaryType + 'Select'].selected.label
            var modelCode = this.$refs[auxiliaryType + 'Select'].selected.key
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
      this.tableData.splice(this.curShowIndex + 1, 0, curObj)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible2 = false
          // this.saveData(1)
        }
      })
    },
    saveData(type) {
      var info = ''
      this.getBalanceObj()
      if (this.balanceObj.diffBalance !== 0) {
        info = '借贷方期初余额不等,'
      }
      if (this.balanceObj.diffPeriodNet !== 0) {
        info = '借贷方发生额不等,'
      }
      updateListForSetBegin(this.auxiliaryData).then(res => {
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
        } else {
          if (type === 0) {
            this.$message.warning(info + '期初余额保存失败!')
          }
          if (type === 1 || type === 2) {
            this.$message.warning(res.data.msg)
          }
        }
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
        this.auxiliaryData = deepClone(this.tableData)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}

>>> .el-table.balance th {
    padding: 5px 0;
}
</style>
