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
export default class Failure extends Rulestodetermine {
    //构造函数
    constructor(line, row, GridArray) {
        //执行父类构造函数
        super(line, row, GridArray);
    }
    //失败判定
    Determine(Target?: cc.Node): boolean {
        //清空数组
        this.SameAcquire = [];
        for (let y = 0; y < this.Line - 5; y++) {
            for (let x = 0; x < this.Row; x++) {
                this.SelectDirection(y, x);
            }
        }
        if (this.SameAcquire.length <= 0) {
            return true;
        } else {
            return false;
        }
    };
}
