export default {
    /**
     * 日付オブジェクトをyyyy-MM-ddに変換する。
     * @param date 
     */
    dateToStr: function(date: Date | '') {
        if (date) {
            const year = date.getFullYear()
            const month = 1 + date.getMonth()
            const monthStr = ('0' + String(month)).slice(-2)
            const day = date.getDate()
            const dayStr = ('0' + String(day)).slice(-2)
            return year + '-' + monthStr + '-' + dayStr
        } else {
            return ''
        }
    },
    /**
     * 日付オブジェクトを時間（hh:mm）に変換する
     * @param date
     * @returns 
     */
    timeToStr: function(date: Date | '') {
        if (date) {
            const hour = date.getHours()
            const hourStr = ('0' + String(hour)).slice(-2)
            const minutes = date.getMinutes()
            const minutesStr = ('0' + String(minutes)).slice(-2)
            return hourStr + ':' + minutesStr
        } else {
            return ''
        }
    },

    /**
     * yyyy-MM-ddの日付をyyyy年MM月dd日に変換する。
     * @param date 
     */
    dateToDisp: function(date: string) {
        if (date === '') {
            return ''
        } else {
            const year = date.slice(0, 4)
            const month = date.slice(5, 7)
            const day = date.slice(8, 10)
            return year + "年" + Number(month) + "月" + Number(day) + "日"
        }
    },
    /**
     * yyyy-MM-ddの日付を日付オブジェクトに変換する。
     * @param date 
     */
    strToDate: function(date: string) {
        if (date === '' || date === null || date === undefined) {
            return new Date()
        } else {
            const dateArr = date.split('-')
            return new Date(Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2]))
        }
    },
    /**
     * yyyy-MM-ddの日付とhh:mmの時間から日付オブジェクトに変換する。
     * @param date 
     * @param time 
     */
    strToDateTime: function(date: string, time: string) {
        let dateArr: string[] = []
        if (date === '' || date === null || date === undefined) {
            return new Date()
        } else {
            dateArr = date.split('-')
        }
        let timeArr: string[] = []
        if (time === '' || time === null || time === undefined) {
            return new Date()
        } else {
            timeArr = time.split(':')
        }
        return new Date(Number(dateArr[0]), Number(dateArr[1]) - 1, Number(dateArr[2]), Number(timeArr[0]), Number(timeArr[1]))
    }
}
