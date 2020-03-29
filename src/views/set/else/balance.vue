<template>
    <div class="app-container">
        <div class="filter-container1 tx-r" style="margin-bottom:20px">
            <el-button size="mini" type="primary" @click="saveThisTable()">保存</el-button>
            <el-button size="mini" type="primary" @click="showTable()">试算平衡汇总</el-button>
        </div>
        <el-table :data="tableData" border fit resize empty-text="无数据" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100">
                <template slot-scope="{row}">
                    <span>{{row.showCoaName}}</span>
                    <el-button v-if="row.isAuxiliary == 1" type="primary" size="mini" @click="showSuplyConfig(row.id)" style="margin-left:10px">设置</el-button>
                </template>
            </el-table-column>
            <el-table-column label="方向" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.crDr==1?'借':row.crDr==0?'平':'贷'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.beginBalance" />
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.beginBalanceQty" />
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年借方累计" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.periodNetDr" />
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.periodNetQtyDr" />
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年贷方累计" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.periodNetCr" />
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <el-input class="tx-r" size="mini" v-model="row.periodNetQtyCr" />
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" title="试算平衡汇总" :visible.sync="dialogFormVisible1" width="720px">
            <el-table :data="[balanceObj]" border fit resize empty-text="无同步数据" style="width: 100%;" size="mini">
                <el-table-column align="center" label="项目">
                    <template slot-scope="{row}">
                        <span>金额</span>
                    </template> </el-table-column>
                <el-table-column align="center" label="期初借方">
                    <template slot-scope="{row}">
                        <span>{{row.sumBalanceDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="期初贷方">
                    <template slot-scope="{row}">
                        <span>{{row.sumBalanceCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="差额">
                    <template slot-scope="{row}">
                        <span>{{row.diffBalance}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="借方发生额">
                    <template slot-scope="{row}">
                        <span>{{row.sumPeriodNetDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="贷方发生额">
                    <template slot-scope="{row}">
                        <span>{{row.sumPeriodNetCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="差额">
                    <template slot-scope="{row}">
                        <span>{{row.diffPeriodNet}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否平衡">
                    <template slot-scope="{row}">
                        <span>{{row.diffBalance == 0 && row.diffPeriodNet == 0?'平衡':'不平衡'}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="设置辅助核算" :visible.sync="dialogFormVisible2" width="860px">
            <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="70px" style="width: 810px; margin-left:15px;">
                <el-form-item label="期初借方" prop="coaCode">
                    <el-input v-model="temp.coaCode" placeholder="期初借方" />
                </el-form-item>
                <el-form-item label="期初余额" prop="coaName">
                    <el-input v-model="temp.coaName" placeholder="期初余额" />
                </el-form-item>
                <el-form-item label="贷方金额" prop="coaName">
                    <el-input v-model="temp.coaName" placeholder="贷方金额" />
                </el-form-item>
                <el-form-item label="期初数量" prop="coaCode">
                    <el-input v-model="temp.coaCode" placeholder="期初数量" />
                </el-form-item>
                <el-form-item label="借方数量" prop="coaName">
                    <el-input v-model="temp.coaName" placeholder="借方数量" />
                </el-form-item>
                <el-form-item label="贷方数量" prop="coaName">
                    <el-input v-model="temp.coaName" placeholder="贷方数量" />
                </el-form-item>
                <el-form-item v-for="(item,index) in auxiliaryTypeArr" :key="index" :label="item.auxiliaryTypeName">
                    <el-select placeholder="简称"></el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible2 = false">取消</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getBalance, getPeriodList, updateListForSetBegin } from '@/api/user'
import { getProj, getDept, getStaff, getSupplier } from '@/api/basedata'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            listQuery: {
                periodCode1: '',
                isOnlyAdjustNet: '1'
            },
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            auxiliaryTypeArr: [],
            temp: {},
            userInfo: {},
            periodList: [],
            tableData: [],
            balanceObj: {}
        }
    },
    filters: {
        toFix(val) {
            if (!val) { return '0.00' }
            return parseFloat(val).toFix(2)
        }
    },
    mounted() {
        this.getData()
        getProj().then(res => {
            this.auxiliaryTypeArr = res.data.data
        })
        getDept().then(res => {
            this.auxiliaryTypeArr = res.data.data
        })
        getStaff().then(res => {
            this.auxiliaryTypeArr = res.data.data
        })
        getSupplier().then(res => {
            this.auxiliaryTypeArr = res.data.data
        })
    },
    methods: {
        saveThisTable() {
            var obj = {}
            updateListForSetBegin(obj).then(res => {

            })
        },
        showSuplyConfig() {
            this.dialogFormVisible2 = true
        },
        getPeriod() {
            getPeriodList().then(res => {
                this.periodList = res.data.data
                this.listQuery.periodCode1 = res.data.data[0].id
                this.getData('0')
            })
        },
        showTable() {
            this.dialogFormVisible1 = true
        },
        testIsRight(arr) {
            var obj = {
                sumBalanceDr: 0,
                sumBalanceCr: 0,
                sumPeriodNetDr: 0,
                sumPeriodNetCr: 0,
                diffBalance: 0,
                diffPeriodNet: 0,
                isNumer: true
            };
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].leaf == '0' || arr[i].type == '1' && arr[i].isAuxiliary == '1')
                    continue;
                var tmpCrDr = arr[i].crDr; // 方向
                var tmpBeginBalance = arr[i].beginBalance; // 期初金额
                var tmpBeginBalanceQty = arr[i].beginBalanceQty; // 期初数量
                var tmpPeriodNetDr = arr[i].periodNetDr; // 借方金额
                var tmpPeriodNetQtyDr = arr[i].periodNetQtyDr; // 借方数量
                var tmpPeriodNetCr = arr[i].periodNetCr; // 贷方金额
                var tmpPeriodNetQtyCr = arr[i].periodNetQtyCr; // 贷方数量
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
            console.log(obj)
            this.balanceObj = obj
        },
        getData() {
            var data = { "periodId": "13644654252310777643", "periodCode": "2019-04", "periodName": "2019年第4期", "periodYear": 2019, "periodNum": 4, "coaHierarchyId": "2" }
            getBalance(data).then(res => {
                this.tableData = res.data || []
                this.testIsRight(this.tableData)
            })
        }
    }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}
</style>