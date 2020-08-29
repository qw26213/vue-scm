<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">统计期间</label>
            <el-date-picker :editable="false" v-model="listQuery.billDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.billDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <label class="label ml10">统计方式</label>
            <el-select v-model="listQuery.group_type" placeholder="统计方式" size="mini">
                <el-option v-for="item in methodList" :label="item.label" :value="item.val" :key="item.val"></el-option>
            </el-select>
            <label class="label ml10">品类级次</label>
            <el-select v-model="listQuery.invCatgLevel" placeholder="品类级次" size="mini">
                <el-option label="一级" value="1" />
                <el-option label="二级" value="2" />
                <el-option label="三级" value="3" />
                <el-option label="四级" value="4" />
                <el-option label="五级" value="5" />
                <el-option label="末级" value="" />
            </el-select>
            <el-checkbox v-model="listQuery.isBatch" :false-label="0" :true-label="1" class="ml10">显示合计</el-checkbox>
            <el-checkbox v-model="listQuery.saveConf" :false-label="0" :true-label="1">保存选择</el-checkbox>
            <el-checkbox v-model="listQuery.isBatch" :false-label="0" :true-label="1">横向打印</el-checkbox>
            <br/>
            <label class="label">一级汇总</label>
            <el-select v-model="listQuery.param1" style="width:100px" placeholder="一级汇总" size="mini">
                <el-option v-for="item in ['日期','品类','产品','部门','客户','业务员']" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">二级汇总</label>
            <el-select v-model="listQuery.param2" style="width:100px" placeholder="二级汇总" size="mini">
                <el-option v-for="item in ['日期','品类','产品','部门','客户','业务员']" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">三级汇总</label>
            <el-select v-model="listQuery.param3" style="width:100px" placeholder="三级汇总" size="mini">
                <el-option v-for="item in ['日期','品类','产品','部门','客户','业务员']" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">四级汇总</label>
            <el-select v-model="listQuery.param4" style="width:100px" placeholder="四级汇总" size="mini">
                <el-option v-for="item in ['日期','品类','产品','部门','客户','业务员']" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">五级汇总</label>
            <el-select v-model="listQuery.param5" style="width:100px" placeholder="五级汇总" size="mini">
                <el-option v-for="item in ['日期','品类','产品','部门','客户','业务员']" :label="item" :value="item" :key="item" />
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column v-for="(v,i) in columns" :key="i" :label="v.title" :align="v.align">
                <template slot-scope="{row}">
                    <span>{{row[i]}}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { getSaletable} from '@/api/table'
import { getPeriodList } from '@/api/user'
import { getNowDate } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
    name: 'totalAccount',
    components: { Pagination },
    filters:{
        Fixed:function(str){
            return parseFloat(str).toFixed(2)
        }
    },
    data() {
        return {
            periodList: [],
            total: 0,
            tableKey: 0,
            tableData: [],
            methodList:[{ label: '按年-月-日', val: 'day' }, { label: '按年-周', val: 'week' }, { label: '按年-月-旬', val: 'tendays'}, { label: '按年-月', val: 'month'}, {label: '按年-季', val: 'quanter' }],
            listLoading: true,
            columns: [],
            listQuery: {
                billDate1: getNowDate(),
                billDate2: getNowDate(),
                group_type: '',
                invCatgLevel: '',
                param5: '',
                param4: '',
                param3: '',
                param2: '',
                param1: '',
                saveConf: '',
                rotate: '',
                rollUp: '',
                isJson: 1,
                pageIndex: 1,
                pageNum: 20
            }
        }
    },
    created() {
      this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSaletable(this.listQuery).then(res => {
                this.listLoading = false
                const aligns = res.data.align
                this.columns = res.data.columns
                this.columns.forEach((item,index) => {
                    item.align = aligns[index].title == 0 ? 'center' : aligns[index].title == 1 ? 'left' : aligns[index].title == 2 ? 'right' : ''
                })
                this.tableData = res.data.dataSet || []
                this.total = res.data.dataSize
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 5px 0 0;
}
.ml10{margin-left: 10px}
</style>