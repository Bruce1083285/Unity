import EventCenter from "../../commont/EventCenter";
import { EventType, CacheType } from "../../commont/Enum";
import Cache from "../../commont/Cache";
import PopupBox from "../../commont/PopupBox";

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
export default class ShopRole extends cc.Component {

    /**
     * @property 购买提示框
     */
    private HintBox_Buy: cc.Node = null;
    /**
     * @property 金币提示框
     */
    private HintBox_Coin: cc.Node = null;

    /**
     * @property 金币Label
     */
    private Label_Coin: cc.Label = null;
    /**
     * @property 是否可以点击
     */
    private IsClick: boolean = null;
    /**
     * @property 当前角色ID
     */
    private Current_Role_ID: string = null;
    /**
     * @property 准备购买的角色ID
     */
    private ReadyToBuy_ID: string = null;
    /**
     * @property [Array]商品
     */
    private Commoditys: cc.Node[] = [];
    /**
     * @property [Array]已购买商品ID
     */
    private HaveCommodityIDs: string[] = [];

    /**
     * 初始化
     */
    Init() {
        //金币购买提示框
        this.HintBox_Buy = this.node.getChildByName("HintBox_Buy");
        this.HintBox_Buy.active = false;
        //金币提示框
        this.HintBox_Coin = this.HintBox_Buy.getChildByName("HintBox_Coin");
        this.HintBox_Coin.active = false;
        this.Label_Coin = this.node.getChildByName("Current_Coin").getChildByName("label").getComponent(cc.Label);
        this.Label_Coin.string = this.GetCoinCache();
        this.Commoditys = this.node.getChildByName("Shop").children;
        this.HaveCommodityIDs = ["1"];
        this.Current_Role_ID = this.GetCurrentRoleID();
        this.IsClick = true;

        this.SetCommoditysStatus(this.Commoditys, this.HaveCommodityIDs, this.Current_Role_ID);
        this.AddButton(this.Commoditys);
    }

    /**
     * 显示节点
     */
    Show() {
        this.node.active = true;
    }

    /**
     * 关闭节点
     */
    Close() {
        this.node.active = false;
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        if (!this.IsClick) {
            return;
        }
        switch (click) {
            case "back":
                EventCenter.Broadcast(EventType.ShopColse_Role);
                break;
            case "yes":
                this.Yes();
                break;
            case "no":
                this.No();
                break;
            default:
                break;
        }
    }

    /**
     * Yes
     */
    private Yes() {
        let value = Cache.GetCache(CacheType.Coin_Amount);
        let coin_num = parseInt(value);
        //是否购买成功
        let isBuy = this.BuyCommodity(this.Commoditys, this.HaveCommodityIDs, this.ReadyToBuy_ID, coin_num);
        if (!isBuy) {
            //金币不足弹窗
            PopupBox.CommontCoinPopup(this.HintBox_Coin);
        }
    }

    /**
     * No
     */
    private No() {
        this.SetIsClick(false);
        PopupBox.CommontBuyBack(this.HintBox_Buy, () => {
            this.SetIsClick(true);
        });
    }

