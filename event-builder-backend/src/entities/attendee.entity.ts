import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('attendees')
export class AttendeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: false })
  checkedIn: boolean;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @ManyToOne(() => EventEntity)
  event: EventEntity;
}
