import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";
import { GameManager } from "../../commont/GameManager";

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
export default class AreaSave extends cc.Component {

    /**
     * 更新暂存区
     * @param current_Cube 当前方块节点
     * @param sprF_StandbyCubes [Array]备用方块精灵帧
     */
    public UpdateSave(current_Cube: cc.Node, sprF_StandbyCubes: cc.SpriteFrame[]) {
        let spr_F: cc.SpriteFrame = null;
        for (let i = 0; i < sprF_StandbyCubes.length; i++) {
            spr_F = sprF_StandbyCubes[i];
            if (current_Cube.name === spr_F.name) {
                break;
            }
        }

        let sprF_Cube = this.node.getChildByName("cube").getComponent(cc.Sprite);
        if (!sprF_Cube.spriteFrame) {
            //更新游戏开始点
            EventCenter.BroadcastOne<string>(EventType.UpdatePointBegin, GameManager.Instance.Standby_FirstID);
            //更新暂存区
            EventCenter.Broadcast(EventType.UpdateStandby);
        } else {
            //更新游戏开始点
            EventCenter.BroadcastOne<string>(EventType.UpdatePointBegin, sprF_Cube.spriteFrame.name);
        }

        current_Cube.destroy();
        sprF_Cube.spriteFrame = spr_F;
    }
}
