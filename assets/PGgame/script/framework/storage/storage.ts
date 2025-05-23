// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export namespace tcStorage {
    export enum Keys {
        UserId = "UserId",
        Authorization = "Authorization",
        TelNumber = "TelNumber",
        DeviceId = "DeviceId",
        Language = "Language",
        Password = "Password",
        SoundSwitch = "SoundSwitch",
        InvitationCode = "InvitationCode",
        musicVolume = "musicVolume",
        effectVolume = "effectVolume",
    }

    export function save(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    export function readInt(key: string): number {
        const value = localStorage.getItem(key);

        return parseInt(value ?? "0");
    }

    export function readFloat(key: string): number {
        const value = localStorage.getItem(key);

        return parseFloat(value ?? "0");
    }

    export function readAny(key: string): string {
        return localStorage.getItem(key) ?? "";
    }

    export function isExist(key: string): boolean {
        return localStorage.getItem(key) != null;
    }

    export function remove(key: string) {
        localStorage.removeItem(key);
    }

    export function clear() {
        localStorage.clear();
    }
}
