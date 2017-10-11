export default function raygunErrorFilter(error) {
  if (error && error.xhr && error.xhr.status && [401,403,409].includes(error.xhr.status)) {
    return null;
  } else {
    return error;
  }
}
