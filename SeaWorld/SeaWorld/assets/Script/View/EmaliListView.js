// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// getEmailList 
// data = [
//     {
//         id: 1,
//         title: "aaa",
//         content: "aaaaa",
//         isReceive: 1,
//         reward: [
//             {
//                 type:1,           
//                 num:1,
//             }
//         ],
//         resTime:剩余秒数,
//         time:发送时间
//     }
// ]
// 奖励类型
// Reward_Type: {
//     Gold: 1,
//     Money: 2,
//     Gem_1: 3,
//     Gem_2: 4,
//     Gem_3: 5,
//     Gem_4: 6,
//     Gem_5: 7,
//     Bone: 8,
// },

// emailOption  
// id:email的id
// type:1领取 2删除



cc.Class({
    extends: cc.Component,

    properties: {
        Node_Content: cc.Node,
        Node_Item: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        if (!this.Pool_Email) {
            this.Pool_Email = new cc.NodePool();
        }
        this.setList();
    },

    setList() {
        this.removeAllChildren();
        GameTools.loading();
        HTTP.sendRequest('sign/getEmailList', (data) => {
            GameTools.hidLoading();
            if (data.status == 0) {
                GameTools.dialog('请求错误', res.msg, null);
                return;
            }
            this.bindData(data.data);
        }, { uid: DataHelper.Uid });
    },

    bindData(data) {
        for (let i = 0; i < data.length; i++) {
            let itemData = data[i];
            let itemNode = this.getItem();
            cc.find('title', itemNode).getComponent(cc.Label).string = itemData.title;
            cc.find('time', itemNode).getComponent(cc.Label).string = itemData.time.split(' ')[0];
            if (itemData.isReceive == 1) {
                cc.find('resTime', itemNode).active = false;
                cc.find('tag', itemNode).active = true;
            } else {
                cc.find('resTime', itemNode).active = true;
                cc.find('tag', itemNode).active = false;
                cc.find('resTime', itemNode).getComponent(cc.Label).string = '剩余:' + this.formatSeconds(itemData.resTime);
            }
            GameTools.addEvent(itemNode, (node) => {
                this.showEmailDetail(itemData);
            });
            itemNode.parent = this.Node_Content;
        }
    },

    removeAllChildren() {
        if (this.Node_Content.childrenCount <= 0) {
            return;
        }
        let node = this.Node_Content.children[0];
        this.Pool_Email.put(node);
        this.removeAllChildren();
    },

    getItem() {
        let node = this.Pool_Email.get();
        if (!node) {
            node = cc.instantiate(this.Node_Item);
        }
        return node;
    },

    showEmailDetail(data) {
        this.emailId = data.id;
        this.detailNode = cc.find('EmailDetailNode/content/bg_tytk_bai', this.node);
        this.detailNode.data = data;
        // 已领取的就隐藏删除按钮 和显示已领取标签
        if (data.isReceive == 1) {
            cc.find('content/t_xxzx_ylq', this.detailNode).active = true;
            cc.find('BTS/BT_LQ', this.detailNode).active = false;
        } else {
            cc.find('content/t_xxzx_ylq', this.detailNode).active = false;
            cc.find('BTS/BT_LQ', this.detailNode).active = true;
        }
        // 标题
        cc.find('title', this.detailNode).getComponent(cc.Label).string = data.title;
        // 内容
        cc.find('content/content', this.detailNode).getComponent(cc.Label).string = data.content;
        cc.find('EmailDetailNode', this.node).active = true;
        if (!data.reward || data.reward.length <= 0) {
            cc.find('BTS/BT_LQ', this.detailNode).active = false;
            cc.find('content/t_xxzx_ylq', this.detailNode).active = false;
            cc.find('content/New Node', this.detailNode).active = false;
            return;
        }

        cc.find('content/New Node', this.detailNode).active = true;
        
        // 设置奖品
        for (let i = 0; i < data.reward.length; i++) {
            let itemData = data.reward[i];
            // 现金
            if (itemData.type == GameConfig.Reward_Type.Money) {
                let node = cc.find('content/New Node/ItemNode_Money', this.detailNode);
                cc.find('value', node).getComponent(cc.Label).string = 'x' + itemData.num;
            } else {
                // 宝石
                let node_gem = cc.find('content/New Node/ItemNode_Gem', this.detailNode);
                let url = 'Texture/tisheng/dj_' + (itemData.type - 2);
                cc.loader.loadRes(url, cc.SpriteFrame, (err, frame) => {
                    if (err) {
                        return;
                    }
                    cc.find('icn', node_gem).getComponent(cc.Sprite).spriteFrame = frame;
                });
                cc.find('value', node_gem).getComponent(cc.Label).string = 'x' + itemData.num;
            }
        }

    },

    onBtnClicked(event, data) {
        HandleMgr.sendHandle('Audio_Click');
        // 删除
        if (event.target.name == 'BT_DEL') {
            GameTools.loading();
            HTTP.sendRequest('sign/getEmail', (data) => {
                GameTools.hidLoading();
                if (data.status == 0) {
                    GameTools.dialog('请求错误', res.msg, null);
                    return;
                }
                this.setList();
                cc.find('EmailDetailNode', this.node).active = false;
            }, { uid: DataHelper.Uid, type: 2, id: this.emailId });
        } else {
            // 领取
        GameTools.loading();
            HTTP.sendRequest('sign/getEmail', (data) => {
                GameTools.hidLoading();
                if (data.status == 0) {
                    GameTools.dialog('请求错误', res.msg, null);
                    return;
                }
                this.setList();
                cc.find('content/t_xxzx_ylq', this.detailNode).active = true;
                let reward = this.detailNode.data;
                ViewHelper.showRewardNode(reward[0].type, reward[0].num, () => {
                    ViewHelper.showRewardNode(reward[1].type, reward[1].num);
                });
            }, { uid: DataHelper.Uid, type: 1, id: this.emailId });
        }
    },
    formatSeconds(value) {
        if (value <= 0) {
            return '已过期';
        }
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        var dayTime = 0;
        if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
                if (hourTime > 24) {
                    dayTime = parseInt(horTime / 24);
                    hourTime = parseInt(hourTime % 24);
                }
            }
        }
        if (dayTime > 0) {
            return dayTime + '天';
        }
        if (hourTime > 0) {
            return hourTime + '小时';
        }
        if (minuteTime > 0) {
            return minuteTime + '分钟';
        } else {
            return '小于1分钟';
        }
    },
    // update (dt) {},
});
