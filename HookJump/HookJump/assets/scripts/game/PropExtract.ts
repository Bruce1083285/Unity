import { Prop, SoundType } from "../common/Enum";
import Game from "../Game";
import GameAudio from "./GameAudio";

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
export default class PropExtract extends cc.Component {

    /**
     * @property 道具精灵帧
     */
    @property([cc.SpriteFrame])
    private Prop_Sprites: cc.SpriteFrame[] = [];
    /**
     * @property 道具盒子精灵
     */
    @property(cc.SpriteFrame)
    private Prop_Box_Sprite: cc.SpriteFrame = null;
    /**
     * @property 钩子是否收回
     */
    public Hook_IsShrink: boolean = true;
    /**
     * @property 抽取道具开关
     */
    public Extract_Switch: boolean = false;
    /**
     * @property 提醒——》1
     */
    private Hint_1: cc.Node = null;
    /**
     * @property 提醒——》2
     */
    private Hint_2: cc.Node = null;
    /**
     * @property 道具盒子
     */
    public Prop_Box: cc.Node = null;
    /**
     * @property 游戏类
     */
    private Game: Game = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    Init() {
        this.Game = cc.find("Canvas").getComponent(Game);
        this.Prop_Box = this.node.getChildByName("but_box");
        this.Hint_1 = this.node.getChildByName("Hint_1");
        this.Hint_2 = this.node.getChildByName("Hint_2");

        // this.ExtractProp(300, 0, -50, 0, this.Prop_Sprites);
    }

    /**
     * 抽奖
     */
    Play() {
        this.Prop_Box.active = true;
        let ran_ind = Math.floor(Math.random() * this.Prop_Sprites.length);
        this.ExtractProp(300, ran_ind, -50, 0, this.Prop_Sprites);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        if (this.Extract_Switch && this.Hook_IsShrink) {
            this.Extract_Switch = false;
            let box = this.Prop_Box.getComponent(cc.Sprite).spriteFrame;
            if (box.name === "propbox") {
                let ran_ind = Math.floor(Math.random() * this.Prop_Sprites.length);
                this.ExtractProp(300, ran_ind, -50, 0, this.Prop_Sprites);
            } else {
                for (let i = 0; i < Prop.Length; i++) {
                    if (box.name === Prop[i]) {
                        this.Game.SetCurrentProp(i);
                        this.Hint_1Show();
                        this.Hint_2IsShow(false);
                        this.Prop_Box.getComponent(cc.Sprite).spriteFrame = null;
                        this.Prop_Box.active = false;
                        // this.Extract_Switch = true;
                        return;
                    }
                }
            }
        }
    }

    /**
     * 设置道具盒子
     */
    SetPropBox() {
        this.Prop_Box.active = true;
        let box = this.Prop_Box.getComponent(cc.Sprite);
        box.spriteFrame = this.Prop_Box_Sprite;
    }

    /**
     * 重置道具盒子
     */
    ResetPropBox() {
        this.Prop_Box.active = false;
        let box = this.Prop_Box.getComponent(cc.Sprite);
        box.spriteFrame = null;
        this.Hint_2IsShow(false);
    }

    /**
     * 抽取道具
     * @param dt 持续时间
     * @param ind 下标索引
     * @param lerp 差值
     * @param count 中间执行次数
     * @param prop_sprites 道具精灵
     */
    private ExtractProp(dt: number, ind: number, lerp: number, count: number, prop_sprites: cc.SpriteFrame[]) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Luck_Audio);
        let box = this.Prop_Box.getComponent(cc.Sprite);
        box.spriteFrame = prop_sprites[ind];
        ind++;
        dt += lerp;
        if (dt <= 0) {
            dt = 50;
            count++;
        }
        if (count >= 20) {
            count = 0;
            lerp = -lerp;
            console.log("差值");
            console.log(lerp);
        }
        if (ind >= prop_sprites.length) {
            ind = 0;
        }
        if (dt >= 400) {
            this.Extract_Switch = true;
            this.Hint_2IsShow(true);
            return;
        }
        setTimeout(() => {
            this.ExtractProp(dt, ind, lerp, count, prop_sprites);
        }, dt);
    }

    /**
     * 提醒1显示
     */
    private Hint_1Show() {
        let hint_str: string = "";

        let box = this.Prop_Box.getComponent(cc.Sprite).spriteFrame;
        switch (box.name) {
            //反转
            case "Reversal":
                hint_str = "“钩子反向道具”持续到本关结束";
                break;
            //台阶移动
            case "StageMove":
                hint_str = "“台阶移动道具”持续到本关结束";
                break;
            //无敌
            case "Invincible":
                hint_str = "“无敌卡”持续30秒";
                break;
            //双倍金币
            case "DoubleCoin":
                hint_str = "“双倍金币卡”持续到本关结束";
                break;
            //底部停止
            case "DownStop":
                hint_str = "“水位停止卡”持续钩10次";
                break;
            //三个钩子
            case "HookThree":
                hint_str = "“三个钩子道具”持续钩10次";
                break;
            default:
                return;
        }
        let hint_label = this.Hint_1.getChildByName("hint_label").getComponent(cc.Label);
        hint_label.string = hint_str;

        let move_left = cc.moveBy(1, -172, 0);
        let move_right = cc.moveBy(1, 172, 0);
        let dt = cc.delayTime(3);
        let callback = () => {
            if (!this.Game.Double_Node.active && this.Game.Current_Prop === Prop.DoubleCoin) {
                this.Game.Double_Node.active = true;
                this.Game.Double_Node.getComponent(cc.Animation).play();
            }
        }
        this.Hint_1.runAction(cc.sequence(move_left, dt, move_right, cc.callFunc(callback)));
    }

    /**
     * 提醒2是否显示
     * @param isShow 是否显示
     */
    private Hint_2IsShow(isShow: boolean) {
        this.Hint_2.active = isShow;
    }

}
