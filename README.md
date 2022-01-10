# Template Library

## 목적

개인적으로 다양한 환경의 코드와 라이브러리를 사용해보고 검증하기 위하여 사용합니다. 이 저장소의 코드는 [RealWorld](https://github.com/gothinkster/realworld)의 스펙을 참고하여 구현하고 있습니다.

## 구조

모든 소스들이 공통으로 사용하는 스키마는 schema에 정의하고 있으며, 이는 RealWorld 스펙에서 기본이 되는 요소들을 기준으로 json schema로 작성하여 사용하고 있습니다. 각 언어들은 별도의 폴더를 가지고 있으며, 앞서 말한 Schema를 기반으로 각 언어의 interface 등을 생성하여 사용합니다.