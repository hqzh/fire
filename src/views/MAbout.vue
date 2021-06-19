<template>
    <div class="x6-wrap" id="x6-wrap">
        <!-- 战斗人员   消防栓  消防通道 -->
        <div id="x6-container"></div>
        <a-drawer
            :height="height"
            placement="bottom"
            :closable="false"
            :visible="true"
            :mask="false"
            :maskClosable="false"
            wrapClassName="wrap-bottom-drawer"
        >
            <icon
                type="up"
                class="about-icon"
                v-if="height === 140"
                @click="height = 320"
            />
            <icon
                type="down"
                class="about-icon"
                v-if="height === 320"
                @click="height = 140"
            />
            <a-divider orientation="left">要素</a-divider>
            <div class="menu-wrap">
                <div
                    class="menu-item"
                    v-for="item in list"
                    :key="item.icon"
                    :id="item.icon"
                    @touchstart="start"
                    @touchmove="move"
                    @touchend="end($event, item.icon)"
                >
                    <icon-font :type="item.icon" class="icon-fire" />
                    <div>{{ item.text }}</div>
                </div>
            </div>
            <a-divider orientation="left">方案</a-divider>
            <div class="scheme-wrap">
                <a-checkbox @change="onChange('hold', 'red')" v-model="hold">
                    <a-button
                        type="link"
                        @click="
                            hold = !hold;
                            onChange('hold', 'red');
                        "
                    >
                        进攻路线方案
                    </a-button>
                </a-checkbox>
                <a-checkbox @change="onChange('water', 'aqua')" v-model="water">
                    <a-button
                        type="link"
                        @click="
                            water = !water;
                            onChange('water', 'aqua');
                        "
                    >
                        供水方案
                    </a-button>
                </a-checkbox>
            </div>
            <a-divider orientation="left">操作</a-divider>
            <div class="handle">
                <a-button type="primary" @click="handleSave('close')">
                    保存
                </a-button>
                <a-button type="danger" @click="handleClear"> 清空 </a-button>
                <a-button @click="handleBack"> 返回 </a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import { Graph } from "@antv/x6";
