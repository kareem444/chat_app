import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Column,
} from 'typeorm';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

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
        cascade: true
    })
    message: Message[];
}
