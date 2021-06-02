<template>
    <div style="padding-top: 20px">
        <h3 style="position: absolute; top: 2px">建筑信息</h3>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            建筑高度：120米
        </div>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            建筑总层数：37层
        </div>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            标准层面积：1500平方米
        </div>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            群楼层面积：3400平方米
        </div>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            标准层数：69层
        </div>
        <div style="padding: 4px 0; border-bottom: 1px dashed gray">
            群楼层数：4层
        </div>
        <a-button type="link" @click="show">点击标记图纸</a-button>
        <a-drawer
            title="图纸标记"
            placement="right"
            width="100vw"
            :drawerStyle="{ display: 'flex', flexDirection: 'column' }"
            :bodyStyle="{ flex: 'auto', height: 0, paddingLeft: 0 }"
            :mark="false"
            :visible="visible"
            @close="visible = false"
        >
            <div id="x6">
                <!-- 战斗人员   消防栓  消防通道 -->
                <div id="x6-menu">
                    <a-card
                        title="要素"
                        :bordered="false"
                        :bodyStyle="bodyStyle"
                    >
                        <div
                            class="menu-item"
                            v-for="item in list"
                            :key="item.icon"
                            @click="handleClick(item.icon)"
                        >
                            <icon-font :type="item.icon" class="icon-fire" />
                            <span>{{ item.text }}</span>
                            <icon-font
                                type="iconadd"
                                class="icon-add"
                            ></icon-font>
                        </div>
                    </a-card>
                    <a-card
                        title="方案"
                        :bordered="false"
                        :bodyStyle="bodyStyle"
                    >
                        <div class="scheme-wrap">
                            <a-checkbox
                                @change="onChange('hold', 'red')"
                                v-model="hold"
                            >
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
                        </div>
                        <div class="scheme-wrap">
                            <a-checkbox
                                @change="onChange('water', 'aqua')"
                                v-model="water"
                            >
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
                    </a-card>

                    <div class="handle">
                        <a-button type="primary" @click="handleSave('close')">
                            保存
                        </a-button>
                        <a-button type="danger" @click="handleClear">
                            清空
                        </a-button>
                        <a-button type="danger" @click="visible = false">
                            关闭
                        </a-button>
                    </div>
                </div>
                <div id="x6-container"></div>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import { Graph } from '@antv/x6';
