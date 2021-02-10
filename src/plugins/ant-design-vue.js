import Vue from 'vue'
import { Input, Button, Modal } from 'ant-design-vue'
import { LocaleProvider } from 'ant-design-vue'
Modal.install(Vue)

Vue.component(LocaleProvider.name, LocaleProvider)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Button.name, Button)
Vue.component(Modal.name, Modal)
