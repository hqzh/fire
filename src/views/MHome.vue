<template>
    <div class="root">
        <div id="map"></div>
        <a-drawer
            v-zswipedown="touchDown"
            v-zswipeup="touchUp"
            :height="height"
            placement="bottom"
            :closable="false"
            :visible="true"
            :mask="false"
            :maskClosable="false"
            wrapClassName="wrap-bottom-drawer"
        >
            <!-- 搜索框 -->
            <div id="search">
                <a-input-search
                    autocomplete="off"
                    id="input-text"
                    v-model="input"
                    placeholder="请输入关键字"
                    @focus="touchUp"
                />
            </div>
            <div v-if="visible" class="fire-schemes">
                <div
                    v-for="item in schemes"
                    :key="item.value"
                    class="fire-scheme-item"
                    :class="item.value === scheme ? 'acheme-active' : undefined"
                    :style="{ background: item.color }"
                    @click="handleChange(item.value)"
                >
                    <icon-font
                        :type="`icon${item.value}`"
                        class="fire-scheme-icon"
                    />
                    <div class="fire-scheme-item-label">{{ item.label }}</div>
                </div>
                <div class="fire-scheme-item fire-scheme-item-add">
                    <icon-font type="iconpush" class="fire-scheme-icon" />
                </div>
            </div>
            <!-- 历史搜索 -->
            <div :class="!visible ? 'panel-history' : 'panel-history-scheme'">
                <div>查询历史</div>
                <div>
                    <div
                        v-for="(item, index) in historySearch"
                        :key="index"
                        class="auto-item"
                        @click="handleSearch(item.name)"
                    >
                        {{ item.name }}
                        <span class="auto-item-span">{{ item.district }}</span>
                    </div>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import Vue from "vue";
