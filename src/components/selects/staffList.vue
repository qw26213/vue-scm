<template>
    <el-select v-model="curId" style="width:145px" placeholder="请选择业务员" size="mini" @change="changeVal">
        <el-option v-for="item in list" :label="item.staffName" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getDept, getStaff,getTrunk,getWarehouse } from '@/api/basedata'
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
            var obj = {staffId:val}
            this.$emit('selectChange',obj)
        },
        getData() {
            var arr = [];
            getStaff().then(res => {
                if(this.ctrType=="list"){
                    arr = [{staffName:'全部员工',id:'null'}]
                }
                this.list = arr.concat(res.data.data)
            }).catch(err=>{
                this.list = arr;
            })
        }
    }
}
</script>