const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const API_PREFIX = '/hyra-api/v1'

export const apiRoutes = {
  auth: {
    googleLogin: '/auth/google'
  },
  users: {
    profile: '/users/profile',
    statistics: '/users/statistics'
  },
  subjects: {
    list: '/subjects/all',
    create: '/subjects/new',
    update: (subjectId: string) => `/subjects/${subjectId}`,
    detail: (subjectId: string) => `/subjects/${subjectId}`,
    delete: (subjectId: string) => `/subjects/${subjectId}`,
    files: (subjectId: string) => `/subjects/${subjectId}/files`
  },
  files: {
    list: '/files/all',
    search: '/files/search',
    upload: '/files/new',
    detail: (fileId: string) => `/files/${fileId}`,
    delete: (fileId: string) => `/files/${fileId}`,
    importQuestions: (fileId: string) => `/files/${fileId}/import-questions`
  },
  quizzes: {
    list: '/quizzes/all',
    generate: '/quizzes/generate',
    byFile: (fileId: string) => `/quizzes/file/${fileId}`,
    detail: (quizId: string) => `/quizzes/${quizId}`,
    questions: (quizId: string) => `/quizzes/${quizId}/questions`,
    submit: (quizId: string) => `/quizzes/${quizId}/submit`
  },
  summarize: {
    generation: '/summarizes/generation',
    translation: '/summarizes/translation'
  },
  cloudinary: {
    list: '/cloudinary/cloudinary-file'
  }
} as const

/**
 * Prefix a relative API path with the global API prefix.
 * Useful when an endpoint needs to be resolved outside of the axios client.
 */
export const withApiPrefix = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_PREFIX}${normalized}`
}

export { API_BASE_URL, API_PREFIX }

