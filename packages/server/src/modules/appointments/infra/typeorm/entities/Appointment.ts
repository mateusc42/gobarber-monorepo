import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
// import { uuid } from 'uuidv4';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp with time zone')
  date: Date;

  @Column()
  provider_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  customer_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // constructor({ provider, date }: Omit<Appointment, 'id'>) {
  //     this.id = uuid();
  //     this.provider = provider;
  //     this.date = date;
  // }
}

export default Appointment;
