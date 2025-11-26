export interface SocketApiResponse<T> {
  status: 'success' | 'error'
  message: T
}

export enum EventSocket {
  // Common
  ERROR = 'error',
  CONNECT_ERROR = 'connect_error',

  // Class related
  JOIN_CLASSROOM = 'join-classroom',
  JOIN_SUCCESS = 'join-success',

  // Message related
  SEND_MESSAGE = 'send-message',
  NEW_MESSAGE = 'new-message'
}

export interface Message {
  sender?: {
    name: string
    username: string
    avatarUrl: string
  }
  content: string
  sendDate: Date
}


