<template>
	<div class="edit">
		<form @submit.prevent="handleSubmit(!v$.$invalid)" class="edit-form p-fluid">
			<div class="left-side">
				<transition appear mode="out-in">
					<span id="job-sheet-id" v-show="headerFlg">
						{{registId}} &nbsp;
						<p-tag v-if="jobStatus === 'success'" value="完了" severity="success" icon="pi pi-check"></p-tag>
						<p-tag v-else-if="jobStatus === 'danger'" value="期限超過" severity="danger" icon="pi pi-exclamation-triangle"></p-tag>
						<p-tag v-else-if="jobStatus === 'warning'" :value="termDateMsg" severity="warning" icon="pi pi-info-circle"></p-tag>
					</span>
				</transition>
				<p-progress-spinner style="width:50px; height:50px" strokeWidth="4" id="initSpinner" v-show="initFlg"/>
				<label id="client-label" for="client" class="required">顧客</label>
				<p-dropdown id="client" :options="clientList" optionLabel="name" optionValue="id" :showClear="true"
										v-model="v$.client.$model" :class="{'p-invalid':v$.client.$invalid && submitted}"/>
				<label id="business-label" for="business" class="required">業務</label>
				<p-dropdown id="business" :options="businessList" optionLabel="name" optionValue="id" :showClear="true"  v-on:change="changeBusiness"
										v-model="v$.business.$model" :class="{'p-invalid':v$.business.$invalid && submitted}"/>
				<label id="system-label" for="system" class="required">システム</label>
				<p-dropdown id="system" :options="systemList" optionLabel="name" optionValue="id" :showClear="true"
										v-model="v$.system.$model" :class="{'p-invalid':v$.system.$invalid && submitted}"/>
				<label id="inquiry-label" for="inquiry" class="required">問合せ区分</label>
				<p-dropdown id="inquiry" :options="inquiryList" optionLabel="name" optionValue="id" :showClear="true"
										v-model="v$.inquiry.$model" :class="{'p-invalid':v$.inquiry.$invalid && submitted}"/>
				<label id="department-label" for="department" class="required">部署（{{v$.department.maxLength.$params.max}}文字まで）</label>
				<p-input-text id="department" type="text" v-model="v$.department.$model" :class="{'p-invalid':v$.department.$invalid && submitted}" />
				<label id="person-label" for="person" class="required">担当者（{{v$.person.maxLength.$params.max}}文字まで）</label>
				<p-input-text id="person" type="text" v-model="v$.person.$model" :class="{'p-invalid':v$.person.$invalid && submitted}" />
				<!-- カレンダーのクリアボタンを押すとType Errorが発生する。prime-vueのcalendarのバグ？ -->
				<label id="occurDate-label" for="occurDate" class="required">発生日</label>
				<span id="occurDate">
					<p-calendar :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true"
											v-model="v$.occurDate.$model" :class="{'p-invalid':v$.occurDate.$invalid && submitted}" style="width: 230px;">
						<template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
					</p-calendar>
				</span>
				<label id="occurTime-label" for="occurTime" class="required">発生時間</label>
				<span id="occurTime">
					<p-calendar :showTime="true" :timeOnly="true" :stepMinute="15" hourFormat="24"
											v-model="v$.occurTime.$model" :class="{'p-invalid':v$.occurTime.$invalid && submitted}" style="width: 230px;"/>
				</span>
				<label id="contact-label" for="contact" class="required">窓口</label>
				<p-dropdown id="contact" :options="contactList" optionLabel="name" optionValue="id" :showClear="true"
										v-model="v$.contact.$model" :class="{'p-invalid':v$.contact.$invalid && submitted}"/>
				<label id="title-label" for="title" class="required">タイトル（{{v$.title.maxLength.$params.max}}文字まで）</label>
				<p-input-text id="title" type="text" v-model="v$.title.$model" :class="{'p-invalid':v$.title.$invalid && submitted}" />
				<label id="content-label" for="content" class="required">内容 （{{v$.content.maxLength.$params.max}}文字まで。現在{{state.content.length}}文字）</label>
				<p-textarea id="content" rows="6" cols="30" v-model="v$.content.$model" :class="{'p-invalid':v$.content.$invalid && submitted}" />
			</div>

			<div class="right-side">
				<label id="limitDate-label" for="limitDate">完了期限</label>
				<span id="limitDate">
					<p-calendar :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true"
											v-model="v$.limitDate.$model" :class="{'p-invalid':v$.limitDate.$invalid && submitted}" style="width: 230px;">
						<template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
					</p-calendar>
				</span>
				<label id="support-label" for="support">対応詳細（{{v$.support.maxLength.$params.max}}文字まで。現在{{state.support.length}}文字）</label>
				<p-textarea id="support" rows="6" cols="30" v-model="v$.support.$model" :class="{'p-invalid':v$.support.$invalid && submitted}" />
				<label id="deal-label" for="deal">対応者</label>
				<label id="select-myself"><span style="color: blue; cursor: pointer;" v-on:click="selectMyself">自分のとき</span></label>
				<p-dropdown id="deal" :options="contactList" optionLabel="name" optionValue="id" :showClear="true"
										v-model="v$.deal.$model" :class="{'p-invalid':v$.deal.$invalid && submitted}"/>
				<label id="completeDate-label" for="completeDate">完了日</label>
				<span id="completeDate">
					<p-calendar :manualInput="false" dateFormat="yy年mm月dd日" :showButtonBar="true"
											v-model="v$.completeDate.$model" :class="{'p-invalid':v$.completeDate.$invalid && submitted}" style="width: 230px;">
						<template #date="slotProps"><calendar-template :paramProps="slotProps" /></template>
					</p-calendar>
				</span>
				<label id="responseTime-label" for="responseTime">対応時間（時間）</label>
				<span id="responseTime">
					<p-input-number  :step="0.5" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
										incrementButtonClass="p-button-secondary" decrementButtonClass="p-button-secondary" mode="decimal" :min="0"
										v-model="v$.responseTime.$model" :class="{'p-invalid':v$.responseTime.$invalid && submitted}" style="width: 230px; height: 50px;"/>
				</span>
				<p-button id="submit-btn" type="submit" label="登録" icon="pi pi-pencil" class="p-button-info" :loading="loading" style="width: 110px;"/>
				<!-- 新規登録時は非表示にする -->
				<p-button v-show="!newFlg" id="attach-btn" label="添付" v-tooltip="'添付ファイルのアップロード、ダウンロードダイアログを開きます'" :badge="files" style="width: 110px;" v-on:click="downloadFile" />
				<p-button v-show="!newFlg" id="pdf-btn" label="印刷" icon="pi pi-file-pdf" v-tooltip="'業務日誌をPDFで出力します'" class="p-button-success" :loading="pdfLoading" v-on:click="downloadPdf" style="width: 110px;"/>
				<p-button v-show="!newFlg" id="delete-btn" v-on:click="delConfirm($event)" label="削除" icon="pi pi-trash" class="p-button-danger p-button-outlined" :loading="delLoading" style="width: 110px;"/>
				<p-confirm-popup></p-confirm-popup>
			</div>
		</form>
		
		<p-toast group="tk"/>

		<!-- 添付ファイルダウンロードダイアログ -->
		<p-dialog header="添付ファイル" v-model:visible="fileDownloadDialog">
			<attach-component v-bind:editJobSheetId="registId" v-on:resetFileNo="resetFileNo"/>
		</p-dialog>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref, reactive} from 'vue';
	import { ClientType, BusinessType, SystemType, InquiryType, UserType, JobSheetType, JobSheetFormType } from '@/constantType'
	import axios from '@/axios'
	import Constant from '@/constant'
	import { required, maxLength } from "@vuelidate/validators";
	import { useVuelidate } from "@vuelidate/core";
	import { useToast } from "primevue/usetoast";
	import DateUtil from '@/DateUtil'
	import { useStore } from '@/store'
	import { useConfirm } from "primevue/useconfirm";
	import AttachComponent from '@/components/AttachComponent.vue'

	export default defineComponent({
		props: {
			targetId: {
				type: String,
				required: true
			},
			argNewFlg: {
				type: Boolean,
				required: true
			}
		},
		components: {
			AttachComponent
		},
		setup(props, context) {
			const store = useStore()
			const toast = useToast()
			const state = reactive<JobSheetFormType>({
				client: 0,
				business: 0,
				system: 0,
				inquiry: 0,
				department: '',
				person: '',
				occurDate: new Date(),
				occurTime: new Date(),
				contact: store.state.user.id,
				title: '',
				content: '',
				limitDate: '',
				support: '',
				deal: '',
				completeDate: '',
				responseTime: 0
			});

			// プルダウンの必須チェック 0もしくはnullの時にエラーとする。
			// number型で扱いたいのでデフォルト値に0を入れているが、その場合、単にrequiredの条件だけだと
			// 必須チェックが動いてくれない。
			const customRequied = (value: number) => {
				return value !== null && value > 0
			}

			const rules = {
				client: { customRequied },
				business: { customRequied },
				system: { customRequied },
				inquiry: { customRequied },
				department: {
					required,
					maxLength: maxLength(50)
				},
				person: {
					required,
					maxLength: maxLength(50)
				},
				occurDate: {required},
				occurTime: {required},
				contact: {required},
				title: {
					required,
					maxLength: maxLength(50)
				},
				content: {
					required,
					maxLength: maxLength(10000)
				},
				limitDate: {}, // 入力条件がない項目も空で入れておく必要がある。
				support: {maxLength: maxLength(10000)},
				deal: {},
				completeDate: {},
				responseTime: {}
			};

			const loading = ref(false)
			const headerFlg = ref(true)  // IDとステータスの表示
			const submitted = ref(false);
			const v$ = useVuelidate(rules, state);

			const handleSubmit = (isFormValid: boolean) => {
				submitted.value = true;
				if (!isFormValid) {
					// 入力エラーがある場合
					if (v$.value.client.$invalid && submitted) {
						addToast("顧客を入力してください。")
					}
					if (v$.value.business.$invalid && submitted) {
						addToast("業務を入力してください。")
					}
					if (v$.value.system.$invalid && submitted) {
						addToast("システムを入力してください。")
					}
					if (v$.value.inquiry.$invalid && submitted) {
						addToast("問合せ区分を入力してください。")
					}
					if (v$.value.department.required.$invalid && submitted) {
						addToast("問合せ部署を入力してください。")
					}
					if (v$.value.department.maxLength.$invalid && submitted) {
						addToast('問合せ部署は' + v$.value.department.maxLength.$params.max + '文字以内で入力してください。')
					}
					if (v$.value.person.required.$invalid && submitted) {
						addToast("担当者を入力してください。")
					}
					if (v$.value.person.maxLength.$invalid && submitted) {
						addToast('担当者は' + v$.value.person.maxLength.$params.max + '文字以内で入力してください。')
					}
					if (v$.value.occurDate.$invalid && submitted) {
						addToast("発生日を入力してください。")
					}
					if (v$.value.occurTime.$invalid && submitted) {
						addToast("発生時間を入力してください。")
					}
					if (v$.value.contact.$invalid && submitted) {
						addToast("窓口を入力してください。")
					}
					if (v$.value.title.required.$invalid && submitted) {
						addToast("タイトルを入力してください。")
					}
					if (v$.value.title.maxLength.$invalid && submitted) {
						addToast('タイトルは' + v$.value.title.maxLength.$params.max + '文字以内で入力してください。')
					}
					if (v$.value.content.required.$invalid && submitted) {
						addToast("詳細を入力してください。")
					}
					if (v$.value.content.maxLength.$invalid && submitted) {
						addToast('詳細は' + v$.value.content.maxLength.$params.max + '文字以内で入力してください。')
					}
					if (v$.value.support.maxLength.$invalid && submitted) {
						addToast('対応詳細は' + v$.value.support.maxLength.$params.max + '文字以内で入力してください。')
					}
				} else {
					// 入力エラーがない場合、登録処理を実行
					loading.value = true;
					// IDとステータスを一旦非表示にする。
					headerFlg.value = false;
					// 登録オブジェクト作成
					const obj = {
						id: registId.value,  // 新規登録のときは空とする。
						client: state.client,
						business: state.business,
						businessSystem: state.system,
						inquiry: state.inquiry,
						department: state.department,
						person: state.person,
						occurDate: DateUtil.dateToStr(state.occurDate),
						occurTime: DateUtil.timeToStr(state.occurTime),
						title: state.title,
						content: state.content,
						contact: state.contact,
						limitDate: DateUtil.dateToStr(state.limitDate),
						deal: state.deal,
						completeDate: DateUtil.dateToStr(state.completeDate),
						support: state.support,
						responseTime: state.responseTime
					}
					// 登録処理
					axios.post<string>(Constant.URL_JOBSHEET_REGIST, obj).then((jsId) => {
						// 再検索処理
						context.emit("doemit")
						// 登録後のIDをセットする
						registId.value = jsId.data
						// ステータスをセットする。
						setStatus(obj.limitDate, obj.completeDate)
						// 新規フラグをfalseにする
						newFlg.value = false
						toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
					}).finally(() => {
						loading.value = false
						headerFlg.value = true
					})
				}
			}

			// 削除処理
			const delLoading = ref(false)
			const confirm = useConfirm();
			const delConfirm = (event:any) => {
				confirm.require({
					target: event.currentTarget,
					message: '削除してよろしいですか？',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: () => {
						if (registId.value) {
							delLoading.value = true
							axios.delete(Constant.URL_JOBSHEET_DELETE + registId.value).then(() => {
								// 再検索処理
								context.emit("doemit")
							}).finally(() => {
								delLoading.value = false
								// ダイアログを閉じる
								context.emit("closeDialog")
							})
						}
					}
				});
			}

			const addToast = (message: string) => {
				// メッセージを手動でクローズしようとすると、他のメッセージが後ろのレイヤにいってしまう。Prime Vueのバグ？
				// そのため、closable: falseとしている
				toast.add({severity:'error', summary: '入力にエラーがあります。', detail: message, life: 5000, group: 'tk', closable: false});
			}

			// プルダウンリスト
			const clientList = ref<ClientType[]>([])
			const businessList = ref<BusinessType[]>([])
			const systemList = ref<SystemType[]>([])
			const inquiryList = ref<InquiryType[]>([])
			const contactList = ref<UserType[]>([])
			const dealList = ref<UserType[]>([])

			const registId = ref('')  // propsで渡されたIdはreadonlyとなる。そのため、新規登録時に付番されるIDを扱うために登録用IDを別に用意しておく

			// 添付ファイルの数
			const files = ref('0')

			// 初期処理
			const initFlg = ref(false)
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

				// 編集もしくはコピーの時は、パラメータで受け取ったIDでデータを取得し、入力欄にセットする。
				if (props.targetId) {
					initFlg.value = true
					axios.get<JobSheetType>(Constant.URL_JOBSHEET_GET + props.targetId).then((res) => {
						state.client = res.data.client.id
						state.business = res.data.businessSystem.business.id
						state.system = res.data.businessSystem.id
						state.inquiry = res.data.inquiry.id
						state.department = res.data.department
						state.person = res.data.person
						const occurDateTime = DateUtil.strToDateTime(res.data.occurDate, res.data.occurTime)
						state.occurDate = occurDateTime
						state.occurTime = occurDateTime
						state.contact = res.data.contact.id
						state.title = res.data.title
						state.content = res.data.content
						state.limitDate = res.data.limitDate ? DateUtil.strToDate(res.data.limitDate) : ''
						state.support = res.data.support  // 対応詳細
						state.deal = res.data.deal.id  // 対応者
						state.completeDate = res.data.completeDate ? DateUtil.strToDate(res.data.completeDate) : ''  // 完了日
						state.responseTime = res.data.responseTime  // 対応時間

						// システムプルダウンを生成する
						axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST + state.business).then((res) => {
							systemList.value = res.data
						})

						// 編集のときだけセットする。コピーの時はセットしない。
						if (!props.argNewFlg) {
							// ステータスをセット
							setStatus(res.data.limitDate, res.data.completeDate)
							// 添付ファイルの数をセット
							files.value = String(res.data.fileList.length)
						}
					}).finally(() => {
						initFlg.value = false
					})
				}

				// 編集の時は、パラメータのIDを更新用IDに入れておく
				if (!props.argNewFlg) {
					registId.value = props.targetId
				}

				newFlg.value = props.argNewFlg
			})

			// 業務プルダウンを選択したときに、自動的にシステムプルダウンを生成する。
			const changeBusiness = () => {
				const selectBusiness = state.business != null ? state.business : 0
				axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST + selectBusiness).then((res) => {
					systemList.value = res.data
				})
				state.system = 0
			}

			// ステータス判定処理
			const jobStatus = ref('')

			const termDateMsg = ref('')
			const setStatus = (limitDateStr: string, completeDateStr: string) => {
				const now = new Date()
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
				const limitDate = DateUtil.strToDate(limitDateStr)
				if (completeDateStr) {
					jobStatus.value = "success"
				} else {
					if (limitDateStr) {
						if (limitDate < today) {
							jobStatus.value = "danger"
						} else {
							let termDate = Math.floor((limitDate.getTime() - today.getTime()) / 86400000) + 1
							if (termDate <= 3) {
								jobStatus.value = "warning"
								termDateMsg.value = "あと" + termDate + "日"
							} else {
								jobStatus.value = ""
							}
						}
					} else {
						jobStatus.value = ""
					}
				}
			}

			const newFlg = ref(false)

			// 添付ファイルボタンを押された時、ダウンロードダイアログを開く
			const fileDownloadDialog = ref(false)
			const downloadFile = () => {
				fileDownloadDialog.value = true
			}

			// PDFをダウンロードする。
			const pdfLoading = ref(false)
			const downloadPdf = () => {
				pdfLoading.value = true
				axios.get(Constant.URL_JOBSHEET_PDF + registId.value, {
					responseType:'blob'
				}).then((res) => {
					const blob = new Blob([res.data], {
									type: "application/pdf"
								});
					const fileUrl = URL.createObjectURL(blob)
					window.open(fileUrl)
				}).finally(() => {
					pdfLoading.value = false
				})
			}

			// 対応者を自分に設定する
			const selectMyself = () => {
				state.deal = store.state.user.id
			}

			// 子コンポーネントからのファイル数を反映する。
			const resetFileNo = (fileNo: number) => {
				files.value = String(fileNo)
				// 再検索処理
				context.emit("doemit")
			}

			return {state, rules, v$, submitted, loading, clientList, businessList, systemList, inquiryList, contactList, dealList, fileDownloadDialog,
					delLoading, pdfLoading, registId, headerFlg, newFlg, jobStatus, files, termDateMsg, initFlg,
					handleSubmit, changeBusiness, delConfirm, downloadFile, downloadPdf, selectMyself, resetFileNo}
		}
	})
