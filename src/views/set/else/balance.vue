<template>
    <div class="app-container">
        <div class="filter-container1 tx-r" style="margin-bottom:20px">
            <el-button size="mini" type="primary" @click="saveData(0)">保存</el-button>
            <el-button size="mini" type="primary" @click="showTable()">试算平衡汇总</el-button>
        </div>
        <el-table :data="tableData" v-loading="listLoading" border fit resize empty-text="无数据" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100" show-overflow-tooltip>
                <template slot-scope="{row}">
                    <span>{{row.showCoaName}}</span>
                    <el-button v-if="row.isAuxiliary == 1" type="primary" size="mini" @click="showSuplyConfig(row)" style="margin-left:10px">设置</el-button>
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
        <el-dialog :close-on-click-modal="false" title="设置辅助核算" :visible.sync="dialogFormVisible2" width="880px">
            <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="80px" style="width: 840px; margin-left:15px;">
                <el-form-item label="期初借方" prop="beginBalance">
                    <el-input v-model="temp.beginBalance" placeholder="期初借方" />
                </el-form-item>
                <el-form-item label="期初余额" prop="periodNetDr">
                    <el-input v-model="temp.periodNetDr" placeholder="期初余额" />
                </el-form-item>
                <el-form-item label="贷方金额" prop="periodNetCr">
                    <el-input v-model="temp.periodNetCr" placeholder="贷方金额" />
                </el-form-item>
                <el-form-item label="期初数量" prop="beginBalanceQty">
                    <el-input v-model="temp.beginBalanceQty" placeholder="期初数量" />
                </el-form-item>
                <el-form-item label="借方数量" prop="periodNetQtyDr">
                    <el-input v-model="temp.periodNetQtyDr" placeholder="借方数量" />
                </el-form-item>
                <el-form-item label="贷方数量" prop="periodNetQtyCr">
                    <el-input v-model="temp.periodNetQtyCr" placeholder="贷方数量" />
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(0)=='1'" label="供应商" prop="supplierId">
                    <el-select placeholder="供应商" v-model="temp.supplierId">
                        <el-option v-for="(item,index) in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(1)=='1'" label="客户" prop="custId">
                    <el-select placeholder="客户" v-model="temp.custId">
                        <el-option v-for="(item,index) in custList" :key="item.id" :label="item.custName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(2)=='1'" label="部门" prop="deptId">
                    <el-select placeholder="部门" v-model="temp.deptId">
                        <el-option v-for="(item,index) in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(3)=='1'" label="职员" prop="staffId">
                    <el-select placeholder="职员" v-model="temp.staffId">
                        <el-option v-for="(item,index) in staffList" :key="item.id" :label="item.staffName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(4)=='1'" label="存货" prop="itemId">
                    <el-select placeholder="存货" v-model="temp.itemId">
                        <el-option v-for="(item,index) in itemList" :key="item.id" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="temp.auxiliary.charAt(5)=='1'" label="项目" prop="projId">
                    <el-select placeholder="项目" v-model="temp.projId">
                        <el-option v-for="(item,index) in projList" :key="item.id" :label="item.projName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible2 = false">取消</el-button>
                <el-button type="primary" @click="saveAuxiliaryConfig">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getBalance, getPeriodList, updateListForSetBegin } from '@/api/user'
import { getProj, getDept, getStaff, getSupplier, getCust, getItem } from '@/api/user'
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
            temp: {
                auxiliary: '000000000000000'
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
            userInfo: {},
            periodList: [],
            tableData: [],
            listLoading: false,
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
        getCust().then(res => {
            this.custList = res.data
        })
        getDept().then(res => {
            this.deptList = res.data
        })
        getStaff().then(res => {
            this.staffList = res.data
        })
        getSupplier().then(res => {
            this.supplierList = res.data
        })
        getItem().then(res => {
            this.itemList = res.data
        })
        getProj().then(res => {
            this.projList = res.data
        })
    },
    methods: {
        showSuplyConfig(row) {
            this.dialogFormVisible2 = true
            this.temp = row
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
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
        getBalanceObj() {
            var obj = {
                sumBalanceDr: 0,
                sumBalanceCr: 0,
                sumPeriodNetDr: 0,
                sumPeriodNetCr: 0,
                diffBalance: 0,
                diffPeriodNet: 0,
                isNumer: true
            };
            const arr = this.tableData
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
            this.balanceObj = obj
        },
        saveAuxiliaryConfig() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.saveData(1)
                }
            })
        },
        saveData(type) {
            if (!this.balanceObj.isNumer) {
                this.$alert("借贷方期初金额/数量为数字类型！")
            } else {
                var info = "";
                if (this.balanceObj.diffBalance != 0) {
                    info = "借贷方期初余额不等,"
                }
                if (this.balanceObj.diffPeriodNet != 0) {
                    info = "借贷方发生额不等,"
                }
                updateListForSetBegin(this.tableData).then(res => {
                    this.dialogFormVisible2 = false
                    if (res.data.errorCode == "0") {
                        if (type == 0) {
                            this.$message.success(info + "期初余额保存完成!")
                        }
                        if (type == 1) {
                            this.$message.success("辅助核算设置完成!")
                        }
                        if (type == 2) {
                            this.$message.success("关闭辅助核算设置完成!")
                        }
                        this.getData()
                    } else {
                        if (type == 0) {
                            this.$message.warning(info + "期初余额保存失败!")
                        }
                        if (type == 1) {
                            this.$message.warning(res.msg)
                        }
                        if (type == 2) {
                            this.$message.warning(res.msg)
                        }
                        this.getData()
                    }
                }).catch(err => {
                    this.dialogFormVisible2 = false
                    this.$message.error("系统失败!")
                })
            }
        },
        getData() {
            this.listLoading = true
            var data = { "periodId": "13644654252310777643", "periodCode": "2019-04", "periodName": "2019年第4期", "periodYear": 2019, "periodNum": 4, "coaHierarchyId": "2" }
            getBalance(data).then(res => {
                this.listLoading = false
                this.tableData = res.data || []
                this.getBalanceObj()
            }).catch(err=>{
                this.listLoading = false
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