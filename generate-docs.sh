rm -rf temp &> /dev/null
mkdir temp &> /dev/null
tsc --outDir ./temp/ --target es6
$(npm bin)/jsdoc2md -l js --no-cache --source "$(cat ./temp/MeteorObservable.js)" > ./docs/MeteorObservable.md
$(npm bin)/jsdoc2md -l js --no-cache --source "$(cat ./temp/ObservableCollection.js)" > ./docs/ObservableCollection.md
$(npm bin)/jsdoc2md -l js --no-cache --source "$(cat ./temp/ObservableCursor.js)" > ./docs/ObservableCursor.md
rm -rf temp &> /dev/null