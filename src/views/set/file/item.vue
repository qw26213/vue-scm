<template>
  <div class="main">
    <div class="leftTree" :style="{height:conHeight + 'px'}">
      <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
    </div>
    <div ref="container" class="app-container">
      <div class="filterDiv">
        <el-input v-model="listQuery.queryParam.itemName" size="small" placeholder="商品代码/名称/助记码/规格/特性/品牌..." style="width: 360px;" class="filter-item" />
        <!-- <el-input size="small" v-model="listQuery.queryParam.itemCode" placeholder="商品代码" style="width: 200px;" class="filter-item" /> -->
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button size="small" style="float:right" type="primary" @click="printBook">打印</el-button>
      </div>
      <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
          <el-table-column label="商品代码">
            <template slot-scope="{row}">
              <span>{{ row.itemCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="170" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span>{{ row.itemName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" width="90" align="center">
            <template slot-scope="{row}">
              <span>{{ row.norms }}</span>
            </template>
          </el-table-column>
          <el-table-column label="特性" align="center">
            <template slot-scope="{row}">
              <span>{{ row.def1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="品牌" align="center">
            <template slot-scope="{row}">
              <span>{{ row.brandName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产地" align="center">
            <template slot-scope="{row}">
              <span>{{ row.prodArea }}</span>
            </template>
          </el-table-column>
          <el-table-column label="保质期(天)" align="center">
            <template slot-scope="{row}">
              <span>{{ row.qualityDays }}</span>
            </template>
          </el-table-column>
          <el-table-column label="主(辅)单位" width="100" align="center">
            <template slot-scope="{row}">
              <span>{{ row.uom }}</span>
              <span v-if="row.subUom">({{ row.subUom }})</span>
            </template>
          </el-table-column>
          <el-table-column label="换算率" width="70" align="center">
            <template slot-scope="{row}">
              <span>{{ row.exchangeRate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="通用售价" width="90" align="right">
            <template slot-scope="{row}">
              <span>{{ row.stdPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="税率" width="70" align="right">
            <template slot-scope="{row}">
              <span>{{ row.taxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="序列号管理" width="90" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isBatch==1?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否低温" width="80" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isRefrigerated==1?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否在售" width="80" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isSale==1?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否可用" width="80" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isDisable==0?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="150">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="printItem(row.id)">打印</el-button>
              <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
      </div>
      <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增商品':'编辑商品'" :visible.sync="dialogFormVisible" width="700px" top="3%">
        <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="left" label-width="110px" style="width:660px; margin-left:10px;overflow:auto;height:600px">
          <el-form-item label="商品代码" prop="itemCode" style="margin-right:20px">
            <el-input v-model="temp.itemCode" size="small" placeholder="商品代码" />
          </el-form-item>
          <el-form-item label="商品名称" prop="itemName">
            <el-input v-model="temp.itemName" size="small" placeholder="商品名称" />
          </el-form-item>
          <el-form-item label="商品图片" prop="fileUrl" style="margin-right:10px">
            <div class="itemUrl">
              <div v-if="fileUrl" class="fileImg" :style="{'background-image': 'url('+fileUrl+')'}" />
              <i v-else class="el-icon-plus" style="color:#999;font-size:20px" />
              <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 1)">
            </div>
          </el-form-item>
          <el-form-item label="规格" prop="norms">
            <el-input v-model="temp.norms" size="small" placeholder="规格" />
          </el-form-item>
          <el-form-item label="主单位" prop="measId" style="margin-right:20px">
            <el-select v-model="temp.measId" size="small" style="width:185px" class="filter-item">
              <el-option v-for="item in measList" :key="item.id" :label="item.measName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="辅助单位" prop="subMeasId">
            <el-select v-model="temp.subMeasId" size="small" style="width:185px" class="filter-item">
              <el-option v-for="item in measList" :key="item.id" :label="item.measName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="主条码" prop="barcode" style="margin-right:20px">
            <el-input v-model="temp.barcode" size="small" placeholder="主条码" />
          </el-form-item>
          <el-form-item label="辅助条码" prop="subBarcode">
            <el-input v-model="temp.subBarcode" size="small" placeholder="辅助条码" />
          </el-form-item>
          <el-form-item label="辅/主换算率" prop="exchangeRate" style="margin-right:20px">
            <el-input v-model="temp.exchangeRate" size="small" placeholder="辅/主换算率" />
          </el-form-item>
          <el-form-item label="税率" prop="taxRate">
            <el-input v-model="temp.taxRate" size="small" style="width:170px" placeholder="税率" />%
          </el-form-item>
          <el-form-item label="建议销售价" prop="price0" style="margin-right:20px">
            <el-input v-model="temp.price0" size="small" placeholder="建议销售价" />
          </el-form-item>
          <el-form-item label="销售最低价" prop="lowestPrice">
            <el-input v-model="temp.lowestPrice" size="small" placeholder="销售最低价" />
          </el-form-item>
          <el-form-item label="客户通用售价" prop="stdPrice" style="margin-right:20px">
            <el-input v-model="temp.stdPrice" size="small" placeholder="客户通用售价" />
          </el-form-item>
          <el-form-item label="商品产地" prop="prodArea">
            <el-input v-model="temp.prodArea" size="small" placeholder="商品产地" />
          </el-form-item>
          <el-form-item label="保质期(天)" prop="qualityDays" style="margin-right:20px">
            <el-input v-model="temp.qualityDays" size="small" placeholder="保质期" />
          </el-form-item>
          <el-form-item label="特性" prop="def1">
            <el-input v-model="temp.def1" size="small" placeholder="如口味" />
          </el-form-item>
          <el-form-item label="主计量数量精度" prop="scale" label-width="120px" style="margin-right:20px">
            <el-select v-model="temp.scale" size="small" style="width:175px" class="filter-item">
              <el-option v-for="item in [0,1,2,3,4]" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="辅计量数量精度" prop="subScale" label-width="120px">
            <el-select v-model="temp.subScale" size="small" style="width:175px" class="filter-item">
              <el-option v-for="item in [0,1,2,3,4]" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="显示用计量单位" prop="measDisp" label-width="120px" style="margin-right:20px">
            <el-select v-model="temp.measDisp" size="small" style="width:175px" class="filter-item">
              <el-option label="主单位" :value="0" />
              <el-option label="辅单位" :value="1" />
              <el-option label="主+辅单位" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="打印用计量单位" prop="measPrint" label-width="120px">
            <el-select v-model="temp.measPrint" size="small" style="width:175px" class="filter-item">
              <el-option label="主单位" :value="0" />
              <el-option label="辅单位" :value="1" />
              <el-option label="主+辅单位" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品属性" prop="attr" class="noInput" style="margin-right:20px">
            <el-radio-group v-model="temp.attr">
              <el-radio :label="0" style="margin-right:10px">库存商品</el-radio>
              <el-radio :label="1">负单价商品</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="销售改价" prop="salePriceType" class="noInput">
            <el-radio-group v-model="temp.salePriceType">
              <el-radio :label="0" style="margin-right:10px">完全禁止</el-radio>
              <el-radio :label="1" style="margin-right:10px">按员工</el-radio>
              <el-radio :label="2">完全允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退货改价" prop="returnPriceType" style="margin-right:20px" class="noInput">
            <el-radio-group v-model="temp.returnPriceType">
              <el-radio :label="0" style="margin-right:10px">完全禁止</el-radio>
              <el-radio :label="1" style="margin-right:10px">按员工</el-radio>
              <el-radio :label="2">完全允许</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="isIndivisible" class="noInput">
            <el-checkbox v-model="temp.isIndivisible" :false-label="0" :true-label="1" style="margin-right:10px">不允许拆箱</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="isBatch" class="noInput">
            <el-checkbox v-model="temp.isBatch" :false-label="0" :true-label="1" style="margin-right:10px">批次号管理</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="negativeType" class="noInput">
            <el-checkbox v-model="temp.negativeType" :false-label="0" :true-label="1" style="margin-right:10px">允许负库存</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="isRefrigerated" class="noInput">
            <el-checkbox v-model="temp.isRefrigerated" :false-label="0" :true-label="1" style="margin-right:10px">低温</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="isSale" class="noInput">
            <el-checkbox v-model="temp.isSale" :false-label="0" :true-label="1" style="margin-right:10px">在售</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="isQuality" class="noInput">
            <el-checkbox v-model="temp.isQuality" :false-label="0" :true-label="1" style="margin-right:10px">保质期管理</el-checkbox>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId" class="noInput" label-width="45px">
            <el-select v-model="temp.brandId" size="small" style="width:185px" class="filter-item">
              <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remarks" label-width="45px" style="margin-right:30px">
            <el-input v-model="temp.remarks" size="small" style="width:250px" placeholder="备注" />
          </el-form-item>
          <el-form-item label="是否可用" label-width="75px" prop="isDisable">
            <el-radio v-model="temp.isDisable" :label="0" style="margin-right:40px">是</el-radio>
            <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button style="margin-right:30px" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
import { getMeas, getItem, saveItem, delItem, getItemTree, updateItemDisabled, getItemChildrenByParentId, getAllByInvCatgId, getBrand, printAllItem, printItemById } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseItem',
  components: { Pagination },
  filters: {
    formatWay: function(str) {
      if (str == 0) {
        return '移动平均'
      } else if (str = 1) {
        return '个别计价'
      } else if (str == 2) {
        return '先进先出'
      } else {
        return '无'
      }
    }
  },
  data() {
    return {
      treeData: [],
      measList: [],
      defaultProps: {
        children: 'children',
        label: 'invCatgName'
      },
      invCatgId: '',
      conHeight: 600,
      tableKey: 0,
      fileUrl: '',
      tableData: [],
      brandList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          itemName: ''
        }
      },
      temp: {
        id: '',
        invCatgId: '',
        itemName: '',
        itemCode: '',
        fileUrl: '',
        fileId: '',
        measId: '',
        subMeasId: '',
        norms: '',
        attr: 0,
        def1: '',
        price0: '',
        measPrint: 1,
        lowestPrice: '',
        exchangeRate: '',
        salePriceType: 1,
        returnPriceType: 1,
        stdPrice: '',
        prodArea: '',
        brandId: '',
        qualityDays: '',
        isBatch: 0,
        taxRate: '',
        isRefrigerated: 0,
        negativeType: 1,
        isQuality: 0,
        isSale: 1,
        remarks: '',
        scale: 4,
        isIndivisible: 0,
        subScale: 0,
        measDisp: 2,
        isDisable: 0
      },
      resetTemp: {
        id: '',
        invCatgId: '',
        itemName: '',
        itemCode: '',
        fileUrl: '',
        fileId: '',
        measId: '',
        subMeasId: '',
        norms: '',
        attr: 0,
        def1: '',
        price0: '',
        measPrint: 1,
        lowestPrice: '',
        exchangeRate: '',
        salePriceType: 1,
        returnPriceType: 1,
        stdPrice: '',
        prodArea: '',
        brandId: '',
        qualityDays: '',
        isBatch: 0,
        taxRate: '',
        isRefrigerated: 0,
        negativeType: 1,
        isQuality: 0,
        isSale: 1,
        remarks: '',
        scale: 4,
        isIndivisible: 0,
        subScale: 0,
        measDisp: 2,
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        itemName: [{ required: true, message: '商品名称不能为空', trigger: 'change' }],
        itemCode: [{ required: true, message: '商品代码不能为空', trigger: 'change' }],
        norms: [{ required: true, message: '规格不能为空', trigger: 'change' }],
        measId: [{ required: true, message: '单位不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getList()
    getMeas({}).then(res => {
      this.measList = res.data.data
    })
  },
  methods: {
    printBook() {
      printAllItem().then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    },
    printItem(id) {
      printItemById({ id }).then(res => {
        window.open('http://' + window.location.host + res.data.data)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getItemById() {
      this.listLoading = true
      getAllByInvCatgId(this.invCatgId).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      getItem(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
        if (this.listQuery.pageIndex === 1) {
          this.$nextTick(() => {
            const height = this.$refs.container.offsetHeight
            this.conHeight = height - 90
          })
        }
      }).catch(err => {
        this.listLoading = false
      })
      getItemTree({ parentId: '', includeRoot: 1 }).then(res => {
        this.treeData = res.data.data
      })
      getBrand({}).then(res => {
        this.brandList = res.data.data
      })
    },
    handleNodeClick(e) {
      this.invCatgId = e.id
      this.getItemById()
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
      if (this.temp.taxRate <= 0.2) {
        this.temp.taxRate = this.temp.taxRate * 100
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
      updateItemDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
        }
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveItem(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            }
          })
        }
      })
    },
    handleCreate() {
      this.temp.invCatgId = this.invCatgId
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveItem(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            }
          })
        }
      })
    },
    delItem(id) {
      delItem(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        }
      })
    },
    upLoad(event, type) {
      var fileObj = event.currentTarget.files[0]
      var imgSize = fileObj.size / 1024
      var blobFile = this.$options.methods.dataURLtoBlob.bind(this)(fileObj)
      var filetype = fileObj.type
      this.$axios({
        method: 'get',
        url: '/drp/file/cosFileInfo/getCOSTempKey'
      }).then(res => {
        const obj = res.data
        this.uploadFile(obj, blobFile, filetype, imgSize, type)
      })
    },
    // 上传腾讯云
    uploadFile(obj, file, filetype, imgSize, type) {
      var cos = new COS({
        // 必选参数
        getAuthorization: function(options, callback) {
          callback({
            TmpSecretId: obj.credentials.tmpSecretId,
            TmpSecretKey: obj.credentials.tmpSecretKey,
            XCosSecurityToken: obj.credentials.sessionToken,
            StartTime: obj.startTime,
            ExpiredTime: obj.expiredTime
          })
        },
        // 可选参数
        FileParallelLimit: 3, // 控制文件上传并发数
        ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
        ProgressInterval: 1000 // 控制上传的 onProgress 回调的间隔
      })
      const loading = this.$loading({
        lock: true,
        text: '正在上传...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const that = this
      this.$axios({
          method: 'get',
          url: '/drp/file/cosFileInfo/getCOSFileName?suffix=' + filetype.split('/')[1]
      }).then(res => {
          const imgName = res.data.replace(/\s+/g, '')
          this.$axios({
              method: 'get',
              url: '/drp/sys/user/getCosRes'
          }).then(res => {
              const bucket = res.data.data.bucket
              const region = res.data.data.region
              cos.putObject({
                  Bucket: bucket,
                  Region: region,
                  Key: imgName,
                  Body: file
              }, function(err, data) {
                  if (data && data.statusCode === 200) {
                      // 上传成功得到的资源地址
                      const url = 'https://' + bucket + '.cos.' + region + '.myqcloud.com/' + imgName
                      var lastIndex = imgName.lastIndexOf('/')
                      var filename = imgName.slice(0 - lastIndex)
                      that.saveImg(filename, imgName, imgSize)
                      loading.close()
                  }
              })
          })
      })
    },
    // DataURL转Blob
    dataURLtoBlob(fileObj) {
      return new Blob([fileObj], { type: fileObj.type })
    },
    saveImg(fileName, attachment, fileSizeCategory) {
      this.$axios({
        method: 'post',
        url: '/drp/file/cosFileInfo/save',
        data: {
          fileName: fileName,
          fileUrl: attachment,
          fileSizeCategory: fileSizeCategory
        }
      }).then(res => {
        this.temp.fileUrl = res.data.data.fileUrl
        this.temp.fileId = res.data.data.id
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    padding-left: 180px;
}

.leftTree {
    width: 160px;
    height: auto;
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    border: 1px #eee solid;
    overflow: auto;
}
>>> .el-form-item__label{line-height: 32px}
>>> .el-form-item__content{line-height: 32px}
>>> .noInput label{line-height: 28px}
>>> .noInput .el-form-item__content{line-height:28px}

.tableDiv {
    width: 100%;
}
/deep/.el-form-item{margin-bottom: 18px}
.el-button+.el-button {
    margin-left: 0;
}
.itemUrl {
    width: 185px;
    height: 125px;
    background-color: #f1f1f1;
    border-radius: 4px;
    border: 1px #e5e5e5 solid;
    display: inline-block;
    margin-right: 10px;
    position: relative;
}

.fileImg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.el-icon-plus {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    z-index: 1
}

input[type='file'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2
}
</style>
