console.log("[雷学委浏览器插件] load extension")
var id = new Date().getTime()
id = "id_" + id
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('[雷学委浏览器插件] storage-changes:', changes);
  console.log('[雷学委浏览器插件] storage-namespace:', namespace);
})
function renderItems() {
  try {
    var storage = localStorage || window.localStorage
    //console.log('[雷学委浏览器插件] storage:', storage)
    var friendItems = storage.getItem('cblog_friends')
    if (!friendItems) {
      return ''
    }
    var friends = JSON.parse(friendItems)
    //console.log('[雷学委浏览器插件] frields:', friends)
    liItems = ''
    counter = 0
    for (i = 0; i < friends.length; i++) {
      lid = id + counter
      name = friends[i]
      liItems += "<li id='friend" + name + "' ><a ondblclick='document.execCommand(\"copy\");'>" + name + "</a></li>"
      counter++
      if (counter >= 4000)
        break
    }

    return liItems
  } catch (e) {
    return ''
  }
}
document.onkeydown = function(event) {
  var e = event || window.event;
  if (e.shiftKey && e.keyCode == 13) {
    //console.log('[雷学委浏览器插件] shift + enter')
    var input = document.getElementById(id + 'input')
    //console.log('[雷学委浏览器插件] input value:', input.value)
    var newId = input.value
    input.value = ''
    if (newId) {
      storage = localStorage || window.localStorage
      friends = storage.getItem('cblog_friends')
      friends = friends || '[]'
      friendIds = JSON.parse(friends)
      //console.log('[雷学委浏览器插件] friendsIds : ', friendIds)
      var index = friendIds.indexOf(newId)
      if (index == -1) {
        alert("该用户ID不存在好友列表！")
        if (newId == '*') {
          storage.setItem('cblog_friends', JSON.stringify([]))
          var friends_ul = document.getElementById('_lxw_blogger_items')
          var child = friends_ul.lastElementChild;
          while (child) {
            friends_ul.removeChild(child);
            child = friends_ul.lastElementChild;
          }
          var liItem = document.createElement('li')
          var inputItem = document.createElement('input')
          inputItem.setAttribute('id', id + 'input')
          inputItem.setAttribute('type', 'text')
          inputItem.setAttribute('style', 'display:none')
          liItem.appendChild(inputItem)
          friends_ul.appendChild(liItem)
        }
      } else {
        //delete friendIds[index]
        new_friends = []
        for (i = 0; i < friendIds.length; i++) {
          if (i != index) {
            new_friends.push(friendIds[i])
          }
        }
        storage.setItem('cblog_friends', JSON.stringify(new_friends))
        var item = document.getElementById('friend' + newId)
        if (item) {
          item.remove()
          alert("删除好友成功！")
        }
      }
    }
  } else if (e && e.keyCode == 13) { //回车键的键值为13
    //console.log('[雷学委浏览器插件] 输入回车')
    var input = document.getElementById(id + 'input')
    //console.log('[雷学委浏览器插件] input value:', input.value)
    var newId = input.value
    input.value = ''
    if (newId) {
      storage = localStorage || window.localStorage
      friends = storage.getItem('cblog_friends')
      friends = friends || '[]'
      friendIds = JSON.parse(friends)
      // console.log('[雷学委浏览器插件] friendsIds : ', friendIds)
      var index = friendIds.indexOf(newId)
      if (index == -1) {
        friendIds.push(newId)
        storage.setItem('cblog_friends', JSON.stringify(friendIds))
        //console.log('添加好友')
        var friends_ul = document.getElementById('_lxw_blogger_items')
        var node = document.createElement('li')
        var linkNode = document.createElement('a')
        node.setAttribute('ondblclick', 'document.execCommand(\"copy\");')
        node.setAttribute('id', 'friend' + newId);
        linkNode.innerHTML = newId
        node.appendChild(linkNode);
        //console.log('新好友:', newId)
        friends_ul.appendChild(node)
      } else {
        console.log('[雷学委浏览器插件] 已存在好友id', newId)
      }
    }
  }
};

function createDiv() {
  try {
    console.log('[雷学委浏览器插件] create floating panel')
    var panel = document.createElement("div")
    panel.setAttribute("id", "_lxw_blogger")
    panel.setAttribute("style", "z-index: 9999; position: fixed ! important; right: 0px; top: 100px; width:120px; min-height:60px;background-color:skyblue;")
    panel.innerHTML = ""
    hiddenButton = '<span onclick="document.getElementById(\'' + id + 'input\').setAttribute(\'style\',\'display:none\')">[Hide]</span>'
    items = renderItems()
    goback = '<li><a href="javascript:history.back(-1)">&lt;&lt;----</a></li>'
    buttonGroup = '<div class="xw_btggroup"><span onclick="document.getElementById(\'' + id + 'input\').setAttribute(\'style\',\'display:block\')"  ondblclick="document.getElementById(\'' + id + 'input\').setAttribute(\'style\',\'display:none\')" >[Edit Toggle]</span>&nbsp;&nbsp;<span onclick=\'document.getElementById("_lxw_blogger").setAttribute("style","display:none;");\'>[ X ]</span>&nbsp;&nbsp;</div>'
    table = '<div id=' + id + ' class="floatlbbanner" >' + '<ul id="_lxw_blogger_items" class="lev_xw_table" with=100% style="position: absolute; width:100%; right: 0px; top: 0px;">' + '<li><input id="' + id + 'input" type="text" style="display:none" /></li>' + items +
    // buttonGroup +
    '</ul><div class="tooltips">::点击Edit输入ID<br/>按回车:添加<br/>Shift+回车:删除' + buttonGroup + '</div>'
    table += "<style>.floatlbbanner{overflow:hidden;height:200px;} .lev_xw_table{overflow-x:hidden;overflow-y:auto;height:100%;} .lev_xw_table li{list-style-type:none}.lev_xw_table li a{display:block; border-radius:0px; color:#fff;font-size:14px; padding:0.5em 0.5rem;width:100%; background-color:#007fff;text-decoration:none;} .lev_xw_table li a:hover{color:#fff;} .tooltips{position:absolute;width:100%;overflow:hidden;bottom:0;background:#e9ab89;color:#fff;} .xw_btggroup{background:#f18681}</style></div>"
    panel.innerHTML = table

    document.body.appendChild(panel)
    //new Notification("Testing ")
  } catch (e) {
    console.error(e)
  }
}

function checkUrl() {
  var url = window.location.href
  if (url.includes("csdn")) {
    console.log("[雷学委浏览器插件] 您正在访问csdn");
  } else if (url.includes("baidu")) {
    console.log("[雷学委浏览器插件] 您正在访问百度!");
  }
}

checkUrl();
//createFrame()
createDiv()
console.log("[雷学委浏览器插件] done checking")
