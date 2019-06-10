
cc.Class({
    extends: cc.Component,

    properties: {

        _Level: 0,
        _FloorNum: 1,
        _NextLevelPrice: 0,

        Node_Fishes: cc.Node,

        Anim_PaoPao: cc.Animation,

        Anim_BaoXiang: cc.Animation,

        // NodePool_Fish:cc.NodePool
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    onBtnClicked() {
        ViewHelper.showNodeWithName('UpFishBowlNode', { floor: this._FloorNum, level: this._Level, nextPrice: this._NextLevelPrice, target: this });
    },

    onBaoXiangClicked() {
        cc.log('点击宝箱!');
        HTTP.sendRequest('Hall/getbox', (data) => {
            if (data.status == 0) {
                return;
            }
            this.Anim_BaoXiang.stop();
            this.Anim_BaoXiang.node.active = false;
            data = data.data;
            if (data.type == 1) {
                ViewHelper.showRewardNode(data.value + 2);
            } else if (data.type == 2) {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Bone, data.value);
            } else if (data.type == 3) {
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Money, data.value);
            } else {
                let num = BigNumber(DataHelper.getOffLineGold()).times(data.value).toString();
                ViewHelper.showRewardNode(GameConfig.Reward_Type.Gold, num);
            }
        }, { uid: DataHelper.Uid });

    },

    showBaoXiang() {
        if (this.Anim_BaoXiang.node.active) {
            return;
        }
        this.Anim_BaoXiang.node.active = true;
        this.Anim_BaoXiang.play();
    },

    openNew(zIndex) {
        cc.find('Node_Bg', this.node).active = false;
        cc.find('Btn_Up', this.node).active = false;
        cc.find('FishNode', this.node).active = false;
        this._Level = 1;
        this._FloorNum = Math.abs(zIndex);
        this._NextLevelPrice = DataHelper.getUpFishBowlPrice({ floor: this._FloorNum, level: this._Level });
        this.Anim_PaoPao.node.active = true;
        this.Anim_PaoPao.on('finished', () => {
            this.node.zIndex = zIndex;
            cc.find('Node_Bg', this.node).active = true;
            cc.find('Btn_Up', this.node).active = true;
            cc.find('FishNode', this.node).active = true;
            this.addFish(this.getFishType(this._Level));
        });
        this.Anim_PaoPao.play();
        DataHelper.setFishBowlData(this._FloorNum, this._Level);

    },

    init(data) {
        var data = DataHelper.setFishBowlData(parseInt(data.floor), parseInt(data.level));
        this._Level = data.level;
        this._FloorNum = data.floor;
        this._NextLevelPrice = data.nextPrice;
        for (let i = 1; i <= this._Level; i++) {
            this.addFish(this.getFishType(i));
        }
        if (this._Level >= 9) {
            cc.find('Btn_Up', this.node).active = false;
        }
    },

    getFishType(level) {
        let type = parseInt(3 * (this._FloorNum - 1) + 1 + (level - 1) / 3);
        return type;
    },

    toUpLevel(level) {
        console.log('fishBowl----->toUpLevel');
        DataHelper.setGoldNum(BigNumber(DataHelper.Gold_Num).minus(this._NextLevelPrice).toString());
        this._Level = level;
        if (this._Level >= 9) {
            cc.find('Btn_Up', this.node).active = false;
            GameTools.removeEvent(cc.find('Btn_Up', this.node));
        }
        this.addFish(this.getFishType(this._Level));
        var data = DataHelper.setFishBowlData(this._FloorNum, this._Level);
        this._NextLevelPrice = data.nextPrice;
        return data;
    },

    addFish(fishType) {
        var fishNode = this.getFishNode(fishType);
        fishNode.x = GameTools.GetRandom(-(this.Node_Fishes.width / 2 - 100), (this.Node_Fishes.width / 2 - 100));
        fishNode.y = GameTools.GetRandom(-(this.Node_Fishes.height / 2), (this.Node_Fishes.height / 2));
        this.Node_Fishes.addChild(fishNode);
        fishNode.getComponent('Fish').initData(fishType);
    },

    getFishNode(fishType) {
        var fishNode = FishesPool.get();
        if (!fishNode) {
            var fishNode = new cc.Node('fish_' + fishType);
            fishNode.addComponent(cc.Sprite);
            fishNode.addComponent('Fish');
            fishNode.addComponent(cc.Animation);
        }
        fishNode.direction = 'left';
        return fishNode;
    },

    update(dt) {
        for (let i = 0; i < this.Node_Fishes.childrenCount; i++) {
            var fishNode = this.Node_Fishes.children[i];
            if (!fishNode) {
                continue;
            }
            if (fishNode.x <= -this.Node_Fishes.width / 2) {
                fishNode.scaleX = -Math.abs(fishNode.scaleX);
                fishNode.direction = 'right';
            } else if (fishNode.x >= this.Node_Fishes.width / 2) {
                fishNode.scaleX = Math.abs(fishNode.scaleX);
                fishNode.direction = 'left';
            }
            if (fishNode.direction == 'left') {
                fishNode.x -= dt * fishNode.getComponent('Fish').Speed;
            } else {
                fishNode.x += dt * fishNode.getComponent('Fish').Speed;;
            }
        }
    },
});
