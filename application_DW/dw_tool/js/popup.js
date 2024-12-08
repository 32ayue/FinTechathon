$(function() {

	// 加载设置
	var defaultConfig = {color: 'white'}; // 默认配置
	chrome.storage.sync.get(defaultConfig, function(items) {
		document.body.style.backgroundColor = items.color;
	});
	chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
		if (changeInfo.status == 'complete' && tab.active) {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
				let url = tabs[0].url;
				// Do something with url
				// alert(url);
			});	
		  // do your things
	  
		}
	  })
	// 初始化国际化
	$('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));

});

browser.storage.local.get("extension_state").then(function(object) {
	if (object.extension_state && object.extension_state.toLowerCase() == "off") {
		$(stateToggleBtn).attr("src", "./img/toggle_off.png");
	}
});

// 打开后台页
$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});

// 调用后台JS
$('#invoke_background_js').click(e => {
	var bg = chrome.extension.getBackgroundPage();
	bg.testBackground();
});

// 获取后台页标题
$('#get_background_title').click(e => {
	var bg = chrome.extension.getBackgroundPage();
	alert(bg.document.title);
});

// 设置后台页标题
$('#set_background_title').click(e => {
	var title = prompt('请输入background的新标题：', '这是新标题');
	var bg = chrome.extension.getBackgroundPage();
	bg.document.title = title;
	alert('修改成功！');
});

// 自定义窗体大小
$('#custom_window_size').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		var startLeft = 10;
		chrome.windows.update(currentWindow.id, 
		{
			left: startLeft * 10,
			top: 100,
			width: 800,
			height: 600
		});
		var inteval = setInterval(() => {
			if(startLeft >= 40) clearInterval(inteval);
			chrome.windows.update(currentWindow.id, {left: (++startLeft) * 10});
		}, 50);
	});
});

// 最大化窗口
$('#max_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		// state: 可选 'minimized', 'maximized' and 'fullscreen' 
		chrome.windows.update(currentWindow.id, {state: 'maximized'});
	});
});


// 最小化窗口
$('#min_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		// state: 可选 'minimized', 'maximized' and 'fullscreen' 
		chrome.windows.update(currentWindow.id, {state: 'minimized'});
	});
});

// 打开新窗口
$('#open_new_window').click(() => {
	chrome.windows.create({state: 'maximized'});
});

// 关闭全部
$('#close_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		chrome.windows.remove(currentWindow.id);
	});
});

// 新标签打开网页
$('#open_url_new_tab').click(() => {
	chrome.tabs.create({url: 'https://www.baidu.com'});
});

// 当前标签打开网页
$('#open_url_current_tab').click(() => {
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, {url: 'http://www.so.com'});
	});
});

// 获取当前标签ID
$('#get_current_tab_id').click(() => {
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
		let url = tabs[0].url;
		// Do something with url
		alert(url);
	});	
	getCurrentTabId(tabId => {
		alert('当前标签ID：' + tabId);
	});
});

// 高亮tab
$('#highlight_tab').click(() => {
	chrome.tabs.highlight({tabs: 0});
});

// popup主动发消息给content-script
$('#send_message_to_content_script').click(() => {
	sendMessageToContentScript('你好，我是popup！', (response) => {
		if(response) alert('收到来自content-script的回复：'+response);
	});
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});

// popup与content-script建立长连接
$('#connect_to_content_script').click(() => {
	getCurrentTabId((tabId) => {
		var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
		port.postMessage({question: '你是谁啊？'});
		port.onMessage.addListener(function(msg) {
			alert('收到长连接消息：'+msg.answer);
			if(msg.answer && msg.answer.startsWith('我是'))
			{
				port.postMessage({question: '哦，原来是你啊！'});
			}
		});
	});
});

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2()
{
	chrome.windows.getCurrent(function(currentWindow)
	{
		chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs)
		{
			if(callback) callback(tabs.length ? tabs[0].id: null);
		});
	});
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.executeScript(tabId, {code: code});
	});
}


// 演示2种方式操作DOM

// 修改背景色
$('#update_bg_color').click(() => {
	executeScriptToCurrentTab('document.body.style.backgroundColor="red";')
});

// 修改字体大小
$('#update_font_size').click(() => {
	sendMessageToContentScript({cmd:'update_font_size', size: 42}, function(response){});
});

