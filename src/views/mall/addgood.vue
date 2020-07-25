<template>
    <div class="formDiv">
        <el-form ref="dataForm" label-width="100px" :rules="rules" :model="temp">
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
                <div v-for="url in srcList1" :key="url" class="itemUrl" :style="{'background-image': 'url('+url+')'}"></div>
                <div v-if="srcList1.length < 6" class="itemUrl"><i class="el-icon-plus" style="color:#999;font-size:20px"></i>
                    <input type="file"accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 1)">
                </div>
            </el-form-item>
            <el-form-item label="内容图片" prop="contactName">
                <div v-for="url in srcList2" :key="url" class="itemUrl" :style="{'background-image': 'url('+url+')'}"></div>
                <div v-if="srcList2.length < 6" class="itemUrl"><i class="el-icon-plus" style="color:#999;font-size:20px"></i>
                    <input type="file"accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 2)">
                </div>
            </el-form-item>
        </el-form>
        <div class="tx-c w1200" style="margin-top:20px">
            <el-button class="filter-item" type="default" style="width:90px;" @click="backpage()">取消</el-button>
            <el-button class="filter-item" type="primary" style="width:90px;margin-left:15px" @click="saveData()">保存</el-button>
        </div>
    </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
import Areas from "@/components/areas"
export default {
    components: { Areas },
    data() {
        return {
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            srcList1: [],
            srcList2: [],
            temp: {
                contactPhone: "",
                address: "",
                bizLicenseNo: "",
                bizLicensePic: '',
                name: '',
                contactEmail: '',
                contactPhone: '',
                managerName: '',
                managerIdcard: '',
                frontImg: '',
                premisesImg: '',
                province: '',
                city: "",
                area: ""
            },
            addressCode: {},
            rules: {
                name: [{ required: true, message: '门店名称不能为空', trigger: 'change' }],
                contactPhone: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
                area: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
                address: [{ required: true, message: '详细地址不能为空', trigger: 'change' }],
                contactName: [{ required: true, message: '负责人姓名不能为空', trigger: 'change' }]
            },

        }
    },
    methods: {
        areaData(data) {
            this.temp.province = data.split("-")[0]
            this.temp.city = data.split("-")[1]
            this.temp.area = data.split("-")[2]
        },
        //获取签名
        upLoad(event, type) {
            var fileObj = event.currentTarget.files[0];
            var imgSize = fileObj.size / 1024;
            var blobFile = this.$options.methods.dataURLtoBlob.bind(this)(fileObj)
            var filetype = fileObj.type
            this.$axios({
                method: 'get',
                url: '/drp/file/cosFileInfo/getCOSTempKey',
            }).then(res => {
                const obj = res.data
                this.uploadFile(obj, blobFile, filetype, imgSize, type)
            })
        },
        saveData() {
          this.$router.replace('/mall/goodlist')
        },
        backpage() {
          this.$router.replace('/mall/goodlist')
        },
        //上传腾讯云
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
            const that = this
            this.$axios({
                method: 'get',
                url: '/drp/file/cosFileInfo/getCOSFileName?suffix=' + filetype.split('/')[1]
            }).then(res => {
                const imgName = res.data.replace(/\s+/g, '')
                var path = '/drp/mmjpg'
                var bucket = 'drp-1300414844'
                cos.putObject({
                    Bucket: bucket,
                    Region: 'ap-beijing',
                    Key: imgName,
                    Body: file
                }, function(err, data) {
                    if (data && data.statusCode === 200) {
                        //上传成功得到的资源地址
                        const url = 'https://' + bucket + '.cos.ap-beijing.myqcloud.com/' + imgName
                        if (type == 1) {
                          that.srcList1.push(url)
                        }
                        if (type == 2) {
                          that.srcList2.push(url)
                        }
                        var lastIndex = imgName.lastIndexOf('/')
                        var filename = imgName.slice(0-lastIndex)
                        that.saveImg(filename, imgName, imgSize)
                        loading.close()
                    }
                });
            })

        },
        //DataURL转Blob
        dataURLtoBlob(fileObj) {
            console.log(fileObj.size)
            return new Blob([fileObj], { type: fileObj.type });
        },
        saveImg(fileName, fileUrl, fileSizeCategory) {
          this.$axios({
              method: 'post',
              url: '/drp/file/cosFileInfo/save',
              data: {
                fileName: fileName,
                fileUrl: fileUrl,
                fileSizeCategory: fileSizeCategory
              }
          }).then(res => {
            console.log('save img success')
          })
      },
    }
}
</script>
<style scoped>
.formDiv {
    width: 800px;
    margin: 50px auto;
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