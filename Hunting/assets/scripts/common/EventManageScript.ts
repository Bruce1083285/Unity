import ScriptManage from "./ScriptManageScript";
//导入枚举
import { Cmap } from "./EnumManageScript";



// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventManage {

    // LIFE-CYCLE CALLBACKS:
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //自身节点
    private Self_Node: cc.Node = null;
    //选中框
    private Che_Box: cc.Node[] = [];
    //上一个选中框
    private Begin_Che_Box: cc.Node[] = [];
    // onLoad () {}

    // start() {
    //     this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    constructor() {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    }
    //触摸事件注册
    TouchOn(target: cc.Node) {
        target.on(cc.Node.EventType.TOUCH_START, this.TouchBegin, this);
    }
    TouchOff(target: cc.Node) {
        target.off(cc.Node.EventType.TOUCH_START, this.TouchBegin, this);
    }
    //触摸开始
    TouchBegin(event) {
        //选中框存储
        let che_box: cc.Node = null;
        //播放点击音效
        cc.audioEngine.play(this.ScriptManage.MusicManage.Click_Audio, false, 1);
        //是否为玩家回合
        if (this.ScriptManage.GameManage.Game_Status === Cmap.player) {
            //开启对话
            if (event.target.name != "grid") {
                che_box = this.ScriptManage.ChessboardManage.Checked_Pool.get();
                this.ScriptManage.GameManage.Chessboard.addChild(che_box);
                che_box.setPosition(event.target.position);
                //获取长度
                let patch_length = this.ScriptManage.GameManage.Chessboard.children;
                //设置渲染顺序
                event.target.setSiblingIndex(patch_length.length);
                //开启对话
                event.target.getChildByName("speak").active = true;
            }
            //自身节点是否存储
            if (this.Self_Node) {
                if (this.ScriptManage.GameManage.Player_ID.string === "wolf") {
                    if (this.Self_Node.name === "dw" || this.Self_Node.name === "xw") {
                        let islock = this.Self_Node.getChildByName("suo").active;
                        if (!islock) {
                            //查找目标位置
                            let result = this.ScriptManage.Wolf_Player.SelectTargetPos(this.Self_Node, event.target);
                            if (result) {
                                //结果判定
                                this.ScriptManage.ResultManage.ResultDetermine(this.ScriptManage.GameManage.AI_Sheep_Array, Cmap.player, this.ScriptManage.GameManage.Player_Wolf_Array);
                            }
                        }
                    }
                }
                if (this.ScriptManage.GameManage.Player_ID.string === "sheep") {
                    if (this.Self_Node.name === "yp") {
                        //查找目标位置
                        let result = this.ScriptManage.Sheep_Player.SelectTargetPos(this.Self_Node, event.target);
                        if (result) {
                            //结果判定
                            this.ScriptManage.ResultManage.ResultDetermine(this.ScriptManage.GameManage.AI_Wolf_Array, Cmap.player);
                        }
                    }
                }
                //关闭对话
                if (this.Self_Node.name != "grid") {
                    this.Self_Node.getChildByName("speak").active = false;
                    for (let i = 0; i < this.Che_Box.length; i++) {
                        this.ScriptManage.ChessboardManage.Checked_Pool.put(this.Che_Box[i]);
                        this.Che_Box.splice(i, 1);
                    }
                }
                let dis = cc.pDistance(this.Self_Node.position, event.target.position);
                //判断是否为自身
                if (Math.abs(dis) <= 1) {
                    //存储上一个选中框
                    this.Che_Box.push(che_box);
                    //重置自身节点
                    this.Self_Node = null;
                    return;
                }
            }
            for (let i = 0; i < this.Che_Box.length; i++) {
                this.ScriptManage.ChessboardManage.Checked_Pool.put(this.Che_Box[i]);
                this.Che_Box.splice(i, 1);
            }
            //存储上一个选中框
            this.Che_Box.push(che_box);
            //存储自身节点
            this.Self_Node = event.target;
        }
    }

    // update (dt) {}
}