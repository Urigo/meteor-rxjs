import {Component, ChangeDetectionStrategy} from "@angular/core";
import template from "./app.component.html";
import style from "./app.component.scss";
import {MeteorObservable} from "../../../../../src/MeteorObservable";
import {DemoCollection} from "../../../both/collections/demo.collection";

@Component({
  selector: "app",
  template,
  styles: [ style ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  items = DemoCollection.find({});

  constructor() {
  }
}