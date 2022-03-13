import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { UserType } from '@/constantType'

declare module '@vue/runtime-core' {
  // ストアのステートを宣言する
  interface State {
    user: UserType
  }

  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}