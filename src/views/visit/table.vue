<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">会计期间</label>
            <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="month" placeholder="开始月份" size="mini" :clearable="false" value-format="yyyy-MM"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="month" placeholder="结束月份" size="mini" :clearable="false" value-format="yyyy-MM"></el-date-picker>
            <label class="label">凭证字</label>
            <el-select v-model="listQuery.jeCatogeryId" placeholder="凭证字" size="mini">
                <el-option v-for="item in catogeryList" :label="item.catogeryName" :value="item.id" :key="item.id"></el-option>
            </el-select>
            <label class="label">科目级次</label>
            <el-select v-model="listQuery.coaLevel1" placeholder="科目级次" size="mini">
                <el-option v-for="item in [1,2,3,4,5,6,7,8]" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaLevel2" placeholder="科目级次" size="mini">
                <el-option v-for="item in [1,2,3,4,5,6,7,8]" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" show-summary>
            <el-table-column label="序号" type="index" width="50" align="center">
            </el-table-column>
            <el-table-column label="科目编码" align="center">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称">
                <template slot-scope="{row}">
                    <span>{{row.pageCoaName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="方向">
                <template slot-scope="{row}">
                    <span>{{row.listCrDrStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额">
                <template slot-scope="{row}">
                    <span>{{row.listBalance}}</span>
                </template>
            </el-table-column>
            <el-table-column label="借方金额">
                <template slot-scope="{row}">
                    <span>{{row.listNetDr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额">
                <template slot-scope="{row}">
                    <span>{{row.listNetCr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期末余额">
                <template slot-scope="{row}">
                    <span>{{row.listBalance}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getVoucherTable, getCatogery} from '@/api/accbook'
import { getNowMonth } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
    name: 'totalAccount',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            catogeryList:[],
            total: 0,
            listLoading: true,
            listQuery: {
                periodCode1: getNowMonth(),
                periodCode2: getNowMonth(),
                jeCatogeryId: '',
                coaLevel1: 1,
                coaLevel2: 8
            }
        }
    },
    created() {
        getCatogery().then(res => {
          this.catogeryList = res.data;
          this.listQuery.jeCatogeryId = res.data[0].id
          this.getList()
        })
    },
    methods: {
        getList() {
            this.listLoading = true
            getVoucherTable(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>
<style scoped>
.label {
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
}
</style>