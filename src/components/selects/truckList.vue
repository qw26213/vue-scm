<template>
    <el-select v-model="curId" style="width:145px" :placeholder="placeholderTxt" size="mini" @change="changeVal">
        <el-option v-for="item in list" :label="item.truckName" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import {getTruck} from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','keyType','ctrType','placeTxt'],
    data(){
      return {
        list:[],
        curId:this.selectId,
        placeholderTxt:'',
        curName:''
      }
    },
    watch:{
        'selectId'() {
            this.curId = this.selectId
        }
    },
    mounted(){
        this.getData();
        if(this.placeTxt){
            this.placeholderTxt = this.placeTxt
        }else{
            this.placeholderTxt = "选择车辆"
        }
    },
    methods: {
        changeVal(val){
            var obj = {}
            obj[this.keyType] = val;
            this.$emit('selectChange',obj)
        },
        getData() {
            var arr = [];
            getTruck().then(res => {
                if(this.ctrType=="list"){
                    arr = [{truckName:'全部车辆',id:'null'}]
                }
                this.list = arr.concat(res.data.data)
            }).catch(err=>{
                this.list = arr;
            })
        }
    }
}
</script>