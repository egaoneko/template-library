# Node

## 구성

yarn workspace를 기본으로 사용하며, 명령어에 한정되서 lerna를 사용하고 있습니다. `core`를 통해 `schema`가 생성되어 각 패키지에서 사용하게 됩니다. 서버는 폴더 루트에 있는 도커에 포함된 db를 사용하고 있으므로, 시작전에 먼저 docker를 실행해야 합니다.

## 명령어

```sh
# Root
yarn add [some-dependencies] -W
yarn remove [some-dependencies] -W

# Package
yarn workspace [some-package] add [some-dependencies]
yarn workspace [some-package] remove [some-dependencies]
```