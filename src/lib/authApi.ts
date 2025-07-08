import { api } from './api';

export const authAPI = {
  register(data: { email: string; password: string; name?: string }) {
    return api.post('/auth/register', data);
  },
  resendCode(email: string) {
    return api.post('/auth/resend-code', { email });
  },
  verify(email: string, code: string) {
    return api.post('/auth/verify', { email, code });
  },
  login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },
  deleteAccount() {
    return api.delete('/auth/profile');
  }
};
