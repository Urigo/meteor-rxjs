export default {
  format: 'umd',
  globals: {
    'meteor/mongo': 'Package.mongo',
    'rxjs/Observable':'rxjs.Observable',
    'rxjs/Subject': 'rxjs.Subject',
    'meteor/meteor': 'Package.meteor',
    'meteor/tracker': 'Package.tracker',
    'rxjs/Subscriber': 'rxjs.Subscriber'
  }
};
