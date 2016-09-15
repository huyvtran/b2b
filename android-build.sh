# !/bin/bash
# Please set zipalign path in the environment variable (Path) e.g. %ANDROID_HOME%\build-tools\23.0.2
# Usage: android-build.sh 'B2B_v0.0.1' true
cp -f release-signing.properties platforms/android/release-signing.properties
cordova plugin rm cordova-plugin-console
ionic build android --release
#zipalign -v 4 platforms/android/build/outputs/apk/android-release.apk platforms/android/build/outputs/apk/$1.apk
3mv -f platforms/android/build/outputs/apk/$1.apk Releases/Android/
mv -f platforms/android/build/outputs/apk/android-release.apk Releases/Android/
if [ $2 == "true" ]; then
    git add Releases/Android/$1.apk
	git commit -m "$1"
	git push origin master
fi
