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
     * @property [Array]待机区方块精灵帧
     */
    @property([cc.SpriteFrame])
    private SpriteFrame_EnabledStanbyCubes: cc.SpriteFrame[] = [];
    /**
     * @property 备用方块的禁用
     */
    @property([cc.SpriteFrame])
    private SpriteFrame_ForbiddenStanbyCubes: cc.SpriteFrame[] = [];
    /**
     * @property 可以使用的方块
     */
    private Cube_Yes: cc.Node = null;
    /**
     * @property 不可以使用的方块
     */
    private Cube_No: cc.Node = null;

    onLoad() {
        this.Init();
    }

    update(dt) {
        if (GameManager.Instance.IsSave && this.Cube_No.active) {
            this.Cube_Yes.active = true;
            this.Cube_No.active = false;
        }
        if (!GameManager.Instance.IsSave && this.Cube_Yes.active) {
            this.Cube_Yes.active = false;
            this.Cube_No.active = true;
        }
    }

    /**
     * 初始化
     */
    private Init() {
        this.Cube_Yes = this.node.getChildByName("cube_yes");
        this.Cube_No = this.node.getChildByName("cube_no");

        // this.AddListenter();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        EventCenter.AddListenter(EventType.UpdateSaveCubeStatus, () => {
            this.Cube_Yes.active = true;
            this.Cube_No.active = false;
        }, "AreaSave");
    }

    /**
    * 移除事件监听
    */
    private RemoveListenter() {
        EventCenter.RemoveListenter(EventType.UpdateSaveCubeStatus, "AreaSave");
    }

    /**
     * 更新暂存区
     * @param current_Cube 当前方块节点
     */
    public UpdateSave(current_Cube: cc.Node) {
        if (!GameManager.Instance.IsSave) {
            return;
        }
        EventCenter.Broadcast(EventType.CubeForeseeDestory);

        let sprF_Cube_yes = this.Cube_Yes.getComponent(cc.Sprite);
        let sprF_Cube_no = this.Cube_No.getComponent(cc.Sprite);
        if (!sprF_Cube_yes.spriteFrame && !sprF_Cube_no.spriteFrame) {
            //更新游戏开始点
            EventCenter.BroadcastOne<string>(EventType.UpdatePointBegin, GameManager.Instance.Standby_FirstID);
            //更新暂存区
            EventCenter.Broadcast(EventType.UpdateStandby);
            GameManager.Instance.IsSave = true;
        } else {
            //更新游戏开始点
            EventCenter.BroadcastOne<string>(EventType.UpdatePointBegin, sprF_Cube_yes.spriteFrame.name);
            GameManager.Instance.IsSave = false;
        }
        sprF_Cube_yes.spriteFrame = this.GetEnabledCubeFram(this.SpriteFrame_EnabledStanbyCubes, current_Cube);
        sprF_Cube_no.spriteFrame = this.GetForbiddenCubeFram(this.SpriteFrame_ForbiddenStanbyCubes, current_Cube);
        current_Cube.destroy();
    }

    /**
     * 获取可以启用的方块精灵帧
     * @param sprF_StandbyCubes 
     * @param current_Cube 
     */
    private GetEnabledCubeFram(sprFrame_FStanbyCubes: cc.SpriteFrame[], current_Cube: cc.Node): cc.SpriteFrame {
        let spr_F: cc.SpriteFrame = null;
        for (let i = 0; i < sprFrame_FStanbyCubes.length; i++) {
            spr_F = sprFrame_FStanbyCubes[i];
            if (current_Cube.name === spr_F.name) {
                return spr_F;
            }
        }
    }

    /**
    * 获取禁用的方块精灵帧
    * @param sprF_StandbyCubes 
    * @param current_Cube 
    */
    private GetForbiddenCubeFram(sprF_StandbyCubes: cc.SpriteFrame[], current_Cube: cc.Node): cc.SpriteFrame {
        let spr_F: cc.SpriteFrame = null;
        for (let i = 0; i < sprF_StandbyCubes.length; i++) {
            spr_F = sprF_StandbyCubes[i];
            if (current_Cube.name === spr_F.name) {
                return spr_F;
            }
        }
    }
}
