<template>
  <div class="formDiv">
    <el-form ref="dataForm" label-width="120px" :rules="rules" :model="goodForm">
      <el-form-item label="商品明细名称" prop="itemName">
        <el-input v-model="goodForm.itemName" />
      </el-form-item>
      <el-form-item label="原价(元)" prop="stdPrice">
        <el-input v-model="goodForm.stdPrice" />
      </el-form-item>
      <el-form-item label="单价(元)" prop="price">
        <el-input v-model="goodForm.price" />
      </el-form-item>
      <el-form-item label="单位" prop="uom">
        <el-input v-model="goodForm.uom" />
      </el-form-item>
      <el-form-item label="销量" prop="soldQty">
        <el-input v-model="goodForm.soldQty" />
      </el-form-item>
      <el-form-item label="库存" prop="remainingQty">
        <el-input v-model="goodForm.remainingQty" />
      </el-form-item>
      <el-form-item label="规格" prop="norms">
        <el-input v-model="goodForm.norms" />
      </el-form-item>
      <el-form-item label="商品口味(特性)" prop="def1">
        <el-input v-model="goodForm.def1" />
      </el-form-item>
      <el-form-item label="商品倍数" prop="multi">
        <el-input v-model="goodForm.multi" />
      </el-form-item>
      <el-form-item label="商品序号" prop="seq">
        <el-input v-model="goodForm.seq" />
      </el-form-item>
      <el-form-item label="配送费(元)" prop="freightAmount">
        <el-input v-model="goodForm.freightAmount" />
      </el-form-item>
      <el-form-item label="是否生效" prop="isDisable">
        <el-radio v-model="goodForm.isDisable" :label="0">是</el-radio>
        <el-radio v-model="goodForm.isDisable" :label="1">否</el-radio>
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-radio v-model="goodForm.status" :label="0">在售</el-radio>
        <el-radio v-model="goodForm.status" :label="1">未开始</el-radio>
        <el-radio v-model="goodForm.status" :label="2">已下架</el-radio>
      </el-form-item>
      <el-form-item label="生产日期" prop="productionDate">
        <el-date-picker v-model="goodForm.productionDate" :editable="false" type="date" placeholder="生产日期" style="width:225px" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="保质期(中文)" prop="qualityName">
        <el-input v-model="goodForm.qualityName" />
      </el-form-item>
      <el-form-item label="保质期(天数)" prop="qualityDays">
        <el-input v-model="goodForm.qualityDays" />
      </el-form-item>
      <el-form-item label="上架日期" prop="effectiveDate">
        <el-date-picker v-model="goodForm.effectiveDate" :editable="false" type="date" placeholder="上架日期" style="width:225px" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="下架日期" prop="offlineDate">
        <el-date-picker v-model="goodForm.offlineDate" :editable="false" type="date" placeholder="下架日期" style="width:225px" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="销售区域" prop="saleArea">
        <el-input v-model="goodForm.saleArea" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="goodForm.remarks" />
      </el-form-item>
      <!-- <el-form-item label="商品图片" prop="attachment">
                <div v-for="url in srcList1" :key="url.fileUrl" class="itemUrl" :style="{'background-image': 'url('+url.fileUrl+')'}"></div>
                <div v-if="srcList1.length < 6" class="itemUrl">
                    <i class="el-icon-plus" style="color:#999;font-size:20px"></i>
                    <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 1)">
                </div>
            </el-form-item>
            <el-form-item label="内容图片" prop="attachment">
                <div v-for="url in srcList2" :key="url.fileUrl" class="itemUrl" :style="{'background-image': 'url('+url.fileUrl+')'}"></div>
                <div v-if="srcList2.length < 6" class="itemUrl"><i class="el-icon-plus" style="color:#999;font-size:20px"></i>
                    <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 2)">
                </div>
            </el-form-item> -->
    </el-form>
    <div class="tx-c w1200" style="margin-top:20px">
      <el-button class="filter-item" type="default" style="width:90px;" @click="backpage()">取消</el-button>
      <el-button class="filter-item" type="primary" style="width:90px;margin-left:15px" @click="saveData()">保存</el-button>
    </div>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
import { getItemById } from '@/api/basedata'
import { saveGoodDetail, getGoodDetail } from '@/api/mall'
export default {
  data() {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      headerId: this.$route.query.header_id || '',
      goodId: this.$route.query.id || '',
      itemId: this.$route.query.item_id || '',
      srcList1: [],
      srcList2: [],
      goodForm: {
        itemId: '',
        itemName: '',
        stdPrice: '',
        price: '',
        uom: '',
        soldQty: '',
        remainingQty: '',
        freightAmount: '',
        isDisable: 0,
        status: 0,
        effectiveDate: '',
        qualityName: '',
        qualityDays: '',
        offlineDate: '',
        saleArea: '',
        def1: '',
        seq: '',
        multi: 1,
        remarks: ''
      },
      addressCode: {},
      rules: {
        itemName: [{ required: true, trigger: 'change' }],
        stdPrice: [{ required: true, trigger: 'change' }],
        price: [{ required: true, trigger: 'change' }],
        uom: [{ required: true, trigger: 'change' }],
        soldQty: [{ required: true, trigger: 'change' }],
        remainingQty: [{ required: true, trigger: 'change' }],
        freightAmount: [{ required: true, trigger: 'change' }],
        isDisable: [{ required: true, trigger: 'change' }],
        status: [{ required: true, trigger: 'change' }],
        seq: [{ required: true, trigger: 'change' }]
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getGoodDetailInfo()
    } else if (this.$route.query.item_id) {
      this.getItemData()
    }
  },
  methods: {
    getGoodDetailInfo() {
      getGoodDetail({ id: this.goodId }).then(res => {
        this.goodForm = res.data.data || {}
        if (this.goodForm.attachmentLine) {
          this.srcList1 = this.goodForm.attachmentLine.filter(item => item.verticalDirection === 0)
          this.srcList2 = this.goodForm.attachmentLine.filter(item => item.verticalDirection === 1)
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    getItemData() {
      getItemById({ id: this.$route.query.item_id }).then(res => {
        var goodData = res.data.data
        this.goodForm.itemId = goodData.id
        this.goodForm.itemName = goodData.itemName
        this.goodForm.uom = goodData.uom
        this.goodForm.norms = goodData.norms
        this.goodForm.attachment = []
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
    saveData() {
      this.goodForm.attachment = this.srcList1.concat(this.srcList2)
      this.goodForm.attachment.forEach((item, index) => {
        item.seq = index
      })
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          var obj = this.goodForm
          obj.headerId = this.headerId
          saveGoodDetail(obj).then(res => {
            if (res.data.errorCode == 0) {
              this.$message.success('商品明细添加成功！')
              this.$router.replace('/mall/deline?id=' + this.$route.query.header_id + '&item_id=' + this.$route.query.item_id)
            }
          })
        }
      })
    },
    backpage() {
      this.$router.replace('/mall/deline')
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
        text: '资源正在上传,请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const that = this
      this.$axios({
        method: 'get',
        url: '/drp/file/cosFileInfo/getCOSFileName?suffix=' + filetype.split('/')[1]
      }).then(res => {
        const imgName = res.data.replace(/\s+/g, '')
        var bucket = 'drp-1300414844'
        cos.putObject({
          Bucket: bucket,
          Region: 'ap-beijing',
          Key: imgName,
          Body: file
        }, function(err, data) {
          console.log(err)
          if (data && data.statusCode === 200) {
            // 上传成功得到的资源地址
            const url = 'https://' + bucket + '.cos.ap-beijing.myqcloud.com/' + imgName
            if (type === 1) {
              const obj = {
                fileType: 0,
                verticalDirection: 0,
                fileUrl: url
              }
              that.srcList1.push(obj)
            }
            if (type === 2) {
              const data = {
                fileType: 0,
                verticalDirection: 1,
                fileUrl: url
              }
              that.srcList2.push(data)
            }
            var lastIndex = imgName.lastIndexOf('/')
            var filename = imgName.slice(0 - lastIndex)
            that.saveImg(filename, imgName, imgSize)
            loading.close()
          }
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
        console.log('save img success')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__label {
    line-height: 30px;
}

/deep/ .el-form-item {
    margin-bottom: 16px;
}
</style>
<style scoped>
.formDiv {
    width: 800px;
    margin: 20px auto;
    background: #fff;
    padding: 20px
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

.uploadDiv {
    border: 1px #eee solid;
    background-color: #fff;
    width: 180px;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;
    background: #f7f7f7;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    position: relative;
}

.uploadDiv input {
    opacity: 0;
    position: absolute;
    top: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.itemUrl {
    width: 100px;
    height: 100px;
    background-color: #f1f1f1;
    border-radius: 4px;
    border: 1px #e5e5e5 solid;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.itemUrl {
    display: inline-block;
    margin-right: 10px;
    position: relative;
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
