

import GameManager from "./manager/GameManager";
import UIManager from "./manager/UIManager";
import FadeManager from "./manager/FadeManager";

export class StaticInstance {
    static uiManager: UIManager | undefined = undefined;
    static gameManager: GameManager | undefined = undefined;
    static fadeManager: FadeManager | undefined = undefined;

    static setUIManager(context: UIManager) {
        StaticInstance.uiManager = context;
    }

    static setGameManager(context: GameManager) {
        StaticInstance.gameManager = context
    }

    static setFadeManager(context: FadeManager) {
        StaticInstance.fadeManager = context
    }
}