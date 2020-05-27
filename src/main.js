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

import TreeTable from 'vue-table-with-tree-grid';

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求
import axios from 'axios';
Vue.prototype.$http = axios;

axios.defaults.baseURL = '/api';
// axios请求拦截 展示进度条 NProgress.start();
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回 config
  return config
})

// response  隐藏进度条  NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done();
  // 最后必须返回 config
  return config
})
// 使用elementUI
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.filter('dataFormate', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
