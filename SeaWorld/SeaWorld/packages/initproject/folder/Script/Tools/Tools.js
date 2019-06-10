String.prototype.formatName = function (len) {
    let str = this;
    if (this.length > len) {
        str = this.substring(0, len) + '...';
    }
    return str;
}

String.prototype.isEmpty = function () {
    if (typeof this == "undefined" || this == null || this == "") {
        return true;
    } else {
        return false;
    }
}

Array.prototype.getIndexByUid = function (uid) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (element.uid == uid) {
            index = i;
            break;
        }
    }
    return index;
}

Array.prototype.copy = function () {
    let str = JSON.stringify(this);
    return JSON.parse(str);
}

Array.prototype.updateItem = function (uid, key, value) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        if (this[i].uid == uid) {
            this[i][key] = value;
            break;
        }
    }
}

Array.prototype.getIndexBySeat = function (seat) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (element.seat == seat) {
            index = i;
            break;
        }
    }
    return index;
}

Array.prototype.removeIndexOf = function (index) {
    if (index < 0) {
        return;
    }
    this.splice(index, 1);
};

Array.prototype.removeItem = function (item) {
    if (this.indexOf(item) >= 0) {
        this.splice(this.indexOf(item), 1);
    }
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Array.prototype.replace = function (index, item) {
    this.splice(index, 1, item);
};

/**
 * 根据gameType获取场景名
 * @param {string} gameType 
 */
function getSceneName(gameType) {
    switch (gameType) {
        case 1:
            return 'NNTable';
        case 2:
            return 'ZJHTable';
        case 3:
            return 'LHDTable';
        case 4:
            return 'BJLTable';
        default:
            return null;
    }
}

/**
 * 获取随机数
 */
function GetRandom(min, max) {
    var n = Math.floor(Math.random() * (max - min + 1) + min);
    return n;
}

/**
 * 删除object指定key
 * @param {object} object 
 * @param {string} key 
 */
function RemoveKey(object, key) {
    if (object.hasOwnProperty(key)) {
        delete object[key];
    }
}

module.exports = {
    getSceneName: getSceneName,
    GetRandom: GetRandom,
    RemoveKey: RemoveKey,
}