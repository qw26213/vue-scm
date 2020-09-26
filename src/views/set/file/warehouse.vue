<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input size="small" v-model="listQuery.warehouseName" placeholder="仓库代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="仓库代码">
          <template slot-scope="{row}">
            <span>{{row.warehouseCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称">
          <template slot-scope="{row}">
            <span>{{row.warehouseName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人">
          <template slot-scope="{row}">
            <span>{{row.manager}}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话">
          <template slot-scope="{row}">
            <span>{{row.tel}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否主仓库" align="center">
          <template slot-scope="{row}">
            <span>{{row.isMain==1?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否虚拟仓库" align="center">
          <template slot-scope="{row}">
            <span>{{row.isVirtual==1?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="允许负库存" align="center">
          <template slot-scope="{row}">
            <span>{{row.isNegative==1 ? '允许' : '不允许'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否冷藏" align="center">
          <template slot-scope="{row}">
            <span>{{row.isRefrigerated==1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="{row}">
            <span>{{row.isDisable==0 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleAssign(row)">分配用户</el-button>
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button type="text" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增仓库':'修改仓库'" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="100px" style="width: 560px; margin-left:5px;">
        <el-form-item label="仓库代码" prop="warehouseCode">
          <el-input v-model="temp.warehouseCode" placeholder="仓库代码" />
        </el-form-item>
        <el-form-item label="是否主仓库" prop="isMain">
          <el-radio v-model="temp.isMain" label="1">是</el-radio>
          <el-radio v-model="temp.isMain" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="temp.warehouseName" placeholder="仓库名称" />
        </el-form-item>
        <el-form-item label="是否虚拟仓库" prop="isVirtual">
          <el-radio v-model="temp.isVirtual" label="1">是</el-radio>
          <el-radio v-model="temp.isVirtual" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="temp.manager" placeholder="负责人" />
        </el-form-item>
        <el-form-item label="允许负库存" prop="isNegative">
          <el-radio v-model="temp.isNegative" label="1">是</el-radio>
          <el-radio v-model="temp.isNegative" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="是否冷藏" prop="isRefrigerated">
          <el-radio v-model="temp.isRefrigerated" label="1">是</el-radio>
          <el-radio v-model="temp.isRefrigerated" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
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
    <el-dialog :close-on-click-modal="false" title="分配用户" :visible.sync="dialogFormVisible1" :show-close="false" ::close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 460px;">
        <div class="curTit">当前仓库：{{handleObj.warehouseName}}({{handleObj.warehouseCode}})</div>
        <el-table ref="checkTable" :data="userList" border fit highlight-current-row style="width: 100%;" size="small" @selection-change="handleSelectionChange" @select-all="selectAll">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="用户账号">
            <template slot-scope="{row}">
              <span>{{row.userAccount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户姓名">
            <template slot-scope="{row}">
              <span>{{row.userName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancelHanle()">取消</el-button>
        <el-button type="primary" @click="updateWarehouse()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getWarehouse,saveWarehouse,delWarehouse,updateWarehouseDisabled,getUserListByWarehouseId,updateWarehouseIdByUserIdList,getUserList } from '@/api/basedata'
import { getStrByData } from '@/utils'
export default {
  name: 'baseWarehouse',
  data() {
    return {
      tableKey: 0,
      handleObj:{},
      userList:[],
      selectIdArr:[],
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        warehouseName: ''
      },
      temp: {
        warehouseName: '',
        warehouseCode: '',
        manager:'',
        tel:'',
        isMain:'1',
        isVirtual:'0',
        isNegative:'1',
        isRefrigerated:'0',
        remarks:'',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      rules: {
        warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'change' }],
        warehouseCode: [{ required: true, message: '仓库代码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getUserList().then(resp => {
      this.userList = resp.data.data;
    });
  },
  methods: {
    cancelHanle(){
      this.dialogFormVisible1 = false;
      this.$refs.checkTable.clearSelection()
    },
    selectAll(selection){
      var arr = [];
      for(var i=0;i<selection.length;i++){
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
    handleAssign(row){
      this.dialogFormVisible1 = true
      this.handleObj = row;
      getUserListByWarehouseId({ warehouseId: row.id }).then(res => {
        this.selectIdArr = getStrByData(res.data.data)
        var selectIds = this.selectIdArr.join(',')
        this.userList.forEach(row => {
          if(selectIds.indexOf(row.id) >= 0){
            this.$refs.checkTable.toggleRowSelection(row,true)
          }
        })
      })
    },
    updateWarehouse(){
      var obj = {
        warehouseId:this.handleObj.id,
        userIdList:this.selectIdArr
      }
      updateWarehouseIdByUserIdList(obj).then(res => {
        if(res.data.errorCode==0){
          this.cancelHanle();
          this.$message.success('分配用户成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      getWarehouse(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.warehouseName = ''
      this.temp.warehouseCode = ''
      this.temp.isMain = '1'
      this.temp.isNegative = '1'
      this.temp.isVirtual = '0'
      this.temp.isRefrigerated = '0'
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.warehouseName = obj.warehouseName
      this.temp.warehouseCode = obj.warehouseCode
      this.temp.isMain = String(obj.isMain)
      this.temp.isNegative = String(obj.isNegative)
      this.temp.isVirtual = String(obj.isVirtual)
      this.temp.isRefrigerated = String(obj.isRefrigerated)
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data){
      var obj = {id:data.id,isDisable:data.isDisable==1?0:1}
      updateWarehouseDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('修改状态成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleDel(id){
      this.$confirm('你确认要删除吗?', '提示', {
        confirmButtonText: '确定',closeOnClickModal:false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      });
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveWarehouse(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveWarehouse(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    delItem(id) {
      delWarehouse(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
  .curTit{font-size: 14px;margin-bottom: 10px}
</style>