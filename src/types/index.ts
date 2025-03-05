// Add to existing types
export interface Education {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  honors?: string[];
}

export interface WorkHistory {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

export interface User {
  member_id: string;
  member_name: string;
  member_email: string;
  member_role: string;
  member_department: string;
  member_avatar: string;
  member_work_type: string;
  member_attendance: {
    total: number;
    streak: number;
    lastVisit: string;
    reports_to?: string;
  };
  member_education: Education[];
  member_work_history: WorkHistory[];
  department_size: number;
  department_in_office: number;
  department_remote: number;
  department_flexible: number;
}

export type TabType = 'overview' | 'experience' | 'education' | 'team' | 'activity';

export interface OrgChart {
  id: string;
  name: string;
  role: string;
  avatar: string;
  children: OrgChart[];
}