<template>
  <div id="app">
    <div class="index">
      <story></story>
    </div>
  </div>
</template>

<script>
import './assets/styles/common.styl'
import story from './components/content'
var wx = require('weixin-js-sdk')
import { mapState } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      loginApi: '/api/api/login?channel_id=2&type=account',
      api: '/api/api/invoke?server=CarIns.getLoginUrl&device=mobile',
      url: '',
      loadModal: false
    }
  },
  mounted() {
    console.log(window.location)
    window.addEventListener('scroll', this.handleScroll)
    let method = window.addEventListener ? "addEventListener" : "attachEvent"
    window[method](
      (method === "addEventListener" ? "" : "on") + "resize",
      this.onResize.bind(window),
      false
    )
    this.onResize()
    // window.onunload = function() {
    //   wx.miniProgram.navigateBack({
    //     success: function() {
    //       console.log('webview callback success.')
    //     }
    //   })
    // }
    window.history.pushState('forward', null, '#')
    window.history.forward(1);
    let self = this
    // 不知为何必须要加以上两行代码才能成功监听到回退事件..先打个问号??? 后续更新
    window.addEventListener("popstate", function() {
        // 向小程序传值
        wx.miniProgram.postMessage({
          score: self.score
        })
        // 跳转到上一个小程序页面
        wx.miniProgram.navigateBack({
            delta: 1
        })
        wx.miniProgram.navigateTo( 'pages/index/main?score=' + self.score + '')
    }, false)
  },
  methods: {
    onResize() {
      // 设置字体
      let docEl = document.documentElement;
      let width = docEl.clientWidth >= 750 ? 750 : docEl.clientWidth;
      let fontSize = width / 10;
      let defaultUIWidth = 750;
      let fontScale = width / defaultUIWidth;
      document.querySelector("html").style.fontSize = fontSize + "px";
      document.querySelector("body").style.fontSize = 20 * fontScale + "px";
    }
  },
  computed: {
    ...mapState({
      score: state => state.common.score
    })
  },
  components: {
    story
  }
}
</script>

<style>
body {
  background: rgba(0, 0, 0, 0)
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  text-align: justify;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: auto;
}
</style>
