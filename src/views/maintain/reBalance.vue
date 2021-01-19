<template>
    <div class="app-container">
        <div class="filterDiv">
            <label class="label">会计期间</label>
            <el-select v-model="listQuery.periodCode1" size="small">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id" />
            </el-select>
            <label class="label">查询区间</label>
            <el-select v-model="listQuery.isOnlyAdjustNet" class="se" size="small" placeholder="查询区间">
                <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-button size="small" type="primary" style="margin-left:15px" @click="getData('0')">只检查</el-button>
            <el-button size="small" type="primary" @click="getData('1')">检查校正</el-button>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit resize empty-text="无错误数据" style="width: 100%;">
                <el-table-column label="科目编码">
                    <template slot-scope="{row}">
                        <span>{{ row && row.coaCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="科目名称" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row && row.coaName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="期间" min-width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row && row.periodCode }}</span>
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
                            <span>{{ row && row.beginBalanceQtyDr | zeroNull }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.beginBalanceDr | Fixed }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="期初贷方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.beginBalanceQtyCr | zeroNull }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row.beginBalanceCr | zeroNull }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="本期借方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.periodNetQtyDr | zeroNull }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.periodNetDr | Fixed }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="本期贷方" align="center">
                    <el-table-column label="数量" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.periodNetQtyCr | zeroNull }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="80" align="right">
                        <template slot-scope="{row}">
                            <span>{{ row && row.periodNetCr | Fixed }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { reBalance, getPeriodList } from '@/api/user'
export default {
    name: 'rebuildBalance',
    filters: {
        zeroNull: function(num) {
          return num ? num : ''
        },
        Fixed(num) {
          return num ? num.toFixed(2) : ''
        }
    },
    data() {
        return {
            options: [{
                label: '发生额',
                options: [{
                    value: '1',
                    label: '只本期'
                }, {
                    value: '2',
                    label: '从本期开始'
                }]
            }, {
                label: '期初余额',
                options: [{
                    value: '3',
                    label: '从下期至最小未结账期'
                }, {
                    value: '4',
                    label: '从下期至最大未结账期'
                }, {
                    value: '5',
                    label: '校正发生额结转期末余额至下期'
                }]
            }],
            listQuery: {
                periodCode1: '',
                isOnlyAdjustNet: '1'
            },
            periodList: [],
            tableData: []
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
                if (res.data.errorCode === '0') {
                    this.tableData = res.data.data || []
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}
>>> .filterDiv .el-select--small {
    width: 220px!important;
}
>>> .filterDiv .el-input--small {
    width: 220px!important;
}
</style>