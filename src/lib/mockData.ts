import { faker } from '@faker-js/faker';
import { companySettings } from '../data/company';

// Core interfaces
interface Education {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  honors?: string[];
}

interface WorkHistory {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
}

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  legalName: string;
  email: string;
  role: string;
  department: string;
  workLocation: 'Remote' | 'Hybrid' | 'Onsite';
  avatar: string;
  reportsTo?: string;
  attendance: {
    total: number;
    streak: number;
    lastVisit: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      slack: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  education: Education[];
  workHistory: WorkHistory[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
  type: 'attendance' | 'collaboration' | 'engagement';
}

interface OrgChart {
  id: string;
  name: string;
  role: string;
  avatar: string;
  children: OrgChart[];
}

interface SearchParams {
  query: string;
  department?: string;
  page: number;
  pageSize: number;
}

interface SearchResult {
  data: Employee[];
  total: number;
  totalPages: number;
}

const CAPITAL_ONE_HIERARCHY = {
  executive: {
    roles: ['Chief Executive Officer', 'Chief Financial Officer', 'Chief Technology Officer', 'Chief Risk Officer', 'Chief Product Officer'],
    reportingLevels: ['EVP', 'SVP', 'VP', 'Director', 'Manager', 'Associate']
  },
  departments: {
    'Technology': {
      subDepartments: ['Engineering', 'Infrastructure', 'Data Science', 'Cybersecurity'],
      roles: ['Engineering Director', 'Principal Engineer', 'Senior Engineer', 'Software Engineer']
    },
    'Risk Management': {
      subDepartments: ['Credit Risk', 'Market Risk', 'Operational Risk', 'Compliance'],
      roles: ['Risk Director', 'Risk Manager', 'Risk Analyst', 'Compliance Officer']
    },
    'Product Management': {
      subDepartments: ['Card Products', 'Banking Products', 'Digital Products', 'Customer Experience'],
      roles: ['Product Director', 'Product Manager', 'Product Analyst', 'UX Designer']
    }
  }
};

// Generate education history
const generateEducation = () => {
  const count = faker.number.int({ min: 1, max: 3 });
  return Array.from({ length: count }, () => {
    const startYear = faker.number.int({ min: 1990, max: 2015 });
    const endYear = startYear + faker.number.int({ min: 2, max: 6 });
    return {
      school: faker.company.name() + ' University',
      degree: faker.helpers.arrayElement(['Bachelor of Science', 'Master of Science', 'MBA', 'PhD', 'Bachelor of Arts']),
      field: faker.helpers.arrayElement([
        'Computer Science', 'Business Administration', 'Finance', 'Marketing', 
        'Data Science', 'Engineering', 'Economics', 'Psychology', 'Information Technology'
      ]),
      startYear,
      endYear,
      honors: faker.datatype.boolean() ? [faker.lorem.words(3)] : []
    };
  });
};

// Generate work history
const generateWorkHistory = (currentRole: string) => {
  const count = faker.number.int({ min: 1, max: 4 });
  const currentYear = new Date().getFullYear();
  
  return Array.from({ length: count }, (_, index) => {
    const isCurrentJob = index === 0;
    const endYear = isCurrentJob ? null : currentYear - index - faker.number.int({ min: 1, max: 3 });
    const startYear = endYear ? endYear - faker.number.int({ min: 1, max: 5 }) : currentYear - faker.number.int({ min: 1, max: 5 });
    
    return {
      company: isCurrentJob ? 'Capital One' : faker.company.name(),
      role: isCurrentJob ? currentRole : faker.person.jobTitle(),
      location: faker.location.city() + ', ' + faker.location.state(),
      startDate: `${startYear}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-01`,
      endDate: endYear ? `${endYear}-${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}-01` : null,
      highlights: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.lorem.sentence())
    };
  });
};

