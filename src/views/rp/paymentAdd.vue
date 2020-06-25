<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate" label-width="72px">
                    <el-date-picker :editable="false" v-model="temp.billDate" type="date" placeholder="单据日期" size="small" style="width:140px" :clearable="false" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo" label-width="50px">
                    <el-input size="small" v-model="temp.billNo" placeholder="单据号" disabled />
                </el-form-item>
                <el-form-item label="供应商:" prop="custId" label-width="50px">
                    <supplierList @selectChange="selectChange" keyType="custId" :selectId="temp.custId" :selectName="temp.custName"></supplierList>
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId" label-width="50px">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
                <el-form-item label="现结金额:" prop="amount" label-width="72px">
                    <el-input size="mini" v-model="temp.amount" placeholder="现结金额" style="width:72px" disabled />
                    <el-button size="mini" style="width:44px;padding:6px" @click="showSettleType">选择</el-button>
                </el-form-item>
                <el-button size="small" class="filter-item" type="primary" @click="showSaleBill">选择采购单</el-button>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" max-height="600">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="单据日期" width="160" align="center">
                <template slot-scope="{row}">
                    <span v-html="row.billDate"></span>
                </template>
            </el-table-column>
            <el-table-column label="单据号" width="160" align="center">
                <template slot-scope="{row}">
                    <span v-html="row.billNo"></span>
                </template>
            </el-table-column>
            <el-table-column label="单据金额" align="right">
                <template slot-scope="{row}">
                    <span v-html="row.billAmount"></span>
                </template>
            </el-table-column>
            <el-table-column label="金额" align="right">
                <template slot-scope="{row}">
                    <span v-html="row.amount"></span>
                </template>
            </el-table-column>
            <el-table-column label="余额" align="right">
                <template slot-scope="{row}">
                    <span v-html="row.balance"></span>
                </template>
            </el-table-column>
            <el-table-column label="原单据ID" align="center">
                <template slot-scope="{row}">
                    <span v-html="row.billId"></span>
                </template>
            </el-table-column>
        </el-table>
        <div class="tx-c" style="margin-top:15px" v-if="status!=1&&status!=2">
            <el-button class="filter-item" type="primary" @click="save">保存</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="选择采购单" :visible.sync="dialogFormVisible1" width="960px">
            <div class="filter-container">
                <span class="zhi" style="font-weight:bold; margin:0 5px">起止日期</span>
                <el-date-picker :editable="false" v-model="modalQuery.billDate1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:140px;"/>
                <span class="zhi">至</span>
                <el-date-picker :editable="false" v-model="modalQuery.billDate2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:140px;"/>
                <span class="zhi" style="font-weight:bold; margin:0 5px">供应商</span>
                <supplierList @selectChange="selectChange" ctrType="list"></supplierList>
                <el-button size="mini" type="primary" @click="getPurechaseList">查询</el-button>
            </div>
            <el-table :data="modalData" border fit highlight-current-row style="width: 100%;" size="small" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" :reserve-selection="true" />
                <el-table-column label="单据日期" width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.billDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据号" width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.billNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据金额" width="110" align="right">
                    <template slot-scope="{row}">
                        <span>{{ row.billAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开始应收金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{ row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="当前应收金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{ row.balance }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="核销状态" width="100" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.statusVerification === 0">无需核销</span>
                        <span v-if="row.statusVerification === 1">待核销</span>
                        <span v-if="row.statusVerification === 2">部分核销</span>
                        <span v-if="row.statusVerification === 9">已核销</span>
                    </template>
                </el-table-column>
                <el-table-column label="原单据id">
                    <template slot-scope="{row}">
                        <span>{{ row.billId }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="default" size="small" @click="dialogFormVisible1 = false">取消</el-button>
                <el-button type="primary" size="small" @click="saveSelect">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="420px">
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
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getByHeaderId, saveReceiptPayment, getPurchaseListBySupplierId } from '@/api/rp'
import { getMeas, getInvCatg } from '@/api/basedata'
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils'
import staffList from '@/components/selects/staffList'
import supplierList from '@/components/selects/supplierList'
import settleTypeList from "@/components/selects/settleTypeList"
import { getName, getNowDate } from '@/utils/auth'
export default {
    name: 'receiptAdd',
    components: { staffList, supplierList, settleTypeList },
    data() {
        return {
            id: '',
            isDisabled: false,
            status: this.$route.query.status,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            invCatgList: [],
            measList: [],
            modalQuery: {
                supplierId: '',
                billDate1: '2020-01-01',
                billDate2: getNowDate(),
                desc: 0
            },
            temp: {
                billNo: '',
                billDate: getNowDate(),
                supplierId: '',
                staffId: '',
                custId: '',
                crDr: -1,
                amount: 0
            },
            dialogFormVisible: false,
            dialogFormVisible1: false,
            selectedData: [],
            settleData: [{}, {}, {}, {}, {}],
            modalData: []
        }
    },
    computed: {
        ...mapGetters([
            'settleTypeArr'
        ])
    },
    created() {
        this.$store.dispatch('basedata/getReceiptSettleType', { crDr: -1 })
        if (this.$route.query.id) {
            this.id = this.$route.query.id;
            getByHeaderId(this.id).then(res => {
                this.tableData = addNullObj(res.data.data.billLine || [])
                this.settleData = addNullObj2(res.data.data.settleTypeDetail || [])
            })
        } else {
            this.getPurechaseList()
        }
    },
    methods: {
        handleSelectionChange(selection, row) {
          this.selectedData = addNullObj(selection)
        },
        showSaleBill() {
            this.dialogFormVisible1 = true
        },
        showSettleType() {
            this.dialogFormVisible = true
        },
        selectChange(obj) {
            for (var key in obj) {
                this.temp[key] = obj[key]
            }
        },
        selectChange1(obj) {
            for (var key in obj) {
                this.modalQuery[key] = obj[key]
            }
        },
        settleTypeChange(obj) {
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key]
            }
        },
        saveSelect() {
            if(this.selectedData.length == 0) {
                this.$message.warning("请选择采购单据")
                return
            }
            this.tableData = this.selectedData
            this.dialogFormVisible1 = false
        },
        calculate1(index) {
            var amount = 0;
            for (var i = 0; i < this.settleData.length; i++) {
                if (this.settleData[i] && this.settleData[i].amount) {
                    amount += Number(this.settleData[i].amount);
                }
            }
            this.temp.amount = parseFloat(amount).toFixed(2);
        },
        getPurechaseList() {
          getPurchaseListBySupplierId(this.modalQuery).then(res => {
            this.modalData = res.data.data || []
          })
        },
        save() {
            if(this.selectedData.length == 0) {
                this.$message.warning("付款明细不能为空")
                return
            }
            this.temp.id = this.id
            this.temp.billLine = deleteEmptyProp(this.tableData)
            this.temp.settleTypeDetail = this.settleData
            saveReceiptPayment(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.temp.id == "" ? '新增付款单成功' : '修改付款单成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/rp/payment');
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