// 显示badge
$('#show_badge').click(() => {
	chrome.browserAction.setBadgeText({text: 'New'});
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
});

// 隐藏badge
$('#hide_badge').click(() => {
	chrome.browserAction.setBadgeText({text: ''});
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
});

// 显示桌面通知
$('#show_notification').click(e => {
	chrome.notifications.create(null, {
		type: 'image',
		iconUrl: 'img/icon.png',
		title: '祝福',
		message: '骚年，祝你圣诞快乐！Merry christmas!',
		imageUrl: 'img/sds.png'
	});
});

$('#check_media').click(e => {
	alert('即将打开一个有视频的网站，届时将自动检测是否存在视频！');
	chrome.tabs.create({url: 'http://www.w3school.com.cn/tiy/t.asp?f=html5_video'});
});


var active_tab_id, active_tab_url, active_tab_hostname;

localize();

/* 

	Extension State

*/

browser.storage.local.get("extension_state").then(function(object) {
	if (object.extension_state && object.extension_state.toLowerCase() == "off") {
		$(stateToggleBtn).attr("src", "./img/toggle_off.png");
	}
});

/*

	Getting info about active tab (if it's excluded or not).

*/

browser.tabs.query({
	active: true,
	currentWindow: true
}).then(function(tabs) {

	active_tab_id = tabs[0].id;
	active_tab_url = tabs[0].url;
	active_tab_hostname = new URL(active_tab_url).hostname;
	whitelisted_schemas = ["about:", "chrome-extension:", "chrome:", "moz-extension:", "opera:", "vivaldi:", "wyciwyg:"];


	if (whitelisted_schemas.some(schema => active_tab_url.startsWith(schema)) || active_tab_hostname == "emsisoft.com" || active_tab_hostname.endsWith(".emsisoft.com")) {
		linksContainer.hidden = true;
	} else {
    linksContainer.hidden = false;

    browser.storage.local.get("reported_sites").then(object => {
      var url_was_reported = (object.reported_sites && object.reported_sites.find(item => item == active_tab_url));
      reportLink.hidden = url_was_reported;
      thanks.hidden = !url_was_reported;
    });
  
    browser.storage.local.get("excluded_domain_list").then(object => {
      var domain_is_excluded = (object.excluded_domain_list && object.excluded_domain_list.find(item => item == active_tab_hostname));
      removeExclusion.hidden = !domain_is_excluded;
    });
  }

});

stateToggleBtn.addEventListener('click', function(e) {
	var src = $(this).attr('src');

	if (src == "./img/toggle_on.png") {
		browser.storage.local.set({
			"extension_state": "off"
		}).then(function() {
			$(stateToggleBtn).attr('src', './img/toggle_off.png');
		});
	} else {
		browser.storage.local.set({
			"extension_state": "on"
		}).then(function() {
			$(stateToggleBtn).attr('src', './img/toggle_on.png');
		});
	}

	iconRefresh();

});

manageExclusionsLink.addEventListener('click', function(e) {
	e.preventDefault();
	browser.runtime.openOptionsPage();
});

reportLink.addEventListener('click', function(e) {
	e.preventDefault();

	$.ajax({
		type: "POST",
		data: JSON.stringify({
			url: active_tab_url,
			type: "malicious"
		}),
		contentType: "application/json",
		url: "https://alomar.emsisoft.com/api/v1/url/report",
		success: function(data) {
			// nothing		
		}
	});
	$('#reportLinkDiv').text(chrome.i18n.getMessage("thanks"));
	addToReported(active_tab_url);
});

removeExclusionLink.addEventListener('click', function(e) {
	e.preventDefault();

	browser.storage.local.get("excluded_domain_list").then(function(object) {

		if (object.excluded_domain_list) {

			var excluded_domain_list = object.excluded_domain_list;

			excluded_domain_list = excluded_domain_list.filter(item => item != active_tab_hostname);

			browser.storage.local.set({
				"excluded_domain_list": excluded_domain_list
			}).then(function() {
				browser.tabs.reload(active_tab_id);
				location.reload();
			});

		}
	});
});

function addToReported(url) {

    browser.storage.local.get("reported_sites").then(function(object) {
      var reported_sites = [];

      if (object.reported_sites)
          reported_sites = object.reported_sites;

      reported_sites.push(url);

      browser.storage.local.set({
          "reported_sites": reported_sites
      });
    });
}