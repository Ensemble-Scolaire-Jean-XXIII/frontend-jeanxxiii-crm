export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at?: string;
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
  country_id: number | null;
  status_id: number | null;
  last_action_date: string | null;
  created_at?: string;
  lexpress_id?: string | null;
  situation?: string | null;
  niveau?: string | null;
  programme?: string | null;
  campus?: string | null;
  code_postal?: string | null;
  commentaire?: string | null;
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

export interface Country {
  id: number;
  name: string;
}

export interface EmailAutomationRule {
  id: number;
  status_id: number;
  programme: string | null;
  email_template_id: string;
  delay_days: number;
}

export interface EmailLog {
  id: string;
  prospect_id: string;
  email_template_id: string;
  sent_at: Date;
  status: string;
}
