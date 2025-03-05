-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert initial data into departments
INSERT INTO departments (id, name, location, budget) VALUES
(uuid_generate_v4(), 'Executive', 'McLean, VA', 5000000.00),
(uuid_generate_v4(), 'Technology', 'McLean, VA', 20000000.00),
(uuid_generate_v4(), 'Product Management', 'McLean, VA', 15000000.00),
(uuid_generate_v4(), 'Risk Management', 'McLean, VA', 10000000.00);

-- Insert initial data into positions
INSERT INTO positions (id, title, department_id, salary_min, salary_max, requirements) VALUES
(uuid_generate_v4(), 'Chief Executive Officer', (SELECT id FROM departments WHERE name = 'Executive'), 300000, 500000, '[]'),
(uuid_generate_v4(), 'Distinguished Engineer', (SELECT id FROM departments WHERE name = 'Technology'), 300000, 500000, '["15+ years experience", "Architecture expertise"]'),
(uuid_generate_v4(), 'Director of Product', (SELECT id FROM departments WHERE name = 'Product Management'), 250000, 400000, '["12+ years experience", "Product leadership"]'),
(uuid_generate_v4(), 'Director of Risk', (SELECT id FROM departments WHERE name = 'Risk Management'), 250000, 400000, '["12+ years experience", "Risk management"]');

-- Insert additional positions for completeness
-- (Add more positions as needed)

-- Insert initial auth user (CEO)
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  confirmed_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'rich.fairbank@capitalone.com',
  crypt('SecureP@ssw0rd!', gen_salt('bf')),
  NOW(),
  NOW(),
  NULL,
  NOW(),
  NULL,
  NOW(),
  NULL,
  NULL,
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{}'::jsonb,
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  FALSE,
  NULL
) RETURNING id INTO v_ceo_user_id;

-- Insert CEO into employees
INSERT INTO employees (
  auth_id,
  first_name,
  last_name,
  email,
  current_salary,
  status,
  hire_date,
  preferences,
  attendance,
  education,
  work_history,
  role
) VALUES (
  v_ceo_user_id,
  'Richard',
  'Fairbank',
  'rich.fairbank@capitalone.com',
  5000000.00,
  'active',
  '1994-07-27',
  '{
    "notifications": {
      "email": true,
      "push": true,
      "slack": true
    },
    "theme": "light",
    "language": "en"
  }',
  '{
    "total": 100,
    "streak": 10,
    "lastVisit": "2023-10-01"
  }',
  '[
    {
      "school": "Harvard University",
      "degree": "MBA",
      "field": "Business Administration",
      "startYear": 1988,
      "endYear": 1990
    }
  ]',
  '[
    {
      "company": "Previous Company A",
      "position": "Senior Executive",
      "startYear": 1990,
      "endYear": 1994
    }
  ]',
  'CEO'
) RETURNING id INTO v_ceo_id;

-- Update Executive department with CEO as manager
UPDATE departments
SET manager_id = v_ceo_id
WHERE name = 'Executive';

-- Function to generate mock employees
CREATE OR REPLACE FUNCTION generate_mock_employees(p_count INTEGER DEFAULT 2000)
RETURNS void AS $$
DECLARE
  i INTEGER;
  v_user_id UUID;
  v_dept_id UUID;
  v_position_id UUID;
  v_manager_id UUID;
BEGIN
  FOR i IN 1..p_count LOOP
    -- Insert auth user
    INSERT INTO auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      invited_at,
      confirmation_token,
      confirmation_sent_at,
      recovery_token,
      recovery_sent_at,
      email_change_token_new,
      email_change,
      email_change_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      phone,
      phone_confirmed_at,
      phone_change,
      phone_change_token,
      phone_change_sent_at,
      confirmed_at,
      email_change_token_current,
      email_change_confirm_status,
      banned_until,
      reauthentication_token,
      reauthentication_sent_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'employee_' || i || '@capitalone.com',
      crypt('SecureP@ssw0rd!', gen_salt('bf')),
      NOW(),
      NOW(),
      NULL,
      NOW(),
      NULL,
      NOW(),
      NULL,
      NULL,
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{}'::jsonb,
      FALSE,
      NOW(),
      NOW(),
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      FALSE,
      NULL
    ) RETURNING id INTO v_user_id;

    -- Select random department
    SELECT id INTO v_dept_id FROM departments ORDER BY random() LIMIT 1;

    -- Select random position within the department
    SELECT id INTO v_position_id FROM positions WHERE department_id = v_dept_id ORDER BY random() LIMIT 1;

    -- Select random manager from the same department
    SELECT id INTO v_manager_id 
    FROM employees 
    WHERE department_id = v_dept_id 
      AND id != v_user_id
    ORDER BY random() LIMIT 1;

    -- Insert employee
    INSERT INTO employees (
      auth_id,
      first_name,
      last_name,
      email,
      department_id,
      position_id,
      current_salary,
      status,
      hire_date,
      preferences,
      attendance,
      education,
      work_history
    ) VALUES (
      v_user_id,
      'FirstName_' || i,
      'LastName_' || i,
      'employee_' || i || '@capitalone.com',
      v_dept_id,
      v_position_id,
      FLOOR(RANDOM() * 100000) + 50000, -- Salary between 50k and 150k
      CASE 
        WHEN RANDOM() < 0.9 THEN 'active' 
        WHEN RANDOM() < 0.95 THEN 'on_leave'
        ELSE 'suspended' 
      END,
      NOW() - (FLOOR(RANDOM() * 3650) || ' days')::INTERVAL, -- Hire date within last 10 years
      '{
        "notifications": {
          "email": true,
          "push": true,
          "slack": false
        },
        "theme": "dark",
        "language": "en"
      }',
      '{
        "total": ' || FLOOR(RANDOM() * 100) || ',
        "streak": ' || FLOOR(RANDOM() * 10) || ',
        "lastVisit": "' || TO_CHAR(NOW() - (FLOOR(RANDOM() * 7) || ' days')::INTERVAL, 'YYYY-MM-DD') || '"
      }',
      '[
        {
          "school": "Stanford University",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "startYear": 2010 + FLOOR(RANDOM() * 5),
          "endYear": 2014 + FLOOR(RANDOM() * 5)
        }
      ]',
      '[
        {
          "company": "Previous Company " || FLOOR(RANDOM() * 3),
          "position": "Previous Role " || FLOOR(RANDOM() * 3),
          "startYear": 2015 + FLOOR(RANDOM() * 3),
          "endYear": 2018 + FLOOR(RANDOM() * 3)
        }
      ]'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate 1999 mock employees (since 1 CEO is already inserted)
SELECT generate_mock_employees(1999);

-- Insert work schedules for the current week
INSERT INTO work_schedules (employee_id, date, work_type)
SELECT 
  e.id,
  CURRENT_DATE + (d.day || ' days')::INTERVAL,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'office'
    WHEN RANDOM() < 0.7 THEN 'remote'
    ELSE 'flexible'
  END
FROM employees e
CROSS JOIN GENERATE_SERIES(0, 4) AS d(day)
WHERE e.status = 'active';
