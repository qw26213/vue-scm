<template>
    <el-select v-model="curId" style="width:145px" :disabled="selectDisabled" placeholder="选择业务类型" size="small" @change="changeVal">
        <el-option v-for="item in list" :label="item.bizTypeName" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getBizType } from '@/api/basedata';
export default {
    name: 'list',
    props: ['selectId', 'disabled'],
    data() {
        return {
            list: [],
            curId: this.selectId,
            selectDisabled: this.disabled && this.disabled == 1 || false
        }
    },
    watch: {
        'selectId' () {
            this.curId = this.selectId
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        changeVal(val) {
            var obj = { bizTypeId: val }
            this.$emit('selectChange', obj)
        },
        getData() {
            getBizType().then(res => {
                this.list = res.data.data
            })
        }
    }
}
</script>