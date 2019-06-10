// import { Http2SecureServer } from "http2";

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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    loadData() {
        HTTP.sendRequest('Hall/LookBone', (data) => {
            if (data.status == 0) {
                return;
            }
            this.initView(data.data);
        }, { uid: DataHelper.Uid });
    },
    initView(data) {
        for (let i = 1; i <= 10; i++) {
            let key = 'bone' + i;
            let value = data[key];
            let array = JSON.parse(value);
            let itemNode = cc.find('content/suipian_' + i, this.node);
            let count = 0;
            for (let j = 0; j < array.length; j++) {
                const element = array[j];
                if (element == 1) {
                    count++;
                    cc.find('sp_' + (j + 1), itemNode).color = cc.color(255, 255, 255);
                } else {
                    cc.find('sp_' + (j + 1), itemNode).color = cc.color(0, 0, 0);
                }
            }
            GameTools.removeEvent(itemNode);
            if (count == 4 && data.award[i - 1] == 0) {
                GameTools.addEvent(itemNode, () => {
                    HTTP.sendRequest('Hall/getAward', (data) => {
                        if (data.status == 0) {
                            return;
                        }
                        ViewHelper.showRewardNode(GameConfig.Reward_Type.Money, 1000);
                        this.loadData();
                    })
                });
            }
        }
    },

    close(){
        this.node.active = false;
    },
    start() {

    },

    onEnable() {
        this.loadData();
    },
    // update (dt) {},
});
