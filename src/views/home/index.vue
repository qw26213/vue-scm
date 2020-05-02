<template>
    <div class="homeMain">
        <el-row :gutter="30" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">七日毛利</span>
                        <el-date-picker :editable="false" v-model="date1" type="date" placeholder="选择日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <el-table :data="tableData1" border fit resize>
                      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                      <el-table-column label="日期" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.jeDate}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="收入" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.income | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="成本" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.cost | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfit | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利率" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfitMargin | toFix}}</span>
                          </template>
                      </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col" style="padding-left:0">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">日毛利排行--品类</span>
                        <label style="font-size:14px;margin-left:10px;color:#666">选择级次:</label>
                        <el-select size="mini" v-model="invCatgLevel" style="width:80px">
                          <el-option label="一级" value="1"></el-option>
                          <el-option label="二级" value="2"></el-option>
                          <el-option label="三级" value="3"></el-option>
                          <el-option label="四级" value="4"></el-option>
                          <el-option label="五级" value="5"></el-option>
                          <el-option label="末级" value=""></el-option>
                        </el-select>
                        <el-date-picker :editable="false" v-model="date2" type="date" placeholder="选择日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <el-table :data="tableData2" border fit resize>
                      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                      <el-table-column label="代码" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgCode}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="名称" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="收入" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.income | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="成本" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.cost | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfit | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利率" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfitMargin | toFix}}</span>
                          </template>
                      </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">日毛利排行--产品</span>
                        <el-date-picker :editable="false" v-model="date3" type="date" placeholder="选择日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <el-table :data="tableData3" border fit resize>
                      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                      <el-table-column label="代码" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgCode}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="名称" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="收入" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.income | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="成本" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.cost | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfit | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利率" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfitMargin | toFix}}</span>
                          </template>
                      </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col" style="padding-left:0">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">日毛利排行--网点</span>
                        <el-date-picker :editable="false" v-model="date4" type="date" placeholder="选择日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                    <el-table :data="tableData1" border fit resize>
                      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                      <el-table-column label="代码" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgCode}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="名称" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.invCatgName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="收入" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.income | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="成本" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.cost | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfit | toFix}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="毛利率" min-width="80" align="center">
                          <template slot-scope="{row}">
                              <span>{{row.grossProfitMargin | toFix}}</span>
                          </template>
                      </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import CountTo from 'vue-count-to'
import { home1TopN, home2TopN, home3TopN, home4TopN } from '@/api/login'
import { getNowDate } from '@/utils/index'
export default {
    components: { CountTo },
    data() {
        return {
          date1: getNowDate(),
          date2: getNowDate(),
          date3: getNowDate(),
          date4: getNowDate(),
          invCatgLevel: '1',
          tableData1: [],
          tableData2: [],
          tableData3: [],
          tableData4: []
        }
    },
    filters: {
      toFix(val){
        if (!val) { return '0.00' }
        return parseFloat(val).toFix(2)
      }
    },
    mounted() {
      this.getData1()
      this.getData2()
      this.getData3()
      this.getData4()
    },
    methods: {
        getData1() {
          var obj = {
            pageNum: 7,
            jeDate: this.date1
          }
          home1TopN(obj).then(res => {
            if(res.data.data != null) {
              this.tableData1 = res.data.data || []
            }
          })
        },
        getData2() {
          var obj = {
            invCatgLevel:this.invCatgLevel,
            pageIndex: 0,
            pageNum: 7,
            jeDate: this.date2
          }
          home2TopN(obj).then(res => {
            if(res.data.data != null) {
              this.tableData2 = res.data.data || []
            }
          })
        },
        getData3() {
          var obj = {
            pageIndex: 0,
            pageNum: 7,
            jeDate: this.date3
          }
          home3TopN(obj).then(res => {
            if(res.data.data != null) {
              this.tableData3 = res.data.data || []
            }
          })
        },
        getData4() {
          var obj = {
            pageIndex: 0,
            pageNum: 7,
            jeDate: this.date4
          }
          home4TopN(obj).then(res => {
            if(res.data.data != null) {
              this.tableData4 = res.data.data || []
            }
          })
        }
    }
}
</script>
<style lang="scss" scoped>
.homeMain {
    padding: 20px 20px 10px;
    min-width: 1220px;
    background-color: rgb(240, 242, 245);
    position: relative;
    height:100%
}

.panel-group {
    .card-panel-col {
        margin-bottom: 20px;
    }
}
/deep/.el-table__empty-text{padding:80px}
/deep/.el-card__header{padding:10px 15px}
/deep/.el-date-editor{width:120px;float:right}
</style>