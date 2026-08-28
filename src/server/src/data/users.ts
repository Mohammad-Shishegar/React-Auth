export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  permissions: string[];
}

export const users: User[] = [
  {
    id: "1",
    name: "Mohammad",
    email: "mohammad@test.com",
    password: "123456",
    role: "admin",
    permissions: ["user:read", "user:create", "user:update", "user:delete"],
  },
  {
    id: "2",
    name: "Ali",
    email: "ali@test.com",
    password: "123456",
    role: "user",
    permissions: ["user:read"],
  },
];
