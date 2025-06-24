const Fs = require('fs');

Editor.Panel.extend({

  style: Fs.readFileSync(Editor.url('packages://imager2x/panel/index.css'), 'utf8'),

  template: Fs.readFileSync(Editor.url('packages://imager2x/panel/index.html'), 'utf8'),

  ready() {
    const app = new window.Vue({
      el: this.shadowRoot,

      data() {
        return {
          isAutoStart: false,
          inputDir: '',
          cacheDir: '',
          imageType: 'png,jpg',
          imageMin: 0.01,
          imageMax: 10,
          excludeFiles: '',

          isProcessing: false,
        }
      },

      methods: {

        /**
         * 保存配置
         */
        saveConfig() {
          if (this.isProcessing) {
            return;
          }
          this.isProcessing = true;

          const config = {
            isAutoStart: this.isAutoStart,
            inputDir: this.inputDir,
            cacheDir: this.cacheDir,
            imageType: this.imageType,
            imageMin: this.imageMin,
            imageMax: this.imageMax,
            excludeFiles: this.excludeFiles,
          };
          Editor.Ipc.sendToMain('imager2x:save-config', config, () => {
            this.isProcessing = false;
          });
        },

        /**
         * 读取配置
         */
        readConfig() {
          Editor.Ipc.sendToMain('imager2x:read-config', (err, config) => {
            if (err || !config) return;
            for (const key in config) {
              if (Array.isArray(config[key])) {
                this[key] = config[key].join(',').replace(/,/g, ',\n');
              } else {
                this[key] = config[key];
              }
            }
          });
        }
      }
    });

    app.readConfig();

  }

});
