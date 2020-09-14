const path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src', 'index.jsx')
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "@components": path.resolve(__dirname, "src", "components"),
            "@shared": path.resolve(__dirname, "src", "shared"),
            "@pages": path.resolve(__dirname, "src", "pages"),
            "@stores": path.resolve(__dirname, "src", "stores"),
            "@styles": path.resolve(__dirname, "src", "styles"),
            "@images": path.resolve(__dirname, "src", "assets", "images"),
            "@fonts": path.resolve(__dirname, "src", "assets", "fonts"),
            "@icons": path.resolve(__dirname, "src", "assets", "icons"),
        }
    },
    module: {
        rules: [{
                test: /\.(js|jsx)?$/,
                use: ['babel-loader']
            },
            {
                test: /\.s?[ac]ss$/,
                exclude: "/node_modules/",
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true, importLoaders: 2, url: true }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: "images"
                    }
                }],
            },
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: "sounds"
                    }
                }],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: "fonts"
                    }
                }],
            },
        ]
    }
};