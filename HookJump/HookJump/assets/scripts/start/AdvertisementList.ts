import WX from "../common/WX";

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
export default class AdvList extends cc.Component {

    /**
     * @property 广告
     */
    @property(cc.Prefab)
    private Adv: cc.Prefab = null;
    /**
     * @property 内容
     */
    private Content: cc.Node = null;
    /**
     * @property 按钮父节点
     */
    private Buts: cc.Node = null;
    /**
     * @property 按钮开
     */
    private But_Open: cc.Node = null;
    /**
     * @property 按钮关
     */
    private But_Close: cc.Node = null;
    /**
     * @property 点击事件处理程序
     */
    private ClickEventHandler: cc.Component.EventHandler = null;
    /**
     * @property 广告对象池
     */
    private Pool_Adv: cc.NodePool = new cc.NodePool();

    // onLoad () {}

    start() {
        // this.Init();
    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Buts = this.node.getChildByName("Buts");
        this.But_Open = this.Buts.getChildByName("but_Open");
        this.But_Close = this.Buts.getChildByName("but_Close");
        this.Content = this.node.getChildByName("Content").getChildByName("content");

        this.SetPool();
        this.SetContent();
    }

    /**
     * 按钮点击事件
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        switch (click) {
            case "open":
                this.OpenAdvList();
                break;
            case "close":
                this.CloseAdvList();
                break;
            default:
                break;
        }
    }

    /**
     * 打开广告列表
     */
    private OpenAdvList() {
        let move = cc.moveBy(0.3, 330, 0);
        let callbacks = cc.callFunc(() => {
            this.But_Open.active = false;
            this.But_Close.active = true;
        });
        this.node.runAction(cc.sequence(move, callbacks));
    }

    /**
     * 关闭广告列表
     */
    private CloseAdvList() {
        let move = cc.moveBy(0.3, -330, 0);
        let callbacks = cc.callFunc(() => {
            this.But_Open.active = true;
            this.But_Close.active = false;
        });
        this.node.runAction(cc.sequence(move, callbacks));
    }

    /**
     * 设置对象池
     */
    private SetPool() {
        for (let i = 0; i < 5; i++) {
            let adv = cc.instantiate(this.Adv);
            this.Pool_Adv.put(adv);
        }
    }

    /**
     * 设置内容
     */
    private SetContent() {
        // console.log("微信广告数据");
        // console.log(WX.Adver);
        for (let k in WX.Adver) {

            let adv = this.Pool_Adv.get();
            if (!adv) {
                this.SetPool();
                adv = this.Pool_Adv.get();
            }

            cc.loader.load({ url: WX.Adver[k].icon_uri, type: 'jpg' }, (err, texture) => {
                if (err) console.error(err);
                let adv_icon = adv.getChildByName("adv").getComponent(cc.Sprite);
                // console.log("广告图片");
                // console.log(WX.Adver[k].icon_uri);
                // console.log(texture);
                adv_icon.spriteFrame = new cc.SpriteFrame(texture);
            });

            let adv_name = adv.getChildByName("name").getComponent(cc.Label);
            // console.log("广告名字");
            // console.log(WX.Adver[k].name);
            adv_name.string = WX.Adver[k].name;

            let ClickEventHandler = new cc.Component.EventHandler();
            ClickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            ClickEventHandler.component = "AdvertisementList";//这个是代码文件名
            ClickEventHandler.handler = "AdvButton";
            ClickEventHandler.customEventData = WX.Adver[k].appid + "|" + WX.Adver[k].path;
            adv.addComponent(cc.Button);
            var button = adv.getComponent(cc.Button);
            button.clickEvents.push(ClickEventHandler);

            this.Content.addChild(adv);
        }
    }

    /**
     * 广告列表按钮
     * @param lv 
     * @param customEventData 点击参数
     */
    private AdvButton(lv: any, customEventData: string) {
        // console.log("appid:" + customEventData);
        let arr = customEventData.split("|");
        // WX.NavigateToMiniProgram(arr[0], arr[1]);
    }
}
