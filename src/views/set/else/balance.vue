<template>
    <div class="app-container">
        <div class="filter-container1" style="margin-bottom:20px">
            <label class="label">会计期间</label>
            <el-select v-model="listQuery.periodCode1" style="width:120px" size="mini">
                <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <label class="label">发生额</label>
            <el-select v-model="listQuery.isOnlyAdjustNet1" style="min-width:200px;width:200px" size="mini">
                <el-option label="只本期" value="1"></el-option>
                <el-option label="从本期开始" value="2"></el-option>
                <!-- </el-select>
            <label class="label">期初余额</label>
            <el-select v-model="listQuery.isOnlyAdjustNet" style="min-width:200px;width:200px" size="mini"> -->
                <el-option label="从下期至最小未结账期" value="3"></el-option>
                <el-option label="从下期至最大未结账期" value="4"></el-option>
                <el-option label="校正发生额结转期末余额至下期" value="5"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getData()">保存</el-button>
            <el-button size="mini" type="primary" @click="getData()">试算平衡</el-button>
        </div>
        <el-table :data="tableData" border fit resize empty-text="无错误信息" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100">
                <template slot-scope="{row}">
                    <span>{{row.showCoaName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="方向" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.crDr==1?'借':row.crDr==0?'平':'贷'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期初余额" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalance | toFix }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceQty | toFix }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年借方累计" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetDr | toFix }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetQtyDr | toFix }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="本年贷方累计" min-width="80">
                <el-table-column label="金额(元，可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetCr | toFix }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量(可输入)" min-width="80" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.periodNetQtyCr | toFix }}</span>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getBalance, getPeriodList } from '@/api/user'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            listQuery: {
                periodCode1: '',
                isOnlyAdjustNet: '1'
            },
            userInfo: {},
            periodList: [],
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
        getPeriod() {
            getPeriodList().then(res => {
                this.periodList = res.data.data
                this.listQuery.periodCode1 = res.data.data[0].id
                this.getData('0')
            })
        },
        getData() {
            var data = { "periodId": "13644654252310777643", "periodCode": "2019-04", "periodName": "2019年第4期", "periodYear": 2019, "periodNum": 4, "coaHierarchyId": "2" }
            getBalance(data).then(res => {
                this.tableData = res.data || []
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