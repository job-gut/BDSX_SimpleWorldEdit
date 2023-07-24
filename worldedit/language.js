"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldeditLangs = void 0;
const Language = "us_en";
// Support ko_kr and us_en
var WorldeditLangs;
(function (WorldeditLangs) {
    let Commands;
    (function (Commands) {
        Commands.set = Language === "ko_kr" ? "지정된 구역을 지정한 블럭으로 채웁니다" : "Fill the specified area with blocks";
        Commands.cut = Language === "ko_kr" ? "지정된 구역을 비웁니다" : "Clear the specified area";
        Commands.walls = Language === "ko_kr" ? "지정된 구역에 벽을 세웁니다" : "Build walls in the specified area";
        Commands.replace = Language === "ko_kr" ? "지정된 구역에서 특정 블럭을 바꿉니다" : "Replace specific blocks in the specified area";
        Commands.up = Language === "ko_kr" ? "올라간뒤 발 아래에 유리를 설치합니다" : "Go up and place glass under your feet";
        Commands.wand = Language === "ko_kr" ? "나무도끼를 지급받고 사용법을 안내받습니다" : "Receive a wooden axe and get usage instructions";
    })(Commands = WorldeditLangs.Commands || (WorldeditLangs.Commands = {}));
    let Errors;
    (function (Errors) {
        Errors.TooManyTNT = Language === "ko_kr" ? "TNT는 32767 블럭을 넘어 설치할 수 없습니다" : "You cannot place more than 32767 blocks of TNT";
        Errors.ifConsole = Language === "ko_kr" ? "콘솔은 해당 명령어를 사용할 수 없습니다!" : "This command cannot be used in the console!";
        Errors.notSettedBothPosition = Language === "ko_kr" ? "첫번째 구역과 두번째 구역 모두 지정해주세요" : "Please specify both the first and second positions";
    })(Errors = WorldeditLangs.Errors || (WorldeditLangs.Errors = {}));
    let TaskSuccess;
    (function (TaskSuccess) {
        TaskSuccess.usedTime = Language === "ko_kr" ? "초 소요" : "Secs used";
        TaskSuccess.set = Language === "ko_kr" ? "블럭을 채웠습니다" : "blocks have been filled";
        TaskSuccess.cut = Language === "ko_kr" ? "블럭을 지웠습니다" : "blocks have been removed";
        TaskSuccess.replace = Language === "ko_kr" ? "블럭 중 일부를 바꿨습니다" : "blocks in the area as replace block have been changed";
        TaskSuccess.wand = Language === "ko_kr" ? "§d좌클릭: 첫번째 위치 지정; 우클릭: 두번째 위치 지정" : "§dLeft click: Set the first position; Right click: Set the second position";
        TaskSuccess.setFirstPos = Language === "ko_kr" ? "§d첫번째 좌표를 설정했습니다" : "§dFirst position has been set";
        TaskSuccess.setSecondPos = Language === "ko_kr" ? "§d두번째 좌표를 설정했습니다" : "§dSecond position has been set";
    })(TaskSuccess = WorldeditLangs.TaskSuccess || (WorldeditLangs.TaskSuccess = {}));
})(WorldeditLangs = exports.WorldeditLangs || (exports.WorldeditLangs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLFFBQVEsR0FBc0IsT0FBTyxDQUFDO0FBRTVDLDBCQUEwQjtBQUUxQixJQUFpQixjQUFjLENBeUI5QjtBQXpCRCxXQUFpQixjQUFjO0lBQzlCLElBQWlCLFFBQVEsQ0FPeEI7SUFQRCxXQUFpQixRQUFRO1FBQ1gsWUFBRyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQztRQUM3RixZQUFHLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQztRQUN6RSxjQUFLLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDO1FBQ3ZGLGdCQUFPLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLCtDQUErQyxDQUFDO1FBQzFHLFdBQUUsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsdUNBQXVDLENBQUM7UUFDN0YsYUFBSSxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxpREFBaUQsQ0FBQztJQUN6SCxDQUFDLEVBUGdCLFFBQVEsR0FBUix1QkFBUSxLQUFSLHVCQUFRLFFBT3hCO0lBRUQsSUFBaUIsTUFBTSxDQUl0QjtJQUpELFdBQWlCLE1BQU07UUFDVCxpQkFBVSxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxnREFBZ0QsQ0FBQztRQUN0SCxnQkFBUyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyw2Q0FBNkMsQ0FBQztRQUM3Ryw0QkFBcUIsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsb0RBQW9ELENBQUM7SUFDL0ksQ0FBQyxFQUpnQixNQUFNLEdBQU4scUJBQU0sS0FBTixxQkFBTSxRQUl0QjtJQUVELElBQWlCLFdBQVcsQ0FRM0I7SUFSRCxXQUFpQixXQUFXO1FBQ2Qsb0JBQVEsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUN2RCxlQUFHLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztRQUNyRSxlQUFHLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQztRQUN0RSxtQkFBTyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyx1REFBdUQsQ0FBQztRQUM1RyxnQkFBSSxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyw0RUFBNEUsQ0FBQztRQUNoSix1QkFBVyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQywrQkFBK0IsQ0FBQztRQUMxRix3QkFBWSxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FBQztJQUMxRyxDQUFDLEVBUmdCLFdBQVcsR0FBWCwwQkFBVyxLQUFYLDBCQUFXLFFBUTNCO0FBQ0YsQ0FBQyxFQXpCZ0IsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUF5QjlCIn0=