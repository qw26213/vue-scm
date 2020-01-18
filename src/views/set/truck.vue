<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.truckName" placeholder="车辆名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.truckCode" placeholder="车辆代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="车辆代码">
        <template slot-scope="{row}">
          <span>{{row.truckCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆名称">
        <template slot-scope="{row}">
          <span>{{row.truckName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆品牌">
        <template slot-scope="{row}">
          <span>{{row.brand}}</span>
        </template>
      </el-table-column>
      <el-table-column label="车长">
        <template slot-scope="{row}">
          <span>{{row.truckLength}}</span>
        </template>
      </el-table-column>
      <el-table-column label="吨位">
        <template slot-scope="{row}">
          <span>{{row.truckTonnage}}</span>
        </template>
      </el-table-column>
      <el-table-column label="容积">
        <template slot-scope="{row}">
          <span>{{row.truckCapacity}}</span>
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
      <el-table-column label="是否可用" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleAssign(row)">分配用户</el-button>
          <el-button type="default" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增车辆':'修改车辆'" :visible.sync="dialogFormVisible" width="670px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="80px" style="width: 610px; margin-left:30px;">
        <el-form-item label="车辆代码" prop="truckCode">
          <el-input v-model="temp.truckCode" placeholder="车辆代码" />
        </el-form-item>
        <el-form-item label="车辆名称" prop="truckName">
          <el-input v-model="temp.truckName" placeholder="车辆名称" />
        </el-form-item>
        <el-form-item label="车辆品牌" prop="brand">
          <el-input v-model="temp.brand" placeholder="车辆品牌" />
        </el-form-item>
        <el-form-item label="车长" prop="truckLength">
          <el-input v-model="temp.truckLength" placeholder="车长" />
        </el-form-item>
        <el-form-item label="吨位" prop="truckTonnage">
          <el-input v-model="temp.truckTonnage" placeholder="吨位" />
        </el-form-item>
        <el-form-item label="容积" prop="truckCapacity">
          <el-input v-model="temp.truckCapacity" placeholder="容积" />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="temp.manager" placeholder="负责人" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" placeholder="电话" />
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
        <div class="curTit">当前车辆：{{handleObj.truckName}}({{handleObj.truckCode}})</div>
        <el-table ref="checkTable" :data="userList" border fit highlight-current-row style="width: 100%;" size="mini" @selection-change="handleSelectionChange" @select-all="selectAll">
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
        <el-button type="primary" @click="updateTruck()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTruck,saveTruck,delTruck,updateTrunkDisabled,updateTruckIdByCustIdList,getUserListByTruckId,updateTruckIdByUserIdList,getUserList } from '@/api/basedata'
import { getStrByData } from '@/utils'
export default {
  name: 'baseTruck',
  data() {
    return {
      tableKey: 0,
      userList:[],
      handleObj:{},
      selectIdArr:[],
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        truckCode: '',
        truckName: ''
      },
      temp: {
        id:'',
        truckName: '',
        truckCode: '',
        truckLength:'',
        truckTonnage:'',
        truckCapacity:'',
        remarks:'',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      rules: {
        truckName: [{ required: true, message: '车辆名称不能为空', trigger: 'change' }],
        truckCode: [{ required: true, message: '车辆代码不能为空', trigger: 'change' }],
        brand: [{ required: false, message: '车辆品牌不能为空', trigger: 'change' }],
        truckLength: [{ required: false, message: '车长不能为空', trigger: 'change' }],
        truckTonnage: [{ required: false, message: '吨位不能为空', trigger: 'change' }],
        truckCapacity: [{ required: false, message: '容积不能为空', trigger: 'change' }],
        manager: [{ required: false, message: '负责人不能为空', trigger: 'change' }],
        tel: [{ required: false, message: '电话不能为空', trigger: 'change' }]
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
      getUserListByTruckId({ truckId: row.id }).then(res => {
        this.selectIdArr = getStrByData(res.data);
        var selectIds = this.selectIdArr.join(',');
        this.userList.forEach(item => {
          if(selectIds.indexOf(item.id) >= 0){
            this.$refs.checkTable.toggleRowSelection(item,true);
          }
        })
      })
    },
    updateTruck(){
      var obj = {
        truckId:this.handleObj.id,
        userIdList:this.selectIdArr
      }
      updateTruckIdByUserIdList(obj).then(res => {
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
      getTruck(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for(var key in this.temp){
        this.temp[key] = ''
      }
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for(var key in this.temp){
        this.temp[key] = obj[key]
      }
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateStatus(data){
      this.$confirm('确定'+(data.isDisable==1?'解禁？':'禁用？'), '提示', {
        confirmButtonText: '确定',closeOnClickModal:false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data);
      });
    },
    changeAvaiable(data){
      var obj = {id:data.id,isDisable:data.isDisable==1?0:1}
      updateTrunkDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
        }else{
            this.$message.error(res.data.msg)
          }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDel(id){
      this.$confirm('确定删除？', '提示', {
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
          saveTruck(this.temp).then(res => {
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
          saveTruck(this.temp).then(res => {
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
      deltruck(id).then(res => {
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