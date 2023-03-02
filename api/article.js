import request from '@/api/request'
export default {
	getArticle({id}) {
		return request.get(`/article/${id}`)
	},
}
