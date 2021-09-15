# 민주노총사진아카이브

### hugo project scaffold로 시작합니다.
- https://github.com/mozodev/hugo-project


### go module
```go mod init github/team-durumi/tailwind-aa-theme```
- 휴고 server 하는 시점에 자동으로 go get으로 버전에 맞는 테마를 갖고오면서 go.mod 파일이 변경되고, go.sum 파일도 가져옴. 


### tailwind-aa-theme
- 순풍 aa theme를 설치하는 과정은 비슷합니다.


### hugo 프로젝트 최상위 폴더로 돌아와서 npm 설치합니다.
```bash
hugo mod npm pack
npm install
hugo server -D
```
- node module package를 설치합니다.
- .gitignore 파일에 node_modules / resources / public 폴더를 추가합니다.