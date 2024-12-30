<template>
  <div class="about">
    <div id="header">
      <menu-component id="menu"/>
    </div>
    <div id="container">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted} from 'vue';
import MenuComponent from '@/components/MenuComponent.vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { UserType } from '@/constantType'
import Constant from '@/constant'

export default defineComponent({
  components: {
    MenuComponent
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const events = ['keydown', 'mousemove', 'click']
    let timeoutId : number | undefined

    // 一定時間キーボード操作、クリック、マウス移動がされない場合に、自動的にログアウトします。
    const logout = () => {
      // 空のユーザをセットし、ログイン画面に戻る
      const emptyUser: UserType = {
          id: '',
          password: '',
          name: '',
          seqNo: 0
      }
      store.commit("setUser", emptyUser)
      store.commit("setToken", "")
      router.push("/")
    }

    const setTimer = () => {
      timeoutId = setTimeout(logout, Constant.TIMEOUT_SEC)
      // console.log('setTime')
    }

    const resetTimer = () => {
      clearTimeout(timeoutId)
      setTimer()
    }

    const setEvents = (func: any) => {
      let len = events.length
      while (len--) {
        window.addEventListener(events[len], func, false)
      }
    }

    const delEvents = (func: any) => {
      let len = events.length
      while (len--) {
        window.removeEventListener(events[len], func, false)
      }
    }

    // 初期処理
    onMounted(() => {
      // 指定された秒数の間、操作がされたなったときに自動的にログアウトする。
      setTimer()
      setEvents(resetTimer)
      // console.log('mouted')
    })

    // 破棄処理
    onUnmounted(() => {
      delEvents(resetTimer)
      // console.log('unmouted')
    })
  }
})
</script>

<style scoped>
.about {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: calc(100vw - 80px) 80px;
  grid-template-rows: 1fr ;
}

#header {
  grid-column: 2 / 3;
  grid-row: 1 / -1;
  background-color: #262626;
  color: #ffffff;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr ;
}

#menu {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  justify-self: center;
  align-self: start;
  margin-top: 10px;
}

#container {
  grid-column: 1 / 2;
  grid-row: 1 / -1;
}
</style>
