import Cache from "./Cache";
import { CacheType, EventType, SoundType } from "./Enum";
import Start from "../Start";
import EventListenter from "./EventListenter";
import StartAudio from "../start/StartAudio";
import WX from "./WX";

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
export default class RoleShop extends cc.Component {

    /**
     * @property 金币数
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 碎片数
     */
    private Fragment: cc.Label = null;
    /**
     * @property 购买提示
     */
    private Hint_Buy: cc.Node = null;
    /**
     * @property 金币提示
     */
    private Hint_Coin: cc.Node = null;
    /**
     * @property 商品
     */
    private Commodity: cc.Node = null;
    /**
     * @property 点击开关
     */
    private Hint_Switch: boolean = false;
    /**
     * @property 主脚本
     */
    private Start: Start = null;
    /**
     * @property [Array]商品
     */
    private Commoditys: cc.Node[] = [];
    /**
     * @property [Array]已购买商品
     */
    private Pur_CommodityIDs: string[] = [];

    onLoad() {
        // this.Init();
    }

    start() {

    }

    update(dt) {

    }

    /**
     * 初始化
     */
    Init() {
        this.Commoditys = this.node.getChildByName("Shop").getChildByName("view").getChildByName("content").children;
        this.Coin_Num = this.node.parent.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label);
        this.Fragment = this.node.parent.getChildByName("Fragment").getChildByName("frag_label").getComponent(cc.Label);
        this.Hint_Buy = this.node.getChildByName("Hint_Buy");
        this.Hint_Coin = this.node.getChildByName("Hint_Coin");
        this.Start = cc.find("Canvas").getComponent(Start);

        this.Hint_Switch = true;
        //开启默认角色
        this.Pur_CommodityIDs = ["1"];

        this.GetCache(this.Pur_CommodityIDs, this.Coin_Num);
        this.InitCommodityState(this.Pur_CommodityIDs, this.Commoditys);

