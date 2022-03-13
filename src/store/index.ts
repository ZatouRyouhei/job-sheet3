import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { UserType } from '@/constantType'

// ストアのステートに対して型を定義します
export interface State {
  user: UserType
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
  state: {
    user: {
      id: '',
      password: '',
      name: '',
      seqNo: 0
    }
  },
  getters: {
    isAuth(state): boolean {
      return state.user.id.length > 0
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: 'job-sheet3',
    storage: sessionStorage
  })]
})

// 独自の `useStore` 関数を定義します
export function useStore () {
  return baseUseStore(key)
}