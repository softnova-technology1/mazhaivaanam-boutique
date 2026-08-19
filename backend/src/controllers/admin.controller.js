import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import ContactInquiry from '../models/ContactInquiry.js';
import Inventory from '../models/Inventory.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * GET /api/admin/dashboard
 * Overview stats
 */
export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      pendingInquiries,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      ContactInquiry.countDocuments({ status: 'new' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      ]),
      Order.find()
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const revenue = revenueResult[0]?.total || 0;
    const paidOrders = revenueResult[0]?.count || 0;

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Low stock count
    const allInv = await Inventory.find().lean();
    const lowStockCount = allInv.filter((i) => {
      const available = i.totalStock - i.reserved - i.sold;
      return available <= i.lowStockThreshold && available > 0;
    }).length;
    const outOfStockCount = allInv.filter((i) => i.totalStock - i.reserved - i.sold <= 0).length;

    successResponse(res, {
      overview: {
        totalRevenue: revenue,
        totalOrders,
        paidOrders,
        totalUsers,
        totalProducts,
        pendingInquiries,
        lowStockCount,
        outOfStockCount,
      },
      statusBreakdown,
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/dashboard/sales?period=daily|weekly|monthly
 * Sales analytics
 */
export const getSalesAnalytics = async (req, res, next) => {
  try {
    const period = req.query.period || 'daily';
    const days = period === 'monthly' ? 365 : period === 'weekly' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let groupBy;
    if (period === 'daily') {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'weekly') {
      groupBy = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
    } else {
      groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          items: { $sum: { $size: '$items' } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    successResponse(res, { sales, topProducts });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .lean();
    successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    successResponse(res, user, 'User role updated');
  } catch (error) {
    next(error);
  }
};
