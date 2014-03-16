function addprofile (profileurl) {
		// post a JSON payload:
		$.ajax({
		  type: 'POST',
		  url: '/add',
		  // post payload:
		  data: JSON.stringify({url:profileurl,group: group}),
		  contentType: 'application/json',
		  success:function (data) {
		  	console.log(data);
		  	if (data.graph)
		  	{
		  		forcecron(data.graph.fbid);
		  	}
		  }
		});
	}


function addmanual (fbid,thumbnail,large) {
	$.ajax({
		  type: 'POST',
		  url: '/addmanual',
		  // post payload:
		  data: JSON.stringify({fbid:fbid,thumbnail: thumbnail,large:large}),
		  contentType: 'application/json',
		  success:function (data) {
		  	console.log(data);
		  	
		  }
		});
}
function forcecron (fbid) {
	$.ajax({
		  type: 'GET',
		  url: '/cron/'+fbid,
		  // post payload:
		  contentType: 'application/json',
		  success:function (data) {
		  	console.log(data);
		  	
		  }
		});

}

//init
var ApiURL = "https://fbstalk.firebaseio.com/";

var group = window.location.hash.substring(1);

if (group)
	loadGroup(group);


function loadGroup(groupname)
{
	console.log("loading",groupname);
	$('body').attr('id',"grouppage");

	$("#groupname").text(groupname);

	var firebasegroup = new Firebase(ApiURL + "groups/"+groupname);
	firebasegroup.on('child_added', function(snapshot){
		var data = snapshot.name();

		console.log("loading prof id",data);
		$('#emptygroup').hide(); //remove this note, its for empty list and this one is not empty.

		var profilefirebase = new Firebase(ApiURL + 'profiles/' + data);
		profilefirebase.once('value',function (snapshot) {
			var profiledata = snapshot.val();
			loadProfile(profiledata);
		});


			//load this guys profile
	});
	//firebasegroup.set('Hello World!');


}

$('#button_creategroup').on('click',function () {
	var groupname = $('#inpgroupname').val().toLowerCase();

	if (groupname==='') return;

	window.location.href = "#"+groupname;
	group = groupname;
	loadGroup(groupname);		
});

$('#inpgroupname').on('keypress',function(e){
if(e.which == 13) {
	$('#button_creategroup').click();
}

});

$('#button_addprofile').on('click',function () {

	var profurl = $('#profurl').val();

	if (profurl==='') return;
	addprofile(profurl);
	$('#postModal').modal('hide');
});

function loadProfile (pdata) {
	var profdom = $('#template-profile').clone();
	profdom.attr('id',pdata.fbid);
	profdom.find('#name').text(pdata.title);
	profdom.find('#linkviewall').attr('href',pdata.url.replace("://m.","://www."));

	$('#groupview').append(profdom);

	var picturefirebase = new Firebase(ApiURL + 'photos/' + pdata.fbid);
	picturefirebase.on('child_added',function (snapshot) {
		var picdata = snapshot.val();
		var picdom = $('#template-imgthumb').clone();
		picdom.attr('id',snapshot.name());
		picdom.find('.thumb').attr('src',picdata.thumbnail);

		//piclarge may have crop attributes from fb in url
		picdom.attr('href',removeCropParams(picdata.large));
		profdom.find('#thumbcontainer').append(picdom);
	});


}

function removeCropParams(url)
{
	//alert(url);
	if (url.indexOf("/c")>6)
		return url.replace( url.substring(url.indexOf("/c")+1,url.indexOf("160/")+4),"");
	else {
		return url;
	}
	
}