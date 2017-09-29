import Ember from 'ember';

const { inject: { service }, Service } = Ember;

export default Service.extend({
  raygun: service(),

  login(/*credentials*/) {
    // force an error to test Raygun crash reporting
    throw 'oops testing raygun error';
    // example login request, on sucess set the raygun user id
    /*
    let options = { method: 'POST', body: credentials };
    return window.fetch('/api/login', options)
      .then(response => response.json())
      .then(data => {
        // on success set the actual user id
        this.get('raygun').setUser(data.userId);
        return data;
      });
    */
  }
});
