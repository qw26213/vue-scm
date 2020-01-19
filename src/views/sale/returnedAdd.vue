<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker :editable="false" v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="mini" v-model="temp.billNo" placeholder="单据号" disabled />
                </el-form-item>
                <el-form-item label="业务类型:" prop="bizTypeId">
                    <bizTypeList @selectChange="selectChange" :selectId="temp.bizTypeId"></bizTypeList>
                </el-form-item>
                <el-form-item label="客户:" prop="custId">
                    <custList @selectChange="selectChange" keyType="custId" :selectId="temp.custId" :selectName="temp.custName"></custList>
                </el-form-item>
                <el-form-item label="结算客户:" prop="settleCustId">
                    <custList @selectChange="selectChange" keyType="settleCustId" :selectId="temp.settleCustId"></custList>
                </el-form-item>
                <el-form-item label="仓库:" prop="warehouseId">
                    <warehouseList @selectChange="selectChange" allowNull="1" keyType="warehouseId" :selectId="temp.warehouseId"></warehouseList>
                </el-form-item>
                <el-form-item label="车辆:" prop="truckId">
                    <truckList @selectChange="selectChange" allowNull="1" keyType="truckId" :selectId="temp.truckId"></truckList>
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
                <el-form-item label="收款方式:" prop="paymentTypeId">
                    <paymentTypeList @selectChange="selectChange" :selectId="temp.paymentTypeId"></paymentTypeList>
                </el-form-item>
                <el-form-item label="收款到期日:" prop="paymentDueDate">
                    <el-date-picker :editable="false" v-model="temp.paymentDueDate" type="date" placeholder="收款到期日" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合计金额:" prop="itemAmount">
                    <el-input size="mini" v-model="temp.itemAmount" placeholder="合计金额" disabled />
                </el-form-item>
                <el-form-item label="抹零金额:" prop="withoutPayAmount">
                    <el-input size="mini" v-model="temp.withoutPayAmount" placeholder="抹零金额" />
                </el-form-item>
                <el-form-item label="现结金额:" prop="currPayAmount">
                    <el-input size="mini" v-model="temp.currPayAmount" placeholder="现结金额" style="width:72px" disabled />
                    <el-button size="mini" style="width:44px;padding:6px" @click="showSettleType">选择</el-button>
                </el-form-item>
                <el-form-item label="返利金额:" prop="rebateAmount">
                    <el-input size="mini" v-model="temp.rebateAmount" placeholder="返利金额" />
                </el-form-item>
                <el-form-item label="退款类型:" prop="returnedType">
                    <el-select v-model="temp.returnedType" placeholder="退款类型" size="mini">
                        <el-option label="退款退货" value="0"></el-option>
                        <el-option label="退换货" value="1"></el-option>
                        <el-option label="只退款" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码" width="160">
                <template slot-scope="scope">
                    <itemList :selectCode="scope.row.itemCode" :selectId="scope.row.itemId" :index="scope.$index" @changeVal="changeVal"></itemList>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="160">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemName" disabled>
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.norms" disabled>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="批号">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.batchNo">
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
            <el-table-column label="单价(元)">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.price" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.qty" @change="calculate(scope.$index)">
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
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单人:" prop="recorderId">
                    <el-input size="mini" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
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
        <modalTable :modalTableVisible="modalTableVisible"></modalTable>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import modalTable from '@/components/modalTable/saleBill';
