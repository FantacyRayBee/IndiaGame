cc.Class({
    extends: cc.Component,

    properties: {
        sprite_gold_coin: {
            default: null,
            type: cc.SpriteFrame
        },
        sprite_lubi_coin: {
            default: null,
            type: cc.SpriteFrame
        },
        sprite_silver_coin: {
            default: null,
            type: cc.SpriteFrame
        },
        sprite_free: {
            default: null,
            type: cc.SpriteFrame
        },
        btn_okay: {
            default: null,
            type: cc.Button
        },
        layout: {
            default: null,
            type: cc.Layout
        },
        node_coin: {
            default: null,
            type: cc.Node
        },
    },

    ctor(){
        this.gold_pos = cc.v2(8, 0);
        this.gold_size = cc.size(64, 54);
        this.silver_pos = cc.v2(4, 0);
        this.silver_size = cc.size(60, 60);
        this.lubi_pos = cc.v2(0, 0);
        this.lubi_size = cc.size(64, 54);
    },

    onLoad: function() {
        this.btn_okay.node.on("click", CommonFun.getInstance().debounce(() => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.btn_okay.interactable = false;
            this.btn_okay.enableAutoGrayEffect = true;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
                msgData: {}
            }); 
            this.node.destroy();
        }, 1), this);
    },

    deduplicationArr(arr){
        let array = arr || [];
        if(array.length == 0 || array.length <= 2){
            return array;
        }
        let result = [];
        let map = new Map();
        for (let index = 0; index < array.length; index++) {
            const item = array[index];
            if(map.has(item.id)){
                map.get(item.id).amount += item.amount;
            }else{
                map.set(item.id, item);
            }
        }
        if(map.has(11)){
            map.get(10).amount += map.get(11).amount;
            map.delete(11);
        }
        result = Array.from(map.values());
        return result;
    },

    /**
     * coin {
            id,        // 10 deposit, 11 winnings 12 bonus
            amount
        }
     * 
     * @param {Array{coin}} params 
     */
    setRewards(params) {
        console.log("setRewardsCoin params === ", params);

        let array = this.deduplicationArr(params);
        console.log("setRewardsCoin array === ", array);

        for (let i = 0; i < array.length; i++) {
            const coin = array[i];
            if(i < 1){
                this.setRewardsCoin(coin, this.node_coin);
            }else{
                let node_coin = cc.instantiate(this.node_coin);
                this.layout.node.addChild(node_coin);
                this.setRewardsCoin(coin, node_coin);
            }
        }
    },

    setRewardsCoin: function(coin, node) {
        let id = coin.id;
        let amount = coin.amount;
        let lab_coin = node.getChildByName("lab_coin").getComponent(cc.Label);
        let sprite = node.getChildByName("coin").getComponent(cc.Sprite);
        switch (id) {
            case 10:
                sprite.spriteFrame = this.sprite_lubi_coin;
                sprite.node.setPosition(this.lubi_pos);
                sprite.node.setContentSize(this.lubi_size);
                break;
            case 11:
                sprite.spriteFrame = this.sprite_gold_coin;
                sprite.node.setPosition(this.gold_pos);
                sprite.node.setContentSize(this.gold_size);
                break;
            case 12:
                sprite.spriteFrame = this.sprite_silver_coin;
                sprite.node.setPosition(this.silver_pos);
                sprite.node.setContentSize(this.silver_size);
                break;
            case 999:
                sprite.spriteFrame = this.sprite_free;
                sprite.node.setScale(0.8);
                break;
            default:
                break;
        }
        // 保留 2 位小数
        lab_coin.string = `${amount.toFixed(2)}`;
    },
});
