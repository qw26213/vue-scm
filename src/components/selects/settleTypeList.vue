<template>
  <el-select v-model="curCode" style="width:145px" size="mini" placeholder="请选择结算方式" class="filter-settleType" @change="changeVal">
    <el-option v-for="settleType in settleTypeList" :key="settleType.id" :label="settleType.settleTypeName" :value="settleType.settleTypeCode">
    </el-option>
  </el-select>
</template>
<script>
import { getAllNoADVR } from '@/api/basedata'
export default {
    name: 'settleTypeList',
    props: ['selectCode','selectName','selectArap','index'],
    data(){
      return {
        listQuery: {
          page: 1,
          settleTypeCode: '',
          settleTypeName: ''
        },
        curArAp:'',
        curCode:this.selectCode,
        curName:'',
        curIndex:this.index,
        settleTypeList:[]
      }
    },
    mounted(){
      this.getList('');
    },
    methods: {
        changeVal(val){
          this.curCode = val;
          for(var i=0;i<this.settleTypeList.length;i++){
            if(this.settleTypeList[i].settleTypeCode==this.curCode){
              this.curName = this.settleTypeList[i].settleTypeName
              this.curArAp = this.settleTypeList[i].arAp
            }
          }
          var obj = {
            settleTypeCode:this.curCode,
            settleTypeName:this.curName,
            arAp:this.curArAp,
            index:this.curIndex
          }
          this.$emit('settleTypeChange',obj)
        },
        searchThis(e){
            this.getList(e.target.value);
        },
        getList(name){
          this.listQuery.settleTypeName = name;
          getAllNoADVR(this.listQuery).then(res => {
            this.settleTypeList = res.data.data;
          })
        },
        remoteGet(query) {
          if (query !== '') {
            this.getList(query);
          } else {
            this.settleTypeList = [];
          }
        },
        getData() {
            getCust(this.listQuery).then(res => {
                this.settleTypeList = res.data.data
            })
        }
    }
}
</script>