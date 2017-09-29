import Ember from 'ember';

const { inject: { service }, Route } = Ember;

export default Route.extend({
  raygun: service(),
  auth: service(),

  activate() {
    this.get('raygun').setAnonymousUser();
  },

  actions: {
    submit(credentials) {
      this.get('auth').login(credentials);
    }
  }
});