import { Icon, Message } from 'ant-design-vue';
import { initData, hold, water } from './data.js';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2358004_nxyqshrf4k.js',
});
Graph.registerNode(
    'fireman',
    {
        attrs: {
            image: {
                event: 'cell:contextmenu',
                'xlink:href': '/static/fireman.png',
                width: 64,
                height: 64,
            },
        },
        markup: [
            {
                tagName: 'image',
                selector: 'image',
            },
        ],
    },
    true
);
Graph.registerNode(
    'hydrant',
    {
        attrs: {
            image: {
                event: 'cell:contextmenu',
                'xlink:href': '/static/hydrant.png',
                width: 40,
                height: 60,
            },
        },
        markup: [
            {
                tagName: 'image',
                selector: 'image',
            },
        ],
    },
    true
);
Graph.registerNode(
    'fire',
    {
        attrs: {
            image: {
                event: 'cell:contextmenu',
                'xlink:href': '/static/fire.gif',
                width: 62,
                height: 47,
            },
        },
        markup: [
            {
                tagName: 'image',
                selector: 'image',
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
            hold: true,
            water: true,
            bodyStyle: { padding: 0 },
            visible: false,
            graph: null,
            list: [
                {
                    text: '战斗人员',
                    icon: 'iconfireman',
                },
                {
                    text: '消防栓',
                    icon: 'iconhydrant',
                },
                {
                    text: '安全通道',
                    icon: 'iconexit',
                },
                {
                    text: '着火点',
                    icon: 'iconfire',
                },
                {
                    text: '进攻线路',
                    icon: 'iconplan',
                },
                {
                    text: '供水线路',
                    icon: 'iconflow',
                },
            ],
        };
    },
    methods: {
        onChange(key, color) {
            this.handleSave();
            const serveData = JSON.parse(localStorage.getItem('x6'));
            if (serveData && serveData.cells.length) {
                this.graph.fromJSON(serveData);
            }
            if (this[key]) {
                serveData.cells = [...serveData.cells,...(key === 'hold' ? hold : water)]
                this.graph.fromJSON(
                    serveData.cells
                );
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
            Message.success('清空完成！');
            // localStorage.clear()
        },
        handleSave(close) {
            localStorage.setItem('x6', JSON.stringify(this.graph.toJSON()));
            if (close) {
                this.visible = false;
                Message.success('保存成功！');
            }
        },
        async show() {
            this.visible = true;
            await this.$nextTick();
            this.init();
        },
        init() {
            const width = document.getElementById('x6-container').scrollWidth;
            const height =
                document.getElementById('x6-container').scrollHeight || 600;
            this.graph = new Graph({
                container: document.getElementById('x6-container'),
                width,
                height,
                background: {
                    image: '/static/cad.jpg',
                    position: 'center', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
                    size: '100% 100%', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
                    repeat: 'no-repeat', // https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat
                },
            });
            this.graph.on('cell:contextmenu', ({ view, e }) => {
                if (e.type === 'contextmenu') {
                    e.stopPropagation();
                    view.cell.remove();
                }
            });
            this.graph.on('edge:mouseenter', ({ cell }) => {
                cell.addTools([
                    {
                        name: 'target-arrowhead',
                        args: {
                            attrs: {
                                fill: cell.attrs.line.stroke,
                            },
                        },
                    },
                ]);
            });
            const serveData =
                JSON.parse(localStorage.getItem('x6')) || initData;
            if (serveData && serveData.cells.length) {
                this.graph.fromJSON(serveData);
            }
        },
        handleClick(icon) {
            switch (icon) {
                case 'iconfireman':
                    this.graph.addNode({
                        x: 500,
                        y: 400,
                        shape: 'fireman',
                    });
                    break;
                case 'iconhydrant':
                    this.graph.addNode({
                        x: 500,
                        y: 400,
                        shape: 'hydrant',
                    });
                    break;
                case 'iconfire':
                    this.graph.addNode({
                        x: 500,
                        y: 400,
                        shape: 'fire',
                    });
                    break;
                case 'iconexit':
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
                                event: 'edge:contextmenu',
                                stroke: '#009944',
                                strokeWidth: 6,
                                targetMarker: 'classic',
                            },
                        },
                        tools: {
                            name: 'vertices',
                            args: {
                                attrs: { fill: '#f90c2d' },
                            },
                        },
                    });
                    break;
                case 'iconplan':
                    this.graph.addEdge({
                        source: { x: 100, y: 120 },
                        target: { x: 200, y: 120 },
                        attrs: {
                            line: {
                                stroke: 'red',
                            },
                        },
                    });
                    break;
                case 'iconflow':
                    this.graph.addEdge({
                        source: { x: 100, y: 240 },
                        target: { x: 200, y: 240 },
                        attrs: {
                            line: {
                                stroke: 'aqua',
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
.scheme-wrap /deep/ .ant-checkbox {
    zoom: 200% !important;
}
.scheme-wrap /deep/ .ant-btn-link {
    font-size: 18px;
    font-weight: bold;
}
.scheme-wrap {
    padding: 16px;
}
#x6-menu {
    width: 240px;
    position: relative;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.handle {
    display: flex;
    justify-content: space-around;
}
#x6-container {
    flex: auto;
    width: 0;
}
.icon-fire {
    font-size: 40px;
}
.icon-add {
    font-size: 24px;
}
.menu-item {
    cursor: pointer;
    padding: 16px;
    font-size: 24px;
    font-weight: bold;
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-width: 210px;
}
</style>