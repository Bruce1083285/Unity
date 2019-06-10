
cc.Class({
    extends: cc.Component,

    properties: {

        // 背景音乐音量大小
        bgmVolume: 1.0,

        // 音效音量大小
        sfxVolume: 1.0,

        // 当前播放背景音乐ID
        bgmAudioID: -1,
    },


    /**
     * 初始化(读取本地保存的音量大小)
     */
    init: function () {

        var t = cc.sys.localStorage.getItem("bgmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }
    },

    /**
     * 获取播放路径
     */
    getUrl: function (url) {
        return cc.url.raw("resources/sounds/" + url);
    },

    /**
     * 播放语音路径
     * @param {*音乐路径} url 
     */
    playWithUrl: function (url) {
        var audioUrl = this.getUrl(url) + '.mp3';
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
            return audioId;
        }
    },

    /**
     * 停止播放指定audioId音乐
     * @param {*} audioId 
     */
    stopWithID:function (audioId) {
        if (audioId&&audioId>0) {
            cc.audioEngine.stop(audioId);  
        }
    },
    
    /**
     * 播放背景音乐
     * @param {*音乐路径} url 
     */
    playBGMWithUrl: function (url) {
        cc.audioEngine.stopAll();
        var audioUrl = this.getUrl(url) + '.mp3';
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    /**
     * 设置音效大小
     */
    setSFXVolume: function (v) {
        cc.sys.localStorage.setItem("sfxVolume", v);
        this.sfxVolume = v;
    },

    /**
     * 获取音效大小
     */
    getSFXVolume: function () {
        return this.sfxVolume;
    },

    /**
     * 设置音乐大小
     */
    setBGMVolume: function (v) {
        cc.sys.localStorage.setItem("bgmVolume", v);
        this.bgmVolume = v;
        cc.audioEngine.setVolume(this.bgmAudioID, v);
    },

    /**
     * 得到音乐大小
     */
    getBGMVolume: function () {
        return this.bgmVolume;
    },

    /**
     * 停止播放背景音乐
     */
    stopBGM: function () {
        cc.audioEngine.stopAll();
    },

    /**
     * 暂停
     */
    pauseAll: function () {
        cc.audioEngine.pauseAll();
    },

    /**
     * 继续播放
     */
    resumeAll: function () {
        cc.audioEngine.resumeAll();
    },
});