import AMap from "AMap";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";
const HISTORY_SEARCH = "HISTORY_SEARCH";
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_2358004_nxyqshrf4k.js",
});
const up = 315;
const down = 50;
export default {
    components: { IconFont },
    data() {
        return {
            historySearch: [], //查询历史
            height: down, // 移动端底部抽屉高度
            visible: false,
            scheme: "fireFace",
            schemes: [
                {
                    value: "fireFace",
                    label: "着火面停车方案",
                    color: "#ad4e00",
                },
                {
                    value: "rescueFace",
                    label: "消防救援面方案",
                    color: "#2b4490",
                },
                {
                    value: "fitFace",
                    label: "适当空位停车方案",
                    color: "#fa541c",
                },
            ],
            fireFaceRect: null,
            fitFaceRect: null,
            rescueFaceRectRight: null,
            rescueFaceRectBottom: null,
            input: "",
            map: null,
            buildingLayer: null,
            placeSearch: null,
            options: {
                hideWithoutStyle: false, //是否隐藏设定区域外的楼块
                areas: [
                    {
                        //visible:false,//是否可见
                        rejectTexture: true, //是否屏蔽自定义地图的纹理
                        color1: "ff99ff00", //楼顶颜色
                        color2: "ff999900", //楼面颜色
                        path: [
                            [102.705917, 24.985819],
                            [102.708121, 24.985765],
                            [102.70861, 24.987063],
                            [102.706249, 24.987165],
                            [102.705917, 24.985819],
                        ],
                    },
                    {
                        color1: "ff99ff00",
                        color2: "ff999900",
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
                {
                    position: [102.70571, 24.98466],
                    address: "昆明市西山区前兴路东大商园内",
                },
                {
                    position: [103.2584, 25.54295],
                    address: "昆明市寻甸回族彝族自治县大花桥农贸市场",
                },
                {
                    position: [103.183401, 26.073369],
                    address: "昆明市东川区体育场南50米(209省道西)",
                },
                {
                    position: [103.038382, 25.322492],
                    address:
                        "昆明市嵩明县嵩明公路管理段2号院东南乔华家居建材城",
                },
                {
                    position: [102.501071, 25.21075],
                    address: "昆明市富民县永南大街佳逸小区",
                },
                {
                    position: [102.366938, 24.93828],
                    address: "昆明市嵩明县天创路8附近云天化集团",
                },
                {
                    position: [102.596094, 24.674432],
                    address: "昆明市晋宁区富昆路昆明圣玛莉医院东侧",
                },
                {
                    position: [103.152573, 24.920524],
                    address: "昆明市宜良县迎宾路137号永佳KTV",
                },
                {
                    position: [103.280753, 24.778896],
                    address:
                        "昆明市石林彝族自治县昌乐路东100米石林生态工业集中区金恒公租房",
                },
            ],
            trucks: [
                {
                    position: [102.705418, 24.984355],
                    angle: 280,
                    title: "我是一号车",
                },
                {
                    position: [102.705257, 24.98399],
                    angle: 280,
                    title: "我是二号车",
                },
                {
                    position: [102.705565, 24.984258],
                    angle: 280,
                    title: "我是三号车",
                },
            ],
            toogle: true,
        };
    },
    watch: {
        height(n) {
            if (n > down) {
                this.getHistory();
            }
        },
    },
    mounted() {
        this.init();
    },
    methods: {
        getHistory() {
            this.historySearch =
                JSON.parse(localStorage.getItem(HISTORY_SEARCH)) || [];
        },
        touchDown() {
            this.height = down;
        },
        touchUp() {
            this.height = up;
        },
        handleChange(value) {
            this.scheme = value;
            this[value](value);
        },
        setBuildStyle() {
            this.buildingLayer.setStyle(this.options); //此配色优先级高于自定义mapStyle

            new AMap.Polygon({
                bubble: true,
                fillColor: "green",
                fillOpacity: 0.2,
                strokeWeight: 1,
                path: this.options.areas[0].path,
                map: this.map,
            });
            new AMap.Polygon({
                bubble: true,
                fillColor: "green",
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
            this.map = new AMap.Map("map", {
                // center: [102.706208, 24.986864],
                center: [103.093722, 25.03539],
                resizeEnable: true, //缩放
                rotateEnable: true, //地图是否可旋转
                pitchEnable: true, // 倾斜
                zoom: 8,
                // // 地图俯仰角度，有效范围 0 度- 83 度
                // pitch: 80,
                // rotation: -15,
                viewMode: "3D", //开启3D视图,默认为关闭
                buildingAnimation: true, //楼块出现是否带动画
                // zooms 表示地图显示的缩放级别范围。在PC上，默认为[3,18]，取值范围[3-18]；在移动设备上，默认为[3,19],取值范围[3-19] 。
                // 当 expandZoomRange 为 true 时， zooms的最大级别在PC上可以扩大到20级（移动端还是高清19/非高清20 ）。
                expandZoomRange: true,
                zooms: [3, 20],
                layers: [new AMap.TileLayer(), this.buildingLayer],
            });
            this.map.setMapStyle("amap://styles/fresh");

            this.map.addControl(new AMap.Scale());
            this.searchAddress();

            this.setLine();
            this.setMark();
        },
        setControl() {
            // 3D效果和下面的控件 需要1.4.0以上的版本
            this.map.addControl(
                new AMap.ControlBar({
                    showZoomBar: false,
                    showControlButton: true,
                    position: {
                        right: "10px",
                        top: "10px",
                    },
                })
            );
            // 如果调不好光照的话，后面取消，让建筑模型通红
            // 设置地图的环境光源(color,intensity)
            // color用来描述光照的颜色，为一个三个元素的数组，每个元素代表RGB的三个分量，每个分量的取值范围[0,1]；
            // intensity用来描述光照强度，取值范围[0,1]；

            this.map.AmbientLight = new AMap.Lights.AmbientLight(
                [1, 1, 1],
                0.6
            );
            // 设置地图的平行光照(direction,color,intensity)
            // direction用来描述光的照射方向，为一个三个元素的数组，分别代表方向的xyz分量。direction为相对于地图平面的方向，x 正方向朝东，y 正方向朝南，z 正方向朝下
            // color用来描述光照的颜色，为一个三个元素的数组，每个元素代表RGB的三个分量，每个分量的取值范围[0,1]；
            // intensity用来描述光照强度，取值范围[0,1]；
            // 如下: 描述了一个从正南方斜向下照射的一道平行光
            // var dir = new M.Lights.DirectionLight([0, -1, 1],[1, 1, 1],0.1)
            this.map.DirectionLight = new AMap.Lights.DirectionLight(
                [-6, -2, 14],
                [1, 1, 1],
                0.4
            );
        },
        setMark() {
            var icon = new AMap.Icon({
                size: new AMap.Size(20, 20),
                image: "/static/fire.png",
                imageSize: new AMap.Size(20, 20),
            });

            const markers = this.markers.map((item) => {
                const m = new AMap.Marker({
                    position: new AMap.LngLat(...item.position),
                    icon: icon,
                    offset: new AMap.Pixel(-10, 5),
                });
                const text = new AMap.Text({
                    position: new AMap.LngLat(...item.position),
                    text: item.address,
                    map: this.map,
                    anchor: "bottom-left",
                    style: {
                        color: "red",
                        "border-color": "red",
                        "font-size": "12px",
                        padding: "10px",
                    },
                });
                text.on("click", () => {
                    // 清除地图覆盖物
                    this.map.clearMap();
                    //动态设置地图中心点和展示层级
                    this.map.setZoomAndCenter(20, [102.70571, 24.98466]);
                    this.map.setFeatures(["road", "point", "bg"]);
                    this.setTruck();
                    this.setFire();
                    this.setFireInfo({ anchor: "bottom-left", offset: [0, 0] });
                    this.fireFace();
                });
                m.on("click", () => {
                    // 清除地图覆盖物
                    this.map.clearMap();
                    //动态设置地图中心点和展示层级
                    this.map.setZoomAndCenter(20, [102.70571, 24.98466]);
                    this.map.setFeatures(["road", "point", "bg"]);
                    this.setTruck();
                    this.setFire();
                    this.setFireInfo({ anchor: "bottom-left", offset: [0, 0] });
                    this.fireFace();
                });
                return m;
            });

            // 将 markers 添加到地图
            this.map.add(markers);
        },
        clearFace() {
            this.fireFaceRect && this.map.remove(this.fireFaceRect);
            this.rescueFaceRectBottom &&
                this.map.remove(this.rescueFaceRectBottom);
            this.rescueFaceRectRight &&
                this.map.remove(this.rescueFaceRectRight);
            this.fitFaceRect && this.map.remove(this.fitFaceRect);
        },
        fitFace() {
            this.clearFace();
            this.rescueFace();
            this.fireFace();
            this.fitFaceRect = new AMap.Rectangle({
                map: this.map,
                bounds: new AMap.Bounds(
                    [102.705635, 24.984637],
                    [102.70567, 24.984679]
                ),
                strokeColor: "#52c41a",
                strokeWeight: 1,
                fillColor: "#52c41a",
                fillOpacity: 0.4,
            });
        },
        rescueFace(value) {
            value && this.clearFace();
            this.rescueFaceRectBottom = new AMap.Rectangle({
                map: this.map,
                bounds: new AMap.Bounds(
                    [102.705678, 24.984599],
                    [102.705741, 24.984631]
                ),
                strokeColor: "#52c41a",
                strokeWeight: 1,
                fillColor: "#52c41a",
                fillOpacity: 0.4,
            });
            this.rescueFaceRectRight = new AMap.Rectangle({
                map: this.map,
                bounds: new AMap.Bounds(
                    [102.705745, 24.984637],
                    [102.705775, 24.984679]
                ),
                strokeColor: "#52c41a",
                strokeWeight: 1,
                fillColor: "#52c41a",
                fillOpacity: 0.4,
            });
        },
        // 绘制初始化着火面停车方案
        fireFace(value) {
            this.height = up;
            value && this.clearFace();
            this.visible = true;
            this.fireFaceRect = new AMap.Rectangle({
                map: this.map,
                bounds: new AMap.Bounds(
                    [102.705678, 24.984675],
                    [102.705741, 24.984695]
                ),
                strokeColor: "#52c41a",
                strokeWeight: 1,
                fillColor: "#52c41a",
                fillOpacity: 0.4,
            });
        },

        setTruckModel({ position }) {
            var modelName = "building";
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

                    var material = meshes[i].material[0] || meshes[i].material;
                    // debugger
                    // if (material.map)  建筑瓷砖
                    mesh.textures.push("/static/model/fire.png");

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
                    }
                    // debugger
                    mesh.DEPTH_TEST = material.depthTest;
                    mesh.scale(2, 2, 2);
                    mesh.rotateZ(190);
                    mesh.position(new AMap.LngLat(...position));
                    object3Dlayer.add(mesh);
                }
                this.map.add(object3Dlayer);
            };
            var onLoadMtl = function (materials) {
                objLoader.setModelName(modelName);
                objLoader.addMaterials(materials);
                objLoader.load(
                    "/static/model/fire.obj",
                    callbackOnLoad,
                    null,
                    null,
                    null,
                    false
                );
            };
            objLoader.load(
                "/static/model/fire.mtl",
                // null,
                onLoadMtl
            );
        },
        setBuildModel() {
            var modelName = "building";
            var objLoader = new OBJLoader2();
            var callbackOnLoad = async (event) => {
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
                    mesh.textures.push("/static/model/1301.bmp");

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
                    mesh.scale(2, 2, 2);
                    mesh.rotateZ(278);
                    mesh.position(new AMap.LngLat(102.70571, 24.984491));
                    object3Dlayer.add(mesh);
                }

                this.map.add(object3Dlayer);
                await this.$nextTick();
                this.map.on("click", (ev) => {
                    var pixel = ev.pixel;
                    var px = new AMap.Pixel(pixel.x, pixel.y);
                    var obj =
                        this.map.getObject3DByContainerPos(
                            px,
                            [object3Dlayer],
                            false
                        ) || {};
                    if (obj && obj.object && this.toogle) {
                        this.toogle = false;
                        this.setFireInfo({
                            offset: [20, 0],
                            anchor: "middle-left",
                            position: [ev.lnglat.lng, ev.lnglat.lat],
                        });
                    }
                });
            };
            var onLoadMtl = function (materials) {
                objLoader.setModelName(modelName);
                objLoader.addMaterials(materials);
                objLoader.load(
                    "/static/model/1519.obj",
                    callbackOnLoad,
                    null,
                    null,
                    null,
                    false
                );
            };
            objLoader.load(
                "/static/model/1519.mtl",
                // null,
                onLoadMtl
            );
        },
        setTruck() {
            const icon = new AMap.Icon({
                size: new AMap.Size(24, 10),
                image: "/static/truck.png",
                imageSize: new AMap.Size(24, 10),
            });
            this.trucks.map((item) => {
                new AMap.Marker({
                    map: this.map,
                    position: item.position,
                    icon: icon,
                    offset: new AMap.Pixel(0, -5),
                    angle: item.angle,
                    title: item.title,
                });
            });
        },
        async setFireInfo({ offset, anchor, position }) {
            const _this = this;
            var MyComponent = Vue.extend({
                template:
                    '<div style="padding-top:20px"><h3 style="position:absolute;top:2px">建筑信息</h3>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">建筑高度：120米</div>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">建筑总层数：37层</div>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">标准层面积：1500平方米</div>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">群楼层面积：3400平方米</div>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">标准层数：69层</div>' +
                    '<div style="padding:4px 0;border-bottom:1px dashed gray">群楼层数：4层</div>' +
                    '<button class="ant-btn ant-btn-link" v-on:click="handleGo()">点击标记图纸</button></div></div>',
                methods: {
                    handleGo: function () {
                        _this.$router.push("m-about");
                    },
                },
            });
            // 将新创建的子组件进行挂载
            var component = new MyComponent().$mount();
            await this.$nextTick();
            const infoWindow = new AMap.InfoWindow({
                content: component.$el, //使用默认信息窗体框样式，显示信息内容
                anchor,
                offset: new AMap.Pixel(...offset),
            });

            infoWindow.open(this.map, position || [102.705772, 24.984711]);
            infoWindow.on("close", () => {
                this.toogle = true;
            });
        },
        setFire() {
            const icon = new AMap.Icon({
                size: new AMap.Size(40, 40),
                image: "/static/fire.gif",
                imageSize: new AMap.Size(40, 40),
            });
            const fire = new AMap.Marker({
                map: this.map,
                position: [102.70571, 24.98466],
                icon: icon,
                offset: new AMap.Pixel(-20, -35),
            });

            fire.on("click", () => {
                this.map.clearMap();
                //动态设置地图中心点和展示层级
                this.map.setZoomAndCenter(17, [102.706219, 24.987877]);
                this.map.setFeatures(["road", "point", "bg", "building"]);
                // 动态设置俯仰度
                this.map.setPitch(70);
                this.map.setRotation(-15);
                this.setBuildModel();
                this.trucks.map((item) => {
                    this.setTruckModel(item);
                });
                this.setControl();
                this.setBuildStyle();
                this[this.scheme](this.scheme);
                this.visible = false;
            });
        },
        async searchAddress() {
            await this.$nextTick();
            const autocomplete = new AMap.Autocomplete({
                // 使用联想输入的input的id
                input: "input-text",
            });
            this.placeSearch = new AMap.PlaceSearch({
                map: this.map,
            });
            AMap.event.addListener(autocomplete, "select", (e) => {
                const { district, name } = e.poi;
                this.placeSearch.search(name);
                const arr =
                    JSON.parse(localStorage.getItem(HISTORY_SEARCH)) || [];
                if (!arr.filter((item) => item.name === name).length) {
                    arr.unshift({ name, district });
                    localStorage.setItem(HISTORY_SEARCH, JSON.stringify(arr));
                    this.historySearch = arr;
                }
            });
        },
        handleSearch(name) {
            this.placeSearch.search(name);
        },
        setLine() {
            var object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
            this.map.add(object3Dlayer);
            //利用行政区查询获取路径
            var district = new AMap.DistrictSearch({
                subdistrict: 0,
                extensions: "all",
                level: "city",
            });

            district.search("昆明市", function (status, result) {
                var bounds = result.districtList[0].boundaries;
                var height = 30000;
                var color = "#0088ffcc"; //rgba
                var wall = new AMap.Object3D.Wall({
                    path: bounds,
                    height: height,
                    color: color,
                });
                wall.backOrFront = "both";
                wall.transparent = true;
                object3Dlayer.add(wall);
            });
        },
    },
};
</script>

