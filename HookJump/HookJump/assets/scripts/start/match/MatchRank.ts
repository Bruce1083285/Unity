import WX from "../../common/WX";
import StartAudio from "../StartAudio";
import { SoundType } from "../../common/Enum";
import Http from "../../common/Http";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * @enum 榜单类型
 */
enum RankingType {
    /**金币 */
    Coin,
    /**奖品 */
    Prize,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchRank extends cc.Component {

    /**
     * @property 金币排行盒子
     */
    @property(cc.Prefab)
    private Coin_Rank_Box: cc.Prefab = null;
    /**
     * @property 奖品排行盒子
     */
    @property(cc.Prefab)
    private Prize_Rank_Box: cc.Prefab = null;
    /**
     * @property 游戏榜单标题
     */
    private Game_Title: cc.Node = null;
    /**
     * @property 游戏榜单
     */
    private Game_Rank: cc.Node = null;
    /**
     * @property 奖励榜单标题
     */
    private Prize_Title: cc.Node = null;
    /**
     * @property 奖励榜单
     */
    private Prize_Rank: cc.Node = null;
    /**
     * @property 金币榜单节点
     */
    private Coin_Ranking: cc.Node = null;
    /**
     * @property 当前榜单
     */
    private CurrentRanking: RankingType = null;
    /**
     * @property 用户游戏排名盒子
     */
    private User_Game_Ranking_Box: cc.Node = null;
    /**
     * @property 金币榜单单页下标索引
     */
    private Coin_Ranking_Index: number = 0;
    /**
     * @property 金币榜单单页显示数
     */
    private Coin_Ranking_Max_Num: number = 5;
    /**
     * @property 金币盒子对象池
     */
    private Pool_Coin_Box: cc.NodePool = new cc.NodePool();
    /**
     * @property 奖品榜单单页下标索引
     */
    private Prize_Ranking_Index: number = 0;
    /**
     * @property 奖品榜单单页显示数
     */
    private Prize_Ranking_Max_Num: number = 5;
    /**
     * @property 奖品榜单节点
     */
    private Prize_Ranking: cc.Node = null;
    /**
     * @property 奖品盒子对象池
     */
    private Pool_Prize_Box: cc.NodePool = new cc.NodePool();
    /**
     * @property 金币排行数据
     */
    private Coin_Rank_Data: any[] = [];
    /**
    * @property 金币排行数据
    */
    private Prize_Rank_Data: any[] = [];
    /**
     * @property 页数
     */
    private PageSize: number;
    /**
     * @property 页码
     */
    private PageIndex: number;
    // MaxPage_Gold: number;
    // MaxPage_Reward: number;

    onLoad() {

    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Game_Title = this.node.getChildByName("Title").getChildByName("title_2");
        this.Game_Rank = this.node.getChildByName("Game_Rank");
        this.Prize_Title = this.node.getChildByName("Title").getChildByName("title_1");
        this.Prize_Rank = this.node.getChildByName("Prize_Rank");
        this.User_Game_Ranking_Box = this.Game_Rank.getChildByName("Game_Rank_Box");
        // this.Coin_Ranking = this.node.getChildByName("Game_Rank").getChildByName("Rank_List");
        // this.Prize_Ranking = this.node.getChildByName("Prize_Rank").getChildByName("Rank_List");

        this.Game_Title.active = true;
        this.Game_Rank.active = true;
        this.Prize_Title.active = false;
        this.Prize_Rank.active = false;
        this.node.active = true;
        this.CurrentRanking = RankingType.Coin;
        this.PageSize = 6;
        this.PageIndex = 1;


        this.GetHttp();
        // this.show_Gold();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "close":
                this.node.active = false;
                this.node.parent.getChildByName("Page_Start").active = true;
                this.RecoveryPool(this.Pool_Coin_Box, this.Coin_Ranking);
                this.RecoveryPool(this.Pool_Prize_Box, this.Prize_Ranking);
                this.Pool_Coin_Box.clear();
                this.Pool_Prize_Box.clear();
                break;
            case "game_rank":
                this.RankShow(true, false);
                this.CurrentRanking = RankingType.Coin;
                // console.log("当前榜单" + this.CurrentRanking);
                break;
            case "prize_rank":
                this.RankShow(false, true);
                this.CurrentRanking = RankingType.Prize;
                // console.log("当前榜单" + this.CurrentRanking);
                break;
            case "share":
                WX.Share();
                break;
            case "left":
                //上一页
                // if (this.Game_Rank.active) {
                //     if (this.PageIndex <= 1) {
                //         return;
                //     }
                //     this.PageIndex--;
                //     this.getRankList_Gold((data) => {
                //         this.SetCoinRank_1(this.getDataWithPage(data, this.PageIndex));
                //     });
                // }
                if (this.CurrentRanking === RankingType.Coin) {
                    if (this.Coin_Ranking_Index <= this.Coin_Ranking_Max_Num) {
                        return;
                    }
                    this.RecoveryPool(this.Pool_Coin_Box, this.Coin_Ranking);
                    this.Coin_Ranking_Index = this.SetLastCoinRank(this.Pool_Coin_Box, this.Coin_Ranking, this.Coin_Rank_Data, this.Coin_Ranking_Max_Num, this.Coin_Ranking_Index);
                }
                if (this.CurrentRanking === RankingType.Prize) {
                    if (this.Prize_Ranking_Index <= this.Prize_Ranking_Max_Num) {
                        return;
                    }
                    this.RecoveryPool(this.Pool_Prize_Box, this.Prize_Ranking);
                    this.Prize_Ranking_Index = this.SetLastPrizeRank(this.Pool_Prize_Box, this.Prize_Ranking, this.Prize_Rank_Data, this.Prize_Ranking_Max_Num, this.Prize_Ranking_Index);
                }
                break
            case "right":
                //下一页
                // if (this.Game_Rank.active) {
                //     this.PageIndex++;
                //     this.getRankList_Gold((data) => {
                //         let array = this.getDataWithPage(data, this.PageIndex);
                //         if (array.length == 0) {
                //             this.PageIndex--;
                //             return;
                //         }
                //         this.SetCoinRank_1(array);
                //     });
                // }
                if (this.CurrentRanking === RankingType.Coin) {
                    if (this.Coin_Ranking_Index >= this.Coin_Rank_Data.length) {
                        return;
                    }
                    this.RecoveryPool(this.Pool_Coin_Box, this.Coin_Ranking);
                    this.Coin_Ranking_Index = this.SetNextCoinRank(this.Pool_Coin_Box, this.Coin_Ranking, this.Coin_Rank_Data, this.Coin_Ranking_Max_Num, this.Coin_Ranking_Index);
                }
                if (this.CurrentRanking === RankingType.Prize) {
                    if (this.Prize_Ranking_Index >= this.Prize_Rank_Data.length) {
                        return;
                    }
                    this.RecoveryPool(this.Pool_Prize_Box, this.Prize_Ranking);
                    this.Prize_Ranking_Index = this.SetNextPrizeRank(this.Pool_Prize_Box, this.Prize_Ranking, this.Prize_Rank_Data, this.Prize_Ranking_Max_Num, this.Prize_Ranking_Index);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 设置金币盒子对象池
     * @param pool 对象池
     * @param coin_box 金币盒子
     */
    private SetCoinPool(pool: cc.NodePool, coin_box: cc.Prefab) {
        for (let i = 0; i < 5; i++) {
            let box = cc.instantiate(coin_box);
            pool.put(box);
        }
    }

    /**
     * 设置奖品对象池
     * @param pool 对象池
     * @param prize_box 奖品盒子
     */
    private SetPrizePool(pool: cc.NodePool, prize_box: cc.Prefab) {
        for (let i = 0; i < 5; i++) {
            let box = cc.instantiate(prize_box);
            pool.put(box);
        }
    }

    /**
     * 排行榜显示
     * @param game_rank 游戏排行榜是否显示
     * @param prize_rank 奖励排行榜是否显示
     */
    private RankShow(game_rank: boolean, prize_rank: boolean) {
        this.Game_Title.active = game_rank;
        this.Game_Rank.active = game_rank;
        this.Prize_Title.active = prize_rank;
        this.Prize_Rank.active = prize_rank;
    }


    private show_Gold() {
        this.Game_Title.active = true;
        this.Game_Rank.active = true;
        this.Prize_Title.active = false;
        this.Prize_Rank.active = false;
        this.PageIndex = 1;
        if (this.Pool_Coin_Box.size() <= 0) {
            this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
        }

        this.getRankList_Gold((data) => {
            this.SetCoinRank_1(this.getDataWithPage(data, this.PageIndex));
        });
    }

    private getRankList_Gold(callback) {
        if (this.Coin_Rank_Data.length > 0) {
            callback(this.Coin_Rank_Data);
        } else {
            Http.sendRequest("https://xy.zcwx.com/userapi/hall/paihang", (data) => {
                if (data === null || data.data.length <= 0) {
                    callback([]);
                    return;
                }
                this.Coin_Rank_Data = data.data;
                callback(this.Coin_Rank_Data);
            });
        }
    }

    private getRankList_Reward(callback) {
        if (this.Prize_Rank_Data.length > 0) {
            callback(this.Prize_Rank_Data);
        } else {
            Http.sendRequest("https://xy.zcwx.com/userapi/hall/reward", (data) => {
                if (data === null || data.data.length <= 0) {
                    callback([]);
                    return;
                }
                this.Prize_Rank_Data = data.data;
                callback(this.Prize_Rank_Data);
            });
        }
    }

    private getDataWithPage(array, page) {
        let start = (page - 1) * this.PageSize;
        let end = start + this.PageSize;
        let result = [];
        if (end <= array.length) {
            result = array.slice(start, end);
        } else {
            result = array.slice(start);
        }
        cc.log('result=======>' + JSON.stringify(result));
        return result;
    }

    /**
     * 获取后台排行榜数据
     */
    private GetHttp() {
        //获取金币排行数据
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/paihang", (data) => {
            // console.log("获取排行数据");
            // console.log(data);
            this.Coin_Ranking = this.node.getChildByName("Game_Rank").getChildByName("Rank_List");
            if (data === null) {
                return;
            }
            this.Coin_Rank_Data = data.data;
            if (this.Coin_Rank_Data.length <= 0) {
                // console.log("获取排行数据return");
                return
            }

            this.Coin_Ranking_Index = 0;

            this.Coin_Ranking_Index = this.SetCoinRank(this.Pool_Coin_Box, this.Coin_Rank_Data, this.Coin_Ranking, this.Coin_Ranking_Index, this.Coin_Ranking_Max_Num, () => {
                this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
            });
            this.SetUserRanking(this.User_Game_Ranking_Box, WX.Uid, this.Coin_Rank_Data);
        });

        //获取奖品排行榜
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/reward", (data) => {
            // console.log("获取奖品排行数据");
            // console.log(data);
            this.Prize_Ranking = this.node.getChildByName("Prize_Rank").getChildByName("Rank_List");
            if (data === null) {
                return;
            }
            this.Prize_Rank_Data = data.data;
            // console.log(this.Prize_Rank_Data.length);
            if (this.Prize_Rank_Data.length <= 0) {
                // console.log("获取奖品排行数据return");
                return
            }
            this.Prize_Ranking_Index = 0;
            for (let i = 0; i < this.Prize_Rank_Data.length; i++) {
                if (this.Prize_Rank_Data[i].type === "2") {
                    this.Prize_Rank_Data.splice(i, 1);
                    i--;
                }
            }

            this.Prize_Ranking_Index = this.SetPrizeRank(this.Pool_Prize_Box, this.Prize_Rank_Data, this.Prize_Ranking, this.Prize_Ranking_Index, this.Prize_Ranking_Max_Num, () => {
                this.SetPrizePool(this.Pool_Prize_Box, this.Prize_Rank_Box);
            });
        });
    }

    /**
     * 设置用户榜单
     * @param user_box 用户榜单盒子
     * @param user_uid 用户UID（用户标识符）
     * @param game_ranking_data 金币榜单数据
     */
    private SetUserRanking(user_box: cc.Node, user_uid: any, game_ranking_data: any[]) {
        //重置用户榜单盒子状态
        user_box.getChildByName("Box").active = false;
        user_box.getChildByName("Hint").active = false;

        // game_ranking_data = [];
        for (let i = 0; i < game_ranking_data.length; i++) {
            if (user_uid === game_ranking_data[i].uid) {
                console.log("用户ID");
                console.log(user_uid);
                console.log("目标ID");
                console.log(game_ranking_data[i].uid);
                //显示用户榜单
                user_box.getChildByName("Box").active = true;

                //名次
                let ranking_label = user_box.getChildByName("Box").getChildByName("ranking_label").getComponent(cc.Label);
                ranking_label.string = i + 1 + "";

                //头像
                let head = user_box.getChildByName("Box").getChildByName("head").getComponent(cc.Sprite);
                head.spriteFrame = null;
                if (!this.isEmpty(game_ranking_data[i].headimgurl)) {
                    cc.loader.load({ url: game_ranking_data[i].headimgurl, type: "jpg" }, (err, texture) => {
                        if (err) {
                            return;
                        }
                        head.spriteFrame = new cc.SpriteFrame(texture);
                    });
                }

                //昵称
                let name = user_box.getChildByName("Box").getChildByName("name").getComponent(cc.Label);
                name.string = game_ranking_data[i].name;

                //金币数
                let coin_label = user_box.getChildByName("Box").getChildByName("coin_label").getComponent(cc.Label);
                coin_label.string = game_ranking_data[i].coin;

                return;
            }
        }
        console.log("用户ID");
        console.log(user_uid);
        //显示提示语
        user_box.getChildByName("Hint").active = true;
        return;
    }

    private isEmpty(str: string) {
        if (str == null || str == '' || str == 'null' || str == 'undefine') {
            return true;
        }
        return false;
    }

    private SetCoinRank_1(data) {
        this.RecoveryPool(this.Pool_Coin_Box, this.Coin_Ranking);
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let box = this.Pool_Coin_Box.get();
            if (!box) {
                this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
                box = this.Pool_Coin_Box.get();
            }
            this.Coin_Ranking.addChild(box);

            //名次
            let ranking_label = box.getChildByName("ranking_label").getComponent(cc.Label);
            ranking_label.string = i + 1 + (this.PageIndex - 1) * 6 + '';

            //头像
            let head = box.getChildByName("head").getComponent(cc.Sprite);
            head.spriteFrame = null;
            if (!this.isEmpty(item.headimgurl)) {
                cc.loader.load({ url: item.headimgurl, type: "jpg" }, (err, texture) => {
                    if (err) {
                        return;
                    }
                    head.spriteFrame = new cc.SpriteFrame(texture);
                });
            }

            //昵称
            let name = box.getChildByName("name").getComponent(cc.Label);
            name.string = '';
            name.string = item.name;

            //金币数
            let coin_num = box.getChildByName("coin_label").getComponent(cc.Label);
            coin_num.string = '';
            coin_num.string = item.coin;
        }
    }

    /**
     * 设置金币排行榜
     * @param pool 金币盒子对象池
     * @param coin_rank_data 金币排行数据
     * @param ranking 榜单节点
     * @param index 下标索引
     * @param max_num 单页显示最大数
     * @param setcoinpool 设置金币盒子对象池方法
     * @returns 金币榜单数据下标索引
     */
    private SetCoinRank(pool: cc.NodePool, coin_rank_data: any[], ranking: cc.Node, index: number, max_num: number, setcoinpool: Function): number {
        for (let i = index; i < max_num; i++) {
            let box = pool.get();
            if (!box) {
                setcoinpool();
                box = pool.get();
            }
            ranking.addChild(box);

            //名次
            let ranking_label = box.getChildByName("ranking_label").getComponent(cc.Label);
            ranking_label.string = i + 1 + "";

            //头像
            let head = box.getChildByName("head").getComponent(cc.Sprite);
            head.spriteFrame = null;
            if (!this.isEmpty(coin_rank_data[i].headimgurl)) {
                cc.loader.load({ url: coin_rank_data[i].headimgurl, type: "jpg" }, (err, texture) => {
                    if (err) {
                        return;
                    }
                    head.spriteFrame = new cc.SpriteFrame(texture);
                });
            }

            //昵称
            let name = box.getChildByName("name").getComponent(cc.Label);
            name.string = coin_rank_data[i].name;

            //金币数
            let coin_num = box.getChildByName("coin_label").getComponent(cc.Label);
            coin_num.string = coin_rank_data[i].coin;
        }
        return max_num;
    }

    private getData(pageIndex: number) {

    }

    /**
     * 设置下一页金币榜单
     * @param pool 金币榜单盒子对象池
     * @param ranking 榜单节点
     * @param coin_rank_data 金币榜单数据
     * @param max_num 单页显示最大数
     * @param index 金币榜单下标索引
     * @returns 金币榜单下标索引
     */
    private SetNextCoinRank(pool: cc.NodePool, ranking: cc.Node, coin_rank_data: any[], max_num: number, index: number): number {
        let length = 0;
        if (coin_rank_data.length - index >= max_num) {
            length = index + max_num;
            // console.log(coin_rank_data.length + "金币数组长度》》》》1");
            this.SetCoinRank(pool, coin_rank_data, ranking, index, length, () => {
                this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
            });
            return length;
        } else {
            length = coin_rank_data.length;
            this.SetCoinRank(pool, coin_rank_data, ranking, index, length, () => {
                this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
            });
            // console.log(length + "金币数组长度》》》》2");
            return index + max_num;
        }
    }

    /**
     * 设置上一页金币榜单
     * @param pool 金币榜单盒子对象池
     * @param ranking 榜单节点
     * @param coin_rank_data 金币榜单数据
     * @param max_num 单页显示最大数
     * @param index 金币榜单下标索引
     * @returns 金币榜单下标索引
     */
    private SetLastCoinRank(pool: cc.NodePool, ranking: cc.Node, coin_rank_data: any[], max_num: number, index: number): number {
        let length = index - max_num;
        index = index - 2 * max_num;
        index = this.SetCoinRank(pool, coin_rank_data, ranking, index, length, () => {
            this.SetCoinPool(this.Pool_Coin_Box, this.Coin_Rank_Box);
        });
        return index;
    }

    /**
     * 设置奖品排行榜
     * @param pool 奖品盒子对象池
     * @param prize_rank_data 奖品榜单数据
     * @param ranking 榜单节点
     * @param index 榜单下标索引
     * @param max_num 榜单最大显示数
     * @param setprizepool 设置奖品对象池
     */
    private SetPrizeRank(pool: cc.NodePool, prize_rank_data: any[], ranking: cc.Node, index: number, max_num: number, setprizepool: Function) {
        for (let i = index; i < max_num; i++) {
            //type：1为奖励榜单
            //type：2为抽奖名单
            // if (prize_rank_data[i].type === "2") {
            //     continue;
            // }
            let box = pool.get();
            if (!box) {
                setprizepool();
                box = pool.get();
            }
            ranking.addChild(box);

            //名次
            let ranking_label = box.getChildByName("ranking_label").getComponent(cc.Label);
            ranking_label.string = i + 1 + "";

            //头像
            //头像
            let head = box.getChildByName("head").getComponent(cc.Sprite);
            head.spriteFrame = null;
            if (!this.isEmpty(prize_rank_data[i].headimgurl)) {
                cc.loader.load({ url: prize_rank_data[i].headimgurl, type: "jpg" }, (err, texture) => {
                    if (err) {
                        return;
                    }
                    head.spriteFrame = new cc.SpriteFrame(texture);
                });
            }

            //昵称
            let name = box.getChildByName("name").getComponent(cc.Label);
            name.string = prize_rank_data[i].nickname;

            let prize: cc.Node = null;
            if (i === 0) {
                prize = box.getChildByName("Prize_1");
            } else {
                prize = box.getChildByName("Prize_2");
            }
            prize.active = true;
        }
        return max_num;
    }

    /**
     * 设置下一页金币榜单
     * @param pool 金币榜单盒子对象池
     * @param ranking 榜单节点
     * @param prize_rank_data 金币榜单数据
     * @param max_num 单页显示最大数
     * @param index 金币榜单下标索引
     * @returns 金币榜单下标索引
     */
    private SetNextPrizeRank(pool: cc.NodePool, ranking: cc.Node, prize_rank_data: any[], max_num: number, index: number): number {
        let length = 0;
        if (prize_rank_data.length - index >= max_num) {
            length = index + max_num;
            this.SetPrizeRank(pool, prize_rank_data, ranking, index, length, () => {
                this.SetPrizePool(this.Pool_Coin_Box, this.Coin_Rank_Box);
            });
            return length;
        } else {
            length = prize_rank_data.length;
            this.SetPrizeRank(pool, prize_rank_data, ranking, index, length, () => {
                this.SetPrizePool(this.Pool_Coin_Box, this.Coin_Rank_Box);
            });
            return index + max_num;
        }
    }

    /**
     * 设置上一页金币榜单
     * @param pool 金币榜单盒子对象池
     * @param ranking 榜单节点
     * @param prize_rank_data 金币榜单数据
     * @param max_num 单页显示最大数
     * @param index 金币榜单下标索引
     * @returns 金币榜单下标索引
     */
    private SetLastPrizeRank(pool: cc.NodePool, ranking: cc.Node, prize_rank_data: any[], max_num: number, index: number): number {
        let length = index - max_num;
        index = index - 2 * max_num;
        index = this.SetPrizeRank(pool, prize_rank_data, ranking, index, length, () => {
            this.SetPrizePool(this.Pool_Coin_Box, this.Coin_Rank_Box);
        });
        return index;
    }

    /**
     * 回收对象池
     * @param pool 对象池
     * @param ranking 榜单节点
     */
    private RecoveryPool(pool: cc.NodePool, ranking: cc.Node) {
        let arr = ranking.children;
        // console.log(arr.length + "金币数组长度》》》》3");
        for (let i = 0; i < arr.length; i++) {
            let prize_1 = arr[i].getChildByName("Prize_1");
            if (prize_1) {
                prize_1.active = false;
            }
            let prize_2 = arr[i].getChildByName("Prize_2");
            if (prize_2) {
                prize_2.active = false;
            }
            pool.put(arr[i]);
            i--;
        }
        // console.log(arr.length + "金币数组长度》》》》4");
    }
}
