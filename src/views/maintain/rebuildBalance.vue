<template>
    <div class="app-container">
        <div class="filterDiv">
            <label class="label">会计期间</label>
            <el-select v-model="listQuery.periodCode1" style="width:120px" size="small">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <label class="label">发生额</label>
            <el-radio-group v-model="listQuery.isOnlyAdjustNet">
                <el-radio label="1" style="margin-right:10px">只本期</el-radio>
                <el-radio label="2" style="margin-right:10px">从本期开始</el-radio>
            </el-radio-group>
            <label class="label">期初余额</label>
            <el-radio-group v-model="listQuery.isOnlyAdjustNet">
                <el-radio label="3" style="margin-right:10px">从下期至最小未结账期</el-radio>
                <el-radio label="4" style="margin-right:10px">从下期至最大未结账期</el-radio>
                <el-radio label="5">校正发生额结转期末余额至下期</el-radio>
            </el-radio-group>
            <el-button size="small" type="primary" style="margin-left:15px" @click="getData('0')">只检查</el-button>
            <el-button size="small" type="primary" @click="getData('1')">检查校正</el-button>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit resize empty-text="无错误数据" style="width: 100%;">
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
                        <el-popover placement="bottom-start" width="200" trigger="hover" :content="row.remarks">
                            <el-button slot="reference" size="small">查看</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="期初借方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.beginBalanceQtyDr | toFix }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.beginBalanceDr | toFix }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="期初贷方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.beginBalanceQtyCr | toFix }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.beginBalanceCr | toFix }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="本期借方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.periodNetQtyDr | toFix }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.periodNetDr | toFix }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="本期贷方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.periodNetQtyCr | toFix }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{row.periodNetCr | toFix }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { reBalance, getPeriodList } from '@/api/user'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            listQuery: {
                periodCode1: '',
                isOnlyAdjustNet: '1'
            },
            periodList: [],
            tableData: [],
        }
    },
    filters: {
        toFix(val) {
            if (!val || typeof val != 'Number') { return '0.00' }
            return parseFloat(val).toFix(2)
        }
    },
    mounted() {
        this.getPeriod()
    },
    methods: {
        getPeriod() {
            getPeriodList().then(res => {
                this.periodList = res.data.data
                this.listQuery.periodCode1 = res.data.data[0].id
                this.getData('0')
            })
        },
        getData(type) {
            this.listQuery.isAutoCommit = type
            reBalance(this.listQuery).then(res => {
                if (res.data.errorCode == 0) {
                    this.tableData = res.data.data || []
                }
            })
        }
    }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}
</style>