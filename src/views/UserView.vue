<template>
    <div class="user">
        <p-data-table id="user-table"
            :value="userList"
            :scrollable="true"
            scrollDirection="both"
            showGridlines
            stripedRows
            scrollHeight="calc(100vh - 300px)"
            @rowSelect="onRowSelect"
            selectionMode="single"
            dataKey="id"
            v-model:selection="selectedUser"
            class="p-datatable-sm">
            <p-column field="id" header="ID" :style="{width:'300px'}"></p-column>
            <p-column field="name" header="氏名" :style="{width:'300px'}"></p-column>
        </p-data-table>

        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="edit-form p-fluid">
            <label id="user-id-label" for="user-id" class="required">ID（{{v$.id.maxLength.$params.max}}文字まで）</label>
			<p-input-text id="user-id" type="text" v-model="v$.id.$model" :class="{'p-invalid':v$.id.$invalid && submitted}" :disabled="disabled" />
            <label id="name-label" for="name" class="required">氏名（{{v$.name.maxLength.$params.max}}文字まで）</label>
			<p-input-text id="name" type="text" v-model="v$.name.$model" :class="{'p-invalid':v$.name.$invalid && submitted}" />
            <p-button id="submit-btn" type="submit" label="登録" icon="pi pi-pencil" class="p-button-info" :loading="loading" style="width: 150px;"/>
            <p-button id="clear-btn" v-on:click="clearConfirm($event)" label="クリア" icon="pi pi-times-circle" class="p-button-secondary p-button-outlined" style="width: 150px;"/>
            <p-button id="delete-btn" v-on:click="delConfirm($event)" label="削除" icon="pi pi-trash" class="p-button-danger p-button-outlined" :loading="delLoading" :disabled="delDisabled" style="width: 150px;"/>
            <p-button id="init-btn" v-on:click="initConfirm($event)" label="初期化" icon="pi pi-history" class="p-button-warning p-button-outlined" :loading="initLoading" :disabled="delDisabled" style="width: 150px;"/>
        </form>

        <p-confirm-popup></p-confirm-popup>

        <p-toast group="tk"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, reactive } from 'vue';
    import { UserType } from '@/constantType'
    import axios from 'axios'
    import Constant from '@/constant'
    import { required, maxLength, alphaNum } from "@vuelidate/validators";
    import { useVuelidate } from "@vuelidate/core";
    import { useToast } from "primevue/usetoast";
    import { useConfirm } from "primevue/useconfirm";

    export default defineComponent({
        setup() {
            const userList = ref<UserType[]>([])
            const loading = ref(false)  // 登録ボタンのローディング
            const delLoading = ref(false) // 削除ボタンのローディング
            const selectedUser = ref()  // 一覧で選択したユーザ情報
            const disabled = ref(false)  // IDの入力可、不可（新規の時は入力可、変更の時は入力不可）
            const delDisabled = ref(true)  // 削除ボタンの使用可、不可（新規の時は使用不可、変更の時は使用可）
            const initLoading = ref(false)
            const toast = useToast();
            const confirm = useConfirm();
            const state = reactive({
                id: '',
                name: ''
            })
            const rules = {
                id: {
                    required,
                    alphaNum,
					maxLength: maxLength(20)
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
                    if (v$.value.id.alphaNum.$invalid && submitted) {
                        addToast("IDは英数字で入力してください。")
                    }
                    if (v$.value.id.maxLength.$invalid && submitted) {
                        addToast('IDは' + v$.value.id.maxLength.$params.max + '文字以内で入力してください。')
                    }
                    if (v$.value.name.required.$invalid && submitted) {
                        addToast("氏名を入力してください。")
                    }
                    if (v$.value.name.maxLength.$invalid && submitted) {
                        addToast('氏名は' + v$.value.name.maxLength.$params.max + '文字以内で入力してください。')
                    }
                } else {
                    // 入力エラーがない場合
                    loading.value = true
                    // 登録するパスワード 新規登録のときは初期パスワード111111を設定する。
                    let regPassword = '11111'
                    if (disabled.value) {  // 更新のときはパスワードは変更しない
                        regPassword = ''
                    }
                    const userObj: UserType = {
                        id: state.id,
                        name: state.name,
                        password: regPassword,
                        seqNo: 0
                    }
                    axios.post(Constant.URL_USER_REGIST, userObj).then(() => {
                        // 一覧を更新
                        axios.get<UserType[]>(Constant.URL_USER_GETLIST).then((res) => {
                            userList.value = res.data
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
                state.id = ''
                state.name = ''
            }

            /**
             * 行を選択したときの処理
             */
            const onRowSelect = (event: any) => {
                disabled.value = true
                delDisabled.value = false
                state.id = event.data.id
                state.name = event.data.name
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
                        axios.delete(Constant.URL_USER_DELETE + selectedUser.value.id).then((res) => {
                            if (res.data === 1) {  // 使用されているため削除不可
                                addToast('使用されているため削除できません。')
                            } else {  // 正常終了
                                onClear()  // 入力欄をクリア
                                axios.get<UserType[]>(Constant.URL_USER_GETLIST).then((res) => {  // 一覧を更新
                                    userList.value = res.data
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
             * パスワード初期化処理
             * @param event 
             */
            const initConfirm = (event:any) => {
                confirm.require({
					target: event.currentTarget,
					message: 'パスワードを初期化してよろしいですか？初期パスワードは11111です。',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: () => {
						initLoading.value = true
                        const userObj: UserType = {
                            id: selectedUser.value.id,
                            name: selectedUser.value.name,
                            password: '11111',
                            seqNo: 0
                        }
                        axios.post(Constant.URL_USER_REGIST, userObj).then(() => {
                            toast.add({severity:'success', summary: '初期化しました。', life: 5000, group: 'tk', closable: false});
                        }).finally(() => {
                            initLoading.value = false
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
                axios.get<UserType[]>(Constant.URL_USER_GETLIST).then((res) => {
					userList.value = res.data
				})
            })

            const addToast = (message: string) => {
				toast.add({severity:'error', summary: '入力にエラーがあります。', detail: message, life: 5000, group: 'tk', closable: false});
			}

            return {userList, loading, delLoading, initLoading, state, rules, v$, submitted, selectedUser, disabled, delDisabled,
                    handleSubmit, onRowSelect, clearConfirm, delConfirm, initConfirm}
        }
    })
</script>

<style scoped>
.user {
	display: grid;
	grid-template-columns: 40% 60%;
	column-gap: 30px;
	grid-template-rows: 600px ;
    margin-top: 50px;
    margin-left: 50px;
}
#user-table {
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
	grid-template-rows: 30px 80px 30px 80px 80px 80px;
}
#user-id-label {
    grid-column: 1 / -1;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}
#user-id {
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
#init-btn {
    grid-column: 1 / 2;
	grid-row: 6 / 7;
	justify-self: start;
	align-self: start;
}
</style>