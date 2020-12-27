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
        async init() {
            let map = new AMap.Map('root', {
                center: [102.698418,25.042276],
                resizeEnable: true, //缩放
                rotateEnable: true, //地图是否可旋转
                pitchEnable: true, // 倾斜
                zoom: 17,
                // 地图俯仰角度，有效范围 0 度- 83 度
                pitch: 80,
                rotation: -15,
                viewMode: '3D', //开启3D视图,默认为关闭
                buildingAnimation: true, //楼块出现是否带动画
                // zooms 表示地图显示的缩放级别范围。在PC上，默认为[3,18]，取值范围[3-18]；在移动设备上，默认为[3,19],取值范围[3-19] 。
                // 当 expandZoomRange 为 true 时， zooms的最大级别在PC上可以扩大到20级（移动端还是高清19/非高清20 ）。
                expandZoomRange: true,
                zooms: [3, 20],
            });
            map.setMapStyle('amap://styles/fresh');
            // 3D效果和下面的控件 需要1.4.0以上的版本
            map.addControl(
                new AMap.ControlBar({
                    showZoomBar: false,
                    showControlButton: true,
                    position: {
                        right: '10px',
                        top: '10px',
                    },
                })
            );
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
