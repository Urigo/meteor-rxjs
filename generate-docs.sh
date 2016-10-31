$(npm bin)/jsdoc2md -l js --source "$(cat ./src/MeteorObservable.ts)" > ./docs/MeteorObservable.md
$(npm bin)/jsdoc2md -l js --source "$(cat ./src/ObservableCollection.ts)" > ./docs/ObservableCollection.md
$(npm bin)/jsdoc2md -l js --source "$(cat ./src/ObservableCursor.ts)" > ./docs/ObservableCursor.md