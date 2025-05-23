
export default class LoginUtil {



    static newUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static generateUserID(): string {
        const characters = '0123456789';
        let userID = '';
        for (let i = 0; i < 6; i++) {
            userID += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return userID;
    }









}