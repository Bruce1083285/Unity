import { GameManager } from "../../commont/GameManager";
import { Cache } from "../../commont/Cache";
import { CacheType, EventType } from "../../commont/Enum";
import { EventCenter } from "../../commont/EventCenter";

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
export default class PageOver extends cc.Component {

    /**
     * @property 背景--->胜利
     */
    private BG_Win: cc.Node = null;
    /**
     * @property 背景--->失败
     */
    private BG_Failure: cc.Node = null;
    /**
     * @property 金币label
     */
    private Label_Coin: cc.Label = null;
    /**
     * @property 玩家是否胜利
     */
    public IsPlayerWin: boolean = false;

    onLoad() {

    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.BG_Win = this.node.getChildByName("BG").getChildByName("bg_Win");
        this.BG_Failure = this.node.getChildByName("BG").getChildByName("bg_Failure");
        this.Label_Coin = this.node.getChildByName("Coin").getChildByName("label").getComponent(cc.Label);

        this.AddListenter();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "back":
                cc.director.loadScene("Start");
                break
            case "restart":
                cc.director.loadScene("1v1");
                break
            default:
                break;
        }
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        /**设置结束页 */
        EventCenter.AddListenter(EventType.SetPageOver, (isPlayerWin: boolean) => {
            this.IsPlayerWin = isPlayerWin;
            this.SetPageOver();
        }, "PageOver");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        /**设置结束页 */
        EventCenter.RemoveListenter(EventType.SetPageOver, "PageOver");
    }

    /**
     * 设置结束页
     */
    private SetPageOver() {
        this.node.active = true;
        
        if (this.IsPlayerWin) {
            this.SetWin();
            return;
        }
        this.SetFailure();
    }

    /**
     * 设置胜利
     */
    private SetWin() {
        this.BG_Win.active = true;
        this.BG_Failure.active = false;
        this.Label_Coin.string = "+200";
        let coin = Cache.GetCache(CacheType.Coin);
        let sum: number = 0;
        if (coin) {
            let num = parseInt(coin);
            sum = num + 200;
        }
        Cache.SetCache(CacheType.Coin, sum + "");
    }

    /**
     * 设置失败
     */
    private SetFailure() {
        this.BG_Win.active = false;
        this.BG_Failure.active = true;
        this.Label_Coin.string = "-200";
        let coin = Cache.GetCache(CacheType.Coin);
        let sum: number = 0;
        if (coin) {
            let num = parseInt(coin);
            sum = num - 200;
            if (sum <= 0) {
                sum = 0;
            }
        }
        Cache.SetCache(CacheType.Coin, sum + "");
    }
}
