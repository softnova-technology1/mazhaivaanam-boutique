import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    successResponse(res, reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, text, name, location } = req.body;
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return errorResponse(res, 'Product not found', 404);

    // Check if user already reviewed
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return errorResponse(res, 'You have already reviewed this product', 409);

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      paymentStatus: 'paid',
    });

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      name: name || req.user.firstName,
      location: location || 'Verified Patron',
      rating,
      text,
      isVerified: !!hasPurchased,
      isApproved: false, // Needs admin approval
    });

    successResponse(res, review, 'Review submitted — pending approval', 201);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId, user: req.user._id });
    if (!review) return errorResponse(res, 'Review not found', 404);

    await review.deleteOne();

    // Recalculate product rating
    await recalculateRating(review.product);

    successResponse(res, null, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

// Admin: Approve review
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return errorResponse(res, 'Review not found', 404);

    review.isApproved = true;
    await review.save();

    // Recalculate product rating
    await recalculateRating(review.product);

    successResponse(res, review, 'Review approved');
  } catch (error) {
    next(error);
  }
};

// Admin: Get all pending reviews
export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('product', 'name slug images')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
    successResponse(res, reviews);
  } catch (error) {
    next(error);
  }
};

// Helper: Recalculate product average rating
async function recalculateRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { averageRating: 0, reviewCount: 0 });
  }
}
