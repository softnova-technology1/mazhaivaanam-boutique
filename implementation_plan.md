# Add Dashboard Features

Implement the selected new features for the Admin Dashboard.

## Proposed Changes

### Backend Updates
#### [MODIFY] admin.controller.js
- Update `getDashboard` to include:
  - `salesByCategory`: Aggregate `items.category` from paid orders.
  - `topCities`: Aggregate `shippingAddress.city` from orders.
  - `discountStats`: Calculate total coupon/discount savings across paid orders.
  - `recentReviews`: Fetch the latest 5 reviews (if `Review` model exists).
  - `monthlyGrowth`: Calculate revenue from this month vs last month.
- Ensure all aggregations are efficient and handle empty states.

### Frontend Updates
#### [MODIFY] api.js
- (No changes needed, `dashboardAPI.getOverview` will automatically fetch the new data).

#### [MODIFY] Dashboard.jsx
- Add a new "Action Required / Alerts" section at the top.
- Add "Sales by Category" Pie/Doughnut chart.
- Add "Customer Locations" list/widget.
- Add "Coupon & Discount Performance" widget.
- Add "Recent Customer Reviews" widget.
- Update "Total Revenue" stat card to show the calculated `monthlyGrowth`.

## Verification Plan
### Manual Verification
- Review the Admin Dashboard page in the client application.
- Verify that the charts and widgets render without error.
- Verify that the aggregations from the backend match the shape expected by the frontend.
