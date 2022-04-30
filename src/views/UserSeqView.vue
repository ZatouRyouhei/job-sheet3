<template>
    <div class="userSeq">
        <p id="message">ユーザの並び順を設定します。変更する人をドラッグで移動してください。</p>

        <p-button id="submit-btn" label="登録" v-on:click="regist" icon="pi pi-pencil" class="p-button-info" :loading="loading" style="width: 150px;"/>

        <div id = "dragg-area">
            <draggable
                v-model="userList"
                item-key="id"
                tag="ul"
                @end="onEnd"
                emptyInsertThreshold="5"
                animation="100">
                <template #item="{element}">
                    <li v-bind:id="element.id">{{element.name}}</li>
                </template>
            </draggable>
        </div>

        <p-toast group="tk"/>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import { UserType } from '@/constantType'
    import axios from '@/axios'
    import Constant from '@/constant'
    import draggable from 'vuedraggable'
    import { useToast } from "primevue/usetoast";

    export default defineComponent({
        components: {
            draggable,
        },
        setup() {
            const userList = ref<UserType[]>([])
            const changeList = ref<string[]>([])  // 順序変更後のIDリスト
            const loading = ref(false)  // 登録ボタンのローディング
            const toast = useToast();
            
            /**
             * ドラッグ直後の処理
             */
            const onEnd = (event: any) => {
                changeList.value.length = 0
                event.to.childNodes.forEach((data: any) => {
                    changeList.value.push(data.id)
                })
            }

            /**
             * 登録処理
             */
            const regist = () => {
                loading.value = true
                let userList = {
                    userList: changeList.value
                }
                axios.post(Constant.URL_USER_CHANGESEQ, userList).then(() => {
                    toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
                }).finally(() => {
                    loading.value = false
                })
            }

            /**
             * 初期処理
             */
            onMounted(() => {
                axios.get<UserType[]>(Constant.URL_USER_GETLIST).then((res) => {
					userList.value = res.data
                    res.data.forEach((user) => changeList.value.push(user.id))
				})
            })

            return {userList, loading, onEnd, regist}
        }
    })
</script>

<style scoped>
.userSeq {
	display: grid;
	grid-template-columns: 600px auto;
	grid-template-rows: 80px 80px auto ;
}

#message {
    grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
    margin-left: 30px;
}

#submit-btn {
    grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: end;
	align-self: start;
}

#dragg-area {
    grid-column: 1 / 2;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
    width: 600px;
}

.userSeq ul li {
  color: #2d8fdd;
  border-left: solid 6px #2d8fdd;/*左側の線*/
  background: #f1f8ff;/*背景色*/
  margin-bottom: 6px;/*下のバーとの余白*/
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none!important;/*ポチ消す*/
  font-weight: bold;
}

.userSeq ul{
  cursor:-moz-grab;
  cursor:-webkit-grab;
  cursor: grab;
}

.userSeq ul:active{
  cursor:-moz-grab;
  cursor:-webkit-grab;
  cursor: grabbing;
}
</style>