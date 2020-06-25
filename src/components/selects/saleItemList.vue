<template>
  <el-select v-model="curId" filterable remote reserve-keyword :remote-method="remoteGet" size="mini" class="filter-item custInput" @focus="searchThis($event)" @change="changeVal" placeholder="">
    <el-option v-for="item in itemList" :key="item.id" :label="item.itemName" :value="item.id">
    </el-option>
  </el-select>
</template>
<script>
import { getResPageByFuzzyCustId } from '@/api/store'
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
        curName:"",
        curSubUom:"",
        curExchangeRate:"",
        curSalePriceType: '',
        curCode:"",
        curNorms:"",
        curUom:"",
        itemList:[]
      }
    },
    watch:{
      'selectCode'() {
        this.itemList=[{itemCode:this.selectCode,id:this.selectId}]
        this.curId = this.selectCode
      }
    },
    methods: {
        searchThis(e){
            this.getItemList(e.target.value);
        },
        getItemList(name) {
          this.listQuery.queryParam.itemName = name
          getResPageByFuzzyCustId(this.listQuery).then(res => {
            this.itemList = res.data.data;
          })
        },
        remoteGet(query) {
          if (query !== '') {
            this.getItemList(query)
          } else {
            this.itemList = []
          }
        },
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