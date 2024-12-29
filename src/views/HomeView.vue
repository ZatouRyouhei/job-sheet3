<template>
  <div class="home">
    <transition appear name="titlelogo">
      <img id="title-img" src="../assets/logo.png" alt="タイトル" v-if="titlelogoDisplay"/>
    </transition>
    
    <h1>業務日誌</h1>
    <section>
      <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
        <span id="user-id" class="p-float-label">
          <p-input-text id="userid" type="text" v-model="v$.userid.$model" :class="{'p-invalid':v$.userid.$invalid && submitted}" style="width: 200px;"/>
          <label for="userid">ユーザID</label>
        </span>
        
        <span id="password" class="p-float-label">
          <p-password id="password" v-model="v$.password.$model" :feedback="false" :class="{'p-invalid':v$.password.$invalid && submitted}" style="width: 200px;" />
          <label for="password">パスワード</label>
        </span>
        
        <p-button type="submit" label="ログイン" icon="pi pi-sign-in" class="p-button-info" :loading="loading" style="width: 200px;"/>
        <p-toast group="tk" />
      </form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { UserType, LoginUserType, HolidayType } from '@/constantType'
import Constant from '@/constant'
import axios from 'axios'
import sha512 from 'js-sha512'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const toast = useToast();
    const router = useRouter()
    const store = useStore()
    const loading = ref(false) // ログインボタンのローディング
    const titlelogoDisplay = ref(true)  //タイトルロゴの表示フラグ
    const state = reactive({
        userid: '',
        password: ''
    });
    const rules = {
        userid: { required },
        password: { required }
    };
    const submitted = ref(false);
    const v$ = useVuelidate(rules, state);
    
    // エラーチェック処理
    const handleSubmit = (isFormValid: boolean) => {
        submitted.value = true;
        if (!isFormValid) {
          if (v$.value.userid.$invalid && submitted) {
            addErrorToast('ユーザIDを入力してください。')
          }
          if (v$.value.password.$invalid && submitted) {
            addErrorToast('パスワードを入力してください。')
          }
          return;
        } else {
          // 入力エラーがない場合はログイン処理を行う。
          login()
        }
    }

    // ログイン処理
    const login = () => {
      loading.value = true
      const userObj: UserType = {
        id: state.userid,
        password: sha512.sha512(state.password),
        name: '',
        seqNo: 0
      }
      axios.post<LoginUserType>(Constant.URL_USER_LOGIN, userObj).then((res) => {
        if (res.data) {
          // ログイン成功
          titlelogoDisplay.value = false
          store.commit("setToken", res.data.token)
          store.commit("setUser", res.data.user)
          // 祝日テーブルを取得
          axios.get<HolidayType[]>(Constant.URL_HOLIDAY_GETLIST, {
            // Basic認証の場合
            // auth: {
            //   username: store.state.user.id,
            //   password: store.state.user.password,
            // }
            // JWT認証の場合
            headers: {
              'Authorization': 'Bearer ' + store.state.token,
            }
          }).then((h) => {
            store.commit('setHolidayList', h.data)
          })
          // トップページへ遷移
          router.push("/about/list")
        } else {
          // ログイン失敗
          addErrorToast('ログインできませんでした。')
        }
      }).catch(() => {
        // ログイン失敗
        addErrorToast('ログインできませんでした。')
      }).finally(() => {
        loading.value = false
      })
    }

    // エラーメッセージ出力処理
    const addErrorToast = (msg: string) => {
      toast.add({severity:'error', summary: '入力にエラーがあります。', detail: msg, life: 5000, group: 'tk', closable: false});
    }

    return {state, v$, submitted, loading, titlelogoDisplay, handleSubmit}
  }
});
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr ;
}

#title-img {
  width: 300px;
  grid-column: 1 / 2;
  grid-row: 2 / span 4;
  justify-self: end;
  align-self: center;
}

h1 {
  font-size: 300%;
  grid-column: 2 / 3;
  grid-row: 1 / span 1;
  justify-self: center;
  align-self: end;
}

section {
  grid-column: 2 / 3;
  grid-row: 2 / span 4;
  justify-self: center;
  align-self: center;
}

#user-id {
  margin-bottom: 30px;
}
#password {
  margin-bottom: 30px;
}

@keyframes slide-out-anim {
	0% {
    transform: translateX(0);
  }
	100% {
		transform: translateX(-200%);
	}
}
.titlelogo-leave-active {
  animation: slide-out-anim 0.5s;
}

@keyframes slide-in-anim {
	0% {
    transform: translateX(200%);
  }
	100% {
		transform: translateX(0);
	}
}
.titlelogo-enter-active {
  animation: slide-in-anim 0.5s;
}
</style>