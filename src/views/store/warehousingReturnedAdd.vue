<template>
  <div class="app-container">
    <div class="dataTable">
      <el-form :inline="true" label-position="right" label-width="64px" style="width: 100%; margin-top:0px;">
        <el-form-item label="单据日期:" prop="billDate">
          <el-date-picker v-model="temp.billDate" type="date" placeholder="单据日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="单据号:" prop="billNo">
          <el-input v-model="temp.billNo" size="small" placeholder="单据号" disabled />
        </el-form-item>
        <el-form-item label="供应商:" prop="supplierId">
          <supplierList :select-id="temp.supplierId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="仓库:" prop="warehouseId">
          <warehouseList key-type="warehouseId" :select-id="temp.warehouseId" @selectChange="selectChange" />
        </el-form-item>
        <el-form-item label="业务员:" prop="staffId">
          <staffList :select-id="temp.staffId" @selectChange="selectChange" />
        </el-form-item>
      </el-form>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="商品" width="300">
          <template slot-scope="scope">
            <itemList :select-id="scope.row.itemId" :select-code="scope.row.itemCode" :index="scope.$index" @changeVal="changeVal" />
          </template>
        </el-table-column>
        <el-table-column label="规格">
          <template slot-scope="{row}">
            <input v-model="row.norms" type="text" class="inputCell" disabled>
          </template>
        </el-table-column>
        <el-table-column label="单位" width="60">
          <template slot-scope="{row}">
            <input v-model="row.uom" type="text" class="inputCell tx-c" disabled>
          </template>
        </el-table-column>
        <el-table-column label="批号">
          <template slot-scope="{row}">
            <input v-model="row.batchNo" type="text" class="inputCell">
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
            <input v-model="scope.row.vatPrice" type="text" class="inputCell tx-r" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <input v-model="scope.row.qty" type="text" :index="scope.$index" class="inputCell tx-r" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="价税合计">
          <template slot-scope="{row}">
            <input v-model="row.vatAmount" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column label="税率(%)">
          <template slot-scope="scope">
            <input v-if="taxFilingCategoryCode==0" type="text" class="inputCell tx-r" value="0" disabled>
            <input v-else v-model="scope.row.taxRate" type="text" class="inputCell tx-r" @change="calculate(scope.$index)">
          </template>
        </el-table-column>
        <el-table-column label="税额">
          <template slot-scope="{row}">
            <input v-model="row.taxAmount" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="{row}">
            <input v-model="row.amount" type="text" class="inputCell tx-r" disabled>
          </template>
        </el-table-column>
      </el-table>
      <div class="dataTable" style="margin-top: 10px">
        <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
          <el-form-item label="备 注:" prop="remarks">
            <el-input v-model="temp.remarks" size="small" placeholder="备注" style="width:790px" />
          </el-form-item>
        </el-form>
        <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
          <el-form-item label="制单日期:" prop="recordDate">
            <el-date-picker v-model="temp.recordDate" :editable="false" type="date" placeholder="制单日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd 00:00:00" />
          </el-form-item>
          <el-form-item label="制单人:" prop="recorderId">
            <el-input v-model="temp.recorder" size="small" placeholder="制单人" />
          </el-form-item>
          <el-form-item label="审核日期:" prop="auditDate">
            <el-date-picker v-model="temp.auditDate" :editable="false" type="date" placeholder="审核日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd 00:00:00" />
          </el-form-item>
          <el-form-item label="审核人:" prop="auditorId">
            <el-input v-model="temp.auditor" size="small" placeholder="审核人" />
          </el-form-item>
        </el-form>
      </div>
      <div class="tx-c" style="margin-top:15px">
        <el-button v-if="$route.path.indexOf('etail') < 0" class="submitBtn" type="primary" @click="save">保 存</el-button>
        <el-button v-else class="submitBtn" type="primary" @click="$store.dispatch('tagsView/delView', $route);$router.replace('/store/warehousingReturned')">返 回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { saveWarehousingReturned, getWarehousingReturnedById } from '@/api/store'
import { deleteEmptyProp, addNullObj } from '@/utils'
import staffList from '@/components/selects/staffList'
import supplierList from '@/components/selects/supplierList'
import warehouseList from '@/components/selects/warehouseList'
import itemList from '@/components/selects/itemList'
import { getName, getNowDate } from '@/utils/auth'
const userInfo = JSON.parse(sessionStorage.userInfo)
export default {
  name: 'WarehousingReturnedAdd',
  components: { staffList, warehouseList, supplierList, itemList },
  data() {
    return {
      id: '',
      status: this.$route.query.satus,
      taxFilingCategoryCode: userInfo.taxFilingCategoryCode,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      temp: {
        remarks: '',
        billDate: getNowDate(),
        billNo: '',
        supplierId: '',
        bizTypeId: '',
        staffId: '',
        warehouseId: '',
        warehouseName: '',
        auditDate: '',
        auditor: '',
        recordDate: getNowDate() + ' 00:00:00',
        recorder: getName()
      }
    }
  },
  created() {
    this.$store.dispatch('basedata/getitemlist')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      getWarehousingReturnedById(this.id).then(res => {
        for (var key in this.temp) {
          this.temp[key] = res.data.data[key]
        }
        this.tableData = addNullObj(res.data.data.warehousingEntryReturnedLine)
        this.tableData.forEach(item => {
          if (item.taxRate < 1) {
            item.taxRate = item.taxRate * 100
          }
        })
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
          var price = parseFloat(Number(vatPrice) / (Number(taxRate) / 100 + 1)).toFixed(2)
          var amount = parseFloat(Number(qty) * Number(price)).toFixed(2)
          var taxAmount = parseFloat(Number(vatAmount) - Number(amount)).toFixed(2)
          this.$set(this.tableData[index], 'taxAmount', taxAmount)
          this.$set(this.tableData[index], 'price', price)
          this.$set(this.tableData[index], 'amount', amount)
        } else {
          this.$set(this.tableData[index], 'taxRate', 0)
          this.$set(this.tableData[index], 'price', 0)
          this.$set(this.tableData[index], 'amount', 0)
        }
      }
    },
    selectChange(obj) {
      for (var key in obj) {
        this.temp[key] = obj[key]
      }
      if (obj && obj.warehouseName) {
        this.temp.warehouseName = obj.warehouseName
      }
    },
    changeVal(obj) {
      for (var key in obj) {
        this.tableData[obj.index][key] = obj[key]
      }
      if (obj.index + 1 === this.tableData.length) {
        this.tableData.push({})
        this.$nextTick(() => {
          const container = this.$el.querySelector('.el-table__body-wrapper')
          container.scrollTop = container.scrollHeight
        })
      }
    },
    save() {
      this.temp.id = this.id
      this.temp.warehousingEntryReturnedLine = deleteEmptyProp(this.tableData)
      saveWarehousingReturned(this.temp).then(res => {
        if (res.data.errorCode === '0') {
          this.$message.success(this.temp.id === '' ? '新增成功' : '修改成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/store/warehousingReturned')
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
