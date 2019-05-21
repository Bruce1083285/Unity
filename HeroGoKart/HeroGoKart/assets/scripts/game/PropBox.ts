import { EventCenter } from "../commont/EventCenter";
import { EventType, SoundType } from "../commont/Enum";
import { PropUseing } from "./PropUseing";
import Game from "../Game";
import { BananaSkin } from "./propUseing/BananaSkin";
import { Bomb } from "./propUseing/Bomb";
import { WaterPolo } from "./propUseing/WaterPolo";
import { Frozen } from "./propUseing/Frozen";
import { Protection } from "./propUseing/Protection";
import { SpeedUp } from "./propUseing/SpeedUp";
import { ClownGift } from "./propUseing/ClownGift";
import { Magnet } from "./propUseing/Magnet";
import { Lightning } from "./propUseing/Lightning";
import { TranSpeedUp } from "./transportation/TranSpeedUp";
import { Transportation } from "./Transportation";
import { GameManage } from "../commont/GameManager";
import Player from "./Player";

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
export default class PropBox extends cc.Component {

    /**
      * @property [Array]道具
      */
    @property([cc.SpriteFrame])
    public Fra_InitiativeProp: cc.SpriteFrame[] = [];
    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 空投奖励--->超级加速卡
     */
    private TranSpeedUp: Transportation = null;
    /**
     * @property 香蕉皮
     */
    private BananaSkin: PropUseing = null;
    /**
     * @property 炸弹
     */
    private Bomb: PropUseing = null;
    /**
     * @property 小丑礼包
     */
    private ClownGift: PropUseing = null;
    /**
     * @property 水球
     */
    private WaterPolo: PropUseing = null;
    /**
     * @property 冰冻
     */
    private Frozen: PropUseing = null;
    /**
     * @property 保护罩
     */
    private Protection: PropUseing = null;
    /**
     * @property 加速
     */
    private SpeedUp: PropUseing = null;
    /**
     * @property 吸铁石
     */
    private Mangnet: PropUseing = null;
    /**
     * @property 雷击
     */
    private Lightning: PropUseing = null;
    /**
     * @property 道具盒子--->1是否可以点击
     */
    private IsBox_1: boolean = true;
    /**
     * @property 道具盒子--->2是否可以点击
     */
    private IsBox_2: boolean = true;
    /**
     * @property 道具盒子--->3是否可以点击
     */
    private IsBox_3: boolean = true;
    /**
     * @property 道具盒子
     */
    public Props: cc.Node[] = [];

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getChildByName("Page_Game").getComponent(Game);
        this.BananaSkin = new BananaSkin(this.Game.Pre_InitiativeProp, this.Game);
        this.Bomb = new Bomb(this.Game.Pre_InitiativeProp, this.Game);
        this.ClownGift = new ClownGift(this.Game.Pre_InitiativeProp, this.Game);
        this.WaterPolo = new WaterPolo(this.Game.Pre_InitiativeProp, this.Game);
        this.Frozen = new Frozen(this.Game.Pre_InitiativeProp, this.Game);
        this.Protection = new Protection(this.Game.Pre_InitiativeProp, this.Game);
        this.SpeedUp = new SpeedUp(this.Game.Pre_InitiativeProp, this.Game);
        this.Mangnet = new Magnet(this.Game.Pre_InitiativeProp, this.Game);
        this.Lightning = new Lightning(this.Game.Pre_InitiativeProp, this.Game);
        //---------->空投奖励
        this.TranSpeedUp = new TranSpeedUp(this.Game);

        this.Props = this.node.getChildByName("Prop").children;

