import { MockCredential } from '../models';
import { MOCK_STUDENTS } from './students.mock';

/**
 * Mock-only credential store. Plaintext, in-memory — acceptable only because this
 * project has no backend/real user data. Never mirror this pattern in production.
 */
export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email: 'admin@alshafei.mock',
    password: 'Admin@123',
    userId: 'teacher-1',
    role: 'admin',
  },
  ...MOCK_STUDENTS.map<MockCredential>((student) => ({
    email: student.email,
    password: 'Student@123',
    userId: student.id,
    role: 'student',
  })),
];
