<template>
  <el-select v-model="curId" style="border:none;width: 100%;display: block;" placeholder="" size="mini" @change="changeVal">
      <el-option v-for="item in datalist" :label="item.truckName" :value="item.id"></el-option>
  </el-select>
</template>
<script>
import { getItem } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId','index', 'datalist'],
    data(){
      return {
        curIndex:this.index,
        curId:this.selectId,
        curName:"",
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
        changeVal(val){
          this.curId = val;
          for(var i=0;i<this.itemList.length;i++){
            if(this.itemList[i].id==this.curId){
              this.curCode = this.itemList[i].itemCode
              this.curName = this.itemList[i].itemName
              this.curNorms = this.itemList[i].norms
              this.curUom = this.itemList[i].uom
              this.curSubUom = this.itemList[i].subUom
              this.curExchangeRate = this.itemList[i].exchangeRate
              this.curSalePriceType = this.itemList[i].salePriceType
            }
          }
          var obj = {
            itemCode:this.curCode,
            itemName:this.curName,
            norms:this.curNorms,
            uom:this.curUom,
            itemId:this.curId,
            index:this.curIndex,
            subUom:this.curSubUom,
            exchangeRate:this.curExchangeRate,
            salePriceType:this.curSalePriceType
          }
          this.$emit('selectChange',obj)
        }
    }
}
</script>
<style lang="scss">
.custInput{width:100%;}
.custInput input{border:none;width: 100%;display: block;}
</style>