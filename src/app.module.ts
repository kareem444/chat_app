import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { FriendsModule } from './friends/friends.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'chat',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    ConfigModule.forRoot(),
    FriendsModule,
    FriendRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
