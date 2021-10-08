import request from '@/utils/request';

export async function login(params) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}
