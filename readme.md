## 1단계 기능 목록

### 공통 컴포넌트

- [ ] Text
- [ ] Textarea
- [ ] Button
- [ ] Select
- [ ] Box
- [ ] Icon
- [ ] Header
- [ ] BottomSheet
- [ ] CircleIcon
- [ ] Layout

### feature 컴포넌트

- [ ] LaunchList
- [ ] LaunchItem
- [ ] BottomButton

### 기능 흐름

- [ ] 헤더와 음식점 목록 리스트를 확인할 수 있다.
  - [ ] 리스트가 길 경우 스크롤이 가능하다. (overflow-y)
  - [ ] 리스트의 아이콘은 해당 음식점의 카테고리에 해당하는 아이콘과 매칭된다.
- [ ] 헤더를 클릭 시 음식점 리스트를 추가할 수 있는 바텀 시트가 열린다.
- [ ] *카테고리를 선택한다.(한식, 중식, 일식, 아시안, 양식, 기타 중 택 1) [셀렉트 박스]
- [ ] *이름을 입력한다. [텍스트 인풋]
- [ ] *거리(도보 이동 시간)을 선택한다 (5, 10, 15, 20, 30 중 택 1) [셀렉트 박스]
- [ ] 설명을 입력한다. [텍스트 인풋]
- [ ] 참고 링크를 입력한다. [텍스트 인풋]
- [ ] 취소 버튼을 누르면 입력된 정보가 사라지고 바텀 시트가 닫힌다.
- [ ] 추가하기를 누르면 입력된 정보로 음식점 목록 리스트가 추가되고 바텀 시트가 닫힌다.
- [ ] (입력이 잘못되었을 경우)필수 입력을 하지 않고 추가하기 버튼을 눌렀을 경우 텍스트 인풋 outline에 하이라이트를 보여준다.


### 유효성 검사

- [ ] 이름 길이는 최소 1글자에서 14글자까지만 가능하다.
- [ ] 설명은 최대 255글자까지 가능하다.
- [ ] 참고 링크는 `https://` 로 시작해야 한다. 

