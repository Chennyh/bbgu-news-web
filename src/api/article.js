import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url:'/article/list',
    method:'get',
    params: params
  })
}

export function createArticle(data) {
  return request({
    url: '/article',
    method: 'post',
    data: data
  })
}

export function updateArticle(id, data) {
  return request({
    url: '/article/' + id,
    method: 'put',
    data: data
  })
}

export function updateReview(id, params) {
  return request({
    url: '/article/review/' + id,
    method: 'put',
    params: params
  })
}

export function updateAttributes(id, data) {
  return request({
    url: '/article/attr/' + id,
    method: 'put',
    data: data
  })
}

export function batchUpdateReview(data) {
  return request({
    url: '/article/batch/review',
    method: 'put',
    data: data
  })
}

export function batchUpdateStat(data) {
  return request({
    url: '/article/batch/stat',
    method: 'put',
    data: data
  })
}

export function batchUpdateCategory(data) {
  return request({
    url: '/article/batch/category',
    method: 'put',
    data: data
  })
}

export function batchUpdateUser(data) {
  return request({
    url: '/article/batch/user',
    method: 'put',
    data: data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'delete'
  })
}

export function batchDeleteArticle(data) {
  return request({
    url: '/article/batch',
    method: 'delete',
    data: data
  })
}

export function getArticle(id) {
  return request({
    url: '/article/' + id,
    method: 'get',
  })
}

export function uploadImg(data) {
  return request({
    url: '/article/uploadImg',
    method: 'post',
    data: data
  })
}

export function deleteImg(imageName) {
  return request({
    url:'/article/uploadImg/' + imageName,
    method:'delete',
  })
}
