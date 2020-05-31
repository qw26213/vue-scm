<template>
    <div class="app-container">
        <div class="filter-container">
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
                <el-button size="mini" type="primary" @click="getList">查询</el-button>
            </div>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="科目编码" align="center">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称">
                <template slot-scope="{row}">
                    <span style="padding-left:10px" v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceDr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期发生额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetDr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年累计发生额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetDr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="期末余额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceDr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getBalance } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
    name: 'balance',
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
                coaLevel1: '',
                coaLevel2: '',
                isShowAuxiliary: '',
                isShowNetAndBalanceNotEqualToZero: '',
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
            getBalance(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>