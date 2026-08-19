import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import Inventory from './src/models/Inventory.js';

/**
 * Seed Script — Migrates all hardcoded frontend data into MongoDB
 * Run: npm run seed
 */

// ============ CATEGORIES (from frontend Collections page) ============
const CATEGORIES = [
  { name: 'Everyday Elegance', subtitle: 'CASUAL & CHIC', description: 'Lightweight, breathable handloom sarees crafted for daily grace and effortless style.' },
  { name: 'Festive Glow', subtitle: 'CELEBRATION READY', description: 'Grand, opulent silk sarees designed for weddings, festivals, and momentous celebrations.' },
  { name: 'Style Studio', subtitle: 'MODERN TRENDS', description: 'Contemporary designer drapes that blend traditional craftsmanship with modern aesthetics.' },
  { name: 'Black Magic', subtitle: 'BOLD & BEAUTIFUL', description: 'Dramatic, deep-toned sarees that make a bold statement with rich textures and silver accents.' },
];

// ============ PRODUCTS (migrated from Catalog.jsx ALL_PRODUCTS) ============
const PRODUCTS = [
  { name: "Ruby Petal", category: "Everyday Elegance", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Wedding", price: 13000, mrpPrice: 15000, tag: "BESTSELLER", image: "/Images/cotton saree/0515ac1b-a928-4af5-a71c-7f5e033614e0_3aa.jpg", description: "Elegant ruby red handwoven pure silk saree adorned with heritage gold zari borders and temple motifs.", isFeatured: true },
  { name: "Sunset Glow", category: "Festive Glow", fabric: "Cotton", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Festival", price: 28599, mrpPrice: 32000, tag: "NEW ARRIVAL", image: "/Images/silk sarees/00812878-32a4-41c6-81ee-a66b8ca8275b_1.jpg", description: "Warm yellow and gold handloom cotton saree woven with traditional patterns, ideal for festive elegance.", isPreorder: true, preorderDeposit: 5000 },
  { name: "Snow Elegance", category: "Style Studio", fabric: "Pure Silk", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Wedding", price: 23799, mrpPrice: 27500, tag: "BESTSELLER", image: "/Images/Fancy Sarees/17f37732-5f2a-4c83-8505-8f115aa31f16_2.jpg", description: "Glistening white-gold Banarasi brocade saree featuring intricate gold jaal patterns.", isFeatured: true },
  { name: "Night Veil", category: "Black Magic", fabric: "Tussar", color: { name: "Navy", hex: "#1A237E" }, occasion: "Party Wear", price: 6149, mrpPrice: 7500, tag: "NEW ARRIVAL", image: "/Images/black magic collection/00960db2-0dce-4f77-adb1-53eaeaabf610_black lichi.webp", description: "Deep, mysterious indigo designer drape featuring delicate silver borders." },
  { name: "Azure Dream", category: "Everyday Elegance", fabric: "Pure Silk", color: { name: "Navy", hex: "#1A237E" }, occasion: "Wedding", price: 11769, mrpPrice: 14000, tag: "BESTSELLER", image: "/Images/cotton saree/070b3e79-f495-49e2-845a-97bf42bf31c0_6A.jpg", description: "Vibrant royal blue silk masterwork with gold border details, curated for bridal elegance.", isFeatured: true },
  { name: "Royal Orchid", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Reception", price: 9000, mrpPrice: 11000, tag: "BESTSELLER", image: "/Images/silk sarees/019afd9a-0bf9-49be-adde-9006ac3c2157_4.jpg", description: "Deep orchid purple silk saree with intricate floral vines woven in heavy gold thread work." },
  { name: "Golden Harvest", category: "Style Studio", fabric: "Cotton", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Traditional", price: 30849, mrpPrice: 35000, tag: "NEW ARRIVAL", image: "/Images/Fancy Sarees/1cc478b0-d027-42a5-9a05-660a74cb2cee_4.jpg", description: "Rich handloom cotton-silk blend in warm golden sand with delicate temple-motif borders." },
  { name: "Mystic Forest", category: "Black Magic", fabric: "Pure Silk", color: { name: "Emerald", hex: "#004D40" }, occasion: "Festival", price: 13769, mrpPrice: 16500, tag: "BESTSELLER", image: "/Images/black magic collection/dc8f7413-52de-45df-ae2b-f583cd625a37_Black.webp", description: "Deep emerald green silk brocade woven with intricate floral creepers and gold zari." },
  { name: "Ebony Scarlet", category: "Black Magic", fabric: "Tussar", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Reception", price: 43769, mrpPrice: 49999, tag: "BESTSELLER", image: "/Images/black magic collection/449a74ba-b1da-4dd6-8944-8c2abd5fabe0_1.webp", description: "Modern designer drape featuring rich scarlet highlights on an ebony dark background.", isPreorder: true, preorderDeposit: 5000 },
  { name: "Sienna Bloom", category: "Festive Glow", fabric: "Tussar", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Festival", price: 14500, mrpPrice: 17000, tag: "NEW ARRIVAL", image: "/Images/silk sarees/1546f1f8-5935-4aaf-b254-aa03321c05d8_love2.jpg", description: "Sienna golden-orange silk drape featuring fine floral zari border details and traditional design." },
  { name: "Lavender Mist", category: "Style Studio", fabric: "Organza", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Party Wear", price: 8999, mrpPrice: 11000, tag: "NEW ARRIVAL", image: "/Images/Fancy Sarees/362972a8-7932-4b84-b81a-070deec393c8_5.jpg", description: "Lightweight lavender organza saree detailed with silver thread borders and embroidery." },
  { name: "Crimson Heritage", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Wedding", price: 29500, mrpPrice: 34000, tag: "BESTSELLER", image: "/Images/silk sarees/42243c06-83ff-4105-9e2b-8326c2cb82fd_1aa.jpg", description: "Deep crimson Banarasi silk saree handwoven with dense gold zari and floral scroll patterns.", isPreorder: true, preorderDeposit: 5000 },
  { name: "Mint Charm", category: "Everyday Elegance", fabric: "Cotton", color: { name: "Emerald", hex: "#004D40" }, occasion: "Festival", price: 4200, mrpPrice: 5500, tag: "NEW ARRIVAL", image: "/Images/cotton saree/13f0796b-f293-4f56-b952-a68ff4103e74_5aaa.jpg", description: "Cool mint green handloom cotton saree with fine striped pallu and borders." },
  { name: "Ivory Symphony", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Wedding", price: 48000, mrpPrice: 55000, tag: "BESTSELLER", image: "/Images/silk sarees/843110c7-a279-42ef-aa3d-7e3d2db55af9_3.jpg", description: "Premium ivory Kanchipuram silk saree featuring exquisite double-warp gold zari and floral patterns.", isFeatured: true, isPreorder: true, preorderDeposit: 5000 },
  { name: "Marigold Breeze", category: "Everyday Elegance", fabric: "Cotton", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Traditional", price: 6500, mrpPrice: 7800, tag: "NEW ARRIVAL", image: "/Images/cotton saree/27370253-a11c-48e4-a346-4490675619f9_lg1.jpg", description: "Vibrant yellow handloom cotton drape, breathable and light with traditional motif details." },
  { name: "Coral Petals", category: "Style Studio", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Reception", price: 15200, mrpPrice: 18000, tag: "BESTSELLER", image: "/Images/Fancy Sarees/3a4308ae-3fba-4f36-9e14-a674ded902d0_4.jpg", description: "Stunning coral pink handloom pure silk saree with silver-gold borders and modern elements." },
  { name: "Indigo Weave", category: "Black Magic", fabric: "Pure Silk", color: { name: "Navy", hex: "#1A237E" }, occasion: "Festival", price: 18900, mrpPrice: 22000, tag: "BESTSELLER", image: "/Images/black magic collection/8020f4c5-a121-45dc-b191-92d8291154e5_2.webp", description: "Deep indigo blue Banarasi silk saree with silver butis and elegant brocade border." },
  { name: "Orchid Glow", category: "Everyday Elegance", fabric: "Organza", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Party Wear", price: 9800, mrpPrice: 12000, tag: "NEW ARRIVAL", image: "/Images/cotton saree/3235bee8-b44b-420a-959a-85f821aca634_1.jpg", description: "Premium orchid organza drape detailed with gold border lines and thread work." },
  { name: "Golden Azure", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Wedding", price: 34500, mrpPrice: 38000, tag: "BESTSELLER", image: "/Images/silk sarees/42243c06-83ff-4105-9e2b-8326c2cb82fd_1aa.jpg", description: "Exquisite blue and gold pure silk saree, perfect for grand wedding celebrations." },
  { name: "Emerald Night", category: "Black Magic", fabric: "Tussar", color: { name: "Emerald", hex: "#004D40" }, occasion: "Reception", price: 18500, mrpPrice: 21000, tag: "BESTSELLER", image: "/Images/black magic collection/dc8f7413-52de-45df-ae2b-f583cd625a37_Black.webp", description: "Deep dark emerald green silk with striking silver motifs for a bold look." },
  { name: "Ruby Charm", category: "Everyday Elegance", fabric: "Cotton", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Traditional", price: 5200, mrpPrice: 6500, tag: "NEW ARRIVAL", image: "/Images/cotton saree/0515ac1b-a928-4af5-a71c-7f5e033614e0_3aa.jpg", description: "Lightweight ruby red cotton handloom saree with delicate temple borders." },
  { name: "Silver Mist", category: "Style Studio", fabric: "Organza", color: { name: "Navy", hex: "#1A237E" }, occasion: "Party Wear", price: 11200, mrpPrice: 14000, tag: "NEW ARRIVAL", image: "/Images/Fancy Sarees/362972a8-7932-4b84-b81a-070deec393c8_5.jpg", description: "Ethereal silver and grey organza saree with minimal modern designs." },
  { name: "Autumn Leaves", category: "Festive Glow", fabric: "Tussar", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Festival", price: 13500, mrpPrice: 16000, tag: "BESTSELLER", image: "/Images/silk sarees/1546f1f8-5935-4aaf-b254-aa03321c05d8_love2.jpg", description: "Warm rustic orange tussar silk saree with earthy leaf motifs." },
  { name: "Midnight Sparkle", category: "Black Magic", fabric: "Pure Silk", color: { name: "Navy", hex: "#1A237E" }, occasion: "Party Wear", price: 21500, mrpPrice: 24000, tag: "BESTSELLER", image: "/Images/black magic collection/8020f4c5-a121-45dc-b191-92d8291154e5_2.webp", description: "Midnight black silk adorned with sparkling gold zari for a mesmerizing effect.", isPreorder: true, preorderDeposit: 5000 },
  { name: "Rose Blush", category: "Style Studio", fabric: "Organza", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Reception", price: 9500, mrpPrice: 12000, image: "/Images/Fancy Sarees/3a4308ae-3fba-4f36-9e14-a674ded902d0_4.jpg", description: "Delicate blush pink organza saree perfect for modern celebrations." },
  { name: "Ocean Breeze", category: "Everyday Elegance", fabric: "Cotton", color: { name: "Navy", hex: "#1A237E" }, occasion: "Traditional", price: 4800, mrpPrice: 5500, tag: "NEW ARRIVAL", image: "/Images/cotton saree/27370253-a11c-48e4-a346-4490675619f9_lg1.jpg", description: "Cool blue handloom cotton saree that offers comfort and style all day long." },
  { name: "Royal Heritage", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Wedding", price: 45000, mrpPrice: 50000, tag: "BESTSELLER", image: "/Images/silk sarees/843110c7-a279-42ef-aa3d-7e3d2db55af9_3.jpg", description: "Heavily woven Kanchipuram silk saree with rich red and gold royal patterns.", isFeatured: true },
];

// ============ PRE-ORDER PRODUCTS (from PreBooking.jsx) ============
const PREORDER_PRODUCTS = [
  { name: "Sona Roopa Kanjeevaram", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Maroon", hex: "#6B102A" }, occasion: "Wedding", price: 30600, mrpPrice: 34000, isPreorder: true, preorderProgress: 75, preorderWeaver: "Master Weaver Ramalingam", preorderEstimatedDays: 12, preorderDiscount: "10%", preorderDeposit: 5000, image: "/Images/saree11.png", description: "Exquisite gold and silver zari Kanjeevaram, meticulously hand-woven with traditional wedding temple motifs." },
  { name: "Shahi Shikargah Banarasi", category: "Festive Glow", fabric: "Pure Silk", color: { name: "Gold", hex: "#C8A34D" }, occasion: "Wedding", price: 41400, mrpPrice: 46000, isPreorder: true, preorderProgress: 50, preorderWeaver: "Master Weaver Kabir", preorderEstimatedDays: 22, preorderDiscount: "10%", preorderDeposit: 5000, image: "/Images/saree13.png", description: "Featuring complex hunting scenes woven in 24k gold zari, this Katan silk Banarasi is an imperial masterwork." },
  { name: "Chanderi Indigo Bloom", category: "Style Studio", fabric: "Pure Silk", color: { name: "Navy", hex: "#1A237E" }, occasion: "Party Wear", price: 18900, mrpPrice: 21000, isPreorder: true, preorderProgress: 90, preorderWeaver: "Artisan Meenakshi", preorderEstimatedDays: 5, preorderDiscount: "10%", preorderDeposit: 5000, image: "/Images/saree14.png", description: "Delicate Chanderi silk with hand-woven indigo floral butis, golden borders, and tissue pallu." },
  { name: "Organic Sage Cotton", category: "Everyday Elegance", fabric: "Cotton", color: { name: "Emerald", hex: "#004D40" }, occasion: "Festival", price: 11250, mrpPrice: 12500, isPreorder: true, preorderProgress: 40, preorderWeaver: "Weaver Kumar", preorderEstimatedDays: 28, preorderDiscount: "10%", preorderDeposit: 5000, image: "/Images/saree2.png", description: "Loom-woven pure organic cotton tinted with natural plant dyes, showcasing structural elegance and breathable weight." },
];

// ============ ADMIN USER ============
const ADMIN_USER = {
  firstName: 'Admin',
  lastName: 'Mazhai',
  email: 'admin@mazhaivaanam.com',
  phone: '+91 98765 43210',
  password: 'Admin@123',
  role: 'admin',
  isVerified: true,
};

async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
    ]);
    console.log('   ✅ Cleared existing data');

    // 1. Create admin user
    const admin = await User.create(ADMIN_USER);
    console.log(`   ✅ Admin user created: ${admin.email} (password: Admin@123)`);

    // 2. Create categories
    const categoryMap = {};
    for (const cat of CATEGORIES) {
      const created = await Category.create(cat);
      categoryMap[cat.name] = created._id;
    }
    console.log(`   ✅ ${CATEGORIES.length} categories created`);

    // 3. Create products
    const allProducts = [...PRODUCTS, ...PREORDER_PRODUCTS];
    let productCount = 0;
    for (const prod of allProducts) {
      const categoryId = categoryMap[prod.category];
      if (!categoryId) {
        console.warn(`   ⚠️  Category "${prod.category}" not found for "${prod.name}"`);
        continue;
      }

      const product = await Product.create({
        ...prod,
        category: categoryId,
        images: [{ url: prod.image, publicId: '' }],
      });

      // Create inventory entry
      await Inventory.create({
        product: product._id,
        totalStock: prod.isPreorder ? 1 : Math.floor(10 + Math.random() * 40),
        lowStockThreshold: 5,
      });

      productCount++;
    }
    console.log(`   ✅ ${productCount} products created with inventory`);

    // Summary
    const counts = {
      users: await User.countDocuments(),
      categories: await Category.countDocuments(),
      products: await Product.countDocuments(),
      inventory: await Inventory.countDocuments(),
    };
    console.log(`\n🎉 Seed complete!`);
    console.log(`   ├─ Users:      ${counts.users}`);
    console.log(`   ├─ Categories: ${counts.categories}`);
    console.log(`   ├─ Products:   ${counts.products}`);
    console.log(`   └─ Inventory:  ${counts.inventory}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
