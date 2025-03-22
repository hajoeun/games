다음은 React 기반 벽돌깨기(Breakout) 게임의 기능 명세서입니다.
이 문서에는 핵심 기능, UI/UX, 게임 로직, 테스트 케이스 등이 포함됩니다.

⸻

벽돌깨기 (Breakout) 기능 명세서 (React 버전)

1. 개요
	•	프로젝트 명: React Breakout
	•	플랫폼: 웹 (React, HTML5 Canvas)
	•	목표: React를 사용하여 벽돌깨기 게임을 개발하고, 공과 패들의 충돌을 관리하며 점수를 집계하는 기능을 구현.

⸻

2. 핵심 기능

2.1 주요 게임 오브젝트

오브젝트	설명
패들 (Paddle)	플레이어가 조작하는 막대형 객체로, 공을 반사하는 역할을 한다.
공 (Ball)	벽돌을 부수고 패들에 맞으면 튕겨나가는 오브젝트.
벽돌 (Brick)	공이 맞으면 깨지는 오브젝트로, 레벨마다 다양한 패턴으로 배치된다.
벽 (Wall)	좌우 및 상단 벽이 있으며, 공이 튕기는 역할을 한다.
UI 요소	점수, 생명 수, 게임 상태(게임 오버, 클리어 등)를 표시하는 UI가 포함된다.



⸻

2.2 게임 상태

상태	설명
START	게임이 시작되지 않은 초기 상태.
PLAYING	게임이 진행 중인 상태.
GAME_OVER	생명이 0이 되면 게임 종료.
LEVEL_CLEAR	모든 벽돌을 제거하면 클리어 후 다음 레벨 진행.



⸻

3. 게임 플레이 로직

3.1 패들 조작
	•	조작 방식
	•	키보드: ← → (좌우 이동)
	•	마우스: 마우스 이동에 따라 패들 이동
	•	터치(모바일 지원 시): 드래그 제스처로 패들 이동
	•	속성
	•	초기 위치: 화면 하단 중앙
	•	이동 속도: 5px/frame
	•	경계 제한: 패들이 화면 밖으로 나가지 않도록 함.
	•	React 구현 예시

function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    setPaddlePosition(prev => Math.max(prev - 20, 0));
  } else if (event.key === "ArrowRight") {
    setPaddlePosition(prev => Math.min(prev + 20, screenWidth - paddleWidth));
  }
}



⸻

3.2 공의 움직임
	•	속성
	•	초기 위치: 패들 위에서 시작
	•	이동 속도: dx = 3, dy = -3
	•	속도 증가: 벽돌을 일정 개수 이상 깨면 증가
	•	반사 규칙
	•	상단 벽 충돌 → dy = -dy
	•	좌우 벽 충돌 → dx = -dx
	•	패들 충돌 → 패들의 맞는 위치에 따라 dx 값 조정
	•	벽돌 충돌 → 벽돌 제거 후 dx, dy 변경
	•	바닥에 닿음 → 생명 감소 (lives -= 1)
	•	React 구현 예시

function updateBallPosition() {
  setBallPosition(prev => ({
    x: prev.x + ballSpeed.dx,
    y: prev.y + ballSpeed.dy
  }));
}



⸻

3.3 벽돌 시스템
	•	배치 방식
	•	2D 배열 형태로 관리 ([[1, 1, 0, 1], [1, 1, 1, 1]])
	•	벽돌 배열은 상태 관리 (useState 활용)
	•	타입

벽돌 종류	설명
일반 벽돌	한 번 맞으면 사라짐.
강화 벽돌	두 번 맞아야 사라짐.
보너스 벽돌	추가 점수를 제공.
파워업 벽돌	공 속도 감소 또는 패들 크기 증가.


	•	React 구현 예시

function removeBrick(row, col) {
  setBricks(prev =>
    prev.map((brickRow, r) =>
      r === row
        ? brickRow.map((brick, c) => (c === col ? 0 : brick))
        : brickRow
    )
  );
}



⸻

3.4 점수 및 생명 시스템
	•	점수
	•	기본 벽돌: 10점
	•	강화 벽돌: 20점
	•	연속 히트 보너스 가능.
	•	생명
	•	기본 제공 생명: 3
	•	공이 바닥에 떨어지면 생명 감소.
	•	생명이 0이 되면 게임 종료.

⸻

4. UI/UX

4.1 HUD (Head-Up Display)
	•	점수 표시: 현재 점수를 화면 상단에 표시.
	•	생명 표시: 하트 아이콘 또는 숫자로 남은 생명 표시.
	•	레벨 표시: 현재 레벨 정보를 출력.

4.2 게임 오버 화면
	•	점수 및 최고 점수 표시.
	•	“다시 시작” 버튼 제공.

⸻

5. 테스트 케이스

5.1 패들 이동 테스트

테스트 항목	입력 값	예상 결과
왼쪽 이동	ArrowLeft	패들이 왼쪽으로 이동, 경계를 넘지 않음
오른쪽 이동	ArrowRight	패들이 오른쪽으로 이동, 경계를 넘지 않음
화면 경계 확인	패들을 왼쪽 끝으로 이동	0보다 작아지지 않음
화면 경계 확인	패들을 오른쪽 끝으로 이동	화면 너비보다 커지지 않음



⸻

5.2 공의 충돌 테스트

테스트 항목	입력 값	예상 결과
공이 상단 벽에 충돌	ball.y = 0	dy 반전
공이 좌우 벽에 충돌	ball.x = 0 or ball.x = maxWidth	dx 반전
공이 패들에 충돌	ball.y = paddle.y && ball.x in paddle.x range	dy 반전 및 dx 조정
공이 벽돌에 충돌	ball.y = brick.y && ball.x = brick.x	벽돌 제거 및 dy 반전



⸻

5.3 게임 상태 테스트

테스트 항목	초기 상태	예상 결과
모든 벽돌 제거	벽돌 배열이 빈 상태	LEVEL_CLEAR 상태로 변경
생명 감소	공이 바닥에 떨어짐	lives - 1
게임 오버	lives = 0	GAME_OVER 상태로 변경



⸻

6. 결론

이 명세서는 React를 기반으로 벽돌깨기(Breakout) 게임을 개발하는 데 필요한 핵심 기능, UI, 게임 로직, 테스트 케이스를 포함하고 있습니다.

이제 이 내용을 바탕으로 개발을 진행할 수 있으며, 추가적인 기능을 확장할 수도 있습니다. 🚀
궁금한 점이 있다면 언제든지 질문해주세요! 😊