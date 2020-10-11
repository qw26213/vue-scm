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
                <el-form-item label="供应商:">
                    <span>{{temp.supplierName}}</span>
                </el-form-item>
                <el-form-item label="仓库:">
                    <span>{{temp.warehouseName}}</span>
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
                <el-form-item label="退预付:">
                    <span>{{temp.advPayAmount}}</span>
                </el-form-item>
                <el-form-item label="现结金额:">
                    <span>{{temp.currPayAmount}}</span>
                </el-form-item>
                <el-form-item label="返利金额:">
                    <span>{{temp.rebateAmount}}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell" height="501" append>
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="商品" width="300">
                    <template slot-scope="{row}">
                        <span>{{row.itemCode + ' ' +row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格">
                    <template slot-scope="{row}">
                        <span>{{row.norms}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="60" align="center">
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
                <el-table-column label="保质期(天)" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.qualityDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价(元)" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.price | toFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.qty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.amount | toFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="税率(%)" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.taxRate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="税额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.taxAmount | toFixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="价税合计" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.vatAmount | toFixed}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="dataTable" style="margin-top: 10px">
                <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="制单日期:">
                        <span>{{temp.recordDate | parseDate}}</span>
                    </el-form-item>
                    <el-form-item label="制单人:">
                        <span>{{temp.recorderName}}</span>
                    </el-form-item>
                    <el-form-item label="审核日期:">
                        <span>{{temp.auditDate | parseDate}}</span>
                    </el-form-item>
                    <el-form-item label="审核人:">
                        <span>{{temp.auditorName}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { getPurchaseReturnedById } from '@/api/store';
import { getAllNoADVR } from '@/api/basedata';
import { deleteEmptyProp, addNullObj,addNullObj2 } from '@/utils';
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'purchaseReturnedDetail',
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
    created() {
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
}
</script>