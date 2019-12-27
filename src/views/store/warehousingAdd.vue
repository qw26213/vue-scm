<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="64px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="mini" v-model="temp.billNo" placeholder="单据号" />
                </el-form-item>
                <el-form-item label="业务类型:" prop="bizTypeId">
                    <bizTypeList @selectChange="selectChange" :selectId="temp.bizTypeId"></bizTypeList>
                </el-form-item>
                <el-form-item label="供应商:" prop="supplierId">
                    <supplierList @selectChange="selectChange" :selectId="temp.supplierId"></supplierList>
                </el-form-item>
                <el-form-item label="仓库:" prop="warehouseId">
                    <warehouseList @selectChange="selectChange" keyType="warehouseId" :selectId="temp.warehouseId"></warehouseList>
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码">
                <template slot-scope="scope">
                    <itemList :selectId="scope.row.itemId" :selectCode="scope.row.itemCode" :index="scope.$index" @changeVal="changeVal"></itemList>
                </template>
            </el-table-column>
            <el-table-column label="商品名称">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemName" disabled>
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.norms" disabled>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="批号">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.batchNo">
                </template>
            </el-table-column>
            <el-table-column label="生产日期" width="120">
                <template slot-scope="{row}">
                    <el-date-picker :editable="false" v-model="row.productionDate" type="date" placeholder="" size="mini" style="width:100%" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="保质期(天)">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.qualityDays">
                </template>
            </el-table-column>
            <el-table-column label="数量" width="90">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.qty" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="单价(元)">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.price" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="金额">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.amount" disabled>
                </template>
            </el-table-column>
            <el-table-column label="税率(%)">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.taxRate" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="税额">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.taxAmount" disabled>
                </template>
            </el-table-column>
            <el-table-column label="价税合计">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.vatAmount" disabled>
                </template>
            </el-table-column>
            <el-table-column label="是否赠品" align="center">
                <template slot-scope="{row}">
                    <el-checkbox v-model="row.bGift"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd 00:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单人:" prop="recorderId">
                    <el-input size="mini" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd 00:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人:" prop="auditorId">
                    <el-input size="mini" v-model="temp.auditor" placeholder="审核人" />
                </el-form-item>
            </el-form>
        </div>
        <div class="tx-c" style="margin-top:15px" v-if="status!=1&&status!=2">
            <el-button class="filter-item" type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script>
import { saveWarehousing, getWarehousingById } from '@/api/store'
import { deleteEmptyProp, addNullObj } from '@/utils'
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import warehouseList from '@/components/selects/warehouseList';
import bizTypeList from '@/components/selects/bizTypeList';
import itemList from '@/components/selects/itemList';
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'warehousingAdd',
    components: { staffList, warehouseList, supplierList, bizTypeList, itemList },
    data() {
        return {
            id: '',
            status: this.$route.query.satus,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            temp: {
                billDate:getNowDate(),
                billNo: '',
                supplierId: '',
                bizTypeId: '',
                staffId: '',
                warehouseId: '',
                warehouseName: '',
                auditDate: "",
                auditor: "",
                recordDate:getNowDate()+" 00:00:00",
                recorder: getName()
            }
        }
    },
    created() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            getWarehousingById(this.id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.body[key]
                }
                this.tableData = addNullObj(res.data.body.warehousingEntryLine);
            })
        }
    },
    methods: {
        calculate(index) {
            var qty = this.tableData[index].qty;
            var price = this.tableData[index].price;
            if (qty && price) {
                var amount = parseFloat(Number(qty) * Number(price)).toFixed(2);
                this.$set(this.tableData[index],'amount',amount)
                this.$set(this.tableData[index],'vatAmount',amount)
                var taxRate = this.tableData[index].taxRate;
                if (taxRate) {
                    var taxAmount = parseFloat(Number(amount) * Number(taxRate) / 100).toFixed(2);
                    var vatAmount = parseFloat(Number(amount) + Number(taxAmount)).toFixed(2)
                    this.$set(this.tableData[index],'taxAmount',taxAmount)
                    this.$set(this.tableData[index],'vatAmount',vatAmount)
                }
            }
        },
        selectChange(obj) {
            for (var key in obj) {
                this.temp[key] = obj[key];
            }
            if (obj && obj.warehouseName) {
                this.temp.warehouseName = obj.warehouseName
            }
        },
        changeVal(obj) {
            for (var key in obj) {
                this.tableData[obj.index][key] = obj[key];
            }
            if (obj.index + 1 == this.tableData.length) {
                this.tableData.push({});
                this.$nextTick(() => {
                    let container = this.$el.querySelector('.el-table__body-wrapper');
                    container.scrollTop = container.scrollHeight;
                })
            }
        },
        save() {
            this.temp.id = this.id;
            this.temp.warehousingEntryLine = deleteEmptyProp(this.tableData);
            saveWarehousing(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.temp.id == "" ? '新增成功' : '修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace('/store/warehousing');
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>