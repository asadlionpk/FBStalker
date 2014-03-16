var phantom = require('node-phantom');

exports.graph = function(fburl, request, success, fail) {
    //process url
    var url = new String(fburl);
    url = url.replace("://www.facebook", "://graph.facebook");
    url = url.replace("://facebook", "://graph.facebook");
    url = url.replace("://m.facebook", "://graph.facebook");
    //if (photoonly) url += "/picture?type=large";

    request(url, function(err, resp, body) {
        if (err) {
            if (fail) fail(err);
            return;
        }

        //console.log("fbgraph:"+body);
        body = JSON.parse(body);

        if (body.id && body.name) {
            if (success) success(body);
        } else {
            if (fail) fail(body);
        }

        //console.log(body);
        // TODO: scraping goes here!
    });
}

exports.getPicture = function(profileobj, success, request, phantomPhoto) {

    var fburl = profileobj.url; //"https://m.facebook.com/hbj001/picture?type=large";
    //request(fburl, scrapphoto);

    phantomPhoto(fburl, function(data) {
        var pic = data.replace("p160x160/", "");
        success({
            thumbnail: data,
            phantom: true,
            large: pic
        });
        console.log("phantomed");
    });

}




exports.phantomPhoto = function(url, success) {

    url = url.replace("://www.facebook", "://www.facebook");
    url = url.replace("://facebook", "://www.facebook");
    url = url.replace("://m.facebook", "://www.facebook");
    //console.log(url);
    var phantom = require('node-phantom');

    phantom.create(function(err, ph) {
        return ph.createPage(function(err, page) {

            page.open(url, function(err, status) {
                console.log(status);
                if (status === "success") {


                    page.evaluate(function() {
                        document.getElementsByName("email")[0].value = "someone@gmail.com";
                        document.getElementsByName("pass")[0].value = "somepassword";
                        document.getElementById("login_form").submit();
                        //return document.getElementsByName("login")[0]
                        //return 0;
                    }, function(err, a) {
                        setTimeout(function() {
                            // body...
                            //page.render('./render.png');
                            page.evaluate(function() {
                                return document.getElementsByClassName('profilePicThumb')[0].getElementsByTagName('img')[0].src;
                            }, function(err, out) {
                                console.log(out);
                                if (success) success(out);
                            });
                        }, 6000);



                    });

                }
            });





        });
    }, {
        parameters: {
            'load-images': 'false'
        }
    });
}
