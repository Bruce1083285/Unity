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
     * @property [Prefab]名次框
     */
    @property(cc.Prefab)
    private RankingBox: cc.Prefab = null;
    /**
     * @property 每页展示数
     */
    @property
    private Show_Num: number = 0;
    /**
     * @property 排行榜内容
     */
    private RankContent: cc.Node = null;
    /**
     * @property 下一页排名索引值
     */
    private RankBeginIndex: number = 0;
    // /**
    //  * @property 上一页排名索引值
    //  */
    // private RankBeginIndex: number = 0;
    /**
     * @property 微信数据
     */
    private Wx_Cache: any[] = [];
    /**
     * @property 名次框对象池
     */
    private Pool_RankingBox: cc.NodePool = new cc.NodePool();

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
        this.RankContent = this.node.getChildByName("RankContent");
        this.SetPool();
        this.GetMessage();

    }

    /**
     * 获取主域消息
     */
    GetMessage() {
        //接受主域传递的消息
        wx.onMessage(data => {
            if (data.direction) {
                if (data.direction === "right") {
                    // if (this.Wx_Cache.length < this.Show_Num) {
                    //     return;
                    // }
                    // this.WxCacheSort();
                    if (this.RankBeginIndex >= this.Wx_Cache.length) {
                        return;
                    }
                    this.ReversionPool();
                    this.SetNextPage();
                }
                if (data.direction === "left") {
                    // if (this.Wx_Cache.length < this.Show_Num) {
                    //     return;
                    // }
                    // this.WxCacheSort();
                    this.ReversionPool();
                    this.SetPreviousPage();
                }
                // console.log(data.direction + "方向");
            }
            if (data.update === "update") {
                // console.log("是否更新");
                //获取好友托管数据（包括用户自己）
                wx.getFriendCloudStorage({
                    keyList: ['tier'], // 你要获取的、托管在微信后台都key
                    success: res => {
                        // console.log(JSON.stringify(res.data[0]) + "||层数");
                        this.Wx_Cache = res.data;
                        // this.test();
                        this.WxCacheSort();
                        this.ReversionPool();
                        this.UpdateRank();

                    }
                });// 开放数据域顺利拿到shareTicket
            }
        });
    }

    test() {
        for (let i = 0; i < 41; i++) {
            let ran = Math.floor(Math.random() * this.Wx_Cache.length);
            let ran_level = Math.floor(Math.random() * 50);
            this.Wx_Cache[ran].KVDataList[0].value = ran_level + "";
            this.Wx_Cache.push(this.Wx_Cache[ran]);
        }
    }

    /**
     * 设置对象池
     */
    SetPool() {
        for (let i = 0; i < this.Show_Num; i++) {
            let rankingbox = cc.instantiate(this.RankingBox);
            this.Pool_RankingBox.put(rankingbox);
        }
    }

    /**
     * 回收对象池
     */
    private ReversionPool() {
        let num = 0;
        let content_arr = this.RankContent.children;
        // console.log(content_arr.length + "子节点长度");
        if (content_arr.length > 0) {
            for (let i = 0; i < content_arr.length; i++) {
                this.Pool_RankingBox.put(content_arr[i]);
                i--;
                num++;
            }
        }
        // console.log(num);
        // console.log(this.Pool_RankingBox);
    }

    /**
     * 微信托管数据排序
     */
    private WxCacheSort() {
        let item = null;
        for (let i = 0; i < this.Wx_Cache.length; i++) {
            for (let j = 0; j < this.Wx_Cache.length; j++) {
                let ran_1 = parseInt(this.Wx_Cache[i].KVDataList[0].value)
                let ran_2 = parseInt(this.Wx_Cache[j].KVDataList[0].value);
                if (ran_1 > ran_2) {
                    item = this.Wx_Cache[i];
                    this.Wx_Cache[i] = this.Wx_Cache[j];
                    this.Wx_Cache[j] = item;
                }
            }
        }
    }

    /**
     * 更新排行榜数据
     */
    UpdateRank() {
        // console.log(this.Wx_Cache);
        let length = 0;
        if (this.Wx_Cache.length <= this.Show_Num) {
            length = this.Wx_Cache.length;
        } else {
            length = this.Show_Num;
            this.RankBeginIndex = this.Show_Num;
            this.RankBeginIndex = this.Show_Num;
        }
        for (let i = 0; i < length; i++) {
            let rankingbox = this.Pool_RankingBox.get();
            if (!rankingbox) {
                this.SetPool();
                rankingbox = this.Pool_RankingBox.get();
            }

            //昵称
            rankingbox.getChildByName("name").getComponent(cc.Label).string = this.Wx_Cache[i].nickname;

            //头像，通过图片路径加载图片
            cc.loader.load({ url: this.Wx_Cache[i].avatarUrl, type: 'png' }, (err, texture) => {
                if (err) console.error(err);
                let userIcon = rankingbox.getChildByName('WX_TX').getComponent(cc.Sprite);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });

            //名次
            rankingbox.getChildByName("ranking_num").getComponent(cc.Label).string = i + 1 + "";

            //层数
            rankingbox.getChildByName("tier_num").getComponent(cc.Label).string = this.Wx_Cache[i].KVDataList[0].value;

            this.RankContent.addChild(rankingbox);
        }
    }

    /**
     * 设置下一页
     */
    SetNextPage() {
        // console.log("下一页");
        if (this.Wx_Cache.length - this.RankBeginIndex <= this.Show_Num) {
            // console.log("翻页结束");
            let j = 0;
            for (let i = this.RankBeginIndex; i < this.Wx_Cache.length; i++) {
                this.SetRankBox(j, i);
                j++;
            }
            if (this.Wx_Cache.length > this.RankBeginIndex) {
                this.RankBeginIndex += this.Show_Num;
                // console.log("排行榜开始索引--->1" + this.RankBeginIndex);
                // console.log("显示数--->1" + this.Show_Num);
            }
            return;
        }
        let length = this.Wx_Cache.length - this.RankBeginIndex;
        if (length <= this.Show_Num) {
            length = this.Wx_Cache.length;
        } else {
            length = this.RankBeginIndex + this.Show_Num;
        }
        // console.log(length + "长度");
        let j = 0;
        for (let i = this.RankBeginIndex; i < length; i++) {
            // console.log("是否进入");
            this.SetRankBox(j, i);
            j++;
        }
        this.RankBeginIndex += this.Show_Num;
        // console.log("数据长度" + this.Wx_Cache.length);
        // console.log("排行榜开始索引--->2" + this.RankBeginIndex);
        // console.log("显示数--->2" + this.Show_Num);
    }

    /**
     * 设置上一页
     */
    SetPreviousPage() {
        // console.log("排行榜开始索引--->3" + this.RankBeginIndex);
        // console.log("显示数--->3" + this.Show_Num);
        if (this.Wx_Cache.length <= this.Show_Num) {
            // console.log("只有一页");
            this.UpdateRank();
            return;
        }
        let ind = this.RankBeginIndex - this.Show_Num * 2;
        let length = this.RankBeginIndex - this.Show_Num;
        if (ind < 0) {
            // console.log("无法再上一页");
            this.UpdateRank();
            return;
        }
        console.log("下标索引" + ind);
        let j = 0;
        for (let i = ind; i < length; i++) {
            // console.log("是否进入");
            this.SetRankBox(j, i);
            j++;
        }
        this.RankBeginIndex = length;
    }

    /**
     * 设置排行榜盒子数据
     * @param box_ind 盒子下标索引
     * @param wx_ind 微信数据下标索引
     */
    SetRankBox(box_ind: number, wx_ind: number) {
        // console.log("设置数据盒子" + this.Wx_Cache[wx_ind].nickname);
        let rankingbox = this.Pool_RankingBox.get();
        if (!rankingbox) {
            this.SetPool();
            rankingbox = this.Pool_RankingBox.get();
        }

        //昵称
        rankingbox.getChildByName("name").getComponent(cc.Label).string = this.Wx_Cache[wx_ind].nickname;

        //头像
        let patch_node = rankingbox;
        cc.loader.load({ url: this.Wx_Cache[wx_ind].avatarUrl, type: 'png' }, (err, texture) => {
            if (err) console.error(err);
            let userIcon = patch_node.getChildByName('WX_TX').getComponent(cc.Sprite);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
            // console.log(patch_node);
        });

        //名次
        rankingbox.getChildByName("ranking_num").getComponent(cc.Label).string = wx_ind + 1 + "";
        // console.log("名次" + (wx_ind + 1));

        //层数
        rankingbox.getChildByName("tier_num").getComponent(cc.Label).string = this.Wx_Cache[wx_ind].KVDataList[0].value;
        this.RankContent.addChild(rankingbox);
    }
}
