var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var postId = options.id;
    this.setData({
      currentPostId: postId
    })
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      // postsCollected[] = false;
      var mun = postsData.postList.length;
      for (var i = 0; i < mun; i++) {
        postsCollected[i] = false;
      }
      wx.setStorageSync('posts_collected', postsCollected);
    }
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId==
    postId){
      this.setData({
        isPlayingMusic : true
      })

    }
    this.setMusicMonitor();
  },

  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId =that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);

    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'suceess'
    })
  },
  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: ["分享给微信好友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ],
      itemColor: "#405f80",
    })

  },
  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = postsData.postList[currentPostId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },





  // wx.setStorageSync('key', '风暴英雄')
  //   wx.setStorageSync('key', {
  //     game:"风暴英雄",
  //     developer:'暴雪'
  //   })

  //   wx.setStorageSync('key1', {
  //     game: "lol",
  //     developer: '拳头'
  //   })
  // },

  // onCollectionTap:function(event){
  //   var  game = wx.getStorageSync('key')
  //   console.log(game)
  // },

  // onShareTap: function (event) {
  //   // wx.removeStorageSync('key')
  //   wx.clearStorageSync();
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})