// 加法：.plus(n [, base]) ⇒ BigNumber
// 减法：.minus(n [, base]) ⇒ BigNumber
// 乘法：.times(n [, base]) ⇒ BigNumber; m.ultipliedBy(n [, base]) ⇒ BigNumber;
// 普通除法运算： .div(n [, base]) ⇒ BigNumber； .dividedBy(n [, base]) ⇒ BigNumber
// 除法，返回整数： .idiv(n [, base]) ⇒ BigNumber；.dividedToIntegerByv(n [, base]) ⇒ BigNumber
// 指数运算： .pow(n [, m]) ⇒ BigNumber;.exponentiatedBy(n [, m]) ⇒ BigNumber
// 开平方：.sqrt() ⇒ BigNumber；.squareRoot.() ⇒ BigNumber
// 比较大小： .comparedTo(n [, base]) ⇒ number
// 取整：.integerValue([rm]) ⇒ BigNumber
// 取模/取余： .mod(n [, base]) ⇒ BigNumber；modulo.(n [, base]) ⇒ BigNumber


cc.Class({
    extends: cc.Component,

    properties: {

        Money_Num: {
            get() {
                return this._Money_Num;
            },
            set(value) {
                this._Money_Num = value;
                HandleMgr.sendHandle('ValueChanged_Money', this._Money_Num);
            }
        },
        Gold_Num: {
            get() {
                return this._Gold_Num;
            },
            set(value) {
                this._Gold_Num = this.toNonExponential(BigNumber(value));
                this._Gold_Num = this._Gold_Num.fixed();
                HandleMgr.sendHandle('ValueChanged_Gold', this._Gold_Num);
            }
        },

        Price_Times: {
            get() {
                return this._Price_Times;
            },
            set(value) {
                this._Price_Times = value;
                HandleMgr.sendHandle('ValueChanged_PriceTimes', this._Price_Times);
            }
        },

        Data_Sync: {
            get() {
                return this._Data_Sync;
            },
            set(value) {
                this._Data_Sync = value;
                if (GameControl) {
                    GameControl.Node_Dian_Tips.active = (value.friend > 0 || value.mail > 0);
                }
                HandleMgr.sendHandle('ValueChanged_DataSync', this._Data_Sync);
            }
        },
        Gold_Offline: 0,
        Uid: 0,
        // //是否是老人
        // IsHave = true,

        GameData: null,
        GameData_Shallow: null,
        GameData_Deepsea: null,
        GameData_Unknown: null,

        Data_User: null,
        Data_Submarine: null,
        Data_FishBowl: null,
        Data_Transport: null,
        Data_Guest: null,


    },

    toNonExponential(num) {
        var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    },

    initData(data) {
        this.Tag = 'DataHelper-------------->';
        this.GameData = data;
        this.Data_User = this.GameData.userinfo;
        this.Uid = this.Data_User.uid;
        this.Money_Num = parseInt(this.Data_User.money);
        this.Gold_Num = isNaN(this.Data_User.gold) ? '1000' : BigNumber(this.Data_User.gold).toString();
        // cc.log('bigint------>'+this.Gold_Num);
        var sort = (a, b) => {
            return parseInt(a.floor) - parseInt(b.floor);
        }
        this.GameData_Shallow = this.GameData.gameData.shallowsea;
        if (this.GameData_Shallow && this.GameData_Shallow.fishbowls) {
            this.GameData_Shallow.fishbowls.sort(sort);
        }
        this.GameData_Deepsea = this.GameData.gameData.deepsea;
        if (this.GameData_Deepsea && this.GameData_Deepsea.fishbowls) {
            this.GameData_Deepsea.fishbowls.sort(sort);
        }
        this.GameData_Unknown = this.GameData.gameData.unknownsea;
        if (this.GameData_Unknown && this.GameData_Unknown.fishbowls) {
            this.GameData_Unknown.fishbowls.sort(sort);
        }
        this.Price_Times = this.Data_User.promote ? parseInt(this.Data_User.promote) : 1;

        // this.setSubmarineData(1);
        // this.setTransportData(1);
    },

    // 获取游客升级价格
    getGuestPrice_Level(level, type) {
        let price = 0;
        let num = GameConfig.BaseXiShu_Guest[type - 1];
        let zzxs = [0.15, 31.5, 125, 520, 950, 1496, 3190, 6800, 11700, 19500, 19500];
        let index = parseInt(level / 100);
        price = BigNumber(level).pow(index + 1).times(num).times(1 + level * zzxs[index]);
        return price.toString();
    },

    // 获取游客门票价格
    getGuestPrice_MenPiao(level, type) {
        let price = 0;
        let num = GameConfig.BaseXiShu_Guest[type - 1];
        let index = parseInt(level / 100);
        price = BigNumber(level).pow(index + 1).times(num);
        return price.toString();
    },

    getSubmarineData() {
        if (GameConfig.Game_Type == 1) {
            return this.GameData_Shallow.submarine;
        } else if (GameConfig.Game_Type == 2) {
            return this.GameData_Deepsea.submarine;
        } else {
            return this.GameData_Unknown.submarine;
        }
    },

    setSubmarineData(level) {
        var data = this.getSubmarineData(GameConfig.Game_Type);

        data.level = level;
        data.count = this.getSubmarineCount(level);
        data.speed = 1 + level * 0.01;
        // data.speed = 1 + 100 * 0.01;
        data.nextCount = this.getSubmarineCount(level + 1);
        data.nextPrice = BigNumber(this.getGuestPrice_Level(level * 10, 1)).times(GameConfig.BaseXiShu_Submarine[parseInt(level / 10)]).toString();
        data.nextSpeed = 1 + (level + 1) * 0.01;

        return data;
    },

    getSubmarineCount(level) {
        let index = parseInt(level / 10);
        return index <= 1 ? 1 : index;
    },

    getFishBowlData() {
        if (GameConfig.Game_Type == 1) {
            return this.GameData_Shallow.fishbowls;
        } else if (GameConfig.Game_Type == 2) {
            return this.GameData_Deepsea.fishbowls;
        } else {
            return this.GameData_Unknown.fishbowls;
        }
    },

    setFishBowlData(floor, level) {
        console.log('setFishBowlData');
        var data = this.getFishBowlData()[floor - 1];
        if (!data) {
            data = {};
            this.getFishBowlData().push(data);
        }
        data.floor = floor;
        data.level = level;
        let tempLevel = 9 * (floor - 1) + level;
        cc.log('tempLevel-------->' + tempLevel);
        cc.log('getGuestPrice_Level-------->' + this.getGuestPrice_Level(tempLevel * 10, 1));
        cc.log('BaseXiShu_Bowl_TS-------->' + GameConfig.BaseXiShu_Bowl_TS[parseInt(level / 10)]);
        data.nextPrice = BigNumber(this.getGuestPrice_Level(tempLevel * 10, 1)).times(GameConfig.BaseXiShu_Bowl_TS[parseInt(tempLevel / 10)]).toString();
        // data.income = BigNumber(this.getGuestPrice_MenPiao(level * 10, 1)).times(GameConfig.BaseXiShu_Bowl_JC[parseInt(level / 10)]).toString;
        return data;
    },

    getFishBowlInCome(level) {
        if (!level) {
            var data = this.getFishBowlData();
            level = 9 * (data.length - 1) + data[data.length - 1].level;
        }
        var price = BigNumber(this.getGuestPrice_MenPiao(level * 10, 1)).times(GameConfig.BaseXiShu_Bowl_JC[parseInt(level / 10)]).toString();
        return price;
    },

    getTransportData() {
        if (GameConfig.Game_Type == 1) {
            return this.GameData_Shallow.transport;
        } else if (GameConfig.Game_Type == 2) {
            return this.GameData_Deepsea.transport;
        } else {
            return this.GameData_Unknown.transport;
        }
    },

    setTransportData(level) {
        var data = this.getTransportData();
        data.level = level;
        data.nextPrice = BigNumber(this.getGuestPrice_Level(level * 10, 1)).times(GameConfig.BaseXiShu_TransBar[parseInt(level / 10)]).toString();
        data.speed = 1 + level * 0.01;
        data.nextSpeed = 1 + (level + 1) * 0.01;
        return data;
    },

    /**
     * 获取游客信息
     */
    getGuestData() {
        if (GameConfig.Game_Type == 1) {
            return this.GameData_Shallow.guest;
        } else if (GameConfig.Game_Type == 2) {
            return this.GameData_Deepsea.guest;
        } else {
            return this.GameData_Unknown.guest;
        }
    },

    /**
     * 设置游客信息
     * @param {*} levels 
     */
    setGuestData(levels) {
        if (GameConfig.Game_Type == 1) {
            this.GameData_Shallow.guest = levels;
        } else if (GameConfig.Game_Type == 2) {
            this.GameData_Deepsea.guest = levels;
        } else {
            this.GameData_Unknown.guest = levels;
        }
    },

    /**
     * 获取游客升级价格
     * @param {*等级} level 
     * @param {*游客类型} type 
     */
    getGuestUpPrice(level, type) {
        return this.getGuestPrice_Level(level, type);
        // if (GameConfig.Game_Type == 1) {
        //     return parseFloat(Math.pow(level, 4) * 0.001);
        // } else if (GameConfig.Game_Type == 2) {
        //     return parseFloat(Math.pow(level, 7) * 0.001);
        // } else {
        //     return parseFloat(Math.pow(level, 10) * 0.001);
        // }
    },

    getGuestInCome(guestType, level) {
        return this.getGuestPrice_MenPiao(level, guestType);
        // let g = 1;
        // if (guestType > 0 && guestType <= 4) {
        //     g = 1;
        // } else if (guestType > 4 && guestType <= 7) {
        //     g = 2;
        // } else if (guestType > 7 && guestType <= 9) {
        //     g = 4;
        // } else {
        //     g = 8;
        // }
        // let n = 1 + level * 0.004;
        // return g * n;
    },

    // getUpFishBowlPrice(info) {
    //     console.log(this.Tag + 'getUpFishBowlPrice');
    //     let num = (info.floor - 1) * 11 + info.level;
    //     return BigNumber(2).pow(num).times(200).toString();
    // },

    setGoldNum(num) {
        this.Gold_Num = num;
        HandleMgr.sendHandle('refresh_gold');
        // console.log(this.Gold_Num);
        // this.upGameData();
    },

    setMoneyNum(num) {
        this.Money_Num = num;
        HandleMgr.sendHandle('refresh_money');
        HTTP.sendRequest('sign/refreshMoney', null, { uid: this.Uid, money: this.Money_Num },false);
    },

    refreshGold() {
        HTTP.sendRequest('sign/refreshGold', null, { uid: this.Uid, gold: this.Gold_Num },false);

        // this.SetWxUpdateCache();
    },

    /**
    * 设置微信存储
    */
    SetWxUpdateCache() {
        if (!window.wx) {
            return;
        }
        // console.log("最大关卡数：" + max_str);
        //设置用户托管数据
        wx.setUserCloudStorage({
            // KVDataList: [{ key: 'coin', value: this.Gold_Num  },{ key: 'user_id', value: DataHelper.Uid }],
            KVDataList: [{ key: 'coin', value: this.Gold_Num }],
            success: res => {
                // console.log(res);
                // console.log(res + "成功");
                // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    update: "update",
                });
            },
            fail: res => {
                console.log(res);
            }
        });
    },

    LookAchievement() {
        console.log("任务目标数据--------------->1");
        HTTP.sendRequest('Hall/LookAchievement', (data) => {
            console.log("任务目标数据--------------->2");
            console.log(data);
        }, { uid: this.Uid },false);
    },

    GetAchievement(id) {
        HTTP.sendRequest('hall/GetAchievement', { uid: this.Uid, fishTaskTarget: this.Gold_Num },false);
    },

    getInComeNum(guestType) {
        guestType = parseInt(guestType);
        let guestData = this.getGuestData();
        var level = guestData[guestType - 1];
        // var fishbowls = this.getFishBowlData();
        var fishIncome = this.getFishBowlInCome();

        // for (let i = 0; i < fishbowls.length; i++) {
        //     var element = fishbowls[i];
        //     if (!element.income) {
        //         element = this.setFishBowlData(parseInt(element.floor), parseInt(element.level))
        //     }
        //     num = BigNumber(element.income).plus(num).toString();
        // }
        cc.log('MenPiao=====>' + this.getGuestPrice_MenPiao(level, guestType));
        cc.log('fishIncome=====>' + fishIncome);
        let price = BigNumber(this.getGuestPrice_MenPiao(level, guestType)).plus(fishIncome);


        // console.log('fishbowls--------------->' + JSON.stringify(fishbowls));
        // var num = 0;


        // console.log('level------->' + level);
        // // console.log('getGuestInCome------->' + JSON.stringify(this.getGuestInCome(guestType, level)));
        // let a1 = BigNumber(num);
        // let b1 = this.getGuestInCome(guestType, level) + '';
        // cc.log('a1------>'+a1);
        // cc.log('b1------>'+b1);
        // return a1.times(b1);
        return price;
    },

    getOnTimeGold() {
        let count = BigNumber(0);
        let guestData = this.getGuestData();
        for (let i = 0; i < guestData.length; i++) {
            let type = i + 1;
            let mp = this.getGuestPrice_MenPiao(guestData[i], type);
            let gl = 0;
            if (i < 4) {
                gl = 0.15;
            } else if (i < 7) {
                gl = (0.25 / 3).toFixed(2);
            } else {
                gl = 0.05;
            }
            count = count.plus((BigNumber(mp).times(gl)));
        }
        let fishIncome = this.getFishBowlInCome();
        let submarineData = this.getSubmarineData();
        let transportData = this.getTransportData();
        let fishBow = this.getFishBowlData();
        let num = submarineData.count;
        count = count.plus(BigNumber(fishIncome)).times(num);
        let time = (num / transportData.speed + (fishBow.length) / submarineData.speed) * 2;
        return count.div(time).times(GameConfig.Base_Times_Price).times(this.Price_Times).toFixed(0);
        // return count.toFixed(2);
    },

    getOffLineGold() {
        let online = this.getOnTimeGold();
        let result = BigNumber(online).div(10).times(GameTools.GetRandom(3, 5)).toString();
        return result;
        // let guestData = this.getGuestData();
        // let a = BigNumber(0);
        // let show = GameConfig.Game_Type == 1 ? GameConfig.Guest_Show_QH : (GameConfig.Game_Type == 2 ? GameConfig.Guest_Show_SH : GameConfig.Guest_Show_WZ);
        // for (let i = 0; i < guestData.length; i++) {
        //     let type = i + 1;
        //     let price = BigNumber(this.getInComeNum(type)).times(GameConfig.Base_Ticket).times(GameConfig.Base_Times_Price);
        //     if (type <= 4) {
        //         price = price.times(show[0]);
        //     } else if (type > 4 && type <= 7) {
        //         price = price.times(show[1]);
        //     } else if (type > 7 && type <= 9) {
        //         price = price.times(show[2]);
        //     } else {
        //         price = price.times(show[3]);
        //     }
        //     a = a.plus(BigNumber(price));
        // }

        // let submarineData = this.getSubmarineData();

        // let transportData = this.getTransportData();

        // let time = 60 / ((submarineData.time_up + submarineData.time_down + transportData.time));
        // cc.log('离线收益---time---->' + time);
        // a = a.times(time);
        // cc.log('离线收益------->' + GameTools.formatGold(a.toString()));
    },

});
