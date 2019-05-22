import AI from "../game/AI";
import Player from "../game/Player";
import { GameManage } from "../commont/GameManager";
import { SoundType, EventType } from "../commont/Enum";
import { EventCenter } from "../commont/EventCenter";
import Role from "../game/Role";

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
export default class Animation_Frozen extends cc.Component {

    /**
     * @property 冰冻精灵帧
     */
    @property([cc.SpriteFrame])
    private Fram_Frozen: cc.SpriteFrame[] = [];
    /**
     * @property 目标节点
     */
    private Target: cc.Node
    /**
     * @property 图片精灵
     */
    private Spri_Img: cc.Sprite = null;
    /**
     * @property 下标索引--->开始
     */
    private Index_Begin: number = 0;
    /**
     * @property 下标索引--->开始
     */
    private Index_End: number = 0;

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
        this.Spri_Img = this.node.getChildByName("img").getComponent(cc.Sprite);
    }

    /**
     * 播放开始动画
     */
    public PlayBegin(target: cc.Node) {
        this.Target = target;
        this.node.zIndex = 1;

        GameManage.Instance.StopTargetAction(target);

        EventCenter.BroadcastOne(EventType.Sound, SoundType.Frozen);

        let collider = target.getComponent(cc.BoxCollider);
        collider.enabled = false;

        let type_Class: Role = null;
        let name = this.Target.name;
        if (name === "AI") {
            type_Class = this.Target.getComponent(AI);
            let istrue = type_Class.GetPretection(this.node);
            if (istrue) {
                return
            }
        } else if (name === "Player") {
            type_Class = this.Target.getComponent(Player);
            GameManage.Instance.IsUseingProp = false;
            GameManage.Instance.IsTouchClick = false;
            type_Class.Game.Horizontal = 0;
        }
        type_Class.IsWaterPolo = true;
        type_Class.IsSpeedUp = false;
        type_Class.Speed = 0;
        let callback = () => {
            if (GameManage.Instance.IsPause) {
                return;
            }
            this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Index_Begin];
            this.Index_Begin++;
            if (this.Index_Begin >= this.Fram_Frozen.length) {
                this.unschedule(callback);
                this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Fram_Frozen.length - 1]
            }
        }

        this.schedule(callback, 0.05);
    }

    /**
     * 播放结束动画
     */
    public PlayEnd() {
        EventCenter.BroadcastOne(EventType.Sound, SoundType.Frozen);
        this.Index_End = this.Fram_Frozen.length - 1;
        let callback = () => {
            if (GameManage.Instance.IsPause) {
                return;
            }
            this.Spri_Img.spriteFrame = this.Fram_Frozen[this.Index_End];
            this.Index_End--;
            if (this.Index_End < 0) {
                let collider = this.Target.getComponent(cc.BoxCollider);
                collider.enabled = true;
                // this.unschedule(callback);
                // this.Spri_Img.spriteFrame = null;
                let type_Class: Role = null;
                this.Target.opacity = 255;
                let name = this.Target.name;
                if (name === "AI") {
                    type_Class = this.Target.getComponent(AI);
                } else if (name === "Player") {
                    type_Class = this.Target.getComponent(Player);
                    GameManage.Instance.IsUseingProp = true;
                    GameManage.Instance.IsTouchClick = true;

                }
                type_Class.IsWaterPolo = false;
                type_Class.IsSpeedUp = true;
                type_Class.Speed = 0;
                this.node.removeFromParent();
                this.node.destroy();
            }
        }

        this.schedule(callback, 0.05);
    }
}