// Create CEO profile as static data
export const ceoProfile: Employee = {
  id: 'ceo-richard-fairbank',
  employeeId: 'E001',
  name: 'Richard Fairbank',
  legalName: 'Richard D. Fairbank',
  email: 'richard.fairbank@capitalone.com',
  role: 'Chief Executive Officer',
  department: 'Executive Leadership',
  workLocation: 'Onsite',
  avatar: 'https://example.com/ceo-avatar.jpg',
  attendance: {
    total: 100,
    streak: 10,
    lastVisit: new Date().toISOString()
  },
  preferences: {
    notifications: { email: true, push: true, slack: true },
    theme: 'light',
    language: 'en'
  },
  education: [
    {
      school: 'Stanford University',
      degree: 'Master of Business Administration',
      field: 'Business Administration',
      startYear: 1979,
      endYear: 1981,
      honors: ['Baker Scholar']
    },
    {
      school: 'Stanford University',
      degree: 'Bachelor of Arts',
      field: 'Economics',
      startYear: 1975,
      endYear: 1979,
      honors: ['Phi Beta Kappa']
    }
  ],
  workHistory: [
    {
      company: 'Capital One',
      role: 'Chief Executive Officer',
      location: 'McLean, Virginia',
      startDate: '1994-01-01',
      highlights: [
        'Founded Capital One in 1994',
        'Led transformation from credit card company to Fortune 100 bank',
        'Pioneered data-driven decision-making in banking'
      ]
    }
  ]
};

export function generateMockAchievements(count: number): Achievement[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      'Perfect Attendance Streak',
      'Team Collaboration Champion',
      'High Engagement Score',
      'Project Milestone Reached',
      'Mentorship Excellence'
    ]),
    description: faker.helpers.arrayElement([
      'Maintained consistent office presence',
      'Led successful cross-team initiative',
      'Achieved highest team engagement score',
      'Delivered key project ahead of schedule',
      'Successfully mentored junior team members'
    ]),
    date: faker.date.recent({ days: 30 }).toISOString(),
    points: faker.number.int({ min: 50, max: 500 }),
    type: faker.helpers.arrayElement(['attendance', 'collaboration', 'engagement'])
  }));
}

export function getDepartmentSummary(departmentName: string) {
  const department = companySettings.departments.find(d => d.name === departmentName);
  if (!department) return null;

  return {
    name: department.name,
    headCount: department.headCount,
    department_members: Array.from({ length: 5 }, () => ({
      member_id: faker.string.uuid(),
      member_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      member_role: faker.helpers.arrayElement(['Engineer', 'Manager', 'Analyst', 'Designer']),
    }))
  };
}

let employeeDatabase: Employee[] = [];

function createEmployeeProfile(orgNode: OrgChart, reportsTo?: string): Employee {
  return {
    id: orgNode.id,
    employeeId: `E${faker.number.int({ min: 100, max: 999 })}`,
    name: orgNode.name,
    legalName: orgNode.name,
    email: `${orgNode.name.toLowerCase().replace(' ', '.')}@capitalone.com`,
    role: orgNode.role,
    department: orgNode.role.includes('Chief') ? 'Executive Leadership' : orgNode.role.split(' ')[0],
    workLocation: faker.helpers.arrayElement(['Remote', 'Hybrid', 'Onsite']),
    avatar: orgNode.avatar,
    reportsTo,
    attendance: {
      total: faker.number.int({ min: 50, max: 200 }),
      streak: faker.number.int({ min: 1, max: 30 }),
      lastVisit: faker.date.recent().toISOString()
    },
    preferences: {
      notifications: { 
        email: true, 
        push: true, 
        slack: true 
      },
      theme: 'light',
      language: 'en'
    },
    education: [
      {
        school: faker.helpers.arrayElement(['Stanford', 'Harvard', 'MIT', 'Berkeley']),
        degree: faker.helpers.arrayElement(['BS', 'MS', 'MBA', 'PhD']),
        field: faker.helpers.arrayElement(['Computer Science', 'Business', 'Engineering']),
        startYear: 2010,
        endYear: 2014
      }
    ],
    workHistory: [
      {
        company: 'Capital One',
        role: orgNode.role,
        location: 'McLean, Virginia',
        startDate: '2015-01-01',
        highlights: [
          faker.company.catchPhrase(),
          faker.company.catchPhrase()
        ]
      }
    ]
  };
}

