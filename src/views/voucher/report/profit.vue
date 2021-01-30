<template>
  <div class="app-container">
    <div class="filterDiv"> 
      <label class="label" style="padding-left:0">类别:</label>
      <el-select v-model="listQuery.periodType" placeholder="类别" size="small" @change="typeChange">
        <el-option label="月报" value="1" />
        <el-option label="季报" value="3" />
        <el-option label="上半年报" value="6" />
        <el-option label="年报" value="C" />
      </el-select>
      <label v-if="listQuery.periodType==3 || listQuery.periodType==6 || listQuery.periodType=='C'" class="label">年份:</label>
      <el-select v-if="listQuery.periodType==3 || listQuery.periodType==6 || listQuery.periodType=='C'" v-model="listQuery.periodYear" placeholder="年份" size="small">
        <el-option v-for="item in yearArr" :key="item" :label="item" :value="item" />
      </el-select>
      <label v-if="listQuery.periodType==3" class="label">季度:</label>
      <el-select v-if="listQuery.periodType==3" v-model="listQuery.quarter" placeholder="季度" size="small">
        <el-option label="一季度" value="1" />
        <el-option label="二季度" value="2" />
        <el-option label="三季度" value="3" />
        <el-option label="四季度" value="4" />
      </el-select>
      <label v-if="listQuery.periodType==1" class="label">会计期间:</label>
      <el-select v-if="listQuery.periodType==1" v-model="listQuery.periodCode" placeholder="会计期间" size="small">
        <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
      <el-button size="small" class="filter-item" type="primary" @click="getData">查询</el-button>
      <el-button-group style="float:right">
        <el-button type="default" size="small" icon="el-icon-printer" @click="printBook">打印</el-button>
        <el-button type="default" size="small" icon="el-icon-document" @click="exportBook">导出</el-button>
      </el-button-group>
    </div>
    <div class="contentDiv">
      <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width: 100%;">
        <div class="el-table__body-wrapper is-scrolling-none">
          <table v-if="glBookEntity==2013" cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
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
          <table v-if="glBookEntity==2007" cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
              <thead>
                  <tr>
                      <th class="tx-c">项 目</th>
                      <th class="tx-c" width="60">行次</th>
                      <th class="tx-c" width="200">本期金额</th>
                      <th class="tx-c" width="200">本年累计金额</th>
                      <th class="tx-c" width="200">上期金额</th>
                  </tr>
              </thead>
              <tr>
                  <td nowrap>一、营业收入</td>
                  <td class="tx-c">1</td>
                  <td><span name="r1c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r1c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r1c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>减：营业成本</td>
                  <td class="tx-c">2</td>
                  <td><span name="r2c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r2c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r2c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;营业税金及附加</td>
                  <td class="tx-c">3</td>
                  <td><span name="r3c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r3c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r3c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销售费用</td>
                  <td class="tx-c">4</td>
                  <td><span name="r4c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r4c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r4c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td nowrap>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管理费用</td>
                  <td class="tx-c">5</td>
                  <td><span name="r5c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r5c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r5c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td nowrap>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;财务费用</td>
                  <td class="tx-c">6</td>
                  <td><span name="r6c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r6c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r6c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td nowrap>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产减值损失</td>
                  <td class="tx-c">7</td>
                  <td><span name="r7c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r7c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r7c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>加：公允价值变动收益（损失以“-”填列）</td>
                  <td class="tx-c">8</td>
                  <td><span name="r8c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r8c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r8c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投资收益（损失以“-”填列）</td>
                  <td class="tx-c">9</td>
                  <td><span name="r9c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r9c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r9c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：对联营企业和合营企业的投资收益</td>
                  <td class="tx-c">10</td>
                  <td><span name="r10c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r10c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r10c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>二、营业利润（亏损以“-”填列）</td>
                  <td class="tx-c">11</td>
                  <td><span name="r11c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r11c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r11c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>加：营业外收入</td>
                  <td class="tx-c">12</td>
                  <td><span name="r12c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r12c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r12c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：非流动资产处置利得</td>
                  <td class="tx-c">13</td>
                  <td><span name="r21c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r21c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r21c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td height="22">减：营业外支出</td>
                  <td class="tx-c">14</td>
                  <td><span name="r13c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r13c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r13c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：非流动资产处置损失</td>
                  <td class="tx-c">15</td>
                  <td><span name="r14c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r14c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r14c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>三、利润总额（亏损总额以“-”填列）</td>
                  <td class="tx-c">16</td>
                  <td><span name="r15c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r15c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r15c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>减：所得税费用</td>
                  <td class="tx-c">17</td>
                  <td><span name="r16c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r16c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r16c2" class="tx-r uds w_100"></span></td>
              </tr>
              <tr>
                  <td>四、净利润（净亏损以“-”填列）</td>
                  <td class="tx-c">18</td>
                  <td><span name="r17c1" class="tx-r uds w_100"></span></td>
                  <td><span name="r17c3" class="tx-r uds w_100"></span></td>
                  <td><span name="r17c2" class="tx-r uds w_100"></span></td>
              </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getProfitData, getPeriodList, printProfitData, exportProfitData } from '@/api/report'
import { getNowMonth, uniqueArr } from '@/utils/index'
export default {
  name: 'reportProfit',
  data() {
    const userInfo = JSON.parse(sessionStorage.userInfo)
    let path = '2013'
    if (userInfo.glBookEntity && (userInfo.glBookEntity.coahierarchyId == 1||userInfo.glBookEntity.coahierarchyId == 2007)) {
        path = '2007'
    }
    return {
      tableKey: 0,
      tableData: [],
      periodList: [],
      yearArr: [],
      total: 0,
      glBookEntity: path,
      listLoading: true,
      listQuery: {
        periodType: '1',
        periodYear: '',
        quarter: '',
        periodCode: getNowMonth()
      }
    }
  },
  created() {
    this.getData()
    getPeriodList().then(res => {
      this.periodList = res.data.data
      this.initYearArr()
    })
  },
  methods: {
    getData() {
      getProfitData(this.listQuery).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          const obj = res.data.data[0]
          for (const key in obj) {
            if (key && key.indexOf('r') >= 0 && key.indexOf('c') >=0 && key.length < 6 && this.$el.querySelector('span[name = ' + key + ']')) {
              this.$el.querySelector('span[name = ' + key + ']').innerText = obj[key]
            }
          }
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    typeChange(val) {
      if (val === '1') {
        this.listQuery.periodYear = ''
        this.listQuery.quarter = ''
      } else {
        this.listQuery.periodCode = ''
      }
      if (val === '3') {
        this.listQuery.periodYear = this.yearArr.length > 0 ? this.yearArr[0] : ''
        this.listQuery.quarter = '1'
      }
      if (val === '6') {
        this.listQuery.periodYear = this.yearArr.length > 0 ? this.yearArr[0] : ''
        this.listQuery.quarter = ''
      }
      if (val === 'C') {
        this.listQuery.periodYear = this.yearArr.length > 0 ? this.yearArr[0] : ''
        this.listQuery.quarter = ''
      }
      this.getData()
    },
    initYearArr() {
      var arr = []
      this.periodList.forEach(item => {
          arr.push(item.seasonCode.substring(0, 4))
      })
      this.yearArr = uniqueArr(arr)
    },
    exportBook() {
      exportProfitData(this.listQuery)
    },
    printBook() {
      printProfitData(this.listQuery).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
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
    padding: 0 6px 0 5px;
}
td span {display: block;padding-right: 10px;}
.tx-c{text-align: center!important;}
.tx-r{text-align: right!important;}
</style>
