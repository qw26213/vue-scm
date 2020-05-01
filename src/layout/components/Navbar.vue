<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <div class="right-menu">
            <template v-if="device!=='mobile'">
                <search id="header-search" class="right-menu-item" title="搜索" />
                <help class="right-menu-item" title="帮助" />
                <qq class="right-menu-item" title="在线客服" />
                <screenfull id="screenfull" class="right-menu-item hover-effect" title="全屏" />
            </template>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <span class="user-name">{{name}}</span>
                    <i style="vertical-align: middle;" class="el-icon-arrow-down" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <span @click="$router.push('/user')">账户信息</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <span @click="handlePwd">修改密码</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <span style="display:block;" @click="logout">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
            <el-form ref="dataForm" :rules="rules" :model="pswForm" label-position="left" label-width="96px">
                <el-form-item label="原密码" prop="oldPsw">
                    <el-input type="password" v-model="pswForm.oldPsw" placeholder="原密码" />
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="pswForm.password" placeholder="新密码" />
                </el-form-item>
                <el-form-item label="确认新密码" prop="againPassword">
                    <el-input type="password" v-model="pswForm.againPassword" placeholder="确认新密码" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="savePsw">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="温馨提示" :visible.sync="dialogFormVisible2" width="600px">
            <div class="msgDiv" v-for="(item,index) in messagelist" :key="index">
                <div class="tit">• {{item.sender}}消息 <span class="time">{{item.sentDate}}</span></div>
                <div class="con" v-html="item.content"></div>
            </div>
            <div slot="footer" class="dialog-footer" align="right">
                <el-checkbox v-model="isTodayShow" style="float:left;margin-right:5px;font-size:12px">今天不再显示</el-checkbox>
                <el-button type="primary" @click="closeModal" size="mini">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { updatePSW, getMessage } from "@/api/user";
import userImg from "@/assets/user.png";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import qq from "@/components/qq";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import help from "@/components/help";
import { setToken, getToken } from "@/utils/auth";
import Cookies from "js-cookie";
export default {
    components: {
        Breadcrumb,
        Hamburger,
        qq,
        Screenfull,
        SizeSelect,
        Search,
        help
    },
    data() {
        return {
            avatar: userImg,
            dialogFormVisible: false,
            dialogFormVisible2: false,
            isTodayShow: false,
            messagelist: [],
            id: "",
            pswForm: {
                oldPsw: "",
                password: "",
                againPassword: ""
            },
            rules: {
                oldPsw: [
                    { required: true, message: "原密码不能为空", trigger: "change" }
                ],
                password: [
                    { required: true, message: "新密码不能为空", trigger: "change" }
                ],
                againPassword: [
                    { required: true, message: " 确认新密码不能为空", trigger: "change" }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(["sidebar", "device", "name"])
    },
    created() {
        if (!Cookies.get("msgModal")) {
            getMessage().then(res => {
                this.messagelist = res.data.data || []
                this.dialogFormVisible2 = this.messagelist.length > 0 ? true : false
            });
        }    
    },
    methods: {
        closeModal() {
            if (this.isTodayShow) {
                Cookies.set("msgModal", "1", { expires: 1, path: "/" });
            }
            this.dialogFormVisible2 = false;
        },
        savePsw() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.pswForm.password != this.pswForm.againPassword) {
                        this.$message.warning("新密码两次输入不一致");
                        return;
                    }
                    this.pswForm.id = this.id;
                    updatePSW(this.pswForm).then(res => {
                        if (res.data.errorCode == 0) {
                            this.dialogFormVisible = false;
                            this.$message.success("密码修改成功");
                        } else this.$message.error(res.data.msg);
                    });
                }
            });
        },
        handlePwd() {
            this.dialogFormVisible = true;
            this.temp.oldPsw = "";
            this.temp.password = "";
            this.temp.againPassword = "";
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        logout() {
            this.$store.dispatch("user/logout").then(() => {
                this.$router.push({ path: "/login" });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            cursor: pointer;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    border-radius: 15px;
                    vertical-align: middle;
                }
                .user-name {
                    font-size: 14px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}

.msgDiv {
    max-height: 500px;
    overflow: auto;
    padding-bottom: 15px;
}

.msgDiv .tit {
    color: #333;
    font-size: 14px;
    text-align: left;
    font-weight: bold;
}

.msgDiv .con {
    color: #333;
    font-size: 14px;
    text-align: justify;
    margin-top: 10px;
}

.msgDiv .time {
    float:right;
    color: #999;
    font-size: 13px;
    text-align: right;
    padding-top:3px
}
</style>