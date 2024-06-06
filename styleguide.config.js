const path = require('path')

const packagePath = path.resolve(__dirname, 'package.json')
const packageFile = require(packagePath)

module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.less$/i,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
  // ignore: ['node_modules/antd-mobile/es/components/**/index.js'],
  components: [
    'src/components/**/**.tsx',
    // 'node_modules/antd-mobile/es/components/**/**.js',
  ],
  // propsParser: require('react-docgen-typescript').withCustomConfig(
  //   './tsconfig.json'
  // ).parse,
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    {
      propFilter: prop => {
        if (prop.parent) {
          // 排除继承自 React.HTMLAttributes 的属性
          return (
            !prop.parent.fileName.includes('node_modules') &&
            !prop.parent.fileName.includes('HTMLAttributes')
          )
        }
        return true
      },
    }
  ).parse,
  verbose: true,
  updateDocs(docs, file) {
    if (docs.doclets.version) {
      const version = packageFile.version

      docs.doclets.version = version
      docs.tags.version[0].description = version
    }

    return docs
  }, // 在使用 @version 时 使用 package.json 的 version
  version: packageFile.version, // 同上 使用 package.json 的 version
  usageMode: 'expand', // 自动打开文档的缩放
  pagePerSection: true, // 是否每页一个组件显示
  exampleMode: 'expand', // 显示示例代码
  title: '@mcd/mobile-ui', // 文档名
}
