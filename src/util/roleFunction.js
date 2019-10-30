var app = getApp();
var role = function (that) {
  var userInfo = wx.getStorageSync('userInfo') || {};
  var FunctionArray = userInfo.Function;
  if (!FunctionArray) {
    return false;
  }
  // console.log(FunctionArray);
  var Function = {};
  for (var i = 0; i < FunctionArray.length; i++) {
    // if (Function[i].)
    Function[FunctionArray[i].Id] = true;
  }
  // console.log(Function);
  Function['OwnerFlag'] = false;
  if (app.globalData.userInfo) {
    if (app.globalData.userInfo.OwnerFlag==='OWNER') {
      Function['OwnerFlag'] = true;
    }
  }
  that.setData({
    Function: Function
  });
  return Function;
};

module.exports = {
  role: role
}