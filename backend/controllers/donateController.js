const crypto = require("crypto");
const { v4 } = require("uuid");
const Donate = require("../models/donateModel");

exports.createInvestmentOrder = async (req, res, next) => {
  const { donationAmount } = req.body;
  const donateId = "suyog" + "-" + v4() + "-" + req.user.id;
  console.log(
    "The project id and invest amount  is ",
    donateId,
    donationAmount,
  );
  const signature = this.createSignature(
    `total_amount=${donationAmount},transaction_uuid=${donateId},product_code=EPAYTEST`,
  );
  const formData = {
    amount: donationAmount,
    failure_url: "http://localhost:5173",
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    signature: signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: "http://localhost:3000/api/esewa/verify-payment",
    tax_amount: "0",
    total_amount: donationAmount,
    transaction_uuid: donateId,
  };

  res.json({
    message: "Order Created Sucessfully",
    formData,
    payment_method: "esewa",
  });
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8"),
    );
    console.log(decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "errror" });
    }
    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");
    console.log(message);

    const donateId = decodedData.transaction_uuid.split("-")[0];
    const decodedArray = decodedData.transaction_uuid.split("-");
    const userId = decodedArray[decodedArray.length - 1];
    console.log("The project id is " + donateId);

    if (decodedData.status !== "COMPLETE") {
      console.log("The status is not complete");
      return res.redirect(`http://localhost:5173/`);
    }

    const donation = new Donate({
      amount: decodedData.total_amount,
      user: userId,
    });

    await donation.save();

    res.redirect("http://localhost:5173/dashboard");
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};

exports.createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  // Get the digest in base64 format
  const hashInBase64 = hmac.digest("base64");
  return hashInBase64;
};

exports.getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donate.find({}).populate("user");
    return res.status(200).json({ donations });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err?.message || "No Orders found" });
  }
};
