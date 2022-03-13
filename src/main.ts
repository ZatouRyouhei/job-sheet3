import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { key } from './store'
import PrimeVue from 'primevue/config';
import ja from "@/i18n/locale/ja" // ja.tsをインポート
//import "primevue/resources/themes/saga-blue/theme.css" // テーマ
import "primevue/resources/themes/lara-light-indigo/theme.css"
import "primevue/resources/primevue.min.css" // ベース
import "primeicons/primeicons.css" // アイコン

import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from "primevue/button"
import Calendar from 'primevue/calendar';
import Tooltip from 'primevue/tooltip';
import CalendarTemplate from '@/components/CalendarTemplate.vue'
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import TabMenu from 'primevue/tabmenu';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import BadgeDirective from 'primevue/badgedirective';
import Badge from 'primevue/badge';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmPopup from 'primevue/confirmpopup';
import FileUpload from 'primevue/fileupload';

const app = createApp(App);
app.use(store, key).use(router)
app.use(PrimeVue, { locale: ja })
app.use(ToastService);
app.use(ConfirmationService)
// コンポーネントを読み込んでからマウントする。
app.component('p-input-text', InputText);
app.component('p-password', Password);
app.component('p-button', Button);
app.component('p-calendar', Calendar);
app.component('p-calendar-template', CalendarTemplate)
app.component('p-toast', Toast)
app.component('p-menu', Menu)
app.component('p-dialog', Dialog)
app.component('p-tabmenu', TabMenu)
app.component('p-progress-spinner', ProgressSpinner)
app.component('p-data-table', DataTable)
app.component('p-column', Column)
app.component('p-multi-select', MultiSelect)
app.component('p-tag', Tag)
app.component('p-toolbar', Toolbar)
app.component('p-dropdown', Dropdown)
app.component('p-select-button', SelectButton)
app.component('calendar-template', CalendarTemplate)
app.component('p-textarea', Textarea)
app.component('p-input-number', InputNumber)
app.component('p-badge', Badge)
app.component('p-confirm-popup', ConfirmPopup)
app.component('p-file-upload', FileUpload)
app.directive('tooltip', Tooltip)
app.directive('badge', BadgeDirective)

app.mount('#app')
