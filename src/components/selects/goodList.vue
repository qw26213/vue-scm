<template>
  <el-select v-model="curId" filterable remote reserve-keyword :remote-method="remoteGet" size="small" @change="changeVal" placeholder="选择商品">
    <el-option v-for="item in itemList" :key="item.id" :label="item.itemName" :value="item.id" />
  </el-select>
</template>
<script>
import { getItem } from '@/api/basedata'
export default {
    name: 'list',
    data(){
      return {
        listQuery: {
          pageIndex: 1,
          pageNum: 50,
          queryParam:{
            itemCode: '',
            itemName: ''
          }
        },
        curIndex:this.index,
        curId:this.selectId,
        curName:"",
        itemList: []
      }
    },
    created() {
      this.getItemList('')
    },
    methods: {
        getItemList(name){
          this.listQuery.queryParam.itemCode = name
          getItem(this.listQuery).then(res => {
            this.itemList = res.data.data;
          })
        },
        remoteGet(query) {
          if (query !== '') {
            this.getItemList(query);
          } else {
            this.itemList = [];
          }
        },
        getData() {
          getItem().then(res => {
            this.itemList = res.data.data
          })
        },
        changeVal(val){
          this.curId = val;
          for(var i=0;i<this.itemList.length;i++){
            if(this.itemList[i].id==this.curId){
              this.curName = this.itemList[i].itemName
            }
          }
          var obj = {
            itemName:this.curName,
            itemId:this.curId
          }
          this.$emit('changeVal',obj)
        }
    }
}
</script>
