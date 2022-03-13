export type UserType = {
    id: string
    password: string
    name: string
    seqNo: number
}

export type ClientType = {
    id: number
    name: string
}

export type BusinessType = {
    id: number
    name: string
}

export type SystemType = {
    id: number
    name: string
    business: BusinessType
}

export type InquiryType = {
    id: number
    name: string
}

export type AttachmentType = {
    seqNo: number
    fileName: string
}

export type JobSheetType = {
    // ID
    id: string
    // 顧客
    client: ClientType
    // システム
    businessSystem: SystemType
    // 問合せ区分
    inquiry: InquiryType
    // 問合せ部署
    department: string
    // 担当者
    person: string
    // 発生日 yyyy-MM-dd
    occurDate: string
    // 発生時間 HH:mm
    occurTime: string
    // タイトル
    title: string
    // 詳細
    content: string;
    // 窓口
    contact: UserType
    // 完了期限 yyyy-MM-dd
    limitDate: string
    //対応者
    deal: UserType
    // 完了日 yyyy-MM-dd
    completeDate: string
    //対応詳細
    support: string
    // 対応時間
    responseTime: number
    // 添付ファイルリスト
    fileList: AttachmentType[]
}

export type JobSheetFormType = {
    // 顧客
    client: number
    // 業務
    business: number
    // システム
    system: number
    // 問合せ区分
    inquiry: number
    // 問合せ部署
    department: string
    // 担当者
    person: string
    // 発生日 yyyy-MM-dd
    occurDate: Date
    // 発生時間 HH:mm
    occurTime: Date
    // タイトル
    title: string
    // 詳細
    content: string;
    // 窓口
    contact: string
    // 完了期限 yyyy-MM-dd  日付の入力がない場合にnullはうまく設定できないようなので、空文字とする。
    limitDate: Date | ''
    // //対応詳細
    support: string
    //対応者
    deal: string
    // 完了日 yyyy-MM-dd
    completeDate: Date | ''
    // 対応時間
    responseTime: number
}

// 検索条件の型
export type SearchConditionType = {
    client: number;
    business: number;
    businessSystem: number;
    inquiry: number;
    contact: string;
    deal: string;
    occurDateFrom: string;
    occurDateTo: string;
    completeSign: number;
    limitDate: string;
    keyword: string;
}

export type JobSheetStatsType = {
    businessSystem: BusinessType
    occurCnt1: number
    completeCnt1: number
    responseTime1: number
    occurCnt2: number
    completeCnt2: number
    responseTime2: number
    occurCnt3: number
    completeCnt3: number
    responseTime3: number
    occurCnt4: number
    completeCnt4: number
    responseTime4: number
    occurCnt5: number
    completeCnt5: number
    responseTime5: number
    occurCnt6: number
    completeCnt6: number
    responseTime6: number
    occurCnt7: number
    completeCnt7: number
    responseTime7: number
    occurCnt8: number
    completeCnt8: number
    responseTime8: number
    occurCnt9: number
    completeCnt9: number
    responseTime9: number
    occurCnt10: number
    completeCnt10: number
    responseTime10: number
    occurCnt11: number
    completeCnt11: number
    responseTime11: number
    occurCnt12: number
    completeCnt12: number
    responseTime12: number
    leftCnt: number
    responseTimeSum: number
}