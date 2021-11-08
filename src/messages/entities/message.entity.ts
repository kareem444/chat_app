import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: String;

    @ManyToOne(() => User, (user) => user.messages)
    user: User;

    @ManyToOne(() => Chat, (chat) => chat.message)
    chat: Chat;

    @CreateDateColumn()
    created_at: Date;
}
