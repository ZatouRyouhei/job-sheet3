<template>
    <div class="admin">
        <p-tabmenu :model="items" />
        <router-view v-slot="{ Component }">
            <transition appear mode="out-in">
                <component :is="Component" />
            </transition>
      </router-view>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue';

    export default defineComponent({
        setup() {
            const items = ref([
                {label: 'ユーザテーブル', icon: 'pi pi-users', to: '/about/admin/user'},
                {label: '業務テーブル', icon: 'pi pi-briefcase', to: '/about/admin/business'}
            ])

            return {items}
        }
    })
</script>