import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
// import './components/common/directives';
import "babel-polyfill";
import store from './store';

//拖拽el-dialog
import './directives'

import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
import 'vue-directive-image-previewer/dist/assets/style.css';
Vue.use(VueDirectiveImagePreviewer);

Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

//图片预览
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview);

//省市区三级联动插件(v-distpicker)
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker);



//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const loginFlag = store.state.loginFlag;
    // const role = localStorage.getItem('LoginId1');
    if(!loginFlag && to.path !== '/login'){
        next('/login');
    }else if(to.meta.function){  // 配置在role/index.js
        const ruleFunction = store.state.ruleFunction;
        ruleFunction[to.meta.function] ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
});


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');


