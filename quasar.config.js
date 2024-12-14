/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

const { configure } = require("quasar/wrappers");

module.exports = configure(function (/* ctx */) {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    boot: ["axios", "jquery-dropify", "apexcharts"],

    // CSS configuration
    css: ["app.scss"],

    // Extra fonts and icons
    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },
      publicPath: "/",
      vueRouterMode: "hash",
      minify: true,
      ignorePublicFolder: false,
      analyze: false,
      vitePlugins: [],
      optimizeDeps: {
        include: ["jspdf", "jspdf-autotable"], // Asegúrate de incluir estas dependencias
      },
    },

    devServer: {
      open: true, // Abre automáticamente el navegador durante el desarrollo
    },

    framework: {
      config: {},
      plugins: ["Notify", "Dialog"], // Plugins de Quasar que usarás
    },

    animations: [], // Puedes agregar animaciones específicas aquí

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: "packager",
      packager: {},
      builder: {
        appId: "fe-Vacunacion",
      },
    },

    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
