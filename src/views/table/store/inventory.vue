<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">统计期间</label>
            <el-date-picker :editable="false" v-model="listQuery.billDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.billDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" />
            <label class="label ml10">统计表类型</label>
            <el-select v-model="listQuery.groupDateType" placeholder="统计表类型" size="mini">
                <el-option v-for="item in methodList" :label="item.label" :value="item.val" :key="item.val" />
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
            <label class="label ml10">盘点类型</label>
            <el-select v-model="listQuery.inventoryType" placeholder="盘点类型" size="mini">
                <el-option label="报损" value="0" />
                <el-option label="盘亏" value="1" />
                <el-option label="盘盈" value="2" />
            </el-select>
            <el-checkbox v-model="listQuery.rollUp" false-label="0" true-label="1" class="ml10">显示合计</el-checkbox>
            <el-checkbox v-model="listQuery.rotate" false-label="0" true-label="1">横向打印</el-checkbox>
            <el-popover placement="bottom" title="选择模板" width="500" trigger="click">
                <div>
                  <el-table style="width: 100%;" :data="templatelist" size="mini" resize>
                      <el-table-column label="模板名称" prop="queryName" width="120" align="left" show-overflow-tooltip />
                      <el-table-column label="模板类型" width="100" align="center">
                        <template slot-scope="{row}">
                            <span v-if="row.templateType==0">系统模板</span>
                            <span v-if="row.templateType==1">公司模板</span>
                            <span v-if="row.templateType==2">个人模板</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="模板说明" prop="remarks" show-overflow-tooltip />
                      <el-table-column label="操作" align="center" width="100">
                        <template slot-scope="{row}">
                            <span class="ctrl" @click="selectTemplate(row)">选择</span>
                            <span class="ctrl" @click="deleteTemplate(row.id)">删除</span>
                        </template>
                      </el-table-column>
                  </el-table>
                </div>
                <el-button size="mini" slot="reference">模板查询<i class="el-icon-arrow-down" style="margin-left:3px" /></el-button>
            </el-popover>
            <br/>
            <label class="label" id="level01">一级汇总</label>
            <el-select v-model="listQuery.param1" style="width:100px" placeholder="一级汇总" size="mini">
                <el-option v-for="item in levellist" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">二级汇总</label>
            <el-select v-model="listQuery.param2" style="width:100px" placeholder="二级汇总" size="mini">
                <el-option v-for="item in levellist" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">三级汇总</label>
            <el-select v-model="listQuery.param3" style="width:100px" placeholder="三级汇总" size="mini">
                <el-option v-for="item in levellist" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">四级汇总</label>
            <el-select v-model="listQuery.param4" style="width:100px" placeholder="四级汇总" size="mini">
                <el-option v-for="item in levellist" :label="item" :value="item" :key="item" />
            </el-select>
            <label class="label ml10">五级汇总</label>
            <el-select v-model="listQuery.param5" style="width:100px" placeholder="五级汇总" size="mini">
                <el-option v-for="item in levellist" :label="item" :value="item" :key="item" />
            </el-select>
            <el-button size="mini" @click="handleSave">保存选择</el-button>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="default" @click="printBook">打印</el-button>
            <el-button size="mini" type="warning" @click="exportBook">导出</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column v-for="(it, i) in columns" :key="i" :label="it.label" :prop="it.key" :align="it.align" />
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        <saveSelect :dialogvisible.sync="selectModalVisible" @saveTemplate="saveTemplate" />
    </div>
</template>
<script>
import { getAggregate, getInventoryTable, getInventoryQueryConfList, getDefaultInventoryQueryConf, saveInventoryQueryConf, delInventoryTemplate, exportInventoryBook, printInventoryBook } from '@/api/table'
import { getPeriodList } from '@/api/user'
import { getNowDate } from '@/utils/index'
import Pagination from '@/components/Pagination'
import saveSelect from '@/components/saveSelect'
export default {
    name: 'totalAccount',
    components: { Pagination, saveSelect },
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
            methodList:[{ label: '日报', val: 'day' }, { label: '周报', val: 'week' }, { label: '旬报', val: 'tendays'}, { label: '月报', val: 'month'}, {label: '季报', val: 'quarter' }],
            listLoading: true,
            columns: [],
            templatelist: [],
            selectedTemplate: '',
            selectModalVisible: false,
            levellist: [],
            listQuery: {
                billDate1: getNowDate(),
                billDate2: getNowDate(),
                groupDateType: 'day',
                invCatgLevel: '1',
                param5: '业务员',
                param4: '客户',
                param3: '商品',
                param2: '品类',
                param1: '日期',
                rotate: '0',
                rollUp: '1',
                pageIndex: 1,
                pageNum: 20
            }
        }
    },
    created() {
      this.getList()
      this.getTemplateList()
      getAggregate().then(res => {
        this.levellist = res.data
        getDefaultInventoryQueryConf().then(res => {
            if (res && res.data.data) {
                const propValue = JSON.parse(res.data.data.paramValue)
                for (var key in propValue) {
                    this.listQuery[key] = propValue[key]
                }
            }
        })
      })
    },
    methods: {
        selectTemplate(row) {
            this.selectedTemplate = row.id
            document.getElementById('level01').click()
            const data = JSON.parse(row.paramValue)
            for (let key in data) {
                this.listQuery[key] = data[key]
            }
        },
        handleSave() {
            this.selectModalVisible = true
        },
        deleteTemplate(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id)
            })
        },
        delItem(id) {
            delInventoryTemplate(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getTemplateList()
                    this.dialogFormVisible = false
                    this.$message.success('删除成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        saveTemplate(obj) {
            const data = {
                groupType: this.listQuery.groupType,
                invCatgLevel: this.listQuery.invCatgLevel,
                param1: this.listQuery.param1,
                param2: this.listQuery.param2,
                param3: this.listQuery.param3,
                param4: this.listQuery.param4,
                param5: this.listQuery.param5,
                rotate: this.listQuery.rotate,
                rollUp: this.listQuery.rollUp,
                ...obj
            }
            saveInventoryQueryConf(data).then(res => {
                if (res.data.errorCode == 0) {
                    this.getTemplateList()
                    this.selectModalVisible = false
                    this.$message.success('已保存为模板')
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        getTemplateList() {
            getInventoryQueryConfList().then(res => {
                this.templatelist = res.data.data || []
            })
        },
        exportBook() {
            exportInventoryBook(this.listQuery)
        },
        printBook() {
            printInventoryBook(this.listQuery).then(res => {
                window.open("http://"+window.location.host+res.data.data)
            }).catch(err => {
                this.listLoading = false
            })
        },
        getList() {
            this.listLoading = true
            getInventoryTable(this.listQuery).then(res => {
                this.listLoading = false
                this.columns = res.data.columns
                this.columns.forEach((item,index) => {
                    item.align = item.align == 0 ? 'left' : item.align == 1 ? 'center' : item.align == 2 ? 'right' : ''
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