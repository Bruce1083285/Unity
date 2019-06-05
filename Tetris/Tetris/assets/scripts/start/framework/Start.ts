import { ViewManager_Start } from "./ViewManager_Start";
import { Cache } from "../../commont/Cache";
import { CacheType } from "../../commont/Enum";

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
export default class Start extends cc.Component {

    /**
     * @property 模式父节点
     */
    private Mode: cc.Node = null;
    /**
     * @property 提示框--->金币不足
     */
    private Hint_Coin: cc.Node = null;
    /**
     * @property 金币不租弹框初始位置
     */
    private HintBox_Coin_StartPos: cc.Vec2 = null;
    /**
     * @property 金币label
     */
    private Labe_Coin: cc.Label = null;
    /**
     * @property 当前模式ID
     */
    private Current_Mode_ID: string = null;
    /**
     * @property 模式费用
     */
    private Mode_Cost: any[] = [
        {
            Mode: "1v1",
            Cost: 200,
        },
        {
            Mode: "1v10",
            Cost: 400,
        },
        {
            Mode: "1v50",
            Cost: 1000,
        },
    ]

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
        this.Mode = this.node.getChildByName("Mode");
        this.Labe_Coin = this.node.getChildByName("Box_Coin").getChildByName("labe").getComponent(cc.Label);
        this.Hint_Coin = this.node.getChildByName("Hint_Coin");
        this.HintBox_Coin_StartPos = this.Hint_Coin.position;

        this.GetCoinCache();
    }

    /**
     * 获取金币缓存
     */
    private GetCoinCache() {
        let coin = Cache.GetCache(CacheType.Coin);
        coin = "10000"
        if (!coin) {
        }
        this.Labe_Coin.string = coin;
        Cache.SetCache(CacheType.Coin, coin);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "begin":
                this.BeginGame();
                break;
            default:
                this.SelectModeShow(this.Mode, click);
                break;
        }
    }

    /**
     * 开始游戏
     */
    private BeginGame() {
        if (!this.Current_Mode_ID) {
            return
        }
        // console.log(this.Current_Mode_ID);
        this.Current_Mode_ID = "1v1";
        let num: number = 0;
        for (let i = 0; i < this.Mode_Cost.length; i++) {
            let obj = this.Mode_Cost[i];
            if (obj.Mode === this.Current_Mode_ID) {
                num = obj.Cost;
                break;
            }
        }
        let coin = Cache.GetCache(CacheType.Coin);
        let coin_num: number = 0;
        if (coin) {
            coin_num = parseInt(coin);
        }
        if (coin_num < num) {
            this.CommontCoinPopup();
            return
        }
        let value: number = coin_num - num;
        if (value <= 0) {
            value = 0;
        }
        Cache.SetCache(CacheType.Coin, value + "");

        cc.director.loadScene(this.Current_Mode_ID);
    }

    /**
     * 被选中模式显示
     * @param mode 模式父节点
     * @param mode_id 对应模式ID
     */
    private SelectModeShow(mode: cc.Node, mode_id: string) {
        ViewManager_Start.Instance.SelectModeShow(mode, mode_id);
        this.Current_Mode_ID = mode_id;
    }


    /**
     * 通用购买金币不足弹出
     */
    private CommontCoinPopup() {
        if (this.Hint_Coin.active) {
            this.Hint_Coin.stopAllActions();
            this.Hint_Coin.setPosition(this.HintBox_Coin_StartPos);
        } else {
            this.Hint_Coin.active = true;
            // this.HintBox_Coin_StartPos = this.Hint_Coin.position;
        }
        this.Hint_Coin.scale = 0;
        this.Hint_Coin.opacity = 255;
        let Act_scale = cc.scaleTo(0.5, 1);
        let Act_moveTop = cc.moveBy(0.5, 0, 100);
        let Act_hide = cc.fadeOut(0.5);
        let Act_spawn = cc.spawn(Act_moveTop, Act_hide);
        let Act_sequence = cc.sequence(Act_scale, Act_spawn);
        this.Hint_Coin.runAction(Act_sequence);
    }
}
