<template>
  <el-select v-model="curId" style="width:145px" filterable remote reserve-keyword :remote-method="remoteGet" size="mini" @focus="searchThis($event)" @change="changeVal" placeholder="请选择客户">
    <el-option v-for="item in custList" :key="item.id" :label="item.custName" :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
import { getCust } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','selectName','keyType'],
    data(){
      return {
        listQuery: {
          pageIndex: 1,
          pageNum: 50,
          queryParam:{
            custCode: '',
            custName: ''
          }
        },
        curId:this.selectId,
        custList:[]
      }
    },
    watch:{
      'selectId'(){
        if(this.selectId!=''){
          this.custList=[{custName:this.selectName,id:this.selectId}]
          this.curId = this.selectId
        }
      }
    },
    methods: {
        changeVal(val){
            var obj = {}
            if(this.keyType){
              obj[this.keyType] = val;
            }else{
              obj.custId = val;
            }
            this.$emit('selectChange',obj)
        },
        searchThis(e){
            this.getCustList(e.target.value);
        },
        getCustList(name){
          this.listQuery.queryParam.custName = name;
          getCust(this.listQuery).then(res => {
            this.custList = res.data.data;
          })
        },
        remoteGet(query) {
          if (query !== '') {
            this.getCustList(query);
          } else {
            this.custList = [];
          }
        },
        getData() {
            getCust(this.listQuery).then(res => {
                this.custList = res.data.data
            })
        }
    }
}
</script>