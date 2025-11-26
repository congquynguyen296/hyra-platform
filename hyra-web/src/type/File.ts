// Frontend representation of backend IFile document
export type FileType = 'docx' | 'doc' | 'pdf' | 'md'
export type StatusType = 'ACTIVE' | 'DELETED'

export interface FileMeta {
    data: any
    id?: string
    _id?: string
    name: string
    type: FileType
    size: number
    storagePath?: string
    cloudinaryUrl?: string
    cloudinaryPublicId?: string
    mimeType?: string
    subjectId?: string
    summaryContent?: string
    summaryCount: number
    quizCount: number
    uploadDate: string
    status: StatusType
    createdAt: string
    updatedAt: string
}
