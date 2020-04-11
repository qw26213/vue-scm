<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="角色代码">
                <template slot-scope="{row}">
                    <span>{{row.roleCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="角色名称">
                <template slot-scope="{row}">
                    <span>{{row.roleName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="系统角色" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isSystem==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDisable==1?'否':'是'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="showFunc(row.id)">查看权限</el-button>
                    <el-button type="default" size="mini" :disabled="row.isSystem==1" @click="handleCompile(row)">编辑</el-button>
                    <el-button type="danger" size="mini" :disabled="row.isSystem==1" @click="handleDel(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增角色':'修改角色'" :visible.sync="dialogFormVisible1" width="500px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 300px; margin-left:50px;">
                <el-form-item label="角色代码" prop="roleCode">
                    <el-input v-model="temp.roleCode" placeholder="角色代码" />
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="temp.roleName" placeholder="角色名称" />
                </el-form-item>
                <el-form-item label="是否启用" prop="isDisable">
                    <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
                    <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible1 = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="" :visible.sync="dialogFormVisible2" width="500px">
            <el-table ref="dataForm" :data="funcList" border fit highlight-current-row size="mini">
                <el-table-column label="权限代码">
                    <template slot-scope="{row}">
                        <span>{{ row.funcCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="权限名称">
                    <template slot-scope="{row}">
                        <span>{{ row.funcName }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { getRole, saveRole, delRole, getFuncByRoleId} from '@/api/user'
export default {
    name: 'userRole',
    data() {
        return {
            tableKey: 0,
            tableData: [],
            funcList: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                roleName: '',
                roleCode: ''
            },
            temp: {
                roleName: '',
                roleCode: '',
                isDisable: 0
            },
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogStatus: '',
            rules: {
                roleName: [{ required: true, message: '角色名称不能为空', trigger: 'change' }],
                roleCode: [{ required: true, message: '角色代码不能为空', trigger: 'change' }],
                isDisable: [{ required: false }]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getRole(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        showFunc(id) {
          getFuncByRoleId({roleId: id}).then(res => {
            this.funcList = res.data
          })
        },
        handleAdd(obj) {
            this.dialogFormVisible1 = true
            this.dialogStatus = 'create'
            this.temp.id = ''
            this.temp.roleName = ''
            this.temp.roleCode = ''
            this.temp.isDisable = 0
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible1 = true
            this.dialogStatus = 'update'
            this.temp.id = obj.id
            this.temp.roleName = obj.roleName
            this.temp.roleCode = obj.roleCode
            this.temp.isDisable = obj.isDisable
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleDel(id) {
            this.$confirm('确定删除该角色？', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delRole({id:id}).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getList();
                        this.$message.success('删除角色成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        save() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveRole(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible1 = false
                            this.$message.success(this.dialogStatus == 'create' ? '新增成功' : '修改成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        }
    }
}
</script>