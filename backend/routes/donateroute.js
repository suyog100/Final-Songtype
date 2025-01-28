const router = require("express").Router();

const express = require("express");
const {
  verifyPayment,
  createInvestmentOrder,
  getAllDonations,
} = require("../controllers/donateController");
const { authGuard } = require("../middleware/authguard");

router.get("/esewa/verify-payment", verifyPayment);
router.post("/esewa/donate", authGuard, createInvestmentOrder);

router.get("/donations/all", getAllDonations);

module.exports = router;
