<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input size="small" v-model="listQuery.catogeryName" placeholder="凭证字代码/名称" style="width: 200px;" class="filter-item" />
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="凭证字名称">
                <template slot-scope="{row}">
                    <span>{{row.catogeryName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="顺序号">
                <template slot-scope="{row}">
                    <span>{{row.seq}}</span>
                </template>
            </el-table-column>
            <el-table-column label="打印标题">
                <template slot-scope="{row}">
                    <span>{{row.printTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否默认" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDefault==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可用" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDisable==0?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
                    <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增凭证字':'修改凭证字'" :visible.sync="dialogFormVisible" width="460px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="96px" style="width: 400px; margin-left:10px;">
                <el-form-item label="凭证字名称" prop="catogeryName">
                    <el-input v-model="temp.catogeryName" placeholder="凭证字名称" />
                </el-form-item>
                <el-form-item label="顺序号" prop="seq">
                    <el-input v-model="temp.seq" placeholder="顺序号" />
                </el-form-item>
                <el-form-item label="打印标题" prop="printTitle">
                    <el-input v-model="temp.printTitle" placeholder="打印标题" />
                </el-form-item>
                <el-form-item label="是否默认" prop="isDefault">
                    <el-radio v-model="temp.isDefault" label="1">是</el-radio>
                    <el-radio v-model="temp.isDefault" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="是否可用" prop="isDisable">
                    <el-radio v-model="temp.isDisable" label="0">是</el-radio>
                    <el-radio v-model="temp.isDisable" label="1">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getCatogery, saveCatogery, delCatogery, updateCatogeryDisabled } from '@/api/basedata'
import Pagination from '@/components/Pagination'
export default {
    name: 'baseCatogery',
    components: { Pagination },
    data() {
        const validateNum = (rule, value, callback) => {
            var reg = /^[1-9]\d*$/
            if (value == '') {
                callback(new Error('顺序号不能为空'))
            } else if (!reg.test(value)) {
                callback(new Error('顺序号必须是整数'))
            } else {
                callback()
            }
        }
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                seq: '',
                catogeryName: ''
            },
            temp: {
                catogeryName: '',
                seq: '',
                printTitle: '',
                isDefault: '0',
                isDisable: '0'
            },
            dialogFormVisible: false,
            dialogStatus: '',
            rules: {
                catogeryName: [{ required: true, message: '凭证字名称不能为空', trigger: 'change' }],
                seq: [{ required: true, trigger: 'change', validator: validateNum }],
                printTitle: [{ required: true, message: '打印标题不能为空', trigger: 'change' }],
                isDisable: [{ required: false }],
                isDefault: [{ required: false }]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getCatogery(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleAdd(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.temp.id = ''
            this.temp.catogeryName = ''
            this.temp.catogeryCode = ''
            this.temp.printTitle = ''
            this.temp.isDisable = '0'
            this.temp.isDefault = '0'
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.temp.id = obj.id
            this.temp.catogeryName = obj.catogeryName
            this.temp.seq = obj.seq
            this.temp.catogeryCode = obj.catogeryCode
            this.temp.printTitle = obj.printTitle
            this.temp.isDisable = String(obj.isDisable)
            this.temp.isDefault = String(obj.isDefault)
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleDel(id) {
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id)
            });
        },
        updateStatus(data) {
            this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.changeAvaiable(data);
            });
        },
        changeAvaiable(data) {
            var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
            updateCatogeryDisabled(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList()
                    this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleModify() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveCatogery(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('修改成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        handleCreate() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveCatogery(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('新增成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        delItem(id) {
            delCatogery(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.dialogFormVisible = false
                    this.$message.success('删除成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>