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
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-34-194-25-190.compute-1.amazonaws.com',
      port: 5432,
      username: 'efgsbvgbyxgfgw',
      password: '3558220b5a606da29d88e00ae76b79457f80f41e8fa84ff80f4a179d50688c3d',
      database: 'da5rgloqe3ka7n',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    // TypeOrmModule.forRoot({
    //   // type: 'postgres',
    //   // host: 'localhost',
    //   // port: 5432,
    //   // username: 'postgres',
    //   // password: 'kareem44',
    //   // database: 'chat_server',
    //   // entities: ["dist/**/*.entity{.ts,.js}"],
    //   // synchronize: true,
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'chat',
    //   entities: ["dist/**/*.entity{.ts,.js}"],
    //   synchronize: true,
    // }),
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    ConfigModule.forRoot(),
    FriendsModule,
    FriendRequestsModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
