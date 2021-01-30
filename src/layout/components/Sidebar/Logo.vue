<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <div class="sidebar-logo-link">
      <img :src="logoUrl" class="sidebar-logo" />
      <img v-show="!collapse" class="sidebar-title" :src="logoName" />
    </div>
  </div>
</template>

<script>
import logoUrl from '@/assets/favicon_01.png';
import logoName from '@/assets/favicon_02.png';
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '丰扬快销管理系统',
      logoUrl: logoUrl,
      logoName: logoName
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      margin-right: 5px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      height: 28px;
      width: 97px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
