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
export default class AreaAIActtackCube extends cc.Component {

    onLoad() {
        // this.SetActtackCube(5);
        this.AddListenter();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //设置攻击方块
        EventCenter.AddListenter(EventType.SetAIActtackCube, (num: number) => {
            this.SetActtackCube(num);
        }, "AreaAIActtackCube");

        //通过连消数销毁攻击方块
        EventCenter.AddListenter(EventType.DestoryAIActtackCubeByNum, (num: number) => {
            this.DestoryActtackCubeByNum(num);
        }, "AreaAIActtackCube");

        //事件监听--->移除监听
        EventCenter.AddListenter(EventType.RemoveListenter, () => {
            this.RemoveListenter();
        }, "AreaAIActtackCube");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //设置攻击方块
        EventCenter.RemoveListenter(EventType.SetAIActtackCube, "AreaAIActtackCube");

        //通过连消数销毁攻击方块
        EventCenter.RemoveListenter(EventType.DestoryAIActtackCubeByNum, "AreaAIActtackCube");

        //移除监听
        EventCenter.RemoveListenter(EventType.RemoveListenter, "AreaAIActtackCube");
    }

    /**
     * 设置攻击方块
     * @param num 攻击方块数
     */
    private SetActtackCube(num: number) {

        GameManager.Instance.AIActtackCube_Num += num;
    }

    /**
     * 通过连消数销毁攻击方块
     * @param num 连消数
     */
    private DestoryActtackCubeByNum(num: number) {
        if (num <= 0) {
            return;
        }

        GameManager.Instance.AIActtackCube_Num -= num;
    }
}
