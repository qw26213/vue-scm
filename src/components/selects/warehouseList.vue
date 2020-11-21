<template>
    <el-select v-model="curId" style="width:145px" :placeholder="placeholderTxt" size="small" @change="changeVal">
        <el-option v-for="item in list" :label="item.warehouseName" :key="item.id" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getWarehouse } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId', 'keyType', 'ctrType', 'placeTxt', 'allowNull'],
    data() {
        return {
            list: [],
            curId: this.selectId,
            curName: '',
            placeholderTxt: ''
        }
    },
    watch: {
        'selectId' () {
            this.curId = this.selectId
        }
    },
    mounted() {
        this.getData();
        if (this.placeTxt) {
            this.placeholderTxt = this.placeTxt
        } else {
            this.placeholderTxt = "选择仓库"
        }
    },
    methods: {
        changeVal(val) {
            var obj = {}
            if (this.keyType) {
                obj[this.keyType] = val
            } else {
                obj.warehouseId = val
            }
            this.$emit('selectChange', obj)
        },
        getData() {
            getWarehouse().then(res => {
                var arr = [];
                if (this.ctrType == "list") {
                    arr = [{ warehouseName: '全部仓库', id: '' }]
                }
                if (this.allowNull && this.allowNull == "1") {
                    arr = [{ warehouseName: '无', id: '' }]
                }
                this.list = arr.concat(res.data.data)
            })
        }
    }
}
</script>