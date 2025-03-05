import React from 'react';
import { getEmployee } from '../lib/mockData';

const EmployeeProfile = ({ id }: { id: string }) => {
  const employee = getEmployee(id);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="profile">
      <div className="header">
        <img src={employee.avatar} alt={employee.name} />
        <div>
          <h1>{employee.name}</h1>
          <p>{employee.role}</p>
          <p>{employee.department}</p>
        </div>
      </div>

      <div className="details">
        <h2>Education</h2>
        {employee.education.map((edu, index) => (
          <div key={index}>
            <h3>{edu.school}</h3>
            <p>{edu.degree} in {edu.field}</p>
            <p>{edu.startYear} - {edu.endYear}</p>
          </div>
        ))}

        <h2>Work History</h2>
        {employee.workHistory.map((work, index) => (
          <div key={index}>
            <h3>{work.company}</h3>
            <p>{work.role}</p>
            <p>{work.location}</p>
            <p>{work.startDate} - {work.endDate || 'Present'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProfile; 