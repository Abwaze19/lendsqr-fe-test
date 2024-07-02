
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../services/mockApi';
import './Dashboard.scss';

interface User {
  id: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [activeSection, setActiveSection] = useState('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchUsers().then(setUsers);
    }
  }, [navigate]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        break;
      case 'blacklist':
        // Implement blacklist logic
        console.log('Blacklist user:', user.id);
        break;
      case 'activate':
        // Implement activate logic
        console.log('Activate user:', user.id);
        break;
      default:
        break;
    }
  };

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div className="user-details">
        <h2>User Details</h2>
        <button onClick={() => setSelectedUser(null)}>Back to Users</button>
        <div className="user-info">
          <img src={`https://via.placeholder.com/100?text=${selectedUser.userName.charAt(0)}`} alt="User Avatar" />
          <h3>{selectedUser.userName}</h3>
          <p>Email: {selectedUser.email}</p>
          <p>Phone: {selectedUser.phoneNumber}</p>
          <p>Organization: {selectedUser.orgName}</p>
          <p>Status: {selectedUser.status}</p>
          <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedUser) {
      return renderUserDetails();
    }

    switch (activeSection) {
      case 'users':
        return (
          <>
            <h1>Users</h1>
            <div className="stats-cards">
            <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(223, 24, 255, 0.1)'}}>👥</div>
                <div className="stat-label">Users</div>
                <div className="stat-value">2,453</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(87, 24, 255, 0.1)'}}>👥</div>
                <div className="stat-label">Active Users</div>
                <div className="stat-value">2,453</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(245, 95, 68, 0.1)'}}>📄</div>
                <div className="stat-label">Users with Loans</div>
                <div className="stat-value">12,453</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{backgroundColor: 'rgba(255, 51, 102, 0.1)'}}>💰</div>
                <div className="stat-label">Users with Savings</div>
                <div className="stat-value">102,453</div>
              </div>
            </div>
            <div className="filter-dropdown">
              <select>
                <option value="">Organization</option>
                {/* Add organization options */}
              </select>
              <input type="text" placeholder="Username" />
              <input type="email" placeholder="Email" />
              <input type="date" placeholder="Date" />
              <input type="tel" placeholder="Phone Number" />
              <select>
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Blacklisted">Blacklisted</option>
              </select>
              <button className="reset-btn">Reset</button>
              <button className="filter-btn">Filter</button>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone number</th>
                    <th>Date joined</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.orgName}</td>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="user-actions">
                          <button onClick={() => handleUserAction('view', user)}>⋮</button>
                          <div className="dropdown">
                            <button onClick={() => handleUserAction('view', user)}>View Details</button>
                            <button onClick={() => handleUserAction('blacklist', user)}>Blacklist User</button>
                            <button onClick={() => handleUserAction('activate', user)}>Activate User</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
            <div className="pagination-info">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
              </div>
              <div className="pagination-controls">
                <button onClick={() => paginate(1)} disabled={currentPage === 1}>
                  &lt;&lt;
                </button>
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  &lt;
                </button>
                {Array.from({ length: Math.min(5, Math.ceil(users.length / usersPerPage)) }, (_, i) => {
                  const pageNumber = currentPage - 2 + i;
                  return pageNumber > 0 && pageNumber <= Math.ceil(users.length / usersPerPage) ? (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={currentPage === pageNumber ? 'active' : ''}
                    >
                      {pageNumber}
                    </button>
                  ) : null;
                })}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                >
                  &gt;
                </button>
                <button
                  onClick={() => paginate(Math.ceil(users.length / usersPerPage))}
                  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
                >
                  &gt;&gt;
                </button>
              </div>
            </div>
          </>
        );
      default:
        return <h1>Dashboard Overview</h1>;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
      <div className="logo">lendsqr</div>
        <div className="search-bar">
          <input type="text" placeholder="Search for anything" />
          <button>Search</button>
        </div>
        <div className="user-info">
          <span>Docs</span>
          <span className="notification-bell">🔔</span>
          <img src="https://via.placeholder.com/32" alt="User" className="user-avatar" />
          <span>Emeka Kamzi ▼</span>
        </div>
      </header>
      <nav className="side-nav">
      <div className="org-dropdown">
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)}>
            <option value="">Switch Organization</option>
            <option value="org1">Organization 1</option>
            <option value="org2">Organization 2</option>
          </select>
        </div>
        <ul>
          <li 
            className={activeSection === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveSection('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={activeSection === 'users' ? 'active' : ''}
            onClick={() => setActiveSection('users')}
          >
            Users
          </li>
          <li>Guarantors</li>
          <li>Loans</li>
          <li>Decision Models</li>
          <li>Savings</li>
          <li>Loan Requests</li>
          <li>Whitelist</li>
          <li>Karma</li>
        </ul>
        <h3>Customers</h3>
        <ul>
          <li>Users</li>
          <li>Guarantors</li>
          <li>Loans</li>
          <li>Savings</li>
        </ul>
      </nav>
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
