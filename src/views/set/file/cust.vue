<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.createDate1" :editable="false" type="date" placeholder="建档开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:130px" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.createDate2" :editable="false" type="date" placeholder="建档结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:130px" />
      <el-input v-model="listQuery.queryParam.custName" size="small" placeholder="客户代码/名称" style="width: 200px;" />
      <el-input v-model="listQuery.queryParam.area" size="small" placeholder="区域" />
      <el-dropdown trigger="click">
        <span id="dropTit3" class="el-dropdown-link">
          <el-input v-model="listQuery.queryParam.channelTypeName" size="small" placeholder="渠道类型" />
        </span>
        <el-dropdown-menu slot="dropdown" size="small" :visible-change="menuVisible1">
          <div style="width:185px;max-height:260px">
            <el-tree :data="treeData1" :props="defaultProps1" default-expand-all @node-click="handleNodeClick3" />
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click">
        <span id="dropTit4" class="el-dropdown-link">
          <el-input v-model="listQuery.queryParam.custTypeName" size="small" placeholder="客户类别" />
        </span>
        <el-dropdown-menu slot="dropdown" size="small">
          <div style="width:185px;max-height:260px">
            <el-tree :data="treeData2" :props="defaultProps2" default-expand-all @node-click="handleNodeClick4" />
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button size="small" style="float:right;margin-left:20px" type="primary" @click="printBook">打印</el-button>
      <el-button size="small" style="float:right" type="primary" @click="showLine">客户地图</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="客户代码">
          <template slot-scope="{row}">
            <span>{{ row.custCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称">
          <template slot-scope="{row}">
            <span>{{ row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="助记码">
          <template slot-scope="{row}">
            <span>{{ row.mnemonicCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="简称">
          <template slot-scope="{row}">
            <span>{{ row.abbr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.addr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人">
          <template slot-scope="{row}">
            <span>{{ row.contact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区域">
          <template slot-scope="{row}">
            <span>{{ row.area }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信号">
          <template slot-scope="{row}">
            <span>{{ row.wechat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预收余额" align="right" width="100">
          <template slot-scope="{row}">
            <span>{{ row.advrBalance|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="赊销额度" align="right" width="100">
          <template slot-scope="{row}">
            <span>{{ row.creditLimit|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已赊销金额" align="right" width="100">
          <template slot-scope="{row}">
            <span>{{ row.overdraftBalance|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纳税人识别号" align="right" width="110">
          <template slot-scope="{row}">
            <span>{{ row.taxRegistrationCertificateNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否开票" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isInvoice==1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isDisable==0?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="零售自提" width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isDelivery==0?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleUpdate(row.overdraftBalance, row.id)">改已赊销金额</el-button>
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button type="text" size="small" @click="printCust(row.id)">打印</el-button>
            <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增客户':'修改客户'" :visible.sync="dialogFormVisible" width="935px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="95px" style="width: 900px; margin-left:10px;">
        <el-form-item label="客户代码" prop="custCode">
          <el-input v-model="temp.custCode" size="small" placeholder="客户代码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="custName">
          <el-input v-model="temp.custName" size="small" placeholder="客户名称" />
        </el-form-item>
        <el-form-item label="助记码" prop="mnemonicCode">
          <el-input v-model="temp.mnemonicCode" size="small" placeholder="助记码" disabled />
        </el-form-item>
        <el-form-item label="简称" prop="abbr">
          <el-input v-model="temp.abbr" size="small" placeholder="简称" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="temp.contact" size="small" placeholder="联系人" />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="temp.tel" size="small" placeholder="电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" size="small" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="开户行" prop="bankName">
          <el-input v-model="temp.bankName" size="small" placeholder="开户行" />
        </el-form-item>
        <el-form-item label="银行卡账号" prop="bankAccount">
          <el-input v-model="temp.bankAccount" size="small" placeholder="银行卡账号" />
        </el-form-item>
        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="temp.wechat" size="small" placeholder="微信号" />
        </el-form-item>
        <el-form-item label="省市区" prop="addr">
          <el-input v-model="temp.province" size="small" placeholder="省" style="width:60px" />
          <el-input v-model="temp.city" size="small" placeholder="市" style="width:60px" />
          <el-input v-model="temp.district" size="small" placeholder="县" style="width:60px" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" size="small" placeholder="地址" />
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input v-model="temp.area" size="small" max-length="8" placeholder="区域" />
        </el-form-item>
        <el-form-item label="赊销金额" prop="creditLimit" class="question">
          <el-tooltip class="item" effect="dark" content="客户允许赊销的额度" placement="bottom">
            <i class="el-icon-question" />
          </el-tooltip>
          <el-input v-model="temp.creditLimit" size="small" placeholder="赊销金额" />
        </el-form-item>
        <el-form-item label="拜访周期(天)" prop="visitCycle">
          <el-input v-model="temp.visitCycle" size="small" placeholder="拜访周期" />
        </el-form-item>
        <el-form-item label="渠道类型" prop="bizTypeId">
          <el-dropdown trigger="click">
            <span id="dropTit1" class="el-dropdown-link">
              <el-input v-model="temp.channelTypeName" size="small" placeholder="渠道类型" />
            </span>
            <el-dropdown-menu slot="dropdown" :visible-change="menuVisible1">
              <div style="width:185px;max-height:260px">
                <el-tree :data="treeData1" :props="defaultProps1" default-expand-all @node-click="handleNodeClick1" />
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="客户类别" prop="custTypeId">
          <el-dropdown trigger="click">
            <span id="dropTit2" class="el-dropdown-link">
              <el-input v-model="temp.custTypeName" size="small" placeholder="客户类别" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="width:185px;max-height:260px">
                <el-tree :data="treeData2" :props="defaultProps2" default-expand-all @node-click="handleNodeClick2" />
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="价格组" prop="priceGroupId">
          <el-select v-model="temp.priceGroupId" style="width:185px" size="small" class="filter-item" placeholder="价格组">
            <el-option v-for="item in priceGroupList" :key="item.id" :label="item.priceGroupName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxRegistrationCertificateNo" label-width="110px">
          <el-input v-model="temp.taxRegistrationCertificateNo" size="small" placeholder="统一社会信用代码或纳税人识别号" style="width:465px" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" size="small" placeholder="备注" />
        </el-form-item>
        <el-form-item label="销售人员" prop="remarks">
          <el-select v-model="temp.salesMan" style="width:185px" size="small" class="filter-item" placeholder="销售人员">
            <el-option v-for="item in staffList" :key="item.id" :label="item.staffName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="建档日期" prop="remarks">
          <el-date-picker v-model="temp.createDate" type="date" placeholder="建档日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:185px" />
        </el-form-item>
        <el-form-item label="是否开票" prop="isInvoice">
          <el-radio v-model="temp.isInvoice" :label="1">是</el-radio>
          <el-radio v-model="temp.isInvoice" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable" align="center" label-width="100px" style="margin-right:90px">
          <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
        </el-form-item>
        <el-form-item label="零售自提网点" prop="isDelivery" align="center" label-width="100px">
          <el-radio v-model="temp.isDelivery" :label="0">是</el-radio>
          <el-radio v-model="temp.isDelivery" :label="1">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus == 'create' ? handleCreate() : handleModify()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="客户地图" :visible.sync="dialogVisible" width="1000px" top="5%">
      <baidu-map id="allmap" :zoom="15" :center="center" :scroll-wheel-zoom="true" @ready="mapReady" />
    </el-dialog>
  </div>
</template>
<script>
import { getStaff, getCust, saveCust, delCust, updateCustDisabled, updateOverdraftBalanceById1, getChannelTree, getCustTypeTree, getPriceGroup, printAllCust, printCustById } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import Areas from '@/components/areas'
export default {
  name: 'baseCust',
  components: { Pagination, Areas },
  filters: {
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      addressCode: {},
      tableData: [],
      treeData1: [],
      treeData2: [],
      priceGroupList: [],
      defaultProps1: {
        children: 'children',
        label: 'channelTypeName'
      },
      defaultProps2: {
        children: 'children',
        label: 'custTypeName'
      },
      menuVisible1: false,
      total: 0,
      listLoading: true,
      staffList: [],
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          createDate1: '',
          createDate2: '',
          area: '',
          custCode: '',
          custName: '',
          channelTypeId: '',
          custTypeId: ''
        }
      },
      temp: {
        id: '',
        custName: '',
        addr: '',
        custCode: '',
        creditLimit: '',
        visitCycle: '',
        mnemonicCode: '',
        channelTypeId: '',
        channelTypeName: '',
        custTypeId: '',
        province: '',
        city: '',
        area: '',
        district: '',
        salesMan: '',
        createDate: '',
        priceGroupId: '',
        custTypeName: '',
        isInvoice: 0,
        taxRegistrationCertificateNo: '',
        remarks: '',
        isDisable: 0,
        isDelivery: 1
      },
      resetTemp: {
        id: '',
        custName: '',
        addr: '',
        custCode: '',
        creditLimit: '',
        visitCycle: '',
        mnemonicCode: '',
        channelTypeId: '',
        channelTypeName: '',
        custTypeId: '',
        province: '',
        city: '',
        area: '',
        district: '',
        salesMan: '',
        createDate: '',
        priceGroupId: '',
        custTypeName: '',
        isInvoice: 0,
        taxRegistrationCertificateNo: '',
        remarks: '',
        isDisable: 0,
        isDelivery: 1
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      center: { lng: 114.00000, lat: 22.55 },
      rules: {
        custCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        custName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        mnemonicCode: [{ required: false, message: '助记码不能为空', trigger: 'change' }],
        abbr: [{ required: false, message: '简称不能为空', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getList()
    this.getTree()
    this.getStaffList()
  },
  methods: {
    printBook() {
      printAllCust().then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    },
    printCust(id) {
      printCustById({ id }).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    },
    mapReady({ BMap, map }) {
      var points = [
        { lng: 114.00100, lat: 22.550000 },
        { lng: 114.00200, lat: 22.550000 },
        { lng: 114.00300, lat: 22.550000 },
        { lng: 114.00400, lat: 22.550000 },
        { lng: 114.00500, lat: 22.550000 },
        { lng: 114.00600, lat: 22.550000 },
        { lng: 114.00700, lat: 22.550000 },
        { lng: 114.00800, lat: 22.550000 },
        { lng: 114.00900, lat: 22.550000 }
      ]
      points.forEach((item, index) => {
        var point = new BMap.Point(item.lng, item.lat)
        var  myIcon  =  new  BMap.Icon('http://api.map.baidu.com/img/markers.png',  new  BMap.Size(23,  25), {     offset: new BMap.Size(10,  25),     imageOffset: new BMap.Size(0, 0  - index * 25)   })
        var marker = new BMap.Marker(point,   { icon: myIcon })
        map.addOverlay(marker)
      })
    },
    getStaffList() {
      getStaff().then(res => {
        this.staffList = res.data.data
      }).catch(err => {
        console.log('员工列表获取失败')
      })
    },
    showLine() {
      this.dialogVisible = true
    },
    areaData(data) {
      this.temp.province = data.split('-')[0]
      this.temp.city = data.split('-')[1]
      this.temp.area = data.split('-')[2]
    },
    handleNodeClick1(e) {
      if (e.leaf == 1) {
        document.getElementById('dropTit1').click()
        this.temp.channelTypeName = e.channelTypeName
        this.temp.channelTypeId = e.id
      }
    },
    handleNodeClick2(e) {
      if (e.leaf == 1) {
        document.getElementById('dropTit2').click()
        this.temp.custTypeName = e.custTypeName
        this.temp.custTypeId = e.id
      }
    },
    handleNodeClick3(e) {
      document.getElementById('dropTit3').click()
      this.$set(this.listQuery.queryParam, 'channelTypeName', e.channelTypeName)
      this.$set(this.listQuery.queryParam, 'channelTypeId', e.id)
    },
    handleNodeClick4(e) {
      document.getElementById('dropTit4').click()
      this.$set(this.listQuery.queryParam, 'custTypeName', e.custTypeName)
      this.$set(this.listQuery.queryParam, 'custTypeId', e.id)
    },
    getList() {
      this.listLoading = true
      getCust(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(err => {
        this.listLoading = false
      })
    },
    getTree() {
      getChannelTree({ parentId: '', includeRoot: 0 }).then(res => {
        this.treeData1 = res.data.data
      })
      getCustTypeTree({ parentId: '', includeRoot: 0 }).then(res => {
        this.treeData2 = res.data.data
      })
      getPriceGroup({}).then(res => {
        this.priceGroupList = res.data.data
      })
    },
    handleAdd(obj) {
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
      this.listQuery.pageIndex = 1
      this.getList()
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
      updateCustDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveCust(this.temp).then(res => {
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
          saveCust(this.temp).then(res => {
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
    handleUpdate(val, id) {
      this.$prompt('已赊销金额(元)', '修改已赊销金额', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        inputValue: val ? parseFloat(val).toFixed(2) : 0.00,
        closeOnClickModal: false,
        inputType: 'text',
        inputPattern: /^\d+$|^\d*\.\d*$/,
        inputErrorMessage: '格式不正确'
      }).then(({ value }) => {
        this.updateValue(id, value)
      }).catch(() => {})
    },
    updateValue(id, value) {
      var obj = { id: id, overdraftBalance: value }
      updateOverdraftBalanceById1(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success('修改已赊销金额成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    delItem(id) {
      delCust(id).then(res => {
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
<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 18px
}
>>> .el-form-item__label{line-height: 32px}
>>> .el-form-item__content{line-height: 32px}
</style>
<style scoped>
.app-container{min-width: 1220px}
#allmap {
    width: 960px;
    height: 600px;
    margin: 0 auto;
}
</style>
