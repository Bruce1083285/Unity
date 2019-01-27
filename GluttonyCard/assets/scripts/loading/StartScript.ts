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
export default class Start extends cc.Component {

    //背景音效
    @property(cc.AudioSource)
    public BGM: cc.AudioSource = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let bgm = cc.sys.localStorage.getItem("BGM");
        if (!bgm) {
            //播放背景音效
            this.BGM.play();
        }
        if (bgm === "开") {
            this.BGM.play();
        }
        if (bgm === "关") {
            //暂停背景音效
            this.BGM.pause();
        }
    }

    start() {

    }
    //按钮管理
    ButtonManage(lv: any, button: string) {
        //开始游戏
        if (button === "begin") {
            cc.director.loadScene("LobbyScene");
        }
    }
    // update (dt) {}
}
