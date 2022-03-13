<template>
    <div class="menu">
        <p-button id="menu-icon" icon="pi pi-user" v-on:click="toggle" class="p-button-rounded p-button-info p-button-lg" />
        <p-menu id="overlay_menu" ref="menu" :model="items" :popup="true" />

        <!-- パスワード変更ダイアログ -->
        <p-dialog header="パスワード変更" v-model:visible="display" :modal="true">
            <password-component />
        </p-dialog>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';
    import { useRouter } from 'vue-router'
    import { useStore } from '@/store'
    import { UserType } from '@/constantType'
    import PasswordComponent from '@/components/PasswordComponent.vue'

    export default defineComponent({
        components: {
            PasswordComponent
        },
        setup() {
            const router = useRouter()
            const store = useStore()
            const menu = ref()
            const items = ref([
            {
                label: store.state.user.name,
                items: [
                {
                    label: "ホーム",
                    icon: "pi pi-home",
                    command: () => {
                        router.push("/about/list")
                    }
                },
                {
                    label: "管理",
                    icon: "pi pi-cog",
                    command: () => {
                        router.push("/about/admin")
                    }
                },
                {
                    label: "パスワード変更",
                    icon: "pi pi-user-edit",
                    command: () => {
                        openDialog()
                    }
                },
                {
                    label: "ログアウト",
                    icon: "pi pi-sign-out",
                    command: () => {
                        logout()
                    }
                }
                ]
            }
            ])

            const toggle = (event: PointerEvent) => {
                menu.value.toggle(event)
            }

            const display = ref(false)

            const openDialog = () => {
                display.value = true
            }

            // ログアウト処理
            const logout = () => {
                // 空のユーザをセットし、ログイン画面に戻る
                const emptyUser: UserType = {
                    id: '',
                    password: '',
                    name: '',
                    seqNo: 0
                }
                store.commit("setUser", emptyUser)
                router.push("/")
            }
            return {items, menu, display, toggle}
        }
    })
</script>

<style scoped>

</style>