import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import axios from '@/plugins/axios.js'
Vue.use(axios, {baseURL: window.appConfig.baseURL||''})

import { Button,Col, Row,Popup,Toast,Form ,Field,NumberKeyboard,Slider,Stepper,Dialog,Loading,Circle,
  Grid,GridItem,NavBar,Notify,Cell,CellGroup,Divider} from 'vant';
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popup);
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
Vue.use(NumberKeyboard);
Vue.use(Slider);
Vue.use(Stepper);
Vue.use(Dialog);
Vue.use(Loading);
Vue.use(Circle);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(NavBar);
Vue.use(Notify);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Divider);




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
