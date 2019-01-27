import Rulestodetermine from "../RulestodetermineScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const { ccclass, property } = cc._decorator;

// @ccclass
export default class Success extends Rulestodetermine {
    //构造函数
    constructor(line, row, GridArray) {
        //执行父类构造函数
        super(line, row, GridArray);
    }
    //成功判定
    Determine(Target?: cc.Node): cc.Node[] {
        //目标Y轴
        let y = this.SelectTargetY(this.GridArray, Target);
        //目标X轴
        let x = this.GridArray[y].indexOf(Target);
        this.SelectDirection(y, x);
        return this.SameAcquire;
    };
    //目标Y轴
    SelectTargetY(GridArray: any[], Target: cc.Node) {
        for (let y = 0; y < this.Line; y++) {
            for (let x = 0; x < this.Row; x++) {
                let dis = cc.pDistance(GridArray[y][x].position, Target.position);
                if (Math.abs(dis) <= 1) {
                    return y;
                }
            }
        }
    }

}
