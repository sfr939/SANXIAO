window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  ActionController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01b8aICfmlB5pFqJs1o/QYR", "ActionController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var CubeView_1 = require("../CubeView/CubeView");
    var CubePool_1 = require("./CubePool");
    var GameSceneEvent_1 = require("./GameSceneEvent");
    var GameSceneModel_1 = require("./GameSceneModel");
    var GameSceneViewModel_1 = require("./GameSceneViewModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ActionController = function(_super) {
      __extends(ActionController, _super);
      function ActionController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scoreLabel = null;
        _this.musicNodeScript = null;
        _this.plateList = null;
        _this.plateTypeList = null;
        _this.plateIdList = null;
        _this.tempDel = null;
        return _this;
      }
      ActionController.prototype.onLoad = function() {
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
      };
      ActionController.prototype.onEnable = function() {
        this.node.on("moveToBox", this.onMoveToBoxEvent, this);
      };
      ActionController.prototype.onDisable = function() {
        this.node.off("moveToBox", this.onMoveToBoxEvent, this);
        this.clearPoolAndPlateList();
      };
      ActionController.prototype.onMoveToBoxEvent = function(event) {
        var _this = this;
        if (this.checkPlateFull()) GameManager_1.GameManager.Debug("box full"); else {
          var cubeView_1 = event.target.getComponent(CubeView_1.default);
          cubeView_1.removeTouchEndEvent();
          GameSceneModel_1.gameSceneModel.moveToBox(cubeView_1.cfid).then(function(data) {
            GameManager_1.GameManager.Debug("move--resolve");
            cubeView_1.onMoveToBox();
            _this.moveToPlate(cubeView_1, data);
          }, function() {
            GameManager_1.GameManager.Debug("move--reject");
            cubeView_1.addTouchEndEvent();
          });
        }
      };
      ActionController.prototype.clearPoolAndPlateList = function() {
        CubePool_1.cubePool.clearPool();
        this.plateList = null;
        this.plateTypeList = null;
        this.plateIdList = null;
        this.tempDel = null;
      };
      ActionController.prototype.checkPlateFull = function() {
        return GameSceneModel_1.gameSceneModel.box.length >= GameSceneModel_1.gameSceneModel.plateNum;
      };
      ActionController.prototype.clearPlateList = function() {
        this.plateList = [];
        this.plateTypeList = [];
        this.plateIdList = [];
        this.tempDel = [];
      };
      Object.defineProperty(ActionController.prototype, "plateListLenth", {
        get: function() {
          return null == this.plateList ? 0 : this.plateList.length;
        },
        enumerable: false,
        configurable: true
      });
      ActionController.prototype.moveToRightTween = function(item, itemIndex, time) {
        cc.Tween.stopAllByTarget(item.node);
        var y = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.y;
        cc.tween().target(item.node).to(time, {
          x: GameSceneViewModel_1.gameSceneViewModel.plateStartPos.x + itemIndex * GameSceneViewModel_1.gameSceneViewModel.cubeWidth,
          y: y
        }).start();
      };
      ActionController.prototype.removeTween = function(item) {
        null != item && cc.tween().target(item.node).delay(.1).to(.2, {
          scale: 0
        }).call(function() {
          CubePool_1.cubePool.onKilled(item.node);
        }).start();
      };
      ActionController.prototype.move_Tween = function(item, targetPos, time) {
        cc.Tween.stopAllByTarget(item.node);
        cc.tween().target(item.node).to(time, {
          position: targetPos
        }).start();
      };
      ActionController.prototype.moveToPlate = function(item, callbackType) {
        var _this = this;
        callbackType == GameSceneModel_1.CallbackType.ShowNew && this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("showNew", true));
        var curLength = this.plateListLenth;
        var targetPos = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.clone();
        var targetIndex = 0;
        if (0 != curLength) {
          targetIndex = this.plateTypeList.lastIndexOf(item.imgType);
          if (targetIndex > -1 && curLength > targetIndex + 1) {
            targetPos.x += (targetIndex + 1) * GameSceneViewModel_1.gameSceneViewModel.cubeWidth;
            targetIndex++;
          } else {
            targetIndex = curLength;
            targetPos.x += curLength * GameSceneViewModel_1.gameSceneViewModel.cubeWidth;
          }
        }
        var del = GameSceneModel_1.gameSceneModel.del.slice();
        new Promise(function(resolve, reject) {
          if (null == _this.plateList) {
            _this.plateList = [];
            _this.plateTypeList = [];
            _this.plateIdList = [];
          }
          null == _this.tempDel && (_this.tempDel = []);
          _this.plateList.splice(targetIndex, 0, item);
          _this.plateTypeList.splice(targetIndex, 0, item.imgType);
          _this.plateIdList.splice(targetIndex, 0, item.cfid);
          for (var index = targetIndex + 1; index < _this.plateList.length; index++) _this.moveToRightTween(_this.plateList[index], index, .2);
          for (var i = 0; i < del.length; i++) {
            var index = _this.plateIdList.indexOf(del[i]);
            var item_1 = _this.plateList[index];
            _this.plateList.splice(index, 1);
            _this.plateTypeList.splice(index, 1);
            _this.plateIdList.splice(index, 1);
            _this.tempDel.push(item_1);
          }
          cc.Tween.stopAllByTarget(item.node);
          cc.tween().target(item.node).to(.3, {
            position: targetPos
          }).call(function() {
            GameManager_1.GameManager.Debug("move2");
            resolve(null);
          }).start();
          GameManager_1.GameManager.Debug("move1");
        }).then(function() {
          GameManager_1.GameManager.Debug("move3--" + callbackType);
          switch (callbackType) {
           case GameSceneModel_1.CallbackType.ReLoad:
            _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("sheepHpUpdate", true));
            _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("reload", true));
            break;

           case GameSceneModel_1.CallbackType.Fail:
            _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("fail", true));
            break;

           case GameSceneModel_1.CallbackType.FinishAll:
            _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("finishAll", true));
          }
          _this.checkXiaoChu();
        });
      };
      ActionController.prototype.checkXiaoChu = function() {
        if (null != this.tempDel && this.tempDel.length > 0) {
          this.musicNodeScript.playOnXiaoChu();
          for (var i = this.tempDel.length - 1; i >= 0; i--) {
            var item = this.tempDel[i];
            this.tempDel.splice(i, 1);
            this.removeTween(item);
          }
          this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("sheepHpUpdate", true));
          this.moveOther();
        }
      };
      ActionController.prototype.moveOther = function() {
        for (var itemIndex = 0; itemIndex < this.plateList.length; itemIndex++) {
          var item = this.plateList[itemIndex];
          var newX = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.x + itemIndex * GameSceneViewModel_1.gameSceneViewModel.cubeWidth;
          var y = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.y;
          if (item.node.x != newX) {
            cc.Tween.stopAllByTarget(item.node);
            cc.tween().target(item.node).delay(.3).to(.1, {
              x: newX,
              y: y
            }).start();
          }
        }
      };
      ActionController.prototype.move_AbovePlate = function(movePokerArr) {
        if (null == this.plateList || 0 == this.plateList.length) return;
        for (var itemIndex = this.plateList.length - 1; itemIndex >= 0; itemIndex--) {
          var element = this.plateList[itemIndex];
          var index = movePokerArr.indexOf(element.cfid);
          if (index > -1) {
            var data = GameSceneModel_1.gameSceneModel.structDic[element.cfid];
            var x = data["x"];
            var y = data["y"];
            var z = data["z"];
            var imgType = data["picture"];
            var direct = data["direct"];
            element.initData(element.cfid, x, y, z, imgType, direct);
            element.moveToPlate2();
            var offsetX = -7 * GameSceneViewModel_1.gameSceneViewModel.blockWidth;
            var targetPos = new cc.Vec3(offsetX + x * GameSceneViewModel_1.gameSceneViewModel.blockWidth, GameSceneViewModel_1.gameSceneViewModel.plateStartPos.y + element.node.height + 20);
            this.move_Tween(element, targetPos, .1);
            this.plateList.splice(itemIndex, 1);
            this.plateTypeList.splice(itemIndex, 1);
            this.plateIdList.splice(itemIndex, 1);
          }
        }
        for (var itemIndex = 0; itemIndex < this.plateList.length; itemIndex++) {
          var item = this.plateList[itemIndex];
          var newX = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.x + itemIndex * GameSceneViewModel_1.gameSceneViewModel.cubeWidth;
          var y = GameSceneViewModel_1.gameSceneViewModel.plateStartPos.y;
          if (item.node.x != newX) {
            cc.Tween.stopAllByTarget(item.node);
            cc.tween().target(item.node).to(.2, {
              x: newX,
              y: y
            }).start();
          }
        }
      };
      ActionController.prototype.move_Revert = function(revertPokerArr) {
        if (null == this.plateList || 0 == this.plateList.length) return;
        for (var itemIndex = this.plateList.length - 1; itemIndex >= 0; itemIndex--) {
          var element = this.plateList[itemIndex];
          var index = revertPokerArr.indexOf(element.cfid);
          if (index > -1) {
            var data = GameSceneModel_1.gameSceneModel.structDic[element.cfid];
            var x = data["x"];
            var y = data["y"];
            var z = data["z"];
            var direct = data["direct"];
            var imgType = data["picture"];
            element.initData(element.cfid, x, y, z, imgType, direct);
            element.moveToPlate2();
            var targetPos = void 0;
            if (-100 == y) {
              var offsetX = -7 * GameSceneViewModel_1.gameSceneViewModel.blockWidth;
              targetPos = new cc.Vec3(offsetX + x * GameSceneViewModel_1.gameSceneViewModel.blockWidth, GameSceneViewModel_1.gameSceneViewModel.plateStartPos.y + element.node.height + 20);
            } else targetPos = GameSceneViewModel_1.gameSceneViewModel.getCubePos(x, y, z, direct);
            this.move_Tween(element, targetPos, .3);
            this.plateList.splice(itemIndex, 1);
            this.plateTypeList.splice(itemIndex, 1);
            this.plateIdList.splice(itemIndex, 1);
          }
        }
        this.moveOther();
      };
      __decorate([ property(cc.Node) ], ActionController.prototype, "scoreLabel", void 0);
      ActionController = __decorate([ ccclass ], ActionController);
      return ActionController;
    }(cc.Component);
    exports.default = ActionController;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../CubeView/CubeView": "CubeView",
    "./CubePool": "CubePool",
    "./GameSceneEvent": "GameSceneEvent",
    "./GameSceneModel": "GameSceneModel",
    "./GameSceneViewModel": "GameSceneViewModel"
  } ],
  ChangeSpriteGray: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80407Kp+4VOZZD2/3Uc0Y1s", "ChangeSpriteGray");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ChangeSpriteGray = function(_super) {
      __extends(ChangeSpriteGray, _super);
      function ChangeSpriteGray() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprite = null;
        _this.normal = null;
        _this.gray = null;
        return _this;
      }
      ChangeSpriteGray.prototype.ChangeToGray = function() {
        null != this.sprite && this.sprite.setMaterial(0, this.gray);
      };
      ChangeSpriteGray.prototype.ChangeToNormal = function() {
        null != this.sprite && this.sprite.setMaterial(0, this.normal);
      };
      __decorate([ property(cc.Sprite) ], ChangeSpriteGray.prototype, "sprite", void 0);
      __decorate([ property(cc.Material) ], ChangeSpriteGray.prototype, "normal", void 0);
      __decorate([ property(cc.Material) ], ChangeSpriteGray.prototype, "gray", void 0);
      ChangeSpriteGray = __decorate([ ccclass ], ChangeSpriteGray);
      return ChangeSpriteGray;
    }(cc.Component);
    exports.default = ChangeSpriteGray;
    cc._RF.pop();
  }, {} ],
  ClickPlayAudio: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1b5f9/zdVxPeKWCRbdEFSGE", "ClickPlayAudio");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ClickPlayAudio = function(_super) {
      __extends(ClickPlayAudio, _super);
      function ClickPlayAudio() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.musicNodeScript = null;
        return _this;
      }
      ClickPlayAudio.prototype.onLoad = function() {
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
      };
      ClickPlayAudio.prototype.start = function() {};
      ClickPlayAudio.prototype.onEnable = function() {
        this.node.on("touchend", this.on_touch_ended, this);
      };
      ClickPlayAudio.prototype.onDisable = function() {
        this.node.off("touchend", this.on_touch_ended, this);
      };
      ClickPlayAudio.prototype.on_touch_ended = function() {
        this.musicNodeScript.playOnClick();
      };
      ClickPlayAudio = __decorate([ ccclass ], ClickPlayAudio);
      return ClickPlayAudio;
    }(cc.Component);
    exports.default = ClickPlayAudio;
    cc._RF.pop();
  }, {} ],
  CubePool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d545dMIKnNCRJTb3fWVh/3V", "CubePool");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.cubePool = exports.CubePool = void 0;
    var CubePool = function() {
      function CubePool() {
        this.CubePool = null;
        this.PrefabCube = null;
      }
      CubePool.prototype.initCubePool = function(prefab) {
        if (null == this.CubePool) {
          this.CubePool = new cc.NodePool();
          this.PrefabCube = prefab;
          var initCount = 100;
          for (var i = 0; i < initCount; ++i) {
            var cube = cc.instantiate(this.PrefabCube);
            this.CubePool.put(cube);
          }
        }
      };
      CubePool.prototype.createCube = function() {
        var cube = null;
        cube = this.CubePool.size() > 0 ? this.CubePool.get() : cc.instantiate(this.PrefabCube);
        cube.scale = 1;
        return cube;
      };
      CubePool.prototype.onKilled = function(cube) {
        cc.Tween.stopAllByTarget(cube);
        cube.scale = 1;
        this.CubePool.put(cube);
      };
      CubePool.prototype.clearPool = function() {
        null != this.CubePool && this.CubePool.clear();
      };
      return CubePool;
    }();
    exports.CubePool = CubePool;
    exports.cubePool = new CubePool();
    cc._RF.pop();
  }, {} ],
  CubeView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b62fEJn1lOrLJsX7jqv4e6", "CubeView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var MoveRound_1 = require("./MoveRound");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CubeView = function(_super) {
      __extends(CubeView, _super);
      function CubeView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.cubeBg = null;
        _this.itemBgNode = null;
        _this.huisebg = null;
        _this.moveRound = null;
        _this.buttonComp = null;
        _this._cfid = 0;
        _this._posZ = 0;
        _this._posX = 0;
        _this._posY = 0;
        _this._imgType = -999;
        _this._direct = 0;
        return _this;
      }
      Object.defineProperty(CubeView.prototype, "cfid", {
        get: function() {
          return this._cfid;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(CubeView.prototype, "imgType", {
        get: function() {
          return this._imgType;
        },
        enumerable: false,
        configurable: true
      });
      CubeView.prototype.initData = function(id, x, y, z, imgType, direct) {
        this.coverCount = 0;
        this.node.zIndex = z;
        this._cfid = id;
        this._posX = x;
        this._posY = y;
        this._posZ = z;
        this._direct = direct;
        this.itembg1 = this.itemBgNode.getChildByName("itembg1");
        this.changeImg(imgType);
      };
      CubeView.prototype.onLoad = function() {
        this.collider = this.node.getComponent(cc.BoxCollider);
      };
      CubeView.prototype.onEnable = function() {
        this.setMaskEnable(false);
        this.collider.enabled = true;
        this.addTouchEndEvent();
      };
      CubeView.prototype.onDisable = function() {
        this.removeTouchEndEvent();
      };
      CubeView.prototype.changeImg = function(imgType) {
        var _this = this;
        this._imgType = imgType;
        cc.resources.load("Texture/cubeImg/" + imgType, cc.SpriteFrame, function(err, spriteFrame) {
          _this.itembg1.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
      };
      CubeView.prototype.start = function() {};
      CubeView.prototype.setMaskEnable = function(bool) {
        if (this.moveRound.shuffling) return;
        this.huisebg.active = bool;
        this.buttonComp.interactable = !bool;
        0 != this._direct ? this.itembg1.active = !bool : this.itembg1.active = true;
      };
      CubeView.prototype.onCollisionEnter = function(other, self) {
        var otherCube = other.getComponent("CubeView");
        if (otherCube._posZ > this._posZ) {
          this.coverCount++;
          this.setMaskEnable(this.coverCount > 0);
        }
      };
      CubeView.prototype.onCollisionExit = function(other, self) {
        var otherCube = other.getComponent("CubeView");
        if (otherCube._posZ > this._posZ) {
          this.coverCount--;
          this.setMaskEnable(this.coverCount > 0);
          this.coverCount <= 0 && (this.coverCount = 0);
        }
      };
      CubeView.prototype.addTouchEndEvent = function() {
        this.node.on("touchend", this.on_touch_ended, this);
      };
      CubeView.prototype.removeTouchEndEvent = function() {
        this.node.off("touchend", this.on_touch_ended, this);
      };
      CubeView.prototype.on_touch_ended = function() {
        GameManager_1.GameManager.Debug("on_touch_ended--" + this._cfid + "||" + this._posZ + "||" + this._posX + "||" + this._posY);
        if (this.huisebg.active || GameSceneModel_1.gameSceneModel.isWaitingMove) return;
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("moveToBox", true));
      };
      CubeView.prototype.onMoveToBox = function() {
        this.setMaskEnable(false);
        this.collider.enabled = false;
        this.node.zIndex = 999;
      };
      CubeView.prototype.moveToPlate2 = function() {
        this.addTouchEndEvent();
        this.collider.enabled = true;
        this.node.zIndex = this._posZ;
      };
      __decorate([ property(cc.Sprite) ], CubeView.prototype, "cubeBg", void 0);
      __decorate([ property(cc.Node) ], CubeView.prototype, "itemBgNode", void 0);
      __decorate([ property(cc.Node) ], CubeView.prototype, "huisebg", void 0);
      __decorate([ property(MoveRound_1.default) ], CubeView.prototype, "moveRound", void 0);
      __decorate([ property(cc.Button) ], CubeView.prototype, "buttonComp", void 0);
      CubeView = __decorate([ ccclass ], CubeView);
      return CubeView;
    }(cc.Component);
    exports.default = CubeView;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../GameScene/GameSceneEvent": "GameSceneEvent",
    "../GameScene/GameSceneModel": "GameSceneModel",
    "./MoveRound": "MoveRound"
  } ],
  DressManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc47ffHVJRG4aH3A+5Wq899", "DressManager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DressManager = function(_super) {
      __extends(DressManager, _super);
      function DressManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        _this.MainLayOut = null;
        _this.clickOpenUrl = false;
        _this.AllNum = 18;
        _this.page = 1;
        _this.pageNum = 12;
        _this.selectID = 1;
        _this.Bowls = new Array(12);
        return _this;
      }
      DressManager.prototype.onEnable = function() {
        this.node.on("Select", this.SelectBowl, this);
      };
      DressManager.prototype.onDisable = function() {
        this.node.off("Select", this.SelectBowl, this);
      };
      DressManager.prototype.SelectBowl = function(event) {
        var oldchildNum = this.selectID % this.pageNum == 0 ? 12 : this.selectID % this.pageNum;
        this.Bowls[oldchildNum - 1].SetSelectFalse(false);
        this.selectID = event.detail;
        oldchildNum = this.selectID % this.pageNum == 0 ? 12 : this.selectID % this.pageNum;
        this.Bowls[oldchildNum - 1].SetSelectFalse(true);
      };
      DressManager.prototype.onLoad = function() {
        this.SetBowlNum(12);
      };
      DressManager.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      DressManager.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      DressManager.prototype.CLickLeft = function(touchEvent) {
        if (1 == this.page) return;
        this.page--;
        var Num = this.pageNum;
        this.SetNewChildren(Num);
      };
      DressManager.prototype.CLickRight = function(touchEvent) {
        var allpage = Math.ceil(this.AllNum / this.pageNum);
        console.log(allpage);
        if (this.page == allpage) return;
        this.page++;
        var Num = this.AllNum - this.pageNum * (this.page - 1);
        this.SetNewChildren(Num);
      };
      DressManager.prototype.ClickClose = function(touchEvent) {
        this.closeTween();
      };
      DressManager.prototype.SetNewChildren = function(Num) {
        this.MainLayOut.node.removeAllChildren();
        for (var index = 0; index < Num; index++) {
          var ID = (this.page - 1) * this.pageNum + index + 1;
          this.Bowls[index].SetSpriteFrame(ID, this.selectID == ID);
          this.MainLayOut.node.addChild(this.Bowls[index].node);
        }
      };
      DressManager.prototype.SetBowlNum = function(Num) {
        var self = this.MainLayOut;
        var Bowls = this.Bowls;
        var Select = this.selectID;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            for (var index = 0; index < Num; index++) {
              var newMyPrefab = cc.instantiate(loadedResource);
              newMyPrefab.getChildByName("IsSelect").active = 0 == index;
              newMyPrefab.getComponent("SmallBowl").SetSpriteFrame("" + (index + 1), Select == index + 1);
              self.node.addChild(newMyPrefab);
              Bowls[index] = newMyPrefab.getComponent("SmallBowl");
              resolve(null);
            }
          };
          cc.resources.load("prefab/Smallbowl", onResourceLoaded);
        });
      };
      __decorate([ property(cc.Node) ], DressManager.prototype, "scaleNode", void 0);
      __decorate([ property(cc.Layout) ], DressManager.prototype, "MainLayOut", void 0);
      DressManager = __decorate([ ccclass ], DressManager);
      return DressManager;
    }(cc.Component);
    exports.default = DressManager;
    cc._RF.pop();
  }, {} ],
  FailedWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7fd2ari/OVBWoJbD9Vg0x3z", "FailedWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FailedWindow = function(_super) {
      __extends(FailedWindow, _super);
      function FailedWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        _this.infoPart = null;
        _this.revivePart = null;
        _this.musicNodeScript = null;
        _this.hasClickQuit = false;
        _this.ReviveType = GameSceneModel_1.ItemType.move;
        _this.hasClickRetry = false;
        return _this;
      }
      FailedWindow.prototype.onLoad = function() {
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
      };
      FailedWindow.prototype.start = function() {
        this.hasClickRetry = false;
        this.CheckShowRevivePart();
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      FailedWindow.prototype.on_touch_ended = function(touchEvent) {
        this.musicNodeScript.playOnClick();
        switch (touchEvent.currentTarget._name) {
         case "retryBtn":
          this.Retry();
          break;

         case "backtomenuBtn":
          this.BackToMenu();
          break;

         case "reviveBtn":
          this.Revive();
          break;

         case "giveupBtn":
         case "closeBtn":
          this.GiveUp();
        }
      };
      FailedWindow.prototype.CheckShowRevivePart = function() {
        var IsTimesEnough = GameSceneModel_1.gameSceneModel.getItemTimes(this.ReviveType) > 0;
        var IsUseTimesEnough = GameSceneModel_1.gameSceneModel.getCanUseItemTimes(this.ReviveType) > 0;
        IsUseTimesEnough && IsTimesEnough || (this.revivePart.scale = 0);
      };
      FailedWindow.prototype.Revive = function() {
        var IsTimesEnough = GameSceneModel_1.gameSceneModel.getItemTimes(this.ReviveType) > 0;
        var IsUseTimesEnough = GameSceneModel_1.gameSceneModel.getCanUseItemTimes(this.ReviveType) > 0;
        if (!IsUseTimesEnough || !IsTimesEnough) {
          this.revivePart.scale = 0;
          return;
        }
        this.closeTween();
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("revive", true));
      };
      FailedWindow.prototype.GiveUp = function() {
        var _this = this;
        GameSceneModel_1.gameSceneModel.quitGame().then(function() {
          _this.hasClickQuit = true;
        });
        cc.tween(this.revivePart).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).start();
      };
      FailedWindow.prototype.Retry = function() {
        var _this = this;
        if (this.hasClickRetry) return;
        this.hasClickRetry = true;
        this.hasClickQuit ? GameSceneModel_1.gameSceneModel.startGame().then(function() {
          _this.closeTween();
          _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("reload", true));
        }) : GameSceneModel_1.gameSceneModel.quitGame().then(function() {
          return GameSceneModel_1.gameSceneModel.startGame().then(function() {
            _this.closeTween();
            _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("reload", true));
          });
        });
      };
      FailedWindow.prototype.BackToMenu = function() {
        var _this = this;
        this.hasClickQuit || GameSceneModel_1.gameSceneModel.quitGame();
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
          _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("backToMenu", true));
        }).start();
      };
      FailedWindow.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      __decorate([ property(cc.Node) ], FailedWindow.prototype, "scaleNode", void 0);
      __decorate([ property(cc.Node) ], FailedWindow.prototype, "infoPart", void 0);
      __decorate([ property(cc.Node) ], FailedWindow.prototype, "revivePart", void 0);
      FailedWindow = __decorate([ ccclass ], FailedWindow);
      return FailedWindow;
    }(cc.Component);
    exports.default = FailedWindow;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneEvent": "GameSceneEvent",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  FinishWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "001126wOfRLzpDUn1Tr6vz6", "FinishWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FinishWindow = function(_super) {
      __extends(FinishWindow, _super);
      function FinishWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        _this.infoPart = null;
        _this.musicNodeScript = null;
        return _this;
      }
      FinishWindow.prototype.onLoad = function() {
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
      };
      FinishWindow.prototype.start = function() {
        GameSceneModel_1.gameSceneModel.quitGame();
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      FinishWindow.prototype.on_touch_ended = function(touchEvent) {
        this.musicNodeScript.playOnClick();
        switch (touchEvent.currentTarget._name) {
         case "backtomenuBtn":
          this.BackToMenu();
        }
      };
      FinishWindow.prototype.BackToMenu = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
          _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("backToMenu", true));
        }).start();
      };
      __decorate([ property(cc.Node) ], FinishWindow.prototype, "scaleNode", void 0);
      __decorate([ property(cc.Node) ], FinishWindow.prototype, "infoPart", void 0);
      FinishWindow = __decorate([ ccclass ], FinishWindow);
      return FinishWindow;
    }(cc.Component);
    exports.default = FinishWindow;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneEvent": "GameSceneEvent",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  GameManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac91e5yfrlFvoJJh1u6b9k8", "GameManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameManager = void 0;
    var GetHttp_1 = require("./tool/GetHttp");
    var GameManager = function() {
      function GameManager() {}
      GameManager.Debug = function(value) {
        GameManager.logEnable && console.log(value);
      };
      GameManager.SetLocalData = function(key, value) {
        cc.sys.localStorage.setItem(GetHttp_1.default.userCode + "-" + key, value);
      };
      GameManager.GetLocalData = function(key) {
        return cc.sys.localStorage.getItem(GetHttp_1.default.userCode + "-" + key);
      };
      GameManager.logEnable = false;
      GameManager.helpUrl = "";
      GameManager.discordUrl = "";
      GameManager.twitterUrl = "";
      GameManager.teamUrl = "";
      GameManager.getItemUrl = "";
      GameManager.sheepChargeUrl = "";
      GameManager.itemChargeUrl = "";
      return GameManager;
    }();
    exports.GameManager = GameManager;
    cc._RF.pop();
  }, {
    "./tool/GetHttp": "GetHttp"
  } ],
  GameSceneEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48c4aeOcylO0Y2kjENuJNFt", "GameSceneEvent");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameSceneEvent = void 0;
    var GameSceneEvent = function(_super) {
      __extends(GameSceneEvent, _super);
      function GameSceneEvent(name, bubbles, detail) {
        var _this = _super.call(this, name, bubbles) || this;
        _this.detail = null;
        _this.detail = detail;
        return _this;
      }
      return GameSceneEvent;
    }(cc.Event);
    exports.GameSceneEvent = GameSceneEvent;
    cc._RF.pop();
  }, {} ],
  GameSceneModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11c35RfVA5KAb1iC5vvezKK", "GameSceneModel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.gameSceneModel = exports.CallbackType = exports.GameSceneModel = exports.ItemType = void 0;
    var GameManager_1 = require("../../GameManager");
    var GetHttp_1 = require("../../tool/GetHttp");
    var HttpAgreement_1 = require("../../tool/HttpAgreement");
    var ItemType;
    (function(ItemType) {
      ItemType["back"] = "back";
      ItemType["move"] = "move";
      ItemType["shuffle"] = "shuffle";
    })(ItemType = exports.ItemType || (exports.ItemType = {}));
    var GameSceneModel = function() {
      function GameSceneModel() {
        this.plateNum = 7;
        this.maxLv = 2;
        this.useItemTimes = 3;
        this.structDic = null;
        this.box = null;
        this.del = [];
        this.newStructArr = [];
        this.selectSheep = 0;
        this.UsedItemRecord = null;
        this.isWaitingMove = false;
        this.movePokerArr = [];
        this.revertPokerArr = [];
      }
      GameSceneModel.prototype.getItemTimes = function(type) {
        return 1;
      };
      GameSceneModel.prototype.getCanUseItemTimes = function(type) {
        return null != this.UsedItemRecord && this.UsedItemRecord.hasOwnProperty(type.toString()) ? this.useItemTimes - this.UsedItemRecord[type.toString()] : this.useItemTimes;
      };
      GameSceneModel.prototype.AddUseItemRecord = function(type, time) {
        void 0 === time && (time = 1);
        null == this.UsedItemRecord && (this.UsedItemRecord = {});
        this.UsedItemRecord.hasOwnProperty(type.toString()) || (this.UsedItemRecord[type.toString()] = 0);
        this.UsedItemRecord[type.toString()] += time;
      };
      GameSceneModel.prototype.UseItemUppdateData = function(type) {};
      GameSceneModel.prototype.getUserInfo = function() {
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.getUserInfo).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          var data = JSON.parse(message);
          if (0 == data["s"]) return Promise.resolve();
          GameManager_1.GameManager.Debug("request error");
          return Promise.reject();
        }).catch(function(message) {
          GameManager_1.GameManager.Debug("request error");
          GameManager_1.GameManager.Debug(message);
        });
      };
      GameSceneModel.prototype.getStruct = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.getStruct).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          return _this.parseData_getStruct(message, _this);
        }).catch(function(message) {
          GameManager_1.GameManager.Debug("request error");
          GameManager_1.GameManager.Debug(message);
        });
      };
      GameSceneModel.prototype.parseData_getStruct = function(message, self) {
        return new Promise(function(resolve, reject) {
          var data = JSON.parse(message);
          self.lvl = data["lvl"];
          self.structDic = {};
          data["grid"].forEach(function(element) {
            self.structDic.hasOwnProperty(element["id"]) || (self.structDic[element["id"]] = element);
          });
          self.box = data["box"];
          self.isWaitingMove = false;
          resolve(null);
        });
      };
      GameSceneModel.prototype.startGame = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.startGame, {
          sheepId: this.selectSheep
        }).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          var data = JSON.parse(message);
          _this.UsedItemRecord = {};
          return 0 == data["s"] ? Promise.resolve() : Promise.reject();
        });
      };
      GameSceneModel.prototype.quitGame = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.quitGame, {
          sheepId: this.selectSheep
        }).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          return _this.getUserInfo();
        });
      };
      GameSceneModel.prototype.moveToBox = function(pokerId) {
        var _this = this;
        this.isWaitingMove = true;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.moveToBox, {
          pokerId: pokerId,
          sheepId: this.selectSheep
        }).then(function(message) {
          _this.isWaitingMove = false;
          GameManager_1.GameManager.Debug(message);
          return _this.parseData_moveToBox(message, _this);
        });
      };
      GameSceneModel.prototype.parseData_moveToBox = function(message, self) {
        return new Promise(function(resolve, reject) {
          var data = JSON.parse(message);
          if (0 == data["s"]) {
            self.newStructArr = [];
            self.box = data["box"];
            self.del = data["del"];
            if (self.lvl != data["lvl"]) {
              self.UsedItemRecord = {};
              data["lvl"] >= self.maxLv ? resolve(CallbackType.FinishAll) : resolve(CallbackType.ReLoad);
            } else if (self.box.length >= 7) resolve(CallbackType.Fail); else {
              data["grid"].forEach(function(element) {
                if (!self.structDic.hasOwnProperty(element["id"])) {
                  self.structDic[element["id"]] = element;
                  self.newStructArr.push(element["id"]);
                }
              });
              if (self.newStructArr.length > 0) {
                GameManager_1.GameManager.Debug(self.newStructArr);
                resolve(CallbackType.ShowNew);
              } else resolve(CallbackType.Move);
            }
          } else {
            GameManager_1.GameManager.Debug("request error");
            reject(null);
          }
        });
      };
      GameSceneModel.prototype.shuffle = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.shuffle).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          var data = JSON.parse(message);
          if (0 == data["s"]) {
            _this.UseItemUppdateData(ItemType.shuffle);
            _this.AddUseItemRecord(ItemType.shuffle);
            return Promise.resolve();
          }
          return Promise.reject();
        }).catch(function(message) {
          GameManager_1.GameManager.Debug("request error");
          GameManager_1.GameManager.Debug(message);
        });
      };
      GameSceneModel.prototype.movePoker = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.movePoker).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          var data = JSON.parse(message);
          _this.movePokerArr = [];
          if (0 == data["s"]) {
            _this.UseItemUppdateData(ItemType.move);
            _this.AddUseItemRecord(ItemType.move);
            data["moveBoxPokers"].forEach(function(element) {
              _this.structDic[element["id"]] = element;
              _this.movePokerArr.push(element["id"]);
              var boxIndex = _this.box.indexOf(element["id"]);
              boxIndex > -1 && _this.box.splice(boxIndex, 1);
            });
            return Promise.resolve();
          }
          return Promise.reject();
        }).catch(function(message) {
          GameManager_1.GameManager.Debug("request error");
          GameManager_1.GameManager.Debug(message);
        });
      };
      GameSceneModel.prototype.revert = function() {
        var _this = this;
        return GetHttp_1.default.getHttp(HttpAgreement_1.default.revert).then(function(message) {
          GameManager_1.GameManager.Debug(message);
          var data = JSON.parse(message);
          _this.revertPokerArr = [];
          if (0 == data["s"]) {
            _this.UseItemUppdateData(ItemType.back);
            _this.AddUseItemRecord(ItemType.back);
            if (null != data["revertPorker"] && data["revertPorker"].hasOwnProperty("id")) {
              _this.structDic[data["revertPorker"]["id"]] = data["revertPorker"];
              _this.revertPokerArr.push(data["revertPorker"]["id"]);
              var boxIndex = _this.box.indexOf(data["revertPorker"]["id"]);
              boxIndex > -1 && _this.box.splice(boxIndex, 1);
            }
            return Promise.resolve();
          }
          return Promise.reject();
        }).catch(function(message) {
          GameManager_1.GameManager.Debug("request error");
          GameManager_1.GameManager.Debug(message);
        });
      };
      return GameSceneModel;
    }();
    exports.GameSceneModel = GameSceneModel;
    var CallbackType;
    (function(CallbackType) {
      CallbackType[CallbackType["Move"] = 0] = "Move";
      CallbackType[CallbackType["ShowNew"] = 1] = "ShowNew";
      CallbackType[CallbackType["Fail"] = 2] = "Fail";
      CallbackType[CallbackType["ReLoad"] = 3] = "ReLoad";
      CallbackType[CallbackType["FinishAll"] = 4] = "FinishAll";
    })(CallbackType = exports.CallbackType || (exports.CallbackType = {}));
    exports.gameSceneModel = new GameSceneModel();
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../../tool/GetHttp": "GetHttp",
    "../../tool/HttpAgreement": "HttpAgreement"
  } ],
  GameSceneViewModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc1aa7JLctCP5h46twGD5b+", "GameSceneViewModel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.gameSceneViewModel = exports.GameSceneViewModel = void 0;
    var GameSceneViewModel = function() {
      function GameSceneViewModel() {
        this._cubeWidth = 0;
        this._cubeHeight = 0;
        this._blockWidth = 0;
        this._blockHeight = 0;
        this.directOffset = 20;
      }
      Object.defineProperty(GameSceneViewModel.prototype, "cubeWidth", {
        get: function() {
          return this._cubeWidth;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(GameSceneViewModel.prototype, "cubeHeight", {
        get: function() {
          return this._cubeHeight;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(GameSceneViewModel.prototype, "blockWidth", {
        get: function() {
          return this._blockWidth;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(GameSceneViewModel.prototype, "blockHeight", {
        get: function() {
          return this._blockHeight;
        },
        enumerable: false,
        configurable: true
      });
      GameSceneViewModel.prototype.setCubeSize = function(width, height) {
        this._cubeWidth = width;
        this._cubeHeight = height;
        this._blockWidth = width / 2;
        this._blockHeight = height / 2;
      };
      GameSceneViewModel.prototype.SetPlateStartPos = function(startPoint) {
        this._plateStartPos = new cc.Vec3(startPoint.x + exports.gameSceneViewModel.blockWidth, startPoint.y, startPoint.z);
      };
      Object.defineProperty(GameSceneViewModel.prototype, "plateStartPos", {
        get: function() {
          return this._plateStartPos;
        },
        enumerable: false,
        configurable: true
      });
      GameSceneViewModel.prototype.getCubePos = function(x, y, z, direct) {
        var offsetX = -7 * exports.gameSceneViewModel.blockWidth;
        var offsetY = -150 - exports.gameSceneViewModel.cubeHeight;
        var extraOffsetY = 0;
        switch (direct) {
         case 0:
          return new cc.Vec3(offsetX + x * exports.gameSceneViewModel.blockWidth, offsetY + y * this.blockHeight);

         case 1:
          return new cc.Vec3(offsetX + x * exports.gameSceneViewModel.blockWidth, extraOffsetY + offsetY + y * this.blockHeight + (Math.abs(z) - 1) * this.directOffset);

         case 2:
          return new cc.Vec3(offsetX + x * exports.gameSceneViewModel.blockWidth, extraOffsetY + offsetY + y * this.blockHeight - (Math.abs(z) - 1) * this.directOffset);

         case 3:
          return new cc.Vec3(offsetX + x * exports.gameSceneViewModel.blockWidth - (Math.abs(z) - 1) * this.directOffset, extraOffsetY + offsetY + y * this.blockHeight);

         case 4:
          return new cc.Vec3(offsetX + x * exports.gameSceneViewModel.blockWidth + (Math.abs(z) - 1) * this.directOffset, extraOffsetY + offsetY + y * this.blockHeight);

         default:
          return new cc.Vec3(999999, 999999);
        }
      };
      return GameSceneViewModel;
    }();
    exports.GameSceneViewModel = GameSceneViewModel;
    exports.gameSceneViewModel = new GameSceneViewModel();
    cc._RF.pop();
  }, {} ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3a0deW78R9HuJGAv3zClbm9", "GameScene");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GetHttp_1 = require("../../tool/GetHttp");
    var HttpAgreement_1 = require("../../tool/HttpAgreement");
    var ChangeSpriteGray_1 = require("../CubeView/ChangeSpriteGray");
    var CubeView_1 = require("../CubeView/CubeView");
    var SetingWindow_1 = require("../StingWindow/SetingWindow");
    var ActionController_1 = require("./ActionController");
    var CubePool_1 = require("./CubePool");
    var GameSceneModel_1 = require("./GameSceneModel");
    var GameSceneViewModel_1 = require("./GameSceneViewModel");
    var ToastScrpit_1 = require("./ToastScrpit");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameScene = function(_super) {
      __extends(GameScene, _super);
      function GameScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.plate = null;
        _this.cubeParent = null;
        _this.actionController = null;
        _this.btn1 = null;
        _this.btn2 = null;
        _this.btn3 = null;
        _this.toast = null;
        _this.GuoGai = null;
        return _this;
      }
      GameScene.prototype.onLoad = function() {
        cc.director.getCollisionManager().enabled = true;
      };
      GameScene.prototype.start = function() {
        var _this = this;
        this.updateItemNum();
        this.GuoGai.active = true;
        GameSceneModel_1.gameSceneModel.getStruct().then(function() {
          return _this.loadPrefab(_this);
        }).then(function() {
          var pointWorldPos = _this.plate.getChildByName("startPoint").convertToWorldSpaceAR(cc.Vec3.ZERO);
          var targetPos = _this.node.convertToNodeSpaceAR(pointWorldPos);
          GameSceneViewModel_1.gameSceneViewModel.SetPlateStartPos(targetPos);
          return _this.createrCube(_this);
        });
      };
      GameScene.prototype.onEnable = function() {
        this.node.on("reload", this.onReloadEvent, this);
        this.node.on("fail", this.onFailEvent, this);
        this.node.on("showNew", this.onShowNewEvent, this);
        this.node.on("backToMenu", this.onBackToMenuEvent, this);
        this.node.on("revive", this.onReviveEvent, this);
        this.node.on("useItem", this.onclickButtomTips, this);
        this.node.on("sheepHpUpdate", this.onSheepHpUpdate, this);
        this.node.on("updateSelectSheep", this.onSheepHpUpdate, this);
        this.node.on("updateItems", this.onSheepHpUpdate, this);
        this.node.on("finishAll", this.onFinishAllEvent, this);
        this.node.on("startGame", this.onFinishAllEvent, this);
      };
      GameScene.prototype.onDisable = function() {
        this.node.off("reload", this.onReloadEvent, this);
        this.node.off("fail", this.onFailEvent, this);
        this.node.off("showNew", this.onShowNewEvent, this);
        this.node.off("backToMenu", this.onBackToMenuEvent, this);
        this.node.off("revive", this.onReviveEvent, this);
        this.node.off("useItem", this.onclickButtomTips, this);
        this.node.off("sheepHpUpdate", this.onSheepHpUpdate, this);
        this.node.off("updateSelectSheep", this.onSheepHpUpdate, this);
        this.node.off("updateItems", this.onSheepHpUpdate, this);
      };
      GameScene.prototype.onSheepHpUpdate = function(event) {};
      GameScene.prototype.onclickButtomTips = function(event) {
        switch (event.detail) {
         case 1:
          this.onClickButton1();
          break;

         case 2:
          this.onClickButton2();
          break;

         case 3:
          this.onClickButton3();
        }
      };
      GameScene.prototype.onReloadEvent = function(event) {
        var _this = this;
        GameManager_1.GameManager.Debug("reload");
        this.reclyeCube(this).then(function() {
          _this.onSheepHpUpdate(null);
          return _this.reload();
        });
      };
      GameScene.prototype.onFailEvent = function(event) {
        GameManager_1.GameManager.Debug("fail");
        this.openFailedWindow();
      };
      GameScene.prototype.onFinishAllEvent = function(event) {
        GameManager_1.GameManager.Debug("FinishAll");
        this.GuoGai.active = false;
        this.openFinishAllWindow();
      };
      GameScene.prototype.onShowNewEvent = function(event) {
        GameManager_1.GameManager.Debug("showNew");
        this.createrNewCube(this);
      };
      GameScene.prototype.onBackToMenuEvent = function(event) {
        GameManager_1.GameManager.Debug("backToMenu");
        this.reclyeCube(this).then(function() {
          cc.director.loadScene("MenuScene");
        });
      };
      GameScene.prototype.onReviveEvent = function(event) {
        GameManager_1.GameManager.Debug("Revive");
        this.movePoker();
      };
      GameScene.prototype.onClickTipsWindow = function(touchEvent) {
        switch (touchEvent.currentTarget._name) {
         case "button1":
          this.openUseItemsWindowTips(GameSceneModel_1.ItemType.move);
          break;

         case "button2":
          this.openUseItemsWindowTips(GameSceneModel_1.ItemType.back);
          break;

         case "button3":
          this.openUseItemsWindowTips(GameSceneModel_1.ItemType.shuffle);
        }
      };
      GameScene.prototype.onClickButton1 = function() {
        this.movePoker();
      };
      GameScene.prototype.onClickButton2 = function() {
        this.revert();
      };
      GameScene.prototype.onClickButton3 = function() {
        var _this = this;
        GameSceneModel_1.gameSceneModel.shuffle().then(function() {
          return GameSceneModel_1.gameSceneModel.getStruct();
        }).then(function() {
          _this.shuffle();
        });
      };
      GameScene.prototype.reload = function() {
        var _this = this;
        return GameSceneModel_1.gameSceneModel.getStruct().then(function() {
          var pointWorldPos = _this.plate.getChildByName("startPoint").convertToWorldSpaceAR(cc.Vec3.ZERO);
          var targetPos = _this.node.convertToNodeSpaceAR(pointWorldPos);
          GameSceneViewModel_1.gameSceneViewModel.SetPlateStartPos(targetPos);
          return _this.createrCube(_this);
        });
      };
      GameScene.prototype.loadPrefab = function(self) {
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            CubePool_1.cubePool.initCubePool(loadedResource);
            GameSceneViewModel_1.gameSceneViewModel.setCubeSize(loadedResource.data.width, loadedResource.data.height);
            resolve(null);
          };
          cc.resources.load("prefab/Cube", onResourceLoaded);
        });
      };
      GameScene.prototype.createSingle = function(element) {
        var id = element["id"];
        var x = element["x"];
        var y = element["y"];
        var z = element["z"];
        var imgType = element["picture"];
        var direct = element["direct"];
        var cube = CubePool_1.cubePool.createCube();
        var cubeView = cube.getComponent("CubeView");
        cubeView.initData(id, x, y, z, imgType, direct);
        this.cubeParent.addChild(cube);
        cube.setPosition(GameSceneViewModel_1.gameSceneViewModel.getCubePos(x, y, z, direct));
      };
      GameScene.prototype.createrCube = function(self) {
        return new Promise(function(resolve, reject) {
          for (var key in GameSceneModel_1.gameSceneModel.structDic) Object.prototype.hasOwnProperty.call(GameSceneModel_1.gameSceneModel.structDic, key) && self.createSingle(GameSceneModel_1.gameSceneModel.structDic[key]);
          resolve(null);
        });
      };
      GameScene.prototype.createrNewCube = function(self) {
        return new Promise(function(resolve, reject) {
          GameSceneModel_1.gameSceneModel.newStructArr.forEach(function(element) {
            self.createSingle(GameSceneModel_1.gameSceneModel.structDic[element]);
          });
          resolve(null);
        });
      };
      GameScene.prototype.reclyeCube = function(self) {
        cc.Tween.stopAllByTarget(this.node);
        self.actionController.clearPlateList();
        if (self.cubeParent.childrenCount > 0) {
          GameManager_1.GameManager.Debug("r-num--" + self.cubeParent.childrenCount);
          return new Promise(function(resolve, reject) {
            for (var index = self.cubeParent.childrenCount - 1; index >= 0; index--) CubePool_1.cubePool.onKilled(self.cubeParent.children[index]);
            resolve(null);
          });
        }
        return Promise.resolve();
      };
      GameScene.prototype.shuffle = function() {
        this.updateItemNum();
        for (var index = 0; index < this.cubeParent.childrenCount; index++) {
          var cubeView = this.cubeParent.children[index].getComponent(CubeView_1.default);
          if (GameSceneModel_1.gameSceneModel.structDic.hasOwnProperty(cubeView.cfid) && -100 != GameSceneModel_1.gameSceneModel.structDic[cubeView.cfid]["y"]) {
            cubeView.changeImg(GameSceneModel_1.gameSceneModel.structDic[cubeView.cfid]["picture"]);
            cubeView.moveRound.shuffle();
          }
        }
      };
      GameScene.prototype.movePoker = function() {
        var _this = this;
        if (GameSceneModel_1.gameSceneModel.box.length <= 0) return;
        GameSceneModel_1.gameSceneModel.movePoker().then(function() {
          _this.updateItemNum();
          _this.actionController.move_AbovePlate(GameSceneModel_1.gameSceneModel.movePokerArr);
        });
      };
      GameScene.prototype.revert = function() {
        var _this = this;
        GetHttp_1.default.checkLastRequestType(HttpAgreement_1.default.moveToBox) && 0 == GameSceneModel_1.gameSceneModel.del.length && GameSceneModel_1.gameSceneModel.revert().then(function() {
          _this.actionController.move_Revert(GameSceneModel_1.gameSceneModel.revertPokerArr);
          _this.updateItemNum();
        });
      };
      GameScene.prototype.on_touch_ended = function(touchEvent) {
        console.log("\u70b9\u51fb");
        switch (touchEvent.currentTarget._name) {
         case "sheZhiButton":
          this.openSetingWindow();
        }
      };
      GameScene.prototype.openSetingWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            var setingWindow = newMyPrefab.getComponent(SetingWindow_1.default);
            setingWindow.showGiveUp();
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/SetingWindow", onResourceLoaded);
        });
      };
      GameScene.prototype.openUseItemsWindowTips = function(itemtype) {
        var IsTimesEnough = GameSceneModel_1.gameSceneModel.getItemTimes(itemtype) > 0;
        var IsUseTimesEnough = GameSceneModel_1.gameSceneModel.getCanUseItemTimes(itemtype) > 0;
        if (IsTimesEnough && !IsUseTimesEnough) {
          this.showToast("Only allow to use 3 times per round.");
          return Promise.resolve();
        }
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.emit("UseItemTips", itemtype);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          var windowName;
          windowName = IsTimesEnough ? "UseItemWindowTip" : "UseItemWindow";
          cc.resources.load("prefab/" + windowName, onResourceLoaded);
        });
      };
      GameScene.prototype.openFailedWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/FailedWindow", onResourceLoaded);
        });
      };
      GameScene.prototype.openFinishAllWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/FinishWindow", onResourceLoaded);
        });
      };
      GameScene.prototype.updateItemNum = function() {
        this.setItemBtnInfo(this.btn1, GameSceneModel_1.ItemType.move);
        this.setItemBtnInfo(this.btn2, GameSceneModel_1.ItemType.back);
        this.setItemBtnInfo(this.btn3, GameSceneModel_1.ItemType.shuffle);
      };
      GameScene.prototype.setItemBtnInfo = function(btn, type) {
        btn.getComponentInChildren(cc.Label).string = GameSceneModel_1.gameSceneModel.getItemTimes(type).toString();
        if (this.getItemBtnState(type)) {
          btn.getComponent(cc.Sprite).getComponent(ChangeSpriteGray_1.default).ChangeToNormal();
          btn.getChildByName("icon").getComponent(ChangeSpriteGray_1.default).ChangeToNormal();
        } else {
          btn.getComponent(cc.Sprite).getComponent(ChangeSpriteGray_1.default).ChangeToGray();
          btn.getChildByName("icon").getComponent(ChangeSpriteGray_1.default).ChangeToGray();
        }
      };
      GameScene.prototype.getItemBtnState = function(type) {
        return this.checkItemTimes(type) && this.checkCanUseItemTime(type);
      };
      GameScene.prototype.checkItemTimes = function(type) {
        return GameSceneModel_1.gameSceneModel.getItemTimes(type) > 0;
      };
      GameScene.prototype.checkCanUseItemTime = function(type) {
        return GameSceneModel_1.gameSceneModel.getCanUseItemTimes(type) > 0;
      };
      GameScene.prototype.showToast = function(str) {
        this.toast.show(str);
      };
      __decorate([ property(cc.Node) ], GameScene.prototype, "plate", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "cubeParent", void 0);
      __decorate([ property(ActionController_1.default) ], GameScene.prototype, "actionController", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "btn1", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "btn2", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "btn3", void 0);
      __decorate([ property(ToastScrpit_1.default) ], GameScene.prototype, "toast", void 0);
      __decorate([ property(cc.Node) ], GameScene.prototype, "GuoGai", void 0);
      GameScene = __decorate([ ccclass ], GameScene);
      return GameScene;
    }(cc.Component);
    exports.default = GameScene;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../../tool/GetHttp": "GetHttp",
    "../../tool/HttpAgreement": "HttpAgreement",
    "../CubeView/ChangeSpriteGray": "ChangeSpriteGray",
    "../CubeView/CubeView": "CubeView",
    "../StingWindow/SetingWindow": "SetingWindow",
    "./ActionController": "ActionController",
    "./CubePool": "CubePool",
    "./GameSceneModel": "GameSceneModel",
    "./GameSceneViewModel": "GameSceneViewModel",
    "./ToastScrpit": "ToastScrpit"
  } ],
  GetHttp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe8bbePFnBL75yg1o5+YlAV", "GetHttp");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../GameManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GetHttp = function() {
      function GetHttp() {}
      GetHttp_1 = GetHttp;
      GetHttp.getHttp = function(subUrl, obj) {
        void 0 === obj && (obj = null);
        var xhr = new XMLHttpRequest();
        return new Promise(function(resolve, reject) {
          xhr.onreadystatechange = function() {
            if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
              var response = xhr.responseText;
              resolve(response);
            }
          };
          xhr.onerror = function(evt) {
            reject(evt);
          };
          GetHttp_1.lastRequestType = subUrl;
          var url = GetHttp_1.getUrl(subUrl, obj);
          xhr.open("GET", url, true);
          xhr.send();
        });
      };
      GetHttp.getUrl = function(subUrl, obj) {
        void 0 === obj && (obj = null);
        GameManager_1.GameManager.Debug("" + GetHttp_1.baseUrl + subUrl + "?userCode=" + this.userCode + GetHttp_1.getParams(obj));
        return "" + GetHttp_1.baseUrl + subUrl + "?userCode=" + this.userCode + GetHttp_1.getParams(obj);
      };
      GetHttp.getParams = function(params) {
        if (null == params) return "";
        var paramStr = "";
        Object.keys(params).forEach(function(item) {
          paramStr = "" === paramStr ? "&" + item + "=" + params[item] : "&" + paramStr + "&" + item + "=" + params[item];
        });
        return paramStr;
      };
      GetHttp.checkLastRequestType = function(subUrl) {
        return GetHttp_1.lastRequestType == subUrl;
      };
      var GetHttp_1;
      GetHttp.baseUrl = "http://121.40.230.20:8088/";
      GetHttp.userCode = "";
      GetHttp = GetHttp_1 = __decorate([ ccclass ], GetHttp);
      return GetHttp;
    }();
    exports.default = GetHttp;
    cc._RF.pop();
  }, {
    "../GameManager": "GameManager"
  } ],
  GridSheepItemScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4bb77jvJqlFNpd9uWQFEk4z", "GridSheepItemScript");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GridSheepItemScript = function(_super) {
      __extends(GridSheepItemScript, _super);
      function GridSheepItemScript() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.icon = null;
        _this.progress = null;
        _this.selectImg = null;
        _this.hpLabel = null;
        return _this;
      }
      GridSheepItemScript.prototype.onEnable = function() {
        this.node.on("touchend", this.onClick, this);
      };
      GridSheepItemScript.prototype.onDisable = function() {
        this.node.off("touchend", this.onClick, this);
      };
      GridSheepItemScript.prototype.InitItem = function(id, url, hp, masxHp, captain, lv) {
        var _this = this;
        this.sheepId = id;
        var img = GameManager_1.GameManager.getSheepImg(captain, lv);
        cc.resources.load("Texture/sheep/" + img, cc.SpriteFrame, function(err, spriteFrame) {
          _this.icon.spriteFrame = spriteFrame;
        });
        this.progress.progress = hp / masxHp;
        this.hpLabel.string = "HP:" + hp + "/" + masxHp;
      };
      GridSheepItemScript.prototype.setSelectImgActive = function(value) {
        null != this.selectImg && (this.selectImg.active = value);
      };
      GridSheepItemScript.prototype.removeClick = function() {
        this.node.off("touchend", this.onClick, this);
      };
      GridSheepItemScript.prototype.onClick = function() {
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("clickSelectSheep", true, this.sheepId));
      };
      __decorate([ property(cc.Sprite) ], GridSheepItemScript.prototype, "icon", void 0);
      __decorate([ property(cc.ProgressBar) ], GridSheepItemScript.prototype, "progress", void 0);
      __decorate([ property(cc.Node) ], GridSheepItemScript.prototype, "selectImg", void 0);
      __decorate([ property(cc.Label) ], GridSheepItemScript.prototype, "hpLabel", void 0);
      GridSheepItemScript = __decorate([ ccclass ], GridSheepItemScript);
      return GridSheepItemScript;
    }(cc.Component);
    exports.default = GridSheepItemScript;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../GameScene/GameSceneEvent": "GameSceneEvent"
  } ],
  HttpAgreement: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6685n2d1xJ05SwFv63tLlS", "HttpAgreement");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HttpAgreement = function() {
      function HttpAgreement() {}
      HttpAgreement.getStruct = "game/getStruct";
      HttpAgreement.moveToBox = "game/moveToBox";
      HttpAgreement.startGame = "game/startGame";
      HttpAgreement.shuffle = "game/shuffle";
      HttpAgreement.movePoker = "game/movePoker";
      HttpAgreement.revert = "game/revert";
      HttpAgreement.quitGame = "game/quitGame";
      HttpAgreement.getUserInfo = "game/getUserInfo";
      HttpAgreement.joinTeam = "game/joinTeam";
      HttpAgreement.selectSkin = "game/selectSkin";
      HttpAgreement.getTopTeam = "game/getTopTeam";
      HttpAgreement = __decorate([ ccclass ], HttpAgreement);
      return HttpAgreement;
    }();
    exports.default = HttpAgreement;
    cc._RF.pop();
  }, {} ],
  MenuSecnceView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79663FRA9pPv5gTUMcITaOo", "MenuSecnceView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MenuSecnceView = function(_super) {
      __extends(MenuSecnceView, _super);
      function MenuSecnceView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.CanvasNode = null;
        _this.musicNodeScript = null;
        _this.startClicked = false;
        return _this;
      }
      MenuSecnceView.prototype.onLoad = function() {
        this.CanvasNode = cc.find("Canvas");
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
      };
      MenuSecnceView.prototype.onEnable = function() {
        this.node.on("changeSelectSheep", this.onChangeSelectSheepEvent, this);
        this.node.on("goToSelectSheep", this.onGoToSelectSheepEvent, this);
        this.node.on("updateSelectSheep", this.onUpdateSelectSheepEvent, this);
        this.node.on("gamestart", this.ClickStart, this);
        this.startClicked = false;
      };
      MenuSecnceView.prototype.onDisable = function() {
        this.node.off("changeSelectSheep", this.onChangeSelectSheepEvent, this);
        this.node.off("goToSelectSheep", this.onGoToSelectSheepEvent, this);
        this.node.off("updateSelectSheep", this.onUpdateSelectSheepEvent, this);
        this.node.off("gamestart", this.ClickStart, this);
      };
      MenuSecnceView.prototype.onChangeSelectSheepEvent = function(event) {};
      MenuSecnceView.prototype.onGoToSelectSheepEvent = function(event) {};
      MenuSecnceView.prototype.onUpdateSelectSheepEvent = function(event) {};
      MenuSecnceView.prototype.on_touch_ended = function(touchEvent) {
        this.musicNodeScript.playOnClick();
        console.log(touchEvent.currentTarget._name);
        switch (touchEvent.currentTarget._name) {
         case "quanGuoBang":
         case "woZaiNaButton":
         case "faDanMubutton":
         case "huanZhuangButton":
         case "paiHangBangButton":
          break;

         case "mingPianButton":
          this.openMyBusinessCard();
          break;

         case "sheZhiButton":
          this.openSetingWindow();
          break;

         case "startButton":
          this.openStartGameWindow();
          break;

         case "SelectTypeButton":
          break;

         case "twitter":
          window.open(GameManager_1.GameManager.twitterUrl);
          break;

         case "discord":
          window.open(GameManager_1.GameManager.discordUrl);
          break;

         case "help":
          window.open(GameManager_1.GameManager.helpUrl);
          break;

         case "paihangimg":
          window.open(GameManager_1.GameManager.teamUrl);
          break;

         case "dressBowl":
          console.log("\u70b9\u51fb--dressBowl");
          var video = new window["TencentGDT"].NATIVE.rewardVideoAd(function(res) {
            console.error("\u6d4b\u8bd5\u52a0\u8f7d\u5e7f\u544a");
            console.log(res);
          });
          video.loadAd();
          break;

         case "UserInfo":
          this.openUserInfoWindow();
        }
      };
      MenuSecnceView.prototype.ClickStart = function(event) {
        var _this = this;
        if (this.startClicked) {
          GameManager_1.GameManager.Debug("waiting2");
          return;
        }
        this.startClicked = true;
        GameSceneModel_1.gameSceneModel.startGame().then(function() {
          cc.director.loadScene("Main");
          _this.musicNodeScript.changeMusic("Main");
        });
      };
      MenuSecnceView.prototype.start = function() {};
      MenuSecnceView.prototype.openDressWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/BowlDress", onResourceLoaded);
        });
      };
      MenuSecnceView.prototype.openMyBusinessCard = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.CanvasNode.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/MyBusinessCardWindow", onResourceLoaded);
        });
      };
      MenuSecnceView.prototype.openSetingWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.CanvasNode.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/SetingWindow", onResourceLoaded);
        });
      };
      MenuSecnceView.prototype.openStartGameWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/StartWindow", onResourceLoaded);
        });
      };
      MenuSecnceView.prototype.openUserInfoWindow = function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          var onResourceLoaded = function(errorMessage, loadedResource) {
            if (errorMessage) {
              cc.log("Prefab error:" + errorMessage);
              reject();
              return;
            }
            if (!(loadedResource instanceof cc.Prefab)) {
              cc.log("Prefab error");
              reject();
              return;
            }
            var newMyPrefab = cc.instantiate(loadedResource);
            self.node.addChild(newMyPrefab);
            newMyPrefab.setPosition(0, 0);
            resolve(null);
          };
          cc.resources.load("prefab/UserInfoWindow", onResourceLoaded);
        });
      };
      MenuSecnceView = __decorate([ ccclass ], MenuSecnceView);
      return MenuSecnceView;
    }(cc.Component);
    exports.default = MenuSecnceView;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  MoveRound: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd904iGzIdIy5mUk5VVay/c", "MoveRound");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneViewModel_1 = require("../GameScene/GameSceneViewModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MoveRound = function(_super) {
      __extends(MoveRound, _super);
      function MoveRound() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.totalAngle = 720;
        _this.minDistance = 100;
        _this.maxDistance = 200;
        _this.moveSpeed = 2e3;
        _this.roundSpeed = 15;
        _this.startShuffle = false;
        _this.moveToPointFinish = false;
        _this.moveRound = false;
        _this.curAngle = 0;
        _this.centerRotation = 0;
        _this.targetDistance = 0;
        return _this;
      }
      Object.defineProperty(MoveRound.prototype, "shuffling", {
        get: function() {
          return this.startShuffle;
        },
        enumerable: false,
        configurable: true
      });
      MoveRound.prototype.onLoad = function() {
        this.centerPos = GameSceneViewModel_1.gameSceneViewModel.getCubePos(7, 2, 0, 0);
      };
      MoveRound.prototype.start = function() {};
      MoveRound.prototype.onEnable = function() {
        this.startShuffle = false;
      };
      MoveRound.prototype.onDisable = function() {
        this.startShuffle = false;
      };
      MoveRound.prototype.shuffle = function() {
        this.curAngle = 0;
        this.startPos = this.node.position;
        this.centerRotation = this.lookAtObject(this.centerPos.x, this.centerPos.y, this.node.x, this.node.y);
        this.moveToPointFinish = false;
        this.moveRound = false;
        this.startShuffle = true;
      };
      MoveRound.prototype.update = function(dt) {
        if (!this.startShuffle) return;
        if (this.moveToPointFinish) {
          if (this.moveRound) {
            this.node.setPosition(this.rotateByPoint(this.node.position, this.centerPos, this.roundSpeed));
            this.curAngle += this.roundSpeed;
            if (this.curAngle > this.totalAngle) {
              this.node.setPosition(this.startPos);
              this.moveRound = false;
              this.startShuffle = false;
            }
          }
        } else this.moveToFunc(dt);
      };
      MoveRound.prototype.lookAtObject = function(selfX, selfY, targetX, targety) {
        var orientationX = targetX - selfX;
        var orientationY = targety - selfY;
        var dir = cc.v2(orientationX, orientationY);
        var angle2 = dir.signAngle(cc.v2(0, 1));
        var olj = angle2 / Math.PI * 180;
        this.targetDistance = this.random(this.minDistance, this.maxDistance);
        return olj;
      };
      MoveRound.prototype.moveToFunc = function(dt) {
        var curDistance = this.getDistance(this.node.position, this.centerPos);
        var remain = this.targetDistance - curDistance;
        if (Math.abs(remain) < 20) {
          this.moveToPointFinish = true;
          this.moveRound = true;
          this.curAngle = 0;
          return;
        }
        var angle = 2 * this.centerRotation / 360 * Math.PI;
        var dir = cc.v2(Math.sin(angle), Math.cos(angle));
        dir.normalizeSelf();
        if (remain > 0) {
          this.node.x += dt * dir.x * this.moveSpeed;
          this.node.y += dt * dir.y * this.moveSpeed;
        } else {
          this.node.x -= dt * dir.x * this.moveSpeed;
          this.node.y -= dt * dir.y * this.moveSpeed;
        }
      };
      MoveRound.prototype.getDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };
      MoveRound.prototype.random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };
      MoveRound.prototype.rotateByPoint = function(target, center, angle, axis) {
        void 0 === axis && (axis = cc.Vec3.FORWARD);
        var quat = new cc.Quat();
        var dir = new cc.Vec3();
        var rotated = new cc.Vec3();
        cc.Vec3.subtract(dir, target, center);
        var rad = cc.misc.degreesToRadians(angle);
        cc.Quat.fromAxisAngle(quat, axis, rad);
        cc.Vec3.transformQuat(rotated, dir, quat);
        cc.Vec3.add(rotated, center, rotated);
        dir.normalizeSelf().mulSelf(2);
        cc.Vec3.add(rotated, dir, rotated);
        return rotated;
      };
      MoveRound = __decorate([ ccclass ], MoveRound);
      return MoveRound;
    }(cc.Component);
    exports.default = MoveRound;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneViewModel": "GameSceneViewModel"
  } ],
  MusicNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06b3cSBYbZN9qRQ/k2bfqeR", "MusicNode");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SetingServerMoudel_1 = require("./Moudel/SetingServerMoudel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MusicNode = function(_super) {
      __extends(MusicNode, _super);
      function MusicNode() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.menuBGMCilp = null;
        _this.gameBGMClip = null;
        _this.clickClip = null;
        _this.xiaoChuClip = null;
        return _this;
      }
      MusicNode.prototype.onLoad = function() {
        SetingServerMoudel_1.SetingMoudel.loadSetting();
        cc.game.addPersistRootNode(this.node);
      };
      MusicNode.prototype.start = function() {
        SetingServerMoudel_1.SetingMoudel.yinYue && (this.menuBGMID = cc.audioEngine.play(this.menuBGMCilp, true, 1));
      };
      MusicNode.prototype.playMusic = function(isPlay) {
        var curSence = cc.director.getScene();
        isPlay && SetingServerMoudel_1.SetingMoudel.yinYue ? "Main" == curSence.name ? this.gameBGMID = cc.audioEngine.play(this.gameBGMClip, true, 1) : this.menuBGMID = cc.audioEngine.play(this.menuBGMCilp, true, 1) : "Main" == curSence.name ? cc.audioEngine.stop(this.gameBGMID) : cc.audioEngine.stop(this.menuBGMID);
      };
      MusicNode.prototype.changeMusic = function(scene) {
        cc.audioEngine.stop(this.gameBGMID);
        cc.audioEngine.stop(this.menuBGMID);
        SetingServerMoudel_1.SetingMoudel.yinYue && ("Main" == scene ? this.gameBGMID = cc.audioEngine.play(this.gameBGMClip, true, 1) : this.menuBGMID = cc.audioEngine.play(this.menuBGMCilp, true, 1));
      };
      MusicNode.prototype.playOnClick = function() {
        SetingServerMoudel_1.SetingMoudel.yinXiao && cc.audioEngine.play(this.clickClip, false, 1);
      };
      MusicNode.prototype.playOnXiaoChu = function() {
        SetingServerMoudel_1.SetingMoudel.yinXiao && cc.audioEngine.play(this.xiaoChuClip, false, 1);
      };
      __decorate([ property(cc.AudioClip) ], MusicNode.prototype, "menuBGMCilp", void 0);
      __decorate([ property(cc.AudioClip) ], MusicNode.prototype, "gameBGMClip", void 0);
      __decorate([ property(cc.AudioClip) ], MusicNode.prototype, "clickClip", void 0);
      __decorate([ property(cc.AudioClip) ], MusicNode.prototype, "xiaoChuClip", void 0);
      MusicNode = __decorate([ ccclass ], MusicNode);
      return MusicNode;
    }(cc.Component);
    exports.default = MusicNode;
    cc._RF.pop();
  }, {
    "./Moudel/SetingServerMoudel": "SetingServerMoudel"
  } ],
  MyBusinessCardWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3db15B+hBCpLk3mxxBFBJc", "MyBusinessCardWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MyBusinessCardWindow = function(_super) {
      __extends(MyBusinessCardWindow, _super);
      function MyBusinessCardWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        return _this;
      }
      MyBusinessCardWindow.prototype.onLoad = function() {
        this.node.on("touchend", this.on_touch_ended, this);
      };
      MyBusinessCardWindow.prototype.on_touch_ended = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      MyBusinessCardWindow.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      __decorate([ property(cc.Node) ], MyBusinessCardWindow.prototype, "scaleNode", void 0);
      MyBusinessCardWindow = __decorate([ ccclass ], MyBusinessCardWindow);
      return MyBusinessCardWindow;
    }(cc.Component);
    exports.default = MyBusinessCardWindow;
    cc._RF.pop();
  }, {} ],
  NoItemWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c3b7bJrKzdCBohaedPckowP", "NoItemWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NoItemWindow = function(_super) {
      __extends(NoItemWindow, _super);
      function NoItemWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.scaleNode = null;
        _this.Confirm_Label = null;
        _this.clickOpenUrl = false;
        return _this;
      }
      NoItemWindow.prototype.onEnable = function() {
        this.clickOpenUrl = false;
        this.node.on("UseItemTips", this.SetWindowDetail, this);
        cc.game.on(cc.game.EVENT_SHOW, this.getUserInfo, this);
      };
      NoItemWindow.prototype.onDisable = function() {
        this.node.off("UseItemTips", this.SetWindowDetail, this);
        cc.game.off(cc.game.EVENT_SHOW, this.getUserInfo, this);
      };
      NoItemWindow.prototype.SetWindowDetail = function(type) {
        this.itemType = type;
        switch (type) {
         case GameSceneModel_1.ItemType.move:
          this.label.string = "Available Removal Props: 0";
          break;

         case GameSceneModel_1.ItemType.back:
          this.label.string = "Available Undo Props: 0";
          break;

         case GameSceneModel_1.ItemType.shuffle:
          this.label.string = "Available Shuffle Props: 0";
        }
        this.IsTimesEnough = GameSceneModel_1.gameSceneModel.getItemTimes(type) > 0;
        this.Confirm_Label.string = this.getBtnString();
      };
      NoItemWindow.prototype.ClickConFirm = function(touchEvent) {
        this.clickOpenUrl = true;
        window.open(this.getURL());
      };
      NoItemWindow.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      NoItemWindow.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      NoItemWindow.prototype.getURL = function() {
        return "";
      };
      NoItemWindow.prototype.getBtnString = function() {
        return "";
      };
      NoItemWindow.prototype.getUserInfo = function() {
        var _this = this;
        GameManager_1.GameManager.Debug("noItem-getinfo");
        this.clickOpenUrl && GameSceneModel_1.gameSceneModel.getUserInfo().then(function() {
          if (!_this.IsTimesEnough) {
            if (GameSceneModel_1.gameSceneModel.getItemTimes(_this.itemType) > 0) {
              _this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("updateItems", true));
              _this.closeTween();
            }
            return;
          }
        });
      };
      __decorate([ property(cc.Label) ], NoItemWindow.prototype, "label", void 0);
      __decorate([ property(cc.Node) ], NoItemWindow.prototype, "scaleNode", void 0);
      __decorate([ property(cc.Label) ], NoItemWindow.prototype, "Confirm_Label", void 0);
      NoItemWindow = __decorate([ ccclass ], NoItemWindow);
      return NoItemWindow;
    }(cc.Component);
    exports.default = NoItemWindow;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../GameScene/GameSceneEvent": "GameSceneEvent",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  PreLoadView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7a1774flvhNnJPeA7EzNT+q", "PreLoadView");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var GetHttp_1 = require("../../tool/GetHttp");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.loadingNode = null;
        _this.progressBar = null;
        _this.smile = null;
        _this.isLoad = false;
        _this.getUsetInfoFinish = false;
        return _this;
      }
      NewClass.prototype.onLoad = function() {
        var url = window.location.href;
        var data = new Object();
        if (-1 != url.indexOf("?")) {
          var str = url.split("?")[1].split("&");
          for (var i = 0; i < str.length; i++) data[str[i].split("=")[0]] = str[i].split("=")[1];
        }
        null != data["token"] ? GetHttp_1.default.userCode = data["token"] : GetHttp_1.default.userCode = "" + Math.floor(1e7 * Math.random());
      };
      NewClass.prototype.start = function() {
        var _this = this;
        GameSceneModel_1.gameSceneModel.quitGame().then(function() {
          _this.getUsetInfoFinish = true;
        });
        var self = this;
        self.progressBar.progress = 0;
        cc.resources.loadDir("Texture/cubeImg", function(finish, total, item) {
          self.progressBar.progress = finish / total;
          self.smile.x = self.progressBar.node.width * (finish / total - .5);
        }, function(err, assets) {
          self.isLoad = true;
          GameManager_1.GameManager.Debug("load finish");
        });
      };
      NewClass.prototype.update = function(dt) {
        this.isLoad && this.getUsetInfoFinish && cc.director.loadScene("MenuScene");
      };
      __decorate([ property(cc.Node) ], NewClass.prototype, "loadingNode", void 0);
      __decorate([ property(cc.ProgressBar) ], NewClass.prototype, "progressBar", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "smile", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../../tool/GetHttp": "GetHttp",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  ScrollBar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e288UyCT5Lyax98GJgCkmi", "ScrollBar");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollBar = function(_super) {
      __extends(ScrollBar, _super);
      function ScrollBar() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Scroll_1 = null;
        _this.Scroll_2 = null;
        _this.NowPage = 2;
        _this.speed = 50;
        return _this;
      }
      ScrollBar.prototype.start = function() {};
      ScrollBar.prototype.update = function(dt) {
        this.Scroll_1.setPosition(this.Scroll_1.position.x + dt * this.speed, this.Scroll_1.position.y);
        this.Scroll_2.setPosition(this.Scroll_2.position.x + dt * this.speed, this.Scroll_2.position.y);
        if (this.Scroll_1.position.x > 1080) {
          this.Scroll_1.setPosition(this.Scroll_2.position.x - this.Scroll_2.width + 10, this.Scroll_2.position.y);
          console.log("\u62fc\u63a5");
        }
        this.Scroll_2.position.x > 1080 && this.Scroll_2.setPosition(this.Scroll_1.position.x - this.Scroll_1.width + 10, this.Scroll_2.position.y);
      };
      __decorate([ property(cc.Node) ], ScrollBar.prototype, "Scroll_1", void 0);
      __decorate([ property(cc.Node) ], ScrollBar.prototype, "Scroll_2", void 0);
      ScrollBar = __decorate([ ccclass ], ScrollBar);
      return ScrollBar;
    }(cc.Component);
    exports.default = ScrollBar;
    cc._RF.pop();
  }, {} ],
  SelectSheepInfoScrpit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70c1d6ElQtNjrFS0w85y9AS", "SelectSheepInfoScrpit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SelectSheepInfoScrpit = function(_super) {
      __extends(SelectSheepInfoScrpit, _super);
      function SelectSheepInfoScrpit() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SelectSheepInfoScrpit.prototype.start = function() {};
      SelectSheepInfoScrpit = __decorate([ ccclass ], SelectSheepInfoScrpit);
      return SelectSheepInfoScrpit;
    }(cc.Component);
    exports.default = SelectSheepInfoScrpit;
    cc._RF.pop();
  }, {} ],
  SelectSheepWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea748RwFQNClpd/jnfpPn5Q", "SelectSheepWindow");
    cc._RF.pop();
  }, {} ],
  SetingServerMoudel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ade85uIsRxGErA2ESa87r+h", "SetingServerMoudel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SetingMoudel = void 0;
    var SetingServerMoudel = function() {
      function SetingServerMoudel() {
        this._yinYue = true;
        this._yinXiao = true;
      }
      SetingServerMoudel.prototype.loadSetting = function() {
        var yinyue = cc.sys.localStorage.getItem("yinYue");
        null == yinyue ? this.yinYue = true : this._yinYue = "true" == cc.sys.localStorage.getItem("yinYue");
        var yinXiao = cc.sys.localStorage.getItem("yinXiao");
        null == yinXiao ? this.yinXiao = true : this._yinXiao = "true" == cc.sys.localStorage.getItem("yinXiao");
      };
      Object.defineProperty(SetingServerMoudel.prototype, "yinYue", {
        get: function() {
          return this._yinYue;
        },
        set: function(value) {
          cc.sys.localStorage.setItem("yinYue", value);
          this._yinYue = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SetingServerMoudel.prototype, "yinXiao", {
        get: function() {
          return this._yinXiao;
        },
        set: function(value) {
          cc.sys.localStorage.setItem("yinXiao", value);
          this._yinXiao = value;
        },
        enumerable: false,
        configurable: true
      });
      return SetingServerMoudel;
    }();
    exports.default = SetingServerMoudel;
    exports.SetingMoudel = new SetingServerMoudel();
    cc._RF.pop();
  }, {} ],
  SetingWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51394URJolI0rTUQKeIDTDS", "SetingWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("../../GameManager");
    var SetingServerMoudel_1 = require("../../Moudel/SetingServerMoudel");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SetingWindow = function(_super) {
      __extends(SetingWindow, _super);
      function SetingWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        _this.yinYueButton = null;
        _this.yinXiaoButton = null;
        _this.giveUpBtn = null;
        _this.musicNodeScript = null;
        _this.yinYue_Label = null;
        _this.yinXiao_Label = null;
        _this.giveUp_Label = null;
        return _this;
      }
      SetingWindow.prototype.onLoad = function() {
        this.yinYueButton.children[1].active = SetingServerMoudel_1.SetingMoudel.yinYue;
        this.yinXiaoButton.children[1].active = SetingServerMoudel_1.SetingMoudel.yinXiao;
        this.musicNodeScript = cc.find("MusicNode").getComponent("MusicNode");
        this.loadLabel();
      };
      SetingWindow.prototype.showGiveUp = function() {
        this.giveUpBtn.active = true;
      };
      SetingWindow.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      SetingWindow.prototype.on_touch_Music = function(touchEvent) {
        SetingServerMoudel_1.SetingMoudel.yinYue = !SetingServerMoudel_1.SetingMoudel.yinYue;
        this.yinYueButton.children[1].active = SetingServerMoudel_1.SetingMoudel.yinYue;
        this.musicNodeScript.playOnClick();
        this.musicNodeScript.playMusic(SetingServerMoudel_1.SetingMoudel.yinYue);
      };
      SetingWindow.prototype.on_touch_SoundEffect = function(touchEvent) {
        SetingServerMoudel_1.SetingMoudel.yinXiao = !SetingServerMoudel_1.SetingMoudel.yinXiao;
        this.musicNodeScript.playOnClick();
        this.yinXiaoButton.children[1].active = SetingServerMoudel_1.SetingMoudel.yinXiao;
      };
      SetingWindow.prototype.on_touch_GiveUp = function(touchEvent) {
        this.musicNodeScript.playOnClick();
        this.closeTween();
        GameSceneModel_1.gameSceneModel.quitGame();
        cc.director.loadScene("MenuScene");
        this.musicNodeScript.changeMusic("MenuScene");
      };
      SetingWindow.prototype.on_touch_close = function(touchEvent) {
        this.musicNodeScript.playOnClick();
        this.closeTween();
      };
      SetingWindow.prototype.on_touch_twitter = function(touchEvent) {
        window.open(GameManager_1.GameManager.teamUrl);
      };
      SetingWindow.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      SetingWindow.prototype.loadLabel = function() {
        this.yinXiao_Label.string = GameManager_1.GameManager.getString(1004);
        this.yinYue_Label.string = GameManager_1.GameManager.getString(1005);
        this.giveUp_Label.string = GameManager_1.GameManager.getString(1008);
      };
      __decorate([ property(cc.Node) ], SetingWindow.prototype, "scaleNode", void 0);
      __decorate([ property(cc.Node) ], SetingWindow.prototype, "yinYueButton", void 0);
      __decorate([ property(cc.Node) ], SetingWindow.prototype, "yinXiaoButton", void 0);
      __decorate([ property(cc.Node) ], SetingWindow.prototype, "giveUpBtn", void 0);
      __decorate([ property(cc.Label) ], SetingWindow.prototype, "yinYue_Label", void 0);
      __decorate([ property(cc.Label) ], SetingWindow.prototype, "yinXiao_Label", void 0);
      __decorate([ property(cc.Label) ], SetingWindow.prototype, "giveUp_Label", void 0);
      SetingWindow = __decorate([ ccclass ], SetingWindow);
      return SetingWindow;
    }(cc.Component);
    exports.default = SetingWindow;
    cc._RF.pop();
  }, {
    "../../GameManager": "GameManager",
    "../../Moudel/SetingServerMoudel": "SetingServerMoudel",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  Shake: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6082u1Y9ZJArDutTXIWlxd", "Shake");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Shake = function(_super) {
      __extends(Shake, _super);
      function Shake() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.shaketimes = 0;
        return _this;
      }
      Shake.prototype.start = function() {};
      Shake.prototype.update = function(dt) {
        if (this.shaketimes < .3) {
          this.node.scaleX = 1 + this.shaketimes;
          this.node.scaleY = 1 + this.shaketimes;
          this.shaketimes += dt;
        } else {
          this.node.scaleX = 1;
          this.node.scaleY = 1;
          this.shaketimes = 0;
        }
      };
      Shake = __decorate([ ccclass ], Shake);
      return Shake;
    }(cc.Component);
    exports.default = Shake;
    cc._RF.pop();
  }, {} ],
  SheepHPTipWindowScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2f0c0TVMJEQKkJ7sUK6hJN", "SheepHPTipWindowScript");
    cc._RF.pop();
  }, {} ],
  ShowScore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68852N8IbhOhJ6LQwvOXN/r", "ShowScore");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ShowScore = function(_super) {
      __extends(ShowScore, _super);
      function ShowScore() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
      }
      ShowScore.prototype.onEnable = function() {
        this.node.on("addScore", this.onAddScoreEvent, this);
      };
      ShowScore.prototype.onDisable = function() {
        this.node.off("addScore", this.onAddScoreEvent, this);
      };
      ShowScore.prototype.onAddScoreEvent = function(score) {
        var _this = this;
        this.label.string = "+" + score + "C";
        this.node.y = -50;
        cc.tween().target(this.node).to(.1, {
          y: 0
        }).delay(.8).to(.2, {
          opacity: 0
        }).call(function() {
          _this.node.y = 0;
          _this.label.string = "";
          _this.node.opacity = 255;
        }).start();
      };
      __decorate([ property(cc.Label) ], ShowScore.prototype, "label", void 0);
      ShowScore = __decorate([ ccclass ], ShowScore);
      return ShowScore;
    }(cc.Component);
    exports.default = ShowScore;
    cc._RF.pop();
  }, {} ],
  SmallBowl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4abe3uyPBhEhI8Kr8ELa4vr", "SmallBowl");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Smallbowl = function(_super) {
      __extends(Smallbowl, _super);
      function Smallbowl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Smallbowl.prototype.start = function() {};
      Smallbowl.prototype.SetSpriteFrame = function(urlName, IsSelelct) {
        var _this = this;
        this.ID = urlName;
        cc.resources.load("Texture/dress/" + urlName, cc.SpriteFrame, function(err, spriteFrame) {
          _this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        this.SetSelectFalse(IsSelelct);
      };
      Smallbowl.prototype.SetSelectFalse = function(ISSelect) {
        this.node.getChildByName("IsSelect").active = ISSelect;
      };
      Smallbowl.prototype.SelelctBowl = function() {
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("Select", true, this.ID));
      };
      Smallbowl = __decorate([ ccclass ], Smallbowl);
      return Smallbowl;
    }(cc.Component);
    exports.default = Smallbowl;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneEvent": "GameSceneEvent"
  } ],
  StartWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "982f1pnSKxBpbR2GqxJ0Yb4", "StartWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var StartWindow = function(_super) {
      __extends(StartWindow, _super);
      function StartWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.scaleNode = null;
        _this.formatDate = function(time) {
          var Dates = new Date(time);
          var year = Dates.getFullYear();
          var month = Dates.getMonth() + 1 < 10 ? "0" + (Dates.getMonth() + 1) : Dates.getMonth() + 1;
          var day = Dates.getDate() < 10 ? "0" + Dates.getDate() : Dates.getDate();
          return month + "\u6708" + day + "\u65e5";
        };
        return _this;
      }
      StartWindow.prototype.StartGame = function() {
        this.closeTween();
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("gamestart", true));
      };
      StartWindow.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
        this.label.string = "" + this.formatDate(new Date().getTime());
      };
      StartWindow.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      __decorate([ property(cc.Label) ], StartWindow.prototype, "label", void 0);
      __decorate([ property(cc.Node) ], StartWindow.prototype, "scaleNode", void 0);
      StartWindow = __decorate([ ccclass ], StartWindow);
      return StartWindow;
    }(cc.Component);
    exports.default = StartWindow;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneEvent": "GameSceneEvent"
  } ],
  TeamItemScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6fdc6qlDxBAb4mjJ1lkLqv+", "TeamItemScript");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TeamItemScript = function(_super) {
      __extends(TeamItemScript, _super);
      function TeamItemScript() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spine = null;
        _this.label_num = null;
        _this.label_name = null;
        return _this;
      }
      TeamItemScript.prototype.start = function() {
        for (var index = 0; index < this.spine.childrenCount; index++) {
          var element = this.spine.children[index].getComponent(sp.Skeleton);
          element.setSkin(this.Random(1, 8).toString());
          element.animation = "wait";
        }
      };
      TeamItemScript.prototype.Random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };
      __decorate([ property(cc.Node) ], TeamItemScript.prototype, "spine", void 0);
      __decorate([ property(cc.Label) ], TeamItemScript.prototype, "label_num", void 0);
      __decorate([ property(cc.Label) ], TeamItemScript.prototype, "label_name", void 0);
      TeamItemScript = __decorate([ ccclass ], TeamItemScript);
      return TeamItemScript;
    }(cc.Component);
    exports.default = TeamItemScript;
    cc._RF.pop();
  }, {} ],
  ToastScrpit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "40987b6ZOROiLxTVL9D4N/i", "ToastScrpit");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ToastScript = function(_super) {
      __extends(ToastScript, _super);
      function ToastScript() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.isShow = false;
        return _this;
      }
      ToastScript.prototype.show = function(str) {
        var _this = this;
        this.label.string = str;
        if (!this.isShow) {
          this.isShow = true;
          this.node.scale = 1;
          cc.tween().target(this.node).delay(1).to(.1, {
            scale: 0
          }).call(function() {
            _this.isShow = false;
          }).start();
        }
      };
      __decorate([ property(cc.Label) ], ToastScript.prototype, "label", void 0);
      ToastScript = __decorate([ ccclass ], ToastScript);
      return ToastScript;
    }(cc.Component);
    exports.default = ToastScript;
    cc._RF.pop();
  }, {} ],
  UseItemWindowTips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "989bbwNGHlHCZvHN1RsaY8Y", "UseItemWindowTips");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameSceneEvent_1 = require("../GameScene/GameSceneEvent");
    var GameSceneModel_1 = require("../GameScene/GameSceneModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var UseItemWindowTips = function(_super) {
      __extends(UseItemWindowTips, _super);
      function UseItemWindowTips() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.ItemName = null;
        _this.ItemDes = null;
        _this.ItemdesImag = null;
        _this.ButtonImg = null;
        _this.ItemImg = null;
        _this.scaleNode = null;
        return _this;
      }
      UseItemWindowTips.prototype.onEnable = function() {
        this.node.on("UseItemTips", this.SetWindowDetail, this);
      };
      UseItemWindowTips.prototype.onDisable = function() {
        this.node.off("UseItemTips", this.SetWindowDetail, this);
      };
      UseItemWindowTips.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      UseItemWindowTips.prototype.SetWindowDetail = function(type) {
        var _this = this;
        switch (type) {
         case GameSceneModel_1.ItemType.move:
          this._ItemType = 1;
          cc.resources.load("Texture/EatFood/GetLife/6", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemImg.spriteFrame = spriteFrame;
          });
          this.ItemName.string = "Removal Prop";
          this.ItemDes.string = "Remove 3 tiles and set aside.";
          cc.resources.load("Texture/EatFood/GetLife/des_6", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemdesImag.spriteFrame = spriteFrame;
          });
          cc.resources.load("Texture/EatFood/GetLife/btn_6", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ButtonImg.spriteFrame = spriteFrame;
          });
          break;

         case GameSceneModel_1.ItemType.back:
          this._ItemType = 2;
          cc.resources.load("Texture/EatFood/GetLife/2", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemImg.spriteFrame = spriteFrame;
          });
          this.ItemName.string = "Undo Prop";
          this.ItemDes.string = "Undo last move and put it back.";
          cc.resources.load("Texture/EatFood/GetLife/des_2", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemdesImag.spriteFrame = spriteFrame;
          });
          cc.resources.load("Texture/EatFood/GetLife/btn_2", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ButtonImg.spriteFrame = spriteFrame;
          });
          break;

         case GameSceneModel_1.ItemType.shuffle:
          this._ItemType = 3;
          cc.resources.load("Texture/EatFood/GetLife/1", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemImg.spriteFrame = spriteFrame;
          });
          this.ItemName.string = "Shuffle Prop";
          this.ItemDes.string = "Shuffle all unused tiles randomly.";
          cc.resources.load("Texture/EatFood/GetLife/des_1", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ItemdesImag.spriteFrame = spriteFrame;
          });
          cc.resources.load("Texture/EatFood/GetLife/btn_1", cc.SpriteFrame, function(err, spriteFrame) {
            _this.ButtonImg.spriteFrame = spriteFrame;
          });
        }
      };
      UseItemWindowTips.prototype.ClickClose = function(touchEvent) {
        this.closeTween();
      };
      UseItemWindowTips.prototype.ClickConFirm = function(touchEvent) {
        this.closeTween();
        this.node.dispatchEvent(new GameSceneEvent_1.GameSceneEvent("useItem", true, this._ItemType));
      };
      UseItemWindowTips.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      __decorate([ property(cc.Label) ], UseItemWindowTips.prototype, "ItemName", void 0);
      __decorate([ property(cc.Label) ], UseItemWindowTips.prototype, "ItemDes", void 0);
      __decorate([ property(cc.Sprite) ], UseItemWindowTips.prototype, "ItemdesImag", void 0);
      __decorate([ property(cc.Sprite) ], UseItemWindowTips.prototype, "ButtonImg", void 0);
      __decorate([ property(cc.Sprite) ], UseItemWindowTips.prototype, "ItemImg", void 0);
      __decorate([ property(cc.Node) ], UseItemWindowTips.prototype, "scaleNode", void 0);
      UseItemWindowTips = __decorate([ ccclass ], UseItemWindowTips);
      return UseItemWindowTips;
    }(cc.Component);
    exports.default = UseItemWindowTips;
    cc._RF.pop();
  }, {
    "../GameScene/GameSceneEvent": "GameSceneEvent",
    "../GameScene/GameSceneModel": "GameSceneModel"
  } ],
  UserInfoWindow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a25176fcpBCvpYD88eqnzSO", "UserInfoWindow");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var UserInfoWindow = function(_super) {
      __extends(UserInfoWindow, _super);
      function UserInfoWindow() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scaleNode = null;
        return _this;
      }
      UserInfoWindow.prototype.start = function() {
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 1,
          scaleY: 1
        }).start();
      };
      UserInfoWindow.prototype.closeTween = function() {
        var _this = this;
        cc.tween(this.scaleNode).to(.25, {
          scaleX: 0,
          scaleY: 0
        }).call(function() {
          _this.node.destroy();
        }).start();
      };
      UserInfoWindow.prototype.ClickClose = function(touchEvent) {
        this.closeTween();
      };
      __decorate([ property(cc.Node) ], UserInfoWindow.prototype, "scaleNode", void 0);
      UserInfoWindow = __decorate([ ccclass ], UserInfoWindow);
      return UserInfoWindow;
    }(cc.Component);
    exports.default = UserInfoWindow;
    cc._RF.pop();
  }, {} ]
}, {}, [ "GameManager", "SetingServerMoudel", "MusicNode", "ClickPlayAudio", "ChangeSpriteGray", "CubeView", "MoveRound", "ShowScore", "DressManager", "SmallBowl", "FailedWindow", "FinishWindow", "ActionController", "CubePool", "GameScene", "GameSceneEvent", "GameSceneModel", "GameSceneViewModel", "ToastScrpit", "MenuSecnceView", "PreLoadView", "ScrollBar", "SelectSheepInfoScrpit", "Shake", "SheepHPTipWindowScript", "StartWindow", "TeamItemScript", "MyBusinessCardWindow", "GridSheepItemScript", "SelectSheepWindow", "SetingWindow", "NoItemWindow", "UseItemWindowTips", "UserInfoWindow", "GetHttp", "HttpAgreement" ]);