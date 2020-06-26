<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="请选择销售单" :visible.sync="visible" width="800px">
            <div class="filter-container">
                <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                <span class="zhi">至</span>
                <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                <el-input size="mini" v-model="listQuery.queryParam.billNo" placeholder="单据号" style="width: 120px;" />
                <custList @selectChange="selectChange" ctrType="list"></custList>
                <el-button size="mini" type="primary" @click="getList">查询</el-button>
            </div>
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="单据日期" align="center" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.billDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据号" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.billNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户">
                    <template slot-scope="{row}">
                        <span>{{row.custName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用预收" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.advPayAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="现结金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.currPayAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="价税合计" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.itemAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="返利金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.rebateAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="handleSelect(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        </el-dialog>
    </div>
</template>
<script>
import { getSales } from '@/api/sale'
import Pagination from '@/components/Pagination'
import custList from '@/components/selects/custList';
import { getNowDate } from '@/utils/auth'
export default {
    components: { Pagination, custList },
    props: ['modalTableVisible'],
    data() {
        return {
            tableKey: 0,
            visible: false,
            tableData: [],
            total: 0,
            isBillDate: '0',
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {
                    date1: '2019-01-01',
                    date2: getNowDate(),
                    billNo: "",
                    custId: ''
                }
            }
        }
    },
    watch: {
        'modalTableVisible' (val) {
            this.visible = val
            if (val) {
                this.getList()
            }
        }
    },
    filters: {
        Fixed: function(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    methods: {
        getList() {
            this.listLoading = true
            getSales(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        },
        handleSelect(id) {
            this.$parent.modalTableVisible = false
            this.$parent.initTableData(id)
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog .el-dialog__body {
    min-height: 240px;
    max-height: 480px;
    padding-top: 10px !important;
    overflow: auto
}
</style>