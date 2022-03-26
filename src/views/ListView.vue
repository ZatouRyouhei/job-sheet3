<template>
  <div class="list">
    <p-data-table
      id="data-table"
      :value="searchList"
      :scrollable="true"
      scrollDirection="both"
      showGridlines
      stripedRows
      scrollHeight="calc(100vh - 100px)"
      :loading="loading"
      selectionMode="single"
      dataKey="id"
      v-model:selection="selectedData"
      class="p-datatable-sm"
      :rowStyle="{cursor: 'default'}"
      :virtualScrollerOptions="{ itemSize: 30 }">
      <p-toolbar>
        <template #start>
          <p-button id="new-button" icon="pi pi-plus" v-tooltip="'新規作成'" class="p-button-info p-button-sm" @click="newJobSheet()" />
          <p-button id="search-button" icon="pi pi-search" v-tooltip="'検索'" class="p-button-info p-button-sm" @click="searchJobSheet()" />
          <p-button icon="pi pi-download" v-tooltip="'台帳出力'" class="p-button-success p-button-sm" :loading="excelDownloading" @click="downloadExcel"/>
        </template>
        <template #end>
          <div style="text-align:right">
            <p-multi-select id="col-select"
              :modelValue="selectedColumns"
              :options="columns"
              optionLabel="header"
              @update:modelValue="onToggle"
              placeholder="表示列を選択"
              style="width: 20em"/>
          </div>
        </template>
      </p-toolbar>
      <p-column v-if="fieldContains('id')" field="id" header="番号" :style="{width:'100px'}"></p-column>
      <p-column v-if="fieldContains('status')" header="ステータス" :style="{width:'100px'}">
        <template #body="{data}">
          <p-tag v-if="getStatus(data) === 'success'" class="mr-2" value="完了" severity="success" icon="pi pi-check"></p-tag>
          <p-tag v-else-if="getStatus(data) === 'danger'" class="mr-2" value="期限超過" severity="danger" icon="pi pi-exclamation-triangle"></p-tag>
          <p-tag v-else-if="getStatus(data) === 'warning'" class="mr-2" :value="getWarningMsg(data)" severity="warning" icon="pi pi-info-circle"></p-tag>
        </template>
      </p-column>
      <p-column v-if="fieldContains('client')" field="client.name" header="顧客" :style="{width:'150px'}"></p-column>
      <p-column v-if="fieldContains('business')" field="businessSystem.business.name" header="業務" :style="{width:'150px'}"></p-column>
      <p-column v-if="fieldContains('system')" field="businessSystem.name" header="システム" :style="{width:'180px'}"></p-column>
      <p-column v-if="fieldContains('inquiry')" field="inquiry.name" header="問合せ区分" :style="{width:'100px'}"></p-column>
      <p-column v-if="fieldContains('department')" field="department" header="部署" :style="{width:'150px'}"></p-column>
      <p-column v-if="fieldContains('person')" field="person" header="担当者" :style="{width:'130px'}"></p-column>
      <p-column v-if="fieldContains('occurDate')" field="occurDate" header="発生日" :style="{width:'130px'}">
        <template #body="{data}">
            {{formatDate(data.occurDate)}}
        </template>
      </p-column>
      <p-column v-if="fieldContains('occurTime')" field="occurTime" header="発生時間" :style="{width:'80px'}"></p-column>
      <p-column v-if="fieldContains('contact')" field="contact.name" header="窓口" :style="{width:'130px'}"></p-column>
      <p-column v-if="fieldContains('title')" field="title" header="タイトル" :style="{width:'200px'}"></p-column>
      <p-column v-if="fieldContains('content')" field="content" header="内容" :style="{width:'380px'}" >
        <template #body="{data}">
            <pre style="white-space: pre-wrap;">{{data.content}}</pre>
        </template>
      </p-column>
      <p-column v-if="fieldContains('limitDate')" field="limitDate" header="完了期限" :style="{width:'130px'}">
        <template #body="{data}">
            {{formatDate(data.limitDate)}}
        </template>
      </p-column>
      <p-column v-if="fieldContains('support')" field="support" header="対応詳細" :style="{width:'380px'}">
        <template #body="{data}">
            <pre style="white-space: pre-wrap;">{{data.support}}</pre>
        </template>
      </p-column>
      <p-column v-if="fieldContains('deal')" field="deal.name" header="対応者" :style="{width:'130px'}"></p-column>
      <p-column v-if="fieldContains('completeDate')" field="completeDate" header="完了日" :style="{width:'130px'}">
        <template #body="{data}">
            {{formatDate(data.completeDate)}}
        </template>
      </p-column>
      <p-column v-if="fieldContains('responseTime')" field="responseTime" header="対応時間" :style="{width:'80px'}"></p-column>
      <p-column v-if="fieldContains('attachment')" header="添付" :style="{width:'50px'}">
        <template #body="{data}">
          <i v-if="data.fileList.length > 0" class="pi pi-paperclip"></i>
        </template>
      </p-column>
      <p-column :style="{width:'80px'}" frozen alignFrozen="right">
        <template #body="{data}">
          <p-button icon="pi pi-pencil" v-tooltip="'編集'" class="p-button-rounded p-button-info p-button-sm" @click="editJobSheet(data)" />
        </template>
      </p-column>
    </p-data-table>

    <!-- 業務日誌編集ダイアログ -->
    <p-dialog position="left" :header="header" v-model:visible="jobSheetDialog" :modal="true">
        <edit-component v-bind:targetId="editId" v-on:doemit="search" v-on:closeDialog="closeJobSheetDialog"/>
    </p-dialog>

    <!-- 業務日誌編集ダイアログ -->
    <!--
    <p-dialog position="left" header="新規登録" v-model:visible="newJobSheetDialog" :modal="true">
        <edit-component  v-on:doemit="search" v-on:closeDialog="closeJobSheetDialog" />
    </p-dialog>
    -->

    <!-- 業務日誌検索ダイアログ -->
    <!-- 検索部分を別のコンポーネントにしたかったが、ダイアログを閉じると入力していた検索条件が消えてしまう。
         検索条件を保持する方法がなさそうなので、別コンポーネントにはしなかった。
    <p-dialog header="検索" v-model:visible="searchDialog">
      <search-component v-on:doemit="dosearch" ref="searchComponentRef"/>
    </p-dialog>
    -->
    <p-dialog header="検索" v-model:visible="searchDialog">
        <div class="search">
          <label id="client-label" for="client">顧客</label>
          <p-dropdown id="client" v-model="client" :options="clientList" optionLabel="name" optionValue="id" :showClear="true"/>
          <label id="business-label" for="business">業務</label>
          <p-dropdown id="business" v-model="business" :options="businessList" optionLabel="name" optionValue="id" :showClear="true" v-on:change="changeBusiness"/>
          <label id="system-label" for="system">システム</label>
          <p-dropdown id="system" v-model="system" :options="systemList" optionLabel="name" optionValue="id" :showClear="true"/>
          <label id="inquiry-label" for="inquiry">問合せ区分</label>
          <p-dropdown id="inquiry" v-model="inquiry" :options="inquiryList" optionLabel="name" optionValue="id" :showClear="true"/>
          <label id="contact-label" for="contact">窓口</label>
          <p-dropdown id="contact" v-model="contact" :options="contactList" optionLabel="name" optionValue="id" :showClear="true"/>
          <label id="deal-label" for="deal">対応者</label>
          <p-dropdown id="deal" v-model="deal" :options="dealList" optionLabel="name" optionValue="id" :showClear="true"/>
          <label id="occurDate-label" for="occurDate">発生日（自-至）</label>
          <span id="occurDate">
          <p-calendar v-model="occurDate" selectionMode="range" :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true" style="width: 350px;">
            <template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
          </p-calendar>
          </span>
          <label id="limitDate-label" for="limitDate">完了期限（指定日以前を検索）</label>
          <span id="limitDate">
            <p-calendar v-model="limitDate" :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true" style="width: 200px;">
              <template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
            </p-calendar>
          </span>
          <label id="keyword-label" for="keyword">キーワード</label>
          <p-input-text id="keyword" type="text" v-model="keyword" style="width: 400px;" />
          <p-select-button id="state-id" v-model="stateSelect" :options="stateOptions" optionLabel="name" multiple/>
          <p-button id="search-id" label="検索" icon="pi pi-search" class="p-button-info" :loading="searchLoading" v-on:click="jobSheetSearch"/>
        </div>
    </p-dialog>

    <p-toast group="tk"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import Constant from '@/constant'
  import axios from 'axios'
  import { ClientType, BusinessType, SystemType, InquiryType, UserType, JobSheetType, SearchConditionType, AttachmentType } from '@/constantType'
  import DateUtil from '@/DateUtil'
  //import SearchComponent from '@/components/SearchComponent.vue'
  import EditComponent from '@/components/EditComponent.vue'
  import { useStore } from '@/store'
  import { useToast } from "primevue/usetoast";
  import { saveAs } from 'file-saver'

  export default defineComponent({
    components: {
      //SearchComponent
      EditComponent
    },
    setup() {
      const store = useStore()
      const searchList = ref<JobSheetType[]>([])
      const loading = ref(false)
      const selectedData = ref()
      //const searchComponentRef = ref()
      // 検索条件（初期表示時は自分が窓口となっているデータを検索する。）
      const searchCondition = ref<SearchConditionType>({
        client: 0,
        business: 0,
        businessSystem: 0,
        inquiry: 0,
        contact: store.state.user.id,
        deal: '',
        occurDateFrom: '',
        occurDateTo: '',
        completeSign: 0,
        limitDate: '',
        keyword: ''
      })

      // 検索処理
      const search = () => {
        loading.value = true
        axios.post<JobSheetType[]>(Constant.URL_JOBSHEET_SEARCH, searchCondition.value).then((res) => {
          searchList.value = res.data
        }).finally(() => {
          // 一覧のロードを止める
          loading.value = false
          // 検索ダイアログのロードを止める
          searchLoading.value = false

          //searchComponentRef.value.loading = false
          
        })
      }

      // 表示列の制御
      const columns = ref([
          {field: 'id', header: '番号'},
          {field: 'status', header: 'ステータス'},
          {field: 'client', header: '顧客'},
          {field: 'business', header: '業務'},
          {field: 'system', header: 'システム'},
          {field: 'inquiry', header: '問合せ区分'},
          {field: 'department', header: '部署'},
          {field: 'person', header: '担当者'},
          {field: 'occurDate', header: '発生日'},
          {field: 'occurTime', header: '発生時間'},
          {field: 'contact', header: '窓口'},
          {field: 'title', header: 'タイトル'},
          {field: 'content', header: '内容'},
          {field: 'limitDate', header: '完了期限'},
          {field: 'support', header: '対応詳細'},
          {field: 'deal', header: '対応者'},
          {field: 'completeDate', header: '完了日'},
          {field: 'responseTime', header: '対応時間'},
          {field: 'attachment', header: '添付'}
      ]);
      // デフォルトはすべての列を表示する。
      let selectedColumns = ref(columns.value);
      // 前回表示列を選択していた場合は、それを適用する。
      const initialSelectedColumns = localStorage.getItem('job_sheet_selected_columns')
      if (initialSelectedColumns !==null) {
        selectedColumns = ref(JSON.parse(initialSelectedColumns))
      }

      // 選択した列のfieldのみを抜き出したもの。列の表示、非表示の判定で使用する。
      const selectedFields = ref(selectedColumns.value.map(col => col.field))

      // 表示列を選択されたとき
      const onToggle = (val: [{field:string, header:string}]) => {
          selectedColumns.value = columns.value.filter(col => {
            for (let v of val) {
              if (v.field === col.field) {
                return true
              }
            }
          });
          selectedFields.value = selectedColumns.value.map(col => col.field)
          // 次回も利用するためにローカルストレージに保存しておく
          localStorage.setItem('job_sheet_selected_columns', JSON.stringify(selectedColumns.value))
      };
      const fieldContains = (val: string) => {
        return selectedFields.value.includes(val)
      }

      // 一覧のステータス判定処理
      const getStatus = (data: JobSheetType) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const limitDate = DateUtil.strToDate(data.limitDate)
        if (data.completeDate) {
          return "success"
        } else {
          if (data.limitDate) {
            if (limitDate < today) {
              return "danger"
            } else {
              let termDate = Math.floor((limitDate.getTime() - today.getTime()) / 86400000) + 1
              if (termDate <= 3) {
                return "warning"
              } else {
                return ""
              }
            }
          } else {
            return ""
          }
        }
      }

      const getWarningMsg = (data: JobSheetType) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const limitDate = DateUtil.strToDate(data.limitDate)
        let termDate = Math.floor((limitDate.getTime() - today.getTime()) / 86400000) + 1
        return "あと" + termDate + "日"
      }

      const editId = ref('')
      const header = ref('')
      // 業務日誌新規作成ボタンを押された時、新規作成ダイアログを開く
      // const newJobSheetDialog = ref(false)
      const newJobSheet = () => {
        jobSheetDialog.value = true
        editId.value = ''
        header.value = '新規登録'
      }
      // 業務日誌編集ボタンを押された時、編集ダイアログを開く
      const jobSheetDialog = ref(false)
      const editJobSheet = (data: JobSheetType) => {
        jobSheetDialog.value = true
        editId.value = data.id
        header.value = '編集'
      }
      // 検索ボタンを押された時、検索ダイアログを開く
      const searchDialog = ref(false)
      const searchJobSheet = () => {
        searchDialog.value = true
      }

      const toast = useToast();
      const closeJobSheetDialog = () => {
        jobSheetDialog.value = false
        // newJobSheetDialog.value = false
        toast.add({severity:'success', summary: '削除しました。', life: 5000, group: 'tk', closable: false});
      }

      // 検索ダイアログから検索条件を受け取り検索を実行する。
      // const dosearch = (searchCondFromComp: SearchConditionType) => {
      //   searchCondition.value = searchCondFromComp
      //   search()
      // }

      // 一覧に表示する日付のフォーマッター
      const formatDate = (value: string) => {
        return DateUtil.dateToDisp(value)
      }

      // 検索項目
      const client = ref(0)  // 初期値は空欄で0となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const clientList = ref<ClientType[]>([])
      const business = ref(0)  // 初期値は空欄で0となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const businessList = ref<BusinessType[]>([])
			const system = ref(0)  // 初期値は空欄で0となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const systemList = ref<SystemType[]>([])
			const inquiry = ref(0)  // 初期値は空欄で0となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const inquiryList = ref<InquiryType[]>([])
			const contact = ref('')  // 初期値は空欄で空文字となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const contactList = ref<UserType[]>([])
			const deal = ref('') // 初期値は空欄で空文字となる、空欄以外を選択して検索した後に再度空欄を選択するとnullになる
			const dealList = ref<UserType[]>([])
			const occurDate = ref<Date[]>()  // Date型の配列（要素数は2） 初期値は空欄でundefinedとなる。日付を入力して検索した後に再度空欄を選択するとnullになる。Toだけ入っていた場合は要素数2の配列となり、2つめの要素がnullとなる。
			const limitDate = ref<Date>() // Date型 初期値は空欄でundefinedとなる。日付を入力して検索した後に再度空欄を選択するとnullになる
			const keyword = ref('')
			const stateSelect = ref<{name:string, value: number}[]>() // {name:string, value: number}型の配列（要素数最大2）初期値はどちらも選択されていない状態でundefinedとなる。いづれかを選択して検索した後に再度選択すると長さ0の配列になる。
			const stateOptions = ref([
				{name: '完了', value: 1},
				{name: '未完了', value: 2}
			]);
      const searchLoading = ref(false) // 検索ボタンのロード状態

      // 検索処理
      const jobSheetSearch = () => {
        searchLoading.value = true

        // 検索オブジェクトを作成する。
        let searchOccurDateFrom = ''
				if (occurDate.value === undefined || occurDate.value === null) {
					searchOccurDateFrom = ''
				} else {
					searchOccurDateFrom = DateUtil.dateToStr(occurDate.value[0])
				}
				let searchOccurDateTo = ''
				if (occurDate.value === undefined || occurDate.value === null) {
					searchOccurDateTo = ''
				} else {
					searchOccurDateTo = DateUtil.dateToStr(occurDate.value[1])
				}
				let searchLimitDate = ''
				if (limitDate.value === undefined || limitDate.value === null) {
					searchLimitDate = ''
				} else {
					searchLimitDate = DateUtil.dateToStr(limitDate.value)
				}
				let searchState = 0
				if (stateSelect.value === undefined || stateSelect.value === null) {
					searchState = 0
				} else {
					if (stateSelect.value.length === 0 || stateSelect.value.length === 2) {
						searchState = 0
					} else {
						searchState = stateSelect.value[0].value
					}
				}
				searchCondition.value = {
					client: client.value !== null ? client.value : 0,
					business: business.value !== null ? business.value : 0,
					businessSystem: system.value !== null ? system.value : 0,
					inquiry: inquiry.value !== null ? inquiry.value : 0,
					contact: contact.value !== null ? contact.value : '',
					deal: deal.value !== null ? deal.value : '',
					occurDateFrom: searchOccurDateFrom,
					occurDateTo: searchOccurDateTo,
					completeSign: searchState,
					limitDate: searchLimitDate,
					keyword: keyword.value
				}
        // 検索処理実行
        search()
      }

      // 業務プルダウンを選択したときに、自動的にシステムプルダウンを生成する。
			const changeBusiness = () => {
				const selectBusiness = business.value != null ? business.value : 0
				axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST + selectBusiness).then((res) => {
					systemList.value = res.data
				})
				system.value = 0
			}

      // Excel台帳をダウンロードする。
      const excelDownloading = ref(false)
      const downloadExcel = () => {
        excelDownloading.value = true
        axios.post(Constant.URL_JOBSHEET_DOWNLOAD, searchCondition.value, {
          responseType:'blob'
        }).then((res) => {
          const blob = new Blob([res.data], {
                          type: "application/octet-stream"
                        });
          saveAs(blob, "台帳.xlsx")
        }).finally(() => {
          // 台帳ボタンを活性とし、ローディングを解除
          excelDownloading.value = false
        })
      }

      // 初期処理
      onMounted(() => {
        // 一覧検索
        search()

        // 検索プルダウンを作成
        // 顧客名リスト取得
				axios.get<ClientType[]>(Constant.URL_CLIENT_GETLIST).then((res) => {
					clientList.value = res.data
				})
        // 業務リスト取得
				axios.get<BusinessType[]>(Constant.URL_BUSINESS_GETLIST).then((res) => {
					businessList.value = res.data
				})
				// 問合せ区分取得
				axios.get<InquiryType[]>(Constant.URL_INQUIRY_GETLIST).then((res) => {
					inquiryList.value = res.data
				})
				// 窓口リスト、対応者
				axios.get<UserType[]>(Constant.URL_USER_GETLIST).then((res) => {
					contactList.value = res.data
					dealList.value = res.data
				})
				// 窓口には自分を初期選択
				contact.value = store.state.user.id
      })

      return {searchList, loading, columns, selectedColumns, jobSheetDialog,
        editId, header,
        // newJobSheetDialog,
        searchDialog, searchCondition,
        client, clientList, business, businessList, system, systemList, inquiry, inquiryList,
				contact, contactList, deal, dealList, occurDate, limitDate, keyword, stateSelect, stateOptions, searchLoading, excelDownloading, selectedData,
        //searchComponentRef, dosearch
        search, formatDate, onToggle,
        fieldContains, getStatus, editJobSheet, newJobSheet, searchJobSheet, changeBusiness, jobSheetSearch, closeJobSheetDialog, getWarningMsg, downloadExcel}
    }
  })
</script>

<style scoped>
#data-table {
  font-size: 80%;
}

#new-button, #search-button {
  margin-right: 20px;
}

.p-dropdown {
	width: 200px;
}

.search {
	display: grid;
	grid-template-columns: 230px 230px 230px 230px;
	grid-template-rows: 30px 80px 30px 80px 30px 80px 80px ;
}
#client-label {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#client {
	grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#business-label {
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#business {
	grid-column: 2 / 3;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#system-label {
	grid-column: 3 / 4;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#system {
	grid-column: 3 / 4;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#inquiry-label {
	grid-column: 4 / 5;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#inquiry {
	grid-column: 4 / 5;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#contact-label {
	grid-column: 1 / 2;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#contact {
	grid-column: 1 / 2;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#deal-label {
	grid-column: 2 / 3;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#deal {
	grid-column: 2 / 3;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#occurDate-label {
	grid-column: 3 / 5;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#occurDate {
	grid-column: 3 / 5;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#limitDate-label {
	grid-column: 1 / 2;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: center;
}
#limitDate {
	grid-column: 1 / 2;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#keyword-label {
	grid-column: 2 / 4;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: center;
}
#keyword {
	grid-column: 2 / 4;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#state-id {
	grid-column: 4 / 5;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#search-id {
	grid-column: 4 / 5;
	grid-row: 7 / 8;
	justify-self: center;
	align-self: start;
}
</style>