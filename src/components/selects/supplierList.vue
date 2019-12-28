<template>
  <el-select v-model="curId" style="width:145px" placeholder="选择供应商" size="mini" @change="changeVal">
    <el-option v-for="item in list" :label="item.supplierName" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import {getSupplier} from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','ctrType'],
    data(){
      return {
        list:[],
        curId:this.selectId,
      }
    },
    watch:{
        'selectId'() {
            this.curId = this.selectId
        }
    },
    mounted(){
      this.getData();
    },
    methods: {
        changeVal(val){
            var obj = {supplierId:val}
            this.$emit('selectChange',obj)
        },
        getData() {
            getSupplier().then(res => {
                var arr = [];
                if(this.ctrType=="list"){
                    arr = [{supplierName:'全部供应商',id:'null'}]
                }
                this.list = arr.concat(res.data.data)
            })
        }
    }
}
</script>