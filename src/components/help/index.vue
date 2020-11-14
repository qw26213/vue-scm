<template>
  <div class="icon" @click="click">
    <span class="qq_icon"></span>
    <span class="qq_txt">帮助</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      this.$router.push('/help')
    }
  }
}
</script>

<style scoped>
.qq_icon {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  background: url(../../assets/help.png) no-repeat center center;background-size: 100% 100%;
}
.qq_txt {
  font-size: 14px;
  color: #666;
}
.icon:hover .qq_txt {
  color: #1989fa;
}
</style>
