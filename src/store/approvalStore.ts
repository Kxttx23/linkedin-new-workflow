import { PendingApproval } from './types';

// Production-ൽ ഇതിന് പകരം Redis അല്ലെങ്കിൽ Database ഉപയോഗിക്കുക
const store = new Map<string, PendingApproval>();

export const approvalStore = {
  set: (token: string, data: PendingApproval) => store.set(token, data),
  get: (token: string) => store.get(token),
  delete: (token: string) => store.delete(token),
};