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
                {label: '顧客テーブル', icon: 'pi pi-building', to: '/about/admin/client'},
                {label: '業務テーブル', icon: 'pi pi-briefcase', to: '/about/admin/business'},
                {label: 'システムテーブル', icon: 'pi pi-server', to: '/about/admin/system'},
                {label: '順序変更', icon: 'pi pi-sort-alt', to: '/about/admin/userSeq'}
            ])

            return {items}
        }
    })
</script>