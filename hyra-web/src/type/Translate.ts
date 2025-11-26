export interface TranslateHtmlRequest {
    content: string
    targetLang: string // e.g., 'en' | 'vi' | 'zh'
    model?: string
}

export interface TranslateHtmlResponse {
    result: string
    targetLang: string
    model: string
}
