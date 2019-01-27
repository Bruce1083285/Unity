// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Mod {
    //-------------属性
    //大厅管理器
    protected LobbyManage: any = null;
    //音乐开关
    public Music_Show_Num: number = 0;
    //音效开关
    public Sound_Show_Num: number = 0;
    //构造函数
    constructor() { }
    //设置输入数据
    SetInput(inpu: cc.EditBox, id?: cc.Label) { }
    //音乐开关
    MusicShow(music: cc.Node,bgm:cc.AudioSource) { }
    //音效开关
    SoundShow(sound: cc.Node) { }
    //签到功能
    SignInFunc(signin:cc.Node,day:string){}
}
