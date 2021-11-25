import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Column,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ type: "text", default: "start new message", collation: "utf8mb4_bin" }) for mysql emoji type
    @Column({ type: "text", default: "start new message" })
    last_messaeg: string

    @UpdateDateColumn()
    last_messaeg_created_at: Date

    @Column({ default: 0 })
    user_one_hide_chat: number

    @Column({ default: 0 })
    user_two_hide_chat: number

    @Column({ name: "user_one" })
    user_one: number

    @ManyToOne(() => User, user => user.chatsUserOne)
    @JoinColumn({ name: "user_one" })
    user1: User;

    @Column({ name: "user_two" })
    user_two: number

    @ManyToOne(() => User, user => user.chatsUserTwo)
    @JoinColumn([{ name: "user_two" }])
    user2: User;

    @OneToMany(() => Message, (message) => message.chat, {
        cascade: true,

    })
    message: Message[];
}
