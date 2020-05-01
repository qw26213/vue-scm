<template>
    <div class="app-container">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
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
            <el-table-column label="列查询权限" align="center" min-width="90">
                <template slot-scope="{row}">
                    <span>{{ row.queryType==1?'有':'无' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status==0?"正常":(row.status==5?'受限':'其它') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="580">
                <template slot-scope="{row}">
                    <el-button type="text" size="mini" @click="handleAssCust(row)">分配客户</el-button>
                    <el-button type="text" size="mini" @click="handleAssign(row,1)">分配仓库</el-button>
                    <el-button type="text" size="mini" @click="handleAssign(row,2)">分配车辆</el-button>
                    <el-button type="text" size="mini" @click="handleAssign(row,3)">分配线路</el-button>
                    <el-button type="text" size="mini" @click="handleAssign(row,4)">分配品牌</el-button>
                    <el-button type="text" size="mini" @click="handleAssItem(row,5)">分配商品</el-button>
                    <el-button type="text" size="mini" @click="handleAssign(row,6)">分配角色</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="'分配'+dialogTit" :visible.sync="dialogFormVisible" :show-close="false" ::close-on-click-modal="false" width="500px">
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
        <assignCust ref="custTable" :tit="handleObj.userName + handleObj.userAccount" type="user" :showModal.sync="showModal" :handleObj="handleObj" @handleAssign="handleAssignCust">
        </assignCust>
        <assignItem ref="itemTable" :tit="handleObj.userName + handleObj.userAccount" type="user" :openModal.sync="openModal" :handleObj="handleObj" @handleAssign="handleAssignItem">
        </assignItem>
    </div>
</template>
<script>
import { getUserList, saveUser, delUser, getRole } from '@/api/user'
import { getWarehouse,getTruck,getRoute,getBrand, getStaff } from '@/api/basedata'
import { getWarehouseListByUserId, updateUserIdByWarehouseIdList, getTruckListByUserId, updateUserIdByTruckIdList } from '@/api/basedata'
import { getRouteListByUserId, updateUserIdByRouteIdList, getBrandListByUserId, updateUserIdByBrandIdList } from '@/api/basedata'
import { updateUserIdByCustIdList, updateUserIdByItemIdList, updateUserIdByRoleIdList, getRoleListByUserId } from '@/api/basedata'
import { getStrByData } from '@/utils'
import assignCust from '@/components/assignCust'
import assignItem from '@/components/assignItem'
export default {
    name: 'userList',
    components: { assignCust, assignItem },
    data() {
        return {
            assignTypeArr: ['客户', '仓库', '车辆', '线路', '品牌', '商品', '角色'],
            dialogTypeArr: ['cust', 'warehouse', 'truck', 'route', 'brand', 'item', 'role'],
            tableKey: 0,
            tableData: [],
            staffList: [],
            dialogTit: '',
            showModal: false,
            openModal: false,
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
            dialogFormVisible: false,
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
        getStaff().then(res => {
            this.staffList = res.data.data
        })
    },
    methods: {
        handleAssCust(row) {
            this.handleObj = row
            this.showModal = true
        },
        handleAssItem(row) {
            this.handleObj = row
            this.openModal = true
        },
        cancelHanle() {
            this.dialogFormVisible = false;
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
            this.dialogFormVisible = true
            this.assignType = index
            this.handleObj = row
            this.dialogTit = this.assignTypeArr[index]
            this.dialogType = this.dialogTypeArr[index]
            if (index == 1) {
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
            if (index == 6) {
                getRole().then(resp => {
                    this.dataList = resp.data.data;
                    getRoleListByUserId({ userId: row.id }).then(res => {
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
            if (this.assignType == 6) {
                this.updateAssign6();
            }
        },
        handleAssignCust(arr) {
            var obj = { userId: this.handleObj.id, userIdList: arr }
            updateUserIdByCustIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.$refs.custTable.closeModal()
                    this.$message.success('分配客户成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleAssignItem(arr) {
            var obj = { userId: this.handleObj.id, itemIdList: arr }
            updateUserIdByItemIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.$refs.itemTable.closeModal()
                    this.$message.success('分配商品成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
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
        updateAssign6() {
            var obj = { userId: this.handleObj.id, roleIdList: this.selectIdArr }
            updateUserIdByRoleIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.cancelHanle();
                    this.$message.success('分配角色成功')
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
        }
    }
}
</script>