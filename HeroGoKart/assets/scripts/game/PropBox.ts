import { EventCenter } from "../commont/EventCenter";
import { EventType } from "../commont/Enum";
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
    private Fra_InitiativeProp: cc.SpriteFrame[] = [];
    /**
     * @property 游戏类
     */
    private Game: Game = null;
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
     * @property 道具盒子
     */
    private Props: cc.Node[] = [];

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.getComponent(Game);
        this.BananaSkin = new BananaSkin(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Bomb = new Bomb(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.ClownGift = new ClownGift(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.WaterPolo = new WaterPolo(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Frozen = new Frozen(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Protection = new Protection(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.SpeedUp = new SpeedUp(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Mangnet = new Magnet(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Lightning = new Lightning(this.Fra_InitiativeProp, this.Game.Pool_Prop);

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
        this.Extract();
        let prop: cc.Node = null;
        for (let i = 0; i < this.Props.length; i++) {
            prop = this.Props[i];
            if (click === prop.name) {
                break;
            }
        }

        let fra = prop.getComponent(cc.Sprite);
        if (!fra) {
            return;
        }

        //使用道具
        let prop_name = fra.spriteFrame.name;
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
            default:
                break;
        }
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
        let srpite = prop.getComponent(cc.Sprite);
        let ran = Math.floor(Math.random() * this.Fra_InitiativeProp.length);
        this.ExtractProp(srpite, 0.5, ran, this.Fra_InitiativeProp, -0.05, 0);
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
        if (count >= 50) {
            value = 0.05;
            count = 0;
        }

        //减速
        if (dt > 0.5) {
            return
        }
        if (index >= fra_props.length) {
            index = 0;
        }
        let callback = () => {
            this.ExtractProp(srpite, dt, index, this.Fra_InitiativeProp, value, count);
        }
        this.scheduleOnce(callback, dt);
    }
}
