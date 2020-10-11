<template>
  <div class="main">
    <div class="leftTree">
      <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
    </div>
    <div class="app-container tableDiv">
      <div class="filterDiv">
        <el-input v-model="listQuery.staffName" size="small" placeholder="员工代码/名称" style="width: 200px;" class="filter-item" />
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="员工代码">
            <template slot-scope="{row}">
              <span>{{ row.staffCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="员工名称">
            <template slot-scope="{row}">
              <span>{{ row.staffName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="信用额度" align="right" min-width="100">
            <template slot-scope="{row}">
              <span>{{ row.creditLimit|Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已赊销金额" align="right" min-width="110">
            <template slot-scope="{row}">
              <span>{{ row.overdraftBalance|Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售改价" min-width="110" align="center">
            <template slot-scope="{row}">
              <span>{{ row.salePriceType == 1 ? '允许' : '不允许' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退货改价" min-width="110" align="center">
            <template slot-scope="{row}">
              <span>{{ row.returnPriceType == 1 ? '允许' : '不允许' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="{row}">
              <span>{{ row.remarks }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否可用" align="center" width="90">
            <template slot-scope="{row}">
              <span>{{ row.isDisable==0?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="handleUpdate1(row.creditLimit,row.id)">改信用额度</el-button>
              <el-button type="text" size="small" @click="handleUpdate2(row.overdraftBalance,row.id)">改已赊销金额</el-button>
              <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </div>
      <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增员工':'修改员工'" :visible.sync="dialogFormVisible" width="600px">
        <el-form ref="dataForm" :rules="rules" :model="temp" inline label-position="right" label-width="80px" style="width: 580px; margin-left:10px;">
          <el-form-item label="员工代码" prop="staffCode">
            <el-input v-model="temp.staffCode" placeholder="员工代码" />
          </el-form-item>
          <el-form-item label="员工名称" prop="staffName">
            <el-input v-model="temp.staffName" placeholder="员工名称" />
          </el-form-item>
          <el-form-item label="销售改价" prop="salePriceType">
            <el-radio v-model="temp.salePriceType" :label="1">允许</el-radio>
            <el-radio v-model="temp.salePriceType" :label="0">不允许</el-radio>
          </el-form-item>
          <el-form-item label="退货改价" prop="returnPriceType" style="margin-left:40px">
            <el-radio v-model="temp.returnPriceType" :label="1">允许</el-radio>
            <el-radio v-model="temp.returnPriceType" :label="0">不允许</el-radio>
          </el-form-item>
          <el-form-item label="品牌权限" prop="isBrand">
            <el-radio v-model="temp.isBrand" :label="0">控制</el-radio>
            <el-radio v-model="temp.isBrand" :label="1">不控制</el-radio>
          </el-form-item>
          <el-form-item label="仓库权限" prop="isWarehouse" style="margin-left:40px">
            <el-radio v-model="temp.isWarehouse" :label="0">控制</el-radio>
            <el-radio v-model="temp.isWarehouse" :label="1">不控制</el-radio>
          </el-form-item>
          <el-form-item label="车辆权限" prop="isTruck">
            <el-radio v-model="temp.isTruck" :label="0">控制</el-radio>
            <el-radio v-model="temp.isTruck" :label="1">不控制</el-radio>
          </el-form-item>
          <el-form-item label="商品权限" prop="isItem" style="margin-left:40px">
            <el-radio v-model="temp.isItem" :label="0">控制</el-radio>
            <el-radio v-model="temp.isItem" :label="1">不控制</el-radio>
          </el-form-item>
          <el-form-item label="线路权限" prop="isRoute">
            <el-radio v-model="temp.isRoute" :label="0">控制</el-radio>
            <el-radio v-model="temp.isRoute" :label="1">不控制</el-radio>
          </el-form-item>
          <el-form-item label="客户权限" prop="isCust" style="margin-left:40px">
            <el-radio v-model="temp.isCust" :label="0">控制</el-radio>
            <el-radio v-model="temp.isCust" :label="1">不控制</el-radio>
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
    </div>
  </div>
</template>
<script>
import { getStaff, saveStaff, delStaff, getDeptTree, updateStaffDisabled, updateCreditLimitById, updateOverdraftBalanceById, getAllByDeptId } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'BaseStaff',
  components: { Pagination },
  filters: {
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      tableData: [],
      deptId: '',
      curItemLeaf: '',
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        deptId: '',
        staffName: ''
      },
      showReviewer: false,
      temp: {
        id: '',
        staffName: '',
        remarks: '',
        staffCode: '',
        salePriceType: 0,
        returnPriceType: 0,
        isCust: 0,
        isRoute: 0,
        isTruck: 0,
        isItem: 0,
        isBrand: 0,
        isWarehouse: 0,
        isItem: 0,
        isDisable: 0
      },
      resetTemp: {
        id: '',
        staffName: '',
        remarks: '',
        staffCode: '',
        salePriceType: 0,
        returnPriceType: 0,
        isCust: 0,
        isRoute: 0,
        isTruck: 0,
        isItem: 0,
        isBrand: 0,
        isWarehouse: 0,
        isItem: 0,
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        staffName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        staffCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getTree()
    this.getList()
  },
  methods: {
    handleNodeClick(e) {
      this.deptId = e.id
      this.curItemLeaf = e.leaf
      this.getStaffData()
    },
    getStaffData(id) {
      this.listLoading = true
      getAllByDeptId(this.deptId).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      })
    },
    getTree() {
      getDeptTree({ parentId: '', includeRoot: 1 }).then(res => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      getStaff(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleUpdate1(val, id) {
      this.$prompt('请输入信用额度', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        inputValue: parseFloat(val).toFixed(2),
        closeOnClickModal: false,
        inputType: 'text',
        inputPattern: /^\d+$|^\d*\.\d*$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        this.updateValue1(id, value)
      })
    },
    handleUpdate2(val, id) {
      this.$prompt('请输入已赊销金额', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: parseFloat(val).toFixed(2),
        inputType: 'text',
        inputPattern: /^\d+$|^\d*\.\d*$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        this.updateValue2(id, value)
      })
    },
    updateValue1(id, value) {
      var obj = { id: id, creditLimit: value }
      updateCreditLimitById(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success('修改信用额度成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    updateValue2(id, value) {
      var obj = { id: id, overdraftBalance: value }
      updateOverdraftBalanceById(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success('修改已赊销金额成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleAdd() {
      if (this.curItemLeaf == 0) {
        this.$message.error('只有末级部门才能添加')
        return
      }
      if (this.deptId == '') {
        this.$message.error('请先选择一个上级部门')
        return
      }
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data) {
      this.$confirm('确定' + data.isDisable == 1 ? '解禁？' : '禁用？', '提示', {
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
      updateStaffDisabled(obj).then(res => {
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
          saveStaff(this.temp).then(res => {
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
          this.temp.deptId = this.deptId
          saveStaff(this.temp).then(res => {
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
      delStaff(id).then(res => {
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
.main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    padding-left: 180px;
}

.leftTree {
    width: 160px;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    border: 1px #eee solid;
}

.tableDiv {
    width: 100%;
}
</style>
