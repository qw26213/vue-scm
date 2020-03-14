var voucherModelTable, templetTypeList;
function showModelBox() {
	$('#saveFromModelBox')[0].reset();
	$('#toModelBox').modal('show');
}
function showModel() {
	$('#saveToModelBox')[0].reset();
	$('#saveToModelBox input[type=hidden]').val('');
	$('#fromModelBox').modal('show');
}
function initTempletTypeList() {
	$.ajax({
		url: ip_url+"gl/templetType/list",
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		async : false,
		success : function(data) {
			if (data != null && data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					data[i].text = data[i].templetTypeName;
				}
			}
			templetTypeList = data;
			selectInitIndex('templetType1', data);
			selectInitIndex('templetType2', data);
		},
		error : function() {
			logout_login("请重新登录");
		}
	});
}

function getVoucherModel() {
	voucherModelTable = $("#templetTable").dataTable({
		bSort : false,
		bFilter : false,
		lengthChange : false,
		iDisplayLength : 10,
		serverSide : true,
		oLanguage : {
			sProcessing : "正在获取数据，请稍后...",
			sZeroRecords : "无数据!",
			sInfo : "共 _TOTAL_ 条",
			sInfoEmpty : "记录数为0",
			sInfoFiltered : "(全部记录数 _MAX_ 条)",
			sInfoPostFix : "",
			sSearch : "搜索",
			oPaginate : {
				sFirst : "第一页",
				sPrevious : "上一页",
				sNext : "下一页",
				sLast : "最后一页"
			}
		},
		sAjaxSource : ip_url+"gl/templetHeader/page",
		fnServerData : function(sSource, aDataSet, fnCallback) {
			var reqMap = {};
			var templetType = $("#templetType2").val();
			if (templetType != "-1") {
				reqMap.templetType = templetType;
			}
			aDataSet = getResDataSet(aDataSet, reqMap, null);
			$.ajax({
				url : sSource,
				type : "post",
				dataType : 'json',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(aDataSet),
				success : function(data) {
					successCallback(data, aDataSet, fnCallback);
				},
				error : function() {
					logout_login("请重新登录");
				}
			});
		},
		"aoColumns" : [ {
			"mData" : "templetType",
			"sTitle" : "模板类型",
			"mRender" : function(data, type, full) {
				return getTypeNameById(data);
			}
		}, {
			"mData" : "templetName",
			"sTitle" : "模板名称"
		}, {
			"mData" : "id",
			"sTitle" : "<center>操作</center>",
			"mRender" : function(data, type, full) {
				return '<center><button class="btn btn-xs btn-default" title="选择" onclick="getThisTemplet(\'' + data + '\')">选择</button></center>';
			}
		} ],
		fnDrawCallback : function(oSettings) {
		}
	});
}

function getTypeNameById(id) {
	for (var i = 0; i < templetTypeList.length; i++) {
		if (templetTypeList[i].id == id) {
			return templetTypeList[i].templetTypeName;
		}
	}
	return id;
}

function refreshTempletTable() {
	voucherModelTable.fnDestroy();
	getVoucherModel();
}

function getThisTemplet(templetId) {
	$.ajax({
		url: ip_url+"gl/templet/customGetTempletById/" + templetId,
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			if (res.success) {
				if (res.data.popup == 1) {
					getAuxiliaryItem(res.data.auxLine);
					initMyVoucherTemplet(res.data);
				}
				if (res.data.popup == 0) {
					initMyVoucherTemplet(res.data);
				}
				$('#fromModelBox').modal('hide');
			} else {
				layer.alert("获取该凭证模板失败，稍后再试！");
			}
		},
		error : function() {
			logout_login("请重新登录");
		}
	});
}

// -------检验select是否被选择了-------
function IsAllSelect() {
	var flag = true;
	$('#auxiliaryTable select').each(function() {
		if ($(this).val() == "") {
			flag = false;
			return false;
		}
	})
	if (flag) {
		return true;
	}
}

