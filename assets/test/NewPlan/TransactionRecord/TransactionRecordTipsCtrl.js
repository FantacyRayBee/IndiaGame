cc.Class({
    extends: cc.Component,

    properties: {
        lab_content: cc.Label,
        btn_okay: cc.Button,
    },

    onLoad: function() {
        this.btn_okay.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.setLabContent();
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_okay.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.node.destroy();
                break;
            default:
                break;
        };
    },

    setLabContent: function() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                this.lab_content.string = `1. Order processing in 1-7 working days Please be patient.\n\n2. There may be a delay in disbursement to your bank account after the order state being successful. And delay days dependon the withdrawal way you choose.\n\n3. If you have problems with the order,Please contact our customer service.\n\n4. E-mail: ${GlobalCfg.USER_DATAS.customerService.email}`;
                break;
            case I18NLanguagesEnum.Hindi:
                this.lab_content.string = `1. ऑर्डर प्रोसेसिंग 1-7 कार्य दिवसों में कृपया धैर्य रखें।\n\n2. ऑर्डर सफल होने के बाद आपके बैंक खाते में भुगतान में देरी हो सकती है। और देरी के दिन आपके द्वारा चुने गए निकासी के तरीके पर निर्भर करते हैं।\n\n3. यदि आपको ऑर्डर में कोई समस्या है, तो कृपया हमारी ग्राहक सेवा से संपर्क करें।\n\n4. ई-मेल: ${GlobalCfg.USER_DATAS.customerService.email}`;
                break;
            case I18NLanguagesEnum.Urdu:
                this.lab_content.string = `1. 1-7 کام کے دنوں میں آرڈر پر کارروائی ہو رہی ہے، براہ کرم صبر کریں۔\n\n2. آرڈر کی حالت کامیاب ہونے کے بعد آپ کے بینک اکاؤنٹ میں رقم کی ادائیگی میں تاخیر ہو سکتی ہے۔ اور تاخیر کے دن اس بات پر منحصر ہیں کہ آپ کس طرح واپسی کا انتخاب کرتے ہیں۔\n\n3۔ اگر آپ کو آرڈر کے ساتھ مسائل ہیں، تو براہ کرم ہماری کسٹمر سروس سے رابطہ کریں۔\n\n4: ${GlobalCfg.USER_DATAS.customerService.email}`;
                break;
            case I18NLanguagesEnum.Bengali:
                this.lab_content.string = `1. 1-7 কার্যদিবসের মধ্যে অর্ডার প্রক্রিয়া করা হচ্ছে অনুগ্রহ করে ধৈর্য ধরুন।\n\n2. অর্ডার স্টেট সফল হওয়ার পরে আপনার ব্যাঙ্ক অ্যাকাউন্টে অর্থ প্রদানে বিলম্ব হতে পারে। এবং বিলম্বের দিনগুলি আপনার বেছে নেওয়া উপায়ের উপর নির্ভর করে।\n\n3. অর্ডার নিয়ে আপনার সমস্যা হলে, অনুগ্রহ করে আমাদের কাস্টমার সার্ভিসের সাথে যোগাযোগ করুন।\n\n4. ই-মেইল: ${GlobalCfg.USER_DATAS.customerService.email}`;
                break;
            default:
                this.lab_content.string = `1. Order processing in 1-7 working days Please be patient.\n\n2. There may be a delay in disbursement to your bank account after the order state being successful. And delay days dependon the withdrawal way you choose.\n\n3. If you have problems with the order,Please contact our customer service.\n\n4. E-mail: ${GlobalCfg.USER_DATAS.customerService.email}`;
                break;
        };
    },
});
