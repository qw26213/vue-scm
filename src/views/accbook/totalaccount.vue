<template>
    <div class="app-container" style="width:1300px">
        <div class="filter-container">
            <label class="label">期间：</label>
            <el-select v-model="listQuery.periodCode1" size="small" style="width:120px" placeholder="开始期间">
                <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.periodCode2" size="small" style="width:120px" placeholder="结束期间">
                <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <label class="label">科目：</label>
            <el-select v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable>
                <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode">
                </el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaCode2" size="small" placeholder="科目" filterable>
                <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode">
                </el-option>
            </el-select>
            <label class="label">科目级次：</label>
            <el-select v-model="listQuery.coaLevel1" size="small" style="width:100px" placeholder="科目级次" filterable>
                <el-option v-for="item in [1,2,3,4,5,6,7]" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaLevel2" size="small" style="width:100px" placeholder="科目级次" filterable>
                <el-option v-for="item in [1,2,3,4,5,6,7]" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-popover placement="bottom" title="更多" width="240" trigger="click">
                <div>
                    <p>
                        <el-checkbox v-model="listQuery.isShowAuxiliary" false-label="0" true-label="1">显示辅助核算</el-checkbox>
                    </p>
                    <p>
                        <el-checkbox v-model="listQuery.isShowNetAndBalanceNotEqualToZero" false-label="0" true-label="1">发生额为0且余额为0不显示</el-checkbox>
                    </p>
                </div>
                <el-button size="small" slot="reference">更多<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-popover>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="pageData" cell-class-name="tpCell" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="科目编码" align="center">
                <template slot-scope="{row}">
                    <span> {{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称">
                <template slot-scope="{row}">
                    <span style="padding-left:10px" v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="期间">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:center" v-for="(item,index) in row.listPeriodCode" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="摘要">
                <template slot-scope="{row}">
                    <p clss="pCell" style="width:max-content;min-width:100%" v-for="(item,index) in row.listSummary" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="借方金额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listNetDr" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listNetCr" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="方向">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:center" v-for="(item,index) in row.listCrDrStr" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="余额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listBalance" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getDataByPage" />
    </div>
</template>
<script>
import { getTotalAccount } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
    name: 'totalAccount',
    components: { Pagination },
    filters: {
        Fixed: function(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    data() {
        return {
            tableKey: 0,
            periodList: [],
            tableData: [],
            pageData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                periodCode1: '',
                periodCode2: '',
                coaCode1: '',
                coaCode2: '',
                coaLevel1: '',
                coaLevel2: '',
                isShowAuxiliary: '',
                isShowNetAndBalanceNotEqualToZero: '',
                pageIndex: 1
            }
        }
    },
    computed: {
        ...mapGetters([
            'coaArr',
            'periodArr'
        ])
    },
    watch: {
        periodArr(val) {
            if (val.length > 0) {
                this.listQuery.periodCode1 = val[0].id
                this.listQuery.periodCode2 = val[0].id
                this.getList()
            }
        }
    },
    created() {
        this.$store.dispatch('voucher/getPeriod')
        this.$store.dispatch('voucher/getCoaList')
    },
    methods: {
        getDataByPage() {
            var pageIndex = this.listQuery.pageIndex
            var arr = []
            var min = pageIndex * 10 - 10
            var max = pageIndex * 10 <= this.total ? pageIndex * 10 : this.total
            for (var i = min; i < max; i++) {
                arr.push(this.tableData[i])
            }
            this.pageData = arr
        },
        getList() {
            this.listLoading = true
            this.listQuery.pageIndex = 1
            getTotalAccount(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.data.length
                this.getDataByPage()
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>