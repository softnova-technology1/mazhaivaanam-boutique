import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    successResponse(res, coupons);
  } catch (error) { next(error); }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    successResponse(res, coupon, 'Coupon created', 201);
  } catch (error) { next(error); }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    Object.assign(coupon, req.body);
    await coupon.save();
    successResponse(res, coupon, 'Coupon updated');
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    successResponse(res, null, 'Coupon deleted');
  } catch (error) { next(error); }
};
