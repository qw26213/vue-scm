<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
            </el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-input size="mini" v-model="listQuery.queryParam.billNo" placeholder="单据号" />
            <supplierList @selectChange="selectChange" ctrType="list"></supplierList>
            <staffList @selectChange="selectChange" ctrType="list"></staffList>
            <warehouseList @selectChange="selectChange" ctrType="list"></warehouseList>
            <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="mini">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未审核" value="0"></el-option>
                <el-option label="已审核" value="1"></el-option>
                <el-option label="已生成" value="2"></el-option>
            </el-select>
            <el-select v-model="listQuery.queryParam.isWarehousingEntryReturned" placeholder="采购退库单状态" size="mini">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未生成退货出库单" value="0"></el-option>
                <el-option label="已生成退货出库单" value="1"></el-option>
            </el-select>
            <el-select v-model="listQuery.queryParam.isJeHeader" placeholder="凭证状态" size="mini">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未生成凭证" value="0"></el-option>
                <el-option label="已生成凭证" value="1"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="序号" type="index" width="50" align="center">
            </el-table-column>
            <el-table-column label="单据日期" align="center" width="120">
                <template slot-scope="{row}">
                    <span>{{row.billDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单据号">
                <template slot-scope="{row}">
                    <span>{{row.billNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商">
                <template slot-scope="{row}">
                    <span>{{row.supplierName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款方式">
                <template slot-scope="{row}">
                    <span>{{row.paymentTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款到期日" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentDueDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用预收" align="right">
                <template slot-scope="{row}">
                    <span>{{row.advPayAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="现结金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.currPayAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价税合计金额" align="right" width="110">
                <template slot-scope="{row}">
                    <span>{{row.itemAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="返利金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.rebateAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.status==1?'已审核':row.status==2?'已生成':'待审核'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
                <template slot-scope="{row}">
                    <span class="ctrl" v-if="row.status==0" @click="handleCompile(row.id)">编辑</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleScan(row.id)">查看</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleDel(row.id)">删除</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateBill(row.isWarehousingEntryReturned,row.id,row.warehousingEntryReturnedHeaderId)">{{row.isWarehousingEntryReturned==1?'查看':'生成'}}退货出库单</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId)">{{row.isJeHeader==1?'查看':'生成'}}退货凭证</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" title="选择退货出库单日期" :visible.sync="dialogFormVisible1" width="400px">
            <el-form style="margin-top:30px;text-align:center;">
                <el-form-item label="" prop="isBillDate">
                    <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
                    <el-radio v-model="isBillDate" label="1">进货单日期</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="default" @click="dialogFormVisible1 = false">取消</el-button>
                <el-button type="primary" @click="createBill">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="选择凭证日期" :visible.sync="dialogFormVisible2" width="400px">
            <el-form style="margin-top:30px;text-align:center;">
                <el-form-item label="" prop="isBillDate">
                    <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
                    <el-radio v-model="isBillDate" label="1">进货单日期</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="default" @click="dialogFormVisible2 = false">取消</el-button>
                <el-button type="primary" @click="createVouter">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getPurchaseReturned, delPurchaseReturned, auditPurchaseReturned, buildPurchaseReturnedEntry, buildVoucherReturnedByHeaderId } from '@/api/store';
import { parseTime } from '@/utils';
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import warehouseList from '@/components/selects/warehouseList';
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination';
export default {
    name: 'purseReturned',
    components: { staffList, warehouseList, supplierList, Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            isBillDate: '0',
            curBillId: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    billDate1: getNowDate(),
                    billDate2: getNowDate(),
                    billNo: "",
                    supplierId: '',
                    staffId: '',
                    warehouseId: '',
                    status: '',
                    isWarehousingEntry: '',
                    isJeHeader: ''
                }
            }
        }
    },
    filters: {
        Fixed: function (num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getPurchaseReturned(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        },
        handleCheck(id) {
            this.$confirm('确定审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.checkItem(id)
            }).catch(() => {
                console.log('取消')
            });
        },
        checkItem(id) {
            auditPurchaseReturned(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success('审核成功！')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCreateBill(status, id1, id2) {
            if (status == 1) {
                this.$router.push('/store/warehousingReturnedModify?id=' + id2)
            } else {
                this.curBillId = id1;
                this.dialogFormVisible1 = true;
            }
        },
        createBill() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId }
            buildPurchaseReturnedEntry(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible1 = false;
                    this.getList();
                    this.$message.success('生成退货出库单成功！')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCreateVouter(status, id1, id2) {
            if (status == 1) {
                alert('查看退货凭证')
            } else {
                this.curBillId = id1;
                this.dialogFormVisible2 = true;
            }
        },
        createVouter() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId }
            buildVoucherReturnedByHeaderId(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible2 = false;
                    this.getList();
                    this.$message.success('生成退货凭证成功！')
                } else {
                    this.$message.error(res.data.msg)
                }
            });
        },
        handleAdd() {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/purchase/returnedAdd')
        },
        handleCompile(id) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/purchase/returnedModify?id=' + id)
        },
        handleScan(id) {
            this.$router.push('/purchase/returnedDetail?id=' + id)
        },
        handleDel(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPurchaseReturned(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            });
        }
    }
}
</script>