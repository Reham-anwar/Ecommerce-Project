
//////////////////////////////////////////////////////////////////
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema([
  {
    userId: {
      type:String,
      required: false,
  },
    userName: {
      type: String,
      required: true
    },
    cart: {
      totalQty: {
        type: Number,
        default: 0,
        required: true,
      },
      totalCost: {
        type: Number,
        default: 0,
        required: true,
      },
      items: [
        {
          productId: {
            type:String
          },
          qty: {
            type: Number,
            default: 0,
          },
          price: {
            type: Number,
            default: 0,
          },
          title: {
            type: String,
          },

        },
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

  }]);

const order = mongoose.model("order", orderSchema);

module.exports = order;
