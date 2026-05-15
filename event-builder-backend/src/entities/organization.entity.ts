import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  contactEmail: string;

  @OneToMany(() => EventEntity, (event) => event.organization)
  ownedEvents: EventEntity[];

  @ManyToMany(() => EventEntity, (event) => event.collaborators)
  collaboratedEvents: EventEntity[];
}
