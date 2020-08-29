<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">会计期间:</label>
            <el-select v-model="listQuery.periodCode" placeholder="会计期间" size="mini" @change="getList">
                <el-option v-for="item in periodList" :label="item.text" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </div>
        <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--mini" style="width: 100%;">
            <div class="el-table__body-wrapper is-scrolling-none">
                <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
                    <thead>
                        <tr>
                            <th class="tx-c">项目</th>
                            <th class="tx-c" width="60">行次</th>
                            <th class="tx-c" width="260">本期金额</th>
                            <th class="tx-c" width="260">本年累计金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td nowrap="">一、营业收入</td>
                            <td class="tx-c">1</td>
                            <td><span name="r1c1" class="tx-r">0.00</span></td>
                            <td><span name="r1c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>减：营业成本</td>
                            <td class="tx-c">2</td>
                            <td><span name="r2c1" class="tx-r">0.00</span></td>
                            <td><span name="r2c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;营业税金及附加</td>
                            <td class="tx-c">3</td>
                            <td><span name="r3c1" class="tx-r">0.00</span></td>
                            <td><span name="r3c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：消费税</td>
                            <td class="tx-c">4</td>
                            <td><span name="r4c1" class="tx-r">0.00</span></td>
                            <td><span name="r4c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td nowrap="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;营业税</td>
                            <td class="tx-c">5</td>
                            <td><span name="r5c1" class="tx-r">0.00</span></td>
                            <td><span name="r5c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td nowrap="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;城市维护建设税</td>
                            <td class="tx-c">6</td>
                            <td><span name="r6c1" class="tx-r">0.00</span></td>
                            <td><span name="r6c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td nowrap="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资源税</td>
                            <td class="tx-c">7</td>
                            <td><span name="r7c1" class="tx-r">0.00</span></td>
                            <td><span name="r7c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;土地增值税</td>
                            <td class="tx-c">8</td>
                            <td><span name="r8c1" class="tx-r">0.00</span></td>
                            <td><span name="r8c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;城镇土地使用税、房产税、车船税、印花税</td>
                            <td class="tx-c">9</td>
                            <td><span name="r9c1" class="tx-r">0.00</span></td>
                            <td><span name="r9c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教育费附加、矿产资源补偿费、排污费</td>
                            <td class="tx-c">10</td>
                            <td><span name="r10c1" class="tx-r">0.00</span></td>
                            <td><span name="r10c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销售费用</td>
                            <td class="tx-c">11</td>
                            <td><span name="r11c1" class="tx-r">0.00</span></td>
                            <td><span name="r11c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：商品维修费</td>
                            <td class="tx-c">12</td>
                            <td><span name="r12c1" class="tx-r">0.00</span></td>
                            <td><span name="r12c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;广告费和业务宣传费</td>
                            <td class="tx-c">13</td>
                            <td><span name="r13c1" class="tx-r">0.00</span></td>
                            <td><span name="r13c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管理费用</td>
                            <td class="tx-c">14</td>
                            <td><span name="r14c1" class="tx-r">0.00</span></td>
                            <td><span name="r14c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：开办费</td>
                            <td class="tx-c">15</td>
                            <td><span name="r15c1" class="tx-r">0.00</span></td>
                            <td><span name="r15c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;业务招待费</td>
                            <td class="tx-c">16</td>
                            <td><span name="r16c1" class="tx-r">0.00</span></td>
                            <td><span name="r16c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;研究费用</td>
                            <td class="tx-c">17</td>
                            <td><span name="r17c1" class="tx-r">0.00</span></td>
                            <td><span name="r17c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr height="20">
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;财务费用</td>
                            <td class="tx-c">18</td>
                            <td class="tx-c"><span name="r18c1" class="tx-r">0.00</span></td>
                            <td class="tx-c"><span name="r18c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：利息费用（收入以“-”号填列）</td>
                            <td class="tx-c">19</td>
                            <td><span name="r19c1" class="tx-r">0.00</span></td>
                            <td><span name="r19c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>加：投资收益（损失以“-”号填列）</td>
                            <td class="tx-c">20</td>
                            <td><span name="r20c1" class="tx-r">0.00</span></td>
                            <td><span name="r20c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>二、营业利润（亏损以“-”号填列）</td>
                            <td class="tx-c">21</td>
                            <td><span name="r21c1" class="tx-r">0.00</span></td>
                            <td><span name="r21c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>加：营业外收入</td>
                            <td class="tx-c">22</td>
                            <td><span name="r22c1" class="tx-r">0.00</span></td>
                            <td><span name="r22c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：政府补助</td>
                            <td class="tx-c">23</td>
                            <td><span name="r23c1" class="tx-r">0.00</span></td>
                            <td><span name="r23c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>减：营业外支出</td>
                            <td class="tx-c">24</td>
                            <td><span name="r24c1" class="tx-r">0.00</span></td>
                            <td><span name="r24c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：坏账损失</td>
                            <td class="tx-c">25</td>
                            <td><span name="r25c1" class="tx-r">0.00</span></td>
                            <td><span name="r25c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无法收回的长期债券投资损失</td>
                            <td class="tx-c">26</td>
                            <td><span name="r26c1" class="tx-r">0.00</span></td>
                            <td><span name="r26c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无法收回的长期股权投资损失</td>
                            <td class="tx-c">27</td>
                            <td><span name="r27c1" class="tx-r">0.00</span></td>
                            <td><span name="r27c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;自然灾害等不可抗力因素造成的损失</td>
                            <td class="tx-c">28</td>
                            <td><span name="r28c1" class="tx-r">0.00</span></td>
                            <td><span name="r28c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;税收滞纳金</td>
                            <td class="tx-c">29</td>
                            <td><span name="r29c1" class="tx-r">0.00</span></td>
                            <td><span name="r29c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>三、利润总额（亏损总额以“-”号填列）</td>
                            <td class="tx-c">30</td>
                            <td><span name="r30c1" class="tx-r">0.00</span></td>
                            <td><span name="r30c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>减：所得税费用</td>
                            <td class="tx-c">31</td>
                            <td><span name="r31c1" class="tx-r">0.00</span></td>
                            <td><span name="r31c2" class="tx-r">0.00</span></td>
                        </tr>
                        <tr>
                            <td>四、净利润（净亏损以“-”号填列）</td>
                            <td class="tx-c">32</td>
                            <td><span name="r32c1" class="tx-r">0.00</span></td>
                            <td><span name="r32c2" class="tx-r">0.00</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getProfitData, getPeriodList } from '@/api/report'
import { getNowMonth } from '@/utils/index'
export default {
    name: 'dept',
    data() {
        return {
            tableKey: 0,
            tableData: [],
            periodList: [],
            total: 0,
            listLoading: true,
            listQuery: {
                periodCode: getNowMonth()
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
            getProfitData(this.listQuery).then(res => {
                this.initTable(res.data.data[0])
            }).catch(err => {
                this.listLoading = false
            })
        }
    },
    initTable(obj) {
        for (var key in obj) {
            this.$el.querySelector('span[name = ' + key + ']').innerText = obj[key]
        }
    }
}
</script>
<style scoped>
th,
td {
    height: 36px;
    padding-left: 10px
}

.label {
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
}
</style>