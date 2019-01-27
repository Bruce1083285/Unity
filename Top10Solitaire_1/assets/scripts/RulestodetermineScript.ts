

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
export default class Rulestodetermine {
    
    //列
    public Line = 0;
    //行
    public Row = 0;
    //牌组
    public GridArray = [];
    //相同获取数组
    public SameAcquire = [];
    //构造函数
    constructor(line, row, GridArray) {
        //行列赋值
        this.Line = line;
        this.Row = row;
        //牌组赋值
        this.GridArray = GridArray;
    }
    //判定
    Determine(Target?: cc.Node): any {
        return;
    };
    //方向查找
    SelectDirection(start_y, start_x) {
        //向上扫描
        up:
        for (let y = start_y + 1; y < this.Line - 5; y++) {
            if (this.GridArray[y][start_x].name === this.GridArray[start_y][start_x].name) {
                let ind = this.SameAcquire.indexOf(this.GridArray[y][start_x]);
                if (ind === -1) {
                    this.SameAcquire.push(this.GridArray[y][start_x]);
                    this.SelectDirection(y, start_x);
                } else {
                    continue;
                }
            } else {
                break up;
            }
        }
        //向下扫描
        down:
        for (let y = start_y - 1; y >= 0; y--) {
            if (this.GridArray[y][start_x].name === this.GridArray[start_y][start_x].name) {
                let ind = this.SameAcquire.indexOf(this.GridArray[y][start_x]);
                if (ind === -1) {
                    this.SameAcquire.push(this.GridArray[y][start_x]);
                    this.SelectDirection(y, start_x);
                } else {
                    continue;
                }
            } else {
                break down;
            }
        }
        //向左扫描
        left:
        for (let x = start_x - 1; x >= 0; x--) {
            if (this.GridArray[start_y][x].name === this.GridArray[start_y][start_x].name) {
                let ind = this.SameAcquire.indexOf(this.GridArray[start_y][x]);
                if (ind === -1) {
                    this.SameAcquire.push(this.GridArray[start_y][x]);
                    this.SelectDirection(start_y, x);
                } else {
                    continue;
                }
            } else {
                break left;
            }
        }
        //向右扫描
        right:
        for (let x = start_x + 1; x < this.Row; x++) {
            if (this.GridArray[start_y][x].name === this.GridArray[start_y][start_x].name) {
                let ind = this.SameAcquire.indexOf(this.GridArray[start_y][x]);
                if (ind === -1) {
                    this.SameAcquire.push(this.GridArray[start_y][x]);
                    this.SelectDirection(start_y, x);
                } else {
                    continue;
                }
            } else {
                break right;
            }
        }
    }
}
