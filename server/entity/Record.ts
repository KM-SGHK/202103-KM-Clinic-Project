import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';
//import {BaseEntity} from './BaseEntity';

@Entity('Record')
export class Record extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ClinicEmail: string;

    @Column()
    DocName: string;

    @Column()
    PatientName: string;

    @Column()
    Diagnosis: string;

    @Column()
    Medication: string;

    @Column()
    ConsultationFee: string;

    @Column()
    Date: string;

    @Column()
    Time: string;

    @Column()
    FollowUp: boolean;


}