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
    <a-modal v-model="visible" title="图纸标记" @ok="handleOk" okText="保存">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
  },
};
</script>

<style>
</style>