<template>
    <div class="formDiv">
        <el-form ref="dataForm" label-width="120px" :rules="rules" :model="goodForm">
            <el-form-item label="商品名称" prop="itemName">
                <el-input v-model="goodForm.itemName" />
            </el-form-item>
            <el-form-item label="单价(元)" prop="price1">
                <el-input v-model="goodForm.price1" style="width:120px" /><span style="padding:0 5px">至</span>
                <el-input v-model="goodForm.price2" style="width:120px" />
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
            <el-form-item label="支付类型" prop="paymentType">
                <el-radio v-model="goodForm.paymentType" :label="0">在线支付</el-radio>
                <el-radio v-model="goodForm.paymentType" :label="1">货到付款</el-radio>
            </el-form-item>
            <el-form-item label="配送类型" prop="deliveryType">
                <el-radio v-model="goodForm.deliveryType" :label="0">快递</el-radio>
                <el-radio v-model="goodForm.deliveryType" :label="1">自取</el-radio>
            </el-form-item>
            <el-form-item label="配送费(元)" prop="freightAmount1">
                <el-input v-model="goodForm.freightAmount1" style="width:120px" /><span style="padding:0 5px">至</span>
                <el-input v-model="goodForm.freightAmount2" style="width:120px" />
            </el-form-item>
            <el-form-item label="所属页签" prop="tabCode">
                <el-select v-model="goodForm.tabCode">
                    <el-option v-for="item in tabs" :key="item.id" :value="item.id" :label="item.tabName" />
                </el-select>
            </el-form-item>
            <el-form-item label="商品特性(口味)" prop="def1">
                <el-input v-model="goodForm.def1" />
            </el-form-item>
            <el-form-item label="是否主图轮播" prop="isRotate">
                <el-radio v-model="goodForm.isRotate" :label="1">是</el-radio>
                <el-radio v-model="goodForm.isRotate" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="商品序号" prop="seq">
                <el-input v-model="goodForm.seq" />
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
            <el-form-item label="商品图片" prop="attachment">
                <vuedraggable v-model="srcList1" style="display: inline-block;" class="vue-draggable" @start="onDragStart" @end="onDragEnd">
                    <div v-for="(item,index) in srcList1" :key="index" class="itemUrl" :style="{'background-image': 'url('+item.fileUrl+')'}">
                        <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
                        <div class="shadow" @click="onRemoveHandler(index, 1)">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </vuedraggable>
                <div v-if="srcList1.length < 6" class="itemUrl">
                    <i class="el-icon-plus" style="color:#999;font-size:20px" />
                    <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 1)">
                </div>
            </el-form-item>
            <el-form-item label="详情图片" prop="attachment">
                <vuedraggable v-model="srcList2" style="display: inline-block;" class="vue-draggable" @start="onDragStart" @end="onDragEnd">
                    <div v-for="(item,index) in srcList2" :key="index" class="itemUrl" :style="{'background-image': 'url('+item.fileUrl+')'}">
                        <el-image :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
                        <div class="shadow" @click="onRemoveHandler(index, 2)">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </vuedraggable>
                <div v-if="srcList2.length < 6" class="itemUrl"><i class="el-icon-plus" style="color:#999;font-size:20px" />
                    <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" @change="upLoad($event, 2)">
                </div>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="goodForm.remarks" />
            </el-form-item>
        </el-form>
        <div class="tx-c w1200" style="margin-top:20px">
            <el-button class="filter-item" type="default" style="width:90px;" @click="backpage()">取消</el-button>
            <el-button class="filter-item" type="primary" style="width:90px;margin-left:15px" @click="saveData()">保存</el-button>
        </div>
    </div>
