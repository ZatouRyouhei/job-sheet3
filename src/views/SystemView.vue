<template>
    <div class="system">
        <p-data-table id="system-table"
            :value="systemList"
            :scrollable="true"
            scrollDirection="both"
            showGridlines
            stripedRows
            scrollHeight="calc(100vh - 300px)"
            @rowSelect="onRowSelect"
            selectionMode="single"
            dataKey="id"
            v-model:selection="selectedSystem"
            class="p-datatable-sm">
            <p-column field="id" header="ID" :style="{width:'50px'}"></p-column>
            <p-column field="name" header="システム" :style="{width:'300px'}"></p-column>
            <p-column field="business.name" header="業務" :style="{width:'300px'}"></p-column>
        </p-data-table>

        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="edit-form p-fluid">
            <label id="system-id-label" for="system-id" class="required">ID</label>
			<span id="system-id">
                <p-input-number  :step="1" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                    incrementButtonClass="p-button-secondary" decrementButtonClass="p-button-secondary"
                                    mode="decimal" :min="1" v-model="v$.id.$model" :class="{'p-invalid':v$.id.$invalid && submitted}"
                                    :disabled="disabled" style="width: 230px; height: 50px;"/>
            </span>
            <label id="name-label" for="name" class="required">システム（{{v$.name.maxLength.$params.max}}文字まで）</label>
			<p-input-text id="name" type="text" v-model="v$.name.$model" :class="{'p-invalid':v$.name.$invalid && submitted}" />
            <label id="business-label" for="business" class="required">業務</label>
            <p-dropdown id="business" :options="businessList" optionLabel="name" optionValue="id"
                                    v-model="v$.business.$model" :class="{'p-invalid':v$.business.$invalid && submitted}"/>
            <p-button id="submit-btn" type="submit" label="登録" icon="pi pi-pencil" class="p-button-info" :loading="loading" style="width: 150px;"/>
            <p-button id="clear-btn" v-on:click="clearConfirm($event)" label="クリア" icon="pi pi-times-circle" class="p-button-secondary p-button-outlined" style="width: 150px;"/>
            <p-button id="delete-btn" v-on:click="delConfirm($event)" label="削除" icon="pi pi-trash" class="p-button-danger p-button-outlined" :loading="delLoading" :disabled="delDisabled" style="width: 150px;"/>
        </form>

        <p-confirm-popup></p-confirm-popup>

        <p-toast group="tk"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, reactive } from 'vue';
    import { SystemType, BusinessType } from '@/constantType'
    import axios from 'axios'
    import Constant from '@/constant'
    import { required, maxLength } from "@vuelidate/validators";
    import { useVuelidate } from "@vuelidate/core";
    import { useToast } from "primevue/usetoast";
    import { useConfirm } from "primevue/useconfirm";

    export default defineComponent({
        setup() {
            const systemList = ref<SystemType[]>([])
            const loading = ref(false)  // 登録ボタンのローディング
            const delLoading = ref(false) // 削除ボタンのローディング
            const selectedSystem = ref()  // 一覧で選択した業務情報
            const disabled = ref(false)  // IDの入力可、不可（新規の時は入力可、変更の時は入力不可）
            const delDisabled = ref(true)  // 削除ボタンの使用可、不可（新規の時は使用不可、変更の時は使用可）
            const businessList = ref<BusinessType[]>([])  // 業務プルダウンに設定するリスト
            const toast = useToast();
            const confirm = useConfirm();
            const state = reactive({
                id: 1,
                name: '',
                business: 0
            })

            // プルダウンの必須チェック 0もしくはnullの時にエラーとする。
			// number型で扱いたいのでデフォルト値に0を入れているが、その場合、単にrequiredの条件だけだと
			// 必須チェックが動いてくれない。
			const customRequied = (value: number) => {
				return value !== null && value > 0
			}

            const rules = {
                id: {
                    required
                },
                name: {
                    required,
					maxLength: maxLength(20)
                },
                business: {
                    customRequied
                }
            }
            const submitted = ref(false);
			const v$ = useVuelidate(rules, state);
            const handleSubmit = (isFormValid: boolean) => {
                submitted.value = true;
                if (!isFormValid) {
                    // 入力エラーがある場合
                    if (v$.value.id.required.$invalid && submitted) {
                        addToast("IDを入力してください。")
                    }
                    if (v$.value.name.required.$invalid && submitted) {
                        addToast("システムを入力してください。")
                    }
                    if (v$.value.name.maxLength.$invalid && submitted) {
                        addToast('システムは' + v$.value.name.maxLength.$params.max + '文字以内で入力してください。')
                    }
                    if (v$.value.business.$invalid && submitted) {
                        addToast("業務を入力してください。")
                    }
                } else {
                    // 入力エラーがない場合
                    loading.value = true
                    let obj = {
                        id: state.id,
                        name: state.name,
                        business: {
                            id: state.business,
                            name: ''
                        }
                    }
                    axios.post(Constant.URL_SYSTEM_REGIST, obj).then(() => {
                        // 一覧を再取得
                        axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST).then((res) => {
                            systemList.value = res.data
                        })
                        toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
                    }).finally(() => {
                        loading.value = false
                    })
                }
            }

            /**
             * 入力欄クリア処理
             */
            const onClear = () => {
                submitted.value = false  // クリアしたときにエラーチェックが走らないようにする
                disabled.value = false
                delDisabled.value = true
                state.id = 1
                state.name = ''
                state.business = 0
            }

            /**
             * 行を選択したときの処理
             */
            const onRowSelect = (event: any) => {
                disabled.value = true
                delDisabled.value = false
                state.id = event.data.id
                state.name = event.data.name
                state.business = event.data.business.id
            }

            /**
             * 削除処理
             */
			const delConfirm = (event:any) => {
				confirm.require({
					target: event.currentTarget,
					message: '削除してよろしいですか？',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: () => {
						delLoading.value = true
                        axios.delete(Constant.URL_SYSTEM_DELETE + state.id).then((res) => {
                            if (res.data === 1) {  // 使用されているため削除不可
                                addToast('使用されているため削除できません。')
                            } else {  // 正常終了
                                onClear()
                                axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST).then((res) => {
                                    systemList.value = res.data
                                })
                                toast.add({severity:'success', summary: '削除しました。', life: 5000, group: 'tk', closable: false});
                            }
                        }).finally(() => {
                            delLoading.value = false
                        })
					}
				});
			}

            /**
             * クリア処理
             */
            const clearConfirm = (event:any) => {
                confirm.require({
					target: event.currentTarget,
					message: 'クリアしてよろしいですか？',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: () => {
                        onClear() // 入力欄をクリア
					}
				});
            }

            /**
             * 初期処理
             */
            onMounted(() => {
                axios.get<SystemType[]>(Constant.URL_SYSTEM_GETLIST).then((res) => {
                    systemList.value = res.data
                })

                axios.get<BusinessType[]>(Constant.URL_BUSINESS_GETLIST).then((res) => {
					businessList.value = res.data
				})
            })

            const addToast = (message: string) => {
				toast.add({severity:'error', summary: '入力にエラーがあります。', detail: message, life: 5000, group: 'tk', closable: false});
			}

            return({systemList, loading, delLoading, selectedSystem, disabled, delDisabled, businessList, state, rules, v$, submitted, onRowSelect, handleSubmit, delConfirm, clearConfirm})
        }
    })
</script>

<style scoped>
.system {
	display: grid;
	grid-template-columns: 40% 60%;
	column-gap: 30px;
	grid-template-rows: 600px ;
    margin-top: 50px;
    margin-left: 50px;
}
#system-table {
    grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}
.edit-form {
    grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;

    display: grid;
	grid-template-columns: 150px 150px 150px;
    column-gap: 10px;
	grid-template-rows: 30px 80px 30px 80px 30px 80px 30px 80px;
}
#system-id-label {
    grid-column: 1 / -1;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}
#system-id {
    grid-column: 1 / -1;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
#name-label {
    grid-column: 1 / -1;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
#name {
    grid-column: 1 / -1;
	grid-row: 4 / 5;
	justify-self: start;
	align-self: start;
}
#business-label {
    grid-column: 1 / -1;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#business {
    grid-column: 1 / -1;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
#submit-btn {
    grid-column: 1 / 2;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
#clear-btn {
    grid-column: 2 / 3;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
#delete-btn {
    grid-column: 3 / 4;
	grid-row: 7 / 8;
	justify-self: start;
	align-self: start;
}
</style>