const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const sendError = require("../utils/sendError");
const SSLCommerzPayment = require("sslcommerz");
const { v4: uuidv4 } = require("uuid");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}







const newOrder = async (req, res) => {
  console.log(req.body);
  try {
    const data = {
      total_amount: req.body?.total,
      currency: "BDT",
      tran_id: uuidv4(),
      success_url: "http://localhost:8000/api/user/success",
      fail_url: "http://localhost:8000/api/user/fail",
      cancel_url: "http://localhost:8000/api/user/cancel",
      ipn_url: "http://yoursite.com/ipn",
      payment: false,
      shipping_method: "Courier",
      product_name: "Computer.",
      product_category: "Electronic", 
      product_profile: "general",
      cus_name: "Customer Name",
      cus_email: "cust@yahoo.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
      multi_card_name: "mastercard",
      value_a: "ref001_A",
      value_b: "ref002_B",
      value_c: "ref003_C",
      value_d: "ref004_D",
    };

    const { cartItems, shippingInfo, userId, total } = req.body;
    const newOrder = await orderModel.create({
      user: userId,
      shippingInfo: shippingInfo,
      total: total,
      tran_id:data.tran_id,
      payment:false
    });
    newOrder.orderItems = cartItems;
    await updateStock(cartItems);
    await newOrder.save();
    const sslcommer = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_SECRET_KEY,
      false
    ); //true for live default false for sandbox
    sslcommer.init(data).then((data) => {
      //process the response that got from sslcommerz
      //https://developer.sslcommerz.com/doc/v4/#returned-parameters
      // console.log(data);
      if (data.GatewayPageURL) {
        res.status(200).send({ paymentUrl: data.GatewayPageURL });
      } else {
        res.status(200).send({
          error: "SSL session was not successful",
        });
      }
    });




  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      error,
    });
  }
};






//update stock
const updateStock = (cartItems) => {
  cartItems.map(async (item) => {
    const product = await productModel.findById(item.id);
    product.stocks = product.stocks - item.quantity;
    await product.save();
  });
};

//Get Customer Orders
const getMyOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("myorder:",userId);
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
    sendError(res, 400, "Somethings Is Wrong..!!");
  }
};

//Get Customer Order Details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (orderId) {
      const order = await orderModel.findById(orderId);
      res.status(200).json({
        success: true,
        order,
      });
    } else {
      sendError(res, 400, "Invalid OrderId..!!");
    }
  } catch (error) {
    console.log(error.message);
    sendError(res, 400, "Somethings Is Wrong..!!");
  }
};

//get all orders admin
const adminAllOrders = async (req, res) => {
  try {
    const OrdersCount = await orderModel.find().countDocuments();
    const AllOrders = await orderModel
      .find()
      .sort({ _id: -1 })
      .populate("user");
    res.status(200).json({
      success: true,
      AllOrders,
      OrdersCount,
      message: "All Orders Get SuccessFully..!!",
    });
  } catch (error) {
    console.log(error);
    sendError(res, 400, "Somethings Went's Wrong..!!");
  }
};

//Admin Update Order
const AdminUpdateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (orderId) {
      const updatedOrder = await orderModel.findById(orderId);
      updatedOrder.status = req.body.oStatus;
      await updatedOrder.save();
      res.status(200).json({
        success: true,
        message: "Order Updated..!!",
        updatedOrder,
      });
    } else {
      sendError(res, 404, "Order Id Not Found");
    }
  } catch (error) {
    console.log(error.message);
    sendError(res, 400, "Somethings Went,s To Wrong..!!");
  }
};

module.exports = {
  newOrder,
  getMyOrders,
  getOrderDetails,
  adminAllOrders,
  AdminUpdateOrder,
};
