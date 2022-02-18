# React Native

## 구성

App Client를 제공하기 위해 사용합니다. 폴더 구조로는 Atomic Design을 기준으로 작성되었으며, Mobx를 사용하여 상태 관리를 하고 있습니다.

## 구현

* [x] Schema
* [x] Environment Config
* [x] CRUD
* [x] File Upload
* [x] Authentication(JWT)
* [x] Refresh Token
* [ ] Unit Test
* [ ] e2e Test

## 설치

* [Setting up the development environment](https://reactnative.dev/docs/environment-setup)

### [Setting up for monorepo](https://velog.io/@younuk23/React-Native-CRA-MonoRepo-%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0)

#### nohoist

* `root/package.json`

```json
{
  "name": <project-name>,
  "version": "1.0.0",
  "main": "index.js",
  "repository": <your-repository-url>,
  "private": true,
  "devDependencies": {
    "lerna": "^3.22.1"
  },
  "workspaces": {
    "packages": [
      "packages/*"
    ],
    "nohoist": [
      "**/<rn-project-name>",
      "**/<rn-project-name>/**"
    ]
}
```

#### metro.config.js

* `metro.config.js`

```js
const path = require("path");

module.exports = {
  projectRoot: path.resolve(__dirname, "../../"),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
```

#### iOS

* `AppDelegate.m`

`jsBundleURLForBundleRoot@"index"` -> `jsBundleURLForBundleRoot@"packages/<rn-project-name>/index"`

```objective-c
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"packages/<rn-project-name>/index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
```

* Bundle React Native code and Images
  * `<rn-project-name>` click in explorer
  * `<rn-project-name>` click in target
  * `Build Phases` -> `Bundle React Native code and Images`
  * add `EXTRA_PACKAGER_ARGS` in shell

```sh
export NODE_BINARY=node
export EXTRA_PACKAGER_ARGS="--entry-file packages/<rn-project-name>/index.js --reset-cache"
../node_modules/react-native/scripts/react-native-xcode.sh
```

#### Android

* `packages/<rn-project-name>/android/app/src/main/java/com/mobile/MainApplication.java`

`getJSMainModuleName()` : `index` -> `packages/<rn-project-name>/index`

```java
@Override
protected String getJSMainModuleName() {
  return "packages/<rn-project-name>/index";
}
```

* `packages/<rn-project-name>/android/app/build.gradle`

```java
project.ext.react = [
  enableHermes: false, // clean and rebuild if changing
  cliPath: "../../node_modules/react-native/local-cli/cli.js",
  entryFile: "packages/<rn-project-name>/index.js",
];
```
