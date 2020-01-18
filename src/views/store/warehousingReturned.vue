<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input size="mini" v-model="listQuery.queryParam.billNo" placeholder="单据号" />
            <supplierList @selectChange="selectChange" ctrType="list" :selectId="listQuery.supplierId"></supplierList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.staffId"></staffList>
            <warehouseList @selectChange="selectChange" ctrType="list" :selectId="listQuery.warehouseId"></warehouseList>
            <el-select v-model="listQuery.status" placeholder="单据状态" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option label="未审核" value="0"></el-option>
                <el-option label="已审核" value="1"></el-option>
                <el-option label="已生成" value="2"></el-option>
            </el-select>
            <el-select v-model="listQuery.iswarehousingReturnedEntry" placeholder="进货单状态" size="mini">
                <el-option label="全部" value=""></el-option>
                <el-option label="未生成进货单" value="0"></el-option>
                <el-option label="已生成进货单" value="1"></el-option>
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
                    <span class="ctrl" @click="handleCompile(row.id,row.status)">{{row.status==0?'编辑':'查看'}}</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleDel(row.id)">删除</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateBill(row.isPurchase,row.id,row.purchaseHeaderId)">{{row.isPurchase==1?'查看':'生成'}}采购退货单</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" title="选择采购退货单日期" :visible.sync="dialogFormVisible" width="400px">
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
    </div>
</template>
<script>
import { getWarehousingReturned, saveWarehousingReturned, delWarehousingReturned, auditWarehousingReturned, buildWarehousingEntryReturned } from '@/api/store'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import warehouseList from '@/components/selects/warehouseList';
import { getNowDate } from '@/utils/auth'
export default {
    name: 'warehousingReturned',
    components: { staffList, warehouseList, supplierList,Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            dialogFormVisible:false,
            curBillId:'',
            isBillDate:'0',
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    date1: getNowDate(),
                    date2: getNowDate(),
                    billNo:"",
                    supplierId:'',
                    staffId:'',
                    warehouseId:'',
                    status:'',
                    iswarehousingReturnedEntry:'',
                    isJeHeader:''
                }
            }
        }
    },
    created() {
        this.getList();
    },
    methods: {
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery[key] = obj[key];
            }
        },
        getList() {
            this.listLoading = true
            getWarehousingReturned(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleCheck(id) {
            this.$confirm('确定审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                auditWarehousingReturned(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.$message.success('审核成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            });
        },
        handleCreateBill(status,id1,id2){
          if(status==1){
            this.$router.push('/purchaseReturned/modify?id=' + id2 + '&status=' + status)
          }else{
            this.curBillId = id1;
            this.dialogFormVisible = true;
          }
        },
        createBill(){
          var obj = {isBillDate:this.isBillDate,id:this.curBillId}
          buildWarehousingEntryReturned(obj).then(res => {
            if(res.data.errorCode==0){
              this.dialogFormVisible = false;
              this.getList();
              this.$message.success('生成进货单成功')
            }else{
              this.$message.error(res.data.msg)
            }
          });
        },
        handleAdd() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace('/store/warehousingReturnedAdd')
        },
        handleCompile(id, status) {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.replace('/store/warehousingReturnedModify?id=' + id + '&status=' + status)
        },
        handleDel(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delWarehousingReturned(id).then(res => {
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