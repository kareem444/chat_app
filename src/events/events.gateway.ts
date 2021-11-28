import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'socket' })
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('join')
    joinToRoom(client: Socket, room: any) {
        client.join(room.toString());
    }

    @SubscribeMessage('message')
    findMessage(client: Socket, message: any) {
        this.server.to(message['chat']).emit('message', message);
    }

    @SubscribeMessage('typing')
    typingMessage(client: Socket, typing: any) {
        this.server.emit('typing', typing);
    }

    @SubscribeMessage('friend_request')
    sendFriendRequest(client: Socket, data: any) {
        this.server.to(data[0]).emit('friend_request', data[1]);
        console.log(data);
    }

    @SubscribeMessage('chat')
    refreshChatList(client: Socket, data: any) {
        this.server.to(data['email']).emit('chat', data);
        console.log(data);
    }

    afterInit(server: Server) {
        console.log('init');
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
}
