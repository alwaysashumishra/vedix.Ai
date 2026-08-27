import Payment from "../models/Payment.js";
import User from "../models/User.js";

// User submits QR payment details
export const submitQRPayment = async (req, res) => {
  try {
    const { plan, amount, transactionId, note } = req.body;
    const user = req.user;

    if (!plan || !["Pro", "Premium"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected. Choose Pro or Premium.",
      });
    }

    if (!transactionId || transactionId.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid UPI Transaction ID / UTR reference (at least 6 characters).",
      });
    }

    const cleanTxId = transactionId.trim();

    // Check if duplicate transaction ID already submitted
    const existing = await Payment.findOne({ transactionId: cleanTxId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This transaction ID has already been submitted.",
      });
    }

    const payment = await Payment.create({
      userId: user._id,
      username: user.username,
      userEmail: user.email,
      plan,
      amount: Number(amount) || (plan === "Pro" ? 199 : 499),
      paymentMethod: "UPI_QR",
      transactionId: cleanTxId,
      note: String(note || "").slice(0, 300),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Payment request submitted successfully! Pending verification by admin.",
      payment,
    });
  } catch (error) {
    console.error("Submit Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit payment request.",
    });
  }
};

// Logged-in user fetches their payment history
export const getUserPayments = async (req, res) => {
  try {
    const user = req.user;
    const payments = await Payment.find({ userId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get User Payments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history.",
    });
  }
};

// Admin fetches all payment requests
export const getAdminPayments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const payments = await Payment.find(query).sort({ createdAt: -1 }).limit(100);

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get Admin Payments Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load payment requests.",
    });
  }
};

// Admin updates payment status (Approve / Reject)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment request not found.",
      });
    }

    payment.status = status;
    if (adminNote !== undefined) {
      payment.adminNote = adminNote;
    }

    await payment.save();

    // If approved, automatically update user's plan in User model!
    if (status === "approved") {
      await User.findByIdAndUpdate(payment.userId, { plan: payment.plan });
    }

    res.status(200).json({
      success: true,
      message: `Payment request marked as ${status}.` + (status === "approved" ? ` User upgraded to ${payment.plan} plan.` : ""),
      payment,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
    });
  }
};
