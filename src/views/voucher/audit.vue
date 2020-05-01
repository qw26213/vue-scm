<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select v-model="listQuery.queryParam.date1" placeholder="开始期间" size="mini">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.queryParam.date2" placeholder="结束期间" size="mini">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="listQuery.queryParam.startCoa" placeholder="开始科目" size="mini">
                <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.queryParam.endCoa" placeholder="结束科目" size="mini">
                <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode"></el-option>
            </el-select>
            <el-input size="mini" v-model="listQuery.queryParam.voucherSeq" placeholder="凭证号" style="width: 120px;" />
            <el-input size="mini" v-model="listQuery.queryParam.summary" placeholder="摘要" style="width: 120px;" />
            <el-select v-model="listQuery.queryParam.jeStatus" placeholder="状态" size="mini">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="制单完成" value="0"></el-option>
                <el-option label="审核通过" value="5"></el-option>
                <el-option label="退回" value="-1"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="primary" @click="muchVoucherCheck">批量审核</el-button>
            <el-button size="mini" type="primary" @click="voucherBackCheck">批量反审核</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit style="width: 100%;" size="mini" cell-class-name="tpCell" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="日期" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.jeDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="凭证字号" align="center">
                <template slot-scope="{row}">
                    <a href="javascript:">{{row.jeCatogery}}-{{row.jeSeq | catogeryNumberFor}}</a>
                </template>
            </el-table-column>
            <el-table-column label="摘要" min-width="120">
                <template slot-scope="{row}">
                    <p clss="pCell" v-for="(item,index) in row.lineList" :key="index">{{item.summary}}</p>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="200">
                <template slot-scope="{row}">
                    <p clss="pCell" style="width:max-content;min-width:100%" v-for="(item,index) in row.lineList" :key="index">{{item.longName}}</p>
                </template>
            </el-table-column>
            <el-table-column label="借方金额" align="right">
                <template slot-scope="{row}">
                    <p clss="pCell" v-for="(item,index) in row.lineList" :key="index">{{item.accountedDr|Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额" align="right">
                <template slot-scope="{row}">
                    <p clss="pCell" v-for="(item,index) in row.lineList" :key="index">{{item.accountedCr|Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.jeStatus | jeStatusFor}}</span>
                </template>
            </el-table-column>
            <el-table-column label="制单人" align="center">
                <template slot-scope="{row}">
                    <span>{{row.sign1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核人" align="center">
                <template slot-scope="{row}">
                    <span>{{row.sign2}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
                <template slot-scope="{row}">
                    <span v-if="row.jeStatus>0&&row.jeStatus<5" class="ctrl" @click="handleCheck(row.id)">审核</span>
                    <span v-if="row.jeStatus == -1">已退回</span>
                    <span v-if="row.jeStatus == 5" class="ctrl" @click="handleUnCheck(row.id)">反审核</span>
                    <span class="ctrl" @click="handleDel(row)">查看审核</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPeriodList } from '@/api/user'
import { getVoucherAuditList, voucherAduit, unAudit } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import { getNowMonth } from '@/utils/index'
export default {
    name: 'presaleData',
    components: { Pagination },
    filters: {
        jeStatusFor: function (status) {
            return status == 0 ? "制单完成" : status == -1 ? "退回" : status == 5 ? '审核通过' : status == 1 ? "一审通过" : status == 2 ? "二审通过" : status == 3 ? "三审通过" : '无';
        },
        Fixed: function (num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        },
        catogeryNumberFor: function (num) {
            return num < 10 ? '00' + num : num < 100 ? '0' + num : num;
        }
    },
    data() {
        return {
            periodList: [],
            tableKey: 0,
            tableData: [],
            voucherIdArr:[],
            total: 0,
            isBillDate: '0',
            dialogFormVisible: false,
            listLoading: true,
            curBillId: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    date1: getNowMonth(),
                    date2: getNowMonth(),
                    startCoa: '',
                    endCoa: '',
                    jeStatus: '',
                    voucherSeq: '',
                    summary: ''
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'coaArr'
        ])
    },
    created() {
        this.$store.dispatch('voucher/getCoaList')
        getPeriodList().then(res => {
            this.periodList = res.data.data
        })
        this.getList();
    },
    methods: {
        handleSelectionChange(val){
            let arr = []
            for(let i = 0;i<val.length;i++){
                arr.push(val[i].id)
            }
            this.voucherIdArr = arr
        },
        getList() {
            this.listLoading = true
            getVoucherAuditList(this.listQuery).then(res => {
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
                this.checkItem([id])
            });
        },
        checkItem(arr) {
            voucherAduit({ids:arr}).then(res => {
                if (res.data.success) {
                    this.$message.success('审核成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleUnCheck(id){
            this.$confirm('确定反审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.unCheckItems([id])
            });
        },
        unCheckItems(arr){
            unAudit({ids:arr}).then(res => {
                if (res.data.success) {
                    this.$message.success('反审核成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        voucherBackCheck() {
            if(this.voucherIdArr.length==0){
                this.$message.warning("请先选择凭证！");return
            }
            this.unCheckItems(this.voucherIdArr)
        },
        muchVoucherCheck() {
            if(this.voucherIdArr.length==0){
                this.$message.warning("请先选择凭证！");return
            }
            this.checkItem(this.voucherIdArr)
        },
        handleCompile(id) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/voucher/add?id=' + id)
        },
        handleDel(row) {
            let info = "确定要删除这个凭证吗？";
            let id = row.id;
            let joinJeHeaderId = row.joinJeHeaderId;
            if (joinJeHeaderId != null && joinJeHeaderId != '') {
                getVoucherById({ id: joinJeHeaderId }).then(res => {
                    if (res.success) {
                        if (res.data.data != null) {
                            var header = res.data.data.header;
                            if (joinJeHeaderId != null) {
                                info = "该凭证存在关联成本凭证:<b>" + header.jeDate + " " + header.jeCatogery + "-" + formatThis(header.jeSeq, 4) + "</b>号凭证,确定要删除这个凭证吗(关联凭证一并删除)？";
                            }
                        }
                        this.$confirm(info, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.delItem(id)
                        });
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            } else {
                this.$confirm(info, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delItem(id)
                });
            }
        },
        delItem(id) {
            delVoucher({ id: id }).then(res => {
                if (res.data.success) {
                    this.$message.success("删除凭证成功")
                    this.getList()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>
<style scoped>
p.pCell {
    margin: 0;
    line-height: 32px;
}
</style>