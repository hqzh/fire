import vueTouch from './v-touch';

export default (Vue) => {

    Vue.directive('ztap', {
        // 点击事件
        bind(el, binding) {
            new vueTouch(el, binding, 'tap');
        }
    });
    Vue.directive('zswipe', {
        // 滑动事件
        bind(el, binding) {
            new vueTouch(el, binding, 'swipe');
        }
    });
    Vue.directive('zswipeleft', {
        // 左滑事件
        bind(el, binding) {
            new vueTouch(el, binding, 'swipeleft');
        }
    });
    Vue.directive('zswiperight', {
        // 右滑事件
        bind(el, binding) {
            new vueTouch(el, binding, 'swiperight');
        }
    });
    Vue.directive('zswipedown', {
        // 下滑事件
        bind(el, binding) {
            new vueTouch(el, binding, 'swipedown');
        }
    });
    Vue.directive('zswipeup', {
        // 上滑事件
        bind(el, binding) {
            new vueTouch(el, binding, 'swipeup');
        }
    });
    Vue.directive('zlongtap', {
        // 长按事件
        bind(el, binding) {
            new vueTouch(el, binding, 'longtap');
        }
    });

};