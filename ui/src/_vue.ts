import type { App } from 'vue';
import Vue3EasyDataTable from 'vue3-easy-data-table';

export default (app: App) => {
  app.component('EasyDataTable', Vue3EasyDataTable);
};
