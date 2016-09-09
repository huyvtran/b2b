9-Sep 2016 —————————————
Hi Praveen , today you have 2 APK 
1. B2b_v0.9.2   - this will work only with Oth2 security - which is the current state of server - so first run all the test over this with Ravinder.

after completion of all test , request server team to enable OAM security and run 
2. APK   — browserTest.apk   - this will show a browser login page .
just check that , and preserve the log from Chrome /dev tools / inspect device.

———————————————————————

10-sep-2016 ——————
Major highlights of the release is :
	1. Oauth 2 + OAM security 
	2. VPN retry flow  —> 
		Android :— both Retry  and Exit functioanlity  available 
		IOS  — only Retry function will be available as Platform is not allowing us to control exit of an app (Platform Specific)
	3. Cordova  - Medium issues removed and folder checking in to Release/Cordova 

Note :- for checking any VPN On/OFF  flow – use application Retry option, multiple time as Actual VPN take time to provide an event to hardware. 

Regarding Certificate Pinning : Certification pinning flow is before Authentication . Because of this it will be happen with only for those domain which either works without authentication over VPN or exposed to external world. 

For example :- google.com  
			https://cloudsso.cisco.com  
			Cisco.com 

But https://wwwin-spb2b.cisco.com/   is not work without authentication , so either we can provide certification pinning flow after login or can do with other cisco domains which are exposed 
—————————————————————————



