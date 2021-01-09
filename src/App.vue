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
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';

export default {
    data() {
        return {
            input: '大商园建材城办公大楼',
            map: null,
            buildingLayer: null,
            placeSearch: null,
            marker: null,
            options: {
                hideWithoutStyle: false, //是否隐藏设定区域外的楼块
                areas: [
                    {
                        //visible:false,//是否可见
                        rejectTexture: true, //是否屏蔽自定义地图的纹理
                        color1: 'ff99ff00', //楼顶颜色
                        color2: 'ff999900', //楼面颜色
                        path: [
                            [102.705917, 24.985819],
                            [102.708121, 24.985765],
                            [102.70861, 24.987063],
                            [102.706249, 24.987165],
                            [102.705917, 24.985819],
                        ],
                    },
                    {
                        color1: 'ff99ff00',
                        color2: 'ff999900',
                        path: [
                            [102.703621, 24.985043],
                            [102.705257, 24.984921],
                            [102.704834, 24.983521],
                            [102.703482, 24.983944],
                            [102.703621, 24.985043],
                        ],
                    },
                ],
            },
            markers: [
                [102.70571, 24.98466],
                [103.258265, 25.543077],
                [103.186049, 26.075335],
                [103.037529, 25.32561],
                [102.497359, 25.217404],
                [102.455077, 24.946699],
                [102.592422, 24.671623],
                [103.151339, 24.921936],
                [103.28623, 24.779472],
            ],
        };
    },
    mounted() {
        this.init();
    },
    methods: {
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
        async init() {
            this.buildingLayer = new AMap.Buildings({
                zIndex: 130,
                merge: false,
                sort: false,
                zooms: [17, 20], //可见级别范围
            });
            this.map = new AMap.Map('map', {
                // center: [102.706208, 24.986864],
                center: [102.833722, 25.43539],
                resizeEnable: true, //缩放
                rotateEnable: true, //地图是否可旋转
                pitchEnable: true, // 倾斜
                zoom: 9,
                // // 地图俯仰角度，有效范围 0 度- 83 度
                // pitch: 80,
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

            // 如果调不好光照的话，后面取消，让建筑模型通红
            // 设置地图的环境光源(color,intensity)
            // color用来描述光照的颜色，为一个三个元素的数组，每个元素代表RGB的三个分量，每个分量的取值范围[0,1]；
            // intensity用来描述光照强度，取值范围[0,1]；

            this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 1);
            // 设置地图的平行光照(direction,color,intensity)
            // direction用来描述光的照射方向，为一个三个元素的数组，分别代表方向的xyz分量。direction为相对于地图平面的方向，x 正方向朝东，y 正方向朝南，z 正方向朝下
            // color用来描述光照的颜色，为一个三个元素的数组，每个元素代表RGB的三个分量，每个分量的取值范围[0,1]；
            // intensity用来描述光照强度，取值范围[0,1]；
            // 如下: 描述了一个从正南方斜向下照射的一道平行光
            // var dir = new M.Lights.DirectionLight([0, -1, 1],[1, 1, 1],0.1)
            this.map.DirectionLight = new AMap.Lights.DirectionLight(
                [1, 0, -0.5],
                [1, 1, 1],
                1
            );
            this.setBuildModel();
            this.setTruckModel();
            this.setLine();
            this.setMark();
            this.setTruck();
        },
        setMark() {
            var icon = new AMap.Icon({
                size: new AMap.Size(62, 47),
                image: '/static/fire.gif',
                imageSize: new AMap.Size(62, 47),
            });
            const markers = this.markers.map((item) => {
                const m = new AMap.Marker({
                    position: new AMap.LngLat(...item),
                    icon: icon,
                    offset: new AMap.Pixel(-30, -23),
                });
                m.on('click', (e) => {
                    console.log(e);
                    // 清除地图覆盖物
                    this.map.clearMap();
                    //动态设置地图中心点和展示层级
                    this.map.setZoomAndCenter(18, [102.70571, 24.98466]);
                    // 动态设置俯仰度
                    this.map.setPitch(80);
                });
                return m;
            });

            // 将 markers 添加到地图
            this.map.add(markers);
        },
        setTruckModel() {
            var modelName = 'building';
            var objLoader = new OBJLoader2();
            var callbackOnLoad = (event) => {
                var object3Dlayer = new AMap.Object3DLayer();
                var meshes = event.children;
                for (var i = 0; i < meshes.length; i++) {
                    var vecticesF3 = meshes[i].geometry.attributes.position;
                    var vecticesNormal3 = meshes[i].geometry.attributes.normal;
                    var vecticesUV2 = meshes[i].geometry.attributes.uv;

                    var vectexCount = vecticesF3.count;

                    const mesh = new AMap.Object3D.MeshAcceptLights();
                    var geometry = mesh.geometry;

                    //底部一圈
                    // debugger

                    var c, opacity;

                    var material = meshes[i].material[0] || meshes[i].material;
                    // debugger
                    // if (material.map)  建筑瓷砖
                    mesh.textures.push('/static/model/bus.jpg');

                    c = material.color;
                    opacity = material.opacity;

                    // debugger
                    for (var j = 0; j < vectexCount; j += 1) {
                        var s = j * 3;
                        geometry.vertices.push(
                            vecticesF3.array[s],
                            vecticesF3.array[s + 2],
                            -vecticesF3.array[s + 1]
                        );

                        if (vecticesNormal3) {
                            geometry.vertexNormals.push(
                                vecticesNormal3.array[s],
                                vecticesNormal3.array[s + 2],
                                -vecticesNormal3.array[s + 1]
                            );
                        }
                        if (vecticesUV2) {
                            geometry.vertexUVs.push(
                                vecticesUV2.array[j * 2],
                                1 - vecticesUV2.array[j * 2 + 1]
                            );
                        }
                        geometry.vertexColors.push(c.r, c.g, c.b, opacity);
                    }
                    // debugger
                    mesh.DEPTH_TEST = material.depthTest;
                    // mesh.backOrFront = 'both'
                    mesh.transparent = opacity < 1;
                    mesh.scale(6, 6, 6);
                    mesh.rotateZ(-48);
                    mesh.position(new AMap.LngLat(102.705485,24.983756));
                    object3Dlayer.add(mesh);
                }
                this.map.add(object3Dlayer);
            };
            var onLoadMtl = function(materials) {
                objLoader.setModelName(modelName);
                objLoader.addMaterials(materials);
                objLoader.load(
                    '/static/model/bus.obj',
                    callbackOnLoad,
                    null,
                    null,
                    null,
                    false
                );
            };
            objLoader.load(
                '/static/model/bus.mtl',
                // null,
                onLoadMtl
            );
        },
        setBuildModel() {
            var modelName = 'building';
            var objLoader = new OBJLoader2();
            var callbackOnLoad = (event) => {
                var object3Dlayer = new AMap.Object3DLayer();
                var meshes = event.children;
                for (var i = 0; i < meshes.length; i++) {
                    var vecticesF3 = meshes[i].geometry.attributes.position;
                    var vecticesNormal3 = meshes[i].geometry.attributes.normal;
                    var vecticesUV2 = meshes[i].geometry.attributes.uv;

                    var vectexCount = vecticesF3.count;

                    const mesh = new AMap.Object3D.MeshAcceptLights();
                    var geometry = mesh.geometry;

                    //底部一圈
                    // debugger

                    var c, opacity;

                    var material = meshes[i].material[0] || meshes[i].material;
                    // debugger
                    // if (material.map)  建筑瓷砖
                    mesh.textures.push(
                        'https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.bmp'
                    );

                    c = material.color;
                    opacity = material.opacity;

                    // debugger
                    for (var j = 0; j < vectexCount; j += 1) {
                        var s = j * 3;
                        geometry.vertices.push(
                            vecticesF3.array[s],
                            vecticesF3.array[s + 2],
                            -vecticesF3.array[s + 1]
                        );

                        if (vecticesNormal3) {
                            geometry.vertexNormals.push(
                                vecticesNormal3.array[s],
                                vecticesNormal3.array[s + 2],
                                -vecticesNormal3.array[s + 1]
                            );
                        }
                        if (vecticesUV2) {
                            geometry.vertexUVs.push(
                                vecticesUV2.array[j * 2],
                                1 - vecticesUV2.array[j * 2 + 1]
                            );
                        }
                        geometry.vertexColors.push(c.r, c.g, c.b, opacity);
                    }
                    // debugger
                    mesh.DEPTH_TEST = material.depthTest;
                    // mesh.backOrFront = 'both'
                    mesh.transparent = opacity < 1;
                    mesh.scale(6, 6, 6);
                    mesh.rotateZ(-48);
                    mesh.position(new AMap.LngLat(102.705747, 24.984676));
                    object3Dlayer.add(mesh);
                }
                this.map.add(object3Dlayer);
            };
            var onLoadMtl = function(materials) {
                objLoader.setModelName(modelName);
                objLoader.addMaterials(materials);
                objLoader.load(
                    'https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.obj',
                    callbackOnLoad,
                    null,
                    null,
                    null,
                    false
                );
            };
            objLoader.load(
                'https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.mtl',
                // null,
                onLoadMtl
            );
        },
        setTruck() {
            const icon = new AMap.Icon({
                size: new AMap.Size(48, 20),
                image: '/static/truck.png',
                imageSize: new AMap.Size(48, 20),
            });
            this.markers.map((position) => {
                this.marker = new AMap.Marker({
                    map: this.map,
                    position,
                    icon: icon,
                    offset: new AMap.Pixel(-20, 43),
                    autoRotation: true,
                    angle: Math.floor(Math.random() * 100),
                });
            });
        },
        searchAddress() {
            //构造地点查询类
            this.placeSearch = new AMap.PlaceSearch({
                pageSize: 5, // 单页显示结果条数
                pageIndex: 1, // 页码
                city: '昆明市',
                citylimit: true, // 只搜所在城市
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
        onSearch() {
            if (!this.input || this.input.trim().length === 0) {
                this.placeSearch.render.clearPanel();
                return;
            }
            this.placeSearch.search(this.input);
        },
        setLine() {
            var object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
            this.map.add(object3Dlayer);
            //利用行政区查询获取路径
            var district = new AMap.DistrictSearch({
                subdistrict: 0,
                extensions: 'all',
                level: 'city',
            });

            district.search('昆明市', function(status, result) {
                var bounds = result.districtList[0].boundaries;
                var height = 30000;
                var color = '#0088ffcc'; //rgba
                var wall = new AMap.Object3D.Wall({
                    path: bounds,
                    height: height,
                    color: color,
                });
                wall.backOrFront = 'both';
                wall.transparent = true;
                object3Dlayer.add(wall);
            });
        },
        onSelect(e) {
            //这里获得点选地点的经纬度
            let location = e.selected.data.location;
            console.log('lng', location.lng);
            console.log('lat', location.lat);
            // Do Something
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
