// -------修改凭证-------
function initMyDataTable(dataObj) {
	curVoucherObject = dataObj.lineList;
	if (dataObj.jeHeaderAttachment == null || dataObj.jeHeaderAttachment == "") {
		dataObj.jeHeaderAttachment = 0
	}
	$('#voucherAttachmentNum').val(dataObj.jeHeaderAttachment);
	$('#catogeryName').val(dataObj.jeCatogeryId)
	$('#catogeryNumber').html(formatThis(dataObj.jeSeq));
	var auxiliaryTypeArray = JSON.parse(sessionStorage.auxiliaryType).data;
	initVoucherTime(dataObj.jeDate);
	var voucherContentList = dataObj.lineList;
	var voucherContentHtml = '';
	var totalMoney = 0;

	//扩展selectauxiliaryObj长度
	reInitAuxiliaryObj(voucherContentList.length);

	for (var i = 0; i < voucherContentList.length; i++) {
		var item = voucherContentList[i];
		voucherContentHtml += '<tr><td class="p0 tablectrl"><a title="增加分录" class="glyicon_plus" onclick="addRow(this);"></a><a title="删除分录" class="glyicon_remove" onclick="delRow(this);"></a></td><td class="urel p0"><input type="text" autocomplete="off" class="summary uds" id="summary'
				+ i + '" value="' + item.summary
				+ '" /><span class="showCourse uds" onClick="showCase1()">摘要</span></td><td class="urel p0"><input type="text" style="display:none" autocomplete="off" class="course uds" id="course'
				+ i + '" value="' + item.coaCode + " " + item.dispName + '" data-id="'
				+ item.coaId + '" data-array="' + item.isAuxiliary + ',' + item.isQuantity + ',' + item.isCurrency
				+ ']" oninput="coaBlur(this)" onmouseup="auxiliaryConfig(this,'
				+ i + ')" onblur="showCoaText(this)"/><div class="dtc" onclick="textClick(this)"><p>'
				+ item.longName
				+ '</p></div><span class="showCourse uds" onClick="showCase2(this)">科目</span><div class="auxiliaryDiv uhide"></div></td><td class="urel p0"><div class="number f12 ptb05">'
				+ formatQuality(item.isQuantity, item.qtyDr, item.qtyCr, item.unitprice, item.uom)
				+ '</div></td><td class="urel p0"><div class="currency f12 ptb05">'
				+ formatCurrency1(item.currencyId, item.isCurrency, item.enteredDr, item.enteredCr, item.currencyCode, item.exchangerate)
				+ '</div></td><td class="urel p0">'
				+ formatDr(item.accountedDr) + '</td><td class="urel p0">' + formatCr(item.accountedCr) + '</td></tr>';
		totalMoney += Number(item.accountedDr);
		if (item.isAuxiliary == 1) {
			var auxiliaryObj = {};
			auxiliaryObj.auxiliaryName = item.coaCobinationName;
			auxiliaryObj.auxiliaryCode = item.coaCobinationCode;
			for (var j = 0; j < auxiliaryNameArray.length; j++) {
				if (item[auxiliaryNameArray[j] + "Id"] && item[auxiliaryNameArray[j] + "Id"] != "null") {
					auxiliaryObj[auxiliaryNameArray[j]] = item[auxiliaryNameArray[j] + "Id"];
					auxiliaryObj[auxiliaryNameArray[j] + '_type_id'] = auxiliaryTypeArray[j].id;
				}
			}
			selectauxiliaryObj.splice(i, 1, auxiliaryObj);
		}
	}
	
	$('#voucher_tbody').html(voucherContentHtml);
	$('#totalMoney1').html(formatTotalMoney1(totalMoney));
	$('#totalMoney2').html(formatTotalMoney2(totalMoney));
	rowCount = parseInt(voucherContentList.length - 1);
	showZhMoney(totalMoney * 100);
	getCoaList(function() {
		initDropCoaList();
		initSummaryTables();
		if (voucherContentList.length < 4) {
			rowCount = 3;
			for (var i = voucherContentList.length; i < 4; i++) {
				addRow();
			}
		}
	});
}
// 查看凭证，初始化凭证模板（结账中）
function getInitDataTable(dataObj) {
	curVoucherObject = dataObj.lineList;
	attachList = dataObj.attachList;
	if (dataObj.header.jeHeaderAttachment == null || dataObj.header.jeHeaderAttachment == "") {
		dataObj.header.jeHeaderAttachment = 0
	}
	$('#voucherAttachmentNum').val(dataObj.header.jeHeaderAttachment);
	if (sessionStorage.voucherFlag != 6) {
		$('#catogeryName').val(dataObj.header.jeCatogeryId);
	}
	$('#catogeryNumber').html(formatThis(dataObj.header.jeSeq));
	if (sessionStorage.voucherFlag == 6) {
		initVoucherTime1(getLastMonthDay(curbillPeriod.split('-')[0], curbillPeriod.split('-')[1]));
	} else if (sessionStorage.voucherFlag == 8) {
		var curDate = dataObj.header.jeDate;
		initVoucherTime1(curDate);
	} else {
		var curDate = dataObj.header.jeDate;
		initVoucherTime(curDate);
	}
	var voucherContentList = dataObj.lineList;
	var auxiliaryTypeArray = JSON.parse(sessionStorage.auxiliaryType).data;
	var totalMoney = 0;
	var voucherContentHtml = '';

	//扩展selectauxiliaryObj长度
	reInitAuxiliaryObj(voucherContentList.length);
	for (var i = 0; i < voucherContentList.length; i++) {
		var item = voucherContentList[i];
		var longNameTxt = /* sessionStorage.voucherFlag==6?'': */'<div class="dtc" onclick="textClick(this)"><p>' + item.longName + '</p></div>';
		var ishideHtml = /* sessionStorage.voucherFlag==6?'': */'style="display:none"';
		voucherContentHtml += '<tr><td class="p0 tablectrl"><a title="增加分录" class="glyicon_plus" onclick="addRow(this);"></a><a title="删除分录" class="glyicon_remove" onclick="delRow(this);"></a></td><td class="urel p0"><input type="text" autocomplete="off" class="summary uds" id="summary'
				+ i + '" value="'
				+ item.summary.replace('{month}', curMonth)
				+ '" /><span class="showCourse uds" onClick="showCase1()">摘要</span></td><td class="urel p0"><input type="text" autocomplete="off" '
				+ ishideHtml + ' class="course uds" id="course'
				+ i + '" value="' + item.coaCode + " "
				+ item.dispName + '" data-id="'
				+ item.coaId + '" data-array="' + item.isAuxiliary
				+ ',' + item.isQuantity + ',' + item.isCurrency
				+ '" oninput="coaBlur(this)" onmouseup="auxiliaryConfig(this,'
				+ i + ')" onblur="showCoaText(this)"/>'
				+ longNameTxt
				+ '<span class="showCourse uds" onClick="showCase2(this)">科目</span><div class="auxiliaryDiv uhide"></div></td><td class="urel p0"><div class="number f12 ptb05">'
				+ formatQuality(item.isQuantity, item.qtyDr, item.qtyCr, item.unitprice, item.uom)
				+ '</div></td><td class="urel p0"><div class="currency f12 ptb05">'
				+ formatCurrency(item.coaId, item.isCurrency, item.enteredDr, item.enteredCr, item.currencyCode, item.exchangerate)
				+ '</div></td><td class="urel p0">'
				+ formatDr(item.accountedDr) + '</td><td class="urel p0">' + formatCr(item.accountedCr) + '</td></tr>';
		totalMoney += Number(item.accountedDr);
		if (item.isAuxiliary == 1) {
			var auxiliaryObj = {};
			auxiliaryObj.auxiliaryName = item.coaCobinationName;
			auxiliaryObj.auxiliaryCode = item.coaCobinationCode;
			for (var j = 0; j < auxiliaryNameArray.length; j++) {
				if (item[auxiliaryNameArray[j] + "Id"] && item[auxiliaryNameArray[j] + "Id"] != "null") {
					auxiliaryObj[auxiliaryNameArray[j]] = item[auxiliaryNameArray[j] + "Id"];
					auxiliaryObj[auxiliaryNameArray[j] + '_type_id'] = auxiliaryTypeArray[j].id;
				}
			}
			selectauxiliaryObj.splice(i, 1, auxiliaryObj);
		}
	}
	$('#voucher_tbody').html(voucherContentHtml);
	$('#totalMoney1').html(formatTotalMoney1(totalMoney));
	$('#totalMoney2').html(formatTotalMoney2(totalMoney));
	rowCount = parseInt(voucherContentList.length - 1);
	showZhMoney(totalMoney * 100);
	getCoaList(function() {
		initDropCoaList();
		if (voucherContentList.length < 4) {
			rowCount = 3;
			for (var i = voucherContentList.length; i < 4; i++) {
				addRow();
			}
		}
	});
}

