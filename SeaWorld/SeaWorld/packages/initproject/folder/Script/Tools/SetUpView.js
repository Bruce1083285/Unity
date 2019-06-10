
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    init() {
        this.refreshVolume();
        this.node.active = true;
    },

    // 切换音效/音乐大小
    onSlided: function (slider) {
        console.log('slider.progress------>'+slider.progress);
        if (slider.node.name == "yx") {
            AudioMgr.setSFXVolume(slider.progress);
        }
        else if (slider.node.name == "yy") {
           AudioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },

    onClose() {
        AudioMgr.playWithUrl('button');
        this.node.active = false;
    },

    jiesanOnclicked: function () {
        AudioMgr.playWithUrl('button');
        MySocket.send('CS_GAME_OutRoom', {});
    },

    //刷新控件的值
    refreshVolume: function () {
        // var yx = this.node.getChildByName("center").getChildByName("yx");
        this.yx_progress = this.node.getChildByName("center").getChildByName("yx");
        this.yx_progress.getComponent(cc.Slider).progress = AudioMgr.sfxVolume;

        // var yy = this.node.getChildByName("center").getChildByName("yy");
        this.yy_progress = this.node.getChildByName("center").getChildByName("yy");
        this.yy_progress.getComponent(cc.Slider).progress = AudioMgr.bgmVolume;
    },
    update(dt) {
        if (cc.vv && this.yx_progress && this.yy_progress) {
            this.yx_progress.getChildByName("progress").width = 327 * AudioMgr.sfxVolume;
            this.yy_progress.getChildByName("progress").width = 327 * AudioMgr.bgmVolume;
        }
    },
});
