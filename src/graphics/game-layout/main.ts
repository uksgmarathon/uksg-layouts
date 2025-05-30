import { createHead } from '@unhead/vue/client';
import { createApp } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import '../_misc/theme';
import L_16x9_1p from './layouts/16x9-1p.vue';
import L_16x9_2p from './layouts/16x9-2p.vue';
import L_3DS_1p from './layouts/3DS-1p.vue';
import L_4x3_1p from './layouts/4x3-1p.vue';
import L_4x3_2p from './layouts/4x3-2p.vue';
import App from './main.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { name: '4:3 1 Player', path: '/4x3-1p', component: L_4x3_1p },
    { name: '4:3 2 Player', path: '/4x3-2p', component: L_4x3_2p },
    { name: '16:9 1 Player', path: '/16x9-1p', component: L_16x9_1p },
    { name: '16:9 2 Player', path: '/16x9-2p', component: L_16x9_2p },
    { name: '3DS 1 Player', path: '/3DS-1p', component: L_3DS_1p },
    { path: '/:pathMatch(.*)*', redirect: '/4x3-1p' },
  ],
});

const app = createApp(App);
const head = createHead();
app.use(head);
app.use(router);
app.mount('#app');