    /**
     * 商品按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private CommodityButtonClick(lv: any, click: string) {
        this.SetIsClick(false);
        console.log(click);
        for (let i = 0; i < this.Commoditys.length; i++) {
            let commodity = this.Commoditys[i];
            if (commodity.name === click) {
                //是否购买--->为true表示需要购买
                let isBuy = commodity.getChildByName("Coin").active;
                if (isBuy) {
                    //购买商品
                    //弹窗
                    PopupBox.CommontBuyPopup(this.HintBox_Buy, () => {
                        this.SetIsClick(true);
                    });
                    this.ReadyToBuy_ID = click;
                } else {
                    //选中商品
                    this.Current_Role_ID = this.SelectCommodity(this.Commoditys, click);
                    //更新角色皮肤
                }
                break;
            }
        }
    }

    /**
     * 购买商品
     * @param commoditys [Array]商品
     * @param havecommodityIDs [Array]已购买商品
     * @param readyTobuy_id 准备购买的商品ID
     * @param coin_value 金币值
     * @returns 是否购买成功
     */
    private BuyCommodity(commoditys: cc.Node[], havecommodityIDs: string[], readyTobuy_id: string, coin_value: number): boolean {
        for (let i = 0; i < commoditys.length; i++) {
            let commodity = commoditys[i];
            if (commodity.name === readyTobuy_id) {
                let price_str = commodity.getChildByName("Coin").getChildByName("label").getComponent(cc.Label).string;
                let price_value = parseInt(price_str);
                if (coin_value >= price_value) {
                    havecommodityIDs.push(commodity.name);
                    commodity.getChildByName("Coin").active = false;
                    let value = coin_value - price_value;
                    //缓存金币值
                    Cache.SetCache(CacheType.Coin_Amount, value + "");
                    return true;
                }
                return false;
            }
        }
    }

    /**
     * 选中商品
     * @param commoditys [Array]商品
     * @param select_id 选中的角色ID
     * @returns 当前角色ID
     */
    private SelectCommodity(commoditys: cc.Node[], select_id: string): string {
        for (let i = 0; i < commoditys.length; i++) {
            let commodity = commoditys[i];
            if (commodity.name === select_id) {
                commodity.getChildByName("InUse").active = true;
                return commodity.name;
            }
        }
    }

    /**
     * 添加按钮组件及点击事件回调
     * @param commoditys [Array]商品
     */
    private AddButton(commoditys: cc.Node[]) {
        for (let i = 0; i < commoditys.length; i++) {
            let commodity = commoditys[i];
            commodity.addComponent(cc.Button);
            let button = commodity.getComponent(cc.Button);
            button.target = commodity;

            //实例化点击事件回调
            let clickEventHandler = new cc.Component.EventHandler();
            //绑定脚本所属节点
            clickEventHandler.target = this.node;
            //绑定脚本文件名
            clickEventHandler.component = "ShopRole";
            //绑定按钮点击的执行函数
            clickEventHandler.handler = "CommodityButtonClick";
            //绑定函数执行时传递的参数
            clickEventHandler.customEventData = commodity.name;
            //将点击事件回调加入按钮点击事件列表中
            button.clickEvents.push(clickEventHandler);
        }
    }

    /**
     * 设置是否可以点击
     * @param isClick 是否点击
     */
    private SetIsClick(isClick: boolean) {
        this.IsClick = isClick;
    }

    /**
     * 设置商品状态
     * @param commoditys [Array]商品
     * @param havecommodityIDs [Array]已购买商品ID
     */
    private SetCommoditysStatus(commoditys: cc.Node[], havecommodityIDs: string[], current_role_id: string) {
        for (let i = 0; i < commoditys.length; i++) {
            let commodity = commoditys[i];
            for (let j = 0; j < havecommodityIDs.length; j++) {
                //使用中
                let inUse = commodity.getChildByName("InUse");
                //金币条件
                let coin = commodity.getChildByName("Coin");

                if (commodity.name === havecommodityIDs[i]) {
                    let isopen = false;
                    if (commodity.name === current_role_id) {
                        isopen = true;
                    }
                    inUse.active = isopen;
                    coin.active = false;
                } else {
                    inUse.active = false;
                    coin.active = true;
                }
            }
        }
    }

    /**
     * 获取当前角色ID
     * @returns 当前角色ID
     */
    private GetCurrentRoleID(): string {
        let role_id = Cache.GetCache(CacheType.Current_Role_ID);
        if (!role_id) {
            role_id = "1";
        }

        return role_id;
    }

    /**
     * 获取金币缓存
     * @returns 缓存的金币值
     */
    private GetCoinCache(): string {
        let value = Cache.GetCache(CacheType.Coin_Amount);
        if (!value) {
            value = "0";
            Cache.SetCache(CacheType.Coin_Amount, value);
        }

        return value;
    }
}
