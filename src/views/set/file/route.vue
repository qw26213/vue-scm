<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input v-model="listQuery.routeName" size="small" placeholder="线路代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="线路代码">
          <template slot-scope="{row}">
            <span>{{ row.routeCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="线路名称">
          <template slot-scope="{row}">
            <span>{{ row.routeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="{row}">
            <span>{{ row.remarks }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isDisable==0?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleAssign1(row)">分配用户</el-button>
            <el-button type="text" size="small" @click="handleAssign2(row)">分配客户</el-button>
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增线路':'修改线路'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 440px; margin-left:10px;">
        <el-form-item label="线路代码" prop="routeCode">
          <el-input v-model="temp.routeCode" placeholder="线路代码" />
        </el-form-item>
        <el-form-item label="线路名称" prop="routeName">
          <el-input v-model="temp.routeName" placeholder="线路名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable">
          <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="分配用户" :visible.sync="dialogFormVisible1" :show-close="false" ::close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 460px;">
        <div class="curTit">当前线路：{{ handleObj.routeName }}({{ handleObj.routeCode }})</div>
        <el-table ref="checkTable" :data="userList" border fit highlight-current-row style="width: 100%;" size="small" @select-change="handleSelectionChange1" @select-all="selectAll1">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true" />
          <el-table-column label="序号" type="index" width="50" align="center" />
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
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancelHanle1()">取消</el-button>
        <el-button type="primary" @click="handleAssignUser()">确定</el-button>
      </div>
    </el-dialog>
    <assignCust ref="custTable" :tit="handleObj.routeName + handleObj.routeCode" :show-modal.sync="showModal" type="route" :handle-obj="handleObj" @handleAssign="handleAssignCust" />
  </div>
</template>
<script>
import { getRoute, saveRoute, delRoute, updateRouteDisabled, getUserListByRouteId, updateRouteIdByUserIdList, getUserList, updateRouteIdByCustIdList } from '@/api/basedata'
import { getCust } from '@/api/basedata'
import { getStrByData } from '@/utils'
import Pagination from '@/components/Pagination'
import assignCust from '@/components/assignCust'
export default {
  name: 'baseRoute',
  components: { Pagination, assignCust },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      showModal: false,
      userList: [],
      handleObj: {},
      selectIdArr1: [],
      selectIdArr2: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        routeName: '',
        routeCode: ''
      },
      showReviewer: false,
      temp: {
        id: '',
        routeName: '',
        remarks: '',
        isDisable: 0
      },
      resetTemp: {
        id: '',
        routeName: '',
        remarks: '',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      rules: {
        routeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        routeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getUserList().then(resp => {
      this.userList = resp.data.data
    })
  },
  methods: {
    cancelHanle1() {
      this.dialogFormVisible1 = false
      this.$refs.checkTable.clearSelection()
    },
    selectAll1(selection) {
      var arr = []
      for (var i = 0; i < selection.length; i++) {
        arr.push(selection[i].id)
      }
      this.selectIdArr1 = arr
    },
    handleSelectionChange1(selection) {
      var arr = []
      for (var i = 0; i < selection.length; i++) {
        arr.push(selection[i].id)
      }
      this.selectIdArr1 = arr
    },
    handleAssign1(row) {
      this.dialogFormVisible1 = true
      this.handleObj = row
      getUserListByRouteId({ routeId: row.id }).then(res => {
        this.selectIdArr1 = getStrByData(res.data.data)
        var selectIds = this.selectIdArr1.join(',')
        this.userList.forEach(row => {
          if (selectIds.indexOf(row.id) >= 0) {
            this.$refs.checkTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    handleAssign2(row) {
      this.showModal = true
      this.handleObj = row
    },
    handleAssignUser() {
      var obj = {
        routeId: this.handleObj.id,
        userIdList: this.selectIdArr1
      }
      updateRouteIdByUserIdList(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.cancelHanle1()
          this.$message.success('分配用户成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleAssignCust(arr) {
      var obj = {
        routeId: this.handleObj.id,
        custIdList: arr
      }
      updateRouteIdByCustIdList(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.$refs.custTable.closeModal()
          this.$message.success('分配客户成功')
        } else {
          this.$refs.custTable.closeModal()
          this.$message.warning(res.data.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      getRoute(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for (const key in this.temp) {
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (const key in this.temp) {
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data) {
      this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data)
      })
    },
    changeAvaiable(data) {
      var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
      updateRouteDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
        } else {
          this.$message.error(res.data.msg)
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
        this.delItem(id)
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveRoute(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
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
          saveRoute(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
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
      delRoute(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
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
<style scoped>
.curTit {
    font-size: 14px;
    margin-bottom: 10px
}
</style>
