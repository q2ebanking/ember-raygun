/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-raygun',

  isDevelopingAddon: function() {
    return true;
  },

  contentFor: function(type/*, config*/) {
    let scripts = [];
    if (type === 'head-footer') {
      let txt = `!function(a,b,c,d,e,f,g,h){a.RaygunObject=e,a[e]=a[e]||function(){
(a[e].o=a[e].o||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],
f.async=1,f.src=d,g.parentNode.insertBefore(f,g),h=a.onerror,a.onerror=function(b,c,d,f,g){
h&&h(b,c,d,f,g),g||(g=new Error(b)),a[e].q=a[e].q||[],a[e].q.push({
e:g})}}(window,document,"script","//cdn.raygun.io/raygun4js/raygun.min.js","rg4js");
`;
      scripts.push(txt);
    }
    if (scripts.length > 0) {
      return '<script>' + scripts.join('') + '</script>';
    }
  }
};
