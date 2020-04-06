<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.routeName" placeholder="线路名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.routeCode" placeholder="线路代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="线路代码">
        <template slot-scope="{row}">
          <span>{{row.routeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="线路名称">
        <template slot-scope="{row}">
          <span>{{row.routeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="350">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleAssign1(row)">分配用户</el-button>
          <el-button type="primary" size="mini" @click="handleAssign2(row)">分配客户</el-button>
          <el-button type="default" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增线路':'修改线路'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 300px; margin-left:50px;">
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

    <el-dialog :close-on-click-modal="false" title="分配业务员" :visible.sync="dialogFormVisible1" :show-close="false" ::close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 460px;">
        <div class="curTit">当前线路：{{handleObj.routeName}}({{handleObj.routeCode}})</div>
        <el-table ref="checkTable" :data="userList" border fit highlight-current-row style="width: 100%;" size="mini" @select-change="handleSelectionChange" @select-all="selectAll">
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
        <el-button @click="cancelHanle1()">取消</el-button>
        <el-button type="primary" @click="updateRoute1()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="分配客户" :visible.sync="dialogFormVisible2" :show-close="false" ::close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 460px;">
        <div class="curTit">当前线路：{{handleObj.routeName}}({{handleObj.routeCode}})</div>
        <el-table ref="checkTable1" :data="custList" border fit highlight-current-row style="width: 100%;" size="mini" @select="handleSelectionChange1" @select-all="selectAll1">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="客户代码">
            <template slot-scope="{row}">
              <span>{{row.custCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户姓名">
            <template slot-scope="{row}">
              <span>{{row.custName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancelHanle2()">取消</el-button>
        <el-button type="primary" @click="updateRoute2()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getRoute,saveRoute,delRoute,updateRouteDisabled,getUserListByRouteId,updateRouteIdByUserIdList,getUserList,getCustListByRouteId,updateRouteIdByCustIdList } from '@/api/basedata'
import { getCust } from '@/api/basedata'
import { getStrByData } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseRoute',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      userList:[],
      handleObj:{},
      custList:[],
      selectIdArr:[],
      selectIdArr1:[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        routeName: '',
        routeCode: ''
      },
      showReviewer: false,
      temp: {
        routeName: '',
        routeCode: '',
        remarks:'',
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
      this.userList = resp.data.data;
    });
    getCust({}).then(resp => {
      this.custList = resp.data.data;
    });
  },
  methods: {
    cancelHanle1(){
      this.dialogFormVisible1 = false;
      this.$refs.checkTable.clearSelection()
    },
    cancelHanle2(){
      this.dialogFormVisible2 = false;
      this.$refs.checkTable1.clearSelection()
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
    selectAll1(selection){
      var arr = [];
      for(var i=0;i<selection.length;i++){
        arr.push(selection[i].id)
      }
      this.selectIdArr1 = arr;
    },
    handleSelectionChange1(selection,row) {
      var arr = [];
      for (var i = 0; i < selection.length; i++) {
          arr.push(selection[i].id)
      }
      this.selectIdArr1 = arr;
    },
    handleAssign1(row){
      this.dialogFormVisible1 = true
      this.handleObj = row;
      getUserListByRouteId({ routeId: row.id }).then(res => {
        this.selectIdArr = getStrByData(res.data);
        var selectIds = this.selectIdArr.join(',');
        this.userList.forEach(row => {
          if(selectIds.indexOf(row.id) >= 0){
            this.$refs.checkTable.toggleRowSelection(row,true);
          }
        })
      })
    },
    handleAssign2(row){
      this.dialogFormVisible2 = true
      this.handleObj = row;
      getCustListByRouteId({ routeId: row.id }).then(res => {
        this.selectIdArr1 = getStrByData(res.data);
        var selectIds = this.selectIdArr1.join(',');
        this.custList.forEach(row => {
          if(selectIds.indexOf(row.id) >= 0){
            this.$refs.checkTable1.toggleRowSelection(row,true);
          }
        })
      })
    },
    updateRoute1(){
      var obj = {
        routeId:this.handleObj.id,
        userIdList:this.selectIdArr
      }
      updateRouteIdByUserIdList(obj).then(res => {
        if(res.data.errorCode==0){
          this.cancelHanle1();
          this.$message.success('分配用户成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    updateRoute2(){
      var obj = {
        routeId:this.handleObj.id,
        custIdList:this.selectIdArr1
      }
      updateRouteIdByCustIdList(obj).then(res => {
        if(res.data.errorCode==0){
          this.cancelHanle2();
          this.$message.success('分配客户成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      getRoute(this.listQuery).then(response => {
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
      this.temp.routeName = ''
      this.temp.routeCode = ''
      this.temp.isDisable = 0
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.routeName = obj.routeName
      this.temp.routeCode = obj.routeCode
      this.temp.isDisable = obj.isDisable
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
      updateRouteDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
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
          saveRoute(this.temp).then(res => {
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
          saveRoute(this.temp).then(res => {
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
      delRoute(id).then(res => {
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