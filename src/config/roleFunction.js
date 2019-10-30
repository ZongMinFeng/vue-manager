module.exports = {
  Function: [{
    FunctionId: "goodsAction",
    FunctionParentId: "99",
    FunctionName: "商品管理",
    Lavel: 1,      // 层级
    ChoseFlag: 2   // 1:选中，2:未选择，3：子元素有选择
  }, {
    FunctionId: "goodsQry",
    FunctionParentId: "goodsAction",
    FunctionName: "商品查询",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "goodsAdd",
    FunctionParentId: "goodsAction",
    FunctionName: "商品新增",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "goodsDel",
    FunctionParentId: "goodsAction",
    FunctionName: "商品删除",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "goodsUpt",
    FunctionParentId: "goodsAction",
    FunctionName: "商品修改",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "typeAdd",
    FunctionParentId: "goodsAction",
    FunctionName: "商品分类新增",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "typeDel",
    FunctionParentId: "goodsAction",
    FunctionName: "商品分类删除",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "typeUpt",
    FunctionParentId: "goodsAction",
    FunctionName: "商品分类修改",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "barCodeQryGoods",
    FunctionParentId: "goodsAction",
    FunctionName: "条形码查询商品",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "payType",
    FunctionParentId: "99",
    FunctionName: "支付方式管理",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "casher",
    FunctionParentId: "99",
    FunctionName: "收款管理",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "genBill",
    FunctionParentId: "99",
    FunctionName: "开单管理",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "myTrans",
    FunctionParentId: "99",
    FunctionName: "我的收入",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "voidSale",
    FunctionParentId: "myTrans",
    FunctionName: "交易撤销",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "refund",
    FunctionParentId: "myTrans",
    FunctionName: "交易退货",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "storeAction",
    FunctionParentId: "99",
    FunctionName: "店铺管理",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "qrySubStores",
    FunctionParentId: "storeAction",
    FunctionName: "查询子店铺",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "addSubStore",
    FunctionParentId: "storeAction",
    FunctionName: "新增子店铺",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "operQry",
    FunctionParentId: "storeAction",
    FunctionName: "查询店铺操作员列表",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "getTids",
    FunctionParentId: "storeAction",
    FunctionName: "查询当前店铺终端",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "getStoreIncome",
    FunctionParentId: "storeAction",
    FunctionName: "查询当前店铺收入",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "roleQry",
    FunctionParentId: "storeAction",
    FunctionName: "查询店铺角色列表",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "roleAdd",
    FunctionParentId: "storeAction",
    FunctionName: "新增店铺角色",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "rolePriUpt",
    FunctionParentId: "storeAction",
    FunctionName: "修改店铺角色权限",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "roleDel",
    FunctionParentId: "storeAction",
    FunctionName: "删除店铺角色",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "operAdd",
    FunctionParentId: "storeAction",
    FunctionName: "新增操作员",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "operDel",
    FunctionParentId: "storeAction",
    FunctionName: "删除操作员",
    Lavel: 2,
    ChoseFlag: 2
  }, {
    FunctionId: "userAction",
    FunctionParentId: "99",
    FunctionName: "用户管理",
    Lavel: 1,
    ChoseFlag: 2
  }, {
    FunctionId: "operRolesUpt",
    FunctionParentId: "userAction",
    FunctionName: "修改操作员角色",
    Lavel: 2,
    ChoseFlag: 2
  }]
}