        this.AddListenter();
        this.AddBoxPropButton(this.Props);
    }

    /**
    * 道具按钮点击
    * @param lv 
    * @param click 点击参数
    */
    private PropButtonClick(lv: any, click: string) {
        EventCenter.BroadcastOne(EventType.Sound, SoundType.Click);
        // let player = this.Game.Player.getComponent(Player);
        if (!GameManage.Instance.IsUseingProp || !GameManage.Instance.IsUpdateProgress) {
            return;
        }
        
        if (click === "1" && !this.IsBox_1) {
            return;
        }
        if (click === "2" && !this.IsBox_2) {
            return;
        }
        if (click === "3" && !this.IsBox_3) {
            return;
        }
        
        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            prop = this.Props[i];
            if (click === prop.name) {
                break;
            }
        }

        let spr = prop.getComponent(cc.Sprite);
        if (!spr.spriteFrame) {
            return;
        }

        let arr = this.Game.Player.getChildByName("Role").children;
        let role: cc.Node = null;
        for (let i = 0; i < arr.length; i++) {
            role = arr[i];
            if (role.active) {
                break;
            }
        }
        let dragon = role.getComponent(dragonBones.ArmatureDisplay)
        dragon.playAnimation("a8", 1);
        this.scheduleOnce(() => {
            dragon.playAnimation("a1", 0);
        }, 0.5);

        //使用道具
        let prop_name = spr.spriteFrame.name;
        switch (prop_name) {
            case "1":
                //香蕉皮
                this.BananaSkin.Useing(this.Game.Player, prop_name);
                break;
            case "2":
                //炸弹
                this.Bomb.Useing(this.Game.Player, prop_name);
                break;
            case "3":
                //小丑礼包
                this.ClownGift.Useing(this.Game.Player, prop_name);
                break;
            case "4":
                //水球
                this.WaterPolo.Useing(this.Game.Player, prop_name);
                break;
            case "5":
                //冰冻
                this.Frozen.Useing(this.Game.Player, prop_name);
                break;
            case "6":
                //保护罩
                this.Protection.Useing(this.Game.Player, prop_name);
                break;
            case "7":
                //加速
                EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
                this.SpeedUp.Useing(this.Game.Player, prop_name);
                break;
            case "8":
                //吸铁石
                this.Mangnet.Useing(this.Game.Player, prop_name);
                break;
            case "9":
                //雷击
                this.Lightning.Useing(this.Game.Player, prop_name);
                break;
            case "10":
                //超级加速卡
                EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
                this.TranSpeedUp.SetTransportation(this.Game.Player);
                break;
            default:
                break;
        }
        spr.spriteFrame = null;
    }

    /**
     * 道具盒子添加按钮组件
     * @param box_props [Array]道具盒子
     */
    private AddBoxPropButton(box_props: cc.Node[]) {
        for (let i = 0; i < this.Props.length; i++) {
            let prop = this.Props[i];
            let button = prop.addComponent(cc.Button);
            button.target = prop;

            //实例化点击事件回调
            let clickEventHandler = new cc.Component.EventHandler();
            //绑定脚本所属节点
            clickEventHandler.target = this.node;
            //绑定脚本文件名
            clickEventHandler.component = "PropBox";
            //绑定按钮点击的执行函数
            clickEventHandler.handler = "PropButtonClick";
            //绑定函数执行时传递的参数
            clickEventHandler.customEventData = prop.name;
            //将点击事件回调加入按钮点击事件列表中
            button.clickEvents.push(clickEventHandler);
        }
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //抽取道具
        EventCenter.AddListenter(EventType.Game_ExtractProp, () => {
            this.Extract();
        }, "PropBox");

        //清空道具盒子
        EventCenter.AddListenter(EventType.Game_ClearPropBox, () => {
            this.ClearPropBox();
        }, "Game");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        //抽取道具
        EventCenter.RemoveListenter(EventType.Game_ExtractProp, "PropBox");
    }

    /**
     * 抽取
     */
    private Extract() {
        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            prop = this.Props[i];
            let fra = prop.getComponent(cc.Sprite).spriteFrame;
            if (!fra) {
                break;
            } else {
                prop = null;
            }
        }
        if (!prop) {
            return;
        }
        if (prop.name === "1") {
            this.IsBox_1 = false;
        }
        if (prop.name === "2") {
            this.IsBox_2 = false;
        }
        if (prop.name === "3") {
            this.IsBox_3 = false;
        }
        let srpite = prop.getComponent(cc.Sprite);
        let ran = Math.floor(Math.random() * this.Fra_InitiativeProp.length);
        this.ExtractProp(srpite, 0.3, ran, this.Fra_InitiativeProp, -0.1, 0);
    }

    /**
     * 抽取道具
     * @param srpite 精灵
     * @param dt 持续时间
     * @param fra_props [Array]道具精灵帧
     * @param value 增减值
     */
    private ExtractProp(srpite: cc.Sprite, dt: number, index: number, fra_props: cc.SpriteFrame[], value: number, count: number) {
        let fra = fra_props[index];
        srpite.spriteFrame = fra;

        index++;

        dt += value;
        //加速
        if (dt <= 0.05) {
            dt = 0.05;
            value = 0;
            count++;
        }

        //持续恒速
        if (count >= 10) {
            value = 0.05;
            count = 0;
        }

        console.log(dt + "<-----持续时间值");
        //减速
        if (dt > 0.3) {
            console.log("是否跳出");
            if (srpite.node.name === "1") {
                this.IsBox_1 = true;
            }
            if (srpite.node.name === "2") {
                this.IsBox_2 = true;
            }
            if (srpite.node.name === "3") {
                this.IsBox_3 = true;
            }
            return
        }
        if (index >= fra_props.length - 1) {
            index = 0;
        }
        let callback = () => {
            this.ExtractProp(srpite, dt, index, this.Fra_InitiativeProp, value, count);
        }
        this.scheduleOnce(callback, dt);
    }

    /**
     * 清空道具盒子
     */
    private ClearPropBox() {
        this.unscheduleAllCallbacks();

        for (let i = 0; i < this.Props.length; i++) {
            let prop = this.Props[i];
            let spr = prop.getComponent(cc.Sprite);
            if (spr.spriteFrame) {
                spr.spriteFrame = null;
            }
        }
    }
}
