<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="month" placeholder="开始月份" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="month" placeholder="结束月份" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-select v-model="listQuery.queryParam.jeStatus" placeholder="状态" size="mini">
                <el-option label="全部状态" value=""></el-option>
                <el-option label="制单完成" value="0"></el-option>
                <el-option label="审核通过" value="5"></el-option>
                <el-option label="退回" value="-1"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="primary" @click="resetVoucherSeq">整理凭证号</el-button>
            <el-button size="mini" type="primary" @click="printVoucher">打印</el-button>
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
                    <a href="javascript:" @click="handleCompile(row.id)">{{row.jeCatogery}}-{{row.jeSeq | catogeryNumberFor}}</a>
                </template>
            </el-table-column>
            <el-table-column label="摘要" min-width="120">
                <template slot-scope="{row}">
                    <p clss="pCell" v-for="(item,index) in row.lineList" :key="index">{{item.summary}}</p>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="240">
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
                    <span class="ctrl" @click="insertVoucher(row)">插入</span>
                    <span class="ctrl" @click="handleCompile(row.id)">编辑</span>
                    <span v-if="row.status==0" class="ctrl" @click="handleDel(row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { getVoucher, getVoucherById, delVoucher, printList, trimJeSeqByMap } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import { getNowMonth } from '@/utils/index'
export default {
    name: 'presaleData',
    components: { Pagination },
    data() {
        return {
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
                    jeStatus: '',
                }
            }
        }
    },
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
    created() {
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
            getVoucher(this.listQuery).then(res => {
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
                this.checkItem(id)
            });
        },
        checkItem(id) {
            auditPresale(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success('审核成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        insertVoucher(row) {
            sessionStorage.voucherId = row.id;
            sessionStorage.voucherSeq = row.jeSeq;
            sessionStorage.jeDate = row.jeDate;
            sessionStorage.periodId = row.periodId;
            sessionStorage.periodCode = row.periodCode;
            sessionStorage.periodName = row.periodName;
            sessionStorage.jeCatogeryId = row.jeCatogeryId;
            sessionStorage.voucherFlag = 3; //凭证插入标记符
            this.$router.push('/voucher/add?id=' + id)
        },
        resetVoucherSeq() {
            let date1 = this.listQuery.queryParam.date1
            let date2 = this.listQuery.queryParam.date2
            this.$confirm('确定要整理凭证号吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                trimJeSeqByMap({periodCode1:date1,periodCode2:date2}).then(res => {
                    if (res.data.success) {
                        this.$message.success("整理凭证号成功")
                        this.getList()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                }).catch(err=>{
                        this.$message.success("请重新登录")
                })
            });

        },
        printVoucher() {
            if(this.voucherIdArr.length==0){
                this.$message.warning("请先选择凭证！");return
            }
            printList({data:this.voucherIdArr}).then(res => {
                if (res.data.success) {
                    window.open("http://"+window.location.host+res.data.body);
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCompile(id) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/voucher/modify?id=' + id)
        },
        handleDel(row) {
            let info = "确定要删除这个凭证吗？";
            let id = row.id;
            let joinJeHeaderId = row.joinJeHeaderId;
            if (joinJeHeaderId != null && joinJeHeaderId != '') {
                getVoucherById({ id: joinJeHeaderId }).then(res => {
                    if (res.success) {
                        if (res.data.body != null) {
                            var header = res.data.body.header;
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