</script>

<style scoped>
.p-dropdown {
	width: 230px;
}

.edit .edit-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 30px;
	grid-template-rows: auto ;
}
.left-side {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: center;
	align-self: start;
	display: grid;
	grid-template-columns: 230px 230px 230px;
	column-gap: 10px;
	grid-template-rows: 50px 30px 80px 30px 80px 30px 80px 30px 80px 30px 200px;
}
#job-sheet-id {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
	font-weight: bold;
	font-size: 120%;
}
#initSpinner {
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: center;
	align-self: start;
}
#client-label {
	grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#client {
	grid-column: 1 / 2;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
#business-label {
	grid-column: 2 / 3;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#business {
	grid-column: 2 / 3;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
#system-label {
	grid-column: 3 / 4;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#system {
	grid-column: 3 / 4;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
#inquiry-label {
	grid-column: 1 / 2;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#inquiry {
	grid-column: 1 / 2;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#department-label {
	grid-column: 2 / 3;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#department {
	grid-column: 2 / 3;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#person-label {
	grid-column: 3 / 4;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#person {
	grid-column: 3 / 4;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#occurDate-label {
	grid-column: 1 / 2;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#occurDate {
	grid-column: 1 / 2;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
#occurTime-label {
	grid-column: 2 / 3;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#occurTime {
	grid-column: 2 / 3;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
