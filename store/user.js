import requestApi from '@/api/user'
import weChatApi from '@/utils/weChat'
import qs from 'qs'
const getDefaultState = () => {//默认状态
  return {
    token: '',
    redirectUrl: window.location.origin + window.location.pathname,
	channel: 1,
  }
}

const state = getDefaultState()//设置初始状态

const mutations = {//修改state的数据
  set_Token: (state, token) => {//修改token
    state.token = token
  },
  set_channel: (state, channel) => {//修改channel
    state.channel = channel
  },
  set_RedirectUrl: (state) => {//修改指定的url
  //例如：一条连接为 http://yaoxin.test.jidecai.com:10080/h/rule/ranger.html
  //origin指的是基础链接地址，包括协议名、域名和端口号。window.location.origin=http://yaoxin.test.jidecai.com:10080
  //pathname指的是路径(以/开头) window.location.pathname = /h/rule/ranger.html
    state.redirectUrl = window.location.origin + window.location.pathname
  },
}

const actions = {//请求
  // user login——用户的登录
  async login({ state }) {
	//window.location.search：search就是从完整的url的?开始往后截取链接，包括?
    const queryObj = qs.parse(window.location.search.split('?')[1])//qs.pares()—将URL解析成对象的形式;从?往后的链接按照?分割符进行划分，并取出分割好后的数组的index为1的值
	let toPath = window.location.hash//hash用于表示https的#后面的链接内容(url.hash)，若是location.hash——1.是用于返回#后的链接内容，包括#；2.用于修改#的链接地址不包括#,此时就要写个localhost.hash="自己想要设置的链接地址"
    for (const i in queryObj) {//for循环提高效率，要是不用for的话就是 toPath += queryObj[0] topath=''  toPath += queryObj[1] topath='' 这样一直下去直至最后一条数据。topath是一直会被变的
      toPath += `${i}=${queryObj[i]}&`//es6的模板字符串——`${}=${}`,此时表示为：queryObj对象里的第i条赋值给第i条  toPath = toPath+``
    }
    if (qs.stringify(queryObj)) {//qs.stringify()将对象序列化成URL的形式，在末尾以&进行拼接
      toPath = toPath.substring(0, toPath.length - 1)//将toPath对象字符串给取出、从下标值为0的字符开始到倒数第二个结束
    }
    const { data } = await requestApi.getLoginUrl({//1.通过接口，将页面的链接返回给后端。后端又通过接口返回一条静默授权的跳转链接保存在data里，去到App.vue页面
	  url: `${state.redirectUrl}${toPath}`,
    })
	setTimeout(() => {//授权完后跳回你上传给后端的链接并带上token,再通过链接去获取token
	console.log(data.url)
		window.location.replace(data.url)//1s后重载页面
	}, 1000)
    return Promise.resolve()
  },
  //从App.vue的this.$store.dispatch('setToken', option.path);传入的参数
  async setToken({ commit, state }, toPath) {//{是回调函数的值}
    let redirect = false
    const queryObj = qs.parse(window.location.search.split('?')[1])
    const queryObj1 = qs.parse(window.location.hash.split('?')[1])
    const myQueryObj = Object.assign(queryObj, queryObj1)
    const { token, ...otherQuery } = myQueryObj
    if (token) {//如果有token 将结果true/redirect=false赋值给redirect
      redirect = token ? true : redirect
	  commit('set_Token', token)//action里想要修改state的数据，用commit的方法通过调用mutation里的set_Token方法去修改 然后带着token去修改默认的token
    }
    if (redirect) {
      let query = ''
      for (const i in otherQuery) {
        if (i !== 'token') {
          query += `${i}=${otherQuery[i]}&`
        }
      }
      query = query.substring(0, query.length - 1)
      window.location.replace(`${state.redirectUrl}#/${toPath}?${query}`)
    }
    return Promise.resolve()//将传入的commit 和 state参数放入到resolve中，将结果返回给setToken
  },
}

export default {
  state,
  mutations,
  actions,
}
