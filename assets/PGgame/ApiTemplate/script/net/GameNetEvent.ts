enum GameNetEvent {
    Disconnect = "disconnect",
    IoError = "io-error",
    OnKick = "onKick",
    Error = "error",
    Close = "close",
    Reconnect = "reconnect",
    HeartbeatTimeout = "heartbeat timeout",
    updateNetDelay = "updateNetDelay",
    loginOK = "loginOK",
    loginFail = "loginFail",
    registerOK = "registerOK",
    registerFail = "registerFail",
    tryconnect = "tryconnect",
    tryFail = "tryFail",
    // Add other event names as needed,
    ShowDisconnectTip = "ShowDisconnectTip",
    GetGatewayConfirm = "GetGatewayConfirm"

}

export default GameNetEvent;