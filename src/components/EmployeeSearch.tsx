import React, { useState } from 'react';
import { searchEmployees } from '../lib/mockData';
import { useNavigate } from 'react-router-dom';

const EmployeeSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    const { data } = searchEmployees(value, undefined, 1, 5);
    setResults(data);
  };

  const handleEmployeeClick = (id: string) => {
    navigate(`/profile/${id}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search employees..."
        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      {results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto">
          {results.map((employee) => (
            <li 
              key={employee.id}
              onClick={() => handleEmployeeClick(employee.id)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              <img 
                src={employee.avatar} 
                alt={employee.name}
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <h4 className="font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-500">{employee.role}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeSearch; 