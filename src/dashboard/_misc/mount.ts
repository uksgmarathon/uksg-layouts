import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/roboto-font/roboto-font.css';
import { createHead } from '@unhead/vue/client';
import { Dark, Quasar } from 'quasar';
import 'quasar/src/css/index.sass';
import { createApp, type Component } from 'vue';

/**
 * Starts a dashboard panel: mounts its root component with Quasar (in dark mode) and unhead.
 */
export function mount(App: Component) {
  const app = createApp(App);
  const head = createHead();
  app.use(Quasar);
  app.use(head);
  app.mount('#app');
  Dark.set(true);
}
