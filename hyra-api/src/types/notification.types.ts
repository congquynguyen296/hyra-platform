import { QueueNameEnum } from '~/enums/rabbitQueue.enum'

export interface NotificationDto {
  type: QueueNameEnum
  email: string[] | string
  title: string
}

export interface VerifyEmail extends NotificationDto {
  token: string
  name: string
}
