var FB = require('./FBHelper');


var loggedin = false;

var request = require('request').defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.121 Safari/535.2'
    }
});
var express = require('express'),
    http = require('http'),
    verbose = true;
var Firebase = require('firebase');
var firebaseVars = {
    firebase: Firebase,
    FIREBASESECRET: "JSDHASJHDHASDHASKDAHSJDHAJSKDKJHDAJSKHD",
    FIREBASE_BASEURL: "https://fbstalk.firebaseio.com/"
};

//compile.runCode("abc","a");
var app = express();
var port = process.env.PORT || 80;
// configure Express
app.set('port', port);
//app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.session({
    secret: 'keyboard cat'
}));

app.use(app.router);
app.use(express.static(__dirname + '/client'));

var root = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL);
root.auth(firebaseVars.FIREBASESECRET);

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/add', function(req, res) {
    var inp = req.body;
    console.log(inp);
    FB.graph(inp.url, request, function(graph) {
        var query = {};
        //found profile graph
        query.fbid = graph.id;
        query.title = graph.name;
        query.url = "https://m.facebook.com/" + graph.username;
        //check if this exists already in our profiles

        var profilefirebase = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/profiles/' + query.fbid + '/');

        profilefirebase.once('value', function(snapshot) {
            var groupfirebase = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/groups/' + inp.group + '/' + query.fbid);

            if (!snapshot.val()) {
                //add this "guy" to our stalk list ;)
                profilefirebase.set(query);
                groupfirebase.set(true);

                res.send({
                    msg: "added",
                    graph: query
                });
            } else {
                groupfirebase.set(true);

                res.send({
                    msg: "exists",
                    graph: query
                });
            }
        });

    }, function() {
        res.send("failed");
    });
});


app.get('/cron', function(req, res) {



    console.log("/cron");


    var offset;
    var startat = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/startat');
    startat.once('value', function(snapshot) {
        offset = ~~ (snapshot.val());
        startat.set(offset + 1);
        console.log(offset);
        run();
    });

    function run() {
        // body...

        var profilesfirebase = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/profiles/');
        //profilesfirebase.endAt().limit(1);
        profilesfirebase.once('value', function(snapshot) {
            var inp = snapshot.val();
            var count = 0;
            for (var i in inp) {

                if (offset === count) {
                    //this shud update
                    var profileobj = inp[i];
                    console.log("PROFILE:" + profileobj.title);
                    stalkThisProfile(profileobj, res);

                }
                count++;
            }

            if (offset >= count - 1) {
                startat.set(0);
            }




        });

    }
});

function stalkThisProfile(profileobj, res) {
    FB.getPicture(profileobj, function(data) {
        //add this photo's hash to the users profile
        var profTophoto = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/photos/' + profileobj.fbid + '/' + data.thumbnail.hashCode());
        profTophoto.set(data);
        console.log('--Photo added: ' + data.thumbnail.hashCode());
        res.send("OK");
    }, request, FB.phantomPhoto);
}

app.get('/cron/*', function(req, res) {
    var fbid = req.params[0];
    //var url = "http://graph.facebook.com/"+fbid;

    var profilefirebase = new firebaseVars.firebase(firebaseVars.FIREBASE_BASEURL + '/profiles/' + fbid);
    profilefirebase.once('value', function(snapshot) {
        var profileobj = snapshot.val();
        if (profileobj) {
            console.log("PROFILE:" + profileobj.title);
            stalkThisProfile(profileobj, res);
        }
    });



});


app.get('/g/*', function(req, res, next) {
    var group = req.params[0];
    console.log(group);
    res.send(group);
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});



String.prototype.hashCode = function() {
    var hash = 0,
        i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