import { Icon, Message } from "ant-design-vue";
import { initData, hold, water } from "../components/data";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_2358004_nxyqshrf4k.js",
});
const up = 320;
// const down = 140;
Graph.registerNode(
    "fireman",
    {
        attrs: {
            image: {
                event: "cell:contextmenu",
                "xlink:href": "/static/fireman.png",
                width: 64,
                height: 64,
            },
        },
        markup: [
            {
                tagName: "image",
                selector: "image",
            },
        ],
    },
    true
);
Graph.registerNode(
    "hydrant",
    {
        attrs: {
            image: {
                event: "cell:contextmenu",
                "xlink:href": "/static/hydrant.png",
                width: 40,
                height: 60,
            },
        },
        markup: [
            {
                tagName: "image",
                selector: "image",
            },
        ],
    },
    true
);
Graph.registerNode(
    "fire",
    {
        attrs: {
            image: {
                event: "cell:contextmenu",
                "xlink:href": "/static/fire.gif",
                width: 62,
                height: 47,
            },
        },
        markup: [
            {
                tagName: "image",
                selector: "image",
            },
        ],
    },
    true
);
export default {
    components: {
        IconFont,
        Icon,
    },
    data() {
        return {
            height: up,
            hold: true,
            water: true,
            graph: null,
            list: [
                {
                    text: "战斗人员",
                    icon: "iconfireman",
                },
                {
                    text: "消防栓",
                    icon: "iconhydrant",
                },
                {
                    text: "安全通道",
                    icon: "iconexit",
                },
                {
                    text: "着火点",
                    icon: "iconfire",
                },
                {
                    text: "进攻线路",
                    icon: "iconplan",
                },
                {
                    text: "供水线路",
                    icon: "iconflow",
                },
            ],
        };
    },
    async mounted() {
        await this.$nextTick();
        this.init();
    },
    methods: {
        start() {},
        move() {},
        end(e, icon) {
            const x =
                e.changedTouches[0].pageX +
                document.getElementById("x6-wrap").scrollLeft;
            const y =
                e.changedTouches[0].pageY +
                document.getElementById("x6-wrap").scrollTop;
            switch (icon) {
                case "iconfireman":
                    this.graph.addNode({
                        x,
                        y,
                        shape: "fireman",
                    });
                    break;
                case "iconhydrant":
                    this.graph.addNode({
                        x,
                        y,
                        shape: "hydrant",
                    });
                    break;
                case "iconfire":
                    this.graph.addNode({
                        x,
                        y,
                        shape: "fire",
                    });
                    break;
                case "iconexit":
                    this.graph.addEdge({
                        source: { x, y },
                        target: { x: x + 400, y: y + 100 },
                        vertices: [
                            { x, y: y - 100 },
                            { x: x + 100, y: y - 100 },
                            { x: x + 100, y: y + 100 },
                        ],
                        attrs: {
                            line: {
                                event: "edge:contextmenu",
                                stroke: "#009944",
                                strokeWidth: 6,
                                targetMarker: "classic",
                            },
                        },
                        tools: {
                            name: "vertices",
                            args: {
                                attrs: { fill: "#f90c2d" },
                            },
                        },
                    });
                    break;
                case "iconplan":
                    this.graph.addEdge({
                        source: { x, y },
                        target: { x: x + 100, y },
                        attrs: {
                            line: {
                                stroke: "red",
                            },
                        },
                    });
                    break;
                case "iconflow":
                    this.graph.addEdge({
                        source: { x, y },
                        target: { x: x + 100, y },
                        attrs: {
                            line: {
                                stroke: "aqua",
                            },
                        },
                    });
                    break;
                default:
                    break;
            }
        },
        handleBack() {
            this.$router.go(-1);
        },
        onChange(key, color) {
            this.handleSave();
            const serveData = JSON.parse(localStorage.getItem("x6"));
            if (serveData && serveData.cells.length) {
                this.graph.fromJSON(serveData);
            }
            if (this[key]) {
                serveData.cells = [
                    ...serveData.cells,
                    ...(key === "hold" ? hold : water),
                ];
                this.graph.fromJSON(serveData.cells);
                console.log(serveData);
            } else {
                this.graph.fromJSON({
                    cells: serveData.cells.filter(
                        (item) => item?.attrs?.line?.stroke !== color
                    ),
                });
            }
        },
        handleClear() {
            this.graph.clearCells();
            Message.success("清空完成！");
            // localStorage.clear()
        },
        handleSave(close) {
            localStorage.setItem("x6", JSON.stringify(this.graph.toJSON()));
            if (close) {
                Message.success("保存成功！");
            }
        },
        init() {
            const width = document.getElementById("x6-container").scrollWidth;
            const height =
                document.getElementById("x6-container").scrollHeight || 874;
            this.graph = new Graph({
                container: document.getElementById("x6-container"),
                width,
                height,
                background: {
                    image: "/static/cad.jpg",
                    position: "center", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
                    size: "100% 100%", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
                    repeat: "no-repeat", // https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
                },
            });
            this.graph.on("cell:contextmenu", ({ view, e }) => {
                // 移动端长按删除
                if (e.type === "contextmenu") {
                    e.stopPropagation();
                    view.cell.remove();
                }
            });
            this.graph.on("edge:mouseenter", ({ cell }) => {
                cell.addTools([
                    {
                        name: "target-arrowhead",
                        args: {
                            attrs: {
                                fill: cell.attrs.line.stroke,
                            },
                        },
                    },
                ]);
            });
            const serveData =
                JSON.parse(localStorage.getItem("x6")) || initData;
            if (serveData && serveData.cells.length) {
                this.graph.fromJSON(serveData);
            }
        },
    },
};
</script>

<style lang="less" scoped>
.about-icon {
    position: absolute;
    top: 2px;
    font-weight: bold;
    font-size: 24px;
    left: 50%;
    transform: translate(-50%);
}
.x6-wrap {
    height: 100%;
    width: 100%;
    overflow: auto;
}
.scheme-wrap {
    display: flex;
    justify-content: space-around;
}
.handle {
    display: flex;
    justify-content: space-around;
}
#x6-container {
    height: 874px;
    width: 1639px;
    margin-bottom: 150px;
}
.icon-fire {
    font-size: 40px;
}
.menu-wrap {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
}
.menu-item {
    text-align: center;
    width: 88px;
    font-weight: bold;
    display: inline-block;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
</style>