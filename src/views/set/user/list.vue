<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="序号" type="index" width="50" align="center">
            </el-table-column>
            <el-table-column label="企业代码">
                <template slot-scope="{row}">
                    <span>{{ row.orgCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户账号">
                <template slot-scope="{row}">
                    <span>{{ row.userAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户姓名">
                <template slot-scope="{row}">
                    <span>{{ row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="管理员" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.isAdmin==1?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status==0?"正常":(row.status==5?'受限':'其它') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="440">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleAssign(row,1)">分配仓库</el-button>
                    <el-button type="default" size="mini" @click="handleAssign(row,2)">分配车辆</el-button>
                    <el-button type="primary" size="mini" @click="handleAssign(row,3)">分配线路</el-button>
                    <el-button type="default" size="mini" @click="handleAssign(row,4)">分配品牌</el-button>
                    <el-button type="info" size="mini" @click="handleCompile(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增用户':'修改用户'" :visible.sync="dialogFormVisible" width="680px">
            <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="100px" style="width: 610px; margin-left:30px;">
                <el-form-item label="用户账号" prop="userAccount">
                    <el-input v-model="temp.userAccount" placeholder="用户账号" />
                </el-form-item>
                <el-form-item label="用户姓名" prop="userName">
                    <el-input v-model="temp.userName" placeholder="用户姓名" />
                </el-form-item>
                <el-form-item label="审核人签名" prop="sign2">
                    <el-input v-model="temp.sign2" placeholder="审核人签名" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="temp.mobile" placeholder="手机号" />
                </el-form-item>
                <el-form-item label="邮箱" prop="mail">
                    <el-input v-model="temp.mail" placeholder="邮箱" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-show="dialogStatus=='create'">
                    <el-input v-model="temp.password" placeholder="密码" />
                </el-form-item>
                <el-form-item label="确认密码" prop="againPassword" v-show="dialogStatus=='create'">
                    <el-input v-model="temp.againPassword" placeholder="确认密码" />
                </el-form-item>
                <el-form-item label="管理员" prop="isAdmin">
                    <el-radio v-model="temp.isAdmin" :label="1">是</el-radio>
                    <el-radio v-model="temp.isAdmin" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="temp.roleId" style="width:185px" class="filter-item">
                        <el-option label="审核会计" value="888888"></el-option>
                        <el-option label="制单会计" value="888887"></el-option>
                        <el-option label="企业出纳" value="888889"></el-option>
                        <el-option label="企业老板" value="888890"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="temp.status" style="width:185px" class="filter-item">
                        <el-option label="正常" :value="0"></el-option>
                        <el-option label="受限" :value="5"></el-option>
                        <el-option label="禁用" :value="9"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :title="'分配'+dialogTit" :visible.sync="dialogFormVisible1" :show-close="false" ::close-on-click-modal="false" width="500px">
            <el-form ref="dataForm" style="width: 460px;">
                <el-table ref="checkTable" :data="dataList" border fit highlight-current-row style="width: 100%;" size="mini" @selection-change="handleSelectionChange" @select-all="selectAll">
                    <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
                    <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                    <el-table-column :label="dialogTit+'代码'">
                        <template slot-scope="{row}">
                            <span>{{row[dialogType+'Code']}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="dialogTit+'名称'">
                        <template slot-scope="{row}">
                            <span>{{row[dialogType+'Name']}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="cancelHanle()">取消</el-button>
                <el-button type="primary" @click="updateAssign()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getUserList, saveUser, delUser } from '@/api/user'
import { getWarehouse,getTruck,getRoute,getBrand } from '@/api/basedata'
import { getWarehouseListByUserId, updateUserIdByWarehouseIdList, getTruckListByUserId, updateUserIdByTruckIdList } from '@/api/basedata'
import { getRouteListByUserId, updateUserIdByRouteIdList, getBrandListByUserId, updateUserIdByBrandIdList } from '@/api/basedata'
import { getStrByData } from '@/utils'

export default {
    name: 'userList',
    data() {
        return {
            tableKey: 0,
            tableData: [],
            dialogTit: '',
            dialogType:'',
            dataList: [],
            assignType: 0,
            handleObj: {},
            selectIdArr: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                UserName: '',
                UserCode: ''
            },
            temp: {
                againPassword: "",
                auditLevel1: "",
                auditLevel2: "",
                id: "",
                mail: "",
                mobile: "",
                orgType: "",
                password: "",
                roleId: "888888",
                sign2: "",
                status: 0,
                userAccount: "",
                userName: "",
                isAdmin: 0
            },
            resetTemp: {
                againPassword: "",
                auditLevel1: "",
                auditLevel2: "",
                id: "",
                mail: "",
                mobile: "",
                orgType: "",
                password: "",
                roleId: "888888",
                sign2: "",
                status: 0,
                userAccount: "",
                userName: "",
                isAdmin: 0
            },
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogStatus: '',
            rules: {
                userName: [{ required: true, message: '用户姓名不能为空', trigger: 'change' }],
                password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
                mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
                mail: [{ required: true, message: '邮箱不能为空', trigger: 'change' }],
                userAccount: [{ required: true, message: '用户账号不能为空', trigger: 'change' }],
                sign2: [{ required: true, message: '审核人签名不能为空', trigger: 'change' }],
                againPassword: [{ required: true, message: '确认密码不能为空', trigger: 'change' }],
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        cancelHanle() {
            this.dialogFormVisible1 = false;
            this.$refs.checkTable.clearSelection()
        },
        selectAll(selection) {
            var arr = [];
            for (var i = 0; i < selection.length; i++) {
                arr.push(selection[i].id)
            }
            this.selectIdArr = arr;
        },
        handleSelectionChange(selection) {
            var arr = [];
            for (var i = 0; i < selection.length; i++) {
                arr.push(selection[i].id)
            }
            this.selectIdArr = arr;
        },
        handleAssign(row, index) {
            this.dialogFormVisible1 = true
            this.assignType = index
            this.handleObj = row;
            if (index == 1) {
                this.dialogTit = '仓库'
                this.dialogType = 'warehouse'
                getWarehouse().then(resp => {
                    this.dataList = resp.data.data;
                    getWarehouseListByUserId({ userId: row.id }).then(res => {
                      this.selectIdArr = getStrByData(res.data);
                      var selectIds = this.selectIdArr.join(',')
                      this.dataList.forEach(row => {
                        if(selectIds.indexOf(row.id) >= 0){
                          this.$refs.checkTable.toggleRowSelection(row,true);
                        }
                      })
                    })
                })
            }
            if (index == 2) {
                this.dialogTit = '车辆'
                this.dialogType = 'truck'
                getTruck().then(resp => {
                    this.dataList = resp.data.data;
                    getTruckListByUserId({ userId: row.id }).then(res => {
                      this.selectIdArr = getStrByData(res.data);
                      var selectIds = this.selectIdArr.join(',')
                      this.dataList.forEach(row => {
                        if(selectIds.indexOf(row.id) >= 0){
                          this.$refs.checkTable.toggleRowSelection(row,true);
                        }
                      })
                    })
                })
            }
            if (index == 3) {
                this.dialogTit = '线路'
                this.dialogType = 'route'
                getRoute().then(resp => {
                    this.dataList = resp.data.data;
                    getRouteListByUserId({ userId: row.id }).then(res => {
                      this.selectIdArr = getStrByData(res.data);
                      var selectIds = this.selectIdArr.join(',')
                      this.dataList.forEach(row => {
                        if(selectIds.indexOf(row.id) >= 0){
                          this.$refs.checkTable.toggleRowSelection(row,true);
                        }
                      })
                    })
                })
            }
            if (index == 4) {
                this.dialogTit = '品牌'
                this.dialogType = 'brand'
                getBrand().then(resp => {
                    this.dataList = resp.data.data;
                    getBrandListByUserId({ userId: row.id }).then(res => {
                      this.selectIdArr = getStrByData(res.data);
                      var selectIds = this.selectIdArr.join(',')
                      this.dataList.forEach(row => {
                        if(selectIds.indexOf(row.id) >= 0){
                          this.$refs.checkTable.toggleRowSelection(row,true);
                        }
                      })
                    })
                })
            }
        },
        updateAssign() {
            if (this.assignType == 1) {
                this.updateAssign1();
            }
            if (this.assignType == 2) {
                this.updateAssign2();
            }
            if (this.assignType == 3) {
                this.updateAssign3();
            }
            if (this.assignType == 4) {
                this.updateAssign4();
            }
        },
        updateAssign1() {
            var obj = { userId: this.handleObj.id, warehouseIdList: this.selectIdArr }
            updateUserIdByWarehouseIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.cancelHanle();
                    this.$message.success('分配仓库成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        updateAssign2() {
            var obj = { userId: this.handleObj.id, truckIdList: this.selectIdArr }
            updateUserIdByTruckIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.cancelHanle();
                    this.$message.success('分配车辆成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        updateAssign3() {
            var obj = { userId: this.handleObj.id, routeIdList: this.selectIdArr }
            updateUserIdByRouteIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.cancelHanle();
                    this.$message.success('分配线路成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        updateAssign4() {
            var obj = { userId: this.handleObj.id, brandIdList: this.selectIdArr }
            updateUserIdByBrandIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.cancelHanle();
                    this.$message.success('分配品牌成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getList() {
            this.listLoading = true
            getUserList().then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            })
        },
        handleAdd(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            for (var key in this.temp) {
                this.temp[key] = this.resetTemp[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            for (var key in this.temp) {
                this.temp[key] = obj[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleModify() {
            this.temp.auditLevel1 = '1'
            this.temp.auditLevel2 = '1'
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveUser(this.temp).then(res => {
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
            this.temp.auditLevel1 = '1'
            this.temp.auditLevel2 = '1'
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveUser(this.temp).then(res => {
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
        handleDel(id){
          this.$confirm('确定删除该用户？', '提示', {
            confirmButtonText: '确定',
            closeOnClickModal:false,
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delUser({id:id}).then(res => {
                if(res.data.errorCode == 0 ) {
                    this.$message.success('删除用户成功！')
                } else {
                    this.$message.warning(res.data.message)
                }
            })
          })
        }
    }
}
</script>