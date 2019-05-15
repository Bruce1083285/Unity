import Start from "./Start";
import Level from "./Level";
import Game from "./Game";

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
export default class Main extends cc.Component {

    /**
     * @property 首页类
     */
    private Start: Start = null;
    /**
     * @property 关卡类
     */
    private Level: Level = null;
    /**
     * @property 游戏类
     */
    private Game: Game = null;

    onLoad() {
        this.Start = this.node.getChildByName("Main Camera").getChildByName("Page_Start").getComponent(Start);
        this.Level = this.node.getChildByName("Main Camera").getChildByName("Page_Level").getComponent(Level);
        this.Game = this.node.getChildByName("Page_Game").getComponent(Game);

        this.Start.Init();
        this.Level.Init();
        this.Game.Init();
    }

    start() {

    }

    // update (dt) {}
}
