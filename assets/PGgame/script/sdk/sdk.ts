// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export namespace sdk {
    export interface ErrorDialogOption {
        title?: string;
        content: string;
        subContent?: string;
        confirmCallback: Function;
        cancelCallback?: Function;
        confirmText?: string;
        cancelText?: string;
    }

    export interface FinalPageOption {
        title: string;
        subTitle: string;
        confirmText: string;
        onConfirmCallback: Function;
    }

    const children: Array<ChildNode> = [];

    function htmlToElement(html: string) {
        var template = document.createElement("template");
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function addUIBlock() {
        /* @keyframes duration | easing-function | delay | iteration-count | direction | fill-mode | play-state | name */
        const htmlString = `<div class="ui_block" tabindex="100"
        style="animation: 0.15s ease-out 0s 1 normal forwards running ui_block_show; z-index: 1000; width: 360px; height: 640px;">
      </div>`;
        const div = document.getElementById("game-overlay");
        if (!div) {
            return;
        }

        const child = htmlToElement(htmlString);
        if (!child) {
            return;
        }

        div.appendChild(child);
        children.push(child);
    }

    export function showErrorDialog(opt: ErrorDialogOption) {
        addUIBlock();
        let titleDiv = "";
        if (opt.title) {
            titleDiv = `<div class="title title_padding "><b>${opt.title}</b></div>`;
        }
        let subContentDiv = "";
        if (opt.subContent) {
            subContentDiv = `<span class="errorlabel">${opt.subContent}<span></span></span>`;
        }
        const confirmText = opt.confirmText ?? "Confirm";
        const cancelText = opt.cancelText ?? "Cancel";
        const htmlString = `<div id="__custom_alert" class="custom_alert custom_alert_show" style="display: block; width: 360px; height: 640px;">
        <div class="backdrop"></div>
        <div class="content" style="left: 58.5px; top: 242.5px;">
            ${titleDiv}
            <div class="message message_padding ${titleDiv === "" ? "single_content_padding" : ""}">${opt.content}<br>${subContentDiv}</div>
            <div class="line_separator"></div>
            <div class="btn_content btn_content_row">
                <div id="ca-button-0" class="button">${confirmText}</div>
                <div class="btn_separator_width row"></div>
                <div id="ca-button-1" class="button">${cancelText}</div>
            </div>
        </div>
    </div>`;

        const child = htmlToElement(htmlString);
        if (!child) {
            return;
        }

        const div = document.getElementById("game-overlay");
        if (!div) {
            return;
        }

        div.appendChild(child);
        children.push(child);

        const btnConfirm = document.getElementById("ca-button-0");
        if (btnConfirm) {
            btnConfirm.onclick = () => opt.confirmCallback();
        }

        const btnCancel = document.getElementById("ca-button-1");
        if (btnCancel) {
            btnCancel.onclick = () => opt.cancelCallback?.();
        }
    }

    export function closeDialog() {
        children.forEach((v) => {
            v.remove();
        });
        children.length = 0;
    }

    export function showFinalPage(opt: FinalPageOption) {
        const htmlString = `<div class="qpage" style="width: 360px; height: 640px;">
        <div class="qpage_container">
            <div class="qpage_content">
                <div class="sprite_main_res ic_iconic qpage_boy"></div>
                <div class="qpage_title"><b>${opt.title}</b><br></div>
                <div class="qpage_desc"><b>${opt.subTitle}</b><br></div>
                <div id="reload_button" class="qpage_button">${opt.confirmText}</div>
            </div>
        </div>
    </div>`;

        const child = htmlToElement(htmlString);
        if (!child) {
            return;
        }

        const div = document.getElementById("game-overlay");
        if (!div) {
            return;
        }

        div.appendChild(child);
        children.push(child);

        const btnConfirm = document.getElementById("reload_button");
        if (btnConfirm) {
            btnConfirm.onclick = () => opt.onConfirmCallback();
        }
    }

    /**
     * 打开历史记录弹窗
     */
    export function openHistoryDialog(userId: number, token: string, language: string) {
        //@ts-ignore
        window.openHistoryDialog && window.openHistoryDialog(userId, token, language);
    }

    /**
     * 打开规则弹窗
     */
    export function openRuleDialog(userId: number, token: string, language: string) {
        //@ts-ignore
        window.openRuleDialog && window.openRuleDialog(userId, token, language);
    }

    /**
     * 打开赔付表弹窗
     */
    export function openPaytableDialog(userId: number, token: string, language: string) {
        //@ts-ignore
        window.openPaytableDialog && window.openPaytableDialog(userId, token, language);
    }
}
