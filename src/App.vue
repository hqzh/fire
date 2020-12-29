<template>
    <div class="root">
        <div id="map"></div>
        <!-- 搜索结果列表容器 -->
        <div id="panel"></div>
        <!-- 搜索框 -->
        <div id="search">
            <a-input-search
                v-model="input"
                placeholder="请输入关键字"
                enter-button
                @search="onSearch"
                @change="onSearch"
            />
        </div>
    </div>
</template>

<script>
import AMap from 'AMap';
export default {
    data() {
        return {
            input: '',
            map: null,
            buildingLayer: null,
            placeSearch: null,
            options: {
                hideWithoutStyle: false, //是否隐藏设定区域外的楼块
                areas: [
                    {
                        //围栏1
                        //visible:false,//是否可见
                        rejectTexture: true, //是否屏蔽自定义地图的纹理
                        color1: 'ff990000', //楼顶颜色
                        color2: 'ffffcc00', //楼面颜色
                        path: [
                            [116.473606, 39.995997],
                            [116.473005, 39.995482],
                            [116.472442, 39.994971],
                            [116.472267, 39.994801],
                            [116.471307, 39.995442],
                            [116.471242, 39.995446],
                            [116.471163, 39.995403],
                            [116.4703, 39.994639],
                            [116.469916, 39.994315],
                            [116.469194, 39.993719],
                            [116.469032, 39.993863],
                            [116.468815, 39.994108],
                            [116.468625, 39.994355],
                            [116.468471, 39.99466],
                            [116.468421, 39.994811],
                            [116.468366, 39.995156],
                            [116.468306, 39.996157],
                            [116.468308, 39.996557],
                            [116.468483, 39.996884],
                            [116.468834, 39.997188],
                            [116.469481, 39.997764],
                            [116.470511, 39.998708],
                            [116.471404, 39.999517],
                            [116.471553, 39.999568],
                            [116.471713, 39.999563],
                            [116.471929, 39.999463],
                            [116.473228, 39.998584],
                            [116.474008, 39.998046],
                            [116.474541, 39.997674],
                            [116.474541, 39.997576],
                            [116.474604, 39.997049],
                            [116.474586, 39.996895],
                            [116.474179, 39.996516],
                            [116.473585, 39.995997],
                            [116.473606, 39.995997],
                        ],
                    },
                    {
                        //围栏2
                        color1: 'ff99ff00',
                        color2: 'ff999900',
                        path: [
                            [116.474609, 39.993478],
                            [116.474489, 39.993495],
                            [116.473693, 39.994009],
                            [116.472898, 39.994546],
                            [116.472837, 39.9946],
                            [116.4728, 39.994653],
                            [116.472779, 39.994745],
                            [116.47282, 39.994815],
                            [116.47491, 39.99655],
                            [116.475041, 39.996607],
                            [116.47525, 39.996643],
                            [116.475715, 39.996686],
                            [116.475947, 39.996688],
                            [116.476103, 39.996658],
                            [116.477228, 39.995932],
                            [116.477261, 39.995833],
                            [116.477264, 39.995729],
                            [116.477205, 39.995625],
                            [116.47642, 39.994899],
                            [116.474854, 39.993558],
                            [116.47469, 39.99348],
                            [116.474609, 39.993478],
                        ],
                    },
                ],
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        onSearch() {
            if (!this.input || this.input.trim().length === 0) {
                this.placeSearch.render.clearPanel();
                return;
            }
            this.placeSearch.search(this.input);
        },
        onSelect(e) {
            //这里获得点选地点的经纬度
            let location = e.selected.data.location;
            console.log('lng', location.lng);
            console.log('lat', location.lat);
            // Do Something
        },
        async init() {
            this.buildingLayer = new AMap.Buildings({
                zIndex: 130,
                merge: false,
                sort: false,
                zooms: [17, 20], //可见级别范围
            });
            this.map = new AMap.Map('map', {
                center: [102.769872, 25.04942],
                // center: [116.472268, 39.995693],
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
                layers: [new AMap.TileLayer(), this.buildingLayer],
            });
            this.map.setMapStyle('amap://styles/fresh');
            // 3D效果和下面的控件 需要1.4.0以上的版本
            this.map.addControl(
                new AMap.ControlBar({
                    showZoomBar: false,
                    showControlButton: true,
                    position: {
                        right: '10px',
                        top: '10px',
                    },
                })
            );

            this.map.addControl(new AMap.Scale());
            this.setBuildStyle();
            this.searchAddress();
        },
        searchAddress() {
            //构造地点查询类
            this.placeSearch = new AMap.PlaceSearch({
                pageSize: 5, // 单页显示结果条数
                pageIndex: 1, // 页码
                city:'昆明市',
                citylimit:true,// 只搜所在城市
                map: this.map, // 展现结果的地图实例
                panel: 'panel', // 结果列表将在此容器中进行展示。
                autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                renderStyle: 'newpc',
                type:
                    '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
            });
            // 添加列表点选监听事件
            AMap.event.addListener(
                this.placeSearch,
                'selectChanged',
                this.onSelect
            );
        },
        setBuildStyle() {
            this.buildingLayer.setStyle(this.options); //此配色优先级高于自定义mapStyle

            new AMap.Polygon({
                bubble: true,
                fillOpacity: 0.4,
                strokeWeight: 1,
                path: this.options.areas[0].path,
                map: this.map,
            });
            new AMap.Polygon({
                bubble: true,
                fillColor: 'green',
                fillOpacity: 0.2,
                strokeWeight: 1,
                path: this.options.areas[1].path,
                map: this.map,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.wh {
    height: 100%;
    width: 100%;
}
.root {
    .wh;
    #map {
        .wh;
    }
    #panel {
        position: absolute;
        background-color: white;
        max-height: 90%;
        overflow-y: auto;
        top: 50px;
        left: 15px;
        width: 280px;
    }
    #search {
        position: absolute;
        top: 15px;
        left: 15px;
        background: #fff;
        width: 280px;
    }
}
</style>
