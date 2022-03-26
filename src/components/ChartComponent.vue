<template>
    <div class="chart">
        <div id="chart-area">
            <p-chart type="line" :data="chartData" :options="basicOptions" :height="70" />
        </div>
        <div>
            <span>
                <p-button id="prev-button" icon="pi pi-chevron-left" v-tooltip="'前年度'" class="p-button-info p-button-sm" @click="prevYear()" />
            </span>
            <span style="margin-left:30px;">
                <p-button id="next-button" icon="pi pi-chevron-right" v-tooltip="'次年度'" class="p-button-info p-button-sm" @click="nextYear()" />
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, PropType } from 'vue';
    import axios from 'axios'
    import Constant from '@/constant'
    import { BusinessType } from '@/constantType'

    export default defineComponent({
        props: {
            targetYear: {
                type: Number,
				required: true
            },
            targetData: {
                type: Object as PropType<BusinessType>,
                required: true
            }
		},
        setup(props, context) {
            const chartData = ref()  // グラフデータ

            const basicOptions = ref(
                {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        },
                        y: {
                            suggestedMin: 0,
                            suggestedMax: 10,
                            ticks: {
                                color: '#495057',
                                stepSize: 1
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        }
                    }
                }
            );

            /**
             * グラフ生成
             */
            const createChart = () => {
                axios.get(Constant.URL_JOBSHEET_STATS + props.targetYear + "/" + props.targetData.id).then((res) => {
                    chartData.value = {
                        labels: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'],
                        datasets: [
                            {
                                label: '問合せ件数',
                                data: [res.data.occurCnt4, res.data.occurCnt5, res.data.occurCnt6, res.data.occurCnt7,
                                        res.data.occurCnt8, res.data.occurCnt9, res.data.occurCnt10, res.data.occurCnt11,
                                        res.data.occurCnt12, res.data.occurCnt1, res.data.occurCnt2, res.data.occurCnt3],
                                fill: false,
                                borderColor: '#42A5F5',
                                tension: .4
                            },
                            {
                                label: '完了件数',
                                data: [res.data.completeCnt4, res.data.completeCnt5, res.data.completeCnt6, res.data.completeCnt7,
                                        res.data.completeCnt8, res.data.completeCnt9, res.data.completeCnt10, res.data.completeCnt11,
                                        res.data.completeCnt12, res.data.completeCnt1, res.data.completeCnt2, res.data.completeCnt3],
                                fill: false,
                                borderColor: '#FFA726',
                                tension: .4
                            }
                        ]
                    }
                })
            }

            /**
             * 前年度表示
             */
            const prevYear = () => {
                context.emit("prev", props.targetYear, props.targetData)
            }

            /**
             * 次年度表示
             */
            const nextYear = () => {
                context.emit("next", props.targetYear, props.targetData)
            }

            /**
             * 初期処理
             */
            onMounted(() => {
                createChart()  // グラフ生成
            })

            return {basicOptions, chartData, prevYear, nextYear}
        }
    })

</script>

<style scoped>
#chart-area {
    width: 1200px;
}
</style>