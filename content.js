function injectJs(srcFile) {
	var scr = document.createElement('script');
	scr.src = srcFile;
	document.getElementsByTagName('head')[0].appendChild(scr);
}

const dsturl1 = "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000";
const dsturl2 = "https://etk.srail.kr/hpg/hra/01/selectGroupScheduleList.do?pageId=TK0101020000"
const dsturl3 = "https://etk.srail.kr/hpg/hra/01/selectConditionGoodsScheduleList.do?pageId=TK0101060000"
const LOGIN_PAGE_URI = 'https://etk.srail.kr/cmc/01/selectLoginForm.do?pageId=TK0701000000';

const isLogin = () => !!document.querySelectorAll(".login_wrap.val_m.fl_r > span").length;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

if (document.URL.substring(0, dsturl1.length) == dsturl1 || document.URL.substring(0, dsturl2.length) == dsturl2 || document.URL.substring(0, dsturl3.length) == dsturl3) {

	$(document).ready(function () {
		injectJs(chrome.extension.getURL('inject.js'));

		var coachSelected = JSON.parse(sessionStorage.getItem('coachSelected'));
		var firstSelected = JSON.parse(sessionStorage.getItem('firstSelected'));
		var waitSelected = JSON.parse(sessionStorage.getItem('waitSelected'));

		if (coachSelected == null) coachSelected = [];
		if (firstSelected == null) firstSelected = [];
		if (waitSelected == null) waitSelected = [];

		console.log("coach:" + coachSelected);
		console.log("first:" + firstSelected);
		console.log("wait:" + waitSelected);

		if (!isLogin()) {
			if (confirm("로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) {
				location.href = LOGIN_PAGE_URI;
			}
			return;
		}

		if (sessionStorage.getItem('macro') == "true") {
			$("#search_top_tag").append('<input type="submit" value="매크로 정지" style="font-size: 16px; background-color: orange; color: white;" class="btn_large wx200 val_m corner" onclick="macrostop();">');
		} else {
			$("#search_top_tag").append('<input type="submit" value="매크로 시작" style="font-size: 16px; background-color: green; color: white;" class="btn_large wx200 val_m corner" onclick="macro();">');
		}

		$("<style>")
			.prop("type", "text/css")
			.html("\
    .search-form form .button input, .search-form form .button a img{\
    	vertical-align: middle;\
    }")
			.appendTo("body");
		
		
		waitForElm("#search-list table tr").then(() => {
			
			// Inserts the macro button into the table.
			if ($("#search-list").length != 0) {
				var rows = $('#search-list table tr');
				for (i = 1; i < rows.length; i++) {
					var columns = $(rows[i]).children('td');
					var first = $(columns[5]);
					var coach = $(columns[6]);
					var wait = $(columns[7]);
					if (coach.children().length > 0) {
						coach.append($("<p class='p5'></p>"));
						var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="coachMacro" value="' + i + '"> 매크로');
						checkbox.children('input').prop('checked', coachSelected.indexOf(i + "") > -1);
						coach.append(checkbox);
					}
					if (first.children().length > 0) {
						first.append($("<p class='p5'></p>"));
						var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="firstMacro" value="' + i + '"> 매크로');
						checkbox.children('input').prop('checked', firstSelected.indexOf(i + "") > -1);
						first.append(checkbox);
					}
					if (wait.children().length > 0) {
						wait.append($("<p class='p5'></p>"));
						var checkbox = $("<label></label>").html('<input type="checkbox" name="checkbox" class="waitMacro" value="' + i + '"> 매크로');
						checkbox.children('input').prop('checked', waitSelected.indexOf(i + "") > -1);
						wait.append(checkbox);
					}
				}
			}
	
			if (sessionStorage.getItem('macro') == "true") {
				// Restores user preferences
				$("#psgInfoPerPrnb1").val(sessionStorage.getItem('psgInfoPerPrnb1'));
				$("#psgInfoPerPrnb5").val(sessionStorage.getItem('psgInfoPerPrnb5'));
				$("#psgInfoPerPrnb4").val(sessionStorage.getItem('psgInfoPerPrnb4'));
				$("#psgInfoPerPrnb2").val(sessionStorage.getItem('psgInfoPerPrnb2'));
				$("#psgInfoPerPrnb3").val(sessionStorage.getItem('psgInfoPerPrnb3'));
				$("#locSeatAttCd1").val(sessionStorage.getItem('locSeatAttCd1'));
				$("#rqSeatAttCd1").val(sessionStorage.getItem('rqSeatAttCd1'));
	
				if ($("#search-list").length != 0) {
					var rows = $('#search-list table tr');
	
					var succeed = false;
					for (i = 1; i < rows.length; i++) {
						var columns = $(rows[i]).children('td');
	
						var first = $(columns[5]);
						var coach = $(columns[6]);
						var wait = $(columns[7]);
	
						if (coachSelected.indexOf(i + "") > -1) {
							var coachSpecials = coach.children("a");
							if (coachSpecials.length != 0) {
								for (j = 0; j < coachSpecials.length; j++) {
									name = $(coachSpecials[j]).attr('class');
									if (name == 'btn_small btn_burgundy_dark val_m wx90') {
										$(coachSpecials[0])[0].click();
										succeed = true;
										break;
									}
								}
								if (succeed == true) break;
							}
						}
	
						if (firstSelected.indexOf(i + "") > -1) {
							var firstSpecials = first.children("a");
							if (firstSpecials.length != 0) {
								for (j = 0; j < firstSpecials.length; j++) {
									name = $(firstSpecials[j]).attr('class');
									if (name == 'btn_small btn_burgundy_dark val_m wx90') {
										$(firstSpecials[0])[0].click();
										succeed = true;
										break;
									}
								}
								if (succeed == true) break;
							}
						}
	
						if (waitSelected.indexOf(i + "") > -1) {
							var waitSpecials = wait.children("a");
							if (waitSpecials.length != 0) {
								for (j = 0; j < waitSpecials.length; j++) {
									name = $(waitSpecials[j]).attr('class');
									if (name == 'btn_small btn_burgundy_dark val_m wx90') {
										$(waitSpecials[0])[0].click();
										succeed = true;
										break;
									}
								}
								if (succeed == true) break;
							}
						}
					}
	
					if (succeed == true) {
						sessionStorage.removeItem('macro');
						sessionStorage.removeItem('coachSelected');
						sessionStorage.removeItem('firstSelected');
						sessionStorage.removeItem('waitSelected');
						sessionStorage.removeItem('psgInfoPerPrnb1');
						sessionStorage.removeItem('psgInfoPerPrnb5');
						sessionStorage.removeItem('psgInfoPerPrnb4');
						sessionStorage.removeItem('psgInfoPerPrnb2');
						sessionStorage.removeItem('psgInfoPerPrnb3');
						sessionStorage.removeItem('locSeatAttCd1');
						sessionStorage.removeItem('rqSeatAttCd1');
						chrome.extension.sendMessage({
							type: 'playSound'
						}, function (data) {});
					} else {
						setTimeout(function () {
							location.reload();
						}, 1000);
					}
				} else {
					history.go(-1);
				}
			}
		});
	});
}