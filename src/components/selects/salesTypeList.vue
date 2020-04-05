<template>
    <el-select v-model="salesTypeCode" style="width:145px" placeholder="销售方式" size="mini" @change="changeVal">
        <el-option v-for="item in salesTypeArr" :key="item.id" :label="item.salesTypeName" :value="item.salesTypeCode"></el-option>
    </el-select>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'list',
    props: ['selectId'],
    data(){
      return {
        list:[],
        salesTypeCode:this.selectId,
      }
    },
    computed: {
        ...mapGetters([
          'salesTypeArr'
        ])
    },
    watch:{
        'selectId'() {
            this.salesTypeCode = this.selectId
        }
    },
    methods: {
        changeVal(val){
            var obj = {paymentTypeId:val}
            this.$emit('selectChange',obj)
        }
    }
}
</script>