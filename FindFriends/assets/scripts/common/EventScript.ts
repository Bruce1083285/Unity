import Manager from "./ManageScript";
import Card from "../game/framwork/CardScript";
import { Grid, AudioD } from "./EnumScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 事件类
 */
export default class Events {
    /**
     * @property 管理器
     */
    private Manage_SC: Manager = null;

    constructor(sc: Manager) {
        this.Manage_SC = sc;
    }

    onEventListening(target: cc.Node) {
        //触摸开始
        target.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        //触摸移动
        target.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        //触摸结束
        target.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }

    /**
     * 触摸开始
     * @param event 触摸信息
     */
    private touchStart(event) {
        let isuse = event.target.getComponent(Card).IsUse;
        if (isuse) {
            // cc.log(event.target.getComponent(Card).RightAndUp + "右上");
            // cc.log(event.target.getComponent(Card).LeftAndDown + "左下");
            this.Manage_SC.Controller_Game.Touch_Poi_Pos = event.target.position;
            this.Manage_SC.Controller_Game.Touch_Poi_Y = this.Manage_SC.Controller_Game.getArrayY(event.target, this.Manage_SC.Controller_Game.Array_Grid);
            let patch_array = null;
            if (event.target.parent.name === "Area_Game") {
                patch_array = event.target.parent.children;
                event.target.setSiblingIndex(patch_array.Learn - 1);
            } else {
                patch_array = event.target.parent.parent.children;
                event.target.parent.setSiblingIndex(patch_array.length - 1);
            }
        }
    }

    /**
     * 触摸移动
     * @param event 触摸信息
     */
    private touchMove(event) {
        let isuse = event.target.getComponent(Card).IsUse;
        if (isuse) {
            let node_pos = event.target.parent.convertTouchToNodeSpaceAR(event);
            event.target.setPosition(node_pos);
        }
    }

    /**
     * 触摸结束
     * @param event 触摸信息
     */
    private touchEnd(event) {
        let isuse = event.target.getComponent(Card).IsUse;
        if (isuse) {
            //是否成功出牌
            let isplay = this.Manage_SC.Manage_Player.Play(event.target, this.Manage_SC.Controller_Game.Array_Grid, this.Manage_SC.Controller_Game.Array_Card, this.Manage_SC.Controller_Game.Pool_Grid, this.Manage_SC.Controller_Game.Touch_Poi_Pos, this.Manage_SC.Controller_Game.Touch_Poi_Y);
            if (isplay) {
                this.Manage_SC.Manage_Audio.PlayAudio(AudioD.move);
                this.Manage_SC.Controller_Game.Touch_Poi_Y = this.Manage_SC.Controller_Game.getArrayY(event.target, this.Manage_SC.Controller_Game.Array_Grid);
                this.Manage_SC.Manage_Desktop.setCardArea(this.Manage_SC.Controller_Game.Area_Card, this.Manage_SC.Controller_Game.Pool_Card, this.Manage_SC.Controller_Game.Array_Card);
                this.Manage_SC.Manage_Rule.RoundDetection(this.Manage_SC.Controller_Game.Array_Grid, this.Manage_SC.Controller_Game.Score_Count, this.Manage_SC.Controller_Game.Array_Pass_Hold);
                for (let y = 0; y < this.Manage_SC.Controller_Game.Array_Grid.length; y++) {
                    for (let x = 0; x < this.Manage_SC.Controller_Game.Array_Grid[0].length; x++) {
                        if (this.Manage_SC.Controller_Game.Array_Grid[y][x].tag === Grid.grid_card) {
                            return;
                        }
                    }
                }
                let isover = this.Manage_SC.Manage_Rule.OverDetection(this.Manage_SC.Controller_Game.Array_Grid);
                this.Manage_SC.Controller_Game.Page_Settlement.active = true;
                if (isover) {
                    this.Manage_SC.Manage_Audio.PlayAudio(AudioD.victory);
                    this.Manage_SC.Controller_Game.Page_Settlement.getChildByName("Content").getChildByName("Victory").active = true;
                } else {
                    this.Manage_SC.Manage_Audio.PlayAudio(AudioD.failure);
                    this.Manage_SC.Controller_Game.Page_Settlement.getChildByName("Content").getChildByName("Failure").active = true;
                }
            }
        }
    }
}
