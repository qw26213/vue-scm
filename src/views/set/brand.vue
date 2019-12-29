<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.brandName" placeholder="品牌名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.brandCode" placeholder="品牌代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="品牌代码">
        <template slot-scope="{row}">
          <span>{{row.brandCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名称">
        <template slot-scope="{row}">
          <span>{{row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="280">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleAssign(row)">分配用户</el-button>
          <el-button type="default" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增品牌':'修改品牌'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 300px; margin-left:50px;">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="temp.brandName" placeholder="品牌名称" />
        </el-form-item>
        <el-form-item label="品牌代码" prop="brandCode">
          <el-input v-model="temp.brandCode" placeholder="品牌代码" />
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
        <div class="curTit">当前品牌：{{handleObj.brandName}}({{handleObj.brandCode}})</div>
        <el-table ref="checkTable" :data="userList" border fit highlight-current-row style="width: 100%;" size="mini" @select="handleSelectionChange" @select-all="selectAll">
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
        <el-button type="primary" @click="updateRoute()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getBrand,saveBrand,delBrand,updateBrandDisabled,getUserListByBrandId,updateBrandIdByUserIdList,getUserList} from '@/api/basedata'
import { getStrByData } from '@/utils'
export default {
  name: 'baseBrand',
  data() {
    return {
      tableKey: 0,
      tableData: [],
      userList:[],
      handleObj:{},
      selectIdArr:[],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        brandCode: '',
        brandName: ''
      },
      temp: {
        brandName: '',
        brandCode: '',
        remarks:'',
        isDisable: "0"
      },
      dialogFormVisible1: false,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        brandName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        brandCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        isDisable:[{required:false}]
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
    handleSelectionChange(selection,row) {
      var arr = [];
      for (var i = 0; i < selection.length; i++) {
          arr.push(selection[i].id)
      }
      this.selectIdArr = arr;
    },
    handleAssign(row){
      this.dialogFormVisible1 = true
      this.handleObj = row;
      getUserListByBrandId({ brandId: row.id }).then(res => {
        this.selectIdArr = getStrByData(res.data);
        var selectIds = this.selectIdArr.join(',');
        this.userList.forEach(row => {
          if(selectIds.indexOf(row.id) >= 0){
            this.$refs.checkTable.toggleRowSelection(row,true);
          }
        })
      })
    },
    updateRoute(){
      var obj = {
        brandId:this.handleObj.id,
        userIdList:this.selectIdArr
      }
      updateBrandIdByUserIdList(obj).then(res => {
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
      getBrand(this.listQuery).then(response => {
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
      this.temp.brandName = ''
      this.temp.brandCode = ''
      this.temp.parentCode = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.brandName = obj.brandName
      this.temp.brandCode = obj.brandCode
      this.temp.parentCode = obj.parentCode
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
      updateBrandDisabled(obj).then(res => {
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
          saveBrand(this.temp).then(res => {
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
          saveBrand(this.temp).then(res => {
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
      delBrand(id).then(res => {
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