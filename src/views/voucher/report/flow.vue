<template>
    <div class="app-container">
        <div class="filterDiv">
            <label class="label">会计期间:</label>
            <el-select v-model="listQuery.queryParam.periodCode" placeholder="会计期间" size="small" @change="getList">
                <el-option v-for="item in periodList" :label="item.text" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </div>
        <div class="contentDiv">
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="项目" align="left">
                    <template slot-scope="{row}">
                        <span>{{row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="行次" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.seqNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="本次金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.val1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="本次累计金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.val2}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getFlowData, getPeriodList } from '@/api/report'
import { getNowMonth } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
    name: 'reportFlow',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            periodList: [],
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                queryParam: {
                    periodCode: getNowMonth()
                }
            }
        }
    },
    created() {
        this.getList()
        getPeriodList().then(res => {
            this.periodList = res.data.data
        })
    },
    methods: {
        getList() {
            this.listLoading = true
            getFlowData(this.listQuery).then(res => {
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