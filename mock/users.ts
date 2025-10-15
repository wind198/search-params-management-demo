export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  lastLogin: string | null;
  createdAt: string;
}

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-14T15:45:00Z",
    createdAt: "2023-07-15T00:00:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "moderator",
    status: "inactive",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-10T09:20:00Z",
    createdAt: "2023-08-20T00:00:00Z",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    status: "pending",
    avatar: "/api/placeholder/wildlife",
    lastLogin: null,
    createdAt: "2024-01-12T00:00:00Z",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "user",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-13T14:30:00Z",
    createdAt: "2023-09-10T00:00:00Z",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana@example.com",
    role: "admin",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-15T08:15:00Z",
    createdAt: "2023-05-01T00:00:00Z",
  },
  {
    id: 7,
    name: "Eve Adams",
    email: "eve@example.com",
    role: "moderator",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-14T16:20:00Z",
    createdAt: "2023-10-15T00:00:00Z",
  },
  {
    id: 8,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "user",
    status: "inactive",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-05T11:10:00Z",
    createdAt: "2023-11-01T00:00:00Z",
  },
  {
    id: 9,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "user",
    status: "active",
    avatar: "/api/placeholder/wildlife",
    lastLogin: "2024-01-15T12:45:00Z",
    createdAt: "2023-12-01T00:00:00Z",
  },
  {
    id: 10,
    name: "Henry Davis",
    email: "henry@example.com",
    role: "user",
    status: "pending",
    avatar: "/api/placeholder/wildlife",
    lastLogin: null,
    createdAt: "2024-01-10T00:00:00Z",
  },
];
