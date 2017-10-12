export default function raygunErrorFilter(error) {
  if (error && error.xhr && error.xhr.status && [401,403,409].indexOf(error.xhr.status) > -1) {
    return null;
  } else {
    return error;
  }
}
