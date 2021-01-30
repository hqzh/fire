<template>
    <div id="x6">
        <div id="x6-menu"></div>
        <div id="x6-container"></div>
    </div>
</template>

<script>
import { Graph } from "@antv/x6";
Graph.registerNode(
    "fireman",
    {
        attrs: {
            image: {
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
    data() {
        return {
            graph: null,
        };
    },
    mounted() {
        const width = document.getElementById("x6-container").scrollWidth;
        const height =
            document.getElementById("x6-container").scrollHeight || 600;
        console.log(height);
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
        this.graph.addNode({
            x: 200,
            y: 160,
            shape: "fireman",
        });
        this.graph.addNode({
            x: 400,
            y: 460,
            shape: "hydrant",
        });
        this.graph.addEdge({
            source: { x: 40, y: 40 },
            target: { x: 380, y: 40 },
            vertices: [
                { x: 40, y: 80 },
                { x: 200, y: 80 },
                { x: 200, y: 40 },
            ],
            attrs: {
                line: {
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
}
#x6-container {
    flex: auto;
    width: 0;
}
</style>
