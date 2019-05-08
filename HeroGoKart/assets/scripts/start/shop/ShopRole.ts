import EventCenter from "../../commont/EventCenter";
import { EventType, CacheType } from "../../commont/Enum";
import Cache from "../../commont/Cache";

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
     * @property 当前角色ID
     */
    private Current_Role_ID: string = null;
    /**
     * @property 金币Label
     */
    private Label_Coin: cc.Label = null;
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
        this.Label_Coin = this.node.getChildByName("Current_Coin").getChildByName("label").getComponent(cc.Label);
        this.Commoditys = this.node.getChildByName("Shop").children;
        this.HaveCommodityIDs = ["1"];
        this.Current_Role_ID = this.GetCurrentRoleID();

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
        switch (click) {
            case "back":
                EventCenter.Broadcast(EventType.ShopColse_Role);
                break;
            default:
                break;
        }
    }

    /**
     * 商品按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private CommodityButtonClick(lv: any, click: string) {
        console.log(click);

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
}
