import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ type: 'text', collation: "utf8mb4_bin", nullable: true }) for mysql emoji type
    @Column({ type: 'text', nullable: true })
    content: String;

    @Column({ nullable: true })
    image: String;

    @Column({ name: 'userId' })
    userId: number;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Chat, (chat) => chat.message)
    chat: Chat;

    @CreateDateColumn()
    created_at: Date;
}
