<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker :editable="false" v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="mini" v-model="temp.billNo" placeholder="单据号" disabled />
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
                <el-form-item label="收款方式:" prop="paymentTypeId">
                    <paymentTypeList @selectChange="selectChange" :selectId="temp.paymentTypeId"></paymentTypeList>
                </el-form-item>
                <el-form-item label="收款到期日:" prop="paymentDueDate">
                    <el-date-picker :editable="false" v-model="temp.paymentDueDate" type="date" placeholder="付款到期日" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合计金额:" prop="itemAmount">
                    <el-input size="mini" v-model="temp.itemAmount" placeholder="合计金额" disabled/>
                </el-form-item>
                <el-form-item label="退预付:" prop="advPayAmount">
                    <el-input size="mini" v-model="temp.advPayAmount" placeholder="退预付" />
                </el-form-item>
                <el-form-item label="现结金额:" prop="currPayAmount">
                    <el-input size="mini" v-model="temp.currPayAmount" placeholder="现结金额" style="width:72px" disabled />
                    <el-button size="mini" style="width:44px;padding:6px" @click="showSettleType">选择</el-button>
                </el-form-item>
                <el-form-item label="返利金额:" prop="rebateAmount">
                    <el-input size="mini" v-model="temp.rebateAmount" placeholder="返利金额" />
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell" height="501" append>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码" width="160">
                <template slot-scope="scope">
                    <itemList :selectId="scope.row.itemId" :selectCode="scope.row.itemCode" :index="scope.$index" @changeVal="changeVal"></itemList>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="160">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemName" disabled>
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-l" v-model="row.norms" disabled>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="批号">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-l" v-model="row.batchNo">
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
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <input type="text" :index="scope.$index" class="inputCell tx-r" v-model="scope.row.qty" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="单价">
                <template slot-scope="scope">
                    <input type="text" :index="scope.$index" class="inputCell tx-r" v-model="scope.row.price" @change="calculate(scope.$index)">
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
                    <input type="text" class="inputCell tx-r" v-model="row.vatAmount||0" disabled>
                </template>
            </el-table-column>
            <el-table-column label="是否赠品" align="center">
                <template slot-scope="{row}">
                    <el-checkbox v-model="row.isGift" false-label="0" true-label="1"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="392px">
            <el-table :data="settleData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
                <el-table-column label="名称" width="146">
                    <template slot-scope="scope">
                        <settleTypeList :settleTypeArr="settleTypeArr" :selectCode="scope.row.settleTypeCode" :selectArap="scope.row.arAp" :selectName="scope.row.settleTypeName" :index="scope.$index" @settleTypeChange="settleTypeChange">
                        </settleTypeList>
                    </template>
                </el-table-column>
                <el-table-column label="预付应付标志" width="120">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l" v-model="row.arAp" disabled>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="scope">
                        <input type="text" class="inputCell tx-l" v-model="scope.row.amount" @change="calculate1(scope.$index)">
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
            </div>
        </el-dialog>
        <div class="dataTable" style="margin-top: 10px">
            <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="备 注:" prop="remarks">
                    <el-input size="mini" v-model="temp.remarks" placeholder="备注" style="width:790px" />
                </el-form-item>
            </el-form>
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单人:" prop="recorder">
                    <el-input size="mini" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人:" prop="auditor">
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
import { mapGetters } from 'vuex'
import { savePurchaseReturned, getPurchaseReturnedById } from '@/api/store';
import { getAllNoADVR } from '@/api/basedata';
import { deleteEmptyProp, addNullObj,addNullObj2 } from '@/utils';
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import warehouseList from '@/components/selects/warehouseList';
import paymentTypeList from '@/components/selects/paymentTypeList';
import itemList from '@/components/selects/itemList';
import bizTypeList from "@/components/selects/bizTypeList";
import settleTypeList from "@/components/selects/settleTypeList";
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'returnedAdd',
    components: { staffList, warehouseList, supplierList, bizTypeList, paymentTypeList, itemList,settleTypeList },
    data() {
        return {
            id: '',
            status: this.$route.query.status,
            dialogFormVisible: false,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            settleData: [{}, {}, {}, {},{}],
            keys: ["itemId", "itemCode", "itemName", "norms", "uom", "subUom", "exchangeRate", "batchNo", "productionDate", "qualityName", "qualityDays", "qty", "price", "amount", "taxRate", "taxAmount", "vatAmount", "invoiceNo", "bGift"],
            temp: {
                billDate:getNowDate(),
                remarks:'',
                billNo: '',
                bizTypeId: '',
                supplierId: "",
                warehouseId: '',
                warehouseName: '',
                staffId: '',
                paymentTypeId: '',
                paymentDueDate:'',
                itemAmount: '',
                advPayAmount: '',
                currPayAmount: '',
                rebateAmount: '',
                auditDate:'',
                auditor: "",
                recordDate:getNowDate()+" 00:00:00",
                recorder: getName()
            }
        }
    },
    computed: {
        ...mapGetters([
          'settleTypeArr',
          'truckList'
        ])
    },
    created() {
        this.$store.dispatch('basedata/getPurchaseReturnedSettleType')
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            getPurchaseReturnedById(this.id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.data[key]
                }
                for (var i = 0; i < res.data.data.purchaseReturnedLine.length; i++) {
                    for (var j = 0; j < this.keys.length; j++) {
                        this.tableData[i][this.keys[j]] = res.data.data.purchaseReturnedLine[i][this.keys[j]]
                    }
                }
                this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
            })
        }
    },
    methods: {
        calculate(index) {
            var qty = this.tableData[index].qty;
            var price = this.tableData[index].price;
            if(qty&&price){
                var amount = parseFloat(Number(qty) * Number(price)).toFixed(2);
                this.$set(this.tableData[index],'amount',amount)
                this.$set(this.tableData[index],'vatAmount',amount)
                var taxRate = this.tableData[index].taxRate;
                if(taxRate){
                    var taxAmount = parseFloat(Number(amount)*Number(taxRate)/100).toFixed(2);
                    var vatAmount = parseFloat(Number(amount)*(Number(taxRate)/100+1)).toFixed(2);
                    this.$set(this.tableData[index],'taxAmount',taxAmount)
                    this.$set(this.tableData[index],'vatAmount',vatAmount)
                    this.calculateTotal();
                }
            }
        },
        calculate1(index){
            var amount = 0;
            for (var i = 0; i < this.settleData.length; i++) {
                if (this.settleData[i] && this.settleData[i].amount) {
                    amount += Number(this.settleData[i].amount);
                }
            }
            this.temp.currPayAmount = parseFloat(amount).toFixed(2);
        },
        calculate2(){
            if(this.temp.advPayAmount){
                this.temp.currPayAmount = this.temp.itemAmount - this.temp.advPayAmount;
            } else {
                this.temp.currPayAmount = this.temp.itemAmount;
            }
        },
        calculateTotal() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].vatAmount) {
                    amount += Number(this.tableData[i].vatAmount);
                }
            }
            this.temp.itemAmount = parseFloat(amount).toFixed(2);
        },
        selectChange(obj) {
            for (var key in obj) {
                this.temp[key] = obj[key];
            }
            if (obj && obj.warehouseName) {
                this.temp.warehouseName = obj.warehouseName
            }
        },
        showSettleType() {
            this.dialogFormVisible = true
        },
        settleTypeChange(obj){
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key];
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
            this.temp.purchaseReturnedLine = deleteEmptyProp(this.tableData);
            this.temp.settleTypeReturnedDetail = this.settleData;
            savePurchaseReturned(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.temp.id == "" ? '新增成功' : '修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/purchase/returned');
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(()=>{
                this.$message.error('保存失败，请稍后重试！')
            })
        }
    }
}
</script>