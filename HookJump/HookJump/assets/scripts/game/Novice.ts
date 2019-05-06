import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import Game from "../Game";
import GameAudio from "./GameAudio";
import BeginTime from "./BeginTime";

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
export default class NewClass extends cc.Component {

    /**
     * 游戏类
     */
    private Game: Game = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.getComponent(Game);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        let level_num = parseInt(click);
        this.node.active = false;
        this.Game.node.getChildByName("Page_Level").active = false;
        Cache.SetCache(CacheType.Level_Num, click);
        let bgm = Cache.GetCache(CacheType.BGM);
        if (!bgm || bgm === "true") {
            cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
            cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("b_1");
        }
        if (bgm === "false") {
            cc.find("Canvas/Audio").getComponent(GameAudio).SetAudioSwitch(false);
            cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        }
        cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
        this.SetGameDifficulty(level_num, this.Game);
    }

    /**
     * 设置游戏难度
     * @param level_num 关卡数
     * @param game 游戏类
     */
    private SetGameDifficulty(level_num: number, game: Game) {
        game.GameInit(level_num);
    }
}
