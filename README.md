# 민주노총사진아카이브

## development

hugo v0.115.0+extended

### hugo project scaffold로 시작합니다.

- https://github.com/mozodev/hugo-project


### go module init & update

- https://gohugo.io/hugo-modules/use-modules/#update-modules
- 
```
go mod init github/team-durumi/tailwind-aa-theme
go get -u github.com/team-durumi/hugo-search-fuse-js-aa
```

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

### Netlify build command

```
hugo mod tidy && hugo --gc --minify
```

### items rclone sync

```
$ rclone sync --progress aa-data:kctu-photo /workspaces/kctu-photo/content/items
$ find . -type f -name '*.md' -print # double-check things that would be deleted
$ find . -type f -name '*.md' -print -delete 
$ find . -type d -name '@eaDir' -print
```

## Data

### items

- Download 제공할 크기의 사진으로 년도 / 월별 / 제목 구분으로 제공
- 아이템은 사진 1장으로 정의(아이템에는 제목이 없는 경우가 많음.)

### items(mac)

https://docs.datafabric.hpe.com/62/AdministratorGuide/MountingNFSonMacClient.html
```
showmount -e 218.235.95.188
sudo mount -t nfs -o vers=3 218.235.95.188:/volume1/photo_archives /Users/woonjjang/data
```
Transferred:       13.160Gi / 13.160 GiByte, 100%, 19.877 MiByte/s, ETA 0s
Transferred:         4843 / 4843, 100%

### 민주노총 아카이브 태그 기준(taxonomy)

- 날짜 기준 : 년 / 월 / 일 (field_date)
- 장소 기준 : venues
- 조직 기준 : sources
- 주제 기준 : subjects 
- 행사 기준 : events
- 자유 태그 : tags

### hugo build stats (8284 items, 1분 20초)

```bash
find content/items -type f | wc -l
8284
ubuntu@hugo:~/kctu-photo$ time hugo --gc --minify
Start building sites … 
hugo v0.89.2-63E3A5EB+extended linux/amd64 BuildDate=2021-11-08T15:22:24Z VendorInfo=gohugoio

                   |  EN   
-------------------+-------
  Pages            | 9062  
  Paginator pages  |  420  
  Non-page files   |    0  
  Static files     |   10  
  Processed images |    0  
  Aliases          |  348  
  Sitemaps         |    1  
  Cleaned          |    2  

Total in 67322 ms

real    1m7.415s
user    1m20.514s
sys     0m7.423s
```