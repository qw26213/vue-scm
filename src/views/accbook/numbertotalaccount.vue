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
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称">
                <template slot-scope="{row}">
                  <span style="padding-left:10px" v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="单位">
                <template slot-scope="{row}">
                    <span>{{row.uom}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额">
                <el-table-column label="方向">
                    <template slot-scope="{row}">
                        <span>{{row.crDrStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginUnitPrice | Fixed }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalance | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期借方">
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetNumDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetDr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本期贷方">
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetNumCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年借方">
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetDr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetNumDr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年贷方">
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetNumCr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.yearNetCr | Fixed}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="期末余额">
                <el-table-column label="方向">
                    <template slot-scope="{row}">
                        <span>{{row.crDrStr}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.balanceUnitPrice | Fixed }}</span>
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
import { getLedgernum } from '@/api/accbook'
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
            getLedgernum(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>