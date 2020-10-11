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
                <el-form-item label="客户:">
                    <span>{{temp.custName}}</span>
                </el-form-item>
                <el-form-item label="业务员:">
                    <span>{{temp.staffName}}</span>
                </el-form-item>
                <el-form-item label="预收类型:">
                    <span>{{temp.presaleType}}</span>
                </el-form-item>
                <el-form-item label="合计金额:">
                    <span>{{temp.amount}}</span>
                </el-form-item>
                <el-form-item label="现结金额:">
                    <span>{{temp.beginBalance}}</span>
                </el-form-item>
                <el-form-item label="余额:">
                    <span>{{temp.balance}}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell" max-height="600">
                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column label="商品" width="300" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.itemCode + ' ' + row.itemName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.norms}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.uom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助单位" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.subUom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品类代码" v-if="temp.presaleType=='2'" key="1" width="150">
                    <template slot-scope="{row}">
                        <span>{{row.invCatgCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品类名称" v-if="temp.presaleType=='2'" key="2" width="160">
                    <template slot-scope="{row}">
                        <span>{{row.invCatgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="计量单位" v-if="temp.presaleType=='2'" key='3' width="150">
                    <template slot-scope="{row}">
                        <span>{{row.measName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助单位" v-if="temp.presaleType=='2'" key='4' width="150">
                    <template slot-scope="{row}">
                        <span>{{row.subMeasName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="换算率" v-if="temp.presaleType=='2'||temp.presaleType=='1'" key="5" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.exchangeRate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价">
                    <template slot-scope="{row}">
                        <span>{{row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalance}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="余量">
                    <template slot-scope="{row}">
                        <span>{{row.balanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="余额">
                    <template slot-scope="{row}">
                        <span>{{row.balance}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="dataTable" style="margin-top: 10px">
                <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="备 注:">
                        <span>{{temp.remarks}}</span>
                    </el-form-item>
                </el-form>
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
import { mapGetters } from 'vuex'
import { savePresaleReturned, getPresaleReturnedById, getBillReturnedByPresaleHeaderId } from '@/api/store';
import { getMeas, getInvCatg } from '@/api/basedata';
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils';
export default {
    name: 'presaleReturnedAdd',
    data() {
        return {
            id: '',
            isDisabled: false,
            status: this.$route.query.status,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            keys: ['invCatgName', 'invCatgid', "itemId", "itemCode", "itemName", "norms", "uom", "subUom", "exchangeRate", "beginBalanceQty", "price", "taxRate", "taxAmount", "vatAmount", "remarks", "salesTypeCode", 'measId'],
            invCatgList: [],
            measList: [],
            temp: {
                billNo: '',
                remarks: '',
                amount: '',
                billDate: '',
                custName: '',
                presaleType: '1',
                staffId: '',
                custId: '',
                bizTypeId: '',
                beginBalance: '',
                auditDate: "",
                auditor: "",
                returnedSrcId: '',
                recordDate: '',
                recorder: ''
            },
            dialogFormVisible: false,
            settleData: [{}, {}, {}, {}, {}],
            modalTableVisible: false
        }
    },
    computed: {
        ...mapGetters([
            'settleTypeArr',
            'truckList'
        ])
    },
    created() {
        getMeas().then(res => {
            this.measList = res.data.data
        })
        getInvCatg().then(res => {
            this.invCatgList = res.data.data
        })
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            getPresaleReturnedById(this.id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.data[key]
                    if (key == 'presaleType') {
                        this.temp[key] = String(res.data.data[key])
                    }
                }
                this.tableData = addNullObj(res.data.data.presaleReturnedLine);
                this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
            })
        }
    },
    mounted() {
        this.$store.dispatch('basedata/getPresaleReturnedSettleType')
        if (!this.status) {
            this.modalTableVisible = true
        }
    },
    methods: {
        initTableData(id) {
            getBillReturnedByPresaleHeaderId(id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.data[key]
                    if (key == 'presaleType') {
                        this.temp[key] = String(res.data.data[key])
                    }
                }
                this.tableData = addNullObj(res.data.data.presaleReturnedLine);
                this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
            })
        },
        initTable(val) {
            this.tableData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
        },
        showSettleType() {
            this.dialogFormVisible = true
        }
    }
}
</script>