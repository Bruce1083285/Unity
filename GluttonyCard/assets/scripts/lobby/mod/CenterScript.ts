import Mod from "../frame/ModScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Center extends Mod {
    constructor() {
        super();
    }
    //设置输入数据
    SetInput(inpu: cc.EditBox, id?: cc.Label) {
        //个性签名设置
        if (inpu.node.parent.name === "Signature") {
            //修改缓存
            cc.sys.localStorage.setItem("Signature", inpu.string);
        }
        //游戏昵称设置
        if (inpu.node.parent.name === "NickName") {
            //修改缓存
            cc.sys.localStorage.setItem("NickName", inpu.string);
            //更新顶部名字
            id.string = inpu.string;
        }
    }
}
