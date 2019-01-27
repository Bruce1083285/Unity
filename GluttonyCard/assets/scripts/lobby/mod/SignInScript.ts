import Mod from "../frame/ModScript";
import Lobby from "../frame/LobbyScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class SignIn extends Mod {

    SignInFunc(signin: cc.Node, day: string) {
        let day_arr = signin.getChildByName("DayNum").children;
        let day_num = parseInt(day);
        for (let i = 0; i < day_arr.length; i++) {
            if (day === "1" && day_arr[i].name === "1") {
                //按钮激活关闭
                day_arr[i].getComponent(cc.Button).interactable = false;
                //开启已签到显示
                day_arr[i].getChildByName("duihao").active = true;
                signin.getChildByName("SignIn_Hint").active = true;
                let lobby = cc.find("Lobby").getComponent(Lobby);
                lobby.scheduleOnce(() => {
                    signin.getChildByName("SignIn_Hint").active = false;
                    let coin_num = parseInt(lobby.Coin_Label.string) + 100;
                    lobby.Coin_Label.string = coin_num + "";
                    cc.sys.localStorage.setItem("Coin", coin_num)
                    cc.sys.localStorage.setItem("SignIn", day);
                }, 0.5);
                return;
            }
            // let arr_num = parseInt(day_arr[i].name);
            // if (arr_num + 1 === day_num) {
            //     let isEnable = day_arr[i].getComponent(cc.Button).interactable;
            //     if (!isEnable) {
            //         //天数查找
            //         let day_node = this.SelectDay(day, day_arr);
            //         if (day_node) {
            //             //按钮激活关闭
            //             day_node.getComponent(cc.Button).interactable = false;
            //             //开启已签到显示
            //             day_node.getChildByName("duihao").active = true;
            //             cc.sys.localStorage.setItem("SignIn", day);
            //         }
            //     }
            // }
        }
    }
    //天数查找
    SelectDay(day: string, day_arr: cc.Node[]): cc.Node {
        for (let i = 0; i < day_arr.length; i++) {
            if (day_arr[i].name === day) {
                return day_arr[i];
            }
        }
    }
}
