<template>
	<div class="attach">
		<p-file-upload id="upload" :customUpload="true" :multiple="true" @uploader="myUploader" :maxFileSize="1000000">
			<template #empty>
				<div class="drag-area">
					<img id="upload-img" src="../assets/upload.png" alt="アップロード" />
					<p>ここにファイルをドラッグアンドドロップしてください。</p>
					<p>ファイルサイズは1つ1MBまでです。</p>
				</div>
			</template>
		</p-file-upload>
		<transition>
			<p-data-table v-if="fileTableDisplay" id="data-table" :value="fileList" :scrollable="true" scrollDirection="both"  showGridlines stripedRows scrollHeight="330px" :rowHover="true" class="p-datatable-sm">
				<p-column field="fileName" header="ファイル名" :style="{width:'300px'}"></p-column>
				<p-column :style="{width:'80px'}">
					<template #body="{data}">
						<p-button icon="pi pi-download" v-tooltip="'ダウンロード'" class="p-button-rounded p-button-success p-button-sm" :loading="downloading[data.seqNo]" @click="downloadFile(data)" />
					</template>
				</p-column>
				<p-column :style="{width:'80px'}">
					<template #body="{data}">
						<p-button icon="pi pi-trash" v-tooltip="'削除'" class="p-button-rounded p-button-danger p-button-outlined p-button-sm" @click="deleteFile($event, data.seqNo)" />
						<p-confirm-popup></p-confirm-popup>
					</template>
				</p-column>
			</p-data-table>
		</transition>
	</div>
</template>

<script lang="ts">
	import { defineComponent, onMounted, ref, reactive, PropType } from 'vue';
	import { JobSheetType, AttachmentType } from '@/constantType'
	import axios from 'axios'
	import Constant from '@/constant'
	import { useToast } from "primevue/usetoast";
	import { useConfirm } from "primevue/useconfirm";
	import { saveAs } from 'file-saver'

	export default defineComponent({
		props: {
			editJobSheetId: {
				type: String,
				required: true
			}
		},
		setup(props, context) {
			const fileList = reactive<AttachmentType[]>([])
			const fileTableDisplay = ref(true)
			const toast = useToast();
			const downloading = reactive<boolean[]>([])

			onMounted(() => {
				axios.get<JobSheetType>(Constant.URL_JOBSHEET_GET + props.editJobSheetId).then((js) => {
					js.data.fileList.forEach((file) => {
						fileList.push(file)
						downloading.push(false)
					})
				})
			})

			// アップロード処理
			const myUploader = (event:any) => {
				fileTableDisplay.value = false
				
				const params = new FormData()
				event.files.forEach((file:any) => {
					params.append('file', file)
				})

				// 添付ファイル登録処理
				axios.post<AttachmentType[]>(Constant.URL_ATTACHMENT_REGIST + props.editJobSheetId, params, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then((res) => {
					// ファイル一覧を再セット
					fileList.length = 0
					downloading.length = 0
					res.data.forEach((file) => {
						fileList.push(file)
						downloading.push(false)
					})
					// 親コンポーネントにファイル数を伝える
					context.emit("resetFileNo", fileList.length)
					toast.add({severity:'success', summary: '登録しました。', life: 5000, group: 'tk', closable: false});
				}).finally(() => {
					fileTableDisplay.value = true
				})
			}

			// ダウンロード処理
			const downloadFile = (file: AttachmentType) => {
				console.log('download')
				downloading[file.seqNo] = true
				axios.get(Constant.URL_ATTACHMENT_DOWNLOAD + props.editJobSheetId + "/" + file.seqNo, {
					responseType:'blob'
				}).then((res) => {
					const blob = new Blob([res.data], {
						type: "application/octet-stream"
					});
					saveAs(blob, file.fileName)
				}).finally(() => {
					downloading[file.seqNo] = false
				})
			}

			// 削除処理
			const confirm = useConfirm();
			const deleteFile = (event:any, seqNo: number) => {
				confirm.require({
					target: event.currentTarget,
					message: '削除してよろしいですか？',
					icon: 'pi pi-info-circle',
					acceptClass: 'p-button-danger',
					accept: () => {
						fileTableDisplay.value = false
						axios.delete<AttachmentType[]>(Constant.URL_ATTACHMENT_DELETE + props.editJobSheetId + "/" + seqNo).then((res) => {
							// 戻ってきたファイル情報を添付ファイル一覧にセットする。
							fileList.length = 0
							downloading.length = 0
							res.data.forEach((file) => {
								fileList.push(file)
								downloading.push(false)
							})
							// 親コンポーネントにファイル数を伝える
							context.emit("resetFileNo", fileList.length)
							toast.add({severity:'success', summary: '削除しました。', life: 5000, group: 'tk', closable: false});
						}).finally(() => {
							fileTableDisplay.value = true
						})
					}
				});
			}
			
			return {fileList, fileTableDisplay, downloading, myUploader, downloadFile, deleteFile}
		}
	})
</script>

<style scoped>
.attach {
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 30px;
	grid-template-rows: 350px ;
}

#upload {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: center;
	align-self: start;
}

#data-table {
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: center;
	align-self: start;
}

table.filetable{
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
table.filetable th, table.filetable td{
  padding: 10px 10px;
  text-align: left;
}
table.filetable tr:nth-child(odd){
  background-color: #eee
}

.drag-area {
	text-align: center;
	border : dashed 1px;
}

img {
	user-drag: none;
	-webkit-user-drag: none;
	-moz-user-select: none;
	opacity: 50%;
}
</style>