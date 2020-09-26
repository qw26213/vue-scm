<template>
  <el-select v-model="curId" style="width:145px" placeholder="选择部门" size="small" @change="changeVal">
    <el-option v-for="item in list" :label="item.deptName" :value="item.id" :key="item.id"></el-option>
  </el-select>
</template>
<script>
import { getDept} from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId'],
    data(){
      return {
        list:[],
        curId:this.selectId,
      }
    },
    watch:{
        selectId() {
            this.curId = this.selectId
        }
    },
    mounted(){
      this.getData();
    },
    methods: {
        changeVal(val){
            var obj = {deptId:val}
            this.$emit('selectChange',obj)
        },
        getData() {
            getDept().then(res => {
                this.list = res.data.data
            })
        }
    }
}
</script>