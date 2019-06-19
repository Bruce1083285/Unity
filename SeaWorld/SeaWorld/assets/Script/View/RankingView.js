// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        //世界排行榜
        Ranking_World: cc.Node,
        //好友排行榜
        Ranking_Friends: cc.Node,
        /**
        * @property 排行榜内容节点
        */
        RankContent_World: cc.Node,
        //用户名次label
        User_Ranking: cc.Label,
        //用户金币数label
        User_GoldNum: cc.Label,
        /**
         * @property 名次框
         */
        RankingBox: cc.Prefab,
        /**
         * @property 每页展示数
         */
        Show_Num: 6,
        /**
         * @property 下一页排名索引值
         */
        _RankBeginIndex: 0,
        /**
         * @property 微信数据
         */
        _World_Data: [],
        /**
         * @property 名次框对象池
         */
        _Pool_RankingBox: cc.NodePool,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Init();
    },

    start() {

    },

    // update (dt) {},

    Init() {
        this._Pool_RankingBox = new cc.NodePool();
        this.SetPool();

        //获取开放数据域
        if (window.wx) {
            this.OpenDataContext = wx.getOpenDataContext();
        }

        this.ShowWorld();
        this.GetRankingWorld();
    },

    /**
     * 获取世界排行榜
     */
    GetRankingWorld() {
        console.log("世界排行榜--------------->1");
        HTTP.sendRequest('Hall/RankList', (data) => {
            console.log("世界排行榜--------------->2");
            console.log(data);
            this._World_Data = data.data;
            // this.WxCacheSort();
            this.ReversionPool();
            this.UpdateRank();
            this.SetUserRanking();
            this.SetWxUpdateCache();
        });
    },

    /**
    * 设置微信存储
    */
    SetWxUpdateCache() {
        console.log("是否进入===========================================1");
        if (!window.wx) {
            return;
        }
        console.log("是否进入===========================================2");
        console.log(DataHelper.Uid + "Uid");
        console.log(this._World_Data);
        HTTP.sendRequest('Weixin/Getopenid', (data) => {
            console.log("用户OpenID--------------------------->");
            console.log(data);
            // console.log("最大关卡数：" + max_str);
            console.log("金币金币金币金币金币金币金币金币金币金币金币金币");
            console.log(DataHelper.Gold_Num);
            let gold_num = "0";
            for (let i = 0; i < this._World_Data.length; i++) {
                let obj = this._World_Data[i];
                if (obj.uid === DataHelper.Uid) {
                    console.log("收入====================================");
                    console.log(obj);
                    console.log(obj.income);
                    console.log(typeof (obj.income));
                    let num = 0;
                    if (!this.IsNull(obj.income)) {
                        // num = parseInt(obj.income);
                        gold_num = obj.income;
                    }
                    break;
                }
            }
            console.log(gold_num);
            //设置用户托管数据
            wx.setUserCloudStorage({
                KVDataList: [{ key: 'coin', value: gold_num }],
                success: res => {
                    // console.log(res);
                    // console.log(res + "成功");
                    // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                    let openDataContext = wx.getOpenDataContext();
                    openDataContext.postMessage({
                        update: "update",
                        openid: data.data,
                    });
                },
                fail: res => {
                    console.log(res);
                }
            });
        }, { uid: DataHelper.Uid });
    },

    /**
     * 按钮点击
     * @param {*} event 事件信息
     * @param {string} click 点击参数
     */
    ButtonClick(event, click) {
        HandleMgr.sendHandle('Audio_Click');
        switch (click) {
            case "close":
                this.Hide();
                break
            case "friend":
                this.ShowFriends();
                break;
            case "world":
                this.ShowWorld();
                break;
            case "left":
                this.BackPage();
                break;
            case "right":
                this.NextPage();
                break;
            default:
                break;
        }
    },

    /**
     * 隐藏节点
     */
    Hide() {
        this.node.active = false;
    },

    /**
     * 显示世界排行榜
     */
    ShowWorld() {
        // this.OpenDataContext.postMessage(
        //     {
        //         Ranking: "world",
        //     }
        // );
        this.Ranking_World.active = true;
        this.Ranking_Friends.active = false;
    },

    /**
     * 显示世界排行榜
     */
    ShowFriends() {
        // this.OpenDataContext.postMessage(
        //     {
        //         Ranking: "friends",
        //     }
        // );
        this.Ranking_World.active = false;
        this.Ranking_Friends.active = true;
    },

    /**
     * 上一页
     */
    BackPage() {
        if (this.Ranking_World.active) {
            this.ReversionPool();
            this.SetPreviousPage();
            return;
        }
        this.OpenDataContext.postMessage(
            {
                Direction: "left",
            }
        );
    },

    /**
     * 下一页
     */
    NextPage() {
        if (this.Ranking_World.active) {
            if (this._RankBeginIndex >= this._World_Data.length) {
                return;
            }
            this.ReversionPool();
            this.SetNextPage();
            return;
        }
        this.OpenDataContext.postMessage(
            {
                Direction: "right",
            }
        );
    },

    /**
        * 设置对象池
        */
    SetPool() {
        for (let i = 0; i < this.Show_Num; i++) {
            let rankingbox = cc.instantiate(this.RankingBox);
            this._Pool_RankingBox.put(rankingbox);
        }
    },

    /**
     * 回收对象池
     */
    ReversionPool() {
        let num = 0;
        let content_arr = this.RankContent_World.children;
        console.log(content_arr.length + "子节点长度");
        if (content_arr.length > 0) {
            for (let i = 0; i < content_arr.length; i++) {
                this._Pool_RankingBox.put(content_arr[i]);
                i--;
                num++;
            }
        }
        console.log(num);
        console.log(this._Pool_RankingBox);
    },

    /**
     * 数据排序
     */
    DataCacheSort() {
        let item = null;
        for (let i = 0; i < this._World_Data.length; i++) {
            for (let j = 0; j < this._World_Data.length; j++) {
                let ran_1 = parseInt(this._World_Data[i].KVDataList[0].value)
                let ran_2 = parseInt(this._World_Data[j].KVDataList[0].value);
                if (ran_1 > ran_2) {
                    item = this._World_Data[i];
                    this._World_Data[i] = this._World_Data[j];
                    this._World_Data[j] = item;
                }
            }
        }
    },

    /**
     * 更新排行榜数据
     */
    UpdateRank() {
        console.log(this._World_Data);
        let length = 0;
        if (this._World_Data.length <= this.Show_Num) {
            length = this._World_Data.length;
        } else {
            length = this.Show_Num;
            this._RankBeginIndex = this.Show_Num;
            this._RankBeginIndex = this.Show_Num;
        }
        for (let i = 0; i < length; i++) {
            let rankingbox = this._Pool_RankingBox.get();
            if (!rankingbox) {
                this.SetPool();
                rankingbox = this._Pool_RankingBox.get();
            }

            //昵称
            rankingbox.getChildByName("name").getComponent(cc.Label).string = this._World_Data[i].nickname;

            if (!this.IsNull(this._World_Data[i].headimgurl)) {
                //头像，通过图片路径加载图片
                cc.loader.load({ url: this._World_Data[i].headimgurl, type: 'png' }, (err, texture) => {
                    if (err) console.error(err);
                    let userIcon = rankingbox.getChildByName('Head').getChildByName("icon").getComponent(cc.Sprite);
                    userIcon.spriteFrame = new cc.SpriteFrame(texture);
                });
            }

            //名次
            rankingbox.getChildByName("label_ranking").getComponent(cc.Label).string = i + 1 + "";

            // //性别
            // let isBoy = false;
            // if (this._World_Data[i].sex === "1") {
            //     isBoy = true;
            // }
            // rankingbox.getChildByName("Sex").getChildByName("boy").active = isBoy;
            // rankingbox.getChildByName("Sex").getChildByName("girl").active = !isBoy;

            //金币
            let income = 0;
            console.log("世界排行收入数据------------------------------->");
            console.log(this._World_Data[i].income);
            if (!this.IsNull(this._World_Data[i].income)) {
                let cha = this._World_Data[i].income.charAt(1);
                if (cha === "." || cha === "e") {
                    let arr_str = [];
                    for (let j = 0; j < this._World_Data[i].income.length; j++) {
                        let char = this._World_Data[i].income.charAt(j);
                        arr_str.push(char);
                    }
                    arr_str.splice(-3);
                    let str = "";
                    for (let j = 0; j < arr_str.length; j++) {
                        str += arr_str[j];
                    }
                    let num = parseFloat(str)
                    let beishu = Math.pow(10, 18)
                    income = num * beishu;
                } else {
                    income = parseInt(this._World_Data[i].income);
                }
            }
            rankingbox.getChildByName("Coin").getChildByName("label").getComponent(cc.Label).string = GameTools.formatGold(income);

            this.RankContent_World.addChild(rankingbox);
        }
    },

    /**
     * 设置下一页
     */
    SetNextPage() {
        console.log("下一页--------------------------------------->");
        console.log(this._World_Data);
        if (this._World_Data.length - this._RankBeginIndex <= this.Show_Num) {
            console.log("翻页结束");
            let j = 0;
            for (let i = this._RankBeginIndex; i < this._World_Data.length; i++) {
                this.SetRankBox(j, i);
                j++;
            }
            if (this._World_Data.length > this._RankBeginIndex) {
                this._RankBeginIndex += this.Show_Num;
                console.log("排行榜开始索引--->1" + this._RankBeginIndex);
                console.log("显示数--->1" + this.Show_Num);
            }
            return;
        }
        let length = this._World_Data.length - this._RankBeginIndex;
        if (length <= this.Show_Num) {
            length = this._World_Data.length;
        } else {
            length = this._RankBeginIndex + this.Show_Num;
        }
        console.log(length + "长度");
        let j = 0;
        for (let i = this._RankBeginIndex; i < length; i++) {
            console.log("是否进入");
            this.SetRankBox(j, i);
            j++;
        }
        this._RankBeginIndex += this.Show_Num;
        console.log("数据长度" + this._World_Data.length);
        console.log("排行榜开始索引--->2" + this._RankBeginIndex);
        console.log("显示数--->2" + this.Show_Num);
    },

    /**
     * 设置上一页
     */
    SetPreviousPage() {
        console.log("排行榜开始索引--->3" + this._RankBeginIndex);
        console.log("显示数--->3" + this.Show_Num);
        if (this._World_Data.length <= this.Show_Num) {
            console.log("只有一页");
            this.UpdateRank();
            return;
        }
        let ind = this._RankBeginIndex - this.Show_Num * 2;
        let length = this._RankBeginIndex - this.Show_Num;
        if (ind < 0) {
            console.log("无法再上一页");
            this.UpdateRank();
            return;
        }
        // console.log("下标索引" + ind);
        let j = 0;
        for (let i = ind; i < length; i++) {
            console.log("是否进入");
            this.SetRankBox(j, i);
            j++;
        }
        this._RankBeginIndex = length;
    },

    /**
     * 设置排行榜盒子数据
     * @param box_ind 盒子下标索引
     * @param wx_ind 微信数据下标索引
     */
    SetRankBox(box_ind, wx_ind) {

        let rankingbox = this._Pool_RankingBox.get();
        if (!rankingbox) {
            this.SetPool();
            rankingbox = this._Pool_RankingBox.get();
        }
        console.log("设置数据盒子" + this._World_Data[wx_ind].nickname);
        //昵称
        rankingbox.getChildByName("name").getComponent(cc.Label).string = this._World_Data[wx_ind].nickname;

        //头像
        if (!this.IsNull(this._World_Data[wx_ind].headimgurl)) {
            let patch_node = rankingbox;
            cc.loader.load({ url: this._World_Data[wx_ind].headimgurl, type: 'png' }, (err, texture) => {
                if (err) console.error(err);
                let userIcon = rankingbox.getChildByName('Head').getChildByName("icon").getComponent(cc.Sprite);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
                console.log(patch_node);
            });
        }

        //名次
        rankingbox.getChildByName("label_ranking").getComponent(cc.Label).string = wx_ind + 1 + "";
        console.log("名次" + (wx_ind + 1));

        // //性别
        // let isBoy = false;
        // if (this._World_Data[i].sex === "1") {
        //     isBoy = true;
        // }
        // rankingbox.getChildByName("Sex").getChildByName("boy").active = isBoy;
        // rankingbox.getChildByName("Sex").getChildByName("girl").active = !isBoy;

        //层数
        let income = 0;
        if (!this.IsNull(this._World_Data[wx_ind].income)) {
            let cha = this._World_Data[wx_ind].income.charAt(1);
            if (cha === "." || cha === "e") {
                let arr_str = [];
                for (let j = 0; j < this._World_Data[wx_ind].income.length; j++) {
                    let char = this._World_Data[wx_ind].income.charAt(j);
                    arr_str.push(char);
                }
                arr_str.splice(-3);
                let str = "";
                for (let j = 0; j < arr_str.length; j++) {
                    str += arr_str[j];
                }
                let num = parseFloat(str)
                let beishu = Math.pow(10, 18)
                income = num * beishu;
            } else {
                income = parseInt(this._World_Data[wx_ind].income);
            }
        }
        rankingbox.getChildByName("Coin").getChildByName("label").getComponent(cc.Label).string = GameTools.formatGold(income);
        this.RankContent_World.addChild(rankingbox);
    },

    /**
     * 设置用户排名
     */
    SetUserRanking() {
        let user_info = null;
        let ranking = 0;
        for (let i = 0; i < this._World_Data.length; i++) {
            user_info = this._World_Data[i];
            ranking = i + 1;
            if (user_info.uid === DataHelper.Uid) {
                break;
            }
        }
        console.log("世界排行用户排名信息-------------------------------------->1")
        console.log(user_info);
        console.log(DataHelper.Uid);
        console.log(ranking);

        console.log("世界排行用户排名信息-------------------------------------->2")
        this.User_Ranking.string = ranking + "";
        console.log("世界排行用户排名信息-------------------------------------->3")
        let num = 0;
        if (!this.IsNull(user_info.income)) {
            num = user_info.income
        }
        console.log(this.User_GoldNum.string);
        console.log(GameTools.formatGold(num));
        this.User_GoldNum.string = GameTools.formatGold(num);
        console.log("世界排行用户排名信息-------------------------------------->4")
    },

    IsNull(str) {
        if (str === "" || str === null) {
            return true;
        }
        return false;
    },
});
