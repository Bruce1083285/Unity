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

export default class Set extends Mod {
    constructor() {
        super();
    }
    //音乐开关
    MusicShow(music: cc.Node, bgm: cc.AudioSource) {
        //音乐关
        if (this.Music_Show_Num === 0) {
            music.getChildByName("Button").getChildByName("On").active = false;
            music.getChildByName("Button").getChildByName("Off").active = true;
            bgm.pause();
            cc.sys.localStorage.setItem("BGM", "关");
        }
        this.Music_Show_Num++;
        //音乐开
        if (this.Music_Show_Num >= 2) {
            music.getChildByName("Button").getChildByName("On").active = true;
            music.getChildByName("Button").getChildByName("Off").active = false;
            bgm.play();
            cc.sys.localStorage.setItem("BGM", "开");
            //重置音乐开关
            this.Music_Show_Num = 0;
        }
    }
    //音效开关
    SoundShow(sound: cc.Node) {
        //音乐关
        if (this.Sound_Show_Num === 0) {
            sound.getChildByName("Button").getChildByName("On").active = false;
            sound.getChildByName("Button").getChildByName("Off").active = true;
            cc.sys.localStorage.setItem("Sound", "关");
        }
        this.Sound_Show_Num++;
        //音乐开
        if (this.Sound_Show_Num >= 2) {
            sound.getChildByName("Button").getChildByName("On").active = true;
            sound.getChildByName("Button").getChildByName("Off").active = false;
            cc.sys.localStorage.setItem("Sound", "开");
            //重置音乐开关
            this.Sound_Show_Num = 0;
        }
    }
}
