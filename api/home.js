import request from '@/api/request'
export default {
	getBanner(data) {
		return request.get('/banner', data)
	},
	getKnowledgeZone(data) {
		return request.get('/knowledge_zone', data)
	},
	getCustomerService(data) {
		return request.get('/customer_service', data)
	}
}
