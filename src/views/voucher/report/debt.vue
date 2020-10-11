<template>
  <div class="app-container">
    <div class="filterDiv">
      <label class="label">会计期间:</label>
      <el-select v-model="listQuery.periodCode" placeholder="会计期间" size="small" @change="getList">
        <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
    </div>
    <div class="contentDiv">
      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width: 100%;">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
            <thead>
              <tr>
                <th width="" class="tx-c">资产</th>
                <th width="60" class="tx-c">行次</th>
                <th width="" class="tx-c">期末余额</th>
                <th width="" class="tx-c">年初余额</th>
                <th width="" class="tx-c" nowrap>负债和所有者权益</th>
                <th width="60" class="tx-c">行次</th>
                <th width="" class="tx-c">期末余额</th>
                <th width="" class="tx-c">年初余额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td height="16" nowrap="">流动资产：</td>
                <td class="tx-c" />
                <td class="tx-c" />
                <td class="tx-c" />
                <td>流动负债：</td>
                <td class="tx-c" />
                <td class="tx-c" />
                <td class="tx-c" />
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;货币资金</td>
                <td class="tx-c">1</td>
                <td> <span name="r2c1" class="tx-r">0.00</span></td>
                <td> <span name="r2c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;短期借款</td>
                <td class="tx-c">31</td>
                <td> <span name="r2c3" class="tx-r">0.00</span></td>
                <td> <span name="r2c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td nowrap="">&nbsp;&nbsp;&nbsp;&nbsp;短期投资</td>
                <td class="tx-c">2</td>
                <td> <span name="r3c1" class="tx-r">0.00</span></td>
                <td> <span name="r3c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应付票据</td>
                <td class="tx-c">32</td>
                <td> <span name="r3c3" class="tx-r">0.00</span></td>
                <td> <span name="r3c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应收票据</td>
                <td class="tx-c">3</td>
                <td> <span name="r4c1" class="tx-r">0.00</span></td>
                <td> <span name="r4c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应付账款</td>
                <td class="tx-c">33</td>
                <td> <span name="r4c3" class="tx-r">0.00</span></td>
                <td> <span name="r4c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应收账款</td>
                <td class="tx-c">4</td>
                <td> <span name="r5c1" class="tx-r">0.00</span></td>
                <td> <span name="r5c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;预收账款</td>
                <td class="tx-c">34</td>
                <td> <span name="r5c3" class="tx-r">0.00</span></td>
                <td> <span name="r5c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;预付款项</td>
                <td class="tx-c">5</td>
                <td> <span name="r6c1" class="tx-r">0.00</span></td>
                <td> <span name="r6c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应付职工薪酬</td>
                <td class="tx-c">35</td>
                <td> <span name="r6c3" class="tx-r">0.00</span></td>
                <td> <span name="r6c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td nowrap="">&nbsp;&nbsp;&nbsp;&nbsp;应收股利</td>
                <td class="tx-c">6</td>
                <td> <span name="r7c1" class="tx-r">0.00</span></td>
                <td> <span name="r7c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应交税费</td>
                <td class="tx-c">36</td>
                <td> <span name="r7c3" class="tx-r">0.00</span></td>
                <td> <span name="r7c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应收利息</td>
                <td class="tx-c">7</td>
                <td> <span name="r8c1" class="tx-r">0.00</span></td>
                <td> <span name="r8c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应付利息</td>
                <td class="tx-c">37</td>
                <td> <span name="r8c3" class="tx-r">0.00</span></td>
                <td> <span name="r8c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他应收款</td>
                <td class="tx-c">8</td>
                <td> <span name="r9c1" class="tx-r">0.00</span></td>
                <td> <span name="r9c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;应付利润</td>
                <td class="tx-c">38</td>
                <td> <span name="r9c3" class="tx-r">0.00</span></td>
                <td> <span name="r9c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;存货</td>
                <td class="tx-c">9</td>
                <td> <span name="r10c1" class="tx-r">0.00</span></td>
                <td> <span name="r10c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他应付款</td>
                <td class="tx-c">39</td>
                <td> <span name="r10c3" class="tx-r">0.00</span></td>
                <td> <span name="r10c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其中：原材料</td>
                <td class="tx-c">10</td>
                <td> <span name="r11c1" class="tx-r">0.00</span></td>
                <td> <span name="r11c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他流动负债</td>
                <td class="tx-c">40</td>
                <td> <span name="r11c3" class="tx-r">0.00</span></td>
                <td> <span name="r11c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;在产品</td>
                <td class="tx-c">11</td>
                <td />
                <td />
                <td>流动负债合计</td>
                <td class="tx-c">41</td>
                <td> <span name="r12c3" class="tx-r">0.00</span></td>
                <td> <span name="r12c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td height="22">&nbsp;&nbsp;&nbsp;&nbsp;库存商品</td>
                <td class="tx-c">12</td>
                <td> <span name="r13c1" class="tx-r">0.00</span></td>
                <td> <span name="r13c2" class="tx-r">0.00</span></td>
                <td>非流动负债：</td>
                <td class="tx-c">&nbsp;</td>
                <td>
                  <div class="tx-c" />
                </td>
                <td>
                  <div class="tx-c" />
                </td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;周转材料</td>
                <td class="tx-c">13</td>
                <td class="tx-c"> <span name="r14c1" class="tx-r">0.00</span></td>
                <td class="tx-c"> <span name="r14c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;长期借款</td>
                <td class="tx-c">42</td>
                <td> <span name="r14c3" class="tx-r">0.00</span></td>
                <td> <span name="r14c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他流动资产</td>
                <td class="tx-c">14</td>
                <td> <span name="r15c1" class="tx-r">0.00</span></td>
                <td> <span name="r15c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;长期应付款</td>
                <td class="tx-c">43</td>
                <td class="tx-c"> <span name="r15c3" class="tx-r">0.00</span></td>
                <td class="tx-c"> <span name="r15c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>流动资产合计</td>
                <td class="tx-c">15</td>
                <td> <span name="r16c1" class="tx-r">0.00</span></td>
                <td> <span name="r16c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;递延收益</td>
                <td class="tx-c">44</td>
                <td> <span name="r16c3" class="tx-r">0.00</span></td>
                <td> <span name="r16c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>非流动资产：</td>
                <td class="tx-c" />
                <td class="tx-c" />
                <td class="tx-c" />
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他非流动负债</td>
                <td class="tx-c">45</td>
                <td> <span name="r17c3" class="tx-r">0.00</span></td>
                <td> <span name="r17c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;长期债券投资</td>
                <td class="tx-c">16</td>
                <td> <span name="r18c1" class="tx-r">0.00</span></td>
                <td> <span name="r18c2" class="tx-r">0.00</span></td>
                <td>非流动负债合计</td>
                <td class="tx-c">46</td>
                <td> <span name="r18c3" class="tx-r">0.00</span></td>
                <td> <span name="r18c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;长期股权投资</td>
                <td class="tx-c">17</td>
                <td> <span name="r19c1" class="tx-r">0.00</span></td>
                <td> <span name="r19c2" class="tx-r">0.00</span></td>
                <td>负债合计</td>
                <td class="tx-c">47</td>
                <td> <span name="r19c3" class="tx-r">0.00</span></td>
                <td> <span name="r19c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;固定资产原价</td>
                <td class="tx-c">18</td>
                <td> <span name="r20c1" class="tx-r">0.00</span></td>
                <td> <span name="r20c2" class="tx-r">0.00</span></td>
                <td>&nbsp;</td>
                <td class="tx-c">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;减：累计折旧</td>
                <td class="tx-c">19</td>
                <td> <span name="r21c1" class="tx-r">0.00</span></td>
                <td> <span name="r21c2" class="tx-r">0.00</span></td>
                <td>&nbsp;</td>
                <td class="tx-c">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;固定资产账面价值</td>
                <td class="tx-c">20</td>
                <td> <span name="r22c1" class="tx-r">0.00</span></td>
                <td> <span name="r22c2" class="tx-r">0.00</span></td>
                <td>&nbsp;</td>
                <td class="tx-c">&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;在建工程</td>
                <td class="tx-c">21</td>
                <td> <span name="r23c1" class="tx-r">0.00</span></td>
                <td> <span name="r23c2" class="tx-r">0.00</span></td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;工程物资</td>
                <td class="tx-c">22</td>
                <td> <span name="r24c1" class="tx-r">0.00</span></td>
                <td> <span name="r24c2" class="tx-r">0.00</span></td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;固定资产清理</td>
                <td class="tx-c">23</td>
                <td> <span name="r25c1" class="tx-r">0.00</span></td>
                <td> <span name="r25c2" class="tx-r">0.00</span></td>
                <td />
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;生产性生物资产</td>
                <td class="tx-c">24</td>
                <td> <span name="r26c1" class="tx-r">0.00</span></td>
                <td> <span name="r26c2" class="tx-r">0.00</span></td>
                <td>所有者权益（或股东权益）：</td>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;无形资产</td>
                <td class="tx-c">25</td>
                <td> <span name="r27c1" class="tx-r">0.00</span></td>
                <td> <span name="r27c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;实收资本（或股本）</td>
                <td class="tx-c">48</td>
                <td> <span name="r27c3" class="tx-r">0.00</span></td>
                <td> <span name="r27c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;开发支出</td>
                <td class="tx-c">26</td>
                <td> <span name="r28c1" class="tx-r">0.00</span></td>
                <td> <span name="r28c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;资本公积</td>
                <td class="tx-c">49</td>
                <td> <span name="r28c3" class="tx-r">0.00</span></td>
                <td> <span name="r28c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;长期待摊费用</td>
                <td class="tx-c">27</td>
                <td> <span name="r29c1" class="tx-r">0.00</span></td>
                <td> <span name="r29c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;盈余公积</td>
                <td class="tx-c">50</td>
                <td> <span name="r29c3" class="tx-r">0.00</span></td>
                <td> <span name="r29c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;其他非流动资产</td>
                <td class="tx-c">28</td>
                <td> <span name="r30c1" class="tx-r">0.00</span></td>
                <td> <span name="r30c2" class="tx-r">0.00</span></td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;未分配利润</td>
                <td class="tx-c">51</td>
                <td> <span name="r30c3" class="tx-r">0.00</span></td>
                <td> <span name="r30c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>非流动资产合计</td>
                <td class="tx-c">29</td>
                <td> <span name="r31c1" class="tx-r">0.00</span></td>
                <td> <span name="r31c2" class="tx-r">0.00</span></td>
                <td>所有者权益（或股东权益）合计</td>
                <td class="tx-c">52</td>
                <td> <span name="r31c3" class="tx-r">0.00</span></td>
                <td> <span name="r31c4" class="tx-r">0.00</span></td>
              </tr>
              <tr>
                <td>资产总计</td>
                <td class="tx-c">30</td>
                <td> <span name="r32c1" class="tx-r">0.00</span></td>
                <td> <span name="r32c2" class="tx-r">0.00</span></td>
                <td>负债和所有者权益（或股东权益）总计</td>
                <td class="tx-c">53</td>
                <td> <span name="r32c3" class="tx-r">0.00</span></td>
                <td> <span name="r32c4" class="tx-r">0.00</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDeptData, getPeriodList } from '@/api/report'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'Dept',
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
      getDeptData(this.listQuery).then(res => {
        this.initTable(res.data.data[0])
      }).catch(() => {
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
