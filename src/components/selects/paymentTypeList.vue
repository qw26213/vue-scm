<template>
    <el-select v-model="curId" style="width:145px" placeholder="选择付款方式" size="small" @change="changeVal">
        <el-option v-for="item in list" :label="item.paymentTypeName" :key="item.id" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getPaymentType } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId'],
    data() {
        return {
            list: [],
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
            var obj = { paymentTypeId: val }
            this.$emit('selectChange', obj)
        },
        getData() {
            getPaymentType().then(res => {
                var data = res.data.data;
                this.list = [{ paymentTypeName: '无', id: '' }, ...data]
            })
        }
    }
}
</script>