function getAuxiliaryType() {
	$.ajax({
		url: ip_url+"gl/auxiliaryType/get",
		dataType : "json",
		type : "post",
		async : true,
		data : JSON.stringify({
			bookId : sessionStorage.uuid
		}),
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			sessionStorage.auxiliaryType = JSON.stringify(res);
		},
		error : function() {
			logout_login("请重新登录");
		}
	});
}

// -------根据凭证对象初始化凭证-------
function initMyVoucherTemplet(dataObj) {
	var voucherContentList = dataObj.lineList;
	var voucherContentHtml = '';
	var totalMoney1 = 0;
	var totalMoney2 = 0;
	
	//扩展selectauxiliaryObj长度
	reInitAuxiliaryObj(voucherContentList.length);
	var voucherContentHtml = '';
	$.each(
		voucherContentList,
		function(i, item) {
			voucherContentHtml += '<tr><td class="p0 tablectrl"><a title="增加分录" class="glyicon_plus" onclick="addRow(this);"></a><a title="删除分录" class="glyicon_remove" onclick="delRow(this);"></a></td><td class="urel p0"><input type="text" autocomplete="off" class="summary uds" id="summary'
					+ i + '" value="'
					+ item.summary.replace('{month}', curMonth)
					+ '" /><span class="showCourse uds" onClick="showCase1()">摘要</span></td><td class="urel p0"><input type="text" style="display:none" autocomplete="off" class="course uds" id="course'
					+ i + '" value="'
					+ item.coaCode + " " + item.dispName + '" data-id="' + item.coaId
					+ '" data-array="' + item.isAuxiliary + ',' + item.isQuantity + ',' + item.isCurrency
					+ '" oninput="coaBlur(this)" onmouseup="auxiliarySet(this,'
					+ i + ')" onblur="showCoaText(this)"/><div class="dtc" onclick="textClick(this)"><p>'
					+ item.longName
					+ '</p></div><span class="showCourse uds" onClick="showCase2(this)">科目</span><div class="auxiliaryDiv uhide"></div></td><td class="urel p0"><div class="number f12 ptb05">'
					+ formatQuality(item.isQuantity, item.qtyDr, item.qtyCr, item.unitprice, item.uom)
					+ '</div></td><td class="urel p0"><div class="currency f12 ptb05">'
					+ formatCurrency(item.coaId, item.isCurrency, item.enteredDr, item.enteredCr, item.currencyCode, item.exchangerate)
					+ '</div></td> <td class="urel p0">' + formatDr(item.accountedDr) + '</td><td class="urel p0">' + formatCr(item.accountedCr) + '</td></tr>';
			totalMoney1 += Number(item.accountedDr);
			totalMoney2 += Number(item.accountedCr);
		});
	$('#voucher_tbody').html(voucherContentHtml);
	$('#totalMoney1').html(formatTotalMoney1(totalMoney1));
	$('#totalMoney2').html(formatTotalMoney2(totalMoney2));
	rowCount = parseInt(voucherContentList.length - 1);
	if (totalMoney1 == totalMoney2) {
		showZhMoney(totalMoney1 * 100);
	}
	if (voucherContentList.length < 4) {
		rowCount = 3;
		for (var i = voucherContentList.length; i < 4; i++) {
			addRow();
		}
	}
}

// 通过会计科目id找会计科目
function formatCoaId(coaId) {
	if (coaId == null || coaId == "") {
		return '';
	}
	for (var i = 0; i < coaList.length; i++) {
		if (coaList[i].id == coaId) {
			return coaList[i].name;
		}
	}
}

// 通过会计科目id找是否辅助核算
function getIsAuxiliaryByCoaId(coaId) {
	if (coaId == null || coaId == "") {
		return '';
	}
	for (var i = 0; i < coaList.length; i++) {
		if (coaList[i].id == coaId) {
			return coaList[i].isAuxiliary;
		}
	}
}

// 通过会计科目id找是否数量核算
function getIsQuantityByCoaId(coaId) {
	if (coaId == null || coaId == "") {
		return '';
	}
	for (var i = 0; i < coaList.length; i++) {
		if (coaList[i].id == coaId) {
			return coaList[i].isQuantity;
		}
	}
}

// 通过会计科目id找是否币别核算
function getIsCurrencyByCoaId(coaId) {
	if (coaId == null || coaId == "") {
		return '';
	}
	for (var i = 0; i < coaList.length; i++) {
		if (coaList[i].id == coaId) {
			return coaList[i].isCurrency;
		}
	}
}

function formatQuality(str0, str1, str2, str3, str4) {
	if (str0) {
		return '<span>数量:</span><input class="myNumber" value="' + filterTrue(str1, str2) + '" onchange="numberChange(this)" onkeyup="clearNoNum1(this)"/><i class="uom">' + str4 + '</i><br><span class="mt03">单价:</span><input class="myPrice" value="' + str3 + '" onchange="priceChange(this)" onkeyup="clearNoNum1(this)"/>'
	} else {
		return '';
	}
}

function formatCurrency(str, str0, str1, str2, str3, str4) {
	if (str0) {
		var currencyId = getCurrencyIdByCoaId(str);
		var currencyCode = getCurrencyCodeById(currencyId);
		var currencyName = getCurrencyNameById(currencyId);
		return '<span class="myCurrency uds" data-text="' + currencyName + '" data-id="' + currencyId + '">' + currencyCode + '</span>:<input class="myBaseCurrency" value="' + filterTrue(str1, str2)
				+ '" onchange="moneyChange(this)"/><br><span class="mt03">汇率:</span><input class="myRate" value="' + str4 + '" onchange="rateChange(this)" onkeyup="clearNoNum1(this)"/>'
	} else {
		return '';
	}
}

function formatCurrency1(str, str0, str1, str2, str3, str4) {
	if (str0) {
		var currencyId = str;
		return '<select class="myCurrency uds w50" onchange="currencyChange(this)">' + initCurrencyHtml(currencyId) + '</select><input class="myBaseCurrency" value="' + filterTrue(str1, str2) + '" onchange="moneyChange(this)"/><br><span class="mt03">汇率:</span><input class="myRate" value="' + str4 + '" onchange="rateChange(this)" onkeyup="clearNoNum1(this)"/>'
	} else {
		return '';
	}
}

function CurrencyIty(str3) {
	if (str3 == null || str3 == "" || str3 == "null") {
		return '';
	}
	for (var i = 0; i < currency.length; i++) {
		if (currency[i].currencyCode == str3) {
			return currency[i].currencyName;
		}
	}
}

function filterTrue(str1, str2) {
	var str3 = str1 == 0 ? str2 : str1;
	return str3;
}

function formatDr(number) {
	if (number == null) {
		number = 0
	}
	var totalMoney = Stringify(number * 100);
	var valueHtml = valueToHtml(totalMoney);
	if (totalMoney == 0) {
		valueHtml = "";
		number = ""
	}
	return '<div class="money_bg">' + valueHtml + '</div><input type="text" autocomplete="off" class="input_bg debiteMoney" value="' + number + '" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)" />';
}

function formatCr(number) {
	if (number == null) {
		number = 0
	}
	var totalMoney = Stringify(number * 100);
	var valueHtml = valueToHtml(totalMoney);
	if (totalMoney == 0) {
		valueHtml = "";
		number = ""
	}
	return '<div class="money_bg">' + valueHtml + '</div><input type="text" autocomplete="off" class="input_bg creditMoney" value="' + number + '" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)" />';
}

function formatTotalMoney1(number) {
	var totalMoney = Stringify(number * 100);
	var valueHtml = valueToHtml(totalMoney);
	return '<input type="hidden" class="totalMoney1" value="' + totalMoney + '" />' + valueHtml;
}

function formatTotalMoney2(number) {
	var totalMoney = Stringify(number * 100);
	var valueHtml = valueToHtml(totalMoney);
	return '<input type="hidden" class="totalMoney2" value="' + totalMoney + '" />' + valueHtml;
}

// -------获取某月的第一天------
function getFirstMonthDay(year, month) {
	var firstdate = year + '-' + month + '-01';
	return firstdate;
}

// -------获取某月的最后一天------
function getLastMonthDay(year, month) {
	var day = new Date(year, month, 0);
	var lastdate = year + '-' + month + '-' + day.getDate();
	return lastdate;
}