        // EventListenter.AddListenter(EventType.Update_Coin, () => {
        //     this.UpdateCoin();
        // });
    }

    /**
     * 获取缓存
     */
    private GetCache(pur_commodity_ids: string[], coin_num: cc.Label) {
        //获取已购买缓存
        let pur_commodity_id = Cache.GetCache(CacheType.Pur_Role);
        if (pur_commodity_id) {
            for (let i = 0; i < pur_commodity_id.length; i++) {
                let pur_char = pur_commodity_id.charAt(i);
                if (pur_char != ",") {
                    pur_commodity_ids.push(pur_char);
                }
            }
        }

        // //获取金币缓存
        // let sum = Cache.GetCache(CacheType.Coin);
        // if (sum) {
        //     coin_num.string = sum;
        // } else {
        //     coin_num.string = 0 + "";
        //     Cache.SetCache(CacheType.Coin, 0 + "");
        //     EventListenter.Broadcast(EventType.Update_Coin);
        // }
    }

    /**
     * 初始化商品状态
     * @param pur_commodity_ids [Array]已购买商品ID
     * @param commoditys [Array]商品
     */
    private InitCommodityState(pur_commodity_ids: string[], commoditys: cc.Node[]) {
        for (let i = 0; i < commoditys.length; i++) {
            for (let j = 0; j < pur_commodity_ids.length; j++) {
                if (commoditys[i].name === pur_commodity_ids[j]) {
                    commoditys[i].getChildByName("buy").active = false;
                    let skin_id = Cache.GetCache(CacheType.Role_SkinId);
                    if (commoditys[i].name === skin_id) {
                        commoditys[i].getChildByName("selection").active = true;
                        commoditys[i].getChildByName("buy_coin").active = false;
                        this.Start.Role.UpdateSkin(skin_id);
                    } else {
                        commoditys[i].getChildByName("selection").active = false;
                        commoditys[i].getChildByName("buy_coin").active = false;
                    }
                }
            }
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
                // WX.BannerShow();
                WX.BannerCreator("game");
                this.node.active = false;
                return;
            case "yes":
                let isbuy = this.BuyCommodity(this.Commodity);
                if (!isbuy) {
                    if (this.Hint_Switch) {
                        this.Hint_Switch = false;
                        this.CoinHintShow(this.Hint_Coin);
                        //延时点击
                        this.scheduleOnce(() => {
                            this.Hint_Switch = true;
                        }, 2);
                    }
                    return
                }
                //缓存金币
                Cache.SetCache(CacheType.Coin, this.Coin_Num.string);

                this.Pur_CommodityIDs.push(this.Commodity.name);
                let pur_str = this.Pur_CommodityIDs.toString();
                //缓存已购买商品ID
                Cache.SetCache(CacheType.Pur_Role, pur_str);
            case "no":
                this.Hint_Buy.active = false;
                return;
            default:
                break;
        }
        //获取商品
        this.Commodity = this.GetCommoditys(this.Commoditys, click);
        //是否需要购买
        let isneedbuy = this.Commodity.getChildByName("buy").active;
        if (isneedbuy) {
            //购买提示
            this.Hint_Buy.active = true;
        } else {
            //选中商品
            this.SelectionCommodity(click, this.Commoditys);
            this.Start.Role.UpdateSkin(click);
            Cache.SetCache(CacheType.Role_SkinId, click);
        }
    }

    /**
     * 获取商品
     * @param commoditys [Array]商品
     * @param commodity_id 商品ID
     * @returns 商品
     */
    private GetCommoditys(commoditys: cc.Node[], commodity_id: string): cc.Node {
        for (let i = 0; i < commoditys.length; i++) {
            if (commoditys[i].name === commodity_id) {
                return commoditys[i];
            }
        }
    }

    /**
     * 购买商品
     * @param commodity 商品
     * @param coin_num 金币数
     * @returns 是否购买成功
     */
    private BuyCommodity(commodity: cc.Node, ): boolean {
        //缓存金币数
        let coin_num = Cache.GetCache(CacheType.Coin);
        let num = parseInt(coin_num);

        let fra_num = Cache.GetCache(CacheType.FragmentNum);
        let fra_int = parseInt(fra_num);
        switch (commodity.name) {
            case "1":
            case "3":
            case "4":
                if (num >= 2000) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    num -= 2000;
                    this.Coin_Num.string = num + "";
                    Cache.SetCache(CacheType.Coin, num + "");
                    return true;
                }
                break;
            case "6":
                if (num >= 5000) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    num -= 5000;
                    this.Coin_Num.string = num + "";
                    Cache.SetCache(CacheType.Coin, num + "");
                    return true;
                }
                break;
            case "5":
                if (fra_int >= 20) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    fra_int -= 20;
                    this.Fragment.string = fra_int + "";
                    Cache.SetCache(CacheType.FragmentNum, fra_int + "");
                    return true;
                }
                break;
            case "2":
                if (fra_int >= 40) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    fra_int -= 40;
                    this.Fragment.string = fra_int + "";
                    Cache.SetCache(CacheType.FragmentNum, fra_int + "");
                    return true;
                }
                break
            case "7":
                if (fra_int >= 50) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    fra_int -= 50;
                    this.Fragment.string = fra_int + "";
                    Cache.SetCache(CacheType.FragmentNum, fra_int + "");
                    return true;
                }
                break;
            case "8":
                if (fra_int >= 80) {
                    commodity.getChildByName("buy").active = false;
                    commodity.getChildByName("buy_coin").active = false;
                    fra_int -= 80;
                    this.Fragment.string = fra_int + "";
                    Cache.SetCache(CacheType.FragmentNum, fra_int + "");
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    }

    /**
     * 金币提醒显示
     * @param hint 金币提醒
     */
    private CoinHintShow(hint: cc.Node) {
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

    /**
     * 选中商品
     * @param skin_id 皮肤ID
     * @param commoditys [Array]商品
     */
    private SelectionCommodity(skin_id: string, commoditys: cc.Node[]) {
        for (let i = 0; i < commoditys.length; i++) {
            if (commoditys[i].name != skin_id) {
                commoditys[i].getChildByName("selection").active = false;
            } else {
                commoditys[i].getChildByName("selection").active = true;
            }
        }
    }

    /**
     * 更新金币
     */
    UpdateCoin() {
        let coin = Cache.GetCache(CacheType.Coin);
        this.Coin_Num.string = coin;
    }
}
