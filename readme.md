# Pooldash
Welcome to the pooldash! This is the React-Native code for the mobile app. You might find the formulas useful (to be packaged in this app soon):
https://github.com/pooldash/formulas

Support us on Patreon!
https://www.patreon.com/gazzini

## Setting up local environment
(better instructions coming soon!)

### Pre-requisites
- npm >= 7.10
- node >= 15
- ts >= 3.8
- cocoapods 1.10.1

### Compiling
- Install all node_module dependencies via `npm install`
- Generate pod file: 
  -- `cd ios`
  -- `pod install --repo-update`
- Go back to root folder and run `npx react-native start`
- Open Xcode, and run the pooldash workspace in a simulator.