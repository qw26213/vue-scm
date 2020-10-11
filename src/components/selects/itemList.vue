<template>
  <el-select v-model="curId" filterable remote reserve-keyword :remote-method="remoteGet" size="small" class="filter-item custInput" @focus="searchThis($event)" @change="changeVal" placeholder="">
    <el-option v-for="item in itemList" :key="item.id" :label="item.itemCode + ' ' + item.itemName" :value="item.id" />
  </el-select>
</template>
<script>
import { getItem } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','index','selectCode'],
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
        curSubUom: '',
        curExchangeRate: '',
        curSalePriceType: '',
        curCode: '',
        curNorms: '',
        curUom: '',
        itemList: []
      }
    },
    watch:{
      'selectCode'(){
        this.itemList=[{itemCode:this.selectCode, id:this.selectId}]
        this.curId = this.selectCode
      }
    },
    methods: {
        searchThis(e){
            this.getItemList(e.target.value);
        },
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
              this.curNorms = this.itemList[i].norms
              this.curUom = this.itemList[i].uom
              this.curSubUom = this.itemList[i].subUom
              this.curExchangeRate = this.itemList[i].exchangeRate
              this.curSalePriceType = this.itemList[i].salePriceType
            }
          }
          var obj = {
            norms:this.curNorms,
            uom:this.curUom,
            itemId:this.curId,
            index:this.curIndex,
            subUom:this.curSubUom,
            exchangeRate:this.curExchangeRate,
            salePriceType:this.curSalePriceType
          }
          this.$emit('changeVal',obj)
        }
    }
}
</script>
<style lang="scss">
.custInput{width:100%;}
.custInput input{border:none;width: 100%;display: block;}
</style>