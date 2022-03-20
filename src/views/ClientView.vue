<template>
    <div class="client">
        <p-data-table id="client-table"
            :value="clientList"
            :scrollable="true"
            showGridlines
            stripedRows
            scrollHeight="600px"
            @rowSelect="onRowSelect"
            selectionMode="single"
            dataKey="id"
            v-model:selection="selectedClient"
            class="p-datatable-sm">
            <p-column field="id" header="ID" :style="{width:'300px'}"></p-column>
            <p-column field="name" header="顧客名" :style="{width:'300px'}"></p-column>
        </p-data-table>

        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="edit-form p-fluid">
            <label id="client-id-label" for="client-id" class="required">ID</label>
			<span id="client-id">
                <p-input-number  :step="1" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                    mode="decimal" :min="1" v-model="v$.id.$model" :class="{'p-invalid':v$.id.$invalid && submitted}"
                                    :disabled="disabled" style="width: 230px; height: 50px;"/>
            </span>
            <label id="name-label" for="name" class="required">顧客名（{{v$.name.maxLength.$params.max}}文字まで）</label>
			<p-input-text id="name" type="text" v-model="v$.name.$model" :class="{'p-invalid':v$.name.$invalid && submitted}" />
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
    import { ClientType } from '@/constantType'
    import axios from 'axios'
    import Constant from '@/constant'
    import { required, maxLength } from "@vuelidate/validators";
    import { useVuelidate } from "@vuelidate/core";
    import { useToast } from "primevue/usetoast";
    import { useConfirm } from "primevue/useconfirm";

    export default defineComponent({
        setup() {
            const clientList = ref<ClientType[]>([])
            const loading = ref(false)  // 登録ボタンのローディング
            const delLoading = ref(false) // 削除ボタンのローディング
            const selectedClient = ref()  // 一覧で選択した顧客情報
            const disabled = ref(false)  // IDの入力可、不可（新規の時は入力可、変更の時は入力不可）
            const delDisabled = ref(true)  // 削除ボタンの使用可、不可（新規の時は使用不可、変更の時は使用可）
            const toast = useToast();
            const confirm = useConfirm();
            const state = reactive({
                id: 1,
                name: ''
            })
            const rules = {
                id: {
                    required
                },
                name: {
                    required,
					maxLength: maxLength(20)
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
                        addToast("顧客名を入力してください。")
                    }
                    if (v$.value.name.maxLength.$invalid && submitted) {
                        addToast('顧客名は' + v$.value.name.maxLength.$params.max + '文字以内で入力してください。')
                    }
                } else {
                    // 入力エラーがない場合
                    loading.value = true
                    const clientObj = {
                        id: state.id,
                        name: state.name
                    }
                    axios.post(Constant.URL_CLIENT_REGIST, clientObj).then(() => {
                        axios.get<ClientType[]>(Constant.URL_CLIENT_GETLIST).then((res) => {  // 一覧を再検索
                            clientList.value = res.data
                        })
                        toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
                    }).finally(() => {
                        loading.value = false
                    })
                }
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
                        axios.delete(Constant.URL_CLIENT_DELETE + state.id).then((res) => {
                            if (res.data === 1) {  // 使用されているため削除不可
                                addToast('使用されているため削除できません。')
                            } else {  // 正常終了
                                onClear()  // 入力欄をクリア
                                axios.get<ClientType[]>(Constant.URL_CLIENT_GETLIST).then((res) => { // 一覧を再検索
                                    clientList.value = res.data
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
             * 入力欄クリア処理
             */
            const onClear = () => {
                submitted.value = false  // クリアしたときにエラーチェックが走らないようにする
                disabled.value = false
                delDisabled.value = true
                state.id = 1
                state.name = ''
            }

            /**
             * 行を選択したときの処理
             */
            const onRowSelect = (event:any) => {
                disabled.value = true
                delDisabled.value = false
                state.id = event.data.id
                state.name = event.data.name
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
                axios.get<ClientType[]>(Constant.URL_CLIENT_GETLIST).then((res) => {
                    clientList.value = res.data
                })
            })

            const addToast = (message: string) => {
				toast.add({severity:'error', summary: '入力にエラーがあります。', detail: message, life: 5000, group: 'tk', closable: false});
			}

            return {clientList, loading, delLoading, selectedClient, disabled, delDisabled, state, rules, v$, submitted, onRowSelect, handleSubmit, delConfirm, clearConfirm}
        }
    })
</script>

<style scoped>
.client {
	display: grid;
	grid-template-columns: 10px 600px 600px auto;
	column-gap: 100px;
	grid-template-rows: 50px 600px ;
}
#client-table {
    grid-column: 2 / 3;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
}
.edit-form {
    grid-column: 3 / 4;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;

    display: grid;
	grid-template-columns: 150px 150px 150px;
    column-gap: 10px;
	grid-template-rows: 30px 80px 30px 80px 30px 80px;
}
#client-id-label {
    grid-column: 1 / -1;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}
#client-id {
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
#submit-btn {
    grid-column: 1 / 2;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#clear-btn {
    grid-column: 2 / 3;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
#delete-btn {
    grid-column: 3 / 4;
	grid-row: 5 / 6;
	justify-self: start;
	align-self: start;
}
</style>