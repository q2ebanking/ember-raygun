import Ember from 'ember';

const { Controller, isEmpty } = Ember;

export default Controller.extend({
  actions: {
    authorize() {
      let credentials = document.forms.credentials;
      credentials = new FormData(credentials);
      let username = credentials.get('username');
      let password = credentials.get('password');
      if (isEmpty(username)) {
        alert('Please enter your username');
      } else if (isEmpty(password)) {
        alert('Please enter your password');
      } else {
        this.send('submit', credentials);
      }
    }
  }
});
