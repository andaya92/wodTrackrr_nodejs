(this.webpackJsonpreactapp=this.webpackJsonpreactapp||[]).push([[0],{109:function(e,t,a){e.exports=a(126)},124:function(e,t,a){},126:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(13),s=a.n(o),i=a(8),l=a(9),c=a(11),u=a(10),m=a(59),d=(a(23),m),h=r.a.createContext(m.initializeApp({apiKey:"AIzaSyCGE8_j8cfIBmIzcvP6CVgG2yC6EE1Ep1U",authDomain:"wodtrackrr.firebaseapp.com",databaseURL:"https://wodtrackrr.firebaseio.com",projectId:"wodtrackrr",storageBucket:"wodtrackrr.appspot.com",messagingSenderId:"743601990099",appId:"1:743601990099:web:5937e9151eaad13e93a726",measurementId:"G-39CF0BRPMH"})),p=(a(97),a(27),a(21)),b=a(15),f=a(165),v=a(186),y=a(187),E=a(89),x=a.n(E),g=(a(28),a(14)),w=a(103),k=a(63),D=a(177),O=a(190),B=a(181),j=a(99),M=a.n(j),S=a(191),I=a(178),L=a(179),C=a(180),A=a(31),W=a.n(A),T=a(169),P=a(170),V=a(193),U=a(172),R=a(173),F=a(176),N=a(90),z=a(20),G=(a(127),a(42)),K=a(71),Z=a.n(K);function H(e){console.log("Split",e);var t=e.split(":"),a=Object(z.a)(t,2),n=a[0],r=a[1];return 60*parseInt(n)+parseInt(r)}function J(e){var t=Math.floor(e/60),a=e-60*t;return a<10&&(a="0".concat(a)),"".concat(t,":").concat(a)}a(19),a(50),d.storage(),d.database();d.database();var _=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={dataType:e.dataType,data:e.data,values:e.values,stats:new Map},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){}},{key:"createChart",value:function(){this.ctx=document.getElementById("lineChart"),console.log(this.state.data),this.barChart=new Z.a(this.ctx,{type:"line",labels:["Scores"],data:{datasets:[{label:"Score",barPercentage:.5,barThickness:6,maxBarThickness:8,minBarLength:2,backgroundColor:this.props.theme.palette.primary.main,data:this.state.data}]},options:{scales:{yAxes:[{ticks:{callback:function(e,t,a){return J(e)}}}]},tooltips:{callbacks:{label:function(e,t){var a=t.datasets[e.datasetIndex].label||"";return a&&(a+=": "),a+=J(e.yLabel),a}}},maintainAspectRatio:!1},plugins:[{beforeInit:function(e){e.data.datasets[0].data;console.log(e.options.scales.yAxes)}}]})}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.setState(Object(g.a)({},e),(function(){t.createChart()}))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount")}},{key:"objListToArray",value:function(e){return Array.from(Object.entries(e),(function(e){return new Map(Object.entries(e[1]))}))}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:2},r.a.createElement("canvas",{id:"lineChart",width:"400",height:"400"})))}}]),a}(n.Component),q=_=Object(S.a)(_),Q=a(17),X=(d.database(),function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={dataType:e.dataType,data:e.data,values:e.values,stats:new Map},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){}},{key:"createChart",value:function(e){var t=Object(z.a)(e,2),a=t[0],n=t[1];this.ctx=document.getElementById("barChart"),this.barChart=new Z.a(this.ctx,{type:"bar",data:{labels:a,datasets:[{label:"Scores (Standard Deviation)",minBarLength:1,backgroundColor:this.props.theme.palette.primary.main,data:n}]},options:{maintainAspectRatio:!1}})}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.setState(Object(g.a)({},e),(function(){t.createChart(t.binData(t.state.values))}))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount")}},{key:"createLabels",value:function(e,t){function a(e){return e<=0?0:J(e)}return["".concat(a(e-3*t)," - ").concat(a(e-2*t)),"".concat(a(e-2*t)," - ").concat(a(e-1*t)),"".concat(a(e-1*t)," - ").concat(a(e-0*t)),"".concat(a(e+0*t)," - ").concat(a(e+1*t)),"".concat(a(e+1*t)," - ").concat(a(e+2*t)),"".concat(a(e+2*t)," - ").concat(a(e+3*t))]}},{key:"binData",value:function(e){var t,a=Object(G.standardDeviation)(e),n=Object(G.mean)(e),r=this.createLabels(n,a),o=[0,0,0,0,0,0],s=Object(Q.a)(e);try{for(s.s();!(t=s.n()).done;){var i=t.value,l=i-n,c=Math.floor(l/a);console.log("SD: ".concat(a,", x: ").concat(i,", mean: ").concat(n," Diff: ").concat(l,", sdAway: ").concat(c)),1==Math.abs(c)?l>0?o[3]++:o[2]++:2==Math.abs(c)?l>0?o[4]++:o[1]++:l>0?o[5]++:o[0]++}}catch(u){s.e(u)}finally{s.f()}return[r,o]}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement("div",{stlye:{width:"100%"}},r.a.createElement("canvas",{id:"barChart",width:"400",height:"400"})))}}]),a}(n.Component)),Y=X=Object(S.a)(X),$=d.database(),ee=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={wodID:e.wodID,scores:new Array,rawScores:new Array,dataType:"",stats:new Map},n}return Object(l.a)(a,[{key:"getRawScores",value:function(e){return e.map((function(e){return e.get("score")}))}},{key:"componentDidMount",value:function(){var e=this,t="scores/".concat(this.state.wodID);this.scoreListener=$.ref(t).on("value",(function(t){if(t&&t.exists()){var a=e.getData(t.val()),n=Object(z.a)(a,3),r=n[0],o=n[1],s=n[2],i=e.getDescStats(o);console.log(i),e.setState({scores:r,rawScores:o,dataType:s,stats:i})}}))}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount")}},{key:"getData",value:function(e){for(var t=this,a=[],n=[],r="",o=0,s=Object.values(e);o<s.length;o++){var i=s[o];n.push(H(i.score)),r=i.scoreType}n.sort((function(e,a){return"time"===r?e-a:"reps"===r?t.cvtReps(e)-t.cvtReps(a):1}));for(var l=0;l<n.length;l++)a.push({x:l,y:n[l],c:0});return[a,n,r]}},{key:"getDescStats",value:function(e){var t=[["min",Math.min.apply(Math,Object(N.a)(e))],["max",Math.max.apply(Math,Object(N.a)(e))],["mean",Object(G.mean)(e)],["median",Object(G.median)(e)],["sd",Object(G.standardDeviation)(e)]];return new Map(t)}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,null,r.a.createElement(k.a,null,"Low: ",J(this.state.stats.get("min"))),r.a.createElement(k.a,null,"High: ",J(this.state.stats.get("max")))),r.a.createElement(w.a,{elevation:2},r.a.createElement(q,{data:this.state.scores,values:this.state.rawScores,dataType:this.state.dataType}),r.a.createElement(Y,{data:this.state.scores,values:this.state.rawScores,dataType:this.state.dataType})))}}]),a}(n.Component),te=ee=Object(S.a)(ee),ae=d.database();function ne(e){var t=e.info.get("score"),a=e.info.get("username");return r.a.createElement(T.a,null,r.a.createElement(P.a,{primary:a}),r.a.createElement(P.a,{primary:t}))}var re=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(i.a)(this,a),n=t.call(this,e);var r=e.wodMD.get("wodID");return n.state={userMD:e.userMD,wodID:r,wodMD:e.wodMD,scores:new Array},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this,t="scores/".concat(this.state.wodID);this.scoreListener=ae.ref(t).on("value",(function(t){t&&t.exists()&&e.setState({scores:e.objListToArray(t.val())})}))}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount"),this.scoreListener()}},{key:"objListToArray",value:function(e){return Array.from(Object.entries(e),(function(e){return new Map(Object.entries(e[1]))}))}},{key:"handleAddScore",value:function(){if(this.state.userMD){var e=document.getElementById("scoreViewUserScore").value,t=this.state.userMD.username,a=this.state.userMD.uid,n="scores/".concat(this.state.wodID,"/").concat(a);console.log(t,e,a),ae.ref(n).set({username:t,score:e,wodID:this.state.wodMD.get("wodID"),boxID:this.state.wodMD.get("boxID"),scoreType:this.state.wodMD.get("scoreType")})}}},{key:"render",value:function(){var e=this;return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(k.a,null,this.state.wodMD.get("title")),r.a.createElement(k.a,null,this.state.wodMD.get("scoreType")),r.a.createElement(k.a,null,this.state.wodMD.get("wodText"))),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(V.a,null,r.a.createElement(U.a,{style:{background:this.props.theme.palette.primary.main},expandIcon:r.a.createElement(W.a,null),"aria-label":"Expand","aria-controls":"additional-actions2-content",id:"additional-actions2-header"},r.a.createElement(k.a,null,"Add Score")),r.a.createElement(R.a,null,r.a.createElement(k.a,null,this.state.wodMD.get("scoreType")),r.a.createElement(O.a,{id:"scoreViewUserScore",type:"text",style:{margin:8},pattern:"[\\sA-Za-z0-9]{35}",inputProps:{title:"Letters only, max length 35",placeholder:"Score"},margin:"normal",color:"primary",InputLabelProps:{shrink:!0}}),r.a.createElement(D.a,{variant:"outline",color:"primary",onClick:this.handleAddScore.bind(this)},"Add")))),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(te,{wodID:this.state.wodMD.get("wodID")})),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,null,this.state.scores.length>0?r.a.createElement(F.a,null,this.state.scores.map((function(e){return r.a.createElement(ne,{info:e})}))):r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(I.a,{variant:"outlined",color:"primary"},r.a.createElement(L.a,null,r.a.createElement(k.a,{variant:"h5",component:"h2",gutterBottom:!0},"No Scores!")))))),r.a.createElement(f.a,{item:!0,xs:12,align:"center"},r.a.createElement(D.a,{variant:"outlined",color:"secondary",onClick:function(){e.props.handleBack()}},"Back")))}}]),a}(n.Component),oe=re=Object(S.a)(re),se=d.database();function ie(e){var t=e.info.get("title"),a=e.info.get("scoreType"),n=e.info.get("wodText");return r.a.createElement(f.a,{item:!0,xs:4},r.a.createElement(I.a,{variant:"outlined",color:"primary"},r.a.createElement(L.a,null,r.a.createElement(k.a,{variant:"h5",component:"h2",gutterBottom:!0},t),r.a.createElement(k.a,{color:"textSecondary"},a),r.a.createElement(k.a,{color:"textSecondary"},n)),r.a.createElement(C.a,null,r.a.createElement(f.a,{item:!0,align:"center",xs:12},r.a.createElement(D.a,{size:"small",color:"primary",onClick:function(){return e.handleScoreView(e.info)}},"View Scores")))))}var le=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={userMD:e.userMD,boxID:e.boxID,boxMD:new Map,wods:new Array,showWodList:!0,currentWodID:"",currentWodMD:new Map},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this,t="boxes/".concat(this.props.boxID),a="wods/".concat(this.props.boxID);this.boxListener=se.ref(t).on("value",(function(t){t&&t.exists()&&e.setState({boxMD:new Map(Object.entries(t.val()))})})),this.wodListener=se.ref(a).on("value",(function(t){t&&t.exists()&&e.setState({wods:e.objListToArray(t.val())})}))}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount"),this.wodListener(),this.boxListener()}},{key:"objListToArray",value:function(e){return Array.from(Object.entries(e),(function(e){return new Map(Object.entries(e[1]))}))}},{key:"handleScoreView",value:function(e){this.setState({showWodList:!1,currentWodMD:e})}},{key:"handleBack",value:function(){this.setState({showWodList:!0})}},{key:"render",value:function(){var e=this;return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:2},r.a.createElement(k.a,{align:"center",variant:"h3"},this.state.boxMD.get("title")),this.state.showWodList?r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a,{variant:"h4"},"Wods"),r.a.createElement(f.a,{container:!0,item:!0,xs:12},this.state.wods.length>0?this.state.wods.map((function(t){return r.a.createElement(ie,{handleScoreView:e.handleScoreView.bind(e),info:t})})):r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(I.a,{variant:"outlined",color:"primary"},r.a.createElement(L.a,null,r.a.createElement(k.a,{variant:"h5",component:"h2",gutterBottom:!0},"No Wods!")))))):r.a.createElement(oe,{userMD:this.state.userMD,wodMD:this.state.currentWodMD,handleBack:this.handleBack.bind(this)})),r.a.createElement(f.a,{item:!0,xs:12,align:"center"},r.a.createElement(D.a,{variant:"outlined",color:"secondary",onClick:function(){e.props.handleBack()}},"Back")))}}]),a}(n.Component),ce=le=Object(S.a)(le),ue=d.database();function me(e){var t=e.info.get("title"),a=e.info.get("boxID");return console.log(e.color),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,null,r.a.createElement(f.a,{container:!0,itemxs:12},r.a.createElement(f.a,{item:!0,xs:10},r.a.createElement(k.a,{align:"left",style:{padding:"2.5vw"},variant:"body1"},t)),r.a.createElement(f.a,{container:!0,item:!0,xs:2,align:"center",alignItems:"center"},r.a.createElement(D.a,{variant:"outlined",color:"primary",onClick:function(){e.handleBoxView(a)}},"View")))))}var de=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD,allBoxes:new Array,filteredBoxes:new Array},n}return Object(l.a)(a,[{key:"objectsToArray",value:function(e){return Array.from(Object.entries(e),(function(e){return new Map(Object.entries(e[1]))}))}},{key:"componentDidMount",value:function(){var e=this;this.allBoxesListener=ue.ref("boxes").on("value",(function(t){if(t&&t.exists()){var a=e.objectsToArray(t.val());a.sort((function(e,t){return e.get("title").toLowerCase()>t.get("title").toLowerCase()?-1:1})),e.setState({allBoxes:a,filteredBoxes:a})}}))}},{key:"componentWillUnmount",value:function(){void 0!==this.allBoxesListener&&this.allBoxesListener()}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"onKeyUp",value:function(e){e.keyCode||e.which}},{key:"onChange",value:function(e){var t=e.target.value;console.log(t);var a=this.state.allBoxes.filter((function(e){return e.get("title").toLowerCase().includes(t.toLowerCase())}));this.setState({filteredBoxes:a})}},{key:"render",value:function(){var e=this;return r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:2,component:"form"},r.a.createElement(O.a,{fullWidth:!0,variant:"outlined",onKeyUp:this.onKeyUp.bind(this),onChange:this.onChange.bind(this),placeholder:"Search Boxes",InputProps:{startAdornment:r.a.createElement(B.a,{position:"start"},r.a.createElement(M.a,{color:"primary"}))}})),r.a.createElement(f.a,{item:!0,xs:12},this.state.filteredBoxes.map((function(t,a){return r.a.createElement(me,{key:a,info:t,color:e.props.theme.palette.primary.mainGrad,handleBoxView:e.props.handleBoxView})}))))}}]),a}(n.Component),he=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD,showBoxView:!1,currentBoxID:null},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){}},{key:"handleBoxView",value:function(e){console.log("Show details for: ".concat(e)),this.setState({showBoxView:!0,currentBoxID:e})}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"handleBack",value:function(){this.setState({showBoxView:!1})}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12},this.state.showBoxView?r.a.createElement(ce,{userMD:this.state.userMD,handleBack:this.handleBack.bind(this),boxID:this.state.currentBoxID}):r.a.createElement(de,{theme:this.props.theme,handleBoxView:this.handleBoxView.bind(this)}),"}")}}]),a}(n.Component),pe=he=Object(S.a)(he),be=a(171),fe=a(189),ve=(a(124),function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(l.a)(a,[{key:"handleSubmit",value:function(e){var t=this,a=document.getElementById("email"),n=document.getElementById("password");document.getElementById("passwordConfirm");console.log(a.value,n),m.auth().signInWithEmailAndPassword(a.value,n.value).then((function(e){console.log("Firebase res"),console.log(e),t.props.onLogin(e.user)})).catch((function(e){console.log(e);e.code,e.message}))}},{key:"render",value:function(){return r.a.createElement(f.a,{container:!0,id:"login",align:"center",justify:"center"},r.a.createElement("br",null),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:"2"},r.a.createElement(k.a,{variant:"h4"},"Login"),r.a.createElement("br",null),r.a.createElement(O.a,{id:"email",style:{margin:8},placeholder:"Email",margin:"normal",InputLabelProps:{shrink:!0}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(O.a,{id:"password",type:"password",style:{margin:8},placeholder:"Passowrd",margin:"normal",InputLabelProps:{shrink:!0}}),r.a.createElement("br",null),r.a.createElement("br",null))),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:"2"},r.a.createElement(D.a,{variant:"outlined",color:"primary",onClick:this.handleSubmit.bind(this)},"Login"),r.a.createElement(p.b,{to:"/register",className:"no-line",style:{"padding-left":"10px"}},r.a.createElement(D.a,{variant:"outlined",color:"secondary"},"Register")))))}}]),a}(n.Component)),ye=a(70),Ee=a(188),xe=a(182),ge=(d.database(),function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD,userBoxes:e.userBoxes,hasBoxes:e.hasBoxes,showBoxList:!0,currentBoxID:""},n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"componentWillUnmount",value:function(){console.log("Component will unmount")}},{key:"handleBoxView",value:function(e){console.log("Show boxView for: ",e),this.setState({showBoxList:!1,currentBoxID:e})}},{key:"handleBack",value:function(){this.setState({showBoxList:!0})}},{key:"render",value:function(){var e=this;return r.a.createElement(V.a,null,r.a.createElement(U.a,{style:{background:this.props.theme.palette.primary.main},expandIcon:r.a.createElement(W.a,null),"aria-label":"Expand","aria-controls":"additional-actions2-content",id:"additional-actions2-header"},r.a.createElement(k.a,null,"Boxes and Wods")),r.a.createElement(R.a,null,this.state.showBoxList?r.a.createElement(f.a,{container:!0},r.a.createElement(f.a,{container:!0,item:12},this.state.userBoxes.length>0?this.state.userBoxes.map((function(t,a){return r.a.createElement(we,{key:a,handleBoxView:e.handleBoxView.bind(e),info:t})})):r.a.createElement(f.a,{item:!0,zeroMinWidth:!0,xs:6},r.a.createElement(w.a,{elevation:4,style:{padding:"1vw"}},r.a.createElement(k.a,{noWrap:!0,align:"left"},"No boxes Found!"))))):r.a.createElement(ce,{handleBack:this.handleBack.bind(this),boxID:this.state.currentBoxID})))}}]),a}(n.Component));function we(e){console.log(e.info.get("title"));var t=e.info.get("title"),a=e.info.get("boxID");return r.a.createElement(f.a,{item:!0,zeroMinWidth:!0,xs:6},r.a.createElement(w.a,{elevation:4,style:{padding:"1vw"}},r.a.createElement(k.a,{noWrap:!0,align:"left"},"Title: ",t),r.a.createElement(k.a,{noWrap:!0,align:"left"},"Id: ",a),r.a.createElement(D.a,{variant:"outlined",color:"primary",onClick:function(){e.handleBoxView(a)}},"View")))}var ke=ge=Object(S.a)(ge),De=d.database(),Oe=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD,userBoxes:new Array,hasBoxes:!1,addBoxProgress:!0,scoreTypeSelectVal:"",boxIDSelectVal:""},n}return Object(l.a)(a,[{key:"getArrayOfBoxes",value:function(e){return Array.from(Object.entries(e),(function(e){return new Map(Object.entries(e[1]))}))}},{key:"listenForBoxes",value:function(){var e=this;if(null!==this.state.user){console.log("Listening for boxes");var t="users/".concat(this.state.user.uid,"/boxes");this.boxListener=De.ref(t).on("value",(function(t){null!=t&&t.exists()&&(console.log("Snapshot:"),console.log(t.val()),e.updateState({hasBoxes:!0,userBoxes:e.getArrayOfBoxes(t.val())}))}))}}},{key:"updateState",value:function(e){console.log("Seeting state"),console.log(e),this.setState(Object(g.a)({},e))}},{key:"componentDidMount",value:function(){this.listenForBoxes()}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e)),"owner"===e.userMD.accountType&&this.listenForBoxes()}},{key:"componentWillUnmount",value:function(){console.log("Component will Unmounting"),void 0!==this.boxListener&&(console.log("Unmounting OwnerBox"),this.boxListener())}},{key:"onKeyUp",value:function(e){if(13==(e.keyCode||e.which)){var t=document.getElementById("ownerBoxAddBoxTitle").value;this.setState({showAddBoxProgress:!0}),this.createBox(t)}}},{key:"createWOD",value:function(){var e=document.getElementById("ownerBoxAddWodBoxID").value,t=document.getElementById("ownerBoxAddWodTitle").value,a=document.getElementById("ownerBoxAddWodScoreType").value,n=document.getElementById("ownerBoxAddWodWodText").value;if(!e||!t||!a||!n)return console.log("Error with input createWod"),void console.log(e,t,a,n);var r="wods/".concat(e),o=De.ref(r).push().key,s="".concat(r,"/").concat(o);De.ref(s).set({boxID:e,wodID:o,title:t,scoreType:a,wodText:n})}},{key:"createBox",value:function(e){var t=this,a="boxNames/".concat(e),n="users/".concat(this.props.user.uid,"/boxes");De.ref(a).once("value",(function(r){if(r.exists())alert("Title is taken");else{console.log("Adding box data");var o=De.ref("boxes").push().key,s={title:e,ownerUID:t.props.user.uid,boxID:o};De.ref("".concat("boxes","/").concat(o)).set(s),De.ref(a).set(s),De.ref("".concat(n,"/").concat(o)).set(s),t.setState({showAddBoxProgress:!1})}}))}},{key:"handleSelectValChange",value:function(e){var t=e.target.name;console.log(t),this.setState(Object(ye.a)({},t,e.target.value))}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12,id:"ownerBox"},r.a.createElement(k.a,{variant:"h3"},"Welcome, ",this.state.userMD.accountType,"!"),r.a.createElement(V.a,null,r.a.createElement(U.a,{style:{background:this.props.theme.palette.primary.mainGrad},expandIcon:r.a.createElement(W.a,null),"aria-label":"Expand","aria-controls":"additional-actions0-content",id:"additional-actions0-header"},r.a.createElement(k.a,null,"Add WOD")),r.a.createElement(R.a,null,r.a.createElement(Ee.a,{native:!0,inputProps:{name:"Box",id:"ownerBoxAddWodBoxID"}},r.a.createElement("option",{"aria-label":"None",value:""}),this.state.hasBoxes?this.state.userBoxes.map((function(e,t){return r.a.createElement("option",{key:t,value:e.get("boxID")},e.get("title"))})):r.a.createElement(r.a.Fragment,null)),r.a.createElement(O.a,{id:"ownerBoxAddWodTitle",type:"text",style:{margin:8},pattern:"[\\sA-Za-z0-9]{35}",inputProps:{title:"Letters only, max length 35",placeholder:"Title"},margin:"normal",color:"primary",InputLabelProps:{shrink:!0}}),r.a.createElement(O.a,{id:"ownerBoxAddWodWodText",type:"text",style:{margin:8},pattern:"[\\sA-Za-z0-9]{35}",inputProps:{title:"Letters only, max length 35",placeholder:"Workout here"},margin:"normal",color:"primary",InputLabelProps:{shrink:!0}}),r.a.createElement(Ee.a,{native:!0,inputProps:{name:"Score Type",id:"ownerBoxAddWodScoreType"}},r.a.createElement("option",{"aria-label":"None",value:""}),r.a.createElement("option",{value:"time"},"Time"),r.a.createElement("option",{value:"reps"},"Reps")),r.a.createElement(D.a,{variant:"outlined",onClick:this.createWOD.bind(this)},"Enter WOD"))),r.a.createElement(V.a,null,r.a.createElement(U.a,{style:{background:this.props.theme.palette.primary.mainGrad},expandIcon:r.a.createElement(W.a,null),"aria-label":"Expand","aria-controls":"additional-actions1-content",id:"additional-actions1-header"},r.a.createElement(k.a,null,"Add Box")),r.a.createElement(R.a,null,r.a.createElement(O.a,{id:"ownerBoxAddBoxTitle",type:"text",style:{margin:8},pattern:"[\\sA-Za-z0-9]{35}",inputProps:{title:"Letters only, max length 35",placeholder:"Name of box"},onKeyUp:this.onKeyUp.bind(this),margin:"normal",color:"primary",InputLabelProps:{shrink:!0}}),this.state.showAddBoxProgress?r.a.createElement(xe.a,{color:"secondary"}):r.a.createElement(r.a.Fragment,null))),r.a.createElement(ke,{user:this.state.user,userMD:this.state.userMD,userBoxes:this.state.userBoxes,hasBoxes:this.state.hasBoxes}))}}]),a}(n.Component),Be=Oe=Object(S.a)(Oe),je=d.database(),Me=(n.Component,a(24)),Se=Object(Me.a)(),Ie=(d.database(),function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD},console.log(e),n}return Object(l.a)(a,[{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"sendVerificationEmail",value:function(){var e=this;this.state.user.sendEmailVerification().then((function(){e.setState({emailAlertOpen:!0})})).catch((function(e){console.log(e)}))}},{key:"render",value:function(){var e=this;return r.a.createElement(f.a,{container:!0,align:"center"},r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(be.a,{in:this.state.emailAlertOpen},r.a.createElement(fe.a,{onClose:function(){e.setState({emailAlertOpen:!1})}},"Email sent!"))),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(w.a,{elevation:2}),this.state.user.emailVerified?r.a.createElement(r.a.Fragment,null):r.a.createElement(w.a,{elevation:2},r.a.createElement(D.a,{variant:"outline",onClick:this.sendVerificationEmail.bind(this)},r.a.createElement(k.a,{variant:"h5",component:"h3"},"Send Verification Email"))),r.a.createElement(w.a,{elevation:2},r.a.createElement(Be,{user:this.state.user,userMD:this.state.userMD}))),r.a.createElement(f.a,{item:!0,xs:12},r.a.createElement(f.a,{item:!0,xs:12,className:"compBorderOutline"},r.a.createElement(w.a,{elevation:2},r.a.createElement(D.a,{variant:"outlined",color:"secondary",onClick:this.props.onLogout},r.a.createElement(k.a,{variant:"h6",component:"h6"},"Logout"))))))}}]),a}(n.Component)),Le=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={user:e.user,userMD:e.userMD},n}return Object(l.a)(a,[{key:"handleLogout",value:function(){var e=this;d.auth().signOut().then((function(){alert("Signed Out"),e.setState({user:null})}),(function(e){console.error("Sign Out Error",e)}))}},{key:"handleLogIn",value:function(e){this.setState({user:e})}},{key:"componentWillReceiveProps",value:function(e){this.setState(Object(g.a)({},e))}},{key:"render",value:function(){return r.a.createElement(f.a,{item:!0,xs:12,id:"profilepage"},null!==this.state.user?r.a.createElement(Ie,{onLogout:this.handleLogout.bind(this),user:this.state.user,userMD:this.state.userMD}):r.a.createElement(ve,{onLogin:this.handleLogIn.bind(this)}))}}]),a}(n.Component),Ce=a(183),Ae=a(184),We=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){return Object(i.a)(this,a),t.call(this,e)}return Object(l.a)(a,[{key:"render",value:function(){return r.a.createElement(Ce.a,{position:"static",style:{background:this.props.theme.palette.background.toolbar}},r.a.createElement(Ae.a,{disableGutters:!1},r.a.createElement(k.a,{gutterBottom:!0,variant:"h3",style:{margin:"0 auto"}},"WodTrackrr")))}}]),a}(n.Component),Te=We=Object(S.a)(We),Pe=a(100),Ve=a(192),Ue=a(185),Re={palette:{common:{black:"#000",white:"#fff"},background:{paper:"#2e3134",toolbar:"#0d0e0e",tableHeader:"#1b1d1e",default:"rgba(48, 48, 48, 1)"},primary:{main:"#03ceec",mainGrad:"linear-gradient(90deg,#0890fd,#01d3fe)",contrastText:"rgba(255, 255, 255, 1)"},secondary:{light:"#6C30FF",main:"#6C30FF",dark:"#6C30FF",contrastText:"#fff"},error:{light:"#ea4331",main:"#c43627",dark:"#2d0d0b",contrastText:"rgba(255, 255, 255, 1)"},text:{primary:"#ffffff",secondary:"#e0dfdf",disabled:"#bdbdbd",hint:"#afafaf"}}},Fe=Re=Re,Ne=d.database(),ze=Object(Pe.a)(Fe);ze=Object(Ve.a)(ze);var Ge=function(e){Object(c.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={btmnav:0,user:d.auth().currentUser,userMD:!1},n.firebaseAuthListener=d.auth().onAuthStateChanged((function(e){e&&(console.log("Firebase user listener"),n.setState({user:e}),n.userMDListener=Ne.ref("users/"+e.uid).on("value",(function(e){e.val()&&(console.log("Metadata change"),console.log(e.val()),n.setState({userMD:e.val()}))})))})),n}return Object(l.a)(a,[{key:"componentWillUnmount",value:function(){void 0!==this.firebaseAuthListener&&this.firebaseAuthListener&&this.firebaseAuthListener(),null!==this.userMDListener&&this.userMDListener&&this.userMDListener()}},{key:"render",value:function(){var e=this;return r.a.createElement(h.Provider,null,r.a.createElement(p.a,{history:Se},r.a.createElement(Ue.a,{theme:ze},r.a.createElement(f.a,{container:!0},r.a.createElement(f.a,{item:!0,xs:12,id:"page-header"},r.a.createElement(Te,{className:"header"})),r.a.createElement(f.a,{item:!0,xs:11,id:"page-container",className:"page-content"},r.a.createElement(b.c,null,r.a.createElement(b.a,{exact:!0,path:"/boxSearch"},r.a.createElement(pe,{user:this.state.user,userMD:this.state.userMD})),r.a.createElement(b.a,{exact:!0,path:"/profile"},r.a.createElement(Le,{user:this.state.user,userMD:this.state.userMD})))),r.a.createElement(f.a,{item:!0,xs:12,className:"footer"},r.a.createElement(v.a,{className:"footer",value:this.state.btmnav,onChange:function(t,a){e.setState({btmnav:a})},style:{background:ze.palette.background.toolbar},showLabels:!0},r.a.createElement(y.a,{label:"Search",component:p.b,to:"/boxSearch",icon:r.a.createElement(x.a,null)}),r.a.createElement(y.a,{label:"Profile",component:p.b,to:"/profile",icon:r.a.createElement(x.a,null)})))))))}}]),a}(r.a.Component);Ge.contextType=h,s.a.render(r.a.createElement(Ge,null),document.getElementById("root"))},28:function(e,t,a){}},[[109,1,2]]]);
//# sourceMappingURL=main.a16d858d.chunk.js.map