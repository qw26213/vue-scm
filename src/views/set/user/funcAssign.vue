<template>
    <el-dialog title="编辑权限" :visible.sync="option.show" :close-on-click-modal="false" width="480px">
        <el-form ref="dataForm" label-position="left" label-width="70px">
            <el-form-item label="当前角色" prop="name" style="margin-bottom:0">
                <span>{{option.roleName}}</span>
            </el-form-item>
            <el-form-item label="权限选择" prop="name">
                <el-tree ref="roleTree" empty-text="暂无节点数据" :data="treeData" :default-expanded-keys="expandedKeys" show-checkbox node-key="id" :props="defaultProps" accordion />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
            <el-button @click="option.show = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="updateData()">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getFuncButtonListByRoleId, updateRoleIdByFuncButtonIdList } from '@/api/user'
export default {
    name: 'funcAssign',
    props: ['treeData', 'option'],
    data() {
        return {
            loading: false,
            expandedKeys: ['APPS11', 'APPS12'],
            curItemId: '',
            dialogStatus: '',
            listLoading: false,
            permissionIdList: [],
            dialogFormVisible: false,
            defaultProps: {
                children: 'children',
                label: 'funcName'
            }
        }
    },
    watch: {
        'option.show'(val) {
          if (val) {
            this.$nextTick(() => {
              this.$refs.roleTree.setCheckedKeys([])
              this.getRoleInfo(this.option.roleId)
            })
          }
        }
    },
    methods: {
        getCheckedNodes() {
            var permission = []
            var roles = this.$refs.roleTree.getCheckedNodes()
            roles.forEach(item => {
                permission.push(item.id)
            })
            return permission
        },
        updateData() {
            let obj = {
                funcButtonIdList: this.getCheckedNodes(),
                roleId: this.option.roleId
            };
            obj.id = this.curItemId
            this.loading = true
            updateRoleIdByFuncButtonIdList(obj).then(res => {
                this.loading = false
                if (res.data.errorCode == 0) {
                    this.$emit('update:showModal', false)
                    this.$message.success('该角色权限已更新')
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        getRoleInfo(id) {
            getFuncButtonListByRoleId({ roleId: id }).then(res => {
                var permission = []
                const roles = res.data.data
                roles.forEach(item => {
                    permission.push(item.id)
                })
                this.$refs.roleTree.setCheckedKeys(permission)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.edit-input {
    padding-right: 100px;
}

/deep/.el-dialog__body {
    min-height: 360px;
    max-height: 600px;
    padding-left: 10px;
    padding-right: 10px;
    overflow: auto;
}

.cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
}
</style>