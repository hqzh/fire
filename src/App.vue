<template>
    <div class="root" id="root"></div>
</template>

<script>
import AMap from 'AMap';
export default {
    mounted() {
        this.init();
    },
    methods: {
        init() {
            new AMap.Map('root', {
                center: [102.712251, 25.040609],
                resizeEnable: true,
                zoom: 10,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.root {
    height: 100%;
    width: 100%;
}
</style>
