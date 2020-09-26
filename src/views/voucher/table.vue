<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">会计期间</label>
            <el-select v-model="listQuery.periodCode1" placeholder="开始期间" size="small">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.periodCode2" placeholder="结束期间" size="small">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <label class="label ml10">凭证字</label>
            <el-select v-model="listQuery.jeCatogeryId" placeholder="凭证字" size="small">
                <el-option v-for="item in catogeryList" :label="item.catogeryName" :value="item.id" :key="item.id"></el-option>
            </el-select>
            <label class="label ml10">科目级次</label>
            <el-select v-model="listQuery.coaLevel1" placeholder="科目级次" size="small">
                <el-option v-for="item in [1,2,3,4,5,6,7,8]" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaLevel2" placeholder="科目级次" size="small">
                <el-option v-for="item in [1,2,3,4,5,6,7,8]" :label="item" :value="item" :key="item"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100">
                <template slot-scope="{row}">
                    <span v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="方向" align="center">
                <template slot-scope="{row}">
                    <span>{{row.crDrStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.beginBalance | Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="借方金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.accountedCr | Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.accountedDr | Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期末余额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.endBalance | Fixed}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getVoucherTable, getCatogery} from '@/api/accbook'
import { getPeriodList } from '@/api/user'
import { getNowMonth } from '@/utils/index'
export default {
    name: 'totalAccount',
    filters:{
        Fixed:function(str){
            return parseFloat(str).toFixed(2)
        }
    },
    data() {
        return {
            periodList: [],
            tableKey: 0,
            tableData: [],
            catogeryList:[],
            listLoading: true,
            listQuery: {
                periodCode1: '',
                periodCode2: getNowMonth(),
                jeCatogeryId: '',
                coaLevel1: 1,
                coaLevel2: 8
            }
        }
    },
    created() {
        getPeriodList().then(res => {
            this.periodList = res.data.data
            this.listQuery.periodCode1 = res.data.data[0].id
        })
        getCatogery().then(res => {
          this.catogeryList = res.data.data
          this.listQuery.jeCatogeryId = res.data.data[0].id
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
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 5px 0 0;
}
.ml10{margin-left: 10px}
</style>