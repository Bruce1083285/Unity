import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import StartAudio from "./StartAudio";
import WX from "../common/WX";
import RoleShop from "../common/RoleShop";
import HookShop from "./HookShop";
const sdk = require("../common/sdk")

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
export default class HFExchange extends cc.Component {

    /**
     * @property 钩子商城
     */
    private Shop_Hook: cc.Node = null;
    /**
     * @property 角色商城
     */
    private Shop_Role: cc.Node = null;
    /**
     * @property 话费商城
     */
    private Shop_HF: cc.Node = null;
    /**
     * @property 提醒
     */
    private Hint: cc.Node = null;
    /**
     * @property 提醒_1
     */
    private Hint_1: cc.Node = null;
    /**
     * @property 1元话费兑换按钮
     */
    private but_Exchange_1: cc.Button = null;
    /**
    * @property 20元话费兑换按钮
    */
    private but_Exchange_20: cc.Button = null;
    /**
     * @property 话费兑换数额
     */
    private Exchange_Num: number = 0;
    /**
     * @property 兑换开关
     */
    private Exchange_Switch: boolean = true;
    /**
     * @property 金币数
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 碎片数
     */
    private Fragment_Num: cc.Label = null;

    onLoad() {
        // this.Init()
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {

        this.Coin_Num = this.node.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label);
        this.Fragment_Num = this.node.getChildByName("Fragment").getChildByName("frag_label").getComponent(cc.Label);
        this.Hint = this.node.getChildByName("Hint");
        this.Hint_1 = this.node.getChildByName("Hint_1");
        this.but_Exchange_1 = this.node.getChildByName("HFShop").getChildByName("content_1").getChildByName("but_Exchange").getComponent(cc.Button);
        this.but_Exchange_20 = this.node.getChildByName("HFShop").getChildByName("content_2").getChildByName("but_Exchange").getComponent(cc.Button);
        this.Shop_HF = this.node.getChildByName("HFShop");
        this.Shop_Hook = this.node.getChildByName("HookShop");
        this.Shop_Role = this.node.getChildByName("RoleShop");

        this.node.active = true;
        this.but_Exchange_1.interactable = false;
        this.but_Exchange_20.interactable = false;
        this.Shop_HF.active = true;
        this.Shop_Hook.active = false;
        this.Shop_Role.active = false;

        this.GetCache(this.Coin_Num);
        this.Shop_Hook.getComponent(HookShop).Init();
        this.Shop_Role.getComponent(RoleShop).Init();
    }

    /**
     * 获取缓存
     * @param coin_num 金币数
     */
    private GetCache(coin_num: cc.Label) {
        // Cache.SetCache(CacheType.Coin, "10000");
        let coin = Cache.GetCache(CacheType.Coin);
        // console.log("金币——————》1：" + coin);
        // let a = parseInt(coin);
        // console.log("金币——————》3：" + a);
        // console.log(typeof (a));
        if (coin === "NaN" || coin === null || coin === "" || coin === undefined || coin === "undefine" || coin === "null") {
            coin = "0";
        }
        coin_num.string = coin;
        // console.log("金币——————》2：" + coin);
        // coin = "200000"
        let coin_count = parseInt(coin);
        if (coin_count >= 10000) {
            this.but_Exchange_1.interactable = true;
        }
        if (coin_count >= 100000) {
            // this.but_Exchange_20.interactable = true;
        }

        let frag_num = Cache.GetCache(CacheType.FragmentNum);
        if (frag_num) {
            this.Fragment_Num.string = frag_num;
        } else {
            this.Fragment_Num.string = "0";
        }
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                this.node.active = false;
                break;
            case "hint_close":
                this.Hint.active = false;
                break;
            case "hint_1_close":
                this.Hint_1.active = false;
                break;
            case "1":
                this.Hint_1.active = true;
                this.Exchange_Num = 1;
                // this.PlayAdvertisement(1);
                break;
            case "20":
                this.Hint_1.active = true;
                this.Exchange_Num = 20;
                // this.PlayAdvertisement(20);
                break;
            case "hint_1_yes":
                if (this.Exchange_Switch) {
                    this.Exchange_Switch = false;
                    // this.Hint_1.active = false;
                    this.PlayAdvertisement(1);
                }
                break;
            case "hint_1_no":
                this.Hint_1.active = false;
                break;
            case "exchange":
                this.ExchangeHF();
                break;
            case "exchange_close":
                this.Hint.active = false;
                break;
            case "role_open":
                this.Shop_HF.active = false;
                this.Shop_Hook.active = false;
                this.Shop_Role.active = true;
                break;
            case "hook_open":
                this.Shop_HF.active = false;
                this.Shop_Hook.active = true;
                this.Shop_Role.active = false;
                break;
            case "hf_open":
                this.Shop_HF.active = true;
                this.Shop_Hook.active = false;
                this.Shop_Role.active = false;
                break;
            default:
                break;
        }
    }

    /**
     * 播放广告
     * @param exchange_num 兑换值
     */
    private PlayAdvertisement(exchange_num: number) {
        if (WX.IsPlay) {
            cc.audioEngine.pauseAll();
            let istrue = true;
            let callFunc_yes = () => {
                if (istrue) {
                    this.Hint.active = true;
                    // this.Exchange_Num = exchange_num;
                    cc.audioEngine.resumeAll();
                    this.Exchange_Switch = true;
                    this.Hint_1.active = false;
                    istrue = false;
                }
            }
            let callFunc_no = () => {
                cc.audioEngine.resumeAll();
                this.Exchange_Switch = true;
            }
            WX.RewardedVideoClose(callFunc_yes, callFunc_no);
        } else {
            let istrue = true;
            let callFunc_yes = () => {
                // if (istrue) {
                this.Hint.active = true;
                // this.Exchange_Num = exchange_num;
                cc.audioEngine.resumeAll();
                this.Exchange_Switch = true;
                this.Hint_1.active = false;
                // istrue = false;
                // }
            }
            let callback_no = () => {
                this.Exchange_Switch = true;
            }
            WX.Share(callFunc_yes, callback_no);
            // WX.OnShow(callFunc_yes);
        }
    }

    /**
     * 兑换话费
     */
    private ExchangeHF() {
        if (this.Exchange_Num === 1) {
            let coin = Cache.GetCache(CacheType.Coin);
            let num = parseInt(coin) - 10000;
            Cache.SetCache(CacheType.Coin, num + "");
            this.GetCache(this.Coin_Num);
        }
        if (this.Exchange_Num === 20) {
            let coin = Cache.GetCache(CacheType.Coin);
            let num = parseInt(coin) - 100000;
            Cache.SetCache(CacheType.Coin, num + "");
            this.GetCache(this.Coin_Num);
        }
        if (WX.WX_Swtich) {
            // console.log("兑换值" + this.Exchange_Num);
            sdk.getCardPwd(this.Exchange_Num);
        }
        this.Hint.active = false;
    }
}
