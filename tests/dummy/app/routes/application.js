import Ember from 'ember';

const { inject: { service }, Route } = Ember;

export default Route.extend({
  raygun: service(),

  activate() {
    let service = this.get('raygun');
    let id = service.getUser();
    if (id) {
      service.setUser(id);
    }
  },
});
