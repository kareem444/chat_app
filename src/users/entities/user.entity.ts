import { Chat } from 'src/chats/entities/chat.entity';
import { FriendRequest } from 'src/friend-requests/entities/friend-request.entity';
import { Message } from 'src/messages/entities/message.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    password: string;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => Chat, (chat) => chat.user_one)
    chatsUserOne: Chat[];

    @OneToMany(() => Chat, (chat) => chat.user_two)
    chatsUserTwo: Chat[];

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.user_from)
    friendRequestUserFrom: FriendRequest[];

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.user_to)
    friendRequestUserTo: FriendRequest[];

    @ManyToMany(() => User)
    @JoinTable({ name: 'friends' })
    friends: User[];
}
