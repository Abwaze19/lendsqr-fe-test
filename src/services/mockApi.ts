// src/services/mockApi.ts

interface User {
  id: string;
  orgName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
}

const mockUsers: User[] = Array(100).fill(null).map((_, index) => ({
  id: `USR${index + 1}`,
  orgName: `Organization ${index + 1}`,
  userName: `User${index + 1}`,
  email: `user${index + 1}@example.com`,
  phoneNumber: `+1234567890${index}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  status: ['Active', 'Inactive', 'Pending', 'Blacklisted'][Math.floor(Math.random() * 4)] as User['status'],
}));

export const fetchUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), 500);
  });
};