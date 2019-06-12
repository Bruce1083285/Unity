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
        /**
         * @property 世界排行榜
         */
        Ranking_World: cc.Node,
        /**
         * @property 好友排行榜
         */
        Ranking_Friend: cc.Node,
        /**
         * @property 排行榜内容节点
         */
        RankContent_Friend: cc.Node,
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
        _Wx_Cache: [],
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

    /**
     * 初始化
     */
    Init() {
        //实例化对象池
        this._Pool_RankingBox = new cc.NodePool();
        this.SetPool();

        this.ShowWorld();
        this.GetMessage();
    },

    /**
     * 获取主域消息
     */
    GetMessage() {
        wx.onMessage((data) => {
            console.log("接受主域消息--------------------------------->");
            console.log(data);
            //显示榜单
            if (data.Ranking) {
                let ranking_Type = data.Ranking;
                if (ranking_Type === "world") {
                    this.ShowWorld();
                }
                if (ranking_Type === "friends") {
                    this.ShowFriends();
                }
            }

            //上下页
            if (data.Direction) {
                if (data.Direction === "right") {
                    if (this.Ranking_Friend.active) {
                        // if (this._Wx_Cache.length < this.Show_Num) {
                        //     return;
                        // }
                        // this.WxCacheSort();
                        if (this._RankBeginIndex >= this._Wx_Cache.length) {
                            return;
                        }
                        this.ReversionPool();
                        this.SetNextPage();
                    }
                }
                if (data.Direction === "left") {
                    if (this.Ranking_Friend.active) {
                        // if (this._Wx_Cache.length < this.Show_Num) {
                        //     return;
                        // }
                        // this.WxCacheSort();
                        this.ReversionPool();
                        this.SetPreviousPage();
                    }
                }
                console.log(data.Direction + "方向");
            }

            //更新数据
            if (data.update === "update") {
                console.log("是否更新");
                //获取好友托管数据（包括用户自己）
                wx.getFriendCloudStorage({
                    keyList: ['coin'], // 你要获取的、托管在微信后台都key
                    success: res => {
                        console.log(JSON.stringify(res.data[0]) + "||层数");
                        this._Wx_Cache = res.data;
                        this.test();
                        this.WxCacheSort();
                        this.ReversionPool();
                        this.UpdateRank();

                    }
                });// 开放数据域顺利拿到shareTicket
            }
        })
    },

    /**
     * 测试
     */
    test() {
        for (let i = 0; i < 41; i++) {
            let ran = Math.floor(Math.random() * this._Wx_Cache.length);
            let ran_level = Math.floor(Math.random() * 50);
            this._Wx_Cache[ran].KVDataList[0].value = ran_level + "";
            this._Wx_Cache.push(this._Wx_Cache[ran]);
        }
    },

    /**
     * 显示世界排行榜
     */
    ShowWorld() {
        this.Ranking_World.active = true;
        this.Ranking_Friend.active = false;
    },

    /**
     * 显示好友排行榜
     */
    ShowFriends() {
        this.Ranking_World.active = false;
        this.Ranking_Friend.active = true;
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
        let content_arr = this.RankContent_Friend.children;
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
     * 微信托管数据排序
     */
    WxCacheSort() {
        let item = null;
        for (let i = 0; i < this._Wx_Cache.length; i++) {
            for (let j = 0; j < this._Wx_Cache.length; j++) {
                let ran_1 = parseInt(this._Wx_Cache[i].KVDataList[0].value)
                let ran_2 = parseInt(this._Wx_Cache[j].KVDataList[0].value);
                if (ran_1 > ran_2) {
                    item = this._Wx_Cache[i];
                    this._Wx_Cache[i] = this._Wx_Cache[j];
                    this._Wx_Cache[j] = item;
                }
            }
        }
    },

    /**
     * 更新排行榜数据
     */
    UpdateRank() {
        console.log(this._Wx_Cache);
        let length = 0;
        if (this._Wx_Cache.length <= this.Show_Num) {
            length = this._Wx_Cache.length;
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
            rankingbox.getChildByName("name").getComponent(cc.Label).string = this._Wx_Cache[i].nickname;

            //头像，通过图片路径加载图片
            cc.loader.load({ url: this._Wx_Cache[i].avatarUrl, type: 'png' }, (err, texture) => {
                if (err) console.error(err);
                let userIcon = rankingbox.getChildByName('Head').getChildByName("icon").getComponent(cc.Sprite);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });

            //名次
            rankingbox.getChildByName("label_ranking").getComponent(cc.Label).string = i + 1 + "";

            //层数
            rankingbox.getChildByName("Coin").getChildByName("label").getComponent(cc.Label).string = this._Wx_Cache[i].KVDataList[0].value;

            this.RankContent_Friend.addChild(rankingbox);
        }
    },

    /**
     * 设置下一页
     */
    SetNextPage() {
        console.log("下一页");
        if (this._Wx_Cache.length - this._RankBeginIndex <= this.Show_Num) {
            console.log("翻页结束");
            let j = 0;
            for (let i = this._RankBeginIndex; i < this._Wx_Cache.length; i++) {
                this.SetRankBox(j, i);
                j++;
            }
            if (this._Wx_Cache.length > this._RankBeginIndex) {
                this._RankBeginIndex += this.Show_Num;
                console.log("排行榜开始索引--->1" + this._RankBeginIndex);
                console.log("显示数--->1" + this.Show_Num);
            }
            return;
        }
        let length = this._Wx_Cache.length - this._RankBeginIndex;
        if (length <= this.Show_Num) {
            length = this._Wx_Cache.length;
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
        console.log("数据长度" + this._Wx_Cache.length);
        console.log("排行榜开始索引--->2" + this._RankBeginIndex);
        console.log("显示数--->2" + this.Show_Num);
    },

    /**
     * 设置上一页
     */
    SetPreviousPage() {
        console.log("排行榜开始索引--->3" + this._RankBeginIndex);
        console.log("显示数--->3" + this.Show_Num);
        if (this._Wx_Cache.length <= this.Show_Num) {
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
        console.log("设置数据盒子" + this._Wx_Cache[wx_ind].nickname);
        let rankingbox = this._Pool_RankingBox.get();
        if (!rankingbox) {
            this.SetPool();
            rankingbox = this._Pool_RankingBox.get();
        }

        //昵称
        rankingbox.getChildByName("name").getComponent(cc.Label).string = this._Wx_Cache[wx_ind].nickname;

        //头像
        let patch_node = rankingbox;
        cc.loader.load({ url: this._Wx_Cache[wx_ind].avatarUrl, type: 'png' }, (err, texture) => {
            if (err) console.error(err);
            let userIcon = rankingbox.getChildByName('Head').getChildByName("icon").getComponent(cc.Sprite);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
            console.log(patch_node);
        });

        //名次
        rankingbox.getChildByName("label_ranking").getComponent(cc.Label).string = wx_ind + 1 + "";
        console.log("名次" + (wx_ind + 1));

        //层数
        rankingbox.getChildByName("Coin").getChildByName("label").getComponent(cc.Label).string = this._Wx_Cache[wx_ind].KVDataList[0].value;
        this.RankContent_Friend.addChild(rankingbox);
    },
});
