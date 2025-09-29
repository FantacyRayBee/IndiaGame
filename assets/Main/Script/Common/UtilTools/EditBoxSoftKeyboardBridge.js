// EditBoxSoftKeyboardBridge.js
// Cocos Creator 2.4.x 仅 Web/H5 使用
cc.Class({
    extends: cc.Component,

    properties: {
        useInputModeNone: {
            default: true,
            tooltip: '对 <input> 设置 inputmode="none"（部分浏览器可彻底不弹系统键盘）'
        },
        hideNativeCaret: {
            default: true,
            tooltip: '隐藏原生光标（避免闪一下系统光标）'
        }
    },

    onLoad () {
        this._editBox = this.node.getComponent(cc.EditBox);
        if (!this._editBox) {
            cc.error('[EditBoxSoftKeyboardBridge] 需要挂在含有 EditBox 的节点上');
            return;
        }
        if (CC_JSB) { // 只在 Web 生效
            cc.warn('[EditBoxSoftKeyboardBridge] 原生端无法在 JS 层禁止系统键盘。');
            return;
        }


        this._kbNode = null;          // 当前软键盘实例
        this._kbParent = null;        // 软键盘父节点（用于监听 CHILD_REMOVED）
        this._onChildRemovedBound = null;
        this._loadingKb = false;      // 防重复加载

        this._boundNodeTouch = null;
        this._boundInputFocus = null;

        // 等一帧确保 _impl 就绪
        this.scheduleOnce(() => {
            this._impl = this._editBox._impl; // WebEditBoxImpl
            if (!this._impl) {
                cc.warn('[EditBoxSoftKeyboardBridge] 未获取到 WebEditBoxImpl');
                return;
            }
            this._inputEl = this._impl._inputEL || this._impl._textareaEL || null;

            // DOM 级别阻止系统键盘
            if (this._inputEl) {
                if (this.useInputModeNone) this._inputEl.setAttribute('inputmode', 'none');
                this._inputEl.setAttribute('readonly', 'readonly');
                this._inputEl.setAttribute('tabindex', '-1');
                this._inputEl.style.pointerEvents = 'none';
                if (this.hideNativeCaret) this._inputEl.style.caretColor = 'transparent';

                // 兜底：万一仍被 focus，立即 blur
                this._boundInputFocus = () => {
                    this._inputEl && this._inputEl.blur && this._inputEl.blur();
                };
                this._inputEl.addEventListener('focus', this._boundInputFocus, { passive: true });
            }

            // 覆盖 impl 的 begin/end
            this._patchWebImpl();

            // 拦点击，走我们覆盖的 begin
            this._boundNodeTouch = (e) => {
                e && e.stopPropagation && e.stopPropagation();
                this._impl && this._impl.beginEditing && this._impl.beginEditing();
            };
            this.node.on(cc.Node.EventType.TOUCH_END, this._boundNodeTouch, this);
        }, 0);
    },

    onDestroy () {
        if (!CC_JSB) {
            if (this._boundNodeTouch) {
                this.node.off(cc.Node.EventType.TOUCH_END, this._boundNodeTouch, this);
                this._boundNodeTouch = null;
            }
            if (this._inputEl && this._boundInputFocus) {
                this._inputEl.removeEventListener('focus', this._boundInputFocus);
                this._boundInputFocus = null;
            }
        }
        // 解绑父节点 CHILD_REMOVED
        this._unbindKbParentListener();

        // 卸载系统事件
        cc.systemEvent.off('SOFTKB_INPUT', this._onKbInput, this);
        cc.systemEvent.off('SOFTKB_DONE', this._onKbDone, this);
        cc.systemEvent.off('SOFTKB_HIDE', this._onKbHide, this);
    },

    _patchWebImpl () {
        const impl = this._impl;
        const inputEl = this._inputEl;
        const node = this.node;
        const editBox = this._editBox;

        const origEnd = impl.endEditing ? impl.endEditing.bind(impl) : null;

        impl.beginEditing = () => {
            // 若标记为“编辑中”但键盘节点已不在（可能被外部销毁），自修复
            if (impl._editing) {
                if (!this._kbNode || !this._kbNode.isValid || !this._kbNode.activeInHierarchy) {
                    impl._editing = false; // 复位
                } else {
                    return; // 正在编辑且键盘还在，直接返回
                }
            }

            impl._editing = true;

            if (inputEl) { try { inputEl.blur(); } catch(e) {} }

            // 发 began（保持与 EditBox 行为一致）
            node.emit('editing-did-began', editBox);

            // 弹出自定义软键盘
            this._beginWithCustomKeyboard();
        };

        impl.endEditing = () => {
            if (!impl._editing) return;
            impl._editing = false;

            node.emit('editing-did-ended', editBox);

            if (origEnd) { try { origEnd(); } catch(e) {} }
        };

        cc.log('[EditBoxSoftKeyboardBridge] Patched WebEditBoxImpl.beginEditing/endEditing');
    },

    _beginWithCustomKeyboard () {
        if (!this._editBox) return;

        // 避免重复绑定
        cc.systemEvent.off('SOFTKB_INPUT', this._onKbInput, this);
        cc.systemEvent.off('SOFTKB_DONE', this._onKbDone, this);
        cc.systemEvent.off('SOFTKB_HIDE', this._onKbHide, this);
        cc.systemEvent.on('SOFTKB_INPUT', this._onKbInput, this);
        cc.systemEvent.on('SOFTKB_DONE', this._onKbDone, this);
        cc.systemEvent.on('SOFTKB_HIDE', this._onKbHide, this);

        // 若已有键盘实例且仍有效，就不再创建
        if (this._kbNode && this._kbNode.isValid && this._kbNode.activeInHierarchy) {
            // 已有键盘 → 直接广播当前目标
            cc.systemEvent.emit("SOFTKB_TARGET", { 
                editBox: this._editBox,
                text: this._editBox.string || ""
            });
            return;
        }
        if (this._loadingKb) return;
        this._loadingKb = true;

        // 异步加载键盘 prefab
        const p = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SOFTKEYBORAD);
        p.then((prefab) => {
            if (!prefab) throw new Error('prefab null');
            const node = cc.instantiate(prefab);
            this._kbNode = node;

            // 加到你指定的父节点里
            CommonFun.getInstance().addToPointParent(node, GlobalCfg.PREFAB_PARENT.SOFTKEYBORAD);

            // 监听父节点 CHILD_REMOVED，感知键盘被外部销毁
            this._bindKbParentListener(node.parent);

            // === prefab 成功实例化后再广播 ===
            cc.systemEvent.emit("SOFTKB_TARGET", { 
                editBox: this._editBox,
                text: this._editBox.string || ""
            });

        }).catch((err) => {
            cc.error('[EditBoxSoftKeyboardBridge] load keyboard prefab failed:', err);
            if (this._impl) this._impl._editing = false; // 复位
        }).finally(() => {
            this._loadingKb = false;
        });
    },

    // 父节点监听：当键盘节点被 remove/destroy，我们复位 _editing
    _bindKbParentListener (parent) {
        this._unbindKbParentListener();
        if (!parent) return;

        this._kbParent = parent;
        this._onChildRemovedBound = (child) => {
            if (child === this._kbNode) {
                this._onKeyboardGone();
            }
        };
        parent.on(cc.Node.EventType.CHILD_REMOVED, this._onChildRemovedBound, this);
    },

    _unbindKbParentListener () {
        if (this._kbParent && this._onChildRemovedBound) {
            this._kbParent.off(cc.Node.EventType.CHILD_REMOVED, this._onChildRemovedBound, this);
        }
        this._kbParent = null;
        this._onChildRemovedBound = null;
    },

    _onKeyboardGone () {
        // 键盘节点不存在/被销毁：复位编辑态，清理引用
        if (this._impl) this._impl._editing = false;
        this._kbNode = null;
        this._unbindKbParentListener();
    },

    // —— 收键盘输入并回填到 EditBox —— //
    _onKbInput (evt) {
        const data = evt && evt.detail ? evt.detail : evt;
        if (!data || !this._editBox || !this._impl || !this._impl._editing) return;

        let s = this._editBox.string || '';
        switch (data.type) {
            case 'CHAR':
                if (this._reachMax(s)) return;
                s += (data.ch || '');
                this._setStringAndEmit(s);
                break;
            case 'SPACE':
                if (this._reachMax(s)) return;
                s += ' ';
                this._setStringAndEmit(s);
                break;
            case 'BACK':
                if (s.length > 0) {
                    s = s.substring(0, s.length - 1);
                    this._setStringAndEmit(s);
                }
                break;
        }
    },

    _onKbDone () {
        if (!this._editBox || !this._impl) return;
        // 结束编辑 + 清理键盘引用
        this._impl.endEditing && this._impl.endEditing();
        this._onKeyboardGone();
    },

    _onKbHide () {
        if (!this._editBox || !this._impl) return;
        this._impl.endEditing && this._impl.endEditing();
        this._onKeyboardGone();
    },

    _reachMax (s) {
        const max = this._editBox.maxLength || 0;
        return (max > 0 && s.length >= max);
    },

    _setStringAndEmit (s) {
        this._editBox.string = s;
        this.node.emit('text-changed', this._editBox);
    }
});