function populateEmployeeDatabase(orgChart: OrgChart, reportsTo?: string) {
  const employee = createEmployeeProfile(orgChart, reportsTo);
  employeeDatabase.push(employee);
  
  orgChart.children?.forEach(child => {
    populateEmployeeDatabase(child, orgChart.id);
  });
}

// Get a specific employee by ID
export function getEmployee(id: string): Employee | null {
  // If it's the CEO, return the CEO profile
  if (id === ceoProfile.id) {
    return ceoProfile;
  }
  
  // Otherwise, search in the employee database
  if (employeeDatabase.length === 0) {
    generateEmployeeDatabase();
  }
  
  // Try to find the employee in the database
  const employee = employeeDatabase.find(emp => emp.id === id);
  
  // If not found, check if we need to convert from member_id format
  if (!employee) {
    // Try to get from localStorage
    const storedMembers = localStorage.getItem('mockTeamMembers');
    if (storedMembers) {
      try {
        const allMembers = JSON.parse(storedMembers);
        const memberData = allMembers.find((m: any) => m.member_id === id);
        
        if (memberData) {
          // Ensure attendance object is properly structured
          const attendance = memberData.member_attendance || {};
          
          // Convert TeamMember format to Employee format
          return {
            id: memberData.member_id,
            employeeId: memberData.member_employeeId || `E${faker.number.int({ min: 1000, max: 9999 })}`,
            name: memberData.member_name,
            legalName: memberData.member_legalName || memberData.member_name,
            email: memberData.member_email,
            role: memberData.member_role,
            department: memberData.member_department,
            workLocation: memberData.member_workLocation || faker.helpers.arrayElement(['Remote', 'Hybrid', 'Onsite']),
            avatar: memberData.member_avatar,
            reportsTo: memberData.member_reportsTo,
            attendance: {
              total: attendance.total || faker.number.int({ min: 50, max: 200 }),
              streak: attendance.streak || faker.number.int({ min: 1, max: 30 }),
              lastVisit: attendance.lastVisit || faker.date.recent().toISOString()
            },
            preferences: memberData.member_preferences || {
              notifications: { email: true, push: true, slack: true },
              theme: 'light',
              language: 'en'
            },
            education: memberData.member_education || generateEducation(),
            workHistory: memberData.member_work_history || generateWorkHistory(memberData.member_role)
          };
        }
      } catch (error) {
        console.error("Error parsing stored members:", error);
      }
    }
  }
  
  return employee || null;
}

// Initialize database with full org chart
const fullOrgChart = getOrgChart(ceoProfile.id);
if (fullOrgChart) {
  employeeDatabase = [ceoProfile];
  fullOrgChart.children.forEach(child => {
    populateEmployeeDatabase(child, ceoProfile.id);
  });
}

export function getOrgChart(employeeId: string): OrgChart | null {
  if (employeeId === ceoProfile.id) {
    return {
      id: ceoProfile.id,
      name: ceoProfile.name,
      role: ceoProfile.role,
      avatar: ceoProfile.avatar,
      children: [
        {
          id: 'cfo-123',
          name: 'Andrew Young',
          role: 'Chief Financial Officer',
          avatar: faker.image.avatar(),
          children: generateDepartmentHierarchy('Finance', 3)
        },
        {
          id: 'cto-123',
          name: 'Mike Eason',
          role: 'Chief Technology Officer',
          avatar: faker.image.avatar(),
          children: generateDepartmentHierarchy('Technology', 3)
        },
        {
          id: 'cro-123',
          name: 'Frank LaPrade',
          role: 'Chief Risk Officer',
          avatar: faker.image.avatar(),
          children: generateDepartmentHierarchy('Risk Management', 3)
        },
        {
          id: 'cpo-123',
          name: 'Margaret Mayer',
          role: 'Chief Product Officer',
          avatar: faker.image.avatar(),
          children: generateDepartmentHierarchy('Product Management', 3)
        }
      ]
    };
  }
  return null;
}

