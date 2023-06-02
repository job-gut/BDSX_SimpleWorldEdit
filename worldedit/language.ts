const Language: "us_en" | "ko_kr" = "us_en";

// Support ko_kr and us_en

export namespace WorldeditLangs {
  export namespace Commands {
    export const set = Language === "ko_kr" ? "지정된 구역을 지정한 블럭으로 채웁니다" : "Fill the specified area with blocks";
    export const cut = Language === "ko_kr" ? "지정된 구역을 비웁니다" : "Clear the specified area";
    export const walls = Language === "ko_kr" ? "지정된 구역에 벽을 세웁니다" : "Build walls in the specified area";
    export const replace = Language === "ko_kr" ? "지정된 구역에서 특정 블럭을 바꿉니다" : "Replace specific blocks in the specified area";
    export const up = Language === "ko_kr" ? "올라간뒤 발 아래에 유리를 설치합니다" : "Go up and place glass under your feet";
    export const wand = Language === "ko_kr" ? "나무도끼를 지급받고 사용법을 안내받습니다" : "Receive a wooden axe and get usage instructions";
  }

  export namespace Errors {
    export const TooManyTNT = Language === "ko_kr" ? "TNT는 32767 블럭을 넘어 설치할 수 없습니다" : "You cannot place more than 32767 blocks of TNT";
    export const ifConsole = Language === "ko_kr" ? "콘솔은 해당 명령어를 사용할 수 없습니다!" : "This command cannot be used in the console!";
    export const notSettedBothPosition = Language === "ko_kr" ? "첫번째 구역과 두번째 구역 모두 지정해주세요" : "Please specify both the first and second positions";
  }

  export namespace TaskSuccess {
    export const usedTime = Language === "ko_kr" ? "초 소요" : "Seconds used";
    export const set = Language === "ko_kr" ? "블럭을 채웠습니다" : "Blocks have been filled";
    export const cut = Language === "ko_kr" ? "블럭을 지웠습니다" : "Blocks have been removed";
    export const replace = Language === "ko_kr" ? "블럭 중 일부를 바꿨습니다" : "Some blocks in the area have been changed";
    export const wand = Language === "ko_kr" ? "§d좌클릭: 첫번째 위치 지정; 우클릭: 두번째 위치 지정" : "§dLeft click: Set the first position; Right click: Set the second position";
    export const setFirstPos = Language === "ko_kr" ? "§d첫번째 좌표를 설정했습니다" : "§dFirst position has been set";
    export const setSecondPos = Language === "ko_kr" ? "§d두번째 좌표를 설정했습니다" : "§dSecond position has been set";
  }
}