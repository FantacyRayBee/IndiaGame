cc.Class({
    extends: cc.Component,

    properties: {
        lai_sprite: cc.Sprite,
        btn_exit: cc.Button,
        btn_start: cc.Button,
        sprite_win: [cc.SpriteFrame],
        sprite_drop: [cc.SpriteFrame],
        sprite_lose: [cc.SpriteFrame],
        pai_back: cc.SpriteFrame,
        spriteAtlas_lai: cc.SpriteAtlas,
        pab_userBarItem: cc.Prefab,
        content: cc.Node,
    },

    ctor() {
        this.paiDistance = 22;
        this.paiWidth = 60.3;
        this.paiHeight = 78.3;
        this.groupDistance = 7;
    },

    onLoad() {
        this.btn_exit.node.on('click', this.btnClick, this);
        this.btn_start.node.on('click', this.btnClick, this);
        GlobalCfg.ACT_SCENE_CTRL.isChange = false;
    },

    btnClick(button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_exit") {
            GlobalCfg.ACT_SCENE_CTRL.exitGame();
        } else if (btnName == "btn_start") {
           this.checkSelfCoin();
        }
    },

    checkSelfCoin:function(){
        let data = JSON.parse(cc.sys.localStorage.getItem('rummyRoomData'));
        // let maxWin = data.num == 2? data.cellscore / 100 * 80 : data.cellscore / 100 * 400;
        if(GlobalCfg.USER_DATAS.userDiamond > data.entrycondition){
            GlobalCfg.ACT_SCENE_CTRL.SetContinueReq(this.node);
        }else{
            CommonFun.getInstance().showMsgBox("Your balance is under min Entry", "YES", () => {
                this.node.destroy();
                GlobalCfg.ACT_SCENE_CTRL.exitGame()
                window.isNeedShowRoomList = "rummy";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.RUMMY, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
    },

    //gameservice.ongamecalc 消息的处理
    setGameOverPlayerInfo: function (data, mainCtrl, selfCtrl) {
        let playerlist = data.players;
        this.mainCtrl = mainCtrl;
        this.selfCtrl = selfCtrl;
        this.winSeat = data.singleEventSeat;
        let reason = data.reason;
        let selfSeat = this.mainCtrl.selfSeat;
        GlobalCfg.ACT_SCENE_CTRL.isChange = false;
        switch (reason) {
            case 0:             //胡牌
                this.setPlayerInfo(playerlist, false);
                if (this.winSeat == selfSeat) {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("hupai")
                } else {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("shibai");
                }
                break;
            case 1:             //炸胡
                this.setPlayerInfo(playerlist, false, true);
                if (this.winSeat !== selfSeat) {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("hupai")
                } else {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("zhahu")
                }
                break;
            case 2:             //弃牌
                this.setPlayerInfo(playerlist, true);
                if (this.winSeat == selfSeat) {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("hupai")
                } else {
                    GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("shibai");
                }
                break;

            default:
                break;
        }
        this.setLaiziPai();
        this.curRoundAddCoinFinish();
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.mainCtrl.entrycondition || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    setLaiziPai() {
        let laiSpriteFrame = this.mainCtrl.getPaiSpriteFrameByValue(this.mainCtrl.laiValue);
        this.lai_sprite.spriteFrame = laiSpriteFrame;
    },

    setPlayerInfo(playerlist, isDrop, iszhahu) {
        for (let i = 0; i < playerlist.length; i++) {
            let player = playerlist[i];
            let url = null;
            if (player.seat == this.winSeat) {    //获胜者,iszhahu = true 时，为输家
                let user_winer = cc.instantiate(this.pab_userBarItem);
                user_winer.parent = this.content;
                let winerChilds = this.getUserNodeChild(user_winer);
                let selfSeat = this.mainCtrl.selfSeat;
                let winCoin = player.afterCalc;
                if (selfSeat == player.seat) {
                    winerChilds.lab_name.string = CommonFun.getInstance().getStrByLength(player.nickname, 8);
                    url = player.imgUrl
                    this.selfCtrl.setCoin(winCoin);
                } else {
                    winerChilds.lab_name.string = CommonFun.getInstance().getStrByLength(player.nickname, 8);
                    url = player.imgUrl
                    let otherUserCtrl = this.mainCtrl.getOtherNodeCtrlBySeat(player.seat);
                    otherUserCtrl.setCoin(winCoin);
                }
                if (url) {
                    this.loadHeadSp(url, 76, winerChilds.sprite_tx);
                }

                LoggerUtil.getInstance().log("结算后赢家的金币数", winCoin, "自己的座位ID", selfSeat, player.seat);
                winerChilds.lab_score.string = player.score;
                if(player.calc > 0 ){
                    winerChilds.lab_num.string = "+"+(player.calc / 100).toFixed(2);
                } else {
                    winerChilds.lab_num.string = (player.calc / 100).toFixed(2);
                }
                winerChilds.cardArr.removeAllChildren();
                if (isDrop) {
                    this.dropPai(player.cards, winerChilds.cardArr);
                } else if (iszhahu) {
                    winerChilds.winner_light.active = false;
                    winerChilds.sprite_type.spriteFrame = this.sprite_lose[language];
                    this.zhaHuPai(player.groups, winerChilds.cardArr, player.cards);
                } else {
                    winerChilds.winner_light.active = true;
                    winerChilds.sprite_type.spriteFrame = this.sprite_win[language];
                    this.huPai(player.groups, winerChilds.cardArr, player.cards);
                }
            } else {
                let user_loser = cc.instantiate(this.pab_userBarItem);
                user_loser.parent = this.content;
                let loseChilds = this.getUserNodeChild(user_loser);
                let selfSeat = this.mainCtrl.selfSeat;
                let winCoin = player.afterCalc;
                if (selfSeat == player.seat) {
                    loseChilds.lab_name.string = CommonFun.getInstance().getStrByLength(player.nickname, 8);
                    url = player.imgUrl
                    this.selfCtrl.setCoin(winCoin);
                } else {
                    loseChilds.lab_name.string = CommonFun.getInstance().getStrByLength(player.nickname, 8);
                     url = player.imgUrl
                     let otherUserCtrl = this.mainCtrl.getOtherNodeCtrlBySeat(player.seat);
                     otherUserCtrl.setCoin(winCoin);
                }
                if (url) {
                    this.loadHeadSp(url, 76, loseChilds.sprite_tx);
                }
                LoggerUtil.getInstance().log("结算后输家的金币数", winCoin);

                loseChilds.lab_score.string = player.score;
                if(player.calc > 0){
                    loseChilds.lab_num.string = "+"+(player.calc / 100).toFixed(2);
                }else{
                    loseChilds.lab_num.string = (player.calc / 100).toFixed(2);
                }
                loseChilds.winner_light.active = false;
                loseChilds.cardArr.removeAllChildren();
                if (isDrop) {
                    loseChilds.sprite_type.spriteFrame = this.sprite_drop[language];
                    this.dropPai(player.cards, loseChilds.cardArr);
                } else if (iszhahu) {
                    loseChilds.sprite_type.spriteFrame = this.sprite_win[language];
                    loseChilds.winner_light.active = true;
                    this.zhaHuPai(player.groups, loseChilds.cardArr, player.cards);
                } else {
                    loseChilds.sprite_type.spriteFrame = this.sprite_lose[language];
                    this.huPai(player.groups, loseChilds.cardArr, player.cards);
                }

            }

        }
    },

    //添加弃牌的牌
    dropPai(values, parentNode) {
        LoggerUtil.getInstance().log("添加弃牌的牌");
        let paiNodeArr = [];
        let initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;

        for (let i = 0; i < values.length; i++) {
            let paiNode = new cc.Node();
            paiNode.name = "paiNode";
            let paiSprite = paiNode.addComponent(cc.Sprite);
            paiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            paiSprite.spriteFrame = this.pai_back;
            paiNode.width = this.paiWidth;
            paiNode.height = this.paiHeight;
            paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + i * this.paiDistance, 0);
            paiNode.parent = parentNode;

            paiNodeArr.push(paiNode);
        }

    },


    zhaHuPai(values, parentNode, cards) {
        let lifeArr = [];
        let paiNodeArr = [];
        let initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;
        if (values.length != 0) {
            LoggerUtil.getInstance().log("结算的groups", values);
            let temp = 0;
            for (let i = 0; i < values.length; i++) {
                let group = values[i];
                let cards = group.cards;
                let nodeGroup = [];
                for (let j = 0; j < cards.length; j++) {
                    let paiNode = new cc.Node();
                    paiNode.name = "paiNode";
                    paiNode.width = this.paiWidth;
                    paiNode.height = this.paiHeight;
                    let paiSprite = paiNode.addComponent(cc.Sprite);
                    paiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    paiSprite.spriteFrame = this.mainCtrl.getPaiSpriteFrameByValue(cards[j]);
                    this.setLaiActive(cards[j], paiNode);
                    paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + temp * this.paiDistance, 0);
                    temp++;
                    paiNode.parent = parentNode;

                    //此处还需要加 生命序列条
                    nodeGroup.push(paiNode);
                }
                paiNodeArr.push(nodeGroup);

                let type = this.checkGroupLiftBar(nodeGroup);
                lifeArr.push({ type: type, childArr: nodeGroup });
            }
            lifeArr.sort((a, b) => { return a.type - b.type });
            let totalWidth = this.getPaiTotalWidthByPaiGroupArr(paiNodeArr);
            this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, paiNodeArr, lifeArr);
        } else {
            LoggerUtil.getInstance().log("group 不存在，cards", cards);
            for (let i = 0; i < cards.length; i++) {
                let paiNode = new cc.Node();
                paiNode.name = "paiNode";
                paiNode.width = this.paiWidth;
                paiNode.height = this.paiHeight;
                let paiSprite = paiNode.addComponent(cc.Sprite);
                paiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                paiSprite.spriteFrame = this.mainCtrl.getPaiSpriteFrameByValue(cards[i]);
                this.setLaiActive(cards[i], paiNode);
                paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + i * this.paiDistance, 0);
                paiNode.parent = parentNode;

                paiNodeArr.push(paiNode);
            }
            let totalWidth = this.getPaiTotalWidthByPaiGroupArr(paiNodeArr);
            this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, paiNodeArr);
        }

    },

    huPai(values, parentNode, cards) {
        let lifeArr = [];
        let paiNodeArr = [];
        let initPaiTotalWidth = this.paiWidth + 12 * this.paiDistance;
        if (values.length != 0) {
            LoggerUtil.getInstance().log("结算的groups", values);
            let temp = 0;
            for (let i = 0; i < values.length; i++) {
                let group = values[i];
                let cards = group.cards;
                let nodeGroup = [];
                for (let j = 0; j < cards.length; j++) {
                    let paiNode = new cc.Node();
                    paiNode.name = cards[j].toString();
                    paiNode.width = this.paiWidth;
                    paiNode.height = this.paiHeight;
                    let paiSprite = paiNode.addComponent(cc.Sprite);
                    paiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    paiSprite.spriteFrame = this.mainCtrl.getPaiSpriteFrameByValue(cards[j]);
                    this.setLaiActive(cards[j], paiNode);
                    paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + temp * this.paiDistance, 0);
                    temp++;
                    paiNode.parent = parentNode;

                    //此处还需要加 生命序列条
                    nodeGroup.push(paiNode);
                }
                paiNodeArr.push(nodeGroup);

                let type = this.checkGroupLiftBar(nodeGroup);
                lifeArr.push({ type: type, childArr: nodeGroup });
            }
            lifeArr.sort((a, b) => { return a.type - b.type });
            let totalWidth = this.getPaiTotalWidthByPaiGroupArr(paiNodeArr);
            this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, paiNodeArr, lifeArr);
        } else {
            LoggerUtil.getInstance().log("group 不存在，cards", cards);
            for (let i = 0; i < cards.length; i++) {
                let paiNode = new cc.Node();
                paiNode.name = "paiNode";
                paiNode.width = this.paiWidth;
                paiNode.height = this.paiHeight;
                let paiSprite = paiNode.addComponent(cc.Sprite);
                paiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                paiSprite.spriteFrame = this.mainCtrl.getPaiSpriteFrameByValue(cards[i]);
                this.setLaiActive(cards[i], paiNode);
                paiNode.setPosition(-initPaiTotalWidth / 2 + (this.paiDistance / 2) + i * this.paiDistance, 0);
                paiNode.parent = parentNode;

                paiNodeArr.push(paiNode);
            }
            let totalWidth = this.getPaiTotalWidthByPaiGroupArr(paiNodeArr);
            this.setPaiPosByTotalWidthAndpaiGroupArr(totalWidth, paiNodeArr);
        }

    },

    lifeBar(lifeArr) {
        let _1StCount = 0;
        let _2ndCount = 0;
        for (let j = 0, len = lifeArr.length; j < len; j++) {
            let element = lifeArr[j];
            if (element.type == 0 || element.type == 4) {
                this.setBar(element.childArr, element.type, false);
                continue
            } else if (element.type == 1) {
                _1StCount++
            } else if (element.type == 2) {
                _2ndCount++
            }

            if (_1StCount == 1) {
                if (element.type == 1) {
                    this.setBar(element.childArr, element.type, false);
                } else if (element.type == 2) {
                    if (_2ndCount == 1) {
                        this.setBar(element.childArr, element.type, false);
                    } else if (_2ndCount >= 2) {
                        this.setBar(element.childArr, 8, false);       //Sequence
                    }
                } else if (element.type == 3) {
                    if (_2ndCount >= 1) {
                        this.setBar(element.childArr, element.type, false);
                    } else {
                        this.setBar(element.childArr, 6, false);       //2nd Need
                    }
                }
            } else if (_1StCount == 2) {
                if (element.type == 1) {
                    this.setBar(element.childArr, 2, false);       //2nd
                } else if (element.type == 2) {
                    this.setBar(element.childArr, 8, false);       //Sequence
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 3, false);       //Set
                }
            } else if (_1StCount > 2) {
                if (element.type == 1) {
                    this.setBar(element.childArr, 7, false);       //Pure Sequence
                } else if (element.type == 2) {
                    this.setBar(element.childArr, 8, false);       //Sequence
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 3, false);       //Set
                }
            } else {                                          //无第一序列
                if (element.type == 2) {
                    this.setBar(element.childArr, 5, false);       //1st Need
                } else if (element.type == 3) {
                    this.setBar(element.childArr, 5, false);       //1st Need
                }
            }

        }
    },

    setBar(nodeGroup, type, isShowText) {
        // LoggerUtil.getInstance().log("获得的牌组的生命序列type：" + type);
        if (type == 0) {
            // LoggerUtil.getInstance().log("数组长度小于2，type不存在，跳过，数组为", paiGroup);
            return
        }
        let barNode = this.mainCtrl.setBarColor(type, isShowText);
        let barArea = this.setBarArea(nodeGroup);
        // LoggerUtil.getInstance().log("底部条的区域===========:", barArea);
        barNode.x = barArea.posX;
        barNode.width = barArea.width;
        barNode.y = -25;
        barNode.parent = nodeGroup[0].parent;
        barNode.setSiblingIndex(74);
    },

    setBarArea: function (group) {
        let width = 0;
        let posX = 0;
        let posY = 0;
        width = (group.length - 1) * this.paiDistance + group[0].width;
        if (group.length % 2 == 1) {
            let index = Math.floor(group.length / 2);
            posX = group[index].x;
        } else {
            let index1 = Math.floor(group.length / 2) - 1;
            let index2 = Math.floor(group.length / 2);
            posX = (group[index1].x + group[index2].x) / 2
        }
        return { width: width, posX: posX }
    },


    setLaiActive: function (value, parentNode) {
        let paiNum = this.mainCtrl.getPaiNum(value);
        if (this.mainCtrl.laiNumber == paiNum || value == 52 || value == 53) {
            let lai = new cc.Node();
            lai.name = "lai";
            lai.width = this.paiWidth - 4;
            lai.height = this.paiHeight - 2;
            let laiSprite = lai.addComponent(cc.Sprite);
            laiSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            laiSprite.type = cc.Sprite.Type.SLICED;
            laiSprite.spriteFrame = this.spriteAtlas_lai.getSpriteFrame("zz_yellow.9");
            lai.setPosition(0, 1);
            if (this.mainCtrl.laiNumber == paiNum) {
                let hat = new cc.Node();
                hat.name = "hat";
                hat.width = 16;
                hat.height = 16;
                let hatSprite = hat.addComponent(cc.Sprite);
                hatSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                hatSprite.spriteFrame = this.spriteAtlas_lai.getSpriteFrame("img_hat");
                hat.setPosition(-16, -10);
                hat.parent = lai;
            }
            lai.parent = parentNode;
        }
    },

    // 1 同花顺， 2 软顺，  3 AAA或AAAA， 4 错误组，5 无 
    checkGroupLiftBar: function (group) {
        if (group && group.length <= 2) {
            LoggerUtil.getInstance().log("传入的数组长度小于2");
            return 0;
        }
        let laiZiNum = 0;
        let laiZiArr = [];
        let heiTaoGroup = [];
        let hongXinGroup = [];
        let meiHuaGroup = [];
        let fangKuaiGroup = [];
        let paivalueArr = [];
        for (let i = 0, len = group.length; i < len; i++) {
            let paiValue = group[i].name;
            if (paiValue == 52 || paiValue == 53 || this.mainCtrl.getPaiNum(paiValue) == this.mainCtrl.laiNumber) {       // 癞子牌
                laiZiNum++;
                laiZiArr.push(paiValue);
            } else {
                if (paiValue <= 12) {
                    fangKuaiGroup.push(paiValue);
                } else if (paiValue <= 25) {
                    meiHuaGroup.push(paiValue);
                } else if (paiValue <= 38) {
                    hongXinGroup.push(paiValue);
                } else if (paiValue <= 51) {
                    heiTaoGroup.push(paiValue);
                }
                paivalueArr.push(paiValue);
            }

        };

        let huaSeNum = 0;
        if (fangKuaiGroup.length > 0) {
            huaSeNum++;
        }
        if (meiHuaGroup.length > 0) {
            huaSeNum++;
        }
        if (hongXinGroup.length > 0) {
            huaSeNum++;
        }
        if (heiTaoGroup.length > 0) {
            huaSeNum++;
        }

        if (huaSeNum == 0) {
            return 2;
        } else if (huaSeNum == 1) {
            let chaNum = 0;
            let nary = paivalueArr.sort((a, b) => a - b);
            //先判断是不是QKA，
            if(this.mainCtrl.getPaiNum(nary[0]) == 0){   //第一张为A
                let exceptA_Arr = nary.slice(1,nary.length);
                if(this.mainCtrl.getPaiNum(exceptA_Arr[0]) == 0){       //第二张也为 A
                    return 4
                }else if(exceptA_Arr.length == 1){
                    let cha = this.mainCtrl.containA(nary[0], exceptA_Arr[0]);
                    if(cha == 0){   //含有同一张牌
                        return 4
                    }else{
                        chaNum += cha - 1;
                    }
                }else{
                    for (let i = 0; i < exceptA_Arr.length-1; i++) {
                        if(exceptA_Arr[i] == 0){
                            return 4
                        }
                        let cha = exceptA_Arr[i + 1] - exceptA_Arr[i];
                        if(cha == 0){   //含有同一张牌
                            return 4
                        }else{
                            chaNum += cha - 1;
                        }
                    }
                    let diff = this.mainCtrl.containA(nary[0], exceptA_Arr[0]) >= this.mainCtrl.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) ? this.mainCtrl.containA(nary[0], exceptA_Arr[exceptA_Arr.length - 1]) : this.mainCtrl.containA(nary[0], exceptA_Arr[0]);
                    chaNum += diff - 1;
                }
            }else{
                for (let i = 0, len = nary.length; i < len - 1; i++) {
                    let cha = nary[i + 1] - nary[i];
                    if (cha == 0) {             //含有同一张牌
                        return 4;
                    }else{
                        chaNum += cha - 1;
                    }
                }
            }
            let isSameType = this.isSameType(nary, laiZiArr);     //是不是同一个花色
            let isContinuity = this.isContinuity(nary, laiZiArr);   //是不是连续的
            if (chaNum == 0) {
                if (laiZiNum > 0) {
                    if (isSameType && isContinuity) {
                        return 1;
                    } else {
                        return 2;
                    }
                } else {
                    return 1;
                }
            } else if (chaNum != 0) {
                if (chaNum > laiZiNum) {
                    return 4;
                } else if (chaNum <= laiZiNum) {
                    if (isSameType && isContinuity) {
                        return 1;
                    } else {
                        return 2;
                    }
                }
            }
        } else if (huaSeNum == 2 || huaSeNum == 3 || huaSeNum == 4) {
            let isRepeat = this.isRepeat(paivalueArr);
            if (isRepeat) {
                return 4;
            } else {
                let paiTotal = 0;
                let paiNumArr = [];
                let nary = paivalueArr.sort((a, b) => {
                    return a - b
                });
                for (let i = 0, len = nary.length; i < len; i++) {
                    let pai = this.mainCtrl.getPaiNum(nary[i]);
                    paiNumArr.push(pai);
                    paiTotal += pai;
                }
                paiNumArr.sort((a, b) => a - b);
                if (paiTotal == paiNumArr[0] * nary.length && laiZiNum + nary.length <= 4) {
                    return 3;
                } else {
                    return 4;
                }
            }
        } else {
            return 4;
        }
    },

    isRepeat: function (arr) {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i]]) {
                return true;
            }
            hash[arr[i]] = true;
        }
        return false;
    },

    isSameType: function (a = [], b = []) {
        let paiValue = a[0];
        let a_paiType = this.mainCtrl.getPaiType(paiValue);
        for (let i = 0, len = b.length; i < len; i++) {
            let value = b[i];
            let b_paiType = this.mainCtrl.getPaiType(value);
            if (a_paiType == b_paiType) {
                continue
            } else {
                return false
            }
        }
        return true;

    },

    //是不是连续
    isContinuity: function (a = [], b = []) {
        let c = a.concat(b);
        c = c.sort((a, b) => {
            return a - b
        });
        for (let i = 0, len = c.length; i < len - 1; i++) {
            if(c[i + 1] == c[i]){ return false} //有两张相同的癞子牌
            if (c[i + 1] - c[i] != 1) {
                //第一张牌为 A，最后一张为 K
                if(this.mainCtrl.getPaiNum(c[i]) == 0 && this.mainCtrl.getPaiNum(c[len - 1]) == 12){           
                    continue
                }
                return false;
            }
        }
        return true;
    },

    getPaiTotalWidthByPaiGroupArr: function (paiGroupArr) {
        let totalWidth = 0;
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            let paiGroup = paiGroupArr[i];
            let paiGroupLen = paiGroup.length;
            let tempWidth = (paiGroupLen - 1) * this.paiDistance + this.paiWidth;
            totalWidth += tempWidth
        }
        return totalWidth;
    },

    setPaiPosByTotalWidthAndpaiGroupArr: function (totalWidth, paiGroupArr, lifeArr) {
        // LoggerUtil.getInstance().log("设置每个组间距");
        let qiPos = totalWidth / 2;
        let tempX = 0;
        for (let i = 0, len = paiGroupArr.length; i < len; i++) {
            let paiGroup = paiGroupArr[i];
            for (let k = 0, len1 = paiGroup.length; k < len1; k++) {
                let paiNode = paiGroup[k];
                if (i == 0) {
                    tempX = -qiPos + this.paiWidth / 2 + this.paiDistance * k;
                } else {
                    if (k == 0) {
                        tempX = tempX + this.groupDistance + this.paiWidth;
                    } else {
                        tempX = tempX + this.paiDistance;
                    }
                }
                paiNode.setPosition(tempX, 0);
            }
        }
        if (lifeArr) {
            LoggerUtil.getInstance().log("判断生命序列");
            this.lifeBar(lifeArr);
        }
    },

    getUserNodeChild(usernode) {
        let sprite_tx = usernode.getChildByName("tx").getComponent(cc.Sprite);
        let winner_light = usernode.getChildByName("light");
        let lab_name = usernode.getChildByName("lab_name").getComponent(cc.Label);
        let sprite_type = usernode.getChildByName("win_or").getComponent(cc.Sprite);
        let lab_score = usernode.getChildByName("lab_score").getComponent(cc.Label);
        let lab_num = usernode.getChildByName("lab_num").getComponent(cc.Label);
        let cardArr = usernode.getChildByName("cardArr");
        return {
            sprite_tx: sprite_tx, winner_light: winner_light, lab_name: lab_name,
            sprite_type: sprite_type, lab_score: lab_score, lab_num: lab_num, cardArr: cardArr

        }
    },

    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    start() {

    },

    // update (dt) {},
});
