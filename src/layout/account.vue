<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>
<script>
export default {
    name: 'account',
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews
        },
        key() {
            return this.$route.path
        }
    },
    created() {
        const route = this.$route.matched.find(item => item.name === this.$options.name)
        this.$store.dispatch('tagsView/addCachedView', route)
    }
}
</script>