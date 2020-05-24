<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.periodCode1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.periodCode2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="日期" align="center">
                <template slot-scope="{row}">
                    <span>{{row.jeDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="凭证字号" align="center">
                <template slot-scope="{row}">
                    <span>{{row.jeSeq}}</span>
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
            <el-table-column label="借方发生额">
                <el-table-column label="数量">
                    <template slot-scope="{row}">
                        <span>{{row.qtyDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.unitpriceDr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.accountedDr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="贷方发生额">
                <el-table-column label="数量">
                    <template slot-scope="{row}">
                        <span>{{row.qtyCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.unitpriceCr | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.accountedCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="余额">
                <el-table-column label="方向">
                    <template slot-scope="{row}">
                        <span>{{row.crDrStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量">
                    <template slot-scope="{row}">
                        <span>{{row.balanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.averagePrice | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balance | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getSubsidiarynum } from '@/api/accbook'
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
            getSubsidiarynum(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>