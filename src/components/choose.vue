<template>
  <div class="choose-index">
    <div class="container">
      <section
        v-if="isPlaying"
        class="poke-section"
      >
        <!-- <h1 class="poke-title">
          哪个才是正确的释义？
        </h1> -->
        <div class="poke-question-wrapper">
          <div 
            class="poke-image"
            :class="{'poke-image-success': isChecked && selected.text === currKeyData.correct, 'poke-image-error': isChecked && selected.text !== currKeyData.correct}"
          >
            <label>{{ currKeyData.text }}</label>
          </div>
          <!-- <transition-group 
            tag="div"
            name="animate-options"
            :class="{'poke-options-answers': isChecked}"
            class="poke-options"
          > -->
          <div :class="{'poke-options-answers': isChecked}" class="poke-options">
            <button 
              v-for="(item, index) in currKeyData.answers"
              :key="item"
              :data-index="index"
              :class="{'success': isChecked && item === currKeyData.correct , 'error': isChecked && selected.index === index && selected.text !== currKeyData.text}"
              class="poke-options-button"
              :disabled="isChecked"
              @click="selectAnswer(item, index)"
            >{{ item }}</button>
          <!-- </transition-group> -->
          </div>
          <!-- 选择操作按钮 -->
          <!-- <footer class="poke-buttons">
            <button
              :disabled="isChecked || Object.keys(selected).length < 1"
              class="button confirm"
              @click="checkAnswer"
            >选好了</button>
            <button
              class="button reset"
              @click="resetAnswer"
            >重新选择</button>
          </footer> -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import '../assets/styles/pokemon.css'
import '../assets/styles/choose.styl'
import correctSound from '../assets/audio/correct.mp3'
import incorrectSound from '../assets/audio/incorrect.mp3'
import {Howl, Howler} from 'howler'
import { mapState } from 'vuex'
var wx = require('weixin-js-sdk')
export default {
  data() {
    return {
      url: '',
      score: 0,
      baseScore: 10,
			selected: {},
			isPlaying: false,
			isDone: false,
			isChecked: false,
      correctSound: null,
      incorrectSound: null
    }
  },
  // props: ['currKeyData', 'isPlaying', 'isChecked'],
  props: ['currKeyData'],
  watch: {
    // 点击的词汇发生变化，则清除选择状态
    currKeyData() {
      this.resetAnswer()
    }
  },
	mounted() {
    this.startGame()
    this.initSound()
	},
	methods: {
    initSound() {
      this.correctSound = new Howl({
        src: correctSound
      })
      this.incorrectSound = new Howl({
        src: incorrectSound
      })
      Howler.volume(1)
    },
		startGame() {
			this.score = 0;
			this.isPlaying = true;
			this.resetAnswer();
		},
		selectAnswer(ans, index) {
			// if (!this.isChecked) {
			// 	this.$set(this.selected, 'text', ans);
			// 	this.$set(this.selected, 'index', index);
      // }
      this.$set(this.selected, 'text', ans)
      this.$set(this.selected, 'index', index)
      if (!this.isChecked) {
        // console.log(this.selected.text, this.currKeyData.correct)
        if (this.selected.text === this.currKeyData.correct) {
          this.correctCallback()
        } else {
          this.incorrectCallback()
        }
      }
      this.isChecked = true
		},
		// checkAnswer() {
		// 	this.isChecked = true;
		// 	if (this.selected.text === this.currKeyData.correct) {
		// 		this.correctCallback()
		// 	} else {
    //     this.incorrectCallback()
    //   }
    // },
    // 选择正确回调
    correctCallback() {
      // 加分
      // this.score += 10
      this.Api.addScore(
        {
          data: {
            amount: this.baseScore,
            userId: 65535,
            word: this.selected.text
          },
          usertoken: this.token
        }
      ).then(res => {
        this._checkData(res).then(res => {
          res = res.data
          this.score = res.score
          this.$store.dispatch('fetchUserStore', this.score)
          // 向小程序传值
          wx.miniProgram.postMessage({
            score: res.score
          })
        }).catch(err => {
          wx.showToast({
            title: err.msg,
            icon: 'none',
            duration: 2000
          })
        })
      }).catch(() => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none',
          duration: 2000
        })
      })
      // 正确提示音
      this.correctSound.play()
    },
    // 选择错误回调
    incorrectCallback() {
      // 错误提示音
      this.incorrectSound.play()
    },
		resetAnswer() {
			this.isChecked = false;
		},
		restartGame() {
			this.isDone = false;
		},
    closeChooseBlock() {
      this.isPlaying = false
    }
  },
  computed: {
    ...mapState({
      token: state => state.common.token
    })
  }
}
</script>

<style lang="css">
  
</style>