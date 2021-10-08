import request from '@/utils/request';
import download from '@/utils/download';

export async function getArticleList(params) {
  return request('/article/list',params);
}

export async function getArticle(id) {
  return request(`/article/${id}`,{params:{type:0}});
}

export async function addArticle(params) {
  return request(`/article/add`,{
      method:'POST',
      data:params
    });
}

export async function updateArticle(id,params) {
  return request(`/article/${id}`,{
      method:'PUT',
      data:params
    });
}

export async function exportArticle(id) {
  download(`http://localhost:6060/article/output/${id}`)
}