function generateDepartmentHierarchy(department: string, depth: number): OrgChart[] {
  if (depth <= 0) return [];

  const deptInfo = CAPITAL_ONE_HIERARCHY.departments[department];
  if (!deptInfo) return [];

  return deptInfo.subDepartments.map(subDept => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: `${subDept} EVP`,
    avatar: faker.image.avatar(),
    children: depth > 1 ? [
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        role: `${subDept} SVP`,
        avatar: faker.image.avatar(),
        children: depth > 2 ? deptInfo.roles.map(role => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          role,
          avatar: faker.image.avatar(),
          children: []
        })) : []
      }
    ] : []
  }));
}

export const loggedInUser = ceoProfile;

export function searchEmployees({ query, department, page, pageSize }: SearchParams): SearchResult {
  let filteredEmployees = employeeDatabase;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.role.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm)
    );
  }

  if (department) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.department === department
    );
  }

  const total = filteredEmployees.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filteredEmployees.slice(start, end),
    total,
    totalPages
  };
}

// Generate a complete employee database with 2000 employees
export function generateEmployeeDatabase(count: number = 2000): Employee[] {
  if (employeeDatabase.length === count) {
    return employeeDatabase;
  }
  
  employeeDatabase = Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const role = faker.person.jobTitle();
    const department = faker.helpers.arrayElement([
      'Technology', 'Product Management', 'Risk Management', 
      'Marketing', 'Finance', 'Human Resources', 'Operations',
      'Legal', 'Customer Service', 'Sales', 'Research & Development'
    ]);
    
    return {
      id: faker.string.uuid(),
      employeeId: `E${faker.number.int({ min: 1000, max: 9999 })}`,
      name: fullName,
      legalName: `${firstName} ${faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'J', 'K', 'L', 'M'])}. ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      role,
      department,
      workLocation: faker.helpers.arrayElement(['Remote', 'Hybrid', 'Onsite']),
      avatar: faker.image.avatar(),
      reportsTo: faker.datatype.boolean(0.8) ? faker.person.fullName() : undefined,
      attendance: {
        total: faker.number.int({ min: 50, max: 200 }),
        streak: faker.number.int({ min: 1, max: 30 }),
        lastVisit: faker.date.recent().toISOString()
      },
      preferences: {
        notifications: { 
          email: faker.datatype.boolean(), 
          push: faker.datatype.boolean(), 
          slack: faker.datatype.boolean() 
        },
        theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
        language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'zh'])
      },
      education: generateEducation(),
      workHistory: generateWorkHistory(role)
    };
  });
  
  return employeeDatabase;
}

// Convert Employee to TeamMember format
export function convertToTeamMember(employee: Employee): any {
  return {
    member_id: employee.id,
    member_name: employee.name,
    member_email: employee.email,
    member_role: employee.role,
    member_department: employee.department,
    member_avatar: employee.avatar,
    member_manager: employee.reportsTo,
    member_location: employee.workLocation === 'Remote' ? 'Remote' : faker.location.city() + ', ' + faker.location.state(),
    member_phone: faker.phone.number(),
    member_hire_date: faker.date.past({ years: 10 }).toISOString(),
    member_bio: faker.lorem.paragraph(3),
    member_skills: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => 
      faker.helpers.arrayElement([
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'SQL', 'NoSQL',
        'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication',
        'Problem Solving', 'Data Analysis', 'Machine Learning', 'UI/UX Design'
      ])
    ),
    member_education: employee.education,
    member_work_history: employee.workHistory,
    member_employeeId: employee.employeeId,
    member_legalName: employee.legalName,
    member_workLocation: employee.workLocation,
    member_attendance: employee.attendance,
    member_preferences: employee.preferences
  };
}

// Generate team members from employee database
export function generateTeamMembers(count: number = 2000): any[] {
  const employees = generateEmployeeDatabase(count);
  return employees.map(convertToTeamMember);
}

// Initialize the database on module load
generateEmployeeDatabase();

export {
  type Employee,
  type Education,
  type WorkHistory,
  type Achievement,
  type OrgChart,
  CAPITAL_ONE_DEPARTMENTS,
  type SearchParams,
  type SearchResult
};
