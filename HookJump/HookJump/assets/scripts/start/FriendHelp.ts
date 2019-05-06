import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import WX from "../common/WX";
import StartAudio from "./StartAudio";
import Http from "../common/Http";


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
export default class FriendHelp extends cc.Component {

    /**
     * @property 分享盒子
     */
    @property(cc.Prefab)
    private Share_Box: cc.Prefab = null;
    /**
     * @property 分享数据
     */
    public Share_Data: any[] = [];
    /**
     * @property 分享列表
     */
    private Share_List_Node: cc.Node = null;
    /**
     * @property 差值金币数
     */
    private Coin_Lerp_num: cc.Label = null;
    /**
     * @property 分享盒子对象池
     */
    private Pool_Share_Box: cc.NodePool = new cc.NodePool();
    /**
     * @property 金币提醒
     */
    private Hint_Coin: cc.Node = null;

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Coin_Lerp_num = this.node.getChildByName("title_2").getChildByName("coin_label").getComponent(cc.Label);
        this.Share_List_Node = this.node.getChildByName("scrollview").getChildByName("view").getChildByName("content");
        this.Hint_Coin = this.node.getChildByName("Hint_Coin");

        this.node.active = true;

        this.GetCache(this.Coin_Lerp_num);
        this.GetHttp();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                this.node.active = false;
                this.RecoveryPool();
                break;
            case "share":
                WX.Share();
                break;
            default:
                break;
        }
    }

    /**
     * 设置对象池
     */
    private SetPool() {
        for (let i = 0; i < 5; i++) {
            let box = cc.instantiate(this.Share_Box);
            this.Pool_Share_Box.put(box);
        }
    }

    /**
     * 获取缓存
     * @param coin_lerp 金币差值
     */
    private GetCache(coin_lerp: cc.Label) {
        let coin = Cache.GetCache(CacheType.Coin);
        if (coin) {
            let coin_num = parseInt(coin);
            let lerp = 100000 - coin_num;
            coin_lerp.string = lerp + "";
        } else {
            coin_lerp.string = "100000";
        }

    }

    /**
     * 获取后台分享数据
     */
    private GetHttp() {
        let shareid = WX.Uid;
        // console.log(shareid);
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/look", (data) => {
            // console.log("分享数据");
            if (data && data.data.length > 0) {
                // console.log("数据为空");
                this.Share_Data = data.data;
            }
            console.log("数据是否为空>>>1" + this.Share_Data);
            this.RecoveryPool();
            this.SetFriendHelpList(this.Share_Data, this.Pool_Share_Box, this.Share_List_Node, () => {
                this.SetPool();
            });
        }, { uid: WX.Uid });
    }

    private isEmpty(str: string) {
        if (str == null || str == '' || str == 'null' || str == 'undefine') {
            return true;
        }
        return false;
    }

    /**
     * 设置好友助力数据集
     * @param share_data 分享数据
     * @param pool 对象池
     * @param list_node 节点
     * @param setSharePool 设置对象池
     */
    private SetFriendHelpList(share_data: any[], pool: cc.NodePool, list_node: cc.Node, setSharePool: Function) {
        for (let i = 0; i < share_data.length + 5; i++) {
            let box = pool.get();
            if (!box) {
                setSharePool();
                box = pool.get();
            }
            list_node.addChild(box);

            if (i < share_data.length) {
                let head = box.getChildByName("Head").getComponent(cc.Sprite);
                head.spriteFrame = null;
                if (!this.isEmpty(share_data[i].headimgurl)) {
                    //头像
                    cc.loader.load({ url: share_data[i].headimgurl, type: "jpg" }, (err, texture) => {
                        if (err) console.error(err);
                        head.spriteFrame = new cc.SpriteFrame(texture);
                    });
                }


                if (share_data[i].receive === 0) {
                    //未领取
                    let received = box.getChildByName("Buts").getChildByName("but_Receive");
                    let button = received.getComponent(cc.Button);
                    button.interactable = true;
                    let clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                    clickEventHandler.component = "FriendHelp";//这个是代码文件名
                    clickEventHandler.handler = "ReceivedButton";
                    clickEventHandler.customEventData = share_data[i].id;
                    button.clickEvents.push(clickEventHandler);

                    received.active = true;

                    //已领取
                    let haverec = box.getChildByName("Buts").getChildByName("but_HaveReceived");
                    haverec.active = false;
                }
                if (share_data[i].receive === 1) {
                    //未领取
                    let received = box.getChildByName("Buts").getChildByName("but_Receive");
                    received.getComponent(cc.Button).interactable = false;
                    received.active = false;

                    //已领取
                    let haverec = box.getChildByName("Buts").getChildByName("but_HaveReceived");
                    haverec.active = true;
                }
            } else {
                //未领取
                let received = box.getChildByName("Buts").getChildByName("but_Receive");
                received.getComponent(cc.Button).interactable = false;
                received.active = true;

                //已领取
                let haverec = box.getChildByName("Buts").getChildByName("but_HaveReceived");
                haverec.active = false;
            }
        }
    }

    /**
     * 回收对象池
     */
    private RecoveryPool() {
        let arr = this.Share_List_Node.children;
        for (let i = 0; i < arr.length; i++) {
            this.Pool_Share_Box.put(arr[i]);
            i--;
        }
        this.Pool_Share_Box.clear();
    }

    /**
     * 领取按钮
     * @param lv 
     * @param customEventData 点击参数
     */
    private ReceivedButton(lv: any, customEventData: string) {
        //领取金币
        let frag = Cache.GetCache(CacheType.FragmentNum);
        if (frag) {
            let frag_num = parseInt(frag);
            let sum = frag_num + 10;
            Cache.SetCache(CacheType.Coin, sum + "");
        } else {
            Cache.SetCache(CacheType.Coin, "10");
        }

        this.CoinHintShow(this.Hint_Coin);

        Http.sendRequest("https://xy.zcwx.com/userapi/hall/getlook", (data) => {
            // console.log("分享数据++++++++++");
            // console.log(data.data);
            // console.log(customEventData);
            if (data && data.data.length > 0) {
                this.Share_Data = data.data;
            }
            console.log("数据是否为空>>>2" + this.Share_Data);
            this.RecoveryPool();
            this.GetHttp();
        }, { uid: this.Share_Data[0].uid, id: customEventData });
    }

    /**
     * 金币提醒显示
     * @param hint 金币提醒
     */
    private CoinHintShow(hint: cc.Node) {
        if (hint.active) {
            hint.stopAllActions()
        }
        hint.active = true;
        hint.opacity = 255;
        let pos = hint.position;
        hint.scale = 0.1;
        let show = cc.scaleTo(1, 1, 1);
        let move_up = cc.moveBy(1, 0, 100);
        let hide = cc.fadeOut(1);
        let close = cc.callFunc(() => {
            hint.active = false;
            hint.setPosition(pos);
        });
        hint.runAction(cc.sequence(show, cc.spawn(move_up, hide), close));
    }
}
