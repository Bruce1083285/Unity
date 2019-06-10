function initMgr() {
    window.Tools = require('Tools');
    window.GameConfig = require('GameConfig');
    window.HandleMgr = new (require("HandleMgr"));              // 处理事件的类 
    window.MySocket = require('MySocket');                      // websocket
    window.Toast = require('Toast');                         // websocket
    window.HTTP = require('HTTP');                             // Toast
    window.AudioMgr = new (require('AudioMgr'));                // 音乐播放类
    window.UserMgr = new (require('UserMgr'));                  // 用户信息相关类

    AudioMgr.init();
    cc.vv = {};                                                 // 全局变量
}
cc.Class({
    extends: cc.Component,

    properties: {
        Node_Dialog: cc.Node,
        Node_Loading: cc.Node,
        Node_Reconnect: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        initMgr();
        if (!window.Dialog) {
            cc.game.addPersistRootNode(this.Node_Dialog);
            window.Dialog = this.Node_Dialog.getComponent('Dialog');
        }
        if (!window.Loading) {
            cc.game.addPersistRootNode(this.Node_Loading);
            window.Loading = this.Node_Loading.getComponent('Loading');
        }
        if (!window.Reconnect) {
            cc.game.addPersistRootNode(this.Node_Reconnect);
            window.Reconnect = this.Node_Reconnect.getComponent('Reconnect');
        }
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState == 'hidden') {
                console.log('hide');
                HandleMgr.sendHandle('game_hide');
                cc.audioEngine.pauseAll();
            } else {
                console.log('show');
                HandleMgr.sendHandle('game_show');
                cc.audioEngine.resumeAll();
            }
        });
    },

    start() {

    },

    onBtnClicked(event, data) {
        
    },

    // update (dt) {},
});
