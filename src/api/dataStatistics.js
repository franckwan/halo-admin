import service from '@/utils/service'

const baseUrl = '/api/admin/dataStatistics'

const dataStatisticsApi = {}

dataStatisticsApi.queryList = params => {
  return service({
    url: `${baseUrl}/queryList`,
    params: params,
    method: 'get'
  })
}

export default dataStatisticsApi
