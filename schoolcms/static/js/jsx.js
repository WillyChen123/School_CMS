const RB=ReactBootstrap;const RMR=ReactMiniRouter;var Alert=RB.Alert;var SC={}
SC.makeURL=function(path,query){var q=[];for(var key in query){q.push(encodeURIComponent(key)+'='+encodeURIComponent(query[key]));}
return path+'?'+(q.join('&'));}
SC.makeOtherArray=function(out,list){var other={};for(var key in list){if(out.indexOf(key)===-1){other[key]=list[key];}}
return other;}
SC.LoginPageMixin={getInitialState:function(){return{ready:false,};},componentDidMount:function(){console.log('IF login');if(!this.props.current_user){RMR.navigate(SC.makeURL('/login',{redirect:1,next:window.location.pathname+window.location.search}));return false;}
this.pageInit(function(){this.setState({ready:true});}.bind(this));},};SC.LoginForm=React.createClass({displayName:'LoginForm',mixins:[React.addons.LinkedStateMixin],getInitialState:function(){return{_xsrf:'',account:'',alert:null,ready:false,};},componentDidMount:function(){var url='/api'+window.location.pathname+window.location.search;this.props.ajax(url,'GET',null,function(json){this.setState({_xsrf:json._xsrf,alert:json.alert,ready:true});}.bind(this));},handleLogin:function(){console.log('handleLogin');if(!this.state.ready)return;var url='/api'+window.location.pathname;var form=new FormData(React.findDOMNode(this.refs.form));this.props.ajax(url,'POST',form,function(json){if(json.success){this.props.getCurrentUser();RMR.navigate(this.props.next);}else{this.setState({alert:json.alert});}}.bind(this));},errorMsg:function(){if(this.state.alert){return(React.createElement(RB.Alert,{dismiss:true,bsStyle:"danger"},React.createElement("strong",null,"登入失敗!")," ",this.state.alert));}},render:function(){return(React.createElement(SC.Form,{ref:"form",onSubmit:this.handleLogin},this.errorMsg(),React.createElement(RB.Input,{type:"hidden",name:"_xsrf",value:this.state._xsrf}),React.createElement(RB.Input,{type:"hidden",name:"next",value:this.props.next}),React.createElement(RB.Input,{type:"text",name:"account",valueLink:this.linkState('account'),placeholder:"帳號"}),React.createElement(RB.Input,{type:"password",name:"passwd",placeholder:"密碼"}),React.createElement("hr",null),React.createElement("div",{className:"btn-group btn-group-justified"},React.createElement("a",{className:"btn btn-danger btn-flat",onClick:function(){window.history.go(this.props.redirect?-2:-1);}.bind(this)},"返回"),React.createElement("a",{className:"btn btn-primary",onClick:this.handleLogin,disabled:!this.state.ready},"登入"))));},});SC.LoginPage=React.createClass({displayName:'LoginPage',componentDidMount:function(){var url='/api'+window.location.pathname+window.location.search;this.props.ajax(url,'GET',null,function(json){this.setState({_xsrf:json._xsrf,alert:json.alert});}.bind(this));},render:function(){return(React.createElement(RB.Grid,null,React.createElement(RB.Col,{xs:12,md:6,mdOffset:3},React.createElement(RB.Well,null,React.createElement("h1",null,"登入"),React.createElement("hr",null),React.createElement(SC.LoginForm,React.__spread({},this.props))))));}});SC.LogoutPage=React.createClass({displayName:'LogoutPage',componentWillMount:function(){var url='/api'+window.location.pathname;this.props.ajax(url,'GET',null,function(json){this.props.onLogout();RMR.navigate('/');}.bind(this));},render:function(){return(React.createElement("div",null));}});SC.AnnIndexPage=React.createClass({displayName:'AnnIndexPage',getInitialState:function(){return{anns:[],total:0,};},ajax:function(){var url='/api'+window.location.pathname+window.location.search;this.props.ajax(url,'GET',null,function(json){this.setState({anns:json.anns,total:json.total});}.bind(this));},componentDidMount:function(){this.ajax();},componentWillReceiveProps:function(nextprops){if(this.props.search!=nextprops.search||this.props.start!=nextprops.start){this.ajax();}},handleSearch:function(search){var url=SC.makeURL(window.location.pathname,{search:search});RMR.navigate(url);},render:function(){var annItems=this.state.anns.map(function(ann){return(React.createElement("tr",{key:ann.id},React.createElement("td",{className:"col-md-8 col-xs-8"},React.createElement("a",{href:'/announce/'+ann.id},ann.title)),React.createElement("td",{className:"col-md-2 col-xs-2"},ann.created.substr(0,10)),React.createElement("td",{className:"col-md-2 col-xs-2"},ann.author_group_name)));});return(React.createElement("div",null,React.createElement(RB.Grid,null,React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:6},React.createElement("h1",null,"Announcement"),React.createElement("a",{href:"/announce/edit"},"New Announcement!"),React.createElement(SC.SearchAnnForm,{search:this.props.search,onSearch:this.handleSearch}))),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:12},React.createElement(SC.Pagination,{path:"/announce",start:this.props.start,total:this.state.total,query:{search:this.props.search}}),React.createElement(RB.Well,null,React.createElement(RB.Table,{striped:true,hover:true,responsive:true},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",null,"標題"),React.createElement("th",null,"公告日期"),React.createElement("th",null,"單位"))),React.createElement("tbody",null,annItems))),React.createElement(SC.Pagination,{path:"/announce",start:this.props.start,total:this.state.total,query:{search:this.props.search}}))))));}});SC.SearchAnnForm=React.createClass({displayName:'SearchAnnForm',mixins:[React.addons.LinkedStateMixin],getInitialState:function(){return{search:this.props.search,};},componentWillReceiveProps:function(nextprops){if(nextprops.search!=this.props.search){this.setState({search:nextprops.search});}},handleSearch:function(){this.props.onSearch(this.state.search);},render:function(){var search_button=(React.createElement(RB.Button,{bsStyle:"primary",className:"btn-flat",onClick:this.handleSearch},"搜尋"));return(React.createElement(SC.Form,{onSubmit:this.handleSearch},React.createElement(RB.Input,{rel:"search",type:"text",name:"search",valueLink:this.linkState('search'),placeholder:"搜尋公告",buttonAfter:search_button})));}})
SC.AnnouncePage=React.createClass({displayName:'AnnouncePage',getInitialState:function(){return{title:'',content:'',author_name:'',author_group_name:'',created:'',updated:'',atts:[],id:'',};},componentDidMount:function(){var url='/api'+window.location.pathname;this.props.ajax(url,'GET',null,function(json){this.setState(json);}.bind(this));},render:function(){return(React.createElement(RB.Grid,null,React.createElement(RB.PageHeader,null,this.state.title,React.createElement("small",null," by ",this.state.author_group_name,"‧",this.state.author_name)),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:12},React.createElement(RB.Well,null,React.createElement("span",{dangerouslySetInnerHTML:{__html:marked(this.state.content,{sanitize:false,breaks:true})}})))),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:6},React.createElement(RB.Well,null,React.createElement("h4",null,"附件"),React.createElement("hr",null),React.createElement(SC.AttachmentPanel,{atts:this.state.atts}))),React.createElement(RB.Col,{xs:12,md:6},React.createElement(RB.Well,null,React.createElement("h4",null,"時間"),React.createElement("hr",null),React.createElement("p",null,"發布於：",this.state.created),React.createElement("p",null,"最後更新：",this.state.updated)))),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:2},React.createElement("a",{className:"btn btn-warning btn-xs btn-block",href:'/announce/edit/'+this.state.id},"編輯")),React.createElement(RB.Col,{xs:12,md:2},React.createElement("a",{className:"btn btn-primary btn-xs btn-block",href:"/announce/"},"返回公告首頁")))));}});{}
SC.AttachmentPanel=React.createClass({displayName:'AttachmentPanel',_icon:['aac','ai','aiff','asp','avi','bmp','c','cpp','css','dat','dmg','doc','docx','dot','dotx','dwg','dxf','eps','exe','flv','gif','h','html','ics','iso','java','jpg','key','m4v','mid','mov','mp3','mp4','mpg','odp','ods','odt','otp','ots','ott','pdf','php','png','pps','ppt','pptx','psd','py','qt','rar','rb','rtf','sql','tga','tgz','tiff','txt','wav','xls','xlsx','xml','yml','zip'],_ms_office:['docx','doc','dot','dotx','xlsx','xlsb','xls','xlsm','pptx','ppsx','ppt','pps','pptm','potm','ppam','potx','ppsm'],openlink:function(att){if(this._ms_office.indexOf(att.filetype)>=0){return React.createElement("a",{target:"_blank",href:'https://view.officeapps.live.com/op/view.aspx?src='+encodeURIComponent(window.location.host+'/file/'+att.path)},"開啟")}else if(att.filetype!=='file'){return React.createElement("a",{target:"_blank",href:'/file/'+att.path},"開啟")}},render:function(){var attItems=this.props.atts.map(function(att){if(this._icon.indexOf(att.filetype)<0){att.filetype='file';}
return(React.createElement("div",{key:att.key,className:"media"},React.createElement("div",{className:"media-left"},React.createElement("img",{src:'/static/icon/'+att.filetype+'.png',alt:att.filetype})),React.createElement("div",{className:"media-body"},React.createElement("div",{className:"media-heading"},att.filename),React.createElement("div",null,this.openlink(att),React.createElement("a",{target:"_blank",href:'/file/'+att.path+'?download=1'},"下載")))));}.bind(this));if(this.props.atts.length){return React.createElement("div",null,attItems);}else{return React.createElement("p",null,"沒有附件");}},});SC.App=React.createClass({displayName:'App',mixins:[RMR.RouterMixin],routes:{'/':'indexHandler','/login':'loginHandler','/logout':'logoutHandler','/announce':'annIndexHandler','/announce/edit':'editAnnHandler','/announce/edit/:ann_id':'editAnnHandler','/announce/:ann_id':'announceHandler','/admin/adduser':'adduserHandler','/admin/group':'groupHandler','/admin/user':'userHandler',},ajax:function(url,method,data,callback){console.log('AJAX TO URL:'+url);var xhr=new XMLHttpRequest();xhr.open(method,url,true);this.setState({loading:15});xhr.onreadystatechange=function(){if(xhr.readyState==4){console.log('AJAX END');if(xhr.status){this.setState({status:xhr.status});}
setTimeout(function(){this.setState({loading:-1});}.bind(this),1000);if(xhr.status==200){callback(JSON.parse(xhr.response));}}}.bind(this);xhr.onprogress=function(e){if(e.lengthComputable){console.log('AJAX:'+e.loaded*100/e.total+'%');this.setState({loading:e.loaded*100/e.total});}}.bind(this);xhr.onerror=function(){this.setState({status:500});};xhr.send(data);},getInitialState:function(){return{loading:-1,status:200,current_user:null,ready:false,};},componentDidMount:function(){this.getCurrentUser();$.material.init();},componentWillUpdate:function(){if(this.state.url!=window.location.pathname+window.location.search){this.setState({url:window.location.pathname+window.location.search,status:200});}},getCurrentUser:function(){this.setState({ready:false});this.ajax('/api','GET',null,function(json){this.setState({current_user:json.current_user,ready:true});}.bind(this));},render:function(){var getPage=function(){if(!this.state.ready){return React.createElement("h1",null,"Wait...");}else if(this.state.status===200){return this.renderCurrentRoute();}else{return React.createElement("h1",null,"Geez, ",this.state.status);}}.bind(this);var progressBar=function(){if(this.state.loading>=0){return(React.createElement(RB.ProgressBar,{now:this.state.loading,className:"progress-bar-material-green-700",style:{position:'fixed',top:'0px',height:'4px',width:'100%',zIndex:100,}}));}}.bind(this);return(React.createElement("div",null,progressBar(),React.createElement(SC.NavbarInstance,{current_user:this.state.current_user,url:this.state.url}),getPage()));},toInt:function(s,df){return parseInt(s)?parseInt(s):df;},indexHandler:function(){return React.createElement(SC.A,{href:"/announce"},"Announce");},loginHandler:function(params){return React.createElement(SC.LoginPage,{ajax:this.ajax,next:params.next,redirect:params.redirect,getCurrentUser:this.getCurrentUser});},logoutHandler:function(){return React.createElement(SC.LogoutPage,{ajax:this.ajax,onLogout:function(){this.setState({current_user:null})}.bind(this)});}, annIndexHandler:function(params){params.start=this.toInt(params.start,0);if(!params.search)params.search='';return React.createElement(SC.AnnIndexPage,{ajax:this.ajax,start:params.start,search:params.search});},announceHandler:function(){return React.createElement(SC.AnnouncePage,{ajax:this.ajax});},editAnnHandler:function(ann_id,params){return React.createElement(SC.EditAnnPage,{ajax:this.ajax,current_user:this.state.current_user});}, userHandler:function(params){params.start=this.toInt(params.start,0);if(!params.search)params.search='';return React.createElement(SC.UserPage,{ajax:this.ajax,start:params.start,search:params.search,current_user:this.state.current_user});}, notFound:function(path){return React.createElement("div",{className:"not-found"},"Page Not Found: ",path);},});SC.Redirect=React.createClass({displayName:'Redirect',componentDidMount:function(){console.log('RB run');RMR.navigate(this.props.url);},render:function(){return(React.createElement("div",null));}});SC.EditAnnPage=React.createClass({displayName:'EditAnnPage',mixins:[React.addons.LinkedStateMixin,SC.LoginPageMixin],getInitialState:function(){return{id:'',title:'',content:'',user_groups:[],is_private:false,tmpatts:[],atts:[],_xsrf:'',submitLock:0,};},pageInit:function(callback){var url='/api'+window.location.pathname;this.props.ajax(url,'GET',null,function(json){this.setState(json);callback();}.bind(this));$.material.init();},handlePost:function(){if(this.state.submitLock)return false;this.lock(1);var url='/api'+window.location.pathname;var data=new FormData(React.findDOMNode(this.refs.form));this.props.ajax(url,'POST',data,function(json){if(json.success){RMR.navigate('/announce/'+json.id);}else{this.setState(json);this.lock(-1);}}.bind(this));},alert:function(msg){this.setState({alert:msg});},lock:function(lock){this.setState({submitLock:this.state.submitLock+lock});},uploadAtt:function(att){var tmpatts=this.state.tmpatts;tmpatts.push(att);this.setState({tmpatts:tmpatts});},render:function(){var getAlert=function(){if(this.state.alert){return(React.createElement(Alert,{bsStyle:"danger",onDismiss:function(){this.setState({alert:null});}.bind(this)},React.createElement("h4",null,"錯誤！"),React.createElement("p",null,this.state.alert)));}}.bind(this);return(React.createElement(RB.Grid,null,React.createElement(RB.PageHeader,null,"編輯公告"),React.createElement(SC.Form,{ref:"form",onSubmit:function(){}},React.createElement(RB.Row,null,React.createElement(RB.Col,{md:12},getAlert())),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:6},React.createElement(RB.Well,null,React.createElement(RB.Input,{type:"hidden",name:"_xsrf",value:this.state._xsrf}),React.createElement(RB.Input,{type:"text",name:"title",valueLink:this.linkState('title'),label:"公告標題",placeholder:"輸入公告標題",disabled:!this.state.ready}),React.createElement(SC.ResizeTextArea,{name:"content",valueLink:this.linkState('content'),label:"公告內容",placeholder:"輸入公告內容",disabled:!this.state.ready}),React.createElement(SC.SelectInput,{name:"group",options:this.state.user_groups,label:"發佈公告群組",placeholder:"選擇發佈公告的群組"}),React.createElement("br",null),React.createElement(SC.ToggleButton,{name:"is_private",checked:this.state.is_private,label:"不公開這篇公告",help:"只有管理員可以瀏覽這篇公告",disabled:!this.state.ready})),React.createElement(RB.Well,null,React.createElement("h4",null,"編輯附件"),React.createElement("hr",null),React.createElement(SC.AttPanel,{atts:this.state.atts,_xsrf:this.state._xsrf,uploaded:true,onChange:function(atts){this.setState({atts:atts})}.bind(this)}),React.createElement(SC.AttPanel,{atts:this.state.tmpatts,_xsrf:this.state._xsrf,onChange:function(atts){this.setState({tmpatts:atts})}.bind(this)}),React.createElement(SC.UploadAttBox,{_xsrf:this.state._xsrf,onUpload:this.uploadAtt,disabled:!this.state.ready,alert:this.alert,lock:this.lock}))),React.createElement(RB.Col,{xs:12,md:6},React.createElement(RB.Well,null,React.createElement("h4",null,"預覽內容"),React.createElement("hr",null),React.createElement("span",{dangerouslySetInnerHTML:{__html:marked(this.state.content,{sanitize:false,breaks:true})}})))),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:2},React.createElement(RB.Button,{bsStyle:"success",bsSize:"xsmall",block:true,disabled:this.state.submitLock>0||this.state.title.length===0,onClick:this.handlePost},"確定")),React.createElement(RB.Col,{xs:12,md:2},React.createElement("a",{className:"btn btn-primary btn-xs btn-block",href:'/announce/'+this.state.id},"返回"))))));}});SC.AttPanel=React.createClass({displayName:'AttPanel',handleDelete:function(att){atts=this.props.atts;atts.splice(atts.indexOf(att),1);this.props.onChange(atts);},render:function(){var atts=this.props.atts.map(function(att){return React.createElement(SC.AttComponent,{key:att.key,att:att,_xsrf:this.props._xsrf,onDelete:this.handleDelete,uploaded:this.props.uploaded})}.bind(this));return(React.createElement("div",null,atts));}});SC.AttComponent=React.createClass({displayName:'AttComponent',deleteAtt:function(){if(!confirm('你確定要刪除 '+this.props.att.filename+' 嗎?'))return;var xhr=new XMLHttpRequest();var form=new FormData();form.append('_xsrf',this.props._xsrf);var path=this.props.uploaded?'/file/':'/fileupload/';path+=this.props.att.key;xhr.open('DELETE',path,true);xhr.onreadystatechange=function(){if(xhr.readyState==4&&xhr.status==200){console.log(xhr.response);this.props.onDelete(this.props.att);}}.bind(this);xhr.send(form);},render:function(){var uploadinput=function(){if(!this.props.uploaded){return React.createElement("input",{type:"hidden",name:"attachment",value:this.props.att.key})}}.bind(this);return(React.createElement(RB.Panel,{key:this.props.key},uploadinput(),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:9,md:9},React.createElement("i",{className:"mdi-action-description"}),React.createElement("span",{className:"hideOverflow"},this.props.att.filename.substring(0,50))),React.createElement(RB.Col,{xs:3,md:3},React.createElement(RB.Button,{onClick:this.deleteAtt,bsStyle:"danger"},"刪除")))));}});SC.UploadAttBox=React.createClass({displayName:'UploadAttBox',getInitialState:function(){return{filelist:{},};},componentWillMount:function(){this.xhr={};},handleChange:function(evt){var file=evt.target.files[0];if(file.size>100000000){this.props.alert('檔案過大，檔案大小上限為100MB');return;}
this.props.lock(1);var form=new FormData();var uuid=new Date().getTime();this.xhr[uuid]=new XMLHttpRequest();var filelist=this.state.filelist;filelist[uuid]={percent:0.0,filename:file.name,};this.setState({filelist:filelist,file:'',});form.append('file',file);form.append('_xsrf',this.props._xsrf);this.xhr[uuid].open('POST','/fileupload',true);this.xhr[uuid].onreadystatechange=function(){if(this.xhr[uuid].readyState==4){if(this.xhr[uuid].status==200){var attfile=JSON.parse(this.xhr[uuid].response);this.props.onUpload({'filename':attfile.file_name,'key':attfile.key,});}else if(this.xhr[uuid].status){this.props.alert('發生錯誤，請重新整理網頁');}}}.bind(this);this.xhr[uuid].onerror=function(e){this.props.alert('發生錯誤，請重新整理網頁');}.bind(this);this.xhr[uuid].upload.onprogress=function(e){if(e.lengthComputable){var filelist=this.state.filelist;filelist[uuid].percent=e.loaded*100/e.total;this.setState({filelist:filelist});}}.bind(this);this.xhr[uuid].onloadend=function(){var filelist=this.state.filelist;delete filelist[uuid];this.setState({filelist:filelist,});this.props.lock(-1);}.bind(this);this.xhr[uuid].send(form);},progressBar:function(uuid){return(React.createElement(RB.Panel,{key:uuid},React.createElement(RB.Row,null,React.createElement(RB.Col,{md:9},React.createElement("i",{className:"mdi-action-description"}),this.state.filelist[uuid].filename.substr(0,50),React.createElement(RB.ProgressBar,{active:true,now:this.state.filelist[uuid].percent,label:"%(percent)s%"})),React.createElement(RB.Col,{md:3},React.createElement(RB.Button,{bsStyle:"danger",onClick:function(){this.xhr[uuid].abort();}.bind(this)},"取消")))))},render:function(){var uploading=[];for(var i in this.state.filelist){uploading.push(this.progressBar(i));}
var uploadButtonStyle={width:'100%',};var uploadInputStyle={display:'none',};var uploadButton=(React.createElement(RB.Button,{disabled:this.props.disabled,style:uploadButtonStyle,className:"btn-material-grey-300 mdi-content-add",onClick:function(){React.findDOMNode(this.refs.file).click()}.bind(this)},React.createElement("input",{style:uploadInputStyle,type:"file",ref:"file",onChange:this.handleChange,disabled:this.props.disabled,value:''})));return(React.createElement("div",null,uploading,uploadButton));}});SC.UserPage=React.createClass({displayName:'UserPage',mixins:[SC.LoginPageMixin,React.addons.LinkedStateMixin],getInitialState:function(){return{users:[],groups:[],total:0,checkAll:false,_xsrf:'',au_account:'',au_passwd:'',au_name:'',au_admin:false,au_alert:'',au_success:false,};},ajax:function(callback){var url='/api'+window.location.pathname+window.location.search;this.props.ajax(url,'GET',null,function(json){this.setState(json);if(callback)callback();}.bind(this));},pageInit:function(callback){this.ajax(function(){callback();$.material.init();});},componentWillReceiveProps:function(nextprops){if(this.props.start!==nextprops.start||this.props.search!==nextprops.search){this.ajax(function(){this.setState({checkAll:false});$.material.init();}.bind(this));}},adduserModal:function(){var handleSubmin=function(){var form=new FormData(React.findDOMNode(this.refs.au_form));this.props.ajax('/api/admin/user','post',form,function(json){if(json.success){this.setState({au_account:'',au_passwd:'',au_name:'',au_alert:'',au_admin:false,au_success:true,});this.ajax(function(){$.material.init();});}else{this.setState({au_alert:json.alert,au_success:false});}}.bind(this));}.bind(this);var successMsg=function(){if(this.state.au_success)return(React.createElement(RB.Alert,{dismiss:true,bsStyle:"success",onDismiss:function(){this.setState({au_success:false})}.bind(this)},React.createElement("strong",null,"新增成功!")," 成功新增一位使用者"));}.bind(this);var errorMsg=function(){if(this.state.au_alert)return(React.createElement(RB.Alert,{dismiss:true,bsStyle:"danger",onDismiss:function(){this.setState({au_alert:false})}.bind(this)},React.createElement("strong",null,"失敗!")," ",this.state.au_alert));}.bind(this);return(React.createElement(RB.Modal,{onRequestHide:function(){},title:React.createElement("span",{style:{fontSize:'25px'}},"新增使用者")},React.createElement("div",{className:"modal-body"},React.createElement(SC.Form,{ref:"au_form",onSubmit:handleSubmin},successMsg(),errorMsg(),React.createElement(RB.Input,{type:"hidden",name:"_xsrf",value:this.state._xsrf}),React.createElement(RB.Input,{type:"text",name:"account",valueLink:this.linkState('au_account'),label:"帳號",placeholder:"帳號"}),React.createElement(RB.Input,{type:"text",name:"passwd",valueLink:this.linkState('au_passwd'),label:"密碼",placeholder:"密碼"}),React.createElement(RB.Input,{type:"text",name:"name",valueLink:this.linkState('au_name'),label:"名稱",placeholder:"名稱"}),React.createElement(SC.SelectInput,{name:"identity",options:['學生','教師'],label:"身份",placeholder:"身份"}),React.createElement("br",null),React.createElement(RB.Input,{type:"checkbox",checked:this.state.au_admin,name:"admin",label:" 系統管理員",onChange:function(){this.setState({au_admin:!this.state.au_admin})}.bind(this)}),React.createElement("hr",null),React.createElement("div",{className:"btn-group btn-group-justified"},React.createElement("a",{className:"btn btn-danger btn-flat",onClick:function(){this.onRequestHide}},"返回"),React.createElement("a",{className:"btn btn-primary",onClick:handleSubmin},"新增")),React.createElement(SC.MaterialInit,null))),React.createElement("div",{className:"modal-footer"},React.createElement("br",null))));},handleCheckAll:function(){var checkstate=!this.state.checkAll;for(var i=0;i<this.state.users.length;i++){this.refs['userItem_'+this.state.users[i].key].setState({check:checkstate});}
this.setState({checkAll:checkstate});},toggleGroup:function(group_name){var have_group=true;var checked_userkey=[];var form=new FormData();form.append('_xsrf',this.state._xsrf);form.append('group',group_name);for(var i=0;i<this.state.users.length;i++){if(this.refs['userItem_'+this.state.users[i].key].state.check){checked_userkey.push(this.state.users[i].key);form.append('userkey',this.state.users[i].key);have_group&=(this.state.users[i].groups.indexOf(group_name)!==-1);}}
if(checked_userkey.length===0){return false;}else if(have_group){this.props.ajax('/api/admin/group','delete',form,function(json){if(json.success){this.ajax(function(){});}}.bind(this));}else{this.props.ajax('/api/admin/group','post',form,function(json){if(json.success){this.ajax(function(){});}}.bind(this));}},render:function(){var userItems=this.state.users.map(function(user){return(React.createElement(SC.UserPageUserItem,{key:user.key,ref:'userItem_'+user.key,user:user}));});return(React.createElement("div",null,React.createElement(RB.Grid,null,React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:6},React.createElement("h1",null,"Users"),React.createElement(RB.ModalTrigger,{modal:this.adduserModal()},React.createElement(RB.Button,{className:"mdi-social-person-add"})),React.createElement(RB.ModalTrigger,{modal:React.createElement(SC.UserPageGroupModal,{groups:this.state.groups,toggleGroup:this.toggleGroup})},React.createElement(RB.Button,{className:"mdi-social-group-add"})))),React.createElement(RB.Row,null,React.createElement(RB.Col,{xs:12,md:12},React.createElement(RB.Well,null,React.createElement(RB.Table,{striped:true,hover:true},React.createElement("thead",null,React.createElement("tr",null,React.createElement("th",{style:{padding:'0 8px 0 8px'}},React.createElement(RB.Input,{type:"checkbox",label:React.createElement("b",null," 使用者帳號"),onChange:this.handleCheckAll,checked:this.state.checkAll})),React.createElement("th",{style:{padding:'0 8px 0 8px',lineHeight:'53px'}},"使用者名稱"),React.createElement("th",{style:{padding:'0 8px 0 8px',lineHeight:'53px'}},"群組"))),React.createElement("tbody",null,userItems))),React.createElement(SC.Pagination,{path:"/admin/user",start:this.props.start,total:this.state.total,query:{search:this.props.search}}))))));}});SC.UserPageUserItem=React.createClass({displayName:'UserPageUserItem',getInitialState:function(){return{'check':false,}},handleCheck:function(){this.setState({check:!this.state.check});},render:function(){return(React.createElement("tr",null,React.createElement("td",{className:"col-md-2"},React.createElement(RB.Input,{checked:this.state.check,type:"checkbox",label:' '+this.props.user.account,onChange:this.handleCheck})),React.createElement("td",{className:"col-md-2"},React.createElement("span",{style:{padding:'0 8px 0 8px',lineHeight:'53px'}},this.props.user.name)),React.createElement("td",{className:"col-md-8"},this.props.user.groups.map(function(group){return(React.createElement(RB.Button,{key:group,className:"btn-material-brown-500",bsSize:"small"},group));}))));}});SC.UserPageGroupModal=React.createClass({displayName:'UserPageGroupModal',addGroup:function(){var group_name=prompt("請輸入群組名稱");if(group_name){this.selectGroup(group_name);}},selectGroup:function(group_name){this.props.onRequestHide();this.props.toggleGroup(group_name);},render:function(){var groupTags=this.props.groups.map(function(group){return(React.createElement(RB.Button,{key:group,className:"btn-material-brown-500",onClick:function(){this.selectGroup(group);}.bind(this)},group));}.bind(this));return(React.createElement(RB.Modal,React.__spread({},this.props,{title:React.createElement("span",{style:{fontSize:'25px'}},"選擇群組"),bsSize:"large"}),React.createElement("div",{className:"modal-body btn-material-green-200"},React.createElement("br",null),React.createElement(RB.Button,{className:"mdi-content-add btn-material-blue-grey-500",bsSize:"small",onClick:this.addGroup}),React.createElement("br",null),groupTags),React.createElement("div",{className:"modal-footer"},React.createElement("br",null))));}});SC.NavbarInstance=React.createClass({displayName:'NavbarInstance',userSign:function(){if(this.props.current_user){return(React.createElement(RB.DropdownButton,{eventKey:1,title:this.props.current_user.name},React.createElement(RB.MenuItem,{eventKey:"1"},"Action"),React.createElement(RB.MenuItem,{eventKey:"2"},"Another action"),React.createElement(RB.MenuItem,{eventKey:"3"},"Something else here"),React.createElement(RB.MenuItem,{divider:true}),React.createElement(SC.MenuItem,{eventKey:"4",href:"/logout"},"Logout")))}else if(window.location.pathname.substr(0,6)!='/login'){return(React.createElement(RB.NavItem,{eventKey:1,href:'/login?next='+encodeURIComponent(this.props.url)},"Login"));}},render:function(){return(React.createElement(RB.Navbar,{brand:React.createElement(SC.A,{href:"/"},"School Cms"),inverse:true,toggleNavKey:0,className:"navbar-material-brown"},React.createElement(RB.Nav,{right:true,eventKey:0}," ",this.userSign())));},});SC.ResizeTextArea=React.createClass({displayName:'ResizeTextArea',handleChange:function(){if(this.props.onChange){this.props.onChange();}else if(this.props.valueLink){this.props.valueLink.requestChange(this.refs.textarea.getValue());}},textareaResize:function(){var textarea=React.findDOMNode(this.refs.textarea).getElementsByTagName('textarea')[0];textarea.style.height='0px'
textarea.style.height=textarea.scrollHeight+20+'px';},componentWillReceiveProps:function(nextprops){this.textareaResize();},getValue:function(){return this.refs.textarea.getValue();},render:function(){var other=SC.makeOtherArray(['valueLink','onChange','type','ref'],this.props);if(!other.style)other.style={};other.style.resize='None';return(React.createElement(RB.Input,React.__spread({},other,{type:"textarea",ref:"textarea",onChange:this.handleChange,value:this.props.valueLink?this.props.valueLink.value:this.props.value})));}});SC.Form=React.createClass({displayName:'Form',handleSubmit:function(e){console.log('handleSubmit');e.preventDefault();e.stopPropagation();this.props.onSubmit();},render:function(){var other=SC.makeOtherArray(['onSubmit'],this.props);return(React.createElement("form",React.__spread({},other,{onSubmit:this.handleSubmit}),this.props.children,React.createElement("input",{type:"submit",style:{display:'none'}})));}});SC.A=React.createClass({displayName:'A',propTypes:{href:React.PropTypes.string,},handleClick:function(e){e.preventDefault();RMR.navigate(this.props.href);console.log('nave to '+this.props.href);},render:function(){var other=SC.makeOtherArray(['onClick','href'],this.props);return(React.createElement("a",React.__spread({},other,{href:this.props.href,onClick:this.handleClick}),this.props.children));}});SC.MenuItem=React.createClass({displayName:'MenuItem',propTypes:{href:React.PropTypes.string,},getDefaultProps:function(){return{href:'#',};},render:function(){return(React.createElement(RB.MenuItem,{eventKey:this.props.eventKey},React.createElement(SC.A,{href:this.props.href},this.props.children)));}});SC.ToggleButton=React.createClass({displayName:'ToggleButton',getInitialState:function(){return{'checked':this.props.checked,}},componentWillReceiveProps:function(nextprops){if(nextprops.checked!=this.props.checked){this.setState({checked:nextprops.checked});}},componentDidMount:function(){var input=React.findDOMNode(this.refs.input).getElementsByTagName('div')[0];input.classList.add('togglebutton');input.classList.remove('checkbox');},handleChange:function(){this.setState({checked:this.ref.getValue()});},render:function(){var other=SC.makeOtherArray(['checked'],this.props);return(React.createElement(RB.Input,React.__spread({type:"checkbox",ref:"input"},other,{checked:this.state.checked,onChange:this.handleChange})));}});SC.SelectInput=React.createClass({displayName:'SelectInput',getInitialState:function(){return{ready:false,value:'',}},componentDidMount:function(){$(".selectinput").dropdown({"autoinit":".selectinput",});$(".selectinput").change(function(event){this.setState({value:event.currentTarget.value});if(this.props.onChange)this.props.onChange(event.currentTarget.value);}.bind(this));this.setState({ready:true});},render:function(){var options=[];for(var key in this.props.options){options.push(React.createElement("option",{key:key,value:this.props.options[key]},this.props.options[key]));}
if(!this.state.ready)options=[];return(React.createElement("div",null,React.createElement("label",null,this.props.label),React.createElement("input",{type:"hidden",name:this.props.name,value:this.state.value}),React.createElement("select",{placeholder:this.props.placeholder,className:"form-control selectinput"},options)));}});SC.Pagination=React.createClass({displayName:'Pagination',propTypes:{path:React.PropTypes.string,step:React.PropTypes.number,start:React.PropTypes.number,total:React.PropTypes.number,query:React.PropTypes.object,},getDefaultProps:function(){return{path:'/',step:10,start:0,total:0,query:{},};},pageURL:function(start){var query=Object.create(this.props.query);query.start=start;return SC.makeURL(this.props.path,query);},handleSelect:function(event,selectedEvent){var page=selectedEvent.eventKey;var now=Math.ceil(this.props.start/this.props.step)+1;var all=Math.ceil(this.props.total/this.props.step);if(page>0&&page<=all&&page!==now){setTimeout(function(){RMR.navigate(this.pageURL(page*10-10));}.bind(this),1);}},render:function(){var items=Math.ceil(this.props.total/this.props.step);if(items===0)items=1;var now=Math.ceil(this.props.start/this.props.step)+1;return(React.createElement(RB.Pagination,{prev:true,next:true,first:true,last:true,ellipsis:true,items:items,maxButtons:items>10?10:items,activePage:now,onSelect:this.handleSelect}));}});SC.MaterialInit=React.createClass({displayName:'MaterialInit',componentDidMount:function(){$.material.init();},render:function(){return(React.createElement("div",null));}});