const express = require("express");
const {
  newOrder,
  getMyOrders,
  getOrderDetails,
  adminAllOrders,
  AdminUpdateOrder,
} = require("../Controllers/orderController");
const {
  addReviews,
  getAllReviews,
  AdminGetAllReviews,
  deleteReview,
} = require("../Controllers/reviewsController");
const route = express.Router();
const {
  userRegister,
  userLogin,
  changeUserPassword,
  getLoggedUser,
  sendUserPasswordResetEmail,
  userPasswordReset,
  loggedOutUser,
  adminGetAllUsers,
  AdminDeleteUser,
  adminUpdateUser,
} = require("../Controllers/userController");
const isAuthorized = require("../middleware/isAuthorized");
const isAuthUser = require("../middleware/isAuthUser");
const orderModel = require("../models/orderModel");

//Public Route
route.post("/register", userRegister);
route.post("/login", userLogin);
route.post("/send-reset-password-email", sendUserPasswordResetEmail);
route.post("/reset-password/:id/:token", userPasswordReset);

route.put("/changePassword", isAuthUser, changeUserPassword);
route.get("/getloggeduser", isAuthUser, getLoggedUser);
route.get("/logOut", isAuthUser, loggedOutUser);

// route.get("/my/orders", isAuthUser, getMyOrders);

route.post("/new/order", newOrder);
route.get("/my/orders",getMyOrders);
route.get("/my/order/:orderId", getOrderDetails);

route.post("/add/review", addReviews);
route.get("/get/reviews", getAllReviews);

//Admin Route
// route.get("/admin/orders", isAuthUser, isAuthorized, adminAllOrders);
route.get("/admin/orders",  adminAllOrders);
route.put("/update/order/:orderId",  AdminUpdateOrder);
route.get("/admin/user",  adminGetAllUsers);
route.delete("/admin/user/:userId",  AdminDeleteUser);
route.put("/admin/user/:userId",  adminUpdateUser);
route.get("/get/admin/reviews",  AdminGetAllReviews);
route.delete("/admin/review/:reviewId", deleteReview);

route.get('/my/all/orders/:id',async(req,res)=>{
  try {
    const userId = req?.params?.id;
    console.log("myorderss:",userId);
    if (userId) {
      const orders = await orderModel.find({ user: userId }).sort({ _id: -1 });
      res.status(200).json({
        success: true,
        message: "Orders Get SuccessFully",
        myOrders: orders,
      });
    } else {
      sendError(res, 400, "Invalid User Id ");
    }
  } catch (error) {
    console.log(error.message);
  }
})


route.post("/success", async (req, res) => {
  await orderModel.updateOne(
    { tran_id: req.body.tran_id },
    {
      $set: {
        payment: true,
      
      },
    }
  );
 
  res.redirect(`http://localhost:3000/order/success/${req.body.tran_id}`);
});


route.post("/fail", async (req, res) => {
  await orderModel.deleteOne({ tran_id: req.body.tran_id });
  res.redirect(`http://localhost:3000/`);
});

route.post("/cancel", async (req, res) => {
  await orderModel.deleteOne({ tran_id: req.body.tran_id });
  res.redirect(`http://localhost:3000/`);
});





module.exports = route;
