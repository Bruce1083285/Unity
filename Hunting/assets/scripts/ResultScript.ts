import ScriptManage from "./common/ScriptManageScript";
import { Cmap, CampAllocation } from "./common/EnumManageScript";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Result {
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //构造函数
    constructor() {
        //获取脚本管理器
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    }
    //结果判定
    ResultDetermine(target_array: cc.Node[], cmap: Cmap, self_array?: cc.Node[]) {
        //玩家结果判定
        if (cmap === Cmap.player) {
            if (target_array[0].name === "yp") {
                //目标羊牌判定
                let isvictory = this.SheepDetermine(target_array, self_array);
                //是否胜利
                if (isvictory) {
                    //暂停背景音效
                    this.ScriptManage.GameManage.BGM.pause();
                    //播放胜利音效
                    cc.audioEngine.play(this.ScriptManage.MusicManage.Victory_Audio, false, 1);
                    // cc.log("你赢了");
                    this.ScriptManage.GameManage.Victory_Page.active = true;
                }
            }
            if (target_array[0].name === "dw" || target_array[0].name === "xw") {
                //目标狼牌判定
                let isvictory = this.WolfDetermine(target_array);
                //是否胜利
                if (isvictory) {
                    //暂停背景音效
                    this.ScriptManage.GameManage.BGM.pause();
                    //播放胜利音效
                    cc.audioEngine.play(this.ScriptManage.MusicManage.Victory_Audio, false, 1);
                    // cc.log("你赢了");
                    this.ScriptManage.GameManage.Victory_Page.active = true;
                }
            }
        }
        //AI结果判定
        if (cmap === Cmap.AI) {
            if (target_array[0].name === "yp") {
                //目标羊牌判定
                let isfailure = this.SheepDetermine(target_array, self_array);
                //是否失败
                if (isfailure) {
                    //暂停背景音效
                    this.ScriptManage.GameManage.BGM.pause();
                    //播放失败音效
                    cc.audioEngine.play(this.ScriptManage.MusicManage.Failure_Audio, false, 1);
                    // cc.log("你输了");
                    this.ScriptManage.GameManage.Failure_Page.active = true;
                }
            }
            if (target_array[0].name === "dw" || target_array[0].name === "xw") {
                //目标狼牌判定
                let isfailure = this.WolfDetermine(target_array);
                //是否失败
                if (isfailure) {
                    //暂停背景音效
                    this.ScriptManage.GameManage.BGM.pause();
                    //播放失败音效
                    cc.audioEngine.play(this.ScriptManage.MusicManage.Failure_Audio, false, 1);
                    //cc.log("你输了");
                    this.ScriptManage.GameManage.Failure_Page.active = true;
                }
            }
        }
        //交换游戏状态
        this.ExchangeGameStatus();
    }
    //判定狼牌
    WolfDetermine(wolf_array: cc.Node[]): boolean {
        for (let i = 0; i < wolf_array.length; i++) {
            //移动判定
            this.MoveDetermine(wolf_array[i]);
        }
        //上锁数
        let lock_num: number = 0;
        for (let i = 0; i < wolf_array.length; i++) {
            let islock = wolf_array[i].getChildByName("suo").active;
            if (islock) {
                lock_num++;
            }
        }
        if (lock_num >= 2) {
            return true;
        }
        return false;
    }
    //判定羊牌
    SheepDetermine(sheep_array: cc.Node[], wolf_array: cc.Node[]): boolean {
        for (let i = 0; i < wolf_array.length; i++) {
            //移动判定
            this.MoveDetermine(wolf_array[i]);
        }
        if (sheep_array.length < 3) {
            return true;
        }
        return false;
    }
    //移动判定
    MoveDetermine(wolf_node: cc.Node) {
        let islock_num: number = 0;
        //狼牌Y轴
        let wolf_y = this.ScriptManage.GameManage.GetChessboardPos_y(wolf_node);
        //狼牌X轴
        let wolf_x = this.ScriptManage.GameManage.Chessboard_Array[wolf_y].indexOf(wolf_node);
        //向上
        if (wolf_y + 1 >= this.ScriptManage.GameManage.Line || this.ScriptManage.GameManage.Chessboard_Array[wolf_y + 1][wolf_x].name != "grid") {
            islock_num++;
        }
        //向下
        if (wolf_y - 1 < 0 || this.ScriptManage.GameManage.Chessboard_Array[wolf_y - 1][wolf_x].name != "grid") {
            islock_num++;
        }
        //向右
        if (wolf_x + 1 >= this.ScriptManage.GameManage.Row || this.ScriptManage.GameManage.Chessboard_Array[wolf_y][wolf_x + 1].name != "grid") {
            islock_num++;
        }
        //向左
        if (wolf_x - 1 < 0 || this.ScriptManage.GameManage.Chessboard_Array[wolf_y][wolf_x - 1].name != "grid") {
            islock_num++;
        }
        //上锁
        if (islock_num >= 4) {
            wolf_node.getChildByName("suo").active = true;
        }
        //解锁
        let islock = wolf_node.getChildByName("suo").active
        if (islock && islock_num < 4) {
            wolf_node.getChildByName("suo").active = false;
        }
    }
    //交换游戏状态
    ExchangeGameStatus() {
        //玩家回合结束
        if (this.ScriptManage.GameManage.Game_Status === Cmap.player) {
            //AI回合
            this.ScriptManage.GameManage.Game_Status = Cmap.AI;
            if (this.ScriptManage.GameManage.Player_ID.string === "wolf") {
                this.ScriptManage.Sheep_AI.SelectSelfPos(this.ScriptManage.GameManage.AI_Sheep_Array, this.ScriptManage.GameManage.Player_Wolf_Array);
            }
            if (this.ScriptManage.GameManage.Player_ID.string === "sheep") {
                this.ScriptManage.Wolf_AI.SelectSelfPos(this.ScriptManage.GameManage.AI_Wolf_Array, this.ScriptManage.GameManage.Player_Sheep_Array);
            }
        }
        //AI回合结束
        if (this.ScriptManage.GameManage.Game_Status === Cmap.AI) {
            //玩家回合
            this.ScriptManage.GameManage.Game_Status = Cmap.player;
        }
    }
    // update (dt) {}
}
