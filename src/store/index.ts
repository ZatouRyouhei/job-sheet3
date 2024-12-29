import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { UserType, HolidayType } from '@/constantType'

// ストアのステートに対して型を定義します
export interface State {
  user: UserType,
  holidayList: HolidayType[],
  token: string,
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
    },
    holidayList: [],
    token: '',
  },
  getters: {
    isAuth(state): boolean {
      return state.user.id.length > 0
    },
    getUser(state): UserType {
      return state.user
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setPassword(state, payload) {
      state.user.password = payload
    },
    setHolidayList(state, payload) {
      state.holidayList = payload
    },
    setToken(state, payload) {
      state.token = payload
    },
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