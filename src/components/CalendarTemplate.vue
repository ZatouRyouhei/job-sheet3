<template>
    <strong v-if="checkHoliday(paramProps.date)" v-tooltip.top="paramProps.date.name" class="holiday">{{paramProps.date.day}}</strong>
    <strong v-else-if="checkSunDay(paramProps.date)" class="sunDay">{{paramProps.date.day}}</strong>
    <strong v-else-if="checkSatDay(paramProps.date)" class="satDay">{{paramProps.date.day}}</strong>
    <template v-else>{{paramProps.date.day}}</template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store'

export default defineComponent({
    props: {
        paramProps: {
        }
    },
    setup() {
        const store = useStore()

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
            let result = false
            for (let h of store.state.holidayList) {
                let hArr: string[] = h.holiday.split('-')
                if (Number(hArr[0]) === date.year && Number(hArr[1]) === date.month + 1 && Number(hArr[2]) === date.day) {
                    result = true
                    date.name = h.name
                    break;
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
  color: #F59E0B;
}
.sunDay {
  color: #EF4444;
}
.satDay {
  color: #3B82F6;
}
</style>