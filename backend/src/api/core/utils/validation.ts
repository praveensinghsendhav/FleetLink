import * as Joi from 'joi';

export const hospitalValidation = Joi.object({
  name: Joi.string().max(255).required(),
  type: Joi.string().max(100).optional(),
  class: Joi.string().max(50).optional(),
  city: Joi.string().max(100).optional(),
  zone_name: Joi.string().max(100).optional(),
  ward_name: Joi.string().max(100).optional(),
  zone_no: Joi.number().integer().optional(),
  ward_no: Joi.number().integer().optional(),
  pharmacy_available: Joi.boolean().optional(),
  emergency_beds: Joi.number().integer().min(0).optional(),
  total_beds: Joi.number().integer().min(0).optional(),
  num_doctors: Joi.number().integer().min(0).optional(),
  num_nurses: Joi.number().integer().min(0).optional(),
  num_midwives: Joi.number().integer().min(0).optional(),
  monthly_patient_footfall: Joi.number().integer().min(0).optional(),
  ambulance_available: Joi.boolean().optional(),
  ambulance_count: Joi.number().integer().min(0).optional()
});

export const doctorValidation = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(20).optional(),
  specialization: Joi.string().max(100).optional(),
  license_number: Joi.string().max(50).required(),
  years_experience: Joi.number().integer().min(0).optional(),
  is_senior_doctor: Joi.boolean().optional()
});

export const studentValidation = Joi.object({
  student_id: Joi.string().max(20).required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(20).optional(),
  date_of_birth: Joi.date().optional(),
  address: Joi.string().optional(),
  college_id: Joi.number().integer().required(),
  batch_id: Joi.number().integer().required(),
  admission_date: Joi.date().required(),
  current_phase: Joi.string().max(20).optional()
});

export const classValidation = Joi.object({
  batch_id: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().optional(),
  instructor_doctor_id: Joi.number().integer().required(),
  is_guest_lecture: Joi.boolean().optional(),
  class_date: Joi.date().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  classroom: Joi.string().max(100).optional(),
  max_capacity: Joi.number().integer().min(1).optional(),
  status: Joi.string().max(20).optional()
});

export const examValidation = Joi.object({
  batch_id: Joi.number().integer().required(),
  exam_name: Joi.string().max(100).required(),
  exam_type: Joi.string().max(50).required(),
  exam_date: Joi.date().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  max_marks: Joi.number().integer().min(1).required(),
  passing_marks: Joi.number().integer().min(1).required(),
  exam_venue: Joi.string().max(100).optional()
});

export const certificateValidation = Joi.object({
  certificate_number: Joi.string().max(50).required(),
  student_id: Joi.number().integer().required(),
  batch_id: Joi.number().integer().required(),
  issue_date: Joi.date().required(),
  completion_date: Joi.date().required(),
  certificate_type: Joi.string().max(100).optional(),
  signed_by_doctor_id: Joi.number().integer().required(),
  is_valid: Joi.boolean().optional()
});

export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional()
});