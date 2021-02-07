复制往期薪酬<template>
    <div class="app-container">
        <div class="filterDiv">
            <el-date-picker v-model="listQuery.periodCode1" :editable="false" type="month" placeholder="开始月份" size="small" value-format="yyyy-MM" />
            <span class="zhi">至</span>
            <el-date-picker v-model="listQuery.periodCode2" :editable="false" type="month" placeholder="结束月份" size="small" value-format="yyyy-MM" />
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button size="small" type="primary" @click="downloadModel">下载模板</el-button>
            <el-button size="small" type="primary" @click="handImport">导入</el-button>
        </div>
        <input ref="uploadFile" enctype="multipart/form-data" style="display:none" type="file" @change="importFile($event)">
        <div class="contentDiv">
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="会计期间" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.periodCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建/修改时间" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.updateDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否导入" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.importFlag==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="handleDetail(row)">查看明细</el-button>
                        <el-button size="text" type="primary" @click="copyPay(row)">复制</el-button>
                        <el-button size="text" type="primary" @click="exportBook(row)">导出</el-button>
                        <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        </div>
        <el-dialog title="复制薪酬" :visible.sync="dialogVisible1" width="460px">
            <el-form ref="dataForm" :model="copyForm" label-position="left" label-width="72px" style="margin-left:10px;width:400px">
                <el-form-item label="目标月份">
                    <el-date-picker v-model="copyForm.periodCode" :editable="false" type="month" placeholder="月份" style="width:200px" value-format="yyyy-MM" />
                </el-form-item>
                <el-form-item label="是否覆盖">
                    <el-radio v-model="copyForm.isCover" :label="1">是</el-radio>
                    <el-radio v-model="copyForm.isCover" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogVisible1 = false">取消</el-button>
                <el-button type="primary" @click="handleSave()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="薪酬导入" :visible.sync="dialogVisible2" width="460px">
            <el-form ref="importForm" :model="importForm" label-position="left" label-width="80px" style="margin-left:10px;width:400px">
                <el-form-item label="选择月份" prop="periodCode">
                    <el-date-picker v-model="importForm.periodCode" :editable="false" type="month" placeholder="选择月份" style="width:100%" value-format="yyyy-MM" />
                </el-form-item>
                <el-form-item label="选择文件" prop="fileName" :rules="fileRule">
                    <input ref="uploadFile" enctype="multipart/form-data" type="file" @change="importFile($event)">
                </el-form-item>
                <p style="margin-top:28px;color:#f00;">注：覆盖本期已存在的员工薪酬数据</p>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogVisible2 = false">取消</el-button>
                <el-button type="primary" @click="handleImport()">上传并导入</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getSalaryHeader, delPayData, getNationalityType, getCertificateType, saveEmployee, paydetailImport, exportSalary, copySalary } from '@/api/hr'
import { getDept } from '@/api/basedata'
import { debounce, getNowMonth, getNowDate } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
    name: 'salary',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: null,
            total: 0,
            listLoading: true,
            downloadModel: debounce(this.downloadFile, 1000, true),
            fileRule: [{ required: true, message: '请选择要导入的文件！', trigger: 'change' }],
            listQuery: {
                periodCode1: getNowMonth(),
                periodCode2: getNowMonth(),
                page: 1,
                limit: 20
            },
            importForm: {
              fileName: '',
              periodCode: getNowMonth()
            },
            copyForm: {
                headerId: '',
                periodCode: '',
                isCover: 1
            },
            dialogVisible1: false,
            dialogVisible2: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSalaryHeader(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        copyPay(row) {
            this.copyForm.headerId = row.id
            this.dialogVisible1 = true
        },
        handleSave() {
            copySalary(this.copyForm).then(res => {
                if (res.errorCode == 0) {
                    this.$message.success('复制成功')
                    this.dialogVisible2 = false
                    this.getList()
                }
            })
        },
        handleDetail(row) {
            this.$router.push('/hr/salarydetail?id=' + row.id + '&pericode=' + row.periodCode)
        },
        downloadFile() {
            window.location.href = '/drp/business/salary.xlsx'
        },
        handImport() {
            this.dialogVisible2 = true
        },
        importFile(event) {
            this.formData = new FormData()
            var fileObj = event.currentTarget.files[0]
            if (fileObj == null || fileObj == undefined) { return }
            this.formData.append('file', fileObj)
            this.formData.append('fileName', 'salary.xlsx')
            this.formData.append('periodCode', this.importForm.periodCode)
        },
        exportBook(row) {
            const obj = { periodCode: row.periodCode, headerId: row.id }
            exportSalary(obj)
        },
        handleImport() {
            this.$refs.importForm.validate(valid => {
                if (valid) {
                    const obj = this.formData
                    this.$axios({
                        url: '/drp/hr/salaryDetail/importData',
                        method: 'POST',
                        data: obj,
                        timeout: 10000,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then(res => {
                        if (res.errorCode == 0) {
                            this.$message.success('导入成功')
                            this.dialogVisible2 = false
                            this.getList()
                        }
                    })
                } else {
                    return false
                }
            })
        },
        handleDel(id) {
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPayData(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList()
                        this.dialogFormVisible = false
                        this.$message.success('删除成功')
                    }
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.filter-item {
    position: relative;
}

/deep/.el-form-item {
    margin-bottom: 18px
}
</style>