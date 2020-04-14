/* 新增或修改 */
//var ip_url="/abcd/";
var ip_url = '/drp/';

$(document).ready(function() {
	initDataSource();
});

function register() {
	var myForm = document.registerForm;
	var loginData = [ {
		name : 'orgName',
		requireText : "企业全称不能为空!"
	}, {
		name : 'userAccount',
		requireText : "登录账号不能为空!"
	}, {
		name : 'contactName',
		requireText : "企业联系人不能为空!"
	}, {
		name : 'userName',
		requireText : "登录姓名不能为空!"
	}, {
		name : 'mobile',
		requireText : "手机号不能为空!"
	}, {
		name : 'mail',
		requireText : "邮箱不能为空!"
	}, {
		name : 'password',
		requireText : "密码不能为空!"
	}, {
		name : 'againPassword',
		requireText : "密码不能为空!"
	}, {
		name : 'areaId',
		requireText : "请选择企业所在地!"
	}, {
		name : 'industryId',
		requireText : "请选择行业类别!"
	}, {
		name : 'taxFilingCategoryId',
		requireText : "请选择纳税类型!"
	} ]
	for (var i = 0; i < loginData.length; i++) {
		if (myForm[loginData[i].name].value.trim() == "") {
			layer.alert(loginData[i].requireText);
			return;
		}
	}
	if (!/^\w+$/.test(myForm[loginData[1].name].value.trim())) {
		layer.alert("用户账号格式不正确(字母或数字或下划线),请重新输入!");
		// myForm.userAccount.value="";
		return;
	}
	if (!isLength(myForm[loginData[1].name].value.trim(), 1, 24)) {
		layer.alert('用户账号长度为1-24位,请重新输入!');
		return;
	}
	if (!telCheck(myForm.mobile.value.trim())) {
		layer.alert('手机号格式不正确,请重新输入!');
		myForm.mobile.value = "";
		return;
	}
	if (!emailCheck(myForm.mail.value.trim())) {
		layer.alert('邮箱格式不正确,请重新输入!');
		myForm.mail.value = "";
		return;
	}

	function hasEngAndNum(str) {
		var regex = /^(?=.*?[A-Za-z]+)(?=.*?[0-9]+)(?=.*?).*$/
		return regex.test(str);
	}

	if (!hasEngAndNum(myForm.password.value.trim())) {
		layer.alert('密码必须包含字母和数字!');
		return;
	}
	if (isHasZh(myForm.password.value.trim())) {
		layer.alert('密码不能输入中文!');
		return;
	}
	if (!isLength(myForm.password.value.trim(), 6, 20)) {
		layer.alert('密码长度为6-20位!');
		return;
	}
	if (myForm[loginData[6].name].value.trim() != myForm[loginData[7].name].value.trim()) {
		layer.alert('两次密码输入不一致!');
		return;
	}
	if (!$("input[type=checkbox]").is(':checked')) {
		layer.alert('请仔细阅读并同意《用户服务协议》!');
		return;
	}
	var data = $("#registerForm").formToObj();
	data.industryName = $('#industry').find("option:selected").text();
	$.ajax({
		url : ip_url+"registerSave",
		dataType : "json",
		type : "post",
		async : false,
		data : JSON.stringify(data),
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			if (res.errorCode == "0") {
				if (res.data == null || res.data == "")
					create_login0(res.msg);
				else
					create_login1(res.msg);
			} else {
				layer.alert(res.msg);
			}
		},
		error : function() {
			layer.alert("系统错误!");
		}
	});
}

// ------密码正则校验(中文)------
function isHasZh(str) {
	if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
		return true;
	}
	return false;
}

// ----------密码长度6-20位----------
function isLength(str, min, max) {
	if (max > 0 && str.length > max || min >= 0 && str.length < min) {
		return false;
	}
	return true;
}

// -------初始化3个下拉选择框--------
function initDataSource() {
	$.ajax({
		url : ip_url+"registerLoadParamData",
		async : false,
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			if (res != null && res != '') {
				$("#outerSysId").val(res.outerSysId);
				$("#srcId").val(res.srcId);
				$("#orgSrcId").val(res.orgSrcId);
				$("#userSrcId").val(res.userSrcId);
				$("#orgName").val(res.orgName);
				$("#userAccount").val(res.userAccount);
				$("#contactName").val(res.contactName);
				$("#userName").val(res.userName);
				$("#sign2").val(res.sign2);
				$("#mobile").val(res.mobile);
				$("#mail").val(res.mail);
				$("#taxRegistrationCertificateNo").val(res.taxRegistrationCertificateNo);
			} else {
				$("#outerSysId").val("");
				$("#srcId").val("");
				$("#orgSrcId").val("");
				$("#userSrcId").val("");
				$("#orgName").val("");
				$("#userAccount").val("");
				$("#contactName").val("");
				$("#userName").val("");
				$("#sign2").val("");
				$("#mobile").val("");
				$("#mail").val("");
				$("#taxRegistrationCertificateNo").val("");
			}
		}
	});

	$.ajax({
		url : ip_url+"registerLoadArea",
		async : false,
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			selectInitIndex('area', res)
		}
	});
	$.ajax({
		url : ip_url+"registerLoadIndustry",
		async : false,
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			selectInitIndex('industry', res)
		}
	});
	$.ajax({
		url : ip_url+"registerLoadTaxfilingcategory",
		async : false,
		dataType : "json",
		type : "post",
		contentType : "application/json; charset=utf-8",
		success : function(res) {
			selectInitIndex('taxFilingCategory', res);
		}
	});
}
function create_login0(info) {
	layer.confirm(info, {
//		btn : [ '手动建账', '自动建账' ],
		btn : [ '建账'],
		closeBtn : 0
	}, function() {
		window.location.href = ip_url+"index";
	}
//	, function() {
//		window.location.href  = ip_url+"gl/book/initbook";
//	}
	);
}
function create_login1(info) {
	create_login0(info);
}
//function create_login1(info) {
//	layer.confirm(info, {
//		btn : [ '自动建账', '手动建账' ],
//		closeBtn : 0
//	}, function() {
//		window.location.href = ip_url+"gl/book/initbook";
//	}, function() {
//		window.location.href = ip_url+"index";
//	});
//}
