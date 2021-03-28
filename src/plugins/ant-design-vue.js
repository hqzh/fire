import Vue from 'vue'
import { Input, Button, Drawer, Card ,Select,Checkbox} from 'ant-design-vue'
import { LocaleProvider } from 'ant-design-vue'
Drawer.install(Vue)
Vue.component(LocaleProvider.name, LocaleProvider)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Button.name, Button)
Vue.component(Drawer.name, Drawer)
Vue.component(Card.name, Card)
Vue.component(Select.name, Select)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Select.Option.name, Select.Option)
