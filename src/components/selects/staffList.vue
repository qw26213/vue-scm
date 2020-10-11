<template>
    <el-select v-model="curId" style="width:145px" :disabled="selectDisabled" placeholder="选择业务员" size="small" @change="changeVal">
        <el-option v-for="item in list" :label="item.staffName" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getDept, getStaff, getTrunk, getWarehouse } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId', 'ctrType', 'disabled'],
    data() {
        return {
            list: [],
            selectDisabled: this.disabled && this.disabled == 1 || false,
            curId: this.selectId,
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
            var obj = { staffId: val }
            this.$emit('selectChange', obj)
        },
        getData() {
            var arr = []
            getStaff().then(res => {
                if (this.ctrType == "list") {
                    arr = [{ staffName: '全部业务员', id: 'null' }]
                }
                this.list = arr.concat(res.data.data)
            }).catch(err => {
                this.list = arr;
            })
        }
    }
}
</script>