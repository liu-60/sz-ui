const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';

  const baseConfig = {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src/index.ts'),
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
      'react-dom/client': 'react-dom/client',
      'react-dom/server': 'react-dom/server',
      'react/jsx-runtime': 'react/jsx-runtime'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css'
      })
    ]
  };

  return [
    {
      ...baseConfig,
      output: {
        filename: 'sz-ui.cjs.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
          type: 'commonjs2'
        }
      }
    },
    {
      ...baseConfig,
      output: {
        filename: 'sz-ui.esm.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
          type: 'module'
        },
        module: true
      },
      experiments: {
        outputModule: true
      }
    }
  ];
};
