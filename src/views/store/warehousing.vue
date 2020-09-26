<template>
    <div class="app-container">
        <div class="filterDiv">
        <div class="contentDiv">    
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input size="small" v-model="listQuery.queryParam.billNo" placeholder="单据号" />
            <supplierList @selectChange="selectChange" ctrType="list" :selectId="listQuery.supplierId"></supplierList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.staffId"></staffList>
            <warehouseList @selectChange="selectChange" ctrType="list" :selectId="listQuery.warehouseId"></warehouseList>
            <el-select v-model="listQuery.status" placeholder="单据状态" size="small">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="未审核" value="0"></el-option>
                <el-option label="已审核" value="1"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
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
            <el-table-column label="业务类型">
                <template slot-scope="{row}">
                    <span>{{row.bizTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商">
                <template slot-scope="{row}">
                    <span>{{row.supplierName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务员">
                <template slot-scope="{row}">
                    <span>{{row.staffName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="仓库">
                <template slot-scope="{row}">
                    <span>{{row.warehouseName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.status==1?'已审核':row.status==2?'已生成':'待审核'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="{row}">
                    <span class="ctrl" @click="handleCompile(row.id,row.status)">{{row.status<=0?'编辑':'查看'}}</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
                    <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
                    <span class="ctrl del" v-if="row.status<=0" @click="handleDel(row.id)">删除</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateBill(row.isPurchase,row.id,row.purchaseHeaderId)">{{row.isPurchase==0?'生成':'查看'}}进货单</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        </div>
        <el-dialog :close-on-click-modal="false" title="请选择进货单日期" :visible.sync="dialogFormVisible" width="400px">
            <el-form style="margin-top:30px;text-align:center;">
                <el-form-item label="" prop="isBillDate">
                    <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
                    <el-radio v-model="isBillDate" label="1">入库单日期</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="createBill">确定</el-button>
            </div>
        </el-dialog>
        <Auditconfirm :dialogvisible.sync="auditModalVisible" @auditBill="checkItem" />
    </div>
</template>
<script>
import { getWarehousing, saveWarehousing, delWarehousing, auditWarehousing, buildWarehousingEntry, getAuditInfoByHeaderId } from '@/api/store'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import warehouseList from '@/components/selects/warehouseList';
import { getNowDate } from '@/utils/auth'
import Auditconfirm from '@/components/Auditconfirm/index'
export default {
    name: 'warehousing',
    components: { staffList, warehouseList, supplierList, Pagination, Auditconfirm },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            dialogFormVisible: false,
            auditModalVisible: false,
            curBillId: '',
            isBillDate: '0',
            total: 0,
            auditType: '',
            remarklist: [],
            listLoading: true,
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
                    isJeHeader: ''
                }
            }
        }
    },
    created() {
        this.getList();
    },
    methods: {
        showAuditInfo(id){
            this.auditType = 'record'
            getAuditInfoByHeaderId(id).then(res => {
                if(res.data.errorCode == 0) {
                    this.auditModalVisible = true
                    this.remarklist = res.data.data || []
                }
            })
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery[key] = obj[key];
            }
        },
        getList() {
            this.listLoading = true
            getWarehousing(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleCheck(id) {
            this.auditType = 'create'
            this.auditModalVisible = true
            this.curBillId = id
        },
        checkItem(obj) {
            let data = obj
            data.id = this.curBillId
            auditWarehousing(data).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList()
                    this.auditModalVisible = false
                    this.$message.success('审核成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCreateBill(status, id1, id2) {
          if (status !== 0) {
                this.$router.push('/purchase/modify?id=' + id2 + '&status=' + status)
            } else {
                this.curBillId = id1
                this.dialogFormVisible = true
            }
        },
        createBill() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId }
            buildWarehousingEntry(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible = false;
                    this.getList();
                    this.$message.success('生成进货单成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(() => {
                this.$message.error('生成失败，请稍后重试！')
            });
        },
        handleAdd() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace('/store/warehousingAdd')
        },
        handleCompile(id, status) {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace('/store/warehousingModify?id=' + id + '&status=' + status)
        },
        handleDel(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delWarehousing(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.dialogFormVisible = false
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