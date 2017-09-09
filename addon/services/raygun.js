/* global window,rg4js */
import Ember from 'ember';
import { getAnonymousId, removeAnonymousUserId, getUserId, removeUserId, setUserId } from 'ember-raygun/utils/user-storage';

const { Service } = Ember;

export default Service.extend({
  getUser() {
    return getUserId();
  },

  setUser(userId = null) {
    const isAnonymous = (userId === null);
    if (isAnonymous) {
      removeUserId();
    } else {
      removeAnonymousUserId();
      setUserId(userId);
    }
    const userInfo = {
      identifier: isAnonymous ? getAnonymousId() : userId,
      isAnonymous: isAnonymous,
    };
    rg4js('setUser', userInfo);
  },

  setAnonymousUser() {
    this.setUser(null);
  },

  clearUser() {
    removeUserId();
  },

  pageView(page) {
    rg4js('trackEvent', {
      type: 'pageView',
      path: page || '/' + window.location.pathname
    });
  },
});
