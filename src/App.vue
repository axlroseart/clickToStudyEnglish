<template>
  <div id="app">
    <iframe :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  name: 'app',
  data() {
    return {
      loginApi: '/api/api/login?channel_id=2&type=account',
      api: '/api/api/invoke?server=CarIns.getLoginUrl&device=mobile',
      url: ''
    }
  },
  mounted() {
    let self = this
    this.doLogin((data) => {
      let code = data.code
      if (code === 1) {
        // 登录成功，请求获取URL的API
        axios.get(self.api).then(function(res) {
          console.log('==> 第三方数据：', res)
          // handle success
          self.url = res.data.data
        }).catch(function(error) {
          // handle error
          console.log(error)
        })
      } else {
        alert('未获取到登录状态')
      }
    })
  },
  methods: {
    doLogin(callback) {
      axios.post(this.loginApi, {
        data: {
          keyword: '15768397348',
          password: 'Zjj871026'
        }
      }).then(function(res) {
        console.log(typeof callback)
        if (typeof callback === 'function') {
          callback(res.data)
        } else {
          console.error('Function type error.')
        }
      }).catch(function() {
        alert('登录失败！')
      })
    }
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
