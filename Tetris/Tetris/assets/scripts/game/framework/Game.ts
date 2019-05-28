import { Click_Directions, Click_Function, Click_Set } from "../../commont/Enum";

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
export default class Game extends cc.Component {



    onLoad() { }

    start() {

    }

    // update (dt) {}

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            //方向键
            case Click_Directions.Up:
                break;
            case Click_Directions.Down:
                break;
            case Click_Directions.Left:
                break;
            case Click_Directions.Right:
                break;
            //功能键
            case Click_Function.Clockwise:
                break;
            case Click_Function.Anticlockwise:
                break;
            case Click_Function.Save:
                break;
            //设置键
            case Click_Set.Open:
                break;
            case Click_Set.Close:
                break;
            case Click_Set.CastAs:
                break;
            case Click_Set.Set:
                break;
            default:
                break;
        }
    }
}
