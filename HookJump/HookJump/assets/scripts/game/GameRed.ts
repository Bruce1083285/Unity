import Cache from "../common/Cache";
import { CacheType } from "../common/Enum";
import Game from "../Game";

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
export default class GameRed extends cc.Component {

    /**
     * @property 金币数
     */
    private Red_Num: cc.Label = null;
    /**
     * @property 红包——1
     */
    private Red_1: cc.Node = null;
    /**
    * @property 红包——2
    */
    private Red_2: cc.Node = null;
    /**
     * @property 点击开关
     */
    private Click_Switch: boolean = true;

    onLoad() {
        // this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Red_1 = this.node.getChildByName("Red_1");
        this.Red_2 = this.node.getChildByName("Red_2");
        this.Red_Num = this.Red_2.getChildByName("red_num").getComponent(cc.Label);

        this.node.active = true;
        this.Red_1.active = true;
        this.Red_2.active = false;
        // this.Click_Switch = true;

        this.RedAction();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        // if (this.Click_Switch) {
        // if (click === "open") {
        //     this.Click_Switch = false;
        //     this.RedAction();
        // }
        if (click === "close") {
            this.node.active = false;
            cc.find("Canvas").getComponent(Game).SetDowSwitch(true);
        }
        // }
    }

    /**
     * 红包动作
     */
    private RedAction() {
        let dt = 0.05;
        let move_1 = cc.moveBy(dt, 10, 10);
        let move_2 = cc.moveBy(dt, -10, -10);
        let move_3 = cc.moveBy(dt, 10, 10);
        let move_4 = cc.moveBy(dt, -10, -10);
        let callbacks = cc.callFunc(() => {
            this.Red_1.active = false;
            //开红包
            this.OpenRed(this.Red_Num, this.Red_2);
            this.Click_Switch = true;
        });
        this.Red_1.runAction(cc.sequence(move_1, move_2, move_3, move_4, callbacks));
    }

    /**
     * 开红包
     * @param red_num 红包数
     * @param red_2 红包开启页
     */
    private OpenRed(red_num: cc.Label, red_2: cc.Node) {
        red_2.active = true;
        let red = Cache.GetCache(CacheType.Red_Num);
        let num = 0;
        let max_red = 0;
        let min_red = 0;
        if (red) {
            num = parseFloat(red);
        }
        if (num >= 0 && num < 12) {
            max_red = 0.7;
            min_red = 0.5;
        } else if (num >= 12 && num < 17) {
            max_red = 0.5;
            min_red = 0.2;
        }
        let ran_red = Math.random() * (max_red - min_red) + min_red;
        let ran_num = ran_red.toFixed(2);
        red_num.string = ran_num;
        let sum = ran_red + num;
        let sum_str = sum.toFixed(2);
        Cache.SetCache(CacheType.Red_Num, sum_str);
    }
}
