import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity('Signup')
export class Signup extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Email: string;

    @Column()
    Password: string;

    @Column()
    ClinicName: string;

    @Column()
    PhoneNo: string;

    @Column()
    Address: string;

}