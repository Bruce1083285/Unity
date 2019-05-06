import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import Game from "../Game";
import WX from "../common/WX";
import GameAudio from "./GameAudio";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameShare extends cc.Component {

    /**
     * @property 差值金币数
     */
    private Coin_Lerp_Num: cc.Label = null;

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    Init() {
        this.Coin_Lerp_Num = this.node.getChildByName("content").getChildByName("coin_label").getComponent(cc.Label);

        this.node.active = true;

        this.GetCache(this.Coin_Lerp_Num);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                this.node.active = false;
                cc.find("Canvas").getComponent(Game).BackGame();
                break;
            case "share":
                let istrue = true;
                let callfunc = () => {
                    // if (istrue) {
                        this.node.active = false;
                        cc.find("Canvas").getComponent(Game).BackGame();
                        // istrue = false;
                    // }
                }
                WX.Share(callfunc);
                // WX.OnShow(callfunc);
                break;
            default:
                break;
        }
    }

    /**
     * 获取缓存
     * @param coin_lerp 金币差值
     */
    private GetCache(coin_lerp: cc.Label) {
        let coin = Cache.GetCache(CacheType.Coin);
        if (coin) {
            let coin_num = parseInt(coin);
            let lerp = 100000 - coin_num;
            coin_lerp.string = lerp + "";
        } else {
            coin_lerp.string = "100000";
        }
    }
}
