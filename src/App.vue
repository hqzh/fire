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
import AMap from "AMap";
import { OBJLoader2 } from "three/examples/jsm/loaders/OBJLoader2";

export default {
  data() {
    return {
      input: "大商园建材城办公大楼",
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
          address: "昆明市嵩明县嵩明公路管理段2号院东南乔华家居建材城",
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
        center: [102.833722, 25.43539],
        resizeEnable: true, //缩放
        rotateEnable: true, //地图是否可旋转
        pitchEnable: true, // 倾斜
        zoom: 9,
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
          this.map.setZoomAndCenter(19, [102.70571, 24.98466]);
          this.map.setFeatures(["road", "point", "bg"]);
          this.setTruck();
          this.setFire();
          this.setFireInfo({anchor:'bottom-left',offset:[0,0]});
        });
        m.on("click", () => {
          // 清除地图覆盖物
          this.map.clearMap();
          //动态设置地图中心点和展示层级
          this.map.setZoomAndCenter(19, [102.70571, 24.98466]);
          this.map.setFeatures(["road", "point", "bg"]);
          this.setTruck();
          this.setFire();
          this.setFireInfo({anchor:'bottom-left',offset:[0,0]});
        });
        return m;
      });

      // 将 markers 添加到地图
      this.map.add(markers);
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

          var c, opacity;

          var material = meshes[i].material[0] || meshes[i].material;
          // debugger
          // if (material.map)  建筑瓷砖
          mesh.textures.push("/static/model/fire.png");

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
            "https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.bmp"
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
          mesh.scale(2, 2, 2);
          mesh.rotateZ(278);
          mesh.position(new AMap.LngLat(102.70571, 24.984491));
          object3Dlayer.add(mesh);
        }
        this.map.add(object3Dlayer); 
      };
      var onLoadMtl = function (materials) {
        objLoader.setModelName(modelName);
        objLoader.addMaterials(materials);
        objLoader.load(
          "https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.obj",
          callbackOnLoad,
          null,
          null,
          null,
          false
        );
      };
       objLoader.load(
        "https://a.amap.com/jsapi_demos/static/demo-center/model/1519/1519.mtl",
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
    setFireInfo({offset,anchor}) {
      //构建信息窗体中显示的内容
      const info = [];
      info.push('<div style="padding-top:20px"><h3 style="position:absolute;top:2px">建筑信息</h3>');
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">建筑高度：120米</div>'
      );
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">建筑总层数：37层</div>'
      );
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">标准层面积：1500平方米</div>'
      );
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">群楼层面积：3400平方米</div>'
      );
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">标准层数：69层</div>'
      );
      info.push(
        '<div style="padding:4px 0;border-bottom:1px dashed gray">群楼层数：4层</div></div></div>'
      );

      const infoWindow = new AMap.InfoWindow({
        content: info.join(""), //使用默认信息窗体框样式，显示信息内容
        anchor,
        offset:new AMap.Pixel(...offset),
      });

      infoWindow.open(this.map, [102.705772, 24.984711]);
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
        this.setFireInfo({offset:[20,0],anchor:'middle-left'})
        this.setControl();
        this.setBuildStyle();
      });
    },
    searchAddress() {
      //构造地点查询类
      this.placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: "昆明市",
        citylimit: true, // 只搜所在城市
        map: this.map, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        renderStyle: "newpc",
        type:
          "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施",
      });
      // 添加列表点选监听事件
      AMap.event.addListener(this.placeSearch, "selectChanged", this.onSelect);
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
    onSelect(e) {
      //这里获得点选地点的经纬度
      let location = e.selected.data.location;
      console.log("lng", location.lng);
      console.log("lat", location.lat);
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
