<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">期间：</label>
            <el-select v-model="listQuery.periodCode1" size="small" placeholder="开始期间">
                <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.periodCode2" size="small" placeholder="结束期间">
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
            <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="日期" align="center">
                <template slot-scope="{row}">
                    <span>{{row.jeDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="凭证字号">
                <template slot-scope="{row}">
                    <span>{{row.jeCatogery}}</span>
                </template>
            </el-table-column>
            <el-table-column label="摘要">
                <template slot-scope="{row}">
                    <span>{{row.summary}}</span>
                </template>
            </el-table-column>
            <el-table-column label="辅助项名称">
                <template slot-scope="{row}">
                    <span>{{row.coaCobinationName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="借方金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.accountedDr | Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.accountedCr | Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="方向">
                <template slot-scope="{row}">
                    <span>{{row.crDrStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="余额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.balance | Fixed}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getProjsubsidiary } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
    name: 'grossprofit2',
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
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                periodCode1: '',
                periodCode2: '',
                coaCode1: '',
                coaCode2: '',
                page: 1,
                limit: 20
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
        getList() {
            this.listLoading = true
            getProjsubsidiary(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>