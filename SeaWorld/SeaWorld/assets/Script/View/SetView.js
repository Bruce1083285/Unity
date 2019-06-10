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
        Tog_Switch: cc.Toggle,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        let num = AudioMgr.getBGMVolume();
        if (num <= 0) {
            this.Tog_Switch.uncheck();
        } else {
            this.Tog_Switch.check();
        }
        cc.find('off', this.Tog_Switch.node).active = !this.Tog_Switch.isChecked;
        cc.find('on', this.Tog_Switch.node).active = this.Tog_Switch.isChecked;
    },

    onBtnClicked(){
        ViewHelper.showNodeWithName('KeFuNode');
    },

    onClicked() {
        cc.find('off', this.Tog_Switch.node).active = !this.Tog_Switch.isChecked;
        cc.find('on', this.Tog_Switch.node).active = this.Tog_Switch.isChecked;
        let num = this.Tog_Switch.isChecked ? 1 : 0;
        AudioMgr.setSFXVolume(num);
        AudioMgr.setBGMVolume(num);
    },
    // update (dt) {},
});
