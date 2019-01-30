import Module from "../../common/ModuleScript";
import Manager from "../../common/ManageScript";
import { AudioD } from "../../common/EnumScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class Music extends Module {
    /**
     * @property 音效开关
     */
    private Music_Switch: boolean = false;

    /**
     * 设置音乐
     * @param music 音乐开关节点
     * @param manage_sc 管理器
     * @param swit 开关
     */
    setMusic(music: cc.Node, manage_sc: Manager, swit: boolean): boolean {
        if (!swit) {
            music.getChildByName("yinyue").active = false;
            music.getChildByName("yinyue1").active = true;
            manage_sc.Manage_Audio.PauseBgm();
            cc.sys.localStorage.setItem("BGM", false);
        }
        if (swit) {
            music.getChildByName("yinyue").active = true;
            music.getChildByName("yinyue1").active = false;
            manage_sc.Manage_Audio.PlayAudio(AudioD.bgm);
            cc.sys.localStorage.setItem("BGM", true);
        }
        return !swit;
    }
}
