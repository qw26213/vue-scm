<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button size="mini" type="primary" @click="getData">查询</el-button>
        </div>
        <el-table :data="tableData" border fit resize empty-text="无错误信息" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.coaName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期间" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.periodCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="错误信息" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.remarks}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初借方" min-width="80" align="center">
                <el-table-column label="数量" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceQtyDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceDr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="期初贷方" min-width="80" align="center">
                <el-table-column label="数量" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceQtyCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期借方" min-width="80" align="center">
                <el-table-column label="数量" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetQtyDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetDr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期贷方" min-width="80" align="center">
                <el-table-column label="数量" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetQtyCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { reBalance } from '@/api/user'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            listQuery: {
              periodCode1:'',
              periodCode2:''
            },
            date4: getNowDate(),
            tableData: [],
        }
    },
    filters: {
        toFix(val) {
            if (!val) { return '0.00' }
            return parseFloat(val).toFix(2)
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            reBalance(this.listQuery).then(res => {
                if (res.data.body != null) {
                    this.tableData1 = res.data.body | []
                }
            })
        }
    }
}
</script>