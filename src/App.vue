<template>
    <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
    <!-- </div> -->
</template>

<script>
export default {
    mounted() {
        if (this.$route.path === '/m-about') {
            return;
        }
        if (this.isMobile()) {
            console.log("mobile");
            this.$router.replace("/m").catch((err) => {
                err;
            });
        } else {
            console.log("pc");
            this.$router.replace("/").catch((err) => {
                err;
            });
        }
    },
    methods: {
        isMobile() {
            return navigator.userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
        },
    },
};
</script>

<style lang="less">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
</style>