import { saveSalesReturned, getSalesReturnedById, getItemPrice, getSalesReturnedBySalesHeaderId } from '@/api/store';
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils';
import staffList from '@/components/selects/staffList';
import bizTypeList from '@/components/selects/bizTypeList'
import custList from '@/components/selects/custList';
import truckList from '@/components/selects/truckList';
import warehouseList from '@/components/selects/warehouseList';
import paymentTypeList from '@/components/selects/paymentTypeList';
import itemList from '@/components/selects/itemList';
import settleTypeList from "@/components/selects/settleTypeList";
import { getName, getNowDate } from '@/utils/auth'
export default {
    name: 'saleAdd',
    components: { staffList, warehouseList, custList, truckList, bizTypeList, paymentTypeList, itemList, settleTypeList, modalTable },
    data() {
        return {
            id: '',
            status: this.$route.query.status,
            modalTableVisible: false,
            settleData: [{}, {}, {}, {}, {}],
            dialogFormVisible: false,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            keys: ["itemId", "itemCode", "itemName", "norms", "uom", "subUom", "exchangeRate", "batchNo", "productionDate", "qualityName", "qualityDays", "qty", "price", "amount", "taxRate", "taxAmount", "vatAmount", "invoiceNo", "isGift"],
            temp: {
                billDate: getNowDate(),
                billNo: '',
                bizTypeId: '',
                custId: '',
                custName: '',
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
                advPayAmount: 0,
                rebateAmount: 0,
                withoutPayAmount: 0,
                auditDate: "",
                returnedType: '0',
                auditor: "",
                recordDate: getNowDate() + ' 00:00:00',
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
        this.$store.dispatch('basedata/getSalesReturnedSettleType')
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            getSalesReturnedById(this.id).then(res => {
                if (res.data.data) {
                    for (var key in this.temp) {
                        this.temp[key] = res.data.data[key];
                    }
                    this.temp.autoAdvr = true;
                    for (var i = 0; i < res.data.data.salesReturnedLine.length; i++) {
                        for (var j = 0; j < this.keys.length; j++) {
                            this.tableData[i][this.keys[j]] = res.data.data.salesReturnedLine[i][this.keys[j]]
                        }
                    }
                    this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
                }
            })
        }
    },
    mounted() {
        this.$store.dispatch('basedata/getPresaleReturnedSettleType')
        if (this.status != 1) {
            this.modalTableVisible = true
        }
    },
    methods: {
        initTableData(id) {
            getSalesReturnedBySalesHeaderId(id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.data[key]
                }
                this.tableData = addNullObj(res.data.data.salesReturnedLine);
                this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
            })
        },
        calculate(index) {
            var price = this.tableData[index].price;
            var qty = this.tableData[index].qty;
            if (qty && price) {
                var amount = parseFloat(Number(qty) * Number(price)).toFixed(2);
                this.$set(this.tableData[index], 'amount', amount)
                this.$set(this.tableData[index], 'taxAmount', 0)
                this.$set(this.tableData[index], 'vatAmount', amount)
                var taxRate = this.tableData[index].taxRate;
                if (taxRate) {
                    var taxAmount = parseFloat(Number(amount) * Number(taxRate) / 100).toFixed(2);
                    var vatAmount = parseFloat(Number(amount) * (Number(taxRate) / 100 + 1)).toFixed(2);
                    this.$set(this.tableData[index], 'taxAmount', taxAmount)
                    this.$set(this.tableData[index], 'vatAmount', vatAmount)
                } else {
                    this.$set(this.tableData[index], 'taxRate', 0)
                }
                this.calculateTotal();
            }
        },
        calculate1(index) {
            var amount = 0;
            for (var i = 0; i < this.settleData.length; i++) {
                if (this.settleData[i] && this.settleData[i].amount) {
                    amount += Number(this.settleData[i].amount);
                }
            }
            this.temp.currPayAmount = parseFloat(amount).toFixed(2);
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
        showSettleType() {
            this.dialogFormVisible = true
        },
        settleTypeChange(obj) {
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key];
            }
        },
        selectChange(obj) {
            for (var key in obj) {
                this.temp[key] = obj[key];
            }
            if (obj && obj.warehouseName) {
                for (var i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].warehouseId = obj.warehouseId
                }
            }
            if (obj && obj.truckName) {
                for (var i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].truckId = obj.truckId
                }
            }
        },
        changeVal(obj) {
            for (var key in obj) {
                this.tableData[obj.index][key] = obj[key];
            }
            if (this.temp.custId) {
                getItemPrice({ custId: this.temp.custId, itemId: this.tableData[obj.index].itemId }).then(res => {
                    if (res.data.toString() == "") {
                        this.tableData[obj.index].price = 0
                    } else {
                        if (res.data.price < 0) {
                            this.$message.error("须先设定商品价格(价格-价格设定)")
                        } else {
                            this.tableData[obj.index].price = parseFloat(res.data.price).toFixed(4)
                        }
                    }
                })
            }
        },
        save() {
            this.temp.id = this.id;
            this.temp.salesReturnedLine = deleteEmptyProp(this.tableData);
            this.temp.advPayAmount = Number(this.temp.advPayAmount);
            this.temp.settleTypeReturnedDetail = this.settleData;
            saveSalesReturned(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.id == "" ? '新增成功' : '修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/sale/returned');
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