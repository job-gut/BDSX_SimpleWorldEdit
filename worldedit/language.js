"use strict";
//Choose Language
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldeditLangs = void 0;
const Language = "us_en";
//Support ko_kr and us_en
var WorldeditLangs;
(function (WorldeditLangs) {
    let Commands;
    (function (Commands) {
        Commands.set = Language == "ko_kr" ?
            "지정된 구역을 지정한 블럭으로 채웁니다" : "fill the positioned area with block";
        Commands.cut = Language == "ko_kr" ?
            "지정된 구역을 비웁니다" : "remove all blocks in the positioned area";
        Commands.walls = Language == "ko_kr" ?
            "지정된 구역에 벽을 세웁니다" : "wall the positioned area";
        Commands.replace = Language == "ko_kr" ?
            "지정된 구역에서 특정 블럭을 바꿉니다" : "changed some blocks in the positioned area";
        Commands.up = Language == "ko_kr" ?
            "올라간뒤 발 아래에 유리를 설치합니다" : "go up and place glass under your feet";
        Commands.wand = Language == "ko_kr" ?
            "나무도끼를 지급받고 사용법을 안내받습니다" : "get a wooden axe and get notice how to use";
    })(Commands = WorldeditLangs.Commands || (WorldeditLangs.Commands = {}));
    ;
    let Errors;
    (function (Errors) {
        Errors.TooManyTNT = Language == "ko_kr" ?
            "TNT는 32767 블럭을 넘어 설치할 수 없습니다" : "You cannot place TNT over 32767 blocks";
        Errors.ifConsole = Language == "ko_kr" ?
            "콘솔은 해당 명령어를 사용할 수 없습니다!" : "Console cannot use this command!";
        Errors.notSettedBothPosition = Language == "ko_kr" ?
            "첫번째 구역과 두번째 구역 모두 지정해주세요" : "Please set both position with wooden axe";
    })(Errors = WorldeditLangs.Errors || (WorldeditLangs.Errors = {}));
    ;
    let TaskSuccess;
    (function (TaskSuccess) {
        TaskSuccess.usedTime = Language == "ko_kr" ?
            "초 소요" : "seconds used";
        TaskSuccess.set = Language == "ko_kr" ?
            "블럭을 채웠습니다" : "blocks were filled";
        TaskSuccess.cut = Language == "ko_kr" ?
            "블럭을 지웠습니다" : "blocks were removed";
        TaskSuccess.replace = Language == "ko_kr" ?
            "블럭 중 일부를 바꿨습니다" : "blocks as replace block were changed";
        TaskSuccess.wand = Language == "ko_kr" ?
            "§d좌클릭: 첫번째 위치 지정; 우클릭: 두번째 위치 지정" : "§dLeft click: Set first position; Right click: Set second position";
        TaskSuccess.setFirstPos = Language == "ko_kr" ?
            "§d첫번째 좌표를 설정했습니다" : "§dSetted first position";
        TaskSuccess.setSecondPos = Language == "ko_kr" ?
            "§d두번째 좌표를 설정했습니다" : "§dSetted second position";
    })(TaskSuccess = WorldeditLangs.TaskSuccess || (WorldeditLangs.TaskSuccess = {}));
    ;
})(WorldeditLangs = exports.WorldeditLangs || (exports.WorldeditLangs = {}));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW5ndWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCOzs7QUFJakIsTUFBTSxRQUFRLEdBQ2QsT0FBTyxDQUFBO0FBRVAseUJBQXlCO0FBR3pCLElBQWlCLGNBQWMsQ0FzRDlCO0FBdERELFdBQWlCLGNBQWM7SUFDOUIsSUFBaUIsUUFBUSxDQWtCeEI7SUFsQkQsV0FBaUIsUUFBUTtRQUNYLFlBQUcsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDeEMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLHFDQUFxQyxDQUFDO1FBRW5ELFlBQUcsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDeEMsY0FBYyxDQUFDLENBQUMsQ0FBQywwQ0FBMEMsQ0FBQztRQUUvQyxjQUFLLEdBQUcsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQztRQUVsQyxnQkFBTyxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUM1QyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsNENBQTRDLENBQUM7UUFFekQsV0FBRSxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUN2QyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsdUNBQXVDLENBQUM7UUFFcEQsYUFBSSxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUN6Qyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsNENBQTRDLENBQUM7SUFDekUsQ0FBQyxFQWxCZ0IsUUFBUSxHQUFSLHVCQUFRLEtBQVIsdUJBQVEsUUFrQnhCO0lBQUEsQ0FBQztJQUVGLElBQWlCLE1BQU0sQ0FTdEI7SUFURCxXQUFpQixNQUFNO1FBQ1QsaUJBQVUsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDL0MsOEJBQThCLENBQUMsQ0FBQyxDQUFDLHdDQUF3QyxDQUFDO1FBRTdELGdCQUFTLEdBQUcsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQztRQUVsRCw0QkFBcUIsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDMUQsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLDBDQUEwQyxDQUFDO0lBQ3pFLENBQUMsRUFUZ0IsTUFBTSxHQUFOLHFCQUFNLEtBQU4scUJBQU0sUUFTdEI7SUFBQSxDQUFDO0lBRUYsSUFBaUIsV0FBVyxDQXFCM0I7SUFyQkQsV0FBaUIsV0FBVztRQUNkLG9CQUFRLEdBQUcsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBRVgsZUFBRyxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUN4QyxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1FBRXRCLGVBQUcsR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDeEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztRQUV2QixtQkFBTyxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUM1QyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsc0NBQXNDLENBQUM7UUFFN0MsZ0JBQUksR0FBRyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUM7WUFDekMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLG9FQUFvRSxDQUFDO1FBRTdGLHVCQUFXLEdBQUcsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELGtCQUFrQixDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztRQUVsQyx3QkFBWSxHQUFHLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQztZQUNqRCxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsMEJBQTBCLENBQUM7SUFDakQsQ0FBQyxFQXJCZ0IsV0FBVyxHQUFYLDBCQUFXLEtBQVgsMEJBQVcsUUFxQjNCO0lBQUEsQ0FBQztBQUNILENBQUMsRUF0RGdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBc0Q5QjtBQUFBLENBQUMifQ==