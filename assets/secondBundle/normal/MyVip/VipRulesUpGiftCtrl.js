cc.Class({
    extends: cc.Component,

    properties: {
        lab: cc.Label,
    },

    onLoad: function() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                this.lab.string = `1. Each level of VIP Super Gift Pack can only be purchased once, \nused to quickly upgrade the current level.\n2. VIP quick recharge gift package can directly skip the current \nlevel and enter the next level.\n3. Players who recharge through this activity can enjoy the same \nVIP benefits.`
                break;
            case I18NLanguagesEnum.Hindi:
                this.lab.string = `1. वीआईपी सुपर गिफ्ट पैक के प्रत्येक स्तर को केवल एक बार खरीदा जा सकता है, \nवर्तमान स्तर को तुरंत अपग्रेड करने के लिए उपयोग किया जाता है।\n2. वीआईपी त्वरित रिचार्ज उपहार पैकेज सीधे वर्तमान \nस्तर को छोड़ कर अगले स्तर में प्रवेश कर सकता है।\n3. जो खिलाड़ी इस गतिविधि के माध्यम से रिचार्ज करते हैं वे समान वीआईपी लाभों का आनंद ले सकते हैं।`;
                break;
            case I18NLanguagesEnum.Urdu:
                this.lab.string = `1. VIP سپر گفٹ پیک کی ہر سطح کو صرف ایک بار خریدا جا سکتا ہے، \n موجودہ سطح کو تیزی سے اپ گریڈ کرنے کے لیے استعمال کیا جاتا ہے۔\n2۔ VIP کوئیک ریچارج گفٹ پیکیج براہ راست موجودہ \nلیول کو چھوڑ کر اگلی سطح میں داخل ہو سکتا ہے۔\n3۔ اس سرگرمی کے ذریعے ری چارج کرنے والے کھلاڑی اسی \nVIP فوائد سے لطف اندوز ہو سکتے ہیں۔`;
                break;
            case I18NLanguagesEnum.Bengali:
                this.lab.string = `1. VIP সুপার গিফট প্যাকের প্রতিটি স্তর শুধুমাত্র একবার কেনা যাবে, \nবর্তমান স্তর দ্রুত আপগ্রেড করার জন্য ব্যবহার করা হয়।\n2. ভিআইপি দ্রুত রিচার্জ গিফট প্যাকেজ সরাসরি বর্তমান \nলেভেল এড়িয়ে পরবর্তী স্তরে প্রবেশ করতে পারে।\n৩. এই কার্যকলাপের মাধ্যমে রিচার্জ করা খেলোয়াড়েরা একই \nVIP সুবিধা উপভোগ করতে পারবেন।`;
                break;
            default:
                this.lab.string = `1. Each level of VIP Super Gift Pack can only be purchased once, \nused to quickly upgrade the current level.\n2. VIP quick recharge gift package can directly skip the current \nlevel and enter the next level.\n3. Players who recharge through this activity can enjoy the same \nVIP benefits.`;
                break;
        };
        
    },
});
