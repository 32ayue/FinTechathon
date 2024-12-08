// //-------------------- 右键菜单演示 ------------------------//
//
// chrome.contextMenus.create({
// 	title: "反馈检测结果有误",
// 	onclick: function(){
// 		chrome.notifications.create(null, {
// 			type: 'basic',
// 			iconUrl: 'img/icon5.png',
// 			title: '智盾-Dream Weavers团队',
// 			message: '反馈已提交，谢谢！'
// 		});
// 	}
// });
// chrome.contextMenus.create({
// 	title: '使用度娘搜索：%s', // %s表示选中的文字
// 	contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
// 	onclick: function(params)
// 	{
// 		// 注意不能使用location.href，因为location是属于background的window对象
// 		chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
// 	}
// });
//
// // chrome.action.onClicked.addListener(async (tab) => {
// // 	// Retrieve the action badge to check if the extension is 'ON' or 'OFF'
// // 	const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
// // 	// Next state will always be the opposite
// // 	const nextState = prevState === 'ON' ? 'OFF' : 'ON'
// // 	// const url = window.location.hostname
// // 	// console.log(url)
// // 	// Set the action badge to the next state
// // 	await chrome.action.setBadgeText({
// // 		tabId: tab.id,
// // 	 	text: nextState,
// // 	});
// // 	//   if (nextState === "ON") {
// // 	// 	  // Insert the CSS file when the user turns the extension on
// // 	// 	  await chrome.scripting.insertCSS({
// // 	// 		files: ["focus-mode.css"],
// // 	// 		target: { tabId: tab.id },
// // 	// 	  });
// // 	// 	} else if (nextState === "OFF") {
// // 	// 	  // Remove the CSS file when the user turns the extension off
// // 	// 	  await chrome.scripting.removeCSS({
// // 	// 		files: ["focus-mode.css"],
// // 	// 		target: { tabId: tab.id },
// // 	// 	  });
// // 	// 	}
// // });
//
//
//
//
// //-------------------- badge演示 ------------------------//
// /*(function()
// {
// 	var showBadge = false;
// 	var menuId = chrome.contextMenus.create({
// 		title: '显示图标上的Badge',
// 		type: 'checkbox',
// 		checked: false,
// 		onclick: function() {
// 			if(!showBadge)
// 			{
// 				chrome.browserAction.setBadgeText({text: 'New'});
// 				chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
// 				chrome.contextMenus.update(menuId, {title: '隐藏图标上的Badge', checked: true});
// 			}
// 			else
// 			{
// 				chrome.browserAction.setBadgeText({text: ''});
// 				chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
// 				chrome.contextMenus.update(menuId, {title: '显示图标上的Badge', checked: false});
// 			}
// 			showBadge = !showBadge;
// 		}
// 	});
// })();*/
//
// // 监听来自content-script的消息
//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
// {
// 	console.log('收到来自content-script的消息：');
// 	console.log(request, sender, sendResponse);
// 	sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
// 	if(request.contentScriptQuery == 'fetchUrl'){
// 		fetch(request.url)
// 			.then(response => response.text())
// 			.then(text => sendResponse(text))
// 			.catch(error => '...')
// 		return true;
// 	}
// });
//
// $('#test_cors').click((e) => {
// 	$.get('https://www.baidu.com', function(html){
// 		console.log( html);
// 		alert('跨域调用成功！');
// 	});
// });
//
// $('#get_popup_title').click(e => {
// 	var views = chrome.extension.getViews({type:'popup'});
// 	if(views.length > 0) {
// 		alert(views[0].document.title);
// 	} else {
// 		alert('popup未打开！');
// 	}
// });
//
// // 获取当前选项卡ID
// function getCurrentTabId(callback)
// {
// 	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
// 	{
// 		if(callback) callback(tabs.length ? tabs[0].id: null);
// 	});
// }
//
// // 当前标签打开某个链接
// function openUrlCurrentTab(url)
// {
// 	getCurrentTabId(tabId => {
// 		chrome.tabs.update(tabId, {url: url});
// 	})
// }
//
// // 新标签打开某个链接
// function openUrlNewTab(url)
// {
// 	chrome.tabs.create({url: url});
// 	// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
// 	// 	if (changeInfo.status == 'complete' && tab.active) {
//
// 	// 	  // do your things
// 	// 	  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
// 	// 		if (changeInfo.status == 'complete' && tab.active) {
// 	// 			chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
// 	// 				let url = tabs[0].url;
// 	// 				// Do something with url
// 	// 				alert(url);
// 	// 			});
// 	// 		  // do your things
//
// 	// 		}
// 	// 	  })
// 	// 	}
// 	//   })
//
//
// }
//
// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
// 	if (changeInfo.status == 'complete' && tab.active) {
// 		chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
// 			let url = tabs[0].url;
// 			// Do something with url
// 			// alert(url);
// 			// chrome.runtime.sendMessage({
// 			// 	contentScriptQuery:'fetchUrl',
// 			// 	url: 'http://10.60.187.168:8000/predict'
// 			// })
// 			if(url !== 'http://localhost:7200/404'){
// 				fetch('http://127.0.0.1:8000/results', {method:'POST'
// 				,headers:{ 'Content-Type': 'application/json' }
// 				,body: JSON.stringify({ url: url })}).then(r => r.text()).then(result => {
// 					// Result now contains the response text, do what you want...
// 					// alert(result)
// 					if(result !== '0'){
// 						// chrome.tabs.create({url: 'https://www.baidu.com'});
// 						getCurrentTabId(tabId => {
// 							chrome.tabs.update(tabId, {url: 'http://localhost:7200/404'});
// 						});
// 					}
// 				})
// 			}
// 		});
// 	}
//   })
//
//
//
// // omnibox 演示
// chrome.omnibox.onInputChanged.addListener((text, suggest) => {
// 	console.log('inputChanged: ' + text);
// 	if(!text) return;
// 	if(text == '美女') {
// 		suggest([
// 			{content: '中国' + text, description: '你要找“中国美女”吗？'},
// 			{content: '日本' + text, description: '你要找“日本美女”吗？'},
// 			{content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？'},
// 			{content: '韩国' + text, description: '你要找“韩国美女”吗？'}
// 		]);
// 	}
// 	else if(text == '微博') {
// 		suggest([
// 			{content: '新浪' + text, description: '新浪' + text},
// 			{content: '腾讯' + text, description: '腾讯' + text},
// 			{content: '搜狐' + text, description: '搜索' + text},
// 		]);
// 	}
// 	else {
// 		suggest([
// 			{content: '百度搜索 ' + text, description: '百度搜索 ' + text},
// 			{content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
// 		]);
// 	}
// });
//
// // 当用户接收关键字建议时触发
// chrome.omnibox.onInputEntered.addListener((text) => {
//     console.log('inputEntered: ' + text);
// 	if(!text) return;
// 	var href = '';
//     if(text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
// 	else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
// 	else if(text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
// 	else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
// 	openUrlCurrentTab(href);
// });
//
// // 预留一个方法给popup调用
// function testBackground() {
// 	// alert('你好，我是background！');
// }
//
// // 是否显示图片
// var showImage;
// chrome.storage.sync.get({showImage: true}, function(items) {
// 	showImage = items.showImage;
// });
// // web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
// chrome.webRequest.onBeforeRequest.addListener(details => {
// 	// cancel 表示取消本次请求
// 	if(!showImage && details.type == 'image') return {cancel: true};
// 	// 简单的音视频检测
// 	// 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
// 	if(details.type == 'media') {
// 		chrome.notifications.create(null, {
// 			type: 'basic',
// 			iconUrl: 'img/icon.png',
// 			title: '检测到音视频',
// 			message: '音视频地址：' + details.url,
// 		});
// 	}
// }, {urls: ["<all_urls>"]}, ["blocking"]);
//
//
// importScripts("../lib/browser-polyfill.min.js", "../lib/md5.min.js", "../lib/rc4.js");
// importScripts("bg_common.js", "tools.js", "eapi.js", "eapi_storage.js");
//
// // tabs onUpdate handler
// browser.tabs.onUpdated.addListener(checkDomainStatus);
// browser.downloads.onCreated.addListener(checkDownloadStatus);
//
// async function FindTabId(url) {
//   var tabs = await browser.tabs.query({})
//
//   for (const tab of tabs) {
//     if (SameUrl(tab.url, url) || SameUrl(tab.pendingUrl, url)) {
//       return tab.id;
//     }
//     parsedurl = new URL(tab.url);
//     if (parsedurl.searchParams.get('blocked_url') == url) {
//       return tab.id;
//     }
//   }
//   return -1;
// }
//
// async function checkDownloadStatus(downloadItem) {
//   function OnCancel() {
//     return true;
//   }
//   function OnRemove() {
//     return true;
//   }
//   console.log(downloadItem);
//   var answer = await checkUrl(downloadItem.finalUrl);
//
//   if (answer.redirectUrl) {
//     console.log(`Redirecting download: to ${answer.redirectUrl}`);
//     var id = downloadItem.id;
//     var tabid = await FindTabId(downloadItem.finalUrl);
//     browser.downloads.cancel(id);
//     browser.downloads.removeFile(id);
//     browser.downloads.erase({id: id});
//     updateTabURL(tabid, answer.redirectUrl);
//     if (tabid != -1) {
//       browser.tabs.update(tabid, {active: true});
//     }
//   }
// }
//
// async function interogateExternal(uri) {
//   try {
//     const response = await fetch(uri);
//     if (!response.ok) {
//       throw new Error(`HTTP error: ${response.status}`);
//     }
//     const data = await response.text();
//     return data;
//   }
//   catch (error) {
//     console.error(`Could not get products: ${error}`);
//   }
// }
//
//
// async function checkDomainStatus(tabId, changeInfo, requestDetails) {
//   try {
//     if ( (changeInfo.status !== 'loading') || (requestDetails.url.match(/^chrome/)) ) {
//       return
//     }
//
//     console.log(changeInfo);
//     console.log(requestDetails);
//
//     var answer = await checkUrl(requestDetails.url);
//
//     if (answer.redirectUrl) {
//       updateTabURL(tabId, answer.redirectUrl);
//     }
//
//     console.log(answer);
//     return answer;
//   } catch(error) {
//     console.error(`Failed domain status check: ${error}`);
//   }
// }
//
// async function checkUrl(url) {
//   /*
//       The chain is:
//           . check if extension is on or off
//           . check if domain is excluded
//           . looking up the local cache (which is saved for 15 minutes) ->
//           . requesting the server if nothing was found in local cache ->
//           . presenting results.
//   */
//   try {
//     iconRefresh();
//     checkAvc();
//
//     var blocked_url = url;
//     var hostname = new URL(blocked_url).hostname;
//     var answer = null;
//     var data = null;
//
//     function BlockIt(params){
//       var urlParams = new URLSearchParams();
//
//       urlParams.set('hostname', hostname);
//       urlParams.set('blocked_url', blocked_url);
//
//       for(var param in params) {
//         urlParams.set(param, params[param]);
//       }
//
//       answer = {redirectUrl: `${browser.runtime.getURL('block_page_template.html')}?${urlParams}`};
//     }
//     function AllowIt(){
//       answer = {};
//     }
//
//     async function requestServerForData() {
//       var hostname_array = createHostnameArray(hostname);
//       var hashes_string = getStringOfHashes(hostname_array);
//       var cloudURI = `https://alomar.emsisoft.com/api/v1/url/get/${hashes_string}`;
//       var d = await interogateExternal(cloudURI);
//       if (d) {
//         //save this data to sync cache
//         //  Also check if data is ok to save
//         data = d;
//         saveDataToLocalCache(hostname, data);
//       }
//     }
//
//     function saveDataToLocalCache(hostname, data){
//       let cache_object = getSetting("cache_object");
//       if (cache_object == null) {
//         cache_object = {};
//       }
//
//       cache_object[hostname] = {
//         data: data,
//         timeSaved: new Date().getTime()
//       };
//
//       setSetting("cache_object", cache_object);
//     }
//
//   function NoAnswer() {
//     return answer == null ? true: null;
//   }
//
//   function NoData() {
//     return data == null ? true: null;
//   }
//
//     function ExtensionDisabled() {
//       const state = getSetting("extension_state");
//       return (state && state.toLowerCase() == "off");
//     }
//
//     if (hostname.match(/alomar\.emsisoft\.com$/)) {
//       AllowIt();
//     };
//
//     if (NoAnswer() && ExtensionDisabled()) {
//       AllowIt();
//     };
//
//     // checkExcludedDomainList
//     if (NoAnswer()) {
//       const excluded_domains = getSetting("excluded_domain_list");
//       if (excluded_domains && (excluded_domains.indexOf(hostname) > -1)) {
//         AllowIt();
//       }
//     }
//
//     // checkHostInAvc
//     if (NoAnswer()) {
//       await checkHostInAvc({hostname: hostname},
//         function onBlock(data){
//           BlockIt({"host_rule": data.avcAnswer.host, "content_verdict": data.avcAnswer.type, "product_name": getSetting("server_product")});
//         },
//         AllowIt,   //  onAllow -  doing nothing to allow
//         undefined  //  onUnknown
//       );
//     }
//
//     // checkHostRules
//     if (NoAnswer()) {
//       const host_rules = getSetting("host_rules");
//       if (host_rules) {
//         checkHostRulesForHost(host_rules, {hostname: hostname},
//           function onBlock(data){
//             BlockIt({"host_rule": data.host_rule, "product_name": getSetting("server_product")});
//           },
//           AllowIt,   //  onAllow -  doing nothing to allow
//           undefined  //  onUnknown
//         );
//       }
//     }
//
//     // lookUpLocalCache
//     if (NoAnswer()) {
//       const cache_object = getSetting("cache_object")
//       if (cache_object) {
//         let hostname_object = cache_object[hostname];
//         if (hostname_object){
//           data = hostname_object.data;
//         }
//       }
//     }
//
//     // requestServerForData
//     if (NoAnswer() && NoData()) {
//       await requestServerForData()
//     }
//
//     // processData
//     if (NoAnswer() && data) {
//       data = JSON.parse(data);
//
//       var should_block_url = false;
//
//       for (let match of data.matches) {
//         var cloud_verdict = match.type;
//
//         var decoded = atob(match.regex);
//         var per_url_salt = decoded.slice(0, 8);
//         var encrypted_regex = decoded.slice(8);
//
//         var subdomain = findSubdomainByHash(hostname, match.hash);
//         var key = md5(hostname_salt + per_url_salt + subdomain, null, true);
//         var result = rc4(key, encrypted_regex);
//
//         var should_block_url = result.split("\t").some(function(value) {
//           if (value !== "") {
//             var regex = newRegExp(value, true);
//             return (regex && regex.test(blocked_url));
//           }
//         });
//
//         if (should_block_url === true) {
//           BlockIt({ "cloud_verdict": cloud_verdict});
//           break;
//         };
//       }
//     }
//
//     if (NoAnswer()) {
//       AllowIt();
//     }
//
//   } catch(error) {
//     console.error(`Failed domain status check: ${error}`);
//   }
//
//   return answer;
// }
//
// async function checkHostInAvc(data, onBlock, onAllow, onUnknown) {
//   if (avcActive === true) {
//     var cloudURI = `http://127.0.0.1:42357/checkhost/${data.hostname}`;
//     try {
//       data.avcAnswer = JSON.parse(await interogateExternal(cloudURI));
//       if (data.avcAnswer) {
//         switch (data.avcAnswer.action) {
//           case  'block': onBlock(data); return;
//           case  'allow': onAllow(data); return;
//         }
//       }
//     } catch { eLog(`Failed avc request: ${cloudURI}`) }
//
//     if (onUnknown) {
//       onUnknown(data);
//     }
//   }
// }
//
// async function reloadBlockedIfAllowedNow() {
//   browser.tabs.query({}).then(tabs => {
//
//     for (const tab of tabs) {
//       active_tab_id = tab.id;
//       active_tab_url = tab.url;
//
//       url = new URL(active_tab_url);
//
//       if (url.pathname == "/block_page_template.html") {
//         eLog(`Check to reload tab: ${active_tab_id}, ${active_tab_url}`);
//         blocked_url = new URL(url.searchParams.get('blocked_url'));
//         block_rule = url.searchParams.get('host_rule');
//
//         checkHostInAvc({blocked_url: blocked_url, block_rule: block_rule, hostname: blocked_url.hostname, tabid: active_tab_id},
//           undefined, //  block rule exists
//           doReloadBlocked,
//           function onUnknown(data) { //  no rules
//             if (data && data.block_rule) {//  no rules but blocked by rule
//               doReloadBlocked(data)
//             }
//           }
//         );
//       }
//     }
//   });
// }
//
// //-------------------- 右键菜单演示 ------------------------//
// chrome.contextMenus.create({
//     title: "反馈检测结果有误",
//     onclick: function() {
//         chrome.notifications.create(null, {
//             type: 'basic',
//             iconUrl: 'img/icon5.png',
//             title: '智盾-Dream Weavers团队',
//             message: '反馈已提交，谢谢！'
//         });
//     }
// });
//
// chrome.contextMenus.create({
//     title: '使用度娘搜索：%s', // %s表示选中的文字
//     contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
//     onclick: function(params) {
//         chrome.tabs.create({
//             url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)
//         });
//     }
// });
//
// // 监听来自 content-script 的消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('收到来自content-script的消息：');
//     console.log(request, sender);
//     sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
//
//     if (request.contentScriptQuery == 'fetchUrl') {
//         fetch(request.url)
//             .then(response => response.text())
//             .then(text => sendResponse(text))
//             .catch(error => sendResponse('请求失败'));
//         return true; // 告诉 Chrome 需要异步响应
//     }
// });
//
//

