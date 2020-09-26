<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="请选择预收单" :visible.sync="visible" width="720px">
            <div class="filter-container">
                <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                <span class="zhi">至</span>
                <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                <el-input size="small" v-model="listQuery.queryParam.billNo" placeholder="单据号" style="width: 120px;" />
                <custList @selectChange="selectChange" ctrType="list"></custList>
                <el-button size="small" type="primary" @click="getList">查询</el-button>
            </div>
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
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
                <el-table-column label="预收类型" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.presaleType==0?'按钱':row.presaleType==1?'按商品':'按品类'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalance|Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="余额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balance|Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="small" @click="handleSelect(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        </el-dialog>
    </div>
</template>
<script>
import { getPresale } from '@/api/store'
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
                pageNum: 20,
                queryParam: {
                    date1: '2019-01-01',
                    date2: getNowDate(),
                    nonZeroBalance:'1',
                    billNo: "",
                    custId: ''
                }
            }
        }
    },
    watch: {
        'modalTableVisible'(val) {
            this.visible = val
            if (val) {
                this.getList()
            }
        }
    },
    filters: {
        Fixed: function (num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    methods: {
        getList() {
            this.listLoading = true
            getPresale(this.listQuery).then(res => {
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
        handleSelect(id) {
            this.$parent.modalTableVisible = false
            console.log(id)
            this.$parent.initTableData(id)
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog .el-dialog__body {
    min-height: 240px;
    max-height: 480px;
    padding-top: 10px !important
}
</style>