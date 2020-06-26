<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <el-input size="mini" v-model="listQuery.queryParam.billNo" placeholder="单据号" />
            <warehouseList @selectChange="selectChange" keyType="outWarehouseId" placeTxt="调出仓库" ctrType="list":selectId="listQuery.queryParam.outWarehouseId"></warehouseList>
            <warehouseList @selectChange="selectChange" keyType="inWarehouseId" placeTxt="调入仓库" ctrType="list":selectId="listQuery.queryParam.inWarehouseId"></warehouseList>
            <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="mini">
                <el-option label="全部" :value="null" />
                <el-option label="未审核" value="0" />
                <el-option label="已审核" value="1" />
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
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
            <el-table-column label="调出仓库">
                <template slot-scope="{row}">
                    <span>{{row.outWarehouseName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="调入仓库">
                <template slot-scope="{row}">
                    <span>{{row.inWarehouseName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务员">
                <template slot-scope="{row}">
                    <span>{{row.staffName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.status==1?'已审核':row.status==2?'已确认':'待审核'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="{row}">
                    <span class="ctrl" @click="handleCompile(row.id,row.status)">{{row.status==0?'编辑':'查看'}}</span>
                    <span v-if="row.status==1" class="ctrl" @click="confirmBill(row.id)">确认</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
                    <span class="ctrl del" v-if="row.status==0" @click="handleDel(row.id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { getAllocation, delAllocation, auditAllocation, confirmAllocation } from '@/api/store'
import Pagination from '@/components/Pagination'
import warehouseList from '@/components/selects/warehouseList';
import { getNowDate } from '@/utils/auth'
export default {
    name: 'allocation',
    components: { Pagination,warehouseList },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            statusList: [{status:1, label:'已审核'}, {status:2, label:'已确认'}, {status:0,label:'待审核'}],
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    billDate1: getNowDate(),
                    billDate2: getNowDate(),
                    outWarehouseId:'',
                    inWarehouseId:'',
                    billNo: '',
                    status: ''
                }
            }
        }
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.listLoading = true
            getAllocation(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        confirmBill(id) {
            this.$confirm('确认接受本调拨单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                confirmAllocation(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.$message.success('确认成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(()=>{
                console.log('取消')
            });
        },
        handleCheck(id) {
            this.$confirm('确定审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                auditAllocation(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.$message.success('审核成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(()=>{
                console.log('取消')
            });
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        },
        handleAdd(obj) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/store/allocationAdd')
        },
        handleCompile(id, status) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/store/allocationModify?id=' + id + '&status=' + status)
        },
        handleDel(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delAllocation(id).then(res => {
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