const nodeExternals = require("webpack-node-externals");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Electron 설정
      webpackConfig.target = "electron-renderer";
      webpackConfig.externals = [
        nodeExternals({
          allowlist: [/webpack(\/.*)?/, "electron-devtools-installer"],
        }),
      ];

      // Sass 및 resolve-url-loader 설정 추가
      const rules = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
      rules.forEach(rule => {
        if (rule.use) {
          rule.use.forEach(loader => {
            if (loader.loader && loader.loader.includes('resolve-url-loader')) {
              loader.options = {
                sourceMap: true,
              };
            }
            if (loader.loader && loader.loader.includes('sass-loader')) {
              loader.options = {
                sourceMap: true,
                implementation: require('sass'),
              };
            }
          });
        }
      });

      // SCSS 파일을 처리하기 위한 새로운 규칙 추가
      rules.push({
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};