//-------------------- 右键菜单演示 ------------------------//

chrome.contextMenus.create({
    title: "反馈检测结果有误",
    onclick: function() {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon5.png',
            title: '智盾-Dream Weavers团队',
            message: '反馈已提交，谢谢！'
        });
    }
});

chrome.contextMenus.create({
    title: '使用度娘搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params) {
        chrome.tabs.create({
            url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)
        });
    }
});

//-------------------- 消息监听 ------------------------//
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));

    if (request.contentScriptQuery == 'fetchUrl') {
        fetch(request.url)
            .then(response => response.text())
            .then(text => sendResponse(text))
            .catch(error => sendResponse('请求失败'));
        return true; // 保持异步响应
    }
});

// 用 declarativeNetRequest 控制图像是否显示
chrome.storage.sync.get({showImage: true}, function(items) {
    let showImage = items.showImage;

    // 更新规则，控制图像请求的阻止或允许
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],  // 删除旧的规则
        addRules: [{
            id: 1,
            action: showImage ? {type: 'allow'} : {type: 'block'},
            condition: {
                urlFilter: ".*\\.(jpg|jpeg|png|gif|bmp)$",
                resourceTypes: ["image"]
            }
        }]
    });
});

//-------------------- 请求拦截器 ------------------------//
var showImage;
chrome.storage.sync.get({showImage: true}, function(items) {
    showImage = items.showImage;
});

