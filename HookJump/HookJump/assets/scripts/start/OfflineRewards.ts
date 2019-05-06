import Cache from "../common/Cache";
import { CacheType } from "../common/Enum";

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
export default class NewClass extends cc.Component {

    /**
     * @property 金币数
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 获取时间戳
     */
    private Time: Date = null;

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
        this.Coin_Num = this.node.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label);

        this.Time = new Date();

        this.GetTime();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        this.node.active = false;
    }

    /**
     * 获取离线时间
     */
    private GetTime() {
        let year = this.Time.getFullYear();
        let month = this.Time.getMonth();
        let day = this.Time.getDate();
        let hours = this.Time.getHours();
        let now_time = "" + year + month + day + hours;
        let last_time = Cache.GetCache(CacheType.Last_Time);
        if (last_time) {
            if (last_time != now_time) {
                let now_time_num = parseInt(now_time);
                let last_time_num = parseInt(last_time);
                let time_value = Math.abs(now_time_num - last_time_num);
                if (time_value > 72) {
                    time_value = 72;
                }
                time_value *= 15;
                this.Coin_Num.string = "" + time_value;
                let coin = Cache.GetCache(CacheType.Coin);
                let coin_num = parseInt(coin);
                let sum = time_value + coin_num;
                Cache.SetCache(CacheType.Coin, sum + "");
                return;
            }
        }
        this.Coin_Num.string = 0 + "";
    }
}