</template>
<script>
import vuedraggable from 'vuedraggable'
import COS from 'cos-js-sdk-v5'
import { getItemById } from '@/api/basedata'
import { getTabs, saveGood, getGood } from '@/api/mall'
export default {
    name: 'addgood',
    components: { vuedraggable },
    data() {
        return {
            url: '',
            itemId: this.$route.query.item_id || '',
            goodId: this.$route.query.id || '',
            srcList1: [],
            srcList2: [],
            goodForm: {
                itemId: '',
                itemName: '',
                price1: '',
                price2: '',
                uom: '',
                soldQty: '',
                remainingQty: '',
                isRotate: 0,
                paymentType: 1,
                deliveryType: 0,
                freightAmount1: '',
                freightAmount2: '',
                tabCode: '',
                isDisable: 0,
                status: 0,
                effectiveDate: '',
                qualityName: '',
                qualityDays: '',
                offlineDate: '',
                saleArea: '',
                def1: '',
                seq: 0,
                remarks: ''
            },
            tabs: [],
            addressCode: {},
            selectedFile: [],
            rules: {
                itemName: [{ required: true, trigger: 'change' }],
                price1: [{ required: true, trigger: 'change' }],
                uom: [{ required: true, trigger: 'change' }],
                soldQty: [{ required: true, trigger: 'change' }],
                remainingQty: [{ required: true, trigger: 'change' }],
                paymentType: [{ required: true, trigger: 'change' }],
                deliveryType: [{ required: true, trigger: 'change' }],
                freightAmount1: [{ required: true, trigger: 'change' }],
                tabCode: [{ required: true, trigger: 'change' }],
                isDisable: [{ required: true, trigger: 'change' }],
                status: [{ required: true, trigger: 'change' }],
                isRotate: [{ required: true, trigger: 'change' }],
                seq: [{ required: true, trigger: 'change' }]
            },
            itemQuery: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: { itemCode: '', itemName: '' }
            }
        }
    },
    created() {
        if (this.$route.query.item_id) {
            this.getItemData()
        }
        if (this.$route.query.id) {
            this.getGoodInfo()
        }
        getTabs().then(res => {
            if (res.data.errorCode == 0) {
                this.tabs = res.data.data || []
            }
        })
    },
    methods: {
        getGoodInfo() {
            getGood({ id: this.goodId }).then(res => {
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
            getItemById({ id: this.itemId }).then(res => {
                var goodData = res.data.data || {}
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
        saveData() {
            this.goodForm.attachmentLine = this.srcList1.concat(this.srcList2)
            this.goodForm.attachmentLine.forEach((item, index) => {
                item.seq = index
            })
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    var obj = this.goodForm
                    saveGood(obj).then(res => {
                        if (res.data.errorCode == 0) {
                            this.delImgs()
                            this.$message.success('商品添加成功！')
                            this.$router.replace('/mall/goodlist')
                        }
                    })
                }
            })
        },
        backpage() {
            this.$router.replace('/mall/goodlist')
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
                        console.log(err)
                        if (data && data.statusCode === 200) {
                            // 上传成功得到的资源地址
                            const url = 'https://' + bucket + '.cos.' + region + '.myqcloud.com/' + imgName
                            var lastIndex = imgName.lastIndexOf('/')
                            var filename = imgName.slice(0 - lastIndex)
                            that.saveImg(filename, imgName, imgSize, type, url)
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
        saveImg(fileName, attachment, fileSizeCategory, type, url) {
            this.$axios({
                method: 'post',
                url: '/drp/file/cosFileInfo/save',
                data: {
                    fileName: fileName,
                    fileUrl: attachment,
                    fileSizeCategory: fileSizeCategory
                }
            }).then(res => {
                if (type === 1) {
                    const obj = {
                        fileType: 0,
                        verticalDirection: 0,
                        fileUrl: url,
                        fileId: res.data.data.id
                    }
                    this.srcList1.push(obj)
                }
                if (type === 2) {
                    const data = {
                        fileType: 0,
                        verticalDirection: 1,
                        fileUrl: url,
                        fileId: res.data.data.id
                    }
                    this.srcList2.push(data)
                }
            })
        },
        delImgs() {
          if (this.selectedFile.length == 0) {
            return
          }
          this.$axios({
              method: 'post',
              url: '/drp/file/cosFileInfo/deleteFileByIds',
              data: {
                  ids: this.selectedFile
              }
          }).then(res => {
            this.selectedFile = []
            console.log('del imgs success')
          })
        },
        onRemoveHandler(index, type) {
            this.$confirm('确定删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this['srcList' + type] = this['srcList' + type].filter((v, i) => {
                  this.selectedFile = this.selectedFile.concat([v.fileId])
                  return i !== index
                })
            }).catch(() => {})
        },
        onDragStart(e) {
            e.target.classList.add('hideShadow')
        },
        onDragEnd(e) {
            e.target.classList.remove('hideShadow')
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

.el-image {
    width: 100%;
    height: 100%;
}

.itemUrl .shadow {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    transition: opacity .3s;
    color: #fff;
    font-size: 20px;
    line-height: 20px;
    padding: 2px;
    cursor: pointer;
}

.itemUrl:hover .shadow {
    opacity: 1;
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