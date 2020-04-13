<template>
<div class="main">
  <div class="leftTree">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
  </div>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input size="small" v-model="listQuery.channelTypeName" placeholder="渠道类型名称" style="width: 200px;" class="filter-item" /> -->
      <!-- <el-input size="small" v-model="listQuery.channelTypeCode" placeholder="门店号" style="width: 200px;" class="filter-item" /> -->
      <!-- <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button> -->
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" row-key="id">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="渠道类型代码">
        <template slot-scope="{row}">
          <span>{{row.channelTypeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道类型名称">
        <template slot-scope="{row}">
          <span>{{row.channelTypeName}}</span>
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
      <el-table-column label="操作" align="left" width="250">
        <template slot-scope="{row}">
          <el-button type="default" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
          <el-button type="primary" size="mini" v-if="row.leaf==1" @click="handleAssign(row)">分配客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增渠道类型':'修改渠道类型'" :visible.sync="dialogFormVisible" width="390px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 340px; margin-left:10px;">
        <el-form-item label="渠道类型代码" prop="channelTypeCode">
          <el-input v-model="temp.channelTypeCode" placeholder="代码" />
        </el-form-item>
        <el-form-item label="渠道类型名称" prop="channelTypeName">
          <el-input v-model="temp.channelTypeName" placeholder="名称" />
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
    <el-dialog :close-on-click-modal="false" title="分配客户" :visible.sync="dialogFormVisible1" ::close-on-click-modal="false" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 460px;">
        <div class="curTit">当前渠道类型：{{handleObj.channelTypeName}}({{handleObj.channelTypeCode}})</div>
        <el-table ref="checkTable" :data="custList" border fit style="width: 100%;" size="mini" @select="handleSelectionChange" @select-all="selectAll">
          <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="客户代码">
            <template slot-scope="{row}">
              <span>{{row.custCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户名称">
            <template slot-scope="{row}">
              <span>{{row.custName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="cancelHanle()">取消</el-button>
        <el-button type="primary" @click="updateCustType()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import { getChannelType,saveChannelType,delChannelType,getChannelTree,updateChannelTypeDisabled,updateChannelTypeIdByCustIdList,getCust,getCustListByChannelTypeId } from '@/api/basedata'
import { getStrByData } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseChannel',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      treeData:[],
      defaultProps: {
          children: 'children',
          label: 'channelTypeName'
      },
      custList:[],
      handleObj:{},
      selectIdArr:[],
      total: 0,
      listLoading: true,
      listQuery: {
        parentId:""
      },
      temp: {
        channelTypeName: '',
        channelTypeCode: '',
        remarks:'',
        isDisable: "0",
        parentId:""
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      rules: {
        channelTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        channelTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        parentCode: [{ required: true, message: '上级代码不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getList()
    this.getLeftTree();
    getCust({"page":1,"custCode":"","custName":""}).then(res => {
      this.custList = res.data.data;
    });
  },
  methods: {
    cancelHanle(){
      this.dialogFormVisible1 = false;
      this.$refs.checkTable.clearSelection()
    },
    handleNodeClick(e){
      this.listQuery.parentId = e.id;
      this.temp.parentId = e.id;
      this.getList();
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
      for(var i=0;i<selection.length;i++){
        arr.push(selection[i].id)
      }
      this.selectIdArr = arr;
    },
    handleAssign(row){
      this.dialogFormVisible1 = true
      this.handleObj = row;
      getCustListByChannelTypeId({ channelTypeId: row.id }).then(res => {
        this.selectIdArr = getStrByData(res.data.data);
        var selectIds = this.selectIdArr.join(',');
        this.custList.forEach(row => {
          if(selectIds.indexOf(row.id) >= 0){
            this.$refs.checkTable.toggleRowSelection(row,true);
          }
        })
      })
    },
    updateCustType(){
      var obj = {
        channelTypeId:this.handleObj.id,
        custIdList:this.selectIdArr
      }
      updateChannelTypeIdByCustIdList(obj).then(res => {
        if(res.data.errorCode==0){
          this.cancelHanle();
          this.getList()
          this.$message.success('分配客户成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    getLeftTree(){
      getChannelTree({parentId:'',includeRoot:1}).then(res => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      getChannelTree(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      })
    },
    handleAdd(obj) {
      if(this.listQuery.parentId==''){
        this.$message.error('请先选择一个上级渠道类型');return
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.channelTypeName = ''
      this.temp.channelTypeCode = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.channelTypeName = obj.channelTypeName
      this.temp.channelTypeCode = obj.channelTypeCode
      this.temp.parentId = obj.parentId
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      updateChannelTypeDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveChannelType(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.getLeftTree();
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            }else{
              this.$message.error(res.data.msg)
            }
          }).catch((err)=>{
            this.$message.error("系统错误");
          })
        }
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveChannelType(this.temp).then(res => {
            if(res.data.errorCode==0){
              this.getList();
              this.getLeftTree()
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            }else{
              this.$message.error(res.data.msg)
            }
          }).catch((err)=>{
            this.$message.error("系统错误");
          })
        }
      })
    },
    delItem(id) {
      delChannelType(id).then(res => {
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
.main {position: relative;width: 100%;height: 100%;padding: 0 10px;padding-left: 180px;}
.leftTree {width: 160px;height: 100%;background-color: #fff;position: absolute;top: 20px;left: 20px;border:1px #eee solid;}
.tableDiv {width: 100%;}
</style>