chrome.webRequest.onBeforeRequest.addListener(details => {
    // 如果设置了不显示图像，则取消图像请求
    if (!showImage && details.type == 'image') return { cancel: true };

    // 检测音视频类型并弹出通知
    if (details.type == 'media') {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/icon.png',
            title: '检测到音视频',
            message: '音视频地址：' + details.url,
        });
    }
}, {urls: ["<all_urls>"]}, ["blocking"]);

//-------------------- Tab 相关操作 ------------------------//
// 获取当前选项卡 ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 打开新的标签页
function openUrlNewTab(url) {
    chrome.tabs.create({ url: url });
}

// 获取当前选项卡并更新 URL
function openUrlCurrentTab(url) {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, { url: url });
    });
}

// 监听 tabs 更新
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            let url = tabs[0].url;
            if (url !== 'http://localhost:7200/404') {
                fetch('http://127.0.0.1:8000/results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url })
                })
                    .then(r => r.text())
                    .then(result => {
                        if (result !== '0') {
                            // 进行重定向
                            getCurrentTabId(tabId => {
                                chrome.tabs.update(tabId, { url: 'http://localhost:7200/404' });
                            });
                        }
                    });
            }
        });
    }
});

//-------------------- omnibox 演示 ------------------------//
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    if (!text) return;
    if (text == '美女') {
        suggest([
            { content: '中国' + text, description: '你要找“中国美女”吗？' },
            { content: '日本' + text, description: '你要找“日本美女”吗？' },
            { content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？' },
            { content: '韩国' + text, description: '你要找“韩国美女”吗？' }
        ]);
    } else {
        suggest([
            { content: '百度搜索 ' + text, description: '百度搜索 ' + text },
            { content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text }
        ]);
    }
});

chrome.omnibox.onInputEntered.addListener((text) => {
    let href = '';
    if (text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
    else if (text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
    else if (text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
    else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
    openUrlCurrentTab(href);
});

