<template>
  <el-select v-model="curId" filterable size="mini" class="filter-item custInput" @change="changeVal" placeholder="">
    <el-option v-for="item in itemList" :key="item.id" :label="item.itemName" :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
export default {
    name: 'list',
    props: ['selectId','index','selectCode', 'itemList'],
    data(){
      return {
        curIndex:this.index,
        curId:this.selectId,
        curName:"",
        curSubUom:"",
        curExchangeRate:"",
        curSalePriceType: '',
        curCode:"",
        curNorms:"",
        curUom:"",
        curPrice: ''
      }
    },
    methods: {
        changeVal(val) {
          this.curId = val
          this.itemList.forEach(item => {
            if(item.id == this.curId){
              this.curCode = item.itemCode
              this.curName = item.itemName
              this.curNorms = item.norms
              this.curUom = item.uom
              this.curSubUom = item.subUom
              this.curExchangeRate = item.exchangeRate
              this.curSalePriceType = item.salePriceType
              this.curPrice = item.price
            }
          })
          var obj = {
            itemCode:this.curCode,
            itemName:this.curName,
            norms:this.curNorms,
            uom:this.curUom,
            itemId:this.curId,
            index:this.curIndex,
            subUom:this.curSubUom,
            exchangeRate:this.curExchangeRate,
            salePriceType:this.curSalePriceType,
            vatPrice:this.curPrice
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