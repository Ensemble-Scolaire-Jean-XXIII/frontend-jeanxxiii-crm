export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at?: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface Status {
  id: number;
  name: string;
  is_custom: boolean;
  created_by?: string;
}

export interface Prospect {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  country_id: number;
  status_id: number;
  last_action_date: string | null;
  created_at?: string;
}

export interface ProspectExtended extends Prospect {
  status_name?: string;
  country_name?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at?: string;
}

export interface Task {
  id: string;
  prospect_id: string;
  assigned_to: string | null;
  email_template_id: string | null;
  notification_email: string;
  task_type: string;
  due_date: string;
  is_completed: boolean;
  created_at?: string;
}
