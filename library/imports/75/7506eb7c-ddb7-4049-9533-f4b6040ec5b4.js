"use strict";
cc._RF.push(module, '7506et83bdASZUz9LYEDsW0', 'Test_xl');
// Main/Script/Tools/Test_xl.js

"use strict";

exports.__esModule = true;
exports["default"] = void 0;
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var _cc$_decorator = cc._decorator,
  ccclass = _cc$_decorator.ccclass,
  property = _cc$_decorator.property;
ccclass('test_xl');
var test_xl = /*#__PURE__*/function (_cc$Component) {
  _inheritsLoose(test_xl, _cc$Component);
  function test_xl() {
    return _cc$Component.apply(this, arguments) || this;
  }
  var _proto = test_xl.prototype;
  _proto.start = function start() {};
  _proto.update = function update(deltaTime) {};
  return test_xl;
}(cc.Component);
exports["default"] = test_xl;
if (cc.EDITOR) {
  // 重写 update 方法，以在编辑模式下自动播放动画
  sp.Skeleton.prototype.update = function (dt) {
    if (cc.EDITOR) {
      cc['engine']._animatingInEditMode = 1;
      cc['engine'].animatingInEditMode = 1;
    }
    if (this.paused) return;
    dt *= this.timeScale * sp.timeScale;
    if (this.isAnimationCached()) {
      // 缓存模式并且有动画队列
      if (this._isAniComplete) {
        if (this._animationQueue.length === 0 && !this._headAniInfo) {
          var frameCache = this._frameCache;
          if (frameCache && frameCache.isInvalid()) {
            frameCache.updateToFrame();
            var frames = frameCache.frames;
            this._curFrame = frames[frames.length - 1];
          }
          return;
        }
        if (!this._headAniInfo) {
          this._headAniInfo = this._animationQueue.shift();
        }
        this._accTime += dt;
        if (this._accTime > this._headAniInfo.delay) {
          var aniInfo = this._headAniInfo;
          this._headAniInfo = null;
          this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
        }
        return;
      }
      this._updateCache(dt);
    } else {
      this._updateRealtime(dt);
    }
  };
}
module.exports = exports["default"];

cc._RF.pop();