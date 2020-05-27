<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">期间：</label>
            <el-select v-model="listQuery.periodCode1" size="small" placeholder="开始期间">
              <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.periodCode2" size="small" placeholder="结束期间">
              <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <label class="label">科目：</label>
            <el-select v-model="listQuery.coaCode1" size="small" placeholder="科目" filterable>
              <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode">
              </el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaCode2" size="small" placeholder="科目" filterable>
              <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode">
              </el-option>
            </el-select>
            <label class="label">科目级次：</label>
            <el-select v-model="listQuery.coaLevel1" size="small" style="width:100px" placeholder="科目级次" filterable>
              <el-option v-for="item in [1,2,3,4,5,6,7]" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <span class="zhi">至</span>
            <el-select v-model="listQuery.coaLevel2" size="small" style="width:100px" placeholder="科目级次" filterable>
              <el-option v-for="item in [1,2,3,4,5,6,7]" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" cell-class-name="tpCell" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="科目编码" align="center">
                <template slot-scope="{row}">
                    <span> {{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称">
                <template slot-scope="{row}">
                    <span style="padding-left:10px" v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="期间">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:center" v-for="(item,index) in row.listPeriodCode" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="摘要">
                <template slot-scope="{row}">
                    <p clss="pCell" style="width:max-content;min-width:100%" v-for="(item,index) in row.listSummary" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="借方金额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listNetDr" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="贷方金额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listNetCr" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
            <el-table-column label="方向">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:center" v-for="(item,index) in row.listCrDrStr" :key="index">{{item}}</p>
                </template>
            </el-table-column>
            <el-table-column label="余额">
                <template slot-scope="{row}">
                    <p clss="pCell" style="text-align:right" v-for="(item,index) in row.listBalance" :key="index">{{item | Fixed}}</p>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
</template>
<script>
import { getTotalAccount } from '@/api/accbook'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
    name: 'totalAccount',
    components: { Pagination },
    filters: {
        Fixed: function(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    data() {
        return {
            tableKey: 0,
            periodList: [],
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                periodCode1: '',
                periodCode2: '',
                coaCode1: '',
                coaCode2: '',
                coaLevel1: '',
                coaLevel2:'',
                page: 1,
                limit: 20
            }
        }
    },
    computed: {
      ...mapGetters([
        'coaArr',
        'periodArr'
      ])
    },
    watch: {
        periodArr(val){
            if (val.length > 0) {
                this.listQuery.periodCode1 = val[0].id
                this.listQuery.periodCode2 = val[0].id
                this.getList()
            }
        }
    },
    created() {
      this.$store.dispatch('voucher/getPeriod')
      this.$store.dispatch('voucher/getCoaList')
    },
    methods: {
        getList() {
          this.listLoading = true
          getTotalAccount(this.listQuery).then(res => {
              this.listLoading = false
              this.tableData = res.data.data
          }).catch(err => {
              this.listLoading = false
          })
        }
    }
}
</script>