#contact-label {
	grid-column: 3 / 4;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#contact {
	grid-column: 3 / 4;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
#title-label {
	grid-column: 1 / -1;
	grid-row: 8 / 9;
	justify-self: start;
	align-self: start;
}
#title {
	grid-column: 1 / -1;
	grid-row: 9 / 10;
	justify-self: start;
	align-self: start;
}
#content-label {
	grid-column: 1 / -1;
	grid-row: 10 / 11;
	justify-self: start;
	align-self: start;
}
#content {
	grid-column: 1 / -1;
	grid-row: 11 / 12;
	justify-self: start;
	align-self: start;
}


.right-side {
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: center;
	align-self: start;
	display: grid;
	grid-template-columns: 230px 230px 230px;
	column-gap: 10px;
	grid-template-rows: 30px 80px 30px 200px 30px 80px 80px;
}
#limitDate-label {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}
#limitDate {
	grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#support-label {
	grid-column: 1 / -1;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
#support {
	grid-column: 1 / -1;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#deal-label {
	grid-column: 1 / 2;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#select-myself {
	grid-column: 1 / 2;
	grid-row: 5 / 6;
	justify-self: center;
	align-self: start;
}
#deal {
	grid-column: 1 / 2;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#completeDate-label {
	grid-column: 2 / 3;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#completeDate {
	grid-column: 2 / 3;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#responseTime-label {
	grid-column: 3 / 4;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#responseTime {
	grid-column: 3 / 4;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#submit-btn {
	grid-column: 2 / 3;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: end;
}
#attach-btn {
	grid-column: 2 / 3;
	grid-row: 7 / 8;
	justify-self: end;
	align-self: end;
}
#pdf-btn {
	grid-column: 3 / 4;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: end;
}
#delete-btn {
	grid-column: 3 / 4;
	grid-row: 7 / 8;
	justify-self: end;
	align-self: end;
}
</style>