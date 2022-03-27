<template>
    <div class="stats">
        <div class="input-year">
            <div id="targetYear">
                <label id="year-label" for="target-year" class="required" style="margin-right: 20px;">年度</label>
                <p-input-number id="target-year"  :step="1" showButtons buttonLayout="horizontal" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                    incrementButtonClass="p-button-secondary" decrementButtonClass="p-button-secondary" mode="decimal" :min="2020"
                                    :useGrouping="false" v-model="targetYear" />
            </div>
            <p-button id="stats-btn" label="集計" icon="pi pi-chart-bar" class="p-button-info" v-on:click="stats" style="width: 150px;"/>
        </div>
        <div class="table-area">
            <p-data-table
                id="data-table"
                :value="statsList"
                :scrollable="true"
                scrollDirection="both"
                showGridlines
                stripedRows
                :loading="loading"
                scrollHeight="calc(100vh - 230px)"
                :rowHover="true"
                class="p-datatable-sm">
                <p-column-group type="header">
                    <p-row>
                        <p-column header="システム" :rowspan="2" :style="{width:'249px'}" frozen alignFrozen="left"/>
                        <p-column header="4月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="5月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="6月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="7月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="8月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="9月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="10月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="11月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="12月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="1月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="2月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="3月" :colspan="3" :style="{width:'150px'}" />
                        <p-column header="合計時間" :rowspan="2" :style="{width:'100px'}" frozen alignFrozen="right" />
                        <p-column header="未完了" :rowspan="2" :style="{width:'100px'}" frozen alignFrozen="right" />
                        <p-column header="グラフ" :rowspan="2" :style="{width:'80px'}" frozen alignFrozen="right" />
                    </p-row>
                    <p-row>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                        <p-column header="発生" :style="{width:'50px'}"/><p-column header="完了" :style="{width:'50px'}"/><p-column header="時間" :style="{width:'50px'}"/>
                    </p-row>
                </p-column-group>
                <p-column field="businessSystem.name" :style="{width:'250px'}" frozen alignFrozen="left"/>
                <p-column field="occurCnt4" :style="{width:'50px'}" /><p-column field="completeCnt4" :style="{width:'50px'}" /><p-column field="responseTime4" :style="{width:'50px'}" />
                <p-column field="occurCnt5" :style="{width:'50px'}" /><p-column field="completeCnt5" :style="{width:'50px'}" /><p-column field="responseTime5" :style="{width:'50px'}" />
                <p-column field="occurCnt6" :style="{width:'50px'}" /><p-column field="completeCnt6" :style="{width:'50px'}" /><p-column field="responseTime6" :style="{width:'50px'}" />
                <p-column field="occurCnt7" :style="{width:'50px'}" /><p-column field="completeCnt7" :style="{width:'50px'}" /><p-column field="responseTime7" :style="{width:'50px'}" />
                <p-column field="occurCnt8" :style="{width:'50px'}" /><p-column field="completeCnt8" :style="{width:'50px'}" /><p-column field="responseTime8" :style="{width:'50px'}" />
                <p-column field="occurCnt9" :style="{width:'50px'}" /><p-column field="completeCnt9" :style="{width:'50px'}" /><p-column field="responseTime9" :style="{width:'50px'}" />
                <p-column field="occurCnt10" :style="{width:'50px'}" /><p-column field="completeCnt10" :style="{width:'50px'}" /><p-column field="responseTime10" :style="{width:'50px'}" />
                <p-column field="occurCnt11" :style="{width:'50px'}" /><p-column field="completeCnt11" :style="{width:'50px'}" /><p-column field="responseTime11" :style="{width:'50px'}" />
                <p-column field="occurCnt12" :style="{width:'50px'}" /><p-column field="completeCnt12" :style="{width:'50px'}" /><p-column field="responseTime12" :style="{width:'50px'}" />
                <p-column field="occurCnt1" :style="{width:'50px'}" /><p-column field="completeCnt1" :style="{width:'50px'}" /><p-column field="responseTime1" :style="{width:'50px'}" />
                <p-column field="occurCnt2" :style="{width:'50px'}" /><p-column field="completeCnt2" :style="{width:'50px'}" /><p-column field="responseTime2" :style="{width:'50px'}" />
                <p-column field="occurCnt3" :style="{width:'50px'}" /><p-column field="completeCnt3" :style="{width:'50px'}" /><p-column field="responseTime3" :style="{width:'50px'}" />
                <p-column field="responseTimeSum" :style="{width:'100px'}" frozen alignFrozen="right" />
                <p-column field="leftCnt" :style="{width:'100px'}" frozen alignFrozen="right" />
                <p-column :style="{width:'80px'}" frozen alignFrozen="right">
                    <template #body="{data}">
                        <p-button icon="pi pi-chart-line" v-tooltip="'グラフ'" class="p-button-rounded p-button-info p-button-sm" @click="displayChart(data)" />
                    </template>
                </p-column>
            </p-data-table>
        </div>

        <p-dialog :header="title" v-model:visible="display" :modal="true">
            <chart-component v-bind:key="resetKey" v-bind:targetData="targetData" v-bind:targetYear="targetChartYear" v-on:prev="prevChart" v-on:next="nextChart"/>
        </p-dialog>

    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    import { JobSheetStatsType, BusinessType} from '@/constantType'
    import axios from 'axios'
    import Constant from '@/constant'
    import ChartComponent from '@/components/ChartComponent.vue'

    export default defineComponent({
        components: {
            ChartComponent
        },
        setup() {
            const statsList = ref<JobSheetStatsType[]>([])  // 集計リスト
            const targetYear = ref()  // 集計対象年度
            const loading = ref(false)  // テーブルのローディング
            const display = ref(false)  // グラフ表示
            const title = ref('')  // ダイアログに表示するタイトル
            const targetChartYear = ref()  // グラフの対象年度
            const targetData = ref<BusinessType>({   // グラフの対象システム
                id: 0,
                name: ''
            })
            const resetKey = ref(0)  // コンポーネントを再描画するためのキー
            
            /**
             * 集計処理
             */
            const stats = () => {
                loading.value = true
                axios.get<JobSheetStatsType[]>(Constant.URL_JOBSHEET_STATS + targetYear.value).then((res) => {
                    statsList.value = res.data
                }).finally(() => {
                    loading.value = false
                })
            }

            /**
             * グラフ表示
             */
            const displayChart = (data: JobSheetStatsType) => {
                display.value = true
                title.value = data.businessSystem.name + '（' + targetYear.value + '年度）'
                targetChartYear.value = targetYear.value
                targetData.value = data.businessSystem
            }

            /**
             * 前年度を表示
             */
            const prevChart = (paramYear: number, paramData: BusinessType) => {
                const prevYear = paramYear - 1
                title.value = paramData.name + '（' + prevYear + '年度）'
                targetChartYear.value = prevYear
                targetData.value = paramData
                resetKey.value++  // コンポーネントを再描画する。
            }

            /**
             * 次年度を表示
             */
            const nextChart = (paramYear: number, paramData: BusinessType) => {
                const prevYear = paramYear + 1
                title.value = paramData.name + '（' + prevYear + '年度）'
                targetChartYear.value = prevYear
                targetData.value = paramData
                resetKey.value++  // コンポーネントを再描画する。
            }

            /**
             * 初期処理
             */
            onMounted(() => {
                loading.value = true
                
                // 現在の年度をセット
                const now = new Date()
                let nowYear = now.getFullYear()
                let nowMonth = 1 + now.getMonth()
                if (nowMonth <= 3) {
                    nowYear = nowYear - 1
                }
                targetYear.value = nowYear

                // 現在年度で集計
                axios.get<JobSheetStatsType[]>(Constant.URL_JOBSHEET_STATS + targetYear.value).then((res) => {
                    statsList.value = res.data
                }).finally(() => {
                    loading.value = false
                })
            })


            return {statsList, targetYear, loading, display, title, targetData, targetChartYear, resetKey, stats, displayChart, prevChart, nextChart}
        }
    })
</script>

<style scoped>
#data-table {
  font-size: 80%;
}

.stats {
	display: grid;
	grid-template-columns: 30px auto;
	grid-template-rows: 30px 80px auto;
    row-gap: 20px;
}

.input-year {
    grid-column: 2 / 3;
	grid-row: 2 / 3;
	justify-self: start;
	align-self: start;
    display: grid;
	grid-template-columns: 400px auto;
	grid-template-rows: auto;
}

#targetYear {
    grid-column: 1 / 2;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}

#stats-btn {
    grid-column: 2 / 3;
	grid-row: 1 / 2;
	justify-self: start;
	align-self: start;
}

.table-area {
    width: calc(100vw - 110px);
    grid-column: 2 / 3;
	grid-row: 3 / 4;
	justify-self: start;
	align-self: start;
}
</style>