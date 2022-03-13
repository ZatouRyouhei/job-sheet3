<template>
    <div class="password">
        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
            <div class="form-class">
                <label id="current-password-label" for="current-password">現在のパスワード</label>
                <p-password id="current-password" v-model="v$.currentPassword.$model" :feedback="false" :class="{'p-invalid':v$.currentPassword.$invalid && submitted}" />
                <label id="new-password-label" for="new-password">新しいパスワード（{{v$.newPassword.maxLength.$params.max}}文字まで）</label>
                <p-password id="new-password" v-model="v$.newPassword.$model" :feedback="false" :class="{'p-invalid':v$.newPassword.$invalid && submitted}" />
                <label id="new-password2-label" for="new-password2">新しいパスワード（確認）（{{v$.newPassword2.maxLength.$params.max}}文字まで）</label>
                <p-password id="new-password2" v-model="v$.newPassword2.$model" :feedback="false" :class="{'p-invalid':v$.newPassword2.$invalid && submitted}" />

                <p-button id="submit-btn" type="submit" label="登録" icon="pi pi-pencil" class="p-button-info" :loading="loading"/>
            </div>
            <p-toast group="tk" />
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, reactive } from 'vue';
    import { required, maxLength } from "@vuelidate/validators";
    import { useVuelidate } from "@vuelidate/core";
    import Constant from '@/constant'
    import axios from 'axios'
    import { useToast } from "primevue/usetoast";
    import { useStore } from '@/store'
    import { UserType } from '@/constantType'

    export default defineComponent({
        setup() {
            const loading = ref(false)

            const state = reactive({
                currentPassword: '',
                newPassword: '',
                newPassword2: ''
            });

            const rules = {
                currentPassword: { required },
                newPassword: { required, maxLength: maxLength(5) },
                newPassword2: { required, maxLength: maxLength(5) }
            };

            const submitted = ref(false);
            const v$ = useVuelidate(rules, state);
            const toast = useToast();
            const store = useStore()

            const handleSubmit = (isFormValid: boolean) => {
                submitted.value = true;
                if (!isFormValid) {
                    if (v$.value.currentPassword.$invalid && submitted) {
                        addErrorToast('現在のパスワードを入力してください。')
                    }
                    if (v$.value.newPassword.required.$invalid && submitted) {
                        addErrorToast('新しいパスワードを入力してください。')
                    }
                    if (v$.value.newPassword.maxLength.$invalid && submitted) {
                        addErrorToast('新しいパスワードは' + v$.value.newPassword.maxLength.$params.max + '文字以内で入力してください。')
                    }
                    if (v$.value.newPassword2.required.$invalid && submitted) {
                        addErrorToast('新しいパスワード（確認）を入力してください。')
                    }
                    if (v$.value.newPassword2.maxLength.$invalid && submitted) {
                        addErrorToast('新しいパスワード（確認）は' + v$.value.newPassword2.maxLength.$params.max + '文字以内で入力してください。')
                    }
                    return;
                } else {
                    // 入力エラーがない場合はログイン処理を行う。
                    loading.value = true
                    // 現在のパスワードが正しいことを確認する。
                    const userObj: UserType = {
                        id: store.state.user.id,
                        password: state.currentPassword,
                        name: '',
                        seqNo: 0
                    }
                    axios.post<UserType>(Constant.URL_USER_LOGIN, userObj).then((res) => {
                        if (res.data) {
                            // 新しいパスワードと新しいパスワード（確認）が一致していることを確認
                            if (state.newPassword === state.newPassword2) {
                                // パスワード更新処理
                                const editUserObj: UserType = {
                                    id: store.state.user.id,
                                    password: state.newPassword,
                                    name: '',
                                    seqNo: 0
                                }
                                axios.post(Constant.URL_USER_CHANGEPASSWORD, editUserObj).then(() => {
                                    addSuccessToast()
                                }).catch(() => {
                                    addErrorToast('登録できませんでした。')
                                })
                            } else {
                                addErrorToast('登録できませんでした。')
                            }
                        }
                    }).catch(() => {
                        addErrorToast('登録できませんでした。')
                    }).finally(() => {
                        loading.value = false
                    })
                }
            }

            // エラーメッセージ出力処理
            const addErrorToast = (msg = '') => {
                toast.add({severity:'error', summary: '入力にエラーがあります。', detail: msg, life: 5000, group: 'tk', closable: false});
            }
            // 完了メッセージ出力処理
            const addSuccessToast = (msg = '') => {
                toast.add({severity:'success', summary: '登録しました。', detail: msg, life: 5000, group: 'tk', closable: false});
            }

            return {state, v$, submitted, loading, handleSubmit}
        }
    })
</script>

<style scoped>
.form-class  {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 30px auto 30px auto 30px auto 80px;
}
.current-password-label {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    justify-self: start;
    align-self: end;
}
#current-password {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    justify-self: start;
    align-self: start;
}
#new-password-label {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
    justify-self: start;
    align-self: end;
}
#new-password {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
    justify-self: start;
    align-self: start;
}
#new-password2-label {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    justify-self: start;
    align-self: end;
}
#new-password {
    grid-column: 1 / 2;
    grid-row: 6 / 7;
    justify-self: start;
    align-self: start;
}
#submit-btn {
    grid-column: 1 / 2;
    grid-row: 7 / 8;
    justify-self: start;
    align-self: end;
}
</style>