<style lang="less">
.wrap-bottom-drawer {
    .panel-history {
        overflow-y: hidden;
        margin-top: 4px;
        height: 259px;
    }
    .panel-history-scheme {
        overflow-y: hidden;
        margin-top: 32px;
        height: 175px;
    }
    .fire-schemes {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-top: 8px;
        .fire-scheme-item {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .fire-scheme-item-add {
            background: #e6f7ff;
        }
        .fire-scheme-item-label {
            position: absolute;
            bottom: -24px;
            left: -8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 80px;
        }
        .acheme-active {
            animation: glow 1s ease-out infinite alternate;
        }

        @keyframes glow {
            0% {
                box-shadow: 0 0 16px rgba(82, 196, 26, 1),
                    inset 0 0 80px rgba(82, 196, 26, 0.1), 0 0 0 #52c41a;
            }

            100% {
                box-shadow: 0 0 20px rgba(82, 196, 26, 0.1),
                    inset 0 0 60px rgba(82, 196, 26, 1), 0 0 0 #52c41a;
            }
        }

        .fire-scheme-icon {
            font-size: 32px;
        }
    }
    .ant-drawer-content-wrapper,
    .ant-drawer-content,
    .ant-drawer-wrapper-body,
    .ant-drawer-body {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }
    .ant-drawer-body {
        padding: 10px;
        position: relative;
    }
}
</style>
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
}
.wrap-bottom-drawer /deep/ .ant-drawer-body::before {
    position: absolute;
    display: block;
    content: "";
    width: 24px;
    height: 4px;
    background: #666;
    top: 2px;
    left: 50%;
    transform: translate(-50%);
    border-radius: 4px;
}
</style>
