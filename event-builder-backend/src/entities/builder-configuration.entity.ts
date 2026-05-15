import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('builder_configurations')
export class BuilderConfigurationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
