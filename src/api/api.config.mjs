/**
 * API业务参数对象，属性名对应mutations
 * url: 接口地址
 * method: 请求类型
 * type: json（参数为json格式对象）, form（参数为form表单对象）, url（参数为字符串拼接）, mix（参数为混合型数据结构）
 * params: 默认请求参数对象
 * extra: 混合模式下的参数类型
 */
const apiConfig = {
  // 获取具体故事所有数据
  fetchChapterData: {
    url: '/mapp/chapter/list',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 登录
  userLogin: {
    url: '/mapp/login',
    method: 'POST',
    type: 'json',
    params: {
    }
  },
  // 获取单词音频
  fetchWordsAudio: {
    url: '/mapp/word_audio/{word}',
    method: 'GET',
    type: 'json',
    params: {
    }
  },
  // 点金币 - 回答正确加分
  addScore: {
    url: '/mapp/user/addWordMoney',
    method: 'POST',
    type: 'json',
    params: {
    }
  }
}

export default apiConfig