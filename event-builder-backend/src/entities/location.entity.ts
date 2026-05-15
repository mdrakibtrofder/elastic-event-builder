import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('locations')
export class LocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;
}
