<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.queryParam.custName" placeholder="客户名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.queryParam.custCode" placeholder="客户代码" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
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
      <el-table-column label="助记码">
        <template slot-scope="{row}">
          <span>{{row.mnemonicCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称">
        <template slot-scope="{row}">
          <span>{{row.abbr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="{row}">
          <span>{{row.addr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template slot-scope="{row}">
          <span>{{row.contact}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="{row}">
          <span>{{row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信号">
        <template slot-scope="{row}">
          <span>{{row.wechat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预收余额" align="right" width="100">
        <template slot-scope="{row}">
          <span>{{row.advrBalance|Fixed}}</span>
        </template>
      </el-table-column>
      <el-table-column label="透支额度" align="right" width="100">
        <template slot-scope="{row}">
          <span>{{row.creditLimit|Fixed}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已透支金额" align="right" width="100">
        <template slot-scope="{row}">
          <span>{{row.overdraftBalance|Fixed}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280">
        <template slot-scope="{row}">
          <el-button type="default" size="mini" @click="handleUpdate(row.overdraftBalance,row.id)">改已透支额度</el-button>
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增客户':'修改客户'" :visible.sync="dialogFormVisible" width="660px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="110px" style="width: 630px; margin-left:10px;">
        <el-form-item label="客户代码" prop="custCode">
          <el-input v-model="temp.custCode" placeholder="客户代码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custName">
          <el-input v-model="temp.custName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="助记码" prop="mnemonicCode">
          <el-input v-model="temp.mnemonicCode" placeholder="助记码" disabled />
        </el-form-item>
        <el-form-item label="简称" prop="abbr">
          <el-input v-model="temp.abbr" placeholder="简称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="temp.contact" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="地址" />
        </el-form-item>
        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="temp.wechat" placeholder="微信号" />
        </el-form-item>
        <el-form-item label="透支额度" prop="creditLimit">
          <el-input v-model="temp.creditLimit" placeholder="透支额度" />
        </el-form-item>
        <el-form-item label="拜访周期(天)" prop="visitCycle">
          <el-input v-model="temp.visitCycle" placeholder="拜访周期" />
        </el-form-item>
        <el-form-item label="渠道类型" prop="bizTypeId">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" id="dropTit1">
                <el-input v-model="temp.channelTypeName" placeholder="渠道类型" />
              </span>
              <el-dropdown-menu slot="dropdown" :visible-change="menuVisible1">
                <div style="width:185px;height:260px">
                  <el-tree :data="treeData1" :props="defaultProps1" @node-click="handleNodeClick1" default-expand-all></el-tree>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
        </el-form-item>
        <el-form-item label="客户类别" prop="custTypeId">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" id="dropTit2">
                <el-input v-model="temp.custTypeName" placeholder="客户类别" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <div style="width:185px;height:260px">
                  <el-tree :data="treeData2" :props="defaultProps2" @node-click="handleNodeClick2" default-expand-all></el-tree>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="价格组" prop="priceGroupId">
          <el-select v-model="temp.priceGroupId" style="width:180px" class="filter-item">
            <el-option v-for="item in priceGroupList" :key="item.id" :label="item.priceGroupName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable" align="center" width="80">
          <el-radio v-model="temp.isDisable" label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" label="1">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getCust,saveCust,delCust,updateCustDisabled, updateOverdraftBalanceById1,getChannelTree,getCustTypeTree,getPriceGroup} from '@/api/basedata';
import Pagination from '@/components/Pagination';
export default {
  name: 'baseCust',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      treeData1:[],
      treeData2:[],
      priceGroupList:[],
      defaultProps1: {
          children: 'children',
          label: 'channelTypeName'
      },
      defaultProps2:{
          children: 'children',
          label: 'custTypeName'
      },
      menuVisible1:false,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam:{
          custCode: '',
          custName: ''
        }
      },
      temp: {
        custName: '',
        addr:'',
        custCode: '',
        creditLimit:'',
        visitCycle:'',
        mnemonicCode:'',
        channelTypeId:'',
        channelTypeName:'',
        custTypeName:'',
        custTypeId:'',
        remarks:'',
        isDisable: "0"
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        custCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        custName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        mnemonicCode: [{ required: false, message: '助记码不能为空', trigger: 'change' }],
        abbr: [{ required: false, message: '简称不能为空', trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.getList();
    this.getTree();
  },
  filters: {
      Fixed: function(num) {
          if (!num) { return '0.00' }
          return parseFloat(num).toFixed(2);
      }
  },
  methods: {
    handleNodeClick1(e){
      if(e.leaf==1){
        document.getElementById("dropTit1").click();
        this.temp.channelTypeName = e.channelTypeName;
        this.temp.channelTypeId = e.channelTypeId;
      }
    },
    handleNodeClick2(e){
      if(e.leaf==1){
        document.getElementById("dropTit2").click();
        this.temp.custTypeName = e.custTypeName;
        this.temp.custTypeId = e.custTypeId;
      }
    },
    getList() {
      this.listLoading = true
      getCust(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    getTree(){
      getChannelTree({parentId:'',includeRoot:0}).then(res => {
        this.treeData1 = res.data.data
      })
      getCustTypeTree({parentId:'',includeRoot:0}).then(res => {
        this.treeData2 = res.data.data
      })
      getPriceGroup({}).then(res => {
        this.priceGroupList = res.data.data
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
      this.temp.id = obj.id
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
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
      updateCustDisabled(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList()
          this.$message.success(data.isDisable==1?'解禁':'禁用'+'成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleModify(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveCust(this.temp).then(res => {
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
          saveCust(this.temp).then(res => {
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
    handleUpdate(val,id) {
      this.$prompt('已透支额度', '修改已透支额度', {
        confirmButtonText: '确定',closeOnClickModal:false,
        cancelButtonText: '取消',
        inputValue:parseFloat(val).toFixed(2),
        closeOnClickModal:false,
        inputType:'text',
        inputPattern: /^\d+$|^\d*\.\d*$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        this.updateValue(id,value)
      });
    },
    updateValue(id,value){
      var obj = {id:id,overdraftBalance:value}
      updateOverdraftBalanceById1(obj).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('修改已透支额度成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    delItem(id) {
      delCust(id).then(res => {
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
