<template>
    <div class="holiday">
        <div id="msg">
            <p>日付入力のカレンダーに祝日を表示するために使用します。</p>
            <p><a href="https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html" target="_blank" rel="noopener noreferrer">内閣府のホームページ</a>で祝日CSVファイルをダウンロードし、取り込みを実施してください。</p>
        </div>

        <p-file-upload id="file-up" accept=".csv" mode="basic" :customUpload="true" @uploader="myUploader" :multiple="false" :maxFileSize="1000000" />

        <p-progress-spinner style="width:50px;height:50px" id="file-loading" v-if="loading"/>
        
        <p-data-table
            id="error-table"
            :value="errorList"
            :scrollable="true"
            scrollDirection="both"
            scrollHeight="calc(100vh - 300px)"
            class="p-datatable-sm"
            showGridlines
            stripedRows>
            <p-column  field="lineNo" header="行数" :style="{width:'100px'}"></p-column>
            <p-column  field="errorMsg" header="メッセージ" :style="{width:'500px'}"></p-column>
        </p-data-table>

        <p-toast group="tk"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref} from 'vue';
import { ErrorMsgType } from '@/constantType'
import Constant from '@/constant'
import axios from 'axios'
import { useToast } from "primevue/usetoast";

export default defineComponent({
    setup() {
        const toast = useToast()
        const errorList = ref<ErrorMsgType[]>([])
        const loading = ref(false)  // ローディング
        /**
         * ファイルアップロード処理
         * @param event 
         */
        const myUploader = (event:any) => {
            loading.value = true
            const params = new FormData()
            event.files.forEach((file:any) => {
                params.append('file', file)
            })

            // 添付ファイル登録処理
            axios.post<ErrorMsgType[]>(Constant.URL_HOLIDAY_REGIST, params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                errorList.value.length = 0
                errorList.value = res.data

                if (errorList.value.length === 0) {
                    toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
                } else {
                    toast.add({severity:'error', summary: '登録に失敗しました。', detail: 'エラー内容を修正して再度登録してください。', life: 5000, group: 'tk', closable: false});
                }
            }).finally(() => {
                loading.value = false
            })
        }

        return {errorList, loading, myUploader}
    }
})
</script>

<style scoped>
.holiday {
    display: grid;
	grid-template-columns: 50% 50%;
	grid-template-rows: 100px 80px 500px;
}
#msg {
    grid-column: 1 / 3;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: center;
    margin-left: 30px;
}
#file-up {
    grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
    margin-left: 30px;
}
#file-loading {
    grid-column: 1 / 2;
	grid-row: 2 / 3;
	justify-self: end;
	align-self: start;
    
}
#error-table {
    grid-column: 1 / 2;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
    margin-left: 30px;
}
</style>