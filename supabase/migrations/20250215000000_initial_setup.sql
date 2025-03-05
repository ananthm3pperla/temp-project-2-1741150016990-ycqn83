-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create departments table without manager_id foreign key
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  location text NOT NULL,
  budget numeric(15,2) NOT NULL,
  manager_id uuid, -- Will add foreign key later
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create positions table
CREATE TABLE IF NOT EXISTS positions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE CASCADE,
  salary_min numeric(10,2) NOT NULL,
  salary_max numeric(10,2) NOT NULL,
  requirements jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  preferred_name text,
  email text UNIQUE NOT NULL,
  phone text,
  hire_date date NOT NULL,
  termination_date date,
  status text NOT NULL CHECK (status IN ('active', 'terminated', 'on_leave', 'suspended')),
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  position_id uuid REFERENCES positions(id) ON DELETE SET NULL,
  manager_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  current_salary numeric(10,2) NOT NULL,
  avatar_url text,
  preferences jsonb DEFAULT '{
    "notifications": {
      "email": true,
      "push": true,
      "slack": true
    },
    "theme": "light",
    "language": "en"
  }',
  role text
);

-- 4. Create team_directory view
CREATE OR REPLACE VIEW team_directory AS              
SELECT                                                
  e.id,                                               
  e.first_name,                                       
  e.last_name,                                        
  e.preferred_name,                                   
  e.email,                                            
  p.title AS position,                                
  d.name AS department,                               
  e.status,                                           
  e.avatar_url,                                       
  m.first_name || ' ' || m.last_name AS manager_name, 
  m.email AS manager_email                            
FROM employees e                                      
JOIN departments d ON e.department_id = d.id          
JOIN positions p ON e.position_id = p.id              
LEFT JOIN employees m ON e.manager_id = m.id;

-- 5. Create work_schedules table
CREATE TABLE IF NOT EXISTS work_schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  work_type text NOT NULL CHECK (work_type IN ('office', 'remote', 'flexible')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (employee_id, date)
);

-- 6. Add foreign key for departments.manager_id
ALTER TABLE departments 
  ADD CONSTRAINT departments_manager_id_fkey 
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 7. Grant necessary permissions on team_directory view
GRANT SELECT ON team_directory TO authenticated;

-- 8. Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_work_schedules_employee_id ON work_schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_positions_department_id ON positions(department_id);

-- 9. Create generate_mock_employees function
CREATE OR REPLACE FUNCTION generate_mock_employees(count integer)
RETURNS void AS $$
DECLARE
    i integer;
    rand_department uuid;
    rand_position uuid;
    rand_manager uuid;
    new_auth_id uuid;
BEGIN
    FOR i IN 1..count LOOP
        -- Select a random department
        SELECT id INTO rand_department FROM departments ORDER BY RANDOM() LIMIT 1;
        
        -- Select a random position within the selected department
        SELECT id INTO rand_position FROM positions WHERE department_id = rand_department ORDER BY RANDOM() LIMIT 1;
        
        -- Optionally, select a random manager (another employee) or set to NULL
        SELECT id INTO rand_manager FROM employees ORDER BY RANDOM() LIMIT 1;
        
        -- Insert a new user into auth.users and retrieve the auth_id
        INSERT INTO auth.users (
            id,  -- Ensure id is included and generated
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            uuid_generate_v4(),  -- Generate a new UUID for id
            CONCAT('user', i, '@example.com'),
            crypt('SecureP@ssw0rd!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            '{}'::jsonb,
            'authenticated',
            'authenticated'
        ) RETURNING id INTO new_auth_id;
        
        -- Insert the new employee into employees table
        INSERT INTO employees (
            auth_id,
            first_name,
            last_name,
            email,
            current_salary,
            status,
            hire_date,
            department_id,
            position_id,
            manager_id,
            preferences
        ) VALUES (
            new_auth_id,
            CONCAT('FirstName', i),
            CONCAT('LastName', i),
            CONCAT('user', i, '@example.com'),
            ROUND((RANDOM() * (100000 - 50000) + 50000)::numeric, 2),
            'active',
            CURRENT_DATE - (INTERVAL '1 year' * (RANDOM() * 5 + 1)),
            rand_department,
            rand_position,
            CASE WHEN i > 1 THEN rand_manager ELSE NULL END,
            '{"notifications": {"email": true, "push": true, "slack": true}, "theme": "light", "language": "en"}'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 10. Generate 50 mock employees
SELECT generate_mock_employees(50);