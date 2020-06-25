<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:">
                    <span>{{temp.billDate}}</span>
                </el-form-item>
                <el-form-item label="单据号:">
                    <span>{{temp.billNo}}</span>
                </el-form-item>
                <el-form-item label="业务类型:">
                    <span>{{temp.bizTypeName}}</span>
                </el-form-item>
                <el-form-item label="客户:">
                    <span>{{temp.custName}}</span>
                </el-form-item>
                <el-form-item label="售达客户:">
                    <span>{{temp.soldToCust}}</span>
                </el-form-item>
                <el-form-item label="仓库:">
                    <span>{{temp.warehouseName}}</span>
                </el-form-item>
                <el-form-item label="车辆:">
                    <span>{{temp.truckName}}</span>
                </el-form-item>
                <el-form-item label="业务员:">
                    <span>{{temp.staffName}}</span>
                </el-form-item>
                <el-form-item label="收款方式:">
                    <span>{{temp.paymentTypeName}}</span>
                </el-form-item>
                <el-form-item label="收款到期日:">
                    <span>{{temp.paymentDueDate}}</span>
                </el-form-item>
                <el-form-item label="合计金额:">
                    <span>{{temp.itemAmount}}</span>
                </el-form-item>
                <el-form-item label="现结金额:">
                    <span>{{temp.currPayAmount}}</span>
                </el-form-item>
                <el-form-item label="返利金额:">
                    <span>{{temp.rebateAmount}}</span>
                </el-form-item>
                <el-form-item label="发票:">
                    <span v-if="temp.statusInvoice === 0">不开票</span>
                    <span v-if="temp.statusInvoice === 1">待开票</span>
                    <span v-if="temp.statusInvoice === 9">已开发票</span>
                </el-form-item>
                <el-form-item label="退款类型:">
                    <span v-if="temp.returnedType === 0">退款退货</span>
                    <span v-if="temp.returnedType === 1">退换货</span>
                    <span v-if="temp.returnedType === 2">只退款</span>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码" width="160">
                <template slot-scope="{row}">
                    <span>{{row.itemCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="160">
                <template slot-scope="{row}">
                    <span>{{row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <span>{{row.norms}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <span>{{row.uom}}</span>
                </template>
            </el-table-column>
            <el-table-column label="批号">
                <template slot-scope="{row}">
                    <span>{{row.batchNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="生产日期" width="120">
                <template slot-scope="{row}">
                    <span>{{row.productionDat}}</span>
                </template>
            </el-table-column>
            <el-table-column label="保质期(天)">
                <template slot-scope="{row}">
                    <span>{{row.qualityDays}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单价(元)">
                <template slot-scope="{row}">
                    <span>{{row.price}}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="{row}">
                    <span>{{row.qty}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金额">
                <template slot-scope="{row}">
                    <span>{{row.amount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="税率(%)">
                <template slot-scope="{row}">
                    <span>{{row.taxRate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="税额">
                <template slot-scope="{row}">
                    <span>{{row.taxAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价税合计">
                <template slot-scope="{row}">
                    <span>{{row.vatAmount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否赠品" align="center">
                <template slot-scope="{row}">
                    <span>{{row.salesTypeCode}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:">
                    <span>{{temp.recordDate}}</span>
                </el-form-item>
                <el-form-item label="制单人:">
                    <span>{{temp.recorderId}}</span>
                </el-form-item>
                <el-form-item label="审核日期:">
                    <span>{{temp.auditDate}}</span>
                </el-form-item>
                <el-form-item label="审核人:">
                    <span>{{temp.auditorId}}</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {deleteEmptyProp,addNullObj,addNullObj2} from '@/utils';
import { saveSalesReturned, getSalesReturnedById, getItemPrice, getSalesReturnedBySalesHeaderId } from '@/api/store';
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'saleReturnedDetail',
    data() {
        return {
            id:'',
            status:this.$route.query.status,
            settleData:[{},{},{},{},{}],
            dialogFormVisible:false,
            tableData: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
            keys:["itemId","itemCode","itemName","norms","uom","subUom","exchangeRate","batchNo","productionDate","qualityName","qualityDays","qty","price","amount","taxRate","taxAmount","vatAmount","invoiceNo","salesTypeCode"],
            temp: {
                billDate:getNowDate(),
                billNo:'',
                bizTypeId:'',
                autoAdvr:'1',
                custId:'',
                custName:'',
                soldToCust:'',
                warehouseId:'',
                warehouseName:'',
                truckId:'',
                truckName:'',
                staffId:'',
                paymentTypeId:'',
                paymentDueDate:'',
                currPayAmount:0,
                itemAmount:0,
                advPayAmount:0,
                rebateAmount:0,
                withoutPayAmount:0,
                auditDate:"",
                auditor:"",
                recordDate:getNowDate()+' 00:00:00',
                recorder:getName()
            }
        }
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
        if(!this.status){
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