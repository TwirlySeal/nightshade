/*
  Fields will be declared as they are needed

  Canvas API docs: https://canvas.instructure.com/doc/api/all_resources.html
*/

// Docs are somewhat ambiguous about Announcement objects
export interface Announcement {
  id: number,
  title: string,
  message: string,
  html_url: string,
  posted_at: string,
  context_code: string
}

export interface Course {
  id: number,
  uuid: string,
  name: string,
  course_code: string,
  original_name: string,
  start_at: string,
  end_at: string
}

// Commented out because some data types are unclear
// export interface Course {
//   id: number,
//   sis_course_id: string // check data type,
//   uuid: string,
//   integration_id: string, // check data type
//   sis_import_id: number,
//   name: string,
//   course_code: string,
//   original_name: string,
//   workflow_state: string,
//   account_id: number,
//   root_account_id: number,
//   enrollment_term_id: number,
//   grading_periods: any,
//   grading_standard_id: number,
//   grade_passback_setting: string,
//   created_at: string,
//   start_at: string,
//   end_at: string,
//   locale: string,
//   enrollments: any,
//   total_students?: number,
//   calendar: any,
//   default_view: string,
//   syllabus_body?: string,
//   needs_grading_count?: number,
//   term?: any,
//   course_progress?: any,
//   apply_assignment_group_weights: boolean,
//   permissions?: any,
//   is_public: boolean,
//   is_public_to_auth_users: boolean,
//   public_syllabus: boolean,
//   public_syllabus_to_auth: boolean
//   public_description?: string,
//   storage_quota_mb: number,
//   storage_quota_used_mb: number,
//   hide_final_grades: boolean,
//   license: string,
//   allow_student_assignment_edits: boolean,
//   allow_wiki_comments: boolean,
//   allow_student_forum_attachments: boolean,
//   open_enrollment: boolean,
//   self_enrollment: boolean,
//   restrict_enrollments_to_course_dates: boolean,
//   course_format: string,
//   access_restricted_by_date?: boolean,
//   time_zone: string,
//   blueprint?: boolean,
//   blueprint_restrictions?: any,
//   blueprint_restrictions_by_object_type?: any,
//   template?: boolean
// }
