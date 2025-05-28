export const Game_Const = {
    native_version: "1.0.0",
    Gmee_Type: "pg_rabbit",

    Game_Host: "",
    server_ips: [],
    server_list: {
        "test": {
            Game_Host: "https://test.mtmeme.com/",
            server_ips: [
                { host: "wss://st.mtmeme.com", port: 15010 },
                { host: "wss://st.mtmeme.com", port: 15011 },
                { host: "wss://st.mtmeme.com", port: 15012 },
                { host: "wss://st.mtmeme.com", port: 15013 },
                { host: "wss://st.mtmeme.com", port: 15014 }
            ]
        }
    },


    language: "en-US",
    loginData: {
        notify_url: "https://apitest.mtmeme.com/callbacktest",
        amount: 1000 * 1000,
        platform: 'test',
        key: 'T55JZQX4yrtwrGzh',
        secret: 'b770901c-856e-44ce-9291-ff90664fadec',
        channel_id: 'default'
    }
};
