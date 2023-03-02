import request from '@/api/request'
export default {
	getDoctorCategory(data) {
		return request.get('/doctor_category', data)
	},
	getDoctorArea(data) {
		return request.get('/doctor_area', data)
	},
	getDoctor(data) {
		return request.get('/doctor', data)
	}
}
