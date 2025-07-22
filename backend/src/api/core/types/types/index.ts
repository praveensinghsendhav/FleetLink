import { EnvSSL, EnvKnex, EnvAccessToken } from "./environment.cluster";
import { ArchiveMimeType } from "./archive-mime-type.type";
import { AudioMimeType } from "./audio-mime-type.type";
import { DocumentMimeType } from "./document-mime-type.type";
import { ImageMimeType } from "./image-mime-type.type";
import { VideoMimeType } from "./video-mime-type.type";
import { MimeType } from "./mime-type.type";
import { MomentUnit } from "./moment-unit.type";

export interface Hospital {
    id: number;
    name: string;
    type?: string;
    class?: string;
    city?: string;
    zone_name?: string;
    ward_name?: string;
    zone_no?: number;
    ward_no?: number;
    pharmacy_available?: boolean;
    emergency_beds?: number;
    total_beds?: number;
    num_doctors?: number;
    num_nurses?: number;
    num_midwives?: number;
    monthly_patient_footfall?: number;
    ambulance_available?: boolean;
    ambulance_count?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    specialization?: string;
    license_number: string;
    years_experience?: number;
    is_senior_doctor?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface DoctorHospitalAffiliation {
    id: number;
    doctor_id: number;
    hospital_id: number;
    position?: string;
    department?: string;
    start_date: Date;
    end_date?: Date;
    is_active?: boolean;
    created_at?: Date;
}

export interface College {
    id: number;
    name: string;
    code: string;
    address?: string;
    city?: string;
    state?: string;
    accreditation?: string;
    is_partner?: boolean;
    contact_person?: string;
    contact_email?: string;
    contact_phone?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface TrainingBatch {
    id: number;
    batch_name: string;
    start_date: Date;
    classroom_end_date: Date;
    program_end_date: Date;
    max_students?: number;
    current_students?: number;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Student {
    id: number;
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    date_of_birth?: Date;
    address?: string;
    college_id: number;
    batch_id: number;
    admission_date: Date;
    current_phase?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Class {
    id: number;
    batch_id: number;
    title: string;
    description?: string;
    instructor_doctor_id: number;
    is_guest_lecture?: boolean;
    class_date: Date;
    start_time: string;
    end_time: string;
    classroom?: string;
    max_capacity?: number;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ClassAttendance {
    id: number;
    class_id: number;
    student_id: number;
    attendance_status?: string;
    check_in_time?: string;
    notes?: string;
    created_at?: Date;
}

export interface Exam {
    id: number;
    batch_id: number;
    exam_name: string;
    exam_type: string;
    exam_date: Date;
    start_time: string;
    end_time: string;
    max_marks: number;
    passing_marks: number;
    exam_venue?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface StudentExamResult {
    id: number;
    exam_id: number;
    student_id: number;
    marks_obtained: number;
    grade?: string;
    passed: boolean;
    exam_date: Date;
    created_at?: Date;
}

export interface Internship {
    id: number;
    student_id: number;
    supervising_doctor_id: number;
    hospital_id: number;
    start_date: Date;
    end_date: Date;
    department?: string;
    status?: string;
    performance_rating?: number;
    supervisor_feedback?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Certificate {
    id: number;
    certificate_number: string;
    student_id: number;
    batch_id: number;
    issue_date: Date;
    completion_date: Date;
    certificate_type?: string;
    signed_by_doctor_id: number;
    is_valid?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CertificateValidation {
    id: number;
    certificate_id: number;
    validator_name: string;
    validator_organization?: string;
    validator_email?: string;
    validation_date: Date;
    validation_purpose?: string;
    ip_address?: string;
    user_agent?: string;
    created_at?: Date;
}

export interface AcademicCredit {
    id: number;
    student_id: number;
    college_id: number;
    batch_id: number;
    credits_awarded: number;
    credit_type?: string;
    awarded_date: Date;
    academic_year?: string;
    created_at?: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
    [key: string]: any;
}
export { EnvSSL, EnvKnex, EnvAccessToken, AudioMimeType, ArchiveMimeType, DocumentMimeType, ImageMimeType, VideoMimeType, MimeType, MomentUnit };