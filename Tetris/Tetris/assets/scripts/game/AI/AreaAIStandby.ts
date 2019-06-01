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
export default class AreaAIStandby extends cc.Component {

    /**
     * @property 方块ID
     */
    private Cubes_ID: string[] = [];
    /**
     * @property 待机方块数
     */
    private Cube_Standby_Num: number = 10;

    onLoad() {

    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Cubes_ID = ["1", "2", "3", "4", "5", "6", "7"];
    }

    /**
     * 设置暂存区方块
     */
    public UpdateStandbyCube() {
        let length = this.Cube_Standby_Num - GameManager.Instance.AIStandbyCubesID.length;
        for (let i = 0; i < length; i++) {
            let ran = Math.floor(Math.random() * this.Cubes_ID.length);
            GameManager.Instance.AIStandbyCubesID.push(this.Cubes_ID[ran]);
        }
        // console.log( GameManager.Instance.AIStandbyCubesID);
    }
}
