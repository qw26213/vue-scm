<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="项目编码" align="center">
                <template slot-scope="{row}">
                    <span>{{row.auxiliaryCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目名称">
                <template slot-scope="{row}">
                    <span>{{row.auxiliaryName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期发生额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年累计发生额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="期末余额">
                <el-table-column label="借方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贷方" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceCr}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getProjbalance } from '@/api/accbook'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
    name: 'grossprofit2',
    components: { Pagination },
  filters: {
      Fixed: function (num) {
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
                periodCode1: getNowDate(),
                periodCode2: getNowDate(),
                page: 1,
                limit: 20
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getProjbalance(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>