cc.Class({
    extends: cc.Component,

    properties: {
        lab: cc.Label,
        node_content: cc.Node,
        prefab_item: cc.Prefab
    },

    onLoad: function() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                this.lab.string = `1. To become a VIP, you need to recharge at least 200 Rs. The higher your VIP level,the more privileges you have.\n\n2. The higher the VIP level, the more times and amounts of withdrawals will be made.\n\n3. From the time of the user's last recharge, if the user does not make any recharge in ${GlobalCfg.USER_DATAS.vipExpiresDay} consecutive days, the VIP level will be frozen.Accordingly, the level benefit will not be available, and the progressbar will not increase neither.`
                break;
            case I18NLanguagesEnum.Hindi:
                this.lab.string = `1. VIP बनने के लिए आपको कम से कम 200 रुपये का रिचार्ज कराना होगा। आपका वीआईपी स्तर जितना ऊंचा होगा, आपके पास उतने ही अधिक विशेषाधिकार होंगे।\n\n2. वीआईपी स्तर जितना अधिक होगा, निकासी उतनी अधिक बार और मात्रा में की जाएगी।\n\n3. उपयोगकर्ता के अंतिम रिचार्ज के समय से, यदि उपयोगकर्ता ${GlobalCfg.USER_DATAS.vipExpiresDay} लगातार दिनों में कोई रिचार्ज नहीं करता है, तो वीआईपी लेवल फ्रीज कर दिया जाएगा। तदनुसार, लेवल लाभ उपलब्ध नहीं होगा, और प्रोग्रेसबार होगा ना तो बढ़ाओ और ना ही बढ़ाओ.`;
                break;
            case I18NLanguagesEnum.Urdu:
                this.lab.string = `1. VIP بننے کے لیے، آپ کو کم از کم 200 روپے کا ریچارج کرنا ہوگا۔ آپ کا VIP لیول جتنا اونچا ہوگا، آپ کو اتنی ہی زیادہ مراعات حاصل ہوں گی۔\n\n2. VIP لیول جتنا اونچا ہوگا، اتنی ہی زیادہ رقم نکلوائی جائے گی۔\n\n3۔ صارف کے آخری ریچارج کے وقت سے، اگر صارف مسلسل ${GlobalCfg.USER_DATAS.vipExpiresDay} دنوں میں کوئی ریچارج نہیں کرتا ہے، تو VIP لیول منجمد ہو جائے گا۔ اس کے مطابق، لیول کا فائدہ دستیاب نہیں ہوگا، اور پروگریس بار اضافہ بھی نہیں.`
                break;
            case I18NLanguagesEnum.Bengali:
                this.lab.string = `1. ভিআইপি হওয়ার জন্য, আপনাকে কমপক্ষে 200 টাকা রিচার্জ করতে হবে৷ আপনার ভিআইপি লেভেল যত বেশি হবে, তত বেশি সুবিধা পাবেন।\n\n2. ভিআইপি লেভেল যত বেশি হবে, তত বেশি বার এবং পরিমাণ টাকা তোলা হবে।\n\n3. ব্যবহারকারীর শেষ রিচার্জের সময় থেকে, ব্যবহারকারী যদি পরপর ${GlobalCfg.USER_DATAS.vipExpiresDay} দিনে কোনো রিচার্জ না করেন, তাহলে VIP লেভেল হিমায়িত হয়ে যাবে। সেই অনুযায়ী, লেভেলের সুবিধা পাওয়া যাবে না, এবং প্রগ্রেসবার বাড়েও না।`
                break;
            default:
                this.lab.string = `1. To become a VIP, you need to recharge at least 200 Rs. The higher your VIP level,the more privileges you have.\n\n2. The higher the VIP level, the more times and amounts of withdrawals will be made.\n\n3. From the time of the user's last recharge, if the user does not make any recharge in ${GlobalCfg.USER_DATAS.vipExpiresDay} consecutive days, the VIP level will be frozen.Accordingly, the level benefit will not be available, and the progressbar will not increase neither.`
                break;
        };
        
    },

    start: function() {
        let vipArr = [];
        GlobalCfg.USER_DATAS.vipLevels.sort((a, b) => {return a.level - b.level});
        for (let i = 0, len = GlobalCfg.USER_DATAS.vipLevels.length; i < len; i += 2) {
            const element1 = GlobalCfg.USER_DATAS.vipLevels[i];
            const element2 = GlobalCfg.USER_DATAS.vipLevels[i + 1];
            let obj = {
                node1Data: element1,
                node2Data: element2,
            };
            vipArr.push(obj);
        };

        let index = 0;
        let len = vipArr.length;
        let addItemFun = () => {
            if (index >= len) {
                this.unschedule(addItemFun);
                return; 
            };
            let itemData = vipArr[index];
            let itemNode = cc.instantiate(this.prefab_item);
            let scr = itemNode.getComponent("VipRulesRuleItemCtrl");
            scr.setVipRulesRuleItemData(itemData);
            this.node_content.addChild(itemNode);
            index += 1;
        };
        this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
    },
});
