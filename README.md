FB Profile Stalker
=============================

## Demo
Check the live version here (may take down soon): http://fbstalk.cloudapp.net/


## Getting started
* First of all, setup a new account and create a new app at http://Firebase.com.
* It is recommended that you know how to use firebase.
* Open the Forge (firebase dashboard).
* Go to SECURITY RULES and paste all rules provided in ./firebase_rules.json.
* Go to SECRETS tab and copy the token to the FIREBASESECRET variable in app.js
* Also set FIREBASE_BASEURL while you are in app.js
* Now create a new facebook account which will be used by this app to stalk profiles.
* Enter email/password of that facebook account in the file FBHelper.js around line: 106.
* Now install Phantomjs and add its path to your systems PATH dir.
* Also install nodejs if you don't have it already.
* Clone this repo, and open terminal and do "npm install" in project directory.
* Now do "sudo node app.js" or simply "node app.js".
* Open your browser and visit http://127.0.0.1/

* I haven't added my own cron code. But I use an outside service to call /cron endpoint every minute.
* You can use this method: http://www.labnol.org/internet/website-uptime-monitor/21060/ to ping, which will run the cron code and update the profile photos if any.

Goodluck!



## MIT Licence


Permission is hereby granted, free of charge, to any person 
obtaining a copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

