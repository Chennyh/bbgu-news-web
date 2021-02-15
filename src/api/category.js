import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/category/list',
    method: 'get',
    params: params
  })
}

export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data: data
  })
}

export function updateCategory(id, data) {
  return request({
    url: '/category/' + id,
    method: 'put',
    data: data
  })
}

export function deleteCategory(id) {
  return request({
    url:'/category/' + id,
    method:'delete',
  })
}

export function getCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'get'
  })
}

export function fetchAllCategoryList() {
  return request({
    url: '/category/listAll',
    method: 'get'
  })
}
