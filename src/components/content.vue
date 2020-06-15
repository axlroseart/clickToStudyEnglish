<template>
  <div class="content-index">
    <!-- 金币奖励框 -->
    <div class="coins">
      <i class="icon-gold_coin"></i>
      <label>{{ score }}</label>
    </div>
    <h1 v-show="!showTitle">{{ resource.title }}</h1>
    <div class="fixed-title" v-show="showTitle">
      <h2>{{ resource.title }}</h2>
    </div>
    <!-- content -->
    <div class="story-content" @click="eventProxy" v-html="content"></div>
    <div class="story-content-loading">加载中...</div>
    <!-- loading - 吃豆子 -->
    <div class="demoBox" id="google" v-show="loadModal">
      <section class="demoList">
        <section class="demoItem">
          <section class="container google-animation-9">
          <section class="shape shape-4">
          <section class="shape-4-top"></section>
          <section class="shape-4-bottom"></section>
          <section class="shape-4-eye"></section>
          <!-- <img src="./assets/images/christmasHat2.png" alt="christmasHat"> -->
          </section>
          <section class="shape shape-1"></section>
          <section class="shape shape-2"></section>
          <section class="shape shape-3"></section>
          </section>
        </section>
      </section>
    </div>
    <!-- 遮罩 -->
    <div class="mask" v-show="loadModal"></div>
    <!-- 单词选择组件 -->
    <transition-group enter-active-class="animated fadeInDown"  leave-active-class="animated fadeOutUp" mode="out-in">
      <div class="choose-part" v-show="showKeyBlock" key="1">
        <div class="title" @click="playSingleAudio(currKeyData)">
          <span>
            <i class="icon-audio play-mp3"></i>
          </span>
          <label class=""></label>
        </div>
        <choose 
          key="2"
          :currKeyData="currKeyData" 
          ref="choose">
        </choose>
      </div>
    </transition-group>
  </div>
</template>

<script>
import '../assets/styles/content.styl'
// import {Howl} from 'howler'
import choose from './choose'
import { mapState } from 'vuex'
// var wx = require('weixin-js-sdk')
export default {
  data() {
    return {
      id: 0,
      offset: 0,
      content: '',
      showKeyBlock: false,
      currKeyData: {},
      // 故事音频
      sound: null,
      // 单词音频
      wordSound: null,
      loadModal: false,
      // 核心词汇数据
      highlight: [],
      // 文本资源数据
      resource: {},
      showTitle: false,
      isLoaded: false,
      token: '',
      audioBaseUrl: 'https://www.kehanjia.com/mapp/word_audio/'
    }
  },
  created() {
    // this.loadModal = true
    // wx.showLoading({
    //   title: '加载中...'
    // })
    this.id = this.GetRequest(window.location.href).id
    this.index = this.GetRequest(window.location.href).index
    this.token = this.GetRequest(window.location.href).token
    let score = this.GetRequest(window.location.href).score
    if (score) {
      score.split('#').length > 1 ? score = score.split('#')[0] : !0
    }
    this.$store.dispatch('setToken', this.token)
    this.$store.dispatch('fetchUserStore', score)
    console.log('==> id:', this.id)
    console.log('==> index:', this.index)
    console.log('==> token:', this.token)
    this.Api.fetchChapterData({
      data: this.id,
      usertoken: this.token
    }).then(data => {
      this.isLoaded = true
      console.log('==> 拿到数据')
      this._checkData(data).then(data => {
        data = data.data[this.index]
        // data = data.data[0]
        this.highlight = data.highlight
        this.resource = data.resource
        document.getElementsByTagName("title")[0].innerText = `故事寻宝 - ${data.resource.title}`
        let content = JSON.parse(this.resource.content)
        this.getFullContent(content).then((res) => {
          document.querySelector('.content-index').style.height = 'auto'
          this.content = res
          this.replaceHilit(this.highlight)
        })
      })
    }).catch(error => {
      console.log('==> error:', error)
      this.isLoaded = false
    })
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    GetRequest(urlStr) {
      var url
      if (typeof urlStr == "undefined") {
        url = decodeURI(location.search)
      } else {
        url = "?" + urlStr.split("?")[1]
      }
      var theRequest = new Object()
      if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
        }
      }
      return theRequest
    },
    getFullContent(texts) {
      return new Promise((resolve) => {
        let content = ''
        texts.forEach(item => {
          // content += JSON.stringify(item.content) + '<br />'
          content += item.content + '<br />'
        })
        resolve(content)
      })
    },
    handleScroll() {
      var scrollTop = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0
      this.showTitle = scrollTop > 0 ? true : false
    },
    eventProxy(e) {
      let keyWord = e.target.innerHTML
      let type = e.target.dataset.key
      if (type === 'ohmygod' && keyWord) {
        // 初始化
        this.$refs.choose.resetAnswer()
        this.showKeyBlock = true
        // 找出匹配项
        this.currKeyData = this.lookup(keyWord)
        if (this.currKeyData) {
          this.playSingleAudio(this.currKeyData)
        }
      } else {
        this.showKeyBlock = false
      }
    },
    // 点击查找出匹配到的单词
    lookup(key) {
      if (key.split(' <').length > 1) {
        key = key.split(' <')[0] + ' ' + key.split(' <')[1].split('</span>')[0].split('>')[1]
      }
      let data = null
      this.highlight.forEach(item => {
        item.text = (item.text).replace('!', '')
        if (item.text === key) {
          data = item
        }
      })
      return data
    },
    // 替换关键字
    replaceHilit(data) {
      return new Promise(resolve => {
        data.forEach(item => {
          let text = (item.text).replace('!', '')
          // console.log('==> 调整后text:', text)
          let reg = new RegExp("\\b" + text + "\\b", 'ig')
          let hilitHtml = ' <span class="thgilhgih" data-key="ohmygod">' + text + '</span>'
          this.content = this.content.replace(reg, hilitHtml)
        })
        resolve()
      })
    },
    // 关闭选择框
    closeChooseBlock() {
      this.showKeyBlock = false
    },
    // 播放单词发音
    playSingleAudio(curr) {
      console.log(curr.mp3)
      // this.wordSound = new Howl({
      //   src: [`${this.audioBaseUrl}${curr.text}`],
      //   onloaderror: function(e) {
      //     console.log('load error', e)
      //   },
      //   onplayerror: function(e) {
      //     console.log('play error', e)
      //   }
      // })
      this.wordSound = new Audio(curr.mp3)
      this.wordSound.play()
    }
  },
  components: {
    choose
  },
  computed: {
    ...mapState({
      score: state => state.common.score
    })
  }
}
</script>

<style lang="css">

</style>