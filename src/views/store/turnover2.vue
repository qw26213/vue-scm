<template>
    <div class="main">
        <div class="leftTree">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="tableDiv">
            <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
              <el-table-column label="序号" type="index" width="100" align="center">
              </el-table-column>
              <el-table-column label="商户名称">
                <template slot-scope="{row}">
                  <span>{{row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商户编号">
                <template slot-scope="{row}">
                  <span>{{row.number}}</span>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template slot-scope="{row}">
                  <span>{{row.type}}</span>
                </template>
              </el-table-column>
              <el-table-column label="所属BD">
                <template slot-scope="{row}">
                  <span>{{row.brand}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="230">
                <template slot-scope="{row}">
                  <el-button type="primary" size="mini" @click="toModify(row.id)">编辑</el-button>
                  <el-button type="default" size="mini" @click="toStore(row.id)">门店管理</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getList } from '@/api/data'
export default {
    data() {
        return {
            treeData: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1'
                    }]
                }]
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1'
                    }]
                }]
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1'
                    }]
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            listLoading:false,
            tableData: []
        }
    },
    methods: {
        handleNodeClick(data) {
          console.log(data);
        },
        getData() {
            this.tableData = getList();
        }
    },
    mounted() {
        this.getData();
    }
}
</script>
<style scoped>
.main {position: relative;width: 100%;height: 100%;padding: 10px 10px;padding-left: 180px;}
.leftTree {width: 160px;height: 100%;background-color: #fff;position: absolute;top: 10px;left: 10px;border:1px #eee solid;}
.tableDiv {width: 100%;}
</style>