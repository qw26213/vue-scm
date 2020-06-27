<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.settleTypeName" placeholder="结算方式代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-CASHent-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="结算方式代码">
        <template slot-scope="{row}">
          <span>{{row.settleTypeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算方式名称">
        <template slot-scope="{row}">
          <span>{{row.settleTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应科目代码">
        <template slot-scope="{row}">
          <span>{{row.coaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="收付标志" align="center">
        <template slot-scope="{row}">
          <span>{{row.arAp|format}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="应用场景" min-width="200" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>
          {{row.poEnable==1?'采购、':''}}
          {{row.soEnable==1?'销售、':''}}
          {{row.psEnable==1?'预收、':''}}
          {{row.poReturnedEnable==1?'采购退款、':''}}
          {{row.soReturnedEnable==1?'销售退款、':''}}
          {{row.psReturnedEnable==1?'预收退款、':''}}
          {{row.recEnable==1?'收款、':''}}
          {{row.payEnable==1?'付款':''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template slot-scope="{row}">
          <span>{{row.isDisable==0?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="190">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
          <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增结算方式':'修改结算方式'" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 540px;margin-left:10px">
        <el-form-item label="结算方式代码" prop="settleTypeCode">
          <el-input v-model="temp.settleTypeCode" placeholder="结算方式代码" />
        </el-form-item>
        <el-form-item label="结算方式名称" prop="settleTypeName">
          <el-input v-model="temp.settleTypeName" placeholder="结算方式名称" />
        </el-form-item>
        <el-form-item label="对应科目代码" prop="coaCode">
          <el-input v-model="temp.coaCode" placeholder="对应科目代码" />
        </el-form-item>
        <el-form-item label="收付标志" prop="arAp">
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="">无</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="CASH">现金</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="BANK">银行存款</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="CC">信用卡</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="ALIPAY">支付宝</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="WECHATPAY">微信支付</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="AR">应收(赊销)</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="AP">应付</el-radio>
          <el-radio v-model="temp.arAp" style="margin-right:10px" label="ADVR">预收</el-radio>
        </el-form-item>
        <el-form-item label="应用场景" prop="poEnable">
            <el-checkbox style="margin-right:10px" v-model="temp.poEnable" :false-label="0" :true-label="1">采购</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.soEnable" :false-label="0" :true-label="1">销售</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.psEnable" :false-label="0" :true-label="1">预收</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.poReturnedEnable" :false-label="0" :true-label="1">采购退款</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.soReturnedEnable" :false-label="0" :true-label="1">销售退款</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.psReturnedEnable" :false-label="0" :true-label="1">预收退款</el-checkbox>
            <el-checkbox style="margin-right:10px" v-model="temp.recEnable" :false-label="0" :true-label="1">收款</el-checkbox>
            <el-checkbox v-model="temp.payEnable" :false-label="0" :true-label="1">付款</el-checkbox>
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
</template>

<script>
import { getSettleType,saveSettleType,delSettleType,updateSettleTypeDisabled } from '@/api/basedata'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'baseSettleType',
  components: { Pagination },
  filters: {
      format: function(str) {
          if (str=='AR') { return '应收(赊销)' }
          else if (str=='CASH') { return '现金' }
          else if (str=='BANK') { return '银行存款' }
          else if (str=='ALIPAY') { return '支付宝' }
          else if (str=='WECHATPAY') { return '微信支付' }
          else if (str=='CC') { return '信用卡' }
          else if (str=='AP') { return '应付' }
          else if (str=='ADVP') { return '预付' }
          else if (str=='ADVR') { return '预收' }
          else {return '——'}
      }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        settleTypeName: ''
      },
      temp: {
        settleTypeName: '',
        settleTypeCode: '',
        coaCode:'',
        arAp:'',
        remarks:'',
        poEnable: 1,
        soEnable: 1,
        psEnable: 1,
        poReturnedEnable: 1,
        soReturnedEnable: 1,
        psReturnedEnable: 1,
        recEnable: 1,
        payEnable: 1,
        isDisable: 0
      },
      resetTemp: {
        settleTypeName: '',
        settleTypeCode: '',
        coaCode:'',
        arAp:'',
        remarks:'',
        poEnable: 1,
        soEnable: 1,
        psEnable: 1,
        poReturnedEnable: 1,
        soReturnedEnable: 1,
        psReturnedEnable: 1,
        recEnable: 1,
        payEnable: 1,
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        settleTypeCode: [{ required: true, message: '结算方式代码不能为空', trigger: 'change' }],
        settleTypeName: [{ required: true, message: '结算方式名称不能为空', trigger: 'change' }],
        coaCode: [{ required: true, message: '对应科目代码不能为空', trigger: 'change' }],
        arAp:[{required:true}],
        isDisable:[{required:true}]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSettleType(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for (var key in this.temp){
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (var key in this.temp){
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
      updateSettleTypeDisabled(obj).then(res => {
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
          saveSettleType(this.temp).then(res => {
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
          saveSettleType(this.temp).then(res => {
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
      delSettleType(id).then(res => {
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
