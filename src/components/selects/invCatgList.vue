<template>
    <el-select v-model="curId" style="width:150px" placeholder="选择品类" size="mini" @change="changeVal">
        <el-option v-for="item in resdata" :label="item.invCatgCode" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getInvCatg } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','index','resdata'],
    data(){
      return {
        curName:'',
        curCode:'',
        curId:this.selectId,
      }
    },
    watch:{
        'selectId'() {
            this.curId = this.selectId
        }
    },
    methods: {
        changeVal(val){
            for(var i=0;i<this.resdata.length;i++){
                if(this.resdata[i].id==val){
                  this.curName = this.resdata[i].invCatgName;
                  this.curCode = this.resdata[i].invCatgCode;
                }
            }
            var obj = {invCatgId:val,invCatgCode:this.curCode,invCatgName:this.curName,index:this.index}
            this.$emit('changeVal',obj)
        }
    }
}
</script>