# Quest 17-F. 번들링과 빌드 시스템

## Introduction
* 이번 퀘스트에서는 현대적 웹 클라이언트 개발에 핵심적인 번들러와 빌드 시스템의 구조와 사용 방법에 대해 알아보겠습니다.

## Topics
* Webpack
* Bundling
  * Data URL
* Transpiling
  * Source Map
* Hot Module Replacement

## Resources
* [Webpack](https://webpack.js.org/)
* [Webpack 101: An introduction to Webpack](https://medium.com/hootsuite-engineering/webpack-101-an-introduction-to-webpack-3f59d21edeba)

## Checklist
* 여러 개로 나뉘어진 자바스크립트나 이미지, 컴포넌트 파일 등을 하나로 합치는 작업을 하는 것은 성능상에서 어떤 이점이 있을까요?
  * 이미지를 Data URL로 바꾸어 번들링하는 것은 어떤 장점과 단점이 있을까요?
* Source Map이란 무엇인가요? Source Map을 생성하는 것은 어떤 장점이 있을까요?
* Webpack의 필수적인 설정은 어떤 식으로 이루어져 있을까요?
  * Webpack의 플러그인과 모듈은 어떤 역할들을 하나요?
  * Webpack을 이용하여 HMR(Hot Module Replacement) 기능을 설정하려면 어떻게 해야 하나요?

## Quest
* 직전 퀘스트의 소스만 남기고, Vue의 Boilerplating 기능을 쓰지 않고 Webpack 관련한 설정을 원점에서 다시 시작해 보세요.
  * 필요한 번들링과 Source Map, HMR 등의 기능이 모두 잘 작동해야 합니다.

## Advanced
* Webpack 이전과 이후에는 어떤 번들러가 있었을까요? 각각의 장단점은 무엇일까요?
