var FS433_reg=/^(http|https|ftp|file){1}:\/\/(([0-9a-zA-Z\-]*\.)*)*(aero|biz|com|coop|edu|eu|gov|info|int|mil|museum|name|net|org|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)(\/){1}.*$/

FS433_Tabs_Obj = {};
FS433_tabs = [];
FS433_currentTab = false;

FS433_Favs_Obj = {};

if( !chrome.tabs ){
	window.location.reload();
}

chrome.tabs.getCurrent(function(tab){ FS433_currentTab = tab; });
updateTabsList = function(){
	chrome.windows.getCurrent(function(windowId){
		chrome.tabs.query( {windowId: windowId.id}, function(tabsList){
			FS433_Tabs_Obj.li = [];
			FS433_Tabs_Obj.ul.innerHTML = '';
			FS433_tabs = tabsList;
			FS433_Tabs_Obj.liKey = {};
			for ( var i = 0; i < FS433_tabs.length; i++ ){
				FS433_Tabs_Obj.li[i] = document.createElement('li');
				if( FS433_tabs[i].selected ){
					FS433_Tabs_Obj.li[i].setAttribute('id', 'fullScreener_ActiveTab');
					FS433_Tabs_Obj.active = i;
					FS433_Tabs_Obj.hover = i;
				}
				FS433_Tabs_Obj.li[i].setAttribute('rel', FS433_tabs[i].id);
				FS433_Tabs_Obj.liKey[ FS433_tabs[i].id ] = {
					id: i,
					li: FS433_Tabs_Obj.li[i],
				}
				// <li><span class="fullScreener_favicon" style="background-image:url(images/icon16.png);"></span> Дзен-мани транзакции</li>
				var span = document.createElement('span');
				span.className = 'fullScreener_favicon';
				if( FS433_tabs[i].favIconUrl ){
					span.style.backgroundImage = 'url('+FS433_tabs[i].favIconUrl+')';
				};
				var title = document.createTextNode(FS433_tabs[i].title);
				
				FS433_Tabs_Obj.li[i].appendChild(span);
				FS433_Tabs_Obj.li[i].appendChild(title);
				
				FS433_Tabs_Obj.ul.appendChild(FS433_Tabs_Obj.li[i]);
			}
			FS433_Tabs_Obj.li[FS433_Tabs_Obj.active].scrollIntoView();
		});
	});
}
toggleFavorites = function(){
	if( FS433_Favs_Obj.div.style.display != 'block' ){
		if( !FS433_Favs_Obj.load ){
			chrome.bookmarks.getTree(function(tree){
				treeList = {};
				treeList.level = function(tree){
					var ul = document.createElement('ul');
					for( var i = 0; i < tree.length; i++ ){
						if( tree[i].children ){
							var li = document.createElement('li');
							var span = document.createElement('span');
							var text = document.createTextNode( tree[i].title );
							li.className = 'category close';
							span.appendChild( text );
							span.className = 'toggler';
							(function(span, li){ 
								span.onclick = function(){
									var className = li.className;
									if( className == 'category close' ){
										li.className = 'category open';
									}else{
										li.className = 'category close';
									}
								}
							})(span, li)
							li.appendChild( span );
							li.appendChild( (function(tree){return treeList.level(tree);})(tree[i].children) );
						}else{
							var li = document.createElement('li');
							var a = document.createElement('a');
							var text = document.createTextNode( tree[i].title );
							a.setAttribute('href', tree[i].url);
							a.appendChild(text);
							li.appendChild(a);
						}
						ul.appendChild( li );
					}
					return ul;
				}
				ul = treeList.level(tree[0].children);
				FS433_Favs_Obj.ul.appendChild(ul);
			});
			FS433_Favs_Obj.load = true;
		}
		FS433_Favs_Obj.div.style.display = 'block';
	}else{
		FS433_Favs_Obj.div.style.display = 'none';
	}
}
hideFavorites = function(){
	FS433_Favs_Obj.div.style.display = 'none';
}
window.onload = function(){
	var newtab = document.getElementById('fullScreener_newtab');
	newtab.onclick = function(){
		chrome.tabs.create({ 'url' :chrome.extension.getURL('newtab.html') });
	}
	/* + back|forward|close|favorites */
	var back = document.getElementById('fullScreener_back');
	var forward = document.getElementById('fullScreener_forward');
	var reload = document.getElementById('fullScreener_reload');
	var close = document.getElementById('fullScreener_closetab');
	FS433_Favs_Obj.button = document.getElementById('fullScreener_favorites');
	FS433_Favs_Obj.div = document.getElementById('fullScreener_Favorites_div');
	FS433_Favs_Obj.ul = document.getElementById('fullScreener_tree');
	var bar = document.getElementById('fullScreener_Bar');
	FS433_Favs_Obj.ul.onclick = function(e){ e.stopPropagation(); }
	bar.onclick = function(e){ e.stopPropagation(); }
	window.onclick = function(){ hideFavorites(); }
	FS433_Favs_Obj.load = false;
	// FS433_Favs_Obj.add = document.getElementById('fullScreener_add_favorites');
	
	if( window.history.length > 1 ){
		back.className = '';
		forward.className = '';
		back.onclick = function(){
			window.history.back();
		}
		forward.onclick = function(){
			window.history.forward();
		}
	}
	reload.onclick = function(){
		window.location.reload();
	}
	close.onclick = function(){
		window.close();
	}
	FS433_Favs_Obj.button.onclick = toggleFavorites;
	/* + back|forward|close|favorites */
	
	var search = document.getElementById('fullScreener_search');
	search.onkeydown = function(e){
		if( e.keyCode == 13 ){
			var value = search.value;
			var vArr = String(value).split(':');
			var protocols = 'http,https,file';
			var protocol = '';
			if( protocols.indexOf( vArr[0] ) == -1 ) protocol = 'http://';
			if( FS433_reg.test( protocol+search.value+'/' ) ){
				chrome.tabs.update(FS433_currentTab.id, {
					url: protocol+search.value
				});
			}else{
				chrome.tabs.update(FS433_currentTab.id, {
					url: 'http://www.google.com/search?q='+encodeURI(search.value)
				});
			}
		}
	}
	var div1 = document.getElementById('fullScreener_Tabs');
	FS433_Tabs_Obj.ul = document.createElement('ul');
	div1.appendChild(FS433_Tabs_Obj.ul);
	FS433_Tabs_Obj.ul.onmouseover = function(e){
		if( e.target.tagName == 'LI' ){
			FS433_Tabs_Obj.li[FS433_Tabs_Obj.hover].className = '';
			var h = parseInt( e.target.getAttribute('rel') );
			FS433_Tabs_Obj.hover = FS433_Tabs_Obj.liKey[ h ].id;
			FS433_Tabs_Obj.li[FS433_Tabs_Obj.hover].className = 'fullScreener_hover';
		}
	}
	FS433_Tabs_Obj.ul.onmouseout = function(e){
		if( e.target.tagName == 'LI' ){
			FS433_Tabs_Obj.li[FS433_Tabs_Obj.hover].className = '';
			//FS433_Tabs_Obj.li[FS433_Tabs_Obj.active].className = 'fullScreener_hover';
			FS433_Tabs_Obj.hover = FS433_Tabs_Obj.active;
		}
	}
	FS433_Tabs_Obj.ul.onclick = function(e){
		if( e.target.tagName == 'LI' ){
			chrome.tabs.update( FS433_tabs[ FS433_Tabs_Obj.hover ].id, {selected: true} );
		}
	}
	updateTabsList();
}
window.onfocus = function(){
	updateTabsList();
}