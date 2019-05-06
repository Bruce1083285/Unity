import { CacheType, SoundType } from "../common/Enum";
import Cache from "../common/Cache";
import WX from "../common/WX";
import StartAudio from "./StartAudio";

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
export default class NoviceGuide extends cc.Component {

    /**
     * @property 引导1
     */
    @property(cc.Node)
    private Novice_1: cc.Node = null;
    /**
     * @property 引导2
     */
    @property(cc.Node)
    private Novice_2: cc.Node = null;
    /**
     * @property 引导3
     */
    @property(cc.Node)
    private Novice_3: cc.Node = null;
    /**
     * @property 引导4
     */
    @property(cc.Node)
    private Novice_4: cc.Node = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Novice_4.active = true;
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "help_open":
                this.Novice_1.getChildByName("but_Help").active = false;
                this.Novice_1.getChildByName("Page_Help").active = true;
                break;
            case "help_close":
                this.Novice_1.getChildByName("Page_Help").active = false;
                this.NoviceShow(this.Novice_1, false);
                this.NoviceShow(this.Novice_3, true);
                break;
            case "rank_open":
                let level_num = Cache.GetCache(CacheType.Level_Num);
                if (level_num) {
                    WX.SetWxUpdateCache(level_num);
                } else {
                    WX.SetWxUpdateCache(0 + "");
                }
                this.Novice_2.getChildByName("but_Rank").active = false;
                this.Novice_2.getChildByName("Page_Rank").active = true;
                break;
            case "rank_close":
                this.Novice_2.getChildByName("Page_Rank").active = false;
                this.NoviceShow(this.Novice_2, false);
                this.NoviceShow(this.Novice_3, true);
                break;
            case "share_open":
                this.Novice_3.getChildByName("but_Share").active = false;
                this.Novice_3.getChildByName("Page_Share").active = true;
                break;
            case "share_close":
                this.Novice_3.getChildByName("Page_Share").active = false;
                this.NoviceShow(this.Novice_3, false);
                this.NoviceShow(this.Novice_4, true);
                break;
            case "start":
                cc.director.loadScene("Game");
                break;
            default:
                break;
        }
    }

    /**
     * 引导页显示
     * @param novice 引导页
     * @param isShow 是否显示
     */
    private NoviceShow(novice: cc.Node, isShow: boolean) {
        novice.active = isShow;
    }
}
