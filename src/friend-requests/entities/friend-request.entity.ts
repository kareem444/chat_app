import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_from: number;

    @ManyToOne(() => User, (user) => user.friendRequestUserFrom)
    @JoinColumn({ name: 'user_from' })
    userFrom: User;

    @Column()
    user_to: number;

    @ManyToOne(() => User, (user) => user.friendRequestUserTo)
    @JoinColumn({ name: 'user_to' })
    userTo: User;
}
