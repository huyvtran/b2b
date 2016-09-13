# !/bin/bash
# Usage: ios-build.sh

sudo cordova plugin rm cordova-plugin-console
sudo ionic platform rm ios
sudo ionic build ios --release
sudo cp -f Releases/IOS/BackToBasics-Info.plist platforms/ios/backtobasics/BackToBasics-Info.plist
sudo cp -f Releases/IOS/config.xml platforms/ios/backtobasics/config.xml
