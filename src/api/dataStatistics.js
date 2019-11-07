import service from '@/utils/service'

const baseUrl = '/api/admin/dataStatistics'

const dataStatisticsApi = {}

dataStatisticsApi.queryList = params => {
  return service({
    url: `${baseUrl}`,
    params: params,
    method: 'get'
  })
}

dataStatisticsApi.countByDate = params => {
  return service({
    url: `${baseUrl}/countByDate`,
    params: params,
    method: 'post'
  })
}

export default dataStatisticsApi
