var merge = function () {
  var objects = [].slice.call(arguments);
  var returnObj = objects.shift();
  return objects.reduce(function (returnObj, obj) {
    return Object.keys(obj).reduce(function (returnObj, key) {
      returnObj[key] = obj[key];
      return returnObj;
    }, returnObj);
  }, returnObj);
};
