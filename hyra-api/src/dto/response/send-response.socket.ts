/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Socket } from 'socket.io'
import type { Server as ServerIO, Namespace } from 'socket.io'
import type { EventSocket, Message, SocketApiResponse } from '~/types/socket.types'

export const sendToSocket = <T>(socket: Socket, event: EventSocket, payload: SocketApiResponse<T>) => {
  socket.emit(event, payload)
}

export const sendToRoom = (io: ServerIO | Namespace, to: any, event: EventSocket, payload: Message) => {
  io.to(to).emit(event, payload)
}
