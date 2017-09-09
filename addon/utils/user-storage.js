/* global window */
import { uuid } from 'ember-raygun/utils/uuid';

export function getAnonymousId() {
  try {
    let key = 'raygunAnonymousUserId';
    let id = window.localStorage.getItem(key);
    if (!id) {
      id = uuid();
      window.localStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return uuid();
  }
}

export function removeAnonymousUserId() {
  try {
    window.localStorage.removeItem('raygunAnonymousUserId');
  } catch (e) {
    return;
  }
}

export function getUserId() {
  try {
    return window.localStorage.getItem('raygunUserId');
  } catch (e) {
    return;
  }
}

export function setUserId(id) {
  try {
    return window.localStorage.setItem('raygunUserId', id);
  } catch (e) {
    return;
  }
}

export function removeUserId() {
  try {
    window.localStorage.removeItem('raygunUserId');
  } catch (e) {
    return;
  }
}