function saveSelectedAuxiliary() {
	if (!IsAllSelect()) {
		layer.msg('辅助核算项全部都要选择！', {
			icon : 5
		});
		return;
	}
	var len = $('#auxiliaryTable tbody').children().length;
	selectauxiliaryObj = [];
	for (var i = 0; i < len; i++) {
		var auxiliaryObj = {};
		var len1 = $('#auxiliaryTable tbody').children().eq(i).find('.right').children('div').length;
		if (len1 > 0) {
			var auxiliaryCode = [];
			var auxiliaryName = [];
			for (var j = 0; j < len1; j++) {
				var auxiliaryItem = $('#auxiliaryTable tbody').children().eq(i).find('.right').children('div').eq(j);
				var auxiliarytype = auxiliaryItem.find('select').attr('data-id').split('_')[0];
				auxiliaryObj[auxiliarytype] = auxiliaryItem.find('select').val();
				if (auxiliaryItem.html().indexOf('item_select') > 0) {
					var itemId = auxiliaryItem.find('select').val();
					auxiliaryObj.uom = getItemUomById(itemId);
				}
				auxiliaryObj[auxiliarytype + '_type_id'] = auxiliaryItem.find('label').attr('id');
				var eleIndex = getindexOf(auxiliaryNameArray, auxiliarytype);
				auxiliaryCode.push(hexCas[eleIndex] + auxiliaryItem.find('select').find("option:selected").attr('data-code'));
				auxiliaryName.push(auxiliaryItem.find('select').find("option:selected").text());
			}
			auxiliaryObj.auxiliaryName = auxiliaryName.join('_');
			auxiliaryObj.auxiliaryCode = auxiliaryCode.join('_');
			selectauxiliaryObj.push(auxiliaryObj);
		} else {
			selectauxiliaryObj.push({});
		}
	}
	if (len < 4) {
		for (var i = len; i <= 4; i++) {
			selectauxiliaryObj.push({});
		}
	}
	for (var i = 0; i < len; i++) {
		var longNameArray = [];
		var coaName = $('#auxiliaryTable tbody').children().eq(i).find('.coaName').html();
		if (selectauxiliaryObj[i].auxiliaryCode) {
//			var longName = coaName.split(' ')[0] + '_' + selectauxiliaryObj[i].auxiliaryCode + " " + coaName.split(' ')[1] + '_' + selectauxiliaryObj[i].auxiliaryName;
			var longName = coaName.split(' ')[0] + " " + coaName.split(' ')[1] + '_' + selectauxiliaryObj[i].auxiliaryName;
		} else {
			var longName = coaName;
		}
		var curCoaObj = $('#voucher_tbody').children().eq(i).find(".course");
		if (selectauxiliaryObj[i].uom) {
			curCoaObj.parent().parent().find('.uom').html(selectauxiliaryObj[i].uom);
		}
		if (curCoaObj.next().hasClass('dtc')) {
			curCoaObj.hide().next().html('<p>' + longName + '</p>');
		} else {
			curCoaObj.hide().after('<div class="dtc" onclick="textClick(this)"><p>' + longName + '</p></div>');
		}
	}
	$('#auxiliaryModelBox').modal('hide');
}

function getAuxiliaryItem(arr) {
	var auxiliaryItemHtml = '';
	for (var i = 0; i < arr.length; i++) {
		auxiliaryItemHtml += '<tr><td class="coaName">' + formatCoaId(arr[i].line.coaId) + '</td><td class="right">';
		if (arr[i].line.auxTypes != null) {
			for (var j = 0; j < arr[i].line.auxTypes.length; j++) {
				auxiliaryItemHtml += '<div class="uds"><label class="uds mb0" id="' + arr[i].line.auxTypes[j].id + '">' + arr[i].line.auxTypes[j].auxiliaryTypeName + ':</label>\
                                    <select name="" data-id="'
						+ arr[i].line.auxTypes[j].auxiliaryTypeCode + '_select" class="uds w120 bac h30 br05 mr10"><option value="">请选择</option>';
				for (var k = 0; k < arr[i].line.auxTypes[j].children.length; k++) {
					auxiliaryItemHtml += '<option value="' + arr[i].line.auxTypes[j].children[k].id + '" data-code="' + arr[i].line.auxTypes[j].children[k].modelCode + '">' + arr[i].line.auxTypes[j].children[k].modelName + '</option>'
				}
				auxiliaryItemHtml += '</select></div>';
			}
		} else {
			auxiliaryItemHtml += '<i class="uds h30">无辅助核算</i>';
		}
		auxiliaryItemHtml += '</td></tr>';
	}
	$('#auxiliaryTable tbody').html(auxiliaryItemHtml);
	$('#auxiliaryModelBox').modal('show');
}
