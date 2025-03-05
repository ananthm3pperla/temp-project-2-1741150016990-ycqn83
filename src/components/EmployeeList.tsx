import React, { useState } from 'react';
import { searchEmployees } from '../lib/mockData';

const EmployeeList = () => {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: employees, total, totalPages } = searchEmployees(query, department, page, pageSize);

  return (
    <div>
      <div className="filters">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employees..."
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Technology">Technology</option>
          <option value="Product Management">Product Management</option>
          <option value="Risk Management">Risk Management</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.department}</td>
              <td>{employee.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;