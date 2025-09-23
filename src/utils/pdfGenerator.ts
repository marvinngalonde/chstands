import { ApplicationWithRelations } from '../types';

// Simple PDF-like text generation for applications
export const generateApplicationPDF = (application: ApplicationWithRelations): void => {
  const content = `
STANDHUB MANAGEMENT SYSTEM
Application Details Report

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

=====================================
APPLICANT INFORMATION
=====================================

Application ID: ${application.id}
Name: ${application.name} ${application.surname}
ID Number: ${application.id_number}
Date of Birth: ${new Date(application.dob).toLocaleDateString()}
Contact Numbers: ${application.contact_numbers}
Email: ${application.email || 'N/A'}

=====================================
RESIDENTIAL ADDRESS
=====================================

${application.residential_address}

=====================================
EMPLOYMENT INFORMATION
=====================================

Employer: ${application.employer || 'N/A'}
Department: ${application.department || 'N/A'}
Employment Number: ${application.employment_number || 'N/A'}
Position: ${application.position || 'N/A'}
Employer Contact: ${application.employer_contact || 'N/A'}
Work Address: ${application.work_address || 'N/A'}

=====================================
STAND INFORMATION
=====================================

Council Waiting List Number: ${application.council_waiting_list_number || 'N/A'}
Preferred Area: ${application.preferred_area || 'N/A'}
Stand Size Preference: ${application.stand_size_preference || 'N/A'}

=====================================
NEXT OF KIN
=====================================

Name: ${application.next_of_kin_name || 'N/A'}
Relationship: ${application.next_of_kin_relationship || 'N/A'}
Contact: ${application.next_of_kin_contact || 'N/A'}
Address: ${application.next_of_kin_address || 'N/A'}

=====================================
SPOUSE INFORMATION
=====================================

Name: ${application.spouse_name || 'N/A'}
ID Number: ${application.spouse_id_number || 'N/A'}
Contact: ${application.spouse_contact || 'N/A'}

=====================================
BENEFICIARIES
=====================================

Primary Beneficiary: ${application.primary_beneficiary_name || 'N/A'}
Primary Contact: ${application.primary_beneficiary_contact || 'N/A'}

Secondary Beneficiary: ${application.secondary_beneficiary_name || 'N/A'}
Secondary Contact: ${application.secondary_beneficiary_contact || 'N/A'}

Tertiary Beneficiary: ${application.tertiary_beneficiary_name || 'N/A'}
Tertiary Contact: ${application.tertiary_beneficiary_contact || 'N/A'}

=====================================
APPLICATION STATUS
=====================================

Current Status: ${application.status}
Submitted Date: ${new Date(application.created_at!).toLocaleDateString()}
Last Updated: ${application.updated_at ? new Date(application.updated_at).toLocaleDateString() : 'N/A'}

=====================================
ADDITIONAL INFORMATION
=====================================

Monthly Income: R${application.monthly_income || 'N/A'}
Special Circumstances: ${application.special_circumstances || 'N/A'}

=====================================
DECLARATION
=====================================

I declare that the information provided in this application is true and correct to the best of my knowledge.

Applicant Signature: _________________________
Date: ${new Date().toLocaleDateString()}

=====================================
FOR OFFICIAL USE ONLY
=====================================

Application Processed By: _________________________
Date Processed: _________________________
Approval Status: ${application.status}
Comments: _________________________

=====================================
END OF REPORT
=====================================

This document was generated automatically by StandHub Management System.
For any queries, please contact the administration office.
`;

  // Create and download the text file (simulating PDF)
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `application-${application.id}-${application.name}-${application.surname}-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Generate user report
export const generateUsersPDF = (users: any[]): void => {
  const content = `
STANDHUB MANAGEMENT SYSTEM
Users Report

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

=====================================
SYSTEM USERS SUMMARY
=====================================

Total Users: ${users.length}
Administrators: ${users.filter(u => u.role === 'ADMIN').length}
Applicants: ${users.filter(u => u.role === 'APPLICANT').length}

=====================================
USER DETAILS
=====================================

${users.map((user, index) => `
${index + 1}. ${user.first_name} ${user.last_name}
   Email: ${user.email}
   Role: ${user.role}
   Created: ${new Date(user.created_at).toLocaleDateString()}
   ID: ${user.id}
`).join('\n')}

=====================================
REPORT SUMMARY
=====================================

This report contains ${users.length} users as of ${new Date().toLocaleDateString()}.

For detailed user management, please access the admin dashboard.

=====================================
END OF REPORT
=====================================
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `users-report-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Generate companies report
export const generateCompaniesPDF = (companies: any[]): void => {
  const content = `
STANDHUB MANAGEMENT SYSTEM
Companies Report

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

=====================================
COMPANIES SUMMARY
=====================================

Total Companies: ${companies.length}
Active Companies: ${companies.filter(c => c.is_active === 1).length}
Inactive Companies: ${companies.filter(c => c.is_active === 0).length}

=====================================
COMPANY DETAILS
=====================================

${companies.map((company, index) => `
${index + 1}. ${company.name}
   Description: ${company.description || 'N/A'}
   Contact Email: ${company.contact_email || 'N/A'}
   Contact Phone: ${company.contact_phone || 'N/A'}
   Address: ${company.address || 'N/A'}
   Status: ${company.is_active === 1 ? 'Active' : 'Inactive'}
   Created: ${new Date(company.created_at).toLocaleDateString()}
   ID: ${company.id}
`).join('\n')}

=====================================
END OF REPORT
=====================================
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `companies-report-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Generate analytics report
export const generateAnalyticsPDF = (data: {
  applications: any[];
  companies: any[];
  users: any[];
  timeRange: string;
  metrics: any;
}): void => {
  const { applications, companies, users, timeRange, metrics } = data;

  const content = `
STANDHUB MANAGEMENT SYSTEM
Analytics Report - ${timeRange}

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

=====================================
EXECUTIVE SUMMARY
=====================================

Report Period: ${timeRange}
Total Applications: ${metrics.totalApplications}
Approval Rate: ${applications.length > 0 ? Math.round((metrics.approvedApplications / metrics.totalApplications) * 100) : 0}%
Total Companies: ${metrics.totalCompanies}
Total Users: ${metrics.totalUsers}

=====================================
APPLICATION METRICS
=====================================

Total Applications (${timeRange}): ${metrics.totalApplications}
Approved Applications: ${metrics.approvedApplications}
Pending Applications: ${metrics.pendingApplications}
Disapproved Applications: ${metrics.disapprovedApplications}

Approval Rate: ${applications.length > 0 ? Math.round((metrics.approvedApplications / metrics.totalApplications) * 100) : 0}%
Pending Rate: ${applications.length > 0 ? Math.round((metrics.pendingApplications / metrics.totalApplications) * 100) : 0}%
Rejection Rate: ${applications.length > 0 ? Math.round((metrics.disapprovedApplications / metrics.totalApplications) * 100) : 0}%

=====================================
COMPANY METRICS
=====================================

Total Companies: ${metrics.totalCompanies}
Active Companies: ${metrics.activeCompanies}
Inactive Companies: ${metrics.totalCompanies - metrics.activeCompanies}

Company Activity Rate: ${metrics.totalCompanies > 0 ? Math.round((metrics.activeCompanies / metrics.totalCompanies) * 100) : 0}%

=====================================
USER METRICS
=====================================

Total Users: ${metrics.totalUsers}
New Users (${timeRange}): ${metrics.newUsers}
Administrators: ${users.filter(u => u.role === 'ADMIN').length}
Applicants: ${users.filter(u => u.role === 'APPLICANT').length}

=====================================
TOP COMPANIES BY APPLICATIONS
=====================================

${companies
  .map(company => ({
    ...company,
    appCount: applications.filter(app => app.employer === company.name).length
  }))
  .sort((a, b) => b.appCount - a.appCount)
  .slice(0, 10)
  .map((company, index) => `${index + 1}. ${company.name}: ${company.appCount} applications`)
  .join('\n')}

=====================================
RECENT ACTIVITY
=====================================

Latest Applications:
${applications
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 10)
  .map((app, index) => `${index + 1}. ${app.name} ${app.surname} - ${app.status} (${new Date(app.created_at).toLocaleDateString()})`)
  .join('\n')}

=====================================
RECOMMENDATIONS
=====================================

1. ${metrics.approvalRate < 50 ? 'Consider reviewing approval criteria as approval rate is below 50%' : 'Approval rate is healthy'}
2. ${metrics.pendingApplications > metrics.approvedApplications ? 'High number of pending applications - consider increasing processing capacity' : 'Application processing is on track'}
3. ${metrics.newUsers === 0 ? 'No new user registrations - consider outreach programs' : 'User growth is positive'}

=====================================
END OF REPORT
=====================================

This report was generated automatically by StandHub Management System.
Data accuracy depends on the completeness of system records.
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  window.URL.revokeObjectURL(url);
};