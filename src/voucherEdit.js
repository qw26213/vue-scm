var fileTable, fileBusinessType;
var saveTypeValue = 1;/* 保存类型 */
var attachList = [];/* 票据列表 */
var curVoucherObject = [];/* 凭证分录数据 */
var Voucher = new Map();/* 整个制单对象 */
var VoucherAttachment = new Array();/* 凭证附件数据 */
var VoucherTable = new Array();
var curSummaryObj, curCoaObj;/* 当前摘要、科目输入框 */
var rowCount = 3;/* 当前分录最大索引值 */
var curIsAuxiliary, isCurrency, curIsQuantity = 0;
var curTreeNode;
var curPeriodValue;
var curMonth;/* 当前月份（结账使用） */
var curbillPeriod;
var voucherDatePicker;
var selectauxiliaryObj = [{},{},{},{}];//初始分录长度4条，后面通过reInitAuxiliaryObj扩招
var auxiliaryNameArray = ['supplier','cust','dept','staff','item','proj','def1','def2','def3','def4','def5', 'def6', 'def7', 'def8', 'def9'];
var hexCas = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
var isVoucherInit = false;
var summaryList = [],newSummaryList = [],newCoaList = [];/* 摘要列表、科目列表、摘要下拉列表、科目下拉列表 */
var auxiliaryType = [];
var allAuxiliaryData = {};
var uuid = sessionStorage.uuid;
var scrollHeight = 0;
var auxiliaryItemArr;
 
getAuxiliaryItem();// 获取存货类的辅助核算列表

summaryInit();

//扩展selectauxiliaryObj长度，初始为4，length>4时扩展
function reInitAuxiliaryObj(length){
    if(length>4){
        for(var i=4;i<length;i++){
            selectauxiliaryObj.push({});
        }
    }
}

function initCurrencyHtml(currencyId){
    var optionHtml = '';
    for(var i=0;i<currencyList.length;i++){
        if(currencyList[i].id == currencyId){
            optionHtml +='<option data-code="'+currencyList[i].currencyCode+'" value="'+currencyList[i].id+'" selected>'+currencyList[i].currencyName+'</option>';
        }else{
            optionHtml +='<option data-code="'+currencyList[i].currencyCode+'" value="'+currencyList[i].id+'">'+currencyList[i].currencyName+'</option>';
        }
    }
    return optionHtml;
}

function coaBlur(obj) {
    var coaValue = $(obj).val().trim(); 
    curCoaObj = $(obj);
    if (coaValue == "" && sessionStorage.voucherFlag != 1 && sessionStorage.voucherFlag != 2 && sessionStorage.voucherFlag != 5) {
        emputyCoaInput();
        curCoaObj.siblings('.dtc').remove();
        curCoaObj.siblings('.auxiliaryDiv').emputy().addClass('uhide');
        return;
    }
    var isExist = false;
    for (var i = 0; i < coaList.length; i++) {
        if (coaList[i].name == coaValue) {
            var data = coaList[i];
            isExist = true;
            curIsAuxiliary = data.isAuxiliary;
            curIsQuantity = data.isQuantity;
            curIsCurrency = data.isCurrency;
            curCoaObj.attr('data-id', data.id);
            curCoaObj.attr('data-array', [data.isAuxiliary, data.isQuantity, data.isCurrency]);
            if (data.isAuxiliary == 1) {
                initAuxiliaryShow("", "", data);
                return;
            }
            if (data.isQuantity == 1) {
                if (curCoaObj.parent().parent().find('.number').html() == "") {
                    showQuantityBox();
                }
            }
            if (data.isCurrency == 1) {
                if (curCoaObj.parent().parent().find('.currency').html() == "") {
                    showCurrencyBox();
                }
            }
        }
    }
    if (!isExist) {
        emputyCoaInput();
    }
}

function emputyCoaInput(){
    curCoaObj.attr('data-id', '');
    curCoaObj.parent().parent().find('.number').html('');
    curCoaObj.parent().parent().find('.currency').html('');
    curCoaObj.attr('data-array','');
    curCoaObj.siblings('.auxiliaryDiv').addClass('uhide').siblings('span').show();
    var thisIndex = curCoaObj.parent().parent().index();
    selectauxiliaryObj.splice(thisIndex, 1, {});
}

function coaClick(obj) {
    if ($(obj).attr('data-array')) {
        var auxiliaryStatus = $(obj).attr('data-array').split(',')[0];
        if (auxiliaryStatus == "1") {
            curCoaObj = $(obj);
            $(obj).siblings('.auxiliaryDiv').removeClass('uhide');
            $(obj).parent().parent().siblings().find('.auxiliaryDiv').addClass('uhide');
        }
    }
}
// 初始化辅助类型
function initAuxiliaryShow(event, treeId, treeNode) {
    curIsAuxiliary = treeNode.isAuxiliary;
    curIsQuantity = treeNode.isQuantity;
    curIsCurrency = treeNode.isCurrency;
    if (treeNode.isAuxiliary == 1) {
        var auxiliaryValue = treeNode.auxiliary;
        if (auxiliaryValue != null && auxiliaryValue.length > 0) {
            var selectHtml = '';
            for (var i = 0; i < auxiliaryValue.length; i++) {
                if (auxiliaryValue.charAt(i) == '1') {
                    var code = getAuxiliaryDataurl(auxiliaryNameArray[i]).split('/')[1];
                    var optionHtml = selectInit(auxiliaryNameArray[i] + "_select", allAuxiliaryData[code], code);
                    var AuxiliaryId = getAuxiliary_type_id(auxiliaryNameArray[i]);
                    var AuxiliaryName = getAuxiliaryName(auxiliaryNameArray[i]);
                    selectHtml += '<div data-id="' + auxiliaryNameArray[i] + '_selectDiv" class="plr05 mt05 w_100"><span id =' + AuxiliaryId + ' class="uds w70">' + AuxiliaryName + ':</span><select data-id="' + auxiliaryNameArray[i] + '_select" class="h30 br05 bac uds w200" onChange="toggleUom()">' + optionHtml + '</select></div>';
                }
            }
            curCoaObj.siblings('.auxiliaryDiv').removeClass('uhide').html(selectHtml).siblings('span').hide();
            initCloseEvent();
        }
    }
}
// 切换存货时如果单位不一样，就改变单位
function toggleUom(){
    if(curCoaObj.siblings('.auxiliaryDiv').html().indexOf('item_selectDiv')>0&&curCoaObj.parent().parent().find('.number').html()!=''){
        var itemId = curCoaObj.siblings('.auxiliaryDiv').find('select[data-id="item_select"]').val();
        var uom = getItemUomById(itemId);
        curCoaObj.parent().parent().find('.uom').html(uom);
    }
}

// -------科目下拉列表--------
function coaListDrop(obj) {
    $(obj).bigAutocomplete({
        width: 285,
        data: newCoaList,
        callback: function(data) {
            curIsAuxiliary = data.isAuxiliary;
            curIsQuantity = data.isQuantity;
            curIsCurrency = data.isCurrency;
            curCoaObj.attr('data-id', data.id);
            curCoaObj.attr('data-array', [data.isAuxiliary, data.isQuantity, data.isCurrency]);
            var curDom = curCoaObj.get(0);showCoaText(curDom);
            if (data.isAuxiliary == 1) {
                initAuxiliaryShow("", "", data);
                return;
            }
            if (data.isQuantity == 1) {
                showQuantityBox();
            }
            if (data.isCurrency == 1) {
                showCurrencyBox();
            }
            $('#bigAutocompleteContent table').scrollTop(0);
            scrollHeight = $('#voucherContent').scrollTop();
        }
    });
}

$('#voucherContent').scroll(function(){
    if($('#bigAutocompleteContent').css('display')=="block"){
        var topValue = parseInt($('#bigAutocompleteContent').css('top'));
        var topHeight = $('#voucherContent').scrollTop() - scrollHeight;
        $('#bigAutocompleteContent').css('top',(topValue-topHeight)+'px');
        scrollHeight = $('#voucherContent').scrollTop();
    }
})

function initDropCoaList() {
    for (var i = 0; i <= rowCount; i++) {
        coaListDrop("#course" + i);
    }
}
// -------点击弹出框外位置关闭弹出框--------
function initCloseEvent() {
    $('#voucher_zone').keyup(function(e) {
        return;
    })
    $('#voucherContent').mouseup(function(e) {
        var thisCon = curCoaObj.siblings('.auxiliaryDiv');
        var thisConparent = curCoaObj.parent();
        if (thisCon.hasClass('uhide')) {
            return;
        }
        if (!thisConparent.is(e.target) && thisConparent.has(e.target).length == 0) {
            if (isSelectNull(thisCon)) {
                if (e.target.tagName == "INPUT") {
                    $(e.target).blur();
                }
                layer.msg('辅助核算选择不完整！', {icon: 5});
                return;
            }
            // --------------------------------------------- 保存所选择的辅助核算对象
			// start-------------------------------------------
            var auxiliaryObj = {};
            var auxiliaryCode = [];
            var auxiliaryName = [];
            var len = thisCon.children().length;
            for (var i = 0; i < len; i++) {
                var auxiliaryItem = thisCon.children().eq(i);
                var auxiliarytype = auxiliaryItem.find('select').attr('data-id').split('_')[0];
                auxiliaryObj[auxiliarytype] = auxiliaryItem.find('select').val();
                auxiliaryObj[auxiliarytype + '_type_id'] = auxiliaryItem.find('span').attr('id');
                var thisAuxiliaryType = auxiliaryItem.attr('data-id').split('_')[0];
                var eleIndex = getindexOf(auxiliaryNameArray, thisAuxiliaryType);
                auxiliaryCode.push(hexCas[eleIndex] + auxiliaryItem.find('select').find("option:selected").attr('data-code'));
                auxiliaryName.push(auxiliaryItem.find('select').find("option:selected").text());
            }
            auxiliaryObj.auxiliaryName = auxiliaryName.join('_');
            auxiliaryObj.auxiliaryCode = auxiliaryCode.join('_');
            var thisIndex = curCoaObj.parent().parent().index();
            selectauxiliaryObj.splice(thisIndex, 1, auxiliaryObj);
            //var longName = curCoaObj.val().split(' ')[0] + '_' + auxiliaryObj.auxiliaryCode + " " + curCoaObj.val().split(' ')[1] + '_' + auxiliaryObj.auxiliaryName
            var longName = curCoaObj.val().split(' ')[0] +  " " + curCoaObj.val().split(' ')[1] + '_' + auxiliaryObj.auxiliaryName
            thisCon.addClass('uhide');
            if(curCoaObj.next().hasClass('dtc')){
                curCoaObj.hide().next().html('<p>' + longName + '</p>');
            }else{
                curCoaObj.hide().after('<div class="dtc" onclick="textClick(this)"><p>' + longName + '</p></div>');
            }
            // ------------------ 保存所选择的辅助核算对象 end ----------------
            if (curIsQuantity == 1 && curCoaObj.parent().next().find('.number').html() == "") {
                showQuantityBox();
            }
            if (curIsCurrency == 1 && curCoaObj.parent().next().next().find('.currency').html() == "") {
                showCurrencyBox();
            }
        }
    });
}

function showQuantityBox() {
    if(curCoaObj.siblings('.auxiliaryDiv').html().indexOf('item_selectDiv')>0){
        var itemId = curCoaObj.siblings('.auxiliaryDiv').find('select[data-id="item_select"]').val();
        var uom = getItemUomById(itemId);
    }else{
        var uom = getUomBycoaId(curCoaObj.attr('data-id'));
    }
    var qualtityHtml = '<span>数量:</span><input class="myNumber" onchange="numberChange(this)" onkeyup="clearNoNum1(this)"/><i class="uom">' + uom + '</i><br><span class="mt03">单价:</span><input class="myPrice" onchange="priceChange(this)" onkeyup="clearNoNum1(this)"/>';
    curCoaObj.parent().next().find('.number').html(qualtityHtml);
}

function getAuxiliaryItem(){
    $.ajax({
        url: ip_url+"bd/item/datatables",
        dataType: "json",
        type: "post",
        data: JSON.stringify({auxiliaryName:"item",bookId:uuid}),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            auxiliaryItemArr = res.data;
        },
       	error: function() {
            logout_login("请重新登录");
    	}
    });
}

function getItemUomById(id){
    if (id == null || id == "") {
        return '';
    }
    for (var i = 0; i < auxiliaryItemArr.length; i++){
        if (auxiliaryItemArr[i].id == id) {
            return auxiliaryItemArr[i].uom;
        }
    }
}

function showCurrencyBox() {
    var coaId = curCoaObj.attr('data-id');
    var currencyId = getCurrencyIdByCoaId(coaId); 
    var currencyHtml ='<select class="myCurrency uds w50" onchange="currencyChange(this)">'+initCurrencyHtml(currencyId)+'</select><input class="myBaseCurrency" onchange="moneyChange(this)"/><br><span class="mt03">汇率:</span><input class="myRate" onchange="rateChange(this)" onkeyup="clearNoNum1(this)"/>';
    var currencyObj = curCoaObj.parent().next().next();
    currencyObj.find('.currency').html(currencyHtml);
    var curObj = currencyObj.find('.myRate').get(0);
    var curValue = currencyObj.find('.myCurrency').val();
    getCurrencyRate(curObj, curValue);
}

/*------------------------------------------------------------修改凭证初始化--------------------------------------------------------*/
function currencyChange(obj) {
    var curObj = $(obj).siblings('.myRate').get(0);
    var curValue = $(obj).val();
    getCurrencyRate(curObj, curValue);
    var prevNumberObj = $(obj).parent().parent().prev().find('.number');
    var nextCurrenyObj= $(obj).parent().parent().prev().find('.currency');
    if (prevNumberObj.html() == "" && nextCurrenyObj.html() == "") {
        return;
    }
    if(prevNumberObj.html() != ""){
    	var numberValue = prevNumberObj.find('.myNumber').val().trim();
    	var priceValue = prevNumberObj.find('.myPrice').val().trim();
    	if (numberValue != "" && priceValue != "") {
    		var value1 = accMul(numberValue, priceValue);
    		var value2 = $(obj).siblings('.myRate').val().trim();
    		if (value2 != '' && value2 != 0) {
    			$(obj).siblings('.myBaseCurrency').val(retainTwoPoint(accDiv(value1, value2)));
    		}
    	}
    	return;
    }	
    if (nextCurrenyObj.html() != "") {
    	var value1="";
        var curMoneyObj = $(obj).parent().parent().parent().find('.debiteMoney'); // 借方金额
        curMoneyObj = $(obj).parent().parent().parent().find('.creditMoney'); // 贷方金额
    	if(curMoneyObj!=null&&curMoneyObj!="undefined"&&curMoneyObj!=""){
    		value1=curMoneyObj.val().trim();// 借方金额
    	}else{
            curMoneyObj = $(obj).parent().parent().parent().find('.creditMoney'); // 贷方金额
        	if(curMoneyObj!=null&&curMoneyObj!="undefined"&&curMoneyObj!=""){
           		value1=curMoneyObj.val().trim();// 借方金额
        	}    		
    	}	
    	if(value1!=null&&value1!="undefined"&&value1!=""){
    		if(value1!=0){
    			var value2 = $(obj).siblings('.myRate').val().trim();
    			if (value2 != '' && value2 != 0) {
    				$(obj).siblings('.myBaseCurrency').val(retainTwoPoint(accDiv(value1, value2)));
    			}
			}
    	}
    }
}

function numberChange(obj) { // 数量变化
    var nextCurrenyObj = $(obj).parent().parent().next().find('.currency');
    var numberValue = $(obj).val().trim();
    var priceValue = $(obj).siblings('.myPrice').val().trim();
    if (priceValue != "") {
        if (nextCurrenyObj.html() != "") {
            var value1 = accMul(numberValue, priceValue);
            var value2 = Number(nextCurrenyObj.find('.myRate').val());
            if (value2 != '' && value2 != 0) {
                nextCurrenyObj.find('.myBaseCurrency').val(retainTwoPoint(accDiv(value1, value2)));
            }
            initLastMoney(value1, value2, obj);
        }
        initLastMoney(numberValue, priceValue, obj);
    }
}

function priceChange(obj) { // 单价变化
    var nextCurrenyObj = $(obj).parent().parent().next().find('.currency');
    var numberValue = $(obj).siblings('.myNumber').val().trim();
    var priceValue = $(obj).val().trim();
    if (numberValue != "") {
        if (nextCurrenyObj.html() != "") {
            var value1 = accMul(numberValue, priceValue)
            var value2 = Number(nextCurrenyObj.find('.myRate').val());
            var value3 = accDiv(value1, value2);
            if (value2 != '' && value2 != 0) {
                // nextCurrenyObj.find('.myBaseCurrency').val(retainTwoPoint(accDiv(value1,
				// value2)));
            	value1 =accDiv(value1, value2);
            }
            initLastMoney(value1, value2, obj);
        } else {
            initLastMoney(numberValue, priceValue, obj);
        }
    }
}

function moneyChange(obj) { // 原币变化
    var prevNumberObj = $(obj).parent().parent().prev().find('.number');
    var curValue = $(obj).val().trim();
    if (prevNumberObj.html() != "") {
        if (curValue != "") {
            var numberValue = prevNumberObj.find(".myNumber").val().trim();
            if (numberValue != "" && numberValue != 0) {
                var value1 = accDiv(curValue, numberValue);
                var value2 = Number($(obj).siblings('.myRate').val().trim());
                prevNumberObj.find(".myPrice").val(retainFourPoint(accMul(value1, value2)));
            }
        }
    }
    var value1 = $(obj).val().trim();
    var value2 = Number($(obj).siblings('.myRate').val().trim());
    initLastMoney(value1, value2, obj);
}

function rateChange(obj) {
    var prevNumberObj = $(obj).parent().parent().prev().find('.number');
    var curValue = $(obj).val().trim();
    if (prevNumberObj.html() != "") {
        if (curValue != "") {
            var numberValue = prevNumberObj.find(".myNumber").val().trim();
            if (numberValue != "") {
                var value1 = accDiv(curValue, numberValue);
                var value2 = Number($(obj).siblings('.myBaseCurrency').val().trim());
                prevNumberObj.find(".myPrice").val(retainFourPoint(accMul(value1, value2)));
            }
        }
    }
    var value1 = $(obj).val().trim();
    var value2 = Number($(obj).siblings('.myBaseCurrency').val().trim());
    initLastMoney(value1, value2, obj);
}

function initLastMoney(value1, value2, obj) {
    var coaId = $(obj).parent().parent().parent().find('.course').attr('data-id');
    var crDr = getCrdrByCoaId(coaId);
    if (crDr == 1) {
        var curMoneyObj = $(obj).parent().parent().parent().find('.debiteMoney'); // 借方金额
    } else {
        var curMoneyObj = $(obj).parent().parent().parent().find('.creditMoney'); // 贷方金额
    }
    var curTotalMoney = accMul(value1, value2);
    curMoneyObj.val(curTotalMoney);
    showNumber(curMoneyObj.get(0));
    inputChange(curMoneyObj.get(0));
}

function createMoneyNumber() {
    var coaId = curCoaObj.attr('data-id');
    var crDr = getCrdrByCoaId(coaId);
    if (crDr == 1) {
        var curMoneyObj = curCoaObj.parent().parent().find('.debiteMoney'); // 借方金额
    } else {
        var curMoneyObj = curCoaObj.parent().parent().find('.creditMoney'); // 贷方金额
    }
    var currencyRate = $('#currency_input').val().trim();
    var baseCurrencyValue = $('#currency_base').val().trim();
    var curTotalMoney = accMul(currencyRate, baseCurrencyValue);
    curMoneyObj.val(curTotalMoney);
    showNumber(curMoneyObj);
}
// --------修改凭证刚进来对辅助核算数据初始化---------
function auxiliaryConfig(obj, i) {
    coaBlur(obj);
    $(obj).attr('onmouseup', 'coaClick(this)');
    if ($(obj).val().trim() == "") {return;}
    if ($(obj).attr('data-array').split(',')[0] == 1) {
        curCoaObj = $(obj);
        $(obj).siblings('.auxiliaryDiv').removeClass('uhide');
        $(obj).parent().parent().siblings().find('.auxiliaryDiv').addClass('uhide');
        var curItem = curVoucherObject[i];
        var selectHtml = '';
        for (var i = 0; i < auxiliaryNameArray.length; i++) {
            if (curItem[auxiliaryNameArray[i] + 'Id'] != 'null') {
                $(obj).siblings('.auxiliaryDiv').find('[data-id=' + auxiliaryNameArray[i] + '_selectDiv]').find('select').val(curItem[auxiliaryNameArray[i] + 'Id']);
            }
        }
    }
}

function auxiliarySet(obj,i){
    coaBlur(obj);
    $(obj).attr('onmouseup', 'coaClick(this)');
    if ($(obj).val().trim() == "") {
        return;
    }
    if ($(obj).attr('data-array').split(',')[0] == 1) {
        curCoaObj = $(obj);
        $(obj).siblings('.auxiliaryDiv').removeClass('uhide');
        $(obj).parent().parent().siblings().find('.auxiliaryDiv').addClass('uhide');
        var curItem = selectauxiliaryObj[i];
        var selectHtml = '';
        for (var i = 0; i < auxiliaryNameArray.length; i++) {
            if (curItem[auxiliaryNameArray[i] + 'Id'] != 'null') {
                $(obj).siblings('.auxiliaryDiv').find('[data-id=' + auxiliaryNameArray[i] + '_selectDiv]').find('select').val(curItem[auxiliaryNameArray[i]]);
            }
        }
    }
}

// ------------------------------------------------修改凭证时初始化分录辅助核算对象-------------------------------------------------
function initAuxiliaryObj(arr) {
    for (var i = 0; i < arr.length; i++) {
        var auxiliaryObj = {};
        var coaId = arr[i].coaId;
        var isAuxiliary = getIsAuxiliaryByCoaId(coaId),isQuantity = getIsQuantityByCoaId(coaId),isCurrency = getIsCurrencyByCoaId(coaId);
        auxiliaryObj.isAuxiliary = !!isAuxiliary;
        auxiliaryObj.isQuantity = !!isQuantity;
        auxiliaryObj.isCurrency = !!isCurrency;
        if (isAuxiliary == 1) {
            auxiliaryObj.auxiliaryName = arr[i].coaCobinationName;
            auxiliaryObj.auxiliaryCode = arr[i].coaCobinationCode;
            auxiliaryObj.coaCobinationId = arr[i].coaCobinationId;
            for (var j = 0; j < auxiliaryNameArray.length; j++) {
                if (arr[i][auxiliaryNameArray[j] + 'Id'] != 'null') {
                    auxiliaryObj[auxiliaryNameArray[j]] = arr[i][auxiliaryNameArray[j] + 'Id'];
                    auxiliaryObj[auxiliaryNameArray[j] + '_type_id'] = getAuxiliary_type_id(auxiliaryNameArray[j]);
                }
            }
        }
        selectauxiliaryObj.splice(i, 1, auxiliaryObj);
    }
}

/**
 * ********************************************************* 保存凭证
 * ************************************************************************
 */
function saveVoucherFun(type) {
    var oT = $('#catogeryName').get(0).selectedIndex;
    if ($('.dataTime').val() == "") {
        layer.msg('凭证期间不能为空！', {icon: 5});return;
    }
    if ($("#catogeryName").val() == "") {
        layer.msg('凭证字不能为空！', {icon: 5});return;
    }
    if ($("#catogeryNumber").html() == "") {
        layer.msg('凭证号不能为空！', {icon: 5});return;
    }
    var voucherLen = 0;
    var booleanArray = [];
    var curOpenlen = $('#voucher_tbody').children().length;
    for (var i = 0; i < curOpenlen; i++) {
        booleanArray.push(false);
    }
    for (var i = 0; i < curOpenlen; i++) {
        if ($('#voucher_tbody').children().eq(i).find('.summary').val().trim() != "" || $('#voucher_tbody').children().eq(i).find('.course').val().trim() != "" || $('#voucher_tbody').children().eq(i).find(".creditMoney").val().trim() != "" || $('#voucher_tbody').children().eq(i).find(".debiteMoney").val().trim() != "") {
            voucherLen++;
            booleanArray[i] = true;
        }
    }
    if (voucherLen < 2) {
        layer.msg('至少要填写两条会计分录！', {icon: 5});return;
    }
    for (var i = 0; i < curOpenlen; i++) {
        var voucherItem = $('#voucher_tbody').children().eq(i);
        if (voucherItem.find(".summary").val().trim() == "" && booleanArray[i] == true) {
            layer.msg("第" + (i + 1) + "行，摘要未填写！", {icon: 5});return;
        }
        if (voucherItem.find(".course").val().trim() == "" && booleanArray[i] == true) {
            layer.msg("第" + (i + 1) + "行，科目未填写！", {icon: 5});return;
        }
        if (voucherItem.find(".course").attr('data-id') == "" && booleanArray[i] == true) {
        	layer.msg('第' + (i + 1) + '行的会计科目不合法！', {icon: 5});return;
        }
        var dataArray = voucherItem.find(".course").attr('data-array').split(',');
        if (dataArray[1] == "1") {
            if ((voucherItem.find(".myNumber").val().trim() == "" || voucherItem.find(".myPrice").val().trim() == "") && booleanArray[i] == true) {
                layer.msg("第" + (i + 1) + "行，数量核算不完整！", {icon: 5});return;
            }
        }
        if (dataArray[2] == "1") {
            if ((voucherItem.find(".myBaseCurrency").val().trim() == "" || voucherItem.find(".myRate").val().trim() == "") && booleanArray[i] == true) {
                layer.msg("第" + (i + 1) + "行，币种核算不完整！", {icon: 5});return;
            }
        }
        if (type != 2 && type != 3) {
            if (voucherItem.find(".creditMoney").val().trim() == "" && voucherItem.find(".debiteMoney").val().trim() == "" && booleanArray[i] == true) {
                layer.msg("第" + (i + 1) + "行，借方金额与贷方金额必须填一个！", {icon: 5}); return;
            }
        }
    }
    if (type != 2 && type != 3) {
        if (parseFloat($('.totalMoney1').val()) != parseFloat($('.totalMoney2').val())) {
            layer.msg('借贷金额必须相等！', {icon: 5});return;
        }
    }
    if (type == 2) {
        showModelBox();
        if (sessionStorage.voucherFlag == 5) {
            $('#templetType1').val(sessionStorage.templetType);
            $('#templetName').val(sessionStorage.templetName);
        }
        return;
    }
    if (type == 3) {
        if ($('#templetType1').val().trim() == "" || $('#templetName').val().trim() == "") {
            layer.msg('模板类型、模板名称不能为空！', {icon: 5});return;
        }
    }
    var voucherId;
    var voucherArray = [];
    for (var j = 0; j < curOpenlen; j++) {
        if (booleanArray[j] == true) {
            var curRowObj = $('#voucher_tbody').children().eq(j);
            var summary = curRowObj.find(".summary").val();
            var course = curRowObj.find(".course").val();
            var courseId = curRowObj.find(".course").attr('data-id');
            var isArray = curRowObj.find(".course").attr('data-array').split(',');
            var isAuxiliary = !!parseInt(isArray[0]);
            var isQuantity = !!parseInt(isArray[1]);
            var isCurrency = !!parseInt(isArray[2]);
            var number = curRowObj.find(".myNumber").val();
            var currency = curRowObj.find(".myCurrency").html();
            var creditMoney = curRowObj.find(".creditMoney").val();
            var debiteMoney = curRowObj.find(".debiteMoney").val();
            var jzCode = $("#jzCode").val();
            var joinJeHeaderId = $("#joinJeHeaderId").val();
            var auxiliary_data = selectauxiliaryObj[j];
            if (isQuantity) {
                auxiliary_data.qNumber = curRowObj.find(".myNumber").val().trim();
                auxiliary_data.qPrice = curRowObj.find(".myPrice").val().trim();
                auxiliary_data.qUom = curRowObj.find(".uom").html();
            }
            if (isCurrency) {
                auxiliary_data.cBase = curRowObj.find('.myBaseCurrency').val().trim();
                auxiliary_data.cRate = curRowObj.find('.myRate').val().trim();
                auxiliary_data.cType = curRowObj.find('.myCurrency').val();
                auxiliary_data.cTypeName = curRowObj.find('.myCurrency option:selected').text();
                auxiliary_data.cTypeCode = curRowObj.find('.myCurrency option:selected').attr('data-code');
            }
            if (creditMoney == "") {
                creditMoney = 0
            }
            if (debiteMoney == "") {
                debiteMoney = 0
            }
            var itemObj = {
                container: {
                    coaCode: course.split(' ')[0],
                    coaHierarchyId: sessionStorage.coahierarchyId,
                    coaId: courseId,
                    creditMoney: creditMoney,
                    debiteMoney: debiteMoney,
                    isAuxiliary: isAuxiliary,
                    isCurrency: isCurrency,
                    isQuantity: isQuantity,
                    rowId: parseInt(j + 1),
                    rowNum: parseInt(j + 1),
                    summary: summary
                }
            }
            Objectpush(itemObj.container, auxiliary_data);
            voucherArray.push(itemObj);
        }
    }
    if (sessionStorage.voucherFlag == 3) {
        saveTypeValue = '2';
    }
    if (sessionStorage.voucherFlag == 1) {
        voucherId = sessionStorage.voucherId;
    }
    if(baseCurrency!=null){
        baseCurrencyCode1=baseCurrency.currencyCode;
        baseCurrencyId1=baseCurrency.id;
        baseCurrencyName1=baseCurrency.currencyName;
    }else{
        baseCurrencyCode1="CNY";
        baseCurrencyId1="";
        baseCurrencyName1="人民币";
    }
    var Voucherobj = {
        container: {
            AttachmentList: [],
            baseCurrencyCode: baseCurrencyCode1,
            baseCurrencyId:  baseCurrencyId1,
            baseCurrencyName: baseCurrencyName1,
            bookId: sessionStorage.uuid,
            catogeryId: catogery[oT].id,
            catogeryName: catogery[oT].catogeryName,
            catogeryTitle: "记账凭证",
            jzCode: jzCode,
            joinJeHeaderId:joinJeHeaderId,
            periodCode: $('.dataTime').val().substring(0, 7),
            periodId: curPeriodValue,
            periodName: $('#Period').html(),
            saveType: saveTypeValue,
            totalCreditMoney: parseInt($('.totalMoney1').val()),
            totalDebiteMoney: parseInt($('.totalMoney2').val()),
            voucherAttachmentNum: $('#voucherAttachmentNum').val().trim(),
            voucherDate: $('.dataTime').val(),
            voucherSeq: String(Number($('#catogeryNumber').html())),
            voucherId: voucherId,
            jeHeaderId: voucherId,
            voucherTable: voucherArray
        }
    }
    if (sessionStorage.voucherFlag == 7) {
        Voucherobj.container.AttachmentList.push(JSON.parse(sessionStorage.fileData));
    }
    // -----保存为模板凭证---
    var requestUrl = ip_url+'gl/voucher/save';
    if (type == 3) {
        Voucherobj.container.templet = $('#saveToModelBox').formToObj();
        requestUrl = ip_url+'gl/templet/save';
    }
    if (sessionStorage.voucherFlag == 4) {
        requestUrl = ip_url+'gl/templet/save';
    }
    if (sessionStorage.voucherFlag == 5) {
        requestUrl =ip_url+'gl/templet/' + sessionStorage.templetId;
    }
    var requestType = 'post';    
    if (sessionStorage.voucherFlag == 1) {
        requestUrl = ip_url+'gl/voucher/modify';
    }
    loading();
    $.ajax({
        url: requestUrl,
        type: requestType,
        dataType: "json",
        data: JSON.stringify(Voucherobj),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            closeLoading();
            if (res.success) {
                if (sessionStorage.voucherFlag == 0) { // 录凭证
                    if(type==1){
                        layer.msg("凭证保存完成！", {icon: 1});
                    }
                    if(type==3){
                        $('#toModelBox').modal('hide');
                        layer.msg("凭证模板保存完成！", {icon: 1});
                    }
                    goPage('business/voucher/addVoucher.html','新增凭证');
                }
                if (sessionStorage.voucherFlag == 1 || sessionStorage.voucherFlag == 3) { // 修改和插入凭证
                    layer.msg("凭证保存完成！", {icon: 1});
                    goPage('business/voucher/voucherlist.html','查询凭证');
                }
                if (sessionStorage.voucherFlag == 4 || sessionStorage.voucherFlag == 5) { // 修改和新增凭证模板
                    layer.msg("凭证模板保存完成！", {icon: 1});
                    $('#toModelBox').modal('hide');
                    goPage('business/setting/modelsetting/vouchermodel.html','凭证模板');
                }
                if (sessionStorage.voucherFlag == 6) { // 结账制单
                    layer.msg("生成凭证完成！", {icon: 1});
                    goPage('business/paybill/paybill.html','结帐');
                }
                if (sessionStorage.voucherFlag == 7) { // 票据制单
                    layer.msg("凭证保存完成！", {icon: 1});
                    goPage('business/biller/billerlist.html','票据管理');
                }
            } else {
                layer.msg(res.msg, {icon: 5});
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

/** **************************** 摘要相关代码 ******************************** */
/* --------初始化摘要下拉列表---------- */
function initDropSummaryList() {
    for (var i = 0; i <= rowCount; i++) {
        summaryListDrop('#summary' + i);
    }
}

function summaryListDrop(obj) {
    $(obj).bigAutocomplete({
        width: 242,
        data: newSummaryList,
        callback: function(data) {
            $(obj).val(data.title.split(' ')[1]);
            $('#bigAutocompleteContent').scrollTop(0);
        }
    });
}
/*--------------新增摘要--------------*/
function addSummary() {
    if ($('input[name=mnemonicCode]').val().trim() == "" || $('input[name=summary]').val().trim() == "") {
        layer.msg('摘要编码或名称不能为空！', {icon: 5});
        return;
    }
    var summaryObj = $("#summaryForm").formToObj();
    summaryObj.bookId = uuid;
    $.ajax({
        url: ip_url+"gl/summary/save",
        dataType: "json",
        type: "post",
        data: JSON.stringify(summaryObj),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            if (res.errorCode == "0") {
                layer.msg("保存完成", {icon: 1});
            } else {
                layer.msg(res.msg, {icon: 5});
            }
            fileTable.fnDestroy();
            initSummaryTables();
            $('#summaryForm')[0].reset();
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}
/*--------------删除摘要--------------*/
function delSummary(id) {
    layer.confirm('确定要删除这个摘要吗？', {
        btn: ['确定', '取消']
    }, function() {
        $.ajax({
            url: ip_url+"gl/summary/deleteById",
            dataType: "json",
            type: "post",
            data: JSON.stringify({id:id}),
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                fileTable.fnDestroy();
                layer.closeAll();
                initSummaryTables();
                $('#summaryForm')[0].reset();
            },
           	error: function() {
                logout_login("请重新登录");
            }   
        });
    }, function(index) {
        layer.close(index);
    });
}

// 获取摘要列表
function summaryInit() {
    $.ajax({
        url: ip_url+"gl/summary/getAllUnion",
        dataType: "json",
        type: "post",
        data: JSON.stringify({bookId: uuid}),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            summarylist = res.data;
            for (var i = 0; i < summarylist.length; i++) {
                newSummaryList.push({
                    title: summarylist[i].mnemonicCode + " " + summarylist[i].summary
                });
            }
            initDropSummaryList();
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

/*--------------初始化摘要表格--------------*/
function initSummaryTables() {
    fileTable = $("#summaryTable").dataTable({
        bSort: false,
        bFilter: false,
        lengthChange: false,
        iDisplayLength: 6,
        oLanguage: {
            sProcessing: "正在获取摘要数据，请稍后...",
            sZeroRecords: "暂无摘要数据",
            sInfo: "共 _TOTAL_ 条",
            sInfoEmpty: "记录数为0",
            oPaginate: {
                "sFirst": "第一页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "最后一页"
            }
        },
        sAjaxSource:ip_url+"gl/summary/datatables",
        fnServerData: function(sSource, aDataSet, fnCallback, oSettings) {
            oSettings.jqXHR = $.ajax({
                dataType: 'json',
                type: "post",
                url: sSource,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    bookId: uuid
                }),
                success: function(data) {
                    summaryList = data.data;
                    successCallback(data, aDataSet, fnCallback);
                },
               	error: function() {
                    logout_login("请重新登录");
                }
            });
        },
        aoColumns: [{
            mData: "mnemonicCode",
            sTitle: "<center>助记码</center>",
            mRender: function(data, type, full) {
                return '<span style="vertical-align: middle">' + data + '</span>';
            }
        }, {
            mData: "summary",
            sTitle: "<center>名称</center>",
            mRender: function(data, type, full) {
                return '<span style="vertical-align: middle">' + data + '</span>';
            }
        }, {
            mData: "id",
            sTitle: "<center>操作</center>",
            mRender: function(data, type, full) {
                return '<center>\
                        <button class="btn btn-xs btn-default" title="编辑" onclick="updateSummary(this)"><span class="icon-edit"></span></button>\
                        <button class="btn btn-xs btn-default ml10" title="删除" onclick="delSummary(\'' + data + '\')"><span class="icon-delete"></span></button>\
                        <button class="btn btn-xs btn-default ml10" title="选择" onclick="selectSummary(this)">选择</button>\
                        </center>';
            }
        }],
        fnDrawCallback: function(oSettings) {}
    });
}
/*--------------修改摘要--------------*/
function updateSummary(obj) {
    var rowNode = obj.parentNode.parentNode.parentNode;
    var rowData = fileTable.fnGetData(rowNode);
    $('#summaryForm').find('input[name=mnemonicCode]').val(rowData.mnemonicCode);
    $('#summaryForm').find('input[name=id]').val(rowData.id);
    $('#summaryForm').find('input[name=summary]').val(rowData.summary);
}
/*--------------选择当前摘要--------------*/
function selectSummary(obj) {
    var rowNode = obj.parentNode.parentNode.parentNode;
    var rowData = fileTable.fnGetData(rowNode);
    var summaryValue = rowData.summary;
    curSummaryObj.val(summaryValue);
    $('#myModal1').modal('hide');
}

/** **********************************************************凭证所用方法汇总********************************************************************* */
// 两个对象合并
function Objectpush(obj1, obj2) {
    for (var param in obj2) obj1[param] = obj2[param];
}
// 显示常用摘要模态框
function showCase1(obj) {
    $('#myModal1').modal('show');
    curSummaryObj = $(obj).prev('input');
    $('#summaryForm')[0].reset();
}
// ---显示科目树模态框
function showCase2(obj) {
    $('#myModal2').modal('show');
    curCoaObj = $(obj).parent().find('input');
    initCourseTree();
}
// -----获取两个数字中的非零值------
function getNumber(number1, number2) {
    return number1 == 0 ? number2 : number1;
}
// -----显示中文大写------
function showZhMoney(money) {
    if (($('.totalMoney1') && $('.totalMoney2')) && $('.totalMoney1').val() == $('.totalMoney2').val()) {
        var zhMoney = convertCurrency(money);
        $('#totalNumber').html("合计:<i>" + zhMoney+'</i>');
    }else{
        $('#totalNumber').html("合计:");
    }
}
// ---------保留两位小数---------
function retainTwoPoint(number) {
    return parseFloat(number).toFixed(2);
}
// ---------保留四位小数---------
function retainFourPoint(number) {
    return parseFloat(number).toFixed(4);
}

// 获取当前日期年月日
function getNowDate() {
    var d = new Date();
    var str1 = d.getFullYear(),str2 = d.getMonth() + 1,str3 = d.getDate();
    str2 = str2 < 10 ? '0' + str2 : str2;str3 = str3 < 10 ? '0' + str3 : str3;
    return str1 + '-' + str2 + '-' + str3;
}

// -----输入框失焦的时候-----
function showNumber(obj) {
    $(obj).css('opacity', '0.0').siblings().show();
    if ($(obj).val().trim()==""||$(obj).val().trim()=="0"||$(obj).val().trim()=="0."||$(obj).val().trim()=="0.0"||$(obj).val().trim()=="0.00"||$(obj).val().trim()=="00.00") {
        valueHtml = '';$(obj).val('');
    } else {
        var value = Math.abs(Math.round(parseFloat($(obj).val().trim()*100)));
        var valueHtml = '';
        if (value >= 10 && value < 100) {
            var value = '0' + String(value);
        } else if (value > -100 && value <= -10) {
            var value = '0' + String(value);
        } else if (value > 0 && value < 10) {
            var value = '00' + String(value);
        } else if (value > -10 && value < 0) {
            var value = '00' + String(value);
        } else {
            var value = fixNum(value, 0);
        }
        if (obj.value.indexOf('.')>0&&obj.value.indexOf('.')==obj.value.length-1) {
            obj.value = obj.value.substring(0, obj.value.length-1);
        }
        var len = value.length;
        if ($(obj).val().trim().indexOf('-') == -1) {
            for (i = 0; i < len; i++) {
                valueHtml += '<i>' + value.charAt(i) + '</i>';
            }
        } else {
            for (i = 0; i < len; i++) {
                valueHtml += '<i class="red">' + value.charAt(i) + '</i>';
            }
        }
    }
    $(obj).siblings('.money_bg').html(valueHtml);
    if ($(obj).hasClass('debiteMoney')) {
        calculate1();
    } else {
        calculate2();
    }
    backChange(obj);
}


function backChange(obj) {
    var thisValue = $(obj).val().trim();
    if (thisValue == "") {
        return
    }
    var parentObj = $(obj).parent().parent();
    if (parentObj.find('.number').html() != "") {
        if (parentObj.find('.myNumber').val() != "") {
            var value1 = parentObj.find('.myNumber').val();
            if (value1 != "" && value1 != 0)
                parentObj.find('.myPrice').val(retainFourPoint(accDiv(thisValue, value1)))
        }
    }
    if (parentObj.find('.currency').html() != "") {
        if (parentObj.find('.myRate').val() != "") {
            var value2 = parentObj.find('.myRate').val();
            if (value2 != "" && value2 != 0)
                parentObj.find('.myBaseCurrency').val(retainTwoPoint(accDiv(thisValue, value2)))
        }
    }
}

// -------输入框发生改变的时候-------
function inputChange(obj) {
    if ($(obj).hasClass('debiteMoney')&&$(obj).parent().next().find('.input_bg').val()!="") {
        $(obj).parent().next().find('.input_bg').val('');$(obj).parent().next().find('.money_bg').html('');calculate2();
    }
    if($(obj).hasClass('creditMoney')&&$(obj).parent().prev().find('.input_bg').val()!=""){
        $(obj).parent().prev().find('.input_bg').val('');$(obj).parent().prev().find('.money_bg').html('');calculate1();
    }
    clearNoNum(obj);
}

function clearNoNum(obj) {
    if (obj.value != '' && obj.value.substr(0, 1) == '=') {
        if ($(obj).hasClass('debiteMoney')) {
            $(obj).val('0');calculate1();
        }
        if($(obj).hasClass('creditMoney')){
            $(obj).val('0');calculate2();
        }
        valueBalance(obj);return;
    }
    if (obj.value.indexOf('-') < 0) {
        if (obj.value != '' && obj.value.substr(0, 1) == '.') {
            obj.value = "";
        }
    } else {
        if (obj.value != '' && obj.value.substr(1, 2) == '.') {
            obj.value = "-";
        }
        if (obj.value.length > 1 && obj.value.indexOf('-') > 0) {
            obj.value = obj.value.substring(0, obj.value.length - 1);
        }
    }
    obj.value = obj.value.replace(/[^\d.-]/g, "");
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (obj.value.indexOf(".") < 0 && obj.value != "") {
        if (obj.value.substr(0, 1) == '0' && obj.value.length == 2) {
            obj.value = obj.value.substr(1, obj.value.length);
        }
    }
    if (obj.value.indexOf('.')>0) {
        $(obj).attr('maxlength','12');
    }else{
        $(obj).attr('maxlength','10');
    }
    if (obj.value.indexOf('.') > 0 && obj.value.length > 12) {
        obj.value = obj.value.substring(0, 11);
    }
    if (obj.value.indexOf('.') < 0) {
        obj.value = obj.value.substring(0, 9);
    }
}

function valueBalance(obj){
    if($('#totalMoney1').html()==""&&$('#totalMoney2').html()==""){
        $(obj).val('0.00');
    }
    if($(obj).hasClass('debiteMoney')){
        if($('#totalMoney1').html()==""&&$('#totalMoney2').html()!=""){
            var totalMoney2 = $('.totalMoney2').val();
            $(obj).val(fixNum(totalMoney2,2));
        }
        if($('#totalMoney1').html()!=""&&$('#totalMoney2').html()!=""){
            var totalMoney1 = $('.totalMoney1').val();var totalMoney2 = $('.totalMoney2').val();
            $(obj).val(fixNum(Number(totalMoney2)/100 - Number(totalMoney1)/100),2);
        }
        if($('#totalMoney1').html()!=""&&$('#totalMoney2').html()==""){
            var totalMoney1 = $('.totalMoney1').val();
            $(obj).val(fixNum(0 - Number(totalMoney1)/100),2);
        }
    }else{
        if($('#totalMoney2').html()==""&&$('#totalMoney1').html()!=""){
            var totalMoney1 = $('.totalMoney1').val();
            $(obj).val(fixNum(totalMoney1,2));
        }
        if($('#totalMoney').html()!=""&&$('#totalMoney2').html()!=""){
            var totalMoney1 = $('.totalMoney1').val();var totalMoney2 = $('.totalMoney2').val();
            $(obj).val(fixNum(Number(totalMoney1)/100 - Number(totalMoney2)/100),2);
        }
        if($('#totalMoney1').html()==""&&$('#totalMoney2').html()!=""){
            var totalMoney2 = $('.totalMoney2').val();
            $(obj).val(fixNum(0 - Number(totalMoney2)/100),2);
        }
    }
}

function clearNoNum1(obj) {
    var res = /^\-?\d+(?:\.\d{0,4})?$/;
    if (!res.test(obj.value)) {
        obj.value = obj.value.substring(0, obj.value.length - 1);
    }
}

function closeCoaPop(){
    $('.coaAdd').hide();
    $('#myModal2').modal('hide');
}

// -------获取当前货币的汇率--------
function getCurrencyRate(obj, id) {
    if(!id){
        $(obj).val('1.0000');
    }
    for(var i=0;i<currencyList.length;i++){
        if(currencyList[i].id==id){
            $(obj).val(parseFloat(currencyList[i].exchangerate).toFixed(4));
        }
    }
}

// -------下拉列表初始化-----
function selectInit(id, array, code) {
    var optionHtml = '<option value="">请选择</option>';
    for (var i = 0; i < array.length; i++) {
        codeValue = array[i][code + 'Code'];
        optionHtml += '<option value="' + array[i].id + '" data-code="' + codeValue + '">' + array[i].text + '</option>';
    }
    return optionHtml;
}

function getAuxiliary_type_id(code) {
    if (code == null || code == "") {
        return '';
    }
    for (var i = 0; i < auxiliaryType.length; i++) {
        if (auxiliaryType[i].auxiliaryTypeCode == code) {
            return auxiliaryType[i].id;
        }
    }
}

function getAuxiliaryDataurl(code) {
    if (code == null || code == "") {
        return '';
    }
    for (var i = 0; i < auxiliaryType.length; i++) {
        if (auxiliaryType[i].auxiliaryTypeCode == code) {
            return auxiliaryType[i].serviceDataUrl;
        }
    }
}

function getAuxiliaryName(code) {
    if (code == null || code == "") {
        return '';
    }
    for (var i = 0; i < auxiliaryType.length; i++) {
        if (auxiliaryType[i].auxiliaryTypeCode == code) {
            return auxiliaryType[i].auxiliaryTypeName;
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

// 通过会计科目id获取借贷方向
function getCrdrByCoaId(coaId) {
    if (coaId == null || coaId == "") {
        return '';
    }
    for (var i = 0; i < coaList.length; i++) {
        if (coaList[i].id == coaId) {
            return coaList[i].crDr;
        }
    }
}
// 通过会计科目id获取计量单位向
function getUomBycoaId(coaId) {
    if (coaId == null || coaId == "") {
        return '';
    }
    for (var i = 0; i < coaList.length; i++) {
        if (coaList[i].id == coaId) {
            return coaList[i].uom;
        }
    }
}

function getCurrencyIdByCoaId(coaId) {
    if (coaId == null || coaId == "") {
        return '';
    }
    for (var i = 0; i < coaList.length; i++) {
        if (coaList[i].id == coaId) {
        	return coaList[i].currencyId;
        }
    }
    return ''; 
}

function getCurrencyNameById(id) {
    if (id == null || id == "") {
        return '';
    }
    for (var i = 0; i < currency.length; i++) {
        if (currency[i].id == id) {
            return currency[i].currencyName;
        }
    }
}

function getCurrencyCodeById(id) {
    if (id == null || id == "") {
        return '';
    }
    for (var i = 0; i < currency.length; i++) {
        if (currency[i].id == id) {
            return currency[i].currencyCode;
        }
    }
}

function getCurrencyText(id) {
    if (id == null || id == "") {
        return '';
    }
    for (var i = 0; i < currency.length; i++) {
        if (currency[i].id == id) {
            return currency[i].currencyName;
        }
    }
}

function getindexOf(arr, el) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == el) {
            return i;
        }
    }
    return -1;
}

// 通过会计科目id找是否科目借贷方向
function getIsQuantityByCoaId(coaId) {
    if (coaId == null || coaId == "") {
        return '';
    }
    for (var i = 0; i < coaList.length; i++) {
        if (coaList[i].id == coaId) {
            return coaList[i].crDr;
        }
    }
}

// --------添加分录---------
function addRow(obj) {
    rowCount++;
    var rowHtml = '<tr>\
                    <td class="p0 tablectrl">\
                        <a title="增加分录" class="glyicon_plus" onclick="addRow(this);"></a><a title="删除分录" class="glyicon_remove" onclick="delRow(this);"></a>\
                    </td>\
                    <td class="urel p0">\
                        <input type="text" autocomplete="off" class="summary uds" id="summary' + rowCount + '" /><span class="showCourse uds" onClick="showCase1(this)">摘要</span>\
                    </td>\
                    <td class="urel p0">\
                        <input type="text" autocomplete="off" class="course uds" data-id="" data-array="" id="course' + rowCount + '" oninput="coaBlur(this)" onmouseup="coaClick(this)" onblur="showCoaText(this)"/>\
                        <span class="showCourse uds" onClick="showCase2(this)">科目</span>\
                        <div class="auxiliaryDiv uhide"></div>\
                    </td>\
                    <td class="urel p0"><div class="number f12 ptb05"></div></td>\
                    <td class="urel p0"><div class="currency f12 ptb05"></div></td>\
                    <td class="urel p0">\
                        <div class="money_bg"></div><input type="text" autocomplete="off" class="input_bg debiteMoney" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)"/>\
                    </td>\
                    <td class="urel p0">\
                        <div class="money_bg"></div><input type="text" autocomplete="off" class="input_bg creditMoney" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)"/>\
                    </td>\
                  </tr>';
    if (obj) {
        $(obj).parent().parent().after(rowHtml);
    } else {
        $('#voucher_tbody').append(rowHtml);
    }
    bindAutoComplete();
    nullKeySwitch();
    var curThisIndex = $(obj).parent().parent().index();
    if(rowCount>=4){
        selectauxiliaryObj.splice(curThisIndex, 0, {});
    }
}
/* 删除行 */
function delRow(obj) {
    if ($("#voucher_tbody").children().length <= 2) {
        layer.msg('至少要保留两条分录！', {icon: 5});return;
    }
    rowCount--;
    var thisIndex = $(obj).parent().parent().index();
    selectauxiliaryObj.splice(thisIndex, 1); // 删除数组指定的索引值
    $(obj).closest("tr").remove();
}

function inputUp(obj) {
    $(obj).css("opacity", "1.0").select().siblings().hide();
}

// 绑定bigautocomplete方法
function bindAutoComplete(){
    for(var i=0;i<=rowCount;i++){
        summaryListDrop('#summary'+i);
        coaListDrop('#course'+i);
    }
}

/** *计算结果** */
function calculate1() {
    var len = $('#voucher_tbody').children().length;
    var totalMoney1 = 0;
    for (var i = 0; i < len; i++) {
        var curValue = $("#voucher_tbody").children().eq(i).find('.debiteMoney').val().trim();
        var value = curValue == "" ? 0 : curValue;
        var number = Math.round(parseFloat(value) * 100);
        totalMoney1 += number;
    }
    var totalMoney = Stringify(totalMoney1);
    var valueHtml = valueToHtml(totalMoney);
    $('#totalMoney1').html(valueHtml + '<input type="hidden" class="totalMoney1" value="'+totalMoney+'" />');
    calculate_2();
    showZhMoney(totalMoney1);
}

function calculate2() {
    var len = $('#voucher_tbody').children().length;
    var totalMoney2 = 0;
    for (var i = 0; i < len; i++) {
        var curValue = $("#voucher_tbody").children().eq(i).find('.creditMoney').val().trim();
        var value = curValue == "" ? 0 : curValue;
        var number = Math.round(parseFloat(value) * 100);
        totalMoney2 += number;
    }
    var totalMoney = Stringify(totalMoney2);
    var valueHtml = valueToHtml(totalMoney);
    $('#totalMoney2').html(valueHtml + '<input type="hidden" class="totalMoney2" value="' + totalMoney + '" />');
    calculate_1();
    showZhMoney(totalMoney2);
}

function calculate_1() {
    var len = $('#voucher_tbody').children().length;
    var totalMoney1 = 0;
    for (var i = 0; i < len; i++) {
        var curValue = $("#voucher_tbody").children().eq(i).find('.debiteMoney').val().trim();
        var value = curValue == "" ? 0 : curValue;
        var number = Math.round(parseFloat(value) * 100);
        totalMoney1 += number;
    }
    var totalMoney = Stringify(totalMoney1);
    var valueHtml = valueToHtml(totalMoney);
    $('#totalMoney1').html(valueHtml + '<input type="hidden" class="totalMoney1" value="' + totalMoney + '" />');
    showZhMoney(totalMoney1);
}

function valueToHtml(value) {
    if (value == 0) {
        return '';
    }
    var value = String(value);
    var len = value.length;
    var valueHtml = '';
    if (value.indexOf('-') == -1) {
        for (i = 0; i < len; i++) {
            valueHtml += '<i>' + value.charAt(i) + '</i>';
        }
    } else {
        for (i = 1; i < len; i++) {
            valueHtml += '<i class="red">' + value.charAt(i) + '</i>';
        }
    }
    return valueHtml;
}

function calculate_2() {
    var len = $('#voucher_tbody').children().length;
    var totalMoney2 = 0;
    for (var i = 0; i < len; i++) {
        var curValue = $("#voucher_tbody").children().eq(i).find('.creditMoney').val().trim();
        var value = curValue == "" ? 0 : curValue;
        var number = Math.round(parseFloat(value) * 100);
        totalMoney2 += number;
    }
    var totalMoney = Stringify(totalMoney2);
    var valueHtml = valueToHtml(totalMoney);
    $('#totalMoney2').html(valueHtml + '<input type="hidden" class="totalMoney2" value="' + totalMoney + '" />');
    showZhMoney(totalMoney2);
}

function Stringify(str) {
    var value = Number(str);
    if (value >= 10 && value < 100) {
        return '0' + String(value)
    } else if (value < 10 && value > 0) {
        return '00' + String(value)
    } else {
        return fixNum(value, 0);
    }
}

/*------------- 初始化辅助类型 -------------*/
function initAuxiliaryType() {
    $.ajax({
        url: ip_url+"gl/auxiliaryType/get",
        async: false,
        data: JSON.stringify({
            bookId: uuid
        }),
        dataType: "json",
        type: "post",
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            if (res != null) {
                auxiliaryType = res.data;
                initAuxiliaryData(auxiliaryType);
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

function initAuxiliaryData(arr) {
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        $.ajax({
            url: ip_url+item.serviceDataUrl + "/list",
            dataType: "json",
            type: "post",
            data: JSON.stringify({
                bookId: uuid
            }),
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                var key = item.serviceDataUrl.split('/')[1];
                allAuxiliaryData[key] = res;
            },
           	error: function() {
                logout_login("请重新登录");
            }
        });
    }
}
/*---------------科目树弹窗-------------*/
function initCourseTree() {
    var setting = {
        check: {enable: false},
        data: {simpleData: {enable: true}},
        view: {showIcon: false},
        callback: {
            onClick: function(event, treeId, treeNode) {
                curTreeNode = treeNode;
                $('.coaAdd').show();$('#glCoaTree').height(360);
                getNewCoaCode(curTreeNode.coaCode, curTreeNode.coaLevel, curTreeNode.coaStartCode);
            }
        }
    };
    $.fn.zTree.init($("#glCoaTree"), setting, coaList);
}

function getNewCoaCode(coaCode, coaLevel, coaStartCode) {
    var glCoaCodeParm = {
        coaCode: coaCode,
        coaLevel: coaLevel,
        bookId: sessionStorage.uuid,
        codingRule: userInfo.glBookEntity.codingRule,
        coaStartCode: coaStartCode
    };
    $.ajax({
        url: ip_url+"gl/coa/getGlCoaCode",
        dataType: "json", 
        type: "post",
        async: false,
        data: JSON.stringify(glCoaCodeParm),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            $("input[name=coaCode]").val(res.data).attr('readonly', false);
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

function addChildCoa() {
    if(curCoaObj.attr('data-id') == curTreeNode.id){
        curCoaObj.attr('data-id','');
        curCoaObj.attr('data-array','');
        curCoaObj.val('').show();
        curCoaObj.siblings('.dtc').remove();
    }
    if($("input[name=coaName]").val().trim()==""){
        layer.msg('科目名称不能为空！');return;
    }
    var data = {
        "coaLevel": parseInt(curTreeNode.coaLevel) + 1,
        "leaf": 1,
        "ver": "0",
        "isDisable": "0",
        "coaHierarchyId": curTreeNode.coaHierarchyId,
        "unchageableFlag": curTreeNode.unchageableFlag,
        "coaIndustryId": curTreeNode.coaHierarchyId,
        "dispName": curTreeNode.dispName,
        "noAuxiliary": curTreeNode.noAuxiliary,
        "parentId": curTreeNode.id,
        "coaClassId": curTreeNode.coaClassId,
        "crDr": curTreeNode.crDr,
        "cashFlowFlag": curTreeNode.cashFlowFlag,
        "ctrlNet": curTreeNode.ctrlNet,
        "ctrlBalance": curTreeNode.ctrlBalance,
        "coaCode": $("input[name=coaCode]").val().trim(),
        "coaName": $("input[name=coaName]").val().trim(),
        "bookId": sessionStorage.uuid,
        "id": ''
    };
    if(curTreeNode.leaf == 1){
        data.isForceAddChild = "1";data.unchageableFlag = curTreeNode.unchageableFlag;
    }else{
        data.isForceAddChild = "0";data.unchageableFlag = '0';
    }
    loading();
    $.ajax({
        url: ip_url+"gl/coa/save",
        dataType: "json",
        type: "post",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            closeLoading();
            if (res.errorCode == '0') {
                layer.msg("子科目添加完成！", {icon: 1});
                $(".coaAdd input").val("");
                getCoaList();
                initCoaSelect();
            } else {
                layer.msg(res.data, {icon: 5});
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

/** ************初始化凭证字************* */
function initCatogeryType() {
    var typeHtml = '';
    for (var i = 0; i < catogery.length; i++) {
        typeHtml += '<option value="' + catogery[i].id + '">' + catogery[i].catogeryName + '</option>';
    }
    $('#catogeryName').html(typeHtml);
}
// 初始化凭证日期
function initVoucherTime(str) {
    $('.dataTime').datepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true
    })
    $('.dataTime').off('changeDate');
    $('.dataTime').on('changeDate', function(e) {
        var curDate = $('.dataTime').val();
        getVocherDate(curDate);// 获取凭证期间
        if (sessionStorage.voucherFlag || sessionStorage.voucherFlag != 2) {
            getCurPeriodId(curDate);// 获取最大凭证号
        }
    });
    if(str){
        $('.dataTime').datepicker('setDate', str);
    }else{
        $.ajax({
            url: ip_url+"gl/voucher/getVoucherMaxDate/" + uuid,
            type: "post",
            dataType: "json",
            data: {},
            contentType: "application/json; charset=utf-8",
            success: function(res) {
                if (res.success) {
                    if (res.data != null) {
                        $('.dataTime').datepicker('setDate',res.data);
                        getVocherDate(res.data);
                    }
                }
            },
           	error: function() {
                logout_login("请重新登录");
            }
        });
    }
}

// 初始化凭证日期(结账时)
function initVoucherTime1(str) {
    $('.dataTime').datepicker({
        language: 'zh-CN',
        autoclose: true,
        format: 'yyyy-mm-dd',
        todayHighlight: true
    })
    $('.dataTime').off('changeDate');
    $('.dataTime').on('changeDate', function(e) {
        var curDate = $('.dataTime').val();
        getVocherDate(curDate);// 获取凭证期间
        getCurPeriodId(curDate);// 获取最大凭证号
    });
    var firstMonthDay = getFirstMonthDay(str.split('-')[0], str.split('-')[1]);
    $('.dataTime').datepicker('setStartDate', firstMonthDay);
    $('.dataTime').datepicker('setEndDate', str);
    $('.dataTime').datepicker('setDate', str);
}

// 根据当前日期获得会计期间
function getVocherDate(curPeriod) {
    $.ajax({
        url: ip_url+"gl/period/getGlPeriodByCenterDate",
        dataType: "json",
        type: "POST",
        data: JSON.stringify({centerDate: curPeriod,bookId: uuid}),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            $('#Period').html(res.periodName);
            curMonth = res.periodCode.split('-')[1];
            curPeriod = res.id;
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}
// 获取当前日期所在期间的id
function getCurPeriodId(date) {
    var requestdata = {
        periodCode1: date.substring(0, 5) + "01",periodCode2: date.substring(0, 5) + "12",bookId: uuid
    };
    $.ajax({
        url: ip_url+"gl/period/getGlPeriodByPeriodCode",
        dataType: "json",
        type: "POST",
        data: JSON.stringify(requestdata),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            if (data && data.length > 0) {
                curPeriodValue = getPeriodIdByCode(data,date.substring(0,7));
                getVoucherSeq(curPeriodValue);
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}
 
// 通过期间code找到期间id
function getPeriodIdByCode(arr,code) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].periodCode == code) {
            return arr[i].id;
        }
    }
}

// -------获取当前最新凭证号---------
function getVoucherSeq(periodId) {
    if (sessionStorage.voucherFlag == 1 || sessionStorage.voucherFlag == 2 || sessionStorage.voucherFlag == 3||sessionStorage.voucherFlag==8) {return;}
    if (!periodId) {return;}
    $.ajax({
        url: ip_url+"gl/voucher/getMaxVoucherSeq",
        type: "post",
        dataType: "json",
        data: JSON.stringify({periodId: periodId,catogeryId: $('#catogeryName').val()}),
        contentType: "application/json; charset=utf-8",
        success: function(res) {
            if (res.success) {
                if (res.data != null) {
                    $("#catogeryNumber").html(formatThis(res.data));
                } else {
                    $("#catogeryNumber").html(formatThis(1));
                }
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

// -----获取会计科目列表------
function getCoaList(callback) {
    newCoaList = [];
    $.ajax({
        url: ip_url+"gl/coa/treeData",
        dataType: "json",
        type: "post",
        async: true,
        data: JSON.stringify({
            bookId: uuid
        }),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            coaList = data;
            for (var i = 0; i < coaList.length; i++) {
                if (coaList[i].isLeaf == 1) {
                    newCoaList.push({
                        title: coaList[i].name,
                        id: coaList[i].id,
                        isAuxiliary: coaList[i].isAuxiliary,
                        isCurrency: coaList[i].isCurrency,
                        isQuantity: coaList[i].isQuantity,
                        auxiliary: coaList[i].auxiliary,
                        uom: coaList[i].uom,
                        currencyId: coaList[i].currencyId,
                        exchangerate:coaList[i].exchangerate
                    });
                }
            }
            if (callback) {
                callback();
            }
        },
       	error: function() {
            logout_login("请重新登录");
        }
    });
}

function initCoaSelect() {
    initDropCoaList();
    initCourseTree();
}

// ---------判断下拉框是否全部选择了------
function isSelectNull(obj) {
    var cbs = obj.children('div');
    var b = false;
    for (var i = 0; i < cbs.length; i++) {
        if (!cbs.eq(i).hasClass('uhide') && cbs.eq(i).find('select').val() == "") {
            b = true;
            return true;
        }
    }
    if (!b) { return false;}
}

// ---------保存会计科目选择---------
function saveThisCoa() {
    var zTree = $.fn.zTree.getZTreeObj("glCoaTree");
    var srcNode = zTree.getSelectedNodes();
    if (srcNode.length == 0) {
        layer.msg('请先选择一个科目！', { icon: 5 }); return;
    }
    var isNode = srcNode[0];
    if (isNode.isLeaf==0) {
        layer.msg('请选择最末级科目！', { icon: 5 }); return;
    }
    var selectValue = $('.curSelectedNode').attr('title');
    curCoaObj.val(selectValue);
    if(curCoaObj.next().hasClass('dtc')){
        curCoaObj.hide().next().html('<p>' + selectValue + '</p>');
    }else{
        curCoaObj.hide().after('<div class="dtc" onclick="textClick(this)"><p>' + selectValue + '</p></div>');
    }
    curIsAuxiliary = curTreeNode.isAuxiliary;
    curIsQuantity = curTreeNode.isQuantity;
    curIsCurrency = curTreeNode.isCurrency;
    curCoaObj.attr('data-id', curTreeNode.id);
    curCoaObj.attr('data-array', [curTreeNode.isAuxiliary, curTreeNode.isQuantity, curTreeNode.isCurrency]);
    $('#myModal2').modal('hide');$('.coaAdd').hide();
    if (curTreeNode.isAuxiliary == 1) {
        initAuxiliaryShow("", "", curTreeNode);
        return;
    }
    if (curTreeNode.isQuantity == 1) { showQuantityBox();}
    if (curTreeNode.isCurrency == 1) { showCurrencyBox();}
}

function nullKeySwitch() {
    $(".input_bg").unbind("keydown");
    $('.input_bg').keydown(function(e) {
        if (e.keyCode == 32) {
            if ($(this).hasClass('debiteMoney')) {
                var thisValue = $(this).val();
                $(this).parent().next().find('.input_bg').val(thisValue).focus();
                $(this).val("").siblings('div').html('');
                calculate1();
            } else {
                var thisValue = $(this).val();
                $(this).val("").siblings('div').html('');
                $(this).parent().prev().find('.input_bg').val(thisValue).focus();
                calculate2();
            }
        }
    });
}

function textClick(obj) {
    var thisValue = $(obj).siblings('input').val();
    $(obj).css("display","none").siblings('input').show();
    $(obj).siblings('input').val(thisValue);
    $(obj).siblings('input').get(0).select();
    $(obj).css("display","none").siblings('input').trigger('mouseup');
    $(obj).siblings('span').hide();
}

function showCoaText(obj) {
    if($(obj).val().trim()==""){return};
    if($(obj).next().hasClass('dtc')){
        $(obj).hide().siblings('.dtc').html('<p>' + $(obj).val() + '</p>').show();
    }else{
        $(obj).hide().after('<div class="dtc" onclick="textClick(this)"><p>' + $(obj).val() + '</p></div>');
    }
    $(obj).siblings('span').show();
}