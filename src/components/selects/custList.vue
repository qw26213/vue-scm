<template>
    <el-select v-model="curId" style="width:145px" filterable :remote="isRemote" :disabled="selectDisabled" :remote-method="remoteGet" size="mini" @change="changeVal" placeholder="选择客户">
        <el-option v-for="item in custList" :key="item.id" :label="item.custName" :value="item.id" />
    </el-select>
</template>
<script>
import { getCust } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId', 'selectName', 'keyType', 'disabled', 'contact'],
    data() {
        return {
            listQuery: {
                pageIndex: 1,
                pageNum: 50,
                queryParam: {
                    custCode: '',
                    custName: ''
                }
            },
            isRemote: false,
            selectDisabled: this.disabled && this.disabled == 1 || false,
            curId: this.selectId,
            custList: []
        }
    },
    watch: {
        'selectId'() {
            this.curId = this.selectId
        }
    },
    created() {
        this.getCustList()
    },
    methods: {
        changeVal(val) {
            var obj = {}
            if (this.keyType) {
                obj[this.keyType] = val;
            } else {
                obj.custId = val;
            }
            if (this.contact) {
                this.custList.forEach(item => {
                    if(item.id === val) {
                        obj.settleCustId = val
                        obj.addr = (item.city ? item.city + '市' : '') + (item.district ? item.district + '区' : '') + item.addr
                        obj.contact = item.contact
                        obj.tel = item.tel
                    }
                })
            }
            this.$emit('selectChange', obj)
        },
        getCustList(name) {
            this.listQuery.queryParam.custName = name;
            getCust(this.listQuery).then(res => {
                this.custList = res.data.data;
            })
        },
        remoteGet(query) {
            if (query !== '') {
                this.getCustList(query);
            } else {
                this.custList = [];
            }
        },
        getData() {
            getCust(this.listQuery).then(res => {
                if (res.data.errorCode == 0) {
                    this.custList = res.data.data || []
                    this.isRemote = this.custList.length === 50
                }
            })
        }
    }
}
</script>