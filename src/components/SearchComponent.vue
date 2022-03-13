<template>
	<div class="search">
		<span id="client-id" class="p-float-label">
			<p-dropdown id="client" v-model="client" :options="clientList" optionLabel="name" optionValue="id" :showClear="true"/>
			<label for="client">顧客</label>
		</span>
		<span id="business-id" class="p-float-label">
			<p-dropdown id="business" v-model="business" :options="businessList" optionLabel="name" optionValue="id" :showClear="true" v-on:change="changeBusiness"/>
			<label for="business">業務</label>
		</span>
		<span id="system-id" class="p-float-label">
			<p-dropdown id="system" v-model="system" :options="systemList" optionLabel="name" optionValue="id" :showClear="true"/>
			<label for="system">システム</label>
		</span>
		<span id="inquiry-id" class="p-float-label">
			<p-dropdown id="inquiry" v-model="inquiry" :options="inquiryList" optionLabel="name" optionValue="id" :showClear="true"/>
			<label for="inquiry">問合せ区分</label>
		</span>
		<span id="contact-id" class="p-float-label">
			<p-dropdown id="contact" v-model="contact" :options="contactList" optionLabel="name" optionValue="id" :showClear="true"/>
			<label for="contact">窓口</label>
		</span>
		<span id="deal-id" class="p-float-label">
			<p-dropdown id="deal" v-model="deal" :options="dealList" optionLabel="name" optionValue="id" :showClear="true"/>
			<label for="deal">対応者</label>
		</span>
		<span id="occurDate-id" class="p-float-label">
			<p-calendar id="occurDate" v-model="occurDate" selectionMode="range" :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true" style="width: 350px;">
				<template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
			</p-calendar>
			<label for="occurDate">発生日（自-至）</label>
		</span>
		<span id="limitDate-id" class="p-float-label">
			<p-calendar id="limitDate" v-model="limitDate" :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true" style="width: 200px;">
				<template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
			</p-calendar>
			<label for="limitDate">完了期限（指定日以前を検索）</label>
		</span>
		<span id="keyword-id" class="p-float-label">
			<p-input-text id="keyword" type="text" v-model="keyword" />
			<label for="keyword">キーワード</label>
		</span>
		<p-select-button id="state-id" v-model="stateSelect" :options="stateOptions" optionLabel="name" multiple/>
		<p-button id="search-id" label="検索" icon="pi pi-search" class="p-button-info" :loading="loading" v-on:click="search"/>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref, PropType } from 'vue';
	import { ClientType, BusinessType, SystemType, InquiryType, UserType, SearchConditionType, JobSheetType, AttachmentType } from '@/constantType'
	import Constant from '@/constant'
	import axios from 'axios'
	import { useStore } from '@/store'
	import DateUtil from '@/DateUtil'

	export default defineComponent({
		// props: {
		// 	searchCondition: {
		// 		type: Object as PropType<SearchConditionType>,
		// 		required: true
		// 	}
		// },
		setup(props, context) {
			const store = useStore()

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

			// 検索処理
			const loading = ref(false)
			const search = () => {
				loading.value = true
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
				const searchObj = {
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
				// 検索結果を一覧画面に反映する
				context.emit("doemit", searchObj)
			}

			// 初期表示時にプルダウンの内容をセットする。
			onMounted(() => {
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

			// 業務プルダウンを選択したときに、自動的にシステムプルダウンを生成する。
			const changeBusiness = () => {
				const selectBusiness = business.value != null ? business.value : 0
				axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST + selectBusiness).then((res) => {
					systemList.value = res.data
				})
				system.value = 0
			}

			return {client, clientList, business, businessList, system, systemList, inquiry, inquiryList,
				contact, contactList, deal, dealList, occurDate, limitDate, keyword, stateSelect, stateOptions,
				loading, changeBusiness, search}
		}
	})
</script>

<style scoped>
.p-dropdown {
	width: 200px;
}

.search {
	display: grid;
	grid-template-columns: 230px 230px 230px 230px;
	grid-template-rows: 100px 100px 100px 100px ;
}
#client-id {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#business-id {
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#system-id {
	grid-column: 3 / 4;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#inquiry-id {
	grid-column: 4 / 5;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
}
#contact-id {
	grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: center;
}
#deal-id {
	grid-column: 2 / 3;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: center;
}
#occurDate-id {
	grid-column: 3 / 5;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: center;
}
#limitDate-id {
	grid-column: 1 / 2;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#keyword-id {
	grid-column: 2 / 3;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#state-id {
	grid-column: 3 / 4;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: center;
}
#search-id {
	grid-column: 4 / 5;
	grid-row: 4 / 5;
	justify-self: center;
	align-self: center;
}
</style>