<template>
    <div id="x6">
        <!-- 战斗人员   消防栓  消防通道 -->
        <div id="x6-menu">
            <div
                class="menu-item"
                v-for="item in list"
                :key="item.icon"
                @click="handleClick(item.icon)"
            >
                <icon-font :type="item.icon" class="icon-fire" />
                <span>{{ item.text }}</span>
                <icon-font type="iconadd" class="icon-fire"></icon-font>
            </div>
        </div>
        <div id="x6-container"></div>
    </div>
</template>

<script>
import { Graph } from "@antv/x6";
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_2358004_i42xq7epmgk.js",
});
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
export default {
    components: {
        IconFont,
    },
    data() {
        return {
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
            ],
        };
    },
    mounted() {
        const width = document.getElementById("x6-container").scrollWidth;
        const height =
            document.getElementById("x6-container").scrollHeight || 600;
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
            if (e.type === "contextmenu") {
                e.stopPropagation();
                view.cell.remove();
            }
        });
    },
    methods: {
        handleClick(icon) {
            console.log(icon);
            switch (icon) {
                case "iconfireman":
                    this.graph.addNode({
                        x: 500,
                        y: 400,
                        shape: "fireman",
                    });
                    break;
                case "iconhydrant":
                    this.graph.addNode({
                        x: 500,
                        y: 400,
                        shape: "hydrant",
                    });
                    break;
                case "iconexit":
                    this.graph.addEdge({
                        source: { x: 400, y: 400 },
                        target: { x: 800, y: 500 },
                        vertices: [
                            { x: 400, y: 300 },
                            { x: 500, y: 300 },
                            { x: 500, y: 500 },
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
                default:
                    break;
            }
        },
    },
};
</script>

<style lang="less" scope>
#x6 {
    height: 100%;
    display: flex;
}
#x6-menu {
    width: 240px;
    padding-top: 24px;
}
#x6-container {
    flex: auto;
    width: 0;
}
.icon-fire {
    font-size: 40px;
}
.menu-item {
    cursor: pointer;
    padding: 16px;
    font-size: 24px;
    font-weight: bold;
    justify-content: space-between;
}
</style>
