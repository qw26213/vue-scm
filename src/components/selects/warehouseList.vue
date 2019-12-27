<template>
    <el-select v-model="curId" style="width:145px" placeholder="请选择仓库" size="mini" @change="changeVal">
        <el-option v-for="item in list" :label="item.warehouseName" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getWarehouse } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','keyType','ctrType'],
    data() {
        return {
            list: [],
            curId: this.selectId,
            curName:''
        }
    },
    watch:{
        'selectId'() {
            this.curId = this.selectId
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        changeVal(val) {
            var obj = {}
            if(this.keyType){
                obj[this.keyType] = val;
            }else{
                obj.warehouseId = val;
            }
            this.$emit('selectChange', obj)
        },
        getData() {
            getWarehouse().then(res => {
                var arr = [];
                if(this.ctrType=="list"){
                    arr = [{warehouseName:'全部仓库',id:'null'}]
                }
                this.list = arr.concat(res.data.data)
            })
        }
    }
}
</script>