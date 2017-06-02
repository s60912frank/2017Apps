'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messages = function () {
  function Messages() {
    _classCallCheck(this, Messages);

    this._payload = [];
    this.addText = this.addText.bind(this);
    this.addRaw = this.addRaw.bind(this);
    // this._checkErrors = this._checkErrors.bind(this)
  }

  // checkErrors (messages, type, payload) {
  //   if (messages._payload.length === 5) {
  //     console.error('Maximum payload length is 5.')
  //     return true
  //   }
  //   switch (type) {
  //     case 'raw':
  //
  //
  //     case 'text':
  //
  //     case 'image':
  //
  //     default:
  //   }
  //   return false
  // }

  _createClass(Messages, [{
    key: 'addRaw',
    value: function addRaw(message) {
      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (!message || (typeof message === 'undefined' ? 'undefined' : _typeof(message)) !== 'object') return this;
      this._payload.push(message);
      return this;
    }

    // message: {
    //   text: String
    // }

  }, {
    key: 'addText',
    value: function addText(message) {
      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (!message) return this;
      this._payload.push({
        type: 'text',
        text: message.text || message || ''
      });
      return this;
    }
  }, {
    key: 'addImage',
    value: function addImage(_ref) {
      var originalUrl = _ref.originalUrl,
          previewUrl = _ref.previewUrl;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof originalUrl !== 'string' || typeof previewUrl !== 'string') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'image',
        originalContentUrl: originalUrl,
        previewImageUrl: previewUrl
      });
      return this;
    }
  }, {
    key: 'addAudio',
    value: function addAudio(_ref2) {
      var originalUrl = _ref2.originalUrl,
          duration = _ref2.duration;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof originalUrl !== 'string' || typeof duration !== 'number') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'audio',
        originalContentUrl: originalUrl,
        duration: duration
      });
      return this;
    }
  }, {
    key: 'addVideo',
    value: function addVideo(_ref3) {
      var originalUrl = _ref3.originalUrl,
          previewUrl = _ref3.previewUrl;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof originalUrl !== 'string' || typeof previewUrl !== 'string') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'video',
        originalContentUrl: originalUrl,
        previewImageUrl: previewUrl
      });
      return this;
    }
  }, {
    key: 'addLocation',
    value: function addLocation(_ref4) {
      var _ref4$title = _ref4.title,
          title = _ref4$title === undefined ? 'My Location' : _ref4$title,
          _ref4$address = _ref4.address,
          address = _ref4$address === undefined ? 'Here\'s the location.' : _ref4$address,
          latitude = _ref4.latitude,
          longitude = _ref4.longitude;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof title !== 'string' || typeof address !== 'string' || typeof latitude !== 'number' || typeof longitude !== 'number') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'location',
        title: title,
        address: address,
        latitude: latitude,
        longitude: longitude
      });
      return this;
    }
  }, {
    key: 'addSticker',
    value: function addSticker(_ref5) {
      var packageId = _ref5.packageId,
          stickerId = _ref5.stickerId;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof packageId !== 'number' || typeof stickerId !== 'number') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'sticker',
        packageId: packageId,
        stickerId: stickerId
      });
      return this;
    }
  }, {
    key: 'addButtons',
    value: function addButtons(_ref6) {
      var thumbnailImageUrl = _ref6.thumbnailImageUrl,
          altText = _ref6.altText,
          title = _ref6.title,
          text = _ref6.text,
          actions = _ref6.actions;

      if (!altText) {
        console.error('altText must not be empty.');
        return this;
      }
      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      if (typeof text !== 'string') {
        console.error('Mismatch type.');
        return this;
      }
      this._payload.push({
        type: 'template',
        altText: altText,
        template: {
          type: 'buttons',
          thumbnailImageUrl: thumbnailImageUrl,
          title: title && title.slice(0, 39),
          text: title ? text.slice(0, 59) : text.slice(0, 159),
          actions: actions
        }
      });
      return this;
    }
  }, {
    key: 'addConfirm',
    value: function addConfirm(_ref7) {
      var altText = _ref7.altText,
          text = _ref7.text,
          actions = _ref7.actions;

      if (this._payload.length === 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }
      this._payload.push({
        type: 'template',
        altText: altText,
        template: {
          type: 'confirm',
          text: text.slice(0, 239),
          actions: actions
        }
      });
      return this;
    }
  }, {
    key: 'addCarousel',
    value: function addCarousel(_ref8) {
      var altText = _ref8.altText,
          columns = _ref8.columns;

      if (!altText) {
        console.error('altText must not be empty.');
        return this;
      }
      if (this._payload.length >= 5) {
        console.error('Maximum payload length is 5.');
        return this;
      }

      this._payload.push({
        type: 'template',
        altText: altText,
        template: {
          type: 'carousel',
          columns: columns.slice(0, 4).map(function (_ref9) {
            var thumbnailImageUrl = _ref9.thumbnailImageUrl,
                title = _ref9.title,
                text = _ref9.text,
                actions = _ref9.actions;

            return {
              thumbnailImageUrl: thumbnailImageUrl,
              title: title,
              text: text,
              actions: actions
            };
          })
        }
      });
      return this;
    }
  }, {
    key: 'commit',
    value: function commit() {
      return this._payload;
    }
  }]);

  return Messages;
}();

exports.default = Messages;