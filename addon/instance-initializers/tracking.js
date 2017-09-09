import Ember from 'ember';

const { get, run: { scheduleOnce } } = Ember;

export function initialize(appInstance) {
  const router = appInstance.lookup('router:main');
  const service = appInstance.lookup('service:raygun');
  router.on('didTransition', function() {
    scheduleOnce('afterRender', this, () => {
      const page = get(this, 'url');
      service.pageView(page);
    });
  });
}

export default {
  name: 'pulse-tracking',
  initialize
};
