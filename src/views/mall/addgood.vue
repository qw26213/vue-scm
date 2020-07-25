<template>
  <div class="formDiv">
    <el-form ref="dataForm" label-width="120px" :rules="rules" :model="temp">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="temp.itemName"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="temp.price"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="remainingQty">
        <el-input v-model="temp.remainingQty"></el-input>
      </el-form-item>
      <el-form-item label="销售区域">
        <Areas @giveData="areaData" :addressCode="addressCode"></Areas>
      </el-form-item>
      <el-form-item label="商品图片" prop="contactName">
        <el-input v-model="temp.contactName"></el-input>
      </el-form-item>
      <el-form-item label="内容图片" prop="contactName">
        <el-input v-model="temp.contactName"></el-input>
      </el-form-item>
      <input accept="" type='file' ref="file" id='upload' @change="upload()" />
      </el-form>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
import Areas from "@/components/areas"
export default {
  components: { Areas },
  data() {
    return {
      temp:{
        contactPhone:"",
        address:"",
        bizLicenseNo:"",
        bizLicensePic:'',
        name:'',
        contactEmail:'',
        contactPhone:'',
        managerName:'',
        managerIdcard:'',
        frontImg:'',
        premisesImg:'',
        province:'',
        city:"",
        area:""
      },
      addressCode:{},
      rules: {
        name: [{ required: true, message: '门店名称不能为空', trigger: 'change' }],
        contactPhone: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        area:[{ required: true, message: '请选择所在区域', trigger: 'change' }],
        address:[{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        contactName: [{ required: true, message: '负责人姓名不能为空', trigger: 'change' }]
      },

    }
  },
  methods: {
    areaData(data){
        this.temp.province = data.split("-")[0]
        this.temp.city = data.split("-")[1]
        this.temp.area = data.split("-")[2]
    },
  //获取签名
    upLoad() {
      var fileObj = document.getElementById("upload").files[0]
      var blobFile = this.$options.methods.dataURLtoBlob.bind(this)(fileObj)
      var filename = fileObj.name
      this.$axios({
        method: 'get',
        url: '/drp/file/cosFileInfo/getCOSTempKey',
      }).then(res => {
          const obj = res.data
          this.uploadFile(obj, blobFile, filename)
      })
    },
    //上传腾讯云
    uploadFile(obj, file, filename) {
      var cos = new COS({
        // 必选参数
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: obj.credentials.tmpSecretId,
            TmpSecretKey: obj.credentials.tmpSecretKey,
            XCosSecurityToken: obj.credentials.sessionToken,
            StartTime: obj.startTime,
            ExpiredTime: obj.expiredTime
          });
        },
        // 可选参数
        FileParallelLimit: 3, // 控制文件上传并发数
        ChunkParallelLimit: 3, // 控制单个文件下分片上传并发数
        ProgressInterval: 1000 // 控制上传的 onProgress 回调的间隔
      });
      const loading = this.$loading({
        lock: true,
        text: '资源正在上传,请耐心等待...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fileType = '.png'
      this.$axios({
        method: 'get',
        url: '/drp/file/cosFileInfo/getCOSFileName?suffix'+fileType
      }).then(res => {
          const filename = res.data.replace(/\s+/g, '')
          var path = '/drp/mmjpg'
          var bucket = 'drp-1300414844'
          cos.putObject({
            Bucket: bucket,
            Region: 'ap-beijing',
            Key: filename,
            Body: file
          }, function (err, data) {
            if (data && data.statusCode === 200) {
            //上传成功得到的资源地址
              let url = 'https://' + bucket + '.cos.ap-beijing.myqcloud.com/' + filename
              console.log(url)
              loading.close();
            }
          });
      })

    },
    //DataURL转Blob
    dataURLtoBlob(fileObj) {
      console.log(fileObj.size)
      return new Blob([fileObj], { type: fileObj.type });
    }
  }
}
</script>
<style scoped>
.formDiv {width: 600px;margin: 50px auto;}
.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 180px;height: 120px;line-height: 120px;text-align: center;}
.uploadDiv{border: 1px #eee solid;background-color: #fff;width: 180px;height: 120px;border-radius: 6px;overflow: hidden;background: #f7f7f7;background-repeat: no-repeat;background-size: 100% 100%;overflow: hidden;position: relative;}
.uploadDiv input{opacity: 0;position:absolute;top: 0;top: 0;width: 100%;height: 100%;}
</style>
