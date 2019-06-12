// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        Node_FishBowls: cc.Node,
        Node_BG: cc.Node,
        Node_Submarine: cc.Node,

        Node_Dian_Tips: cc.Node,

        Lbl_OnTimes: cc.Label,
        Lbl_Gold: cc.Label,
        Lbl_Money: cc.Label,
        LBL_PriceTimes: cc.Label,

        Lbl_LevelSB: cc.Label,
        Lbl_LevelG: cc.Label,

        Scroll_BG: cc.ScrollView,
        Node_TransBar: cc.Node,

        Pre_FishBowl: cc.Prefab,

        Btn_Open: cc.Node,
        BT_USER: cc.Node,

        _initOpenBtnY: -488,
        _Sign_Data: null,
    },

    // LIFE-CYCLE CALLBACKS:

    update(dt) {

    },

    onLoad() {
        this._initOpenBtnY = -488;
    },

    // 更新游戏信息
    updateGameInfo() {

    },

    UpdateSignStatus() {
        let red = this.BT_USER.getChildByName("dian_red");
        // if (this._Sign_Data && this._Sign_Data.sign === 1 && !red.active) {
        //     console.log("签到是否结束-------------------------------------------------------");
        //     return;
        // }
        HTTP.sendRequest('sign/Looksign', (data) => {
            // console.log("签到-------------------------------------------------------");
            // console.log(data);
            this._Sign_Data = data.data;
            if (this._Sign_Data.sign === 0 && !red.active) {
                // console.log("是否进入----->1");
                red.active = true;
            }
            if (this._Sign_Data.sign === 1 && red.active) {
                // console.log("是否进入----->2");
                red.active = false;
            }
        }, { uid: DataHelper.Uid });
    },

    // 添加鱼缸
    addFishBowl(data) {
        let fishbowlNode = cc.instantiate(this.Pre_FishBowl);
        fishbowlNode.y = -(GameConfig.HEIGHT_FB - 14) * this.Node_FishBowls.childrenCount - GameConfig.HEIGHT_FB / 2 + 16;
        fishbowlNode.name = 'fishbow_' + this.Node_FishBowls.childrenCount;
        this.Node_FishBowls.addChild(fishbowlNode);
        fishbowlNode.getComponent('FishBowl').init(data);
        this.Btn_Open.y = this._initOpenBtnY - (GameConfig.HEIGHT_FB - 16) * this.Node_FishBowls.childrenCount;
        this.Btn_Open.active = false;
        // this.gameBegin = true;
        if (this.Node_FishBowls.childrenCount == 1) {
            DataHelper.setSubmarineData(this.GameData.submarine.level);
            this.setSubmarine(this.GameData.submarine);
            this.beginGame();
        }
    },

    start() {
        this.initView();
        this.updateGameInfo();
    },

    initView() {
        window.GameControl = this;
        GameConfig.Game_Type = 1;
        this.GameData = DataHelper.GameData_Shallow;
        Global.GameData = this.GameData;
        window.GameSceneData = this.GameData;
        this.setSubmarine(this.GameData.submarine);
        this.setFishBowl(this.GameData.fishbowls);
        this.setTransBar(this.GameData.transport);
        console.log("金币数---------------------------------->");
        console.log(GameTools.formatGold(DataHelper.Gold_Num));
        this.Lbl_Gold.string = GameTools.formatGold(DataHelper.Gold_Num);
        this.Lbl_Money.string = DataHelper.Money_Num;
        this.Lbl_LevelSB.string = this.GameData.submarine.level;
        this.LBL_PriceTimes.string = 'x' + DataHelper.Price_Times;

        HandleMgr.addHandle('ValueChanged_Gold', (data) => {
            this.Lbl_Gold.string = GameTools.formatGold(DataHelper.Gold_Num);
            this.GameData = DataHelper.GameData_Shallow;
            window.GameSceneData = this.GameData;
            this.Lbl_LevelSB.string = this.GameData.submarine.level;
        }, this);

        HandleMgr.addHandle('ValueChanged_Money', (data) => {
            this.Lbl_Money.string = DataHelper.Money_Num;
        }, this);

        HandleMgr.addHandle('ValueChanged_PriceTimes', (data) => {
            this.LBL_PriceTimes.string = 'x' + data;
        }, this);

        ViewHelper.setOpenPrice(this.GameData.fishbowls);
        // if (this.Node_FishBowls.childrenCount <= 0) {
        //     return;
        // }

        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.log('show');
            this.getOffLineReward();
        });
        cc.game.on(cc.game.EVENT_HIDE, () => {
            cc.log('hide');
            GameTools.setItemByLocalStorage('LastTime', (new Date()).getTime());
        });

        this.beginGame();

        // DataHelper.getOffLineGold();
        this.setBaoXiang();

        this.getOffLineReward();

        this.beginTimer();

    },

    onScroll(scrollview, eventType, customEventData) {
        if (eventType == cc.ScrollView.EventType.SCROLLING) {
            var p = scrollview.getScrollOffset();

            var topLine = p.y;

            cc.find('BT_TO_UP', this.node).active = topLine > 410;

            var bottomLine = p.y + this.node.height;


            cc.find('BT_TO_DOWN', this.node).active = this.bottom_y > bottomLine;

        } else if (eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM) {

        } else if (eventType == cc.ScrollView.EventType.BOUNCE_TOP) {

        }
    },

    onBtnClicked(event, data) {
        switch (event.target.name) {
            case 'BT_OPEN':
                // 开启按钮
                HTTP.sendRequest('sign/openfishtank', (res) => {
                    if (res.status == 0) {
                        GameTools.dialog('请求错误', res.msg, null);
                        return;
                    }
                    DataHelper.setMoneyNum(parseInt(res.data.money));
                    HandleMgr.sendHandle('ValueChanged_Money', null);

                    this.addFishBowl(res.data);
                }, { uid: DataHelper.Uid, type: GameConfig.Game_Type, cost: event.target.price });
                break;
            case 'BT_USER':
                // 用户页面
                ViewHelper.showNodeWithName('UserInfoNode');
                break;
            case 'BT_UP_SB':
                // 升级潜艇
                ViewHelper.showNodeWithName('UpSubmarineNode');
                break;
            case 'BT_UP_GUEST':
                // 游客升级
                ViewHelper.initUpGuestNode();
                break;
            case 'BT_TO_DOWN':
                // 滑动到鱼缸最底部
                this.Scroll_BG.scrollTo(cc.v2(0, this.bottom_y));
                break;
            case 'BT_TO_UP':
                // 滑动到顶部
                this.Scroll_BG.scrollToTop();
                break;
            case 'BT_TS':
                ViewHelper.showNodeWithName('TiShengNode');
                break;
            default:
                break;
        }

        switch (data) {
            case "StoreNode":
            case 'AllSuiPianNode':
            case 'Page_Achievement':
            case "Page_Rangking":
                ViewHelper.showNodeWithName(data);
                break
            default:
                break;
        }
    },

    beginGame() {
        this.TransBar.beginMove(() => {
            this.Submarine.starMove(() => {
                this.beginGame();
            });
        }, (type, count) => {
            this.Submarine.addGuest(type, count);
            console.log('getInComeNum------------->' + JSON.stringify(DataHelper.getInComeNum(type).toString()));
            var price = BigNumber(DataHelper.getInComeNum(type)).times(DataHelper.Price_Times);
            console.log('游客类型：' + type + ' 游客等级：' + this.GameData.guest[type - 1] + ' 得到门票：' + GameTools.formatGold(price)
                + ' 得到门票：' + price);
            console.log('当前金币：' + BigNumber(DataHelper.Gold_Num).plus(price).toString());
            DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).plus(price).toString());
            this.Lbl_Gold.string = GameTools.formatGold(DataHelper.Gold_Num);
            this.Lbl_OnTimes.string = GameTools.formatGold(DataHelper.getOnTimeGold()) + '/s';
            cc.log('即时收益------->' + GameTools.formatGold(DataHelper.getOnTimeGold()));
            cc.log('离线收益------->' + GameTools.formatGold(DataHelper.getOffLineGold()));

        });

    },

    setTransBar(data) {
        this.TransBar = this.Node_TransBar.getComponent('TransportBar');
        Global.TransBar = this.TransBar;
        this.TransBar.init(parseInt(data.level));
    },

    setSubmarine(data) {
        this.Submarine = this.Node_Submarine.getComponent('Submarine');
        Global.Submarine = this.Submarine;
        this.Submarine.init(parseInt(data.level));
    },

    setFishBowl(data) {
        for (let i = 0; i < data.length; i++) {
            let fishbowlNode = cc.instantiate(this.Pre_FishBowl);
            fishbowlNode.name = 'fishbow_' + i;
            fishbowlNode.getComponent('FishBowl').init(data[i]);
            fishbowlNode.zIndex = -this.Node_FishBowls.childrenCount;
            fishbowlNode.y = -(GameConfig.HEIGHT_FB - 14) * this.Node_FishBowls.childrenCount - GameConfig.HEIGHT_FB / 2 + 16;
            this.Node_FishBowls.addChild(fishbowlNode);
        }
        this.bottom_y = 410 + (GameConfig.HEIGHT_FB - 14) * this.Node_FishBowls.childrenCount;
        cc.find('BT_TO_DOWN', this.node).active = this.bottom_y > GameConfig.DEVICE_HEIGHT;
    },

    setBaoXiang() {
        let time = GameTools.GetRandom(0, 300);
        let floor = GameTools.GetRandom(0, this.Node_FishBowls.childrenCount - 1);
        this.scheduleOnce(() => {
            let Fish_Node = this.Node_FishBowls.children[floor];
            Fish_Node.getComponent('FishBowl').showBaoXiang();
            this.setBaoXiang();
        }, time);
    },

    beginTimer() {
        var fn = () => {
            this.UpdateSignStatus();
            HTTP.sendRequest('Hall/Gamesync', (data) => {
                if (data.status == 0) {
                    return;
                }
                data = data.data;
                DataHelper.Data_Sync = data;

            }, { uid: DataHelper.Uid });
            GameTools.setItemByLocalStorage('LastTime', (new Date()).getTime());
        }
        fn();
        this.schedule(fn, 10);
    },

    getOffLineReward() {
        let nowTime = (new Date()).getTime();
        let lastTime = GameTools.getItemByLocalStorage('LastTime');
        if (!lastTime) {
            return;
        }
        cc.log('离线时间');
        cc.log(nowTime - lastTime);
        if (nowTime - lastTime > 30000) {
            let time = ((nowTime - lastTime) / 1000).toFixed(0);
            let gold = BigNumber(DataHelper.getOffLineGold()).times(time).toString();
            // let num_1 = parseInt(gold);
            // let num_2 = parseInt(this.Lbl_Gold.string);
            // let sum = num_1 + num_2;
            // this.Lbl_Gold.string = sum + "";
            cc.find('Canvas/OffLineComeNode').getComponent('OffRewardView').show(gold, time);
        }
    }

    // update (dt) {},

});