import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { LocationEntity } from './location.entity';
import { EventTypeEntity } from './event-type.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  details: string;

  @ManyToOne(() => EventTypeEntity)
  type: EventTypeEntity;

  @ManyToOne(() => OrganizationEntity, (org) => org.ownedEvents)
  organization: OrganizationEntity;

  @ManyToOne(() => LocationEntity)
  location: LocationEntity;

  @ManyToMany(() => OrganizationEntity, (org) => org.collaboratedEvents)
  @JoinTable({ name: 'event_collaborators' })
  collaborators: OrganizationEntity[];

  @ManyToMany(() => EventEntity)
  @JoinTable({ name: 'event_relations' })
  relatedEvents: EventEntity[];
}
