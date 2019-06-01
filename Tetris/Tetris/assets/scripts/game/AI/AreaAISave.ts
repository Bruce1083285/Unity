import { GameManager } from "../../commont/GameManager";
import { EventCenter } from "../../commont/EventCenter";
import { EventType } from "../../commont/Enum";

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
export default class AreaAISave extends cc.Component {

    onLoad() {
        this.Init();
    }

    update(dt) {

    }

    Init() {
        this.AddListenter()
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //更新存储
        EventCenter.AddListenter(EventType.UpdateAISave, () => {
            this.UpdateSave();
        }, "AreaAISave");
    }

    /**
     * 移除事件监听
     */
    private RemoveListenter() {
        //更新存储
        EventCenter.RemoveListenter(EventType.UpdateAISave, "AreaAISave");
    }

    /**
     * 更新存储
     */
    private UpdateSave() {
        if (!GameManager.Instance.IsAISave) {
            return;
        }
        EventCenter.Broadcast(EventType.ResetAIGameGrid);

        GameManager.Instance.Current_AICube.destroy();
        let id: string = GameManager.Instance.AISave_Cube;
        if (GameManager.Instance.AISave_Cube) {
            GameManager.Instance.AISave_Cube = GameManager.Instance.Current_AICube.name
            EventCenter.BroadcastOne<string>(EventType.UpdateAIPointBegin, id);
            GameManager.Instance.IsAISave = false;
        } else {
            GameManager.Instance.AISave_Cube = GameManager.Instance.Current_AICube.name
            EventCenter.Broadcast(EventType.UpdateAIPointBegin);
            EventCenter.Broadcast(EventType.UpdateAIStandbyCube);
            GameManager.Instance.IsAISave = true;
        }
    }
}
