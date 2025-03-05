import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import TeamHeader from '../components/team/TeamHeader';
import TeamFilters from '../components/team/TeamFilters';
import TeamGrid from '../components/team/TeamGrid';
import TeamPagination from '../components/team/TeamPagination';
import { TeamMember } from '../types';
import { generateTeamMembers } from '../lib/mockData';

// Generate a large dataset once (2000 employees)
const allMockMembers = generateTeamMembers(2000);
const mockDepartments = [...new Set(allMockMembers.map(m => m.member_department))];

// Store the mock data in localStorage to persist between page navigations
if (!localStorage.getItem('mockTeamMembers')) {
  localStorage.setItem('mockTeamMembers', JSON.stringify(allMockMembers));
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<string[]>(mockDepartments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const pageSize = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = () => {
      try {
        setLoading(true);
        setError(null);

        // Get mock data from localStorage or use the generated data
        const storedMembers = localStorage.getItem('mockTeamMembers');
        const teamData = storedMembers ? JSON.parse(storedMembers) : allMockMembers;
        
        // If no stored data, store the generated data
        if (!storedMembers) {
          localStorage.setItem('mockTeamMembers', JSON.stringify(allMockMembers));
        }

        // Filter members based on search query and department
        let filteredMembers = [...teamData];
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredMembers = filteredMembers.filter(member => 
            member.member_name.toLowerCase().includes(query) ||
            member.member_email.toLowerCase().includes(query) ||
            member.member_role.toLowerCase().includes(query)
          );
        }
        
        if (selectedDepartment) {
          filteredMembers = filteredMembers.filter(member => 
            member.member_department === selectedDepartment
          );
        }
        
        // Calculate pagination
        const total = filteredMembers.length;
        const pages = Math.ceil(total / pageSize);
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        
        // Get current page data
        const paginatedMembers = filteredMembers.slice(start, end);
        
        // Update state
        setMembers(paginatedMembers);
        setTotalMembers(total);
        setTotalPages(pages);
        setDepartments(mockDepartments);
        
      } catch (err) {
        console.error('Error with mock team data:', err);
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    // Simulate network delay
    const timer = setTimeout(() => {
      fetchTeamData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedDepartment, currentPage]);

  const handleMemberClick = (memberId: string) => {
    // Find the member data to store for the profile page
    const memberData = allMockMembers.find(m => m.member_id === memberId);
    if (memberData) {
      // Store the selected member data in localStorage for the profile page
      localStorage.setItem('selectedMember', JSON.stringify(memberData));
    }
    
    // Navigate to the profile page
    navigate(`/profile/${memberId}`);
  };

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TeamHeader totalMembers={totalMembers} />
          <TeamFilters
            searchQuery={searchQuery}
            selectedDepartment={selectedDepartment}
            departments={departments}
            onSearchChange={value => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            onDepartmentChange={value => {
              setSelectedDepartment(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading team members..." />
      ) : members.length === 0 ? (
        <EmptyState
          title="No team members found"
          message={searchQuery ? "Try adjusting your search criteria" : "No team members available"}
        />
      ) : (
        <>
          <TeamGrid members={members} onMemberClick={handleMemberClick} />
          {totalPages > 1 && (
            <TeamPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalMembers={totalMembers}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}