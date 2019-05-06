import Cache from "./Cache";
import { CacheType, EventType, SoundType } from "./Enum";
import EventListenter from "./EventListenter";
import WX from "./WX";
import StartAudio from "../start/StartAudio";

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
export default class Share extends cc.Component {

    /**
     * @property 领取提示
     */
    @property(cc.Node)
    private Receive_Hint: cc.Node = null;
    /**
     * @property 领取次数label
     */
    @property(cc.Label)
    private Receive_Count_Label: cc.Label = null;
    /**
     * @property 弹窗提示
     */
    private Hint: cc.Node = null;
    /**
     * @property 领取
     */
    private Receive: cc.Button = null;
    /**
     * @property 分享次数
     */
    private Share_Count: number = 5;
    /**
     * @property 金币数
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 金币提醒
     */
    private Hint_Coin: cc.Node = null;
    /**
     * @property 点击开关
     */
    private Share_Switch: boolean = false;
    /**
     * @property 实例化时间戳
     */
    private Time: Date = null;

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
        this.Coin_Num = this.node.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label);
        this.Receive = this.node.getChildByName("but_Receive").getComponent(cc.Button);
        this.Hint = this.node.getChildByName("Hint");
       

        this.Share_Switch = true;
        this.Time = new Date();

        // this.GetReceiveCount();
        this.GetShareCount();
    }

    /**
     * 获取领取缓存
     */
    private GetReceiveCount() {
        let rece_count = Cache.GetCache(CacheType.Share_Count);
        if (rece_count) {
            this.Share_Count = parseInt(rece_count);
            this.Receive_Count_Label.string = this.Share_Count + "";
        } else {
            this.Share_Count = 5;
            this.Receive_Count_Label.string = this.Share_Count + "";
        }
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                this.node.active = false;
                break;
            case "share":
                //微信分享
                // WX.Share();
                // let istrue = true;
                // let callFunc = () => {
                //     if (this.CanShare() && istrue) {
                //         this.ButtonInteractable(this.Receive, true);
                //         istrue = false;
                //     }
                // }
                // WX.OnShow(callFunc);
                // if (this.CanShare()) {
                //     this.ButtonInteractable(this.Receive, true);
                // } else {
                //     // if (this.Share_Switch) {
                //     //     this.Share_Switch = false;
                //     //     this.HintShow(this.Hint);
                //     //     this.scheduleOnce(() => {
                //     //         this.Share_Switch = true;
                //     //     }, 2);
                //     // }
                // }
                let istrue = true;
                let callFunc = () => {
                    // if (istrue) {
                    if (this.Share_Count > 0) {
                        this.ButtonInteractable(this.Receive, true);
                    } else {
                        this.Receive_Count_Label.string = 0 + "";
                    }

                    // istrue = false;
                    // }
                }
                WX.Share(callFunc);
                // WX.OnShow(callFunc);

                break;
            case "receive":
                this.Receive_Hint.active = true;
                this.Share_Count--;
                this.Receive_Count_Label.string = this.Share_Count + "";
                Cache.SetCache(CacheType.Share_Count, this.Share_Count + "");
                let coin_sum = Cache.GetCache(CacheType.Coin);
                if (!coin_sum) {
                    coin_sum = 0 + "";
                }
                let sum = this.ReceiveCoin(this.Coin_Num.string, coin_sum);
                Cache.SetCache(CacheType.Coin, sum);
                // EventListenter.Broadcast(EventType.Update_Coin);
                this.ButtonInteractable(this.Receive, false);
                break;
            case "receive_close":
                this.Receive_Hint.active = false;
                break;
            default:
                break;
        }
    }
    /**
     * 领取金币
     * @param coin_num 领取金币数
     * @param coin_sum 金币总数
     */
    private ReceiveCoin(coin_num: string, coin_sum: string): string {
        let sum = parseInt(coin_num) + parseInt(coin_sum);
        return sum + "";
    }

    /**
     * 按钮是否禁用
     * @param button 按钮
     * @param isInte 是否禁用
     */
    private ButtonInteractable(button: cc.Button, isInte: boolean) {
        button.interactable = isInte;
    }

    /**
    * 领取次数提醒显示
    * @param hint 领取次数提醒
    */
    private HintShow(hint: cc.Node) {
        if (hint.active) {
            hint.stopAllActions()
        }
        hint.active = true;
        hint.opacity = 255;
        let pos = hint.position;
        hint.scale = 0.1;
        let show = cc.scaleTo(1, 1, 1);
        let move_up = cc.moveBy(1, 0, 100);
        let hide = cc.fadeOut(1);
        let close = cc.callFunc(() => {
            hint.active = false;
            hint.setPosition(pos);
        });
        hint.runAction(cc.sequence(show, cc.spawn(move_up, hide), close));
    }

    private CanShare() {
        let year = this.Time.getFullYear();
        let month = this.Time.getMonth();
        let day = this.Time.getDate();
        let now_time = "" + year + month + day;

        let num = cc.sys.localStorage.getItem(now_time);
        cc.log('sharenum----->' + num);
        if (!num) {
            // this.Share_Count = 5;
            // this.Receive_Count_Label.string = this.Share_Count + "";
            cc.sys.localStorage.setItem(now_time, '1');
            return true;
        } else {
            num = parseInt(num) + 1;
            cc.sys.localStorage.setItem(now_time, num + '');
            if (num > 5) {
                return false;
            }
            return true;
        }
    }

    /**
     * 获取分享次数
     */
    private GetShareCount() {
        let year = this.Time.getFullYear();
        let month = this.Time.getMonth();
        let day = this.Time.getDate();
        let now_time = "" + year + month + day;
        let last_time = Cache.GetCache(CacheType.Last_Receive_Time);
        let share_count = Cache.GetCache(CacheType.Share_Count);
        if (last_time) {
            if (now_time != last_time) {
                this.Share_Count = 5;
                this.Receive_Count_Label.string = this.Share_Count + "";
            } else {
                this.Share_Count = parseInt(share_count);
                this.Receive_Count_Label.string = share_count;
            }
        } else {
            this.Share_Count = 5;
        }
        Cache.SetCache(CacheType.Last_Receive_Time, now_time);
        Cache.SetCache(CacheType.Share_Count, this.Share_Count + "");
    }
}
