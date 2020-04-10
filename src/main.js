import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
//  导入全局样式表
import './assets/css/global.css';
// 导入字体图标
import './assets/fonts/iconfont.css';
// element-ui的全部组件
import ElementUI from 'element-ui';
// element-ui的css
import 'element-ui/lib/theme-chalk/index.css';
// 请求
import axios from 'axios';
Vue.prototype.$http = axios;
axios.defaults.baseURL = '/api';

Vue.use(ElementUI); // 使用elementUI

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
