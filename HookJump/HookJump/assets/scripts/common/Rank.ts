import WX from "./WX";
import StartAudio from "../start/StartAudio";
import { SoundType, CacheType } from "./Enum";
import Cache from "./Cache";

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
export default class Rank extends cc.Component {

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                // WX.Login();
                // WX.BannerShow();
                WX.BannerCreator("game");
                let isaut = Cache.GetCache(CacheType.IsAuthorization);
                if (!isaut) {
                    WX.GetAuthorization();
                    if (isaut) {
                        // console.log("授权是否进入");
                        Cache.SetCache(CacheType.IsAuthorization, "true");
                    }
                }
                this.node.active = false;
                break;
            case "left":
                WX.PostMessage("direction", click);
                break;
            case "right":
                WX.PostMessage("direction", click);
                break;
            case "share":
                WX.Share();
                break;
            default:
                break;
        }
    }
}
