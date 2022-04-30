/**
 * httpのAuthorizationヘッダーにユーザIDとパスワードをセットする共通処理
 * Basic <username>:<password> の形になる。
 * <username>:<password>の部分はBase64でエンコードされる。
 */
import axios from 'axios'
import store from '@/store'

// const axios_instance = axios.create({
//     auth: {
//         username: store.getters.getUser.id,
//         password: store.getters.getUser.password
//     }
// });

// 上記の書き方だと、一度作成されると固定されてしまう。
// そのため、パスワード変更後に再度ログインしたときに変更後のパスワードが
// ヘッダーにセットされない。
// インターセプタを使用するとよい。
const axios_instance = axios.create()
axios_instance.interceptors.request.use(config => {
    config.auth = {
        username: store.getters.getUser.id,
        password: store.getters.getUser.password
    }
    return config
})

export default axios_instance
