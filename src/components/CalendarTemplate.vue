<template>
    <strong v-if="checkHoliday(paramProps.date)" v-tooltip.top="paramProps.date.name" class="holiday">{{paramProps.date.day}}</strong>
    <strong v-else-if="checkSunDay(paramProps.date)" class="sunDay">{{paramProps.date.day}}</strong>
    <strong v-else-if="checkSatDay(paramProps.date)" class="satDay">{{paramProps.date.day}}</strong>
    <template v-else>{{paramProps.date.day}}</template>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue';

export default defineComponent({
    props: {
        paramProps: {
        }
    },
    setup() {
        type holidayType = {
            year: number,
            month: number,
            day: number,
            name: string
        }
        let holiday: holidayType[] = reactive([]);

        /**
         * 祝日を取得する。
         */
        onBeforeMount(() => {
            holiday  = [
                {
                year: 2022,
                month: 2,
                day: 23,
                name: "天皇誕生日"
                },
                {
                year: 2022,
                month: 2,
                day: 22,
                name: "あいうえお"
            }]
        })

        type calType = {
            day: number,
            month: number,
            year: number,
            today: boolean,
            selectable: boolean,
            name: string
        }
        /**
         * 祝日かどうかをチェックする
         */
        const checkHoliday = (date: calType): boolean => {
            //const result = holiday.some(h => h.year === date.year && h.month === date.month + 1 && h.day === date.day)
            let result = false
            for (let h of holiday) {
                if (h.year === date.year && h.month === date.month + 1 && h.day === date.day) {
                result = true
                date.name = h.name
                }
            }
            return result
        }

        /**
         * 日曜日かどうかチェックする
         */
        const checkSunDay = (date: calType): boolean => {
            const paramDate = new Date(date.year, date.month, date.day)
                return paramDate.getDay() === 0
        }

        /**
         * 土曜日かどうかチェックする
         */
        const checkSatDay = (date: calType): boolean => {
            const paramDate = new Date(date.year, date.month, date.day)
                return paramDate.getDay() === 6
        }

        return {checkHoliday, checkSunDay, checkSatDay}
    }
})
</script>

<style scoped>
.holiday {
  color: red;
}
.sunDay {
  color: red;
}
.satDay {
  color: blue;
}
</style>