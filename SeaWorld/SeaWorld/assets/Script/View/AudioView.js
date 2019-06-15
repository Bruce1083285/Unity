// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        //点击音效
        Click: cc.AudioClip,
        //点击音效
        BGM: cc.AudioClip,
        //点击音效
        Award: cc.AudioClip,

        //是否可以播放
        _IsPlay: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.Init();
    },

    // update (dt) {},

    Init() {
        this.AddListenter();
    },

    AddListenter() {
        //点击音效
        HandleMgr.addHandle('Audio_Click', (data) => {
            this.PlayClickSound();
        }, this);

        //奖励音效
        HandleMgr.addHandle('Audio_Award', (data) => {
            this.PlayAwardSound();
        }, this);

        //开启音效
        HandleMgr.addHandle('Audio_Open', (data) => {
            this._IsPlay = true;
            this.PlayBGM();
        }, this);

        //关闭音效
        HandleMgr.addHandle('Audio_Close', (data) => {
            this._IsPlay = false;
            this.StopBGM();
        }, this);
    },

    PlayBGM() {
        cc.audioEngine.play(this.BGM, true, 1);
    },

    StopBGM() {
        cc.audioEngine.stopAll();
    },

    PlayClickSound() {
        if (!this._IsPlay) {
            return
        }
        cc.audioEngine.play(this.Click, false, 1);

    },

    PlayAwardSound() {
        if (!this._IsPlay) {
            return
        }
        cc.audioEngine.play(this.Award, false, 1);
    }
});


// module.exports = AudioView;
