import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_types')
export class EventTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  colorHex: string;
}
