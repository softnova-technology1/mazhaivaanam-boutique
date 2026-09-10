import { useState, useEffect, useRef } from 'react';
import { offerAPI, uploadAPI, productAPI, categoryAPI, fabricAPI } from '../api/api.js';
import { Sparkles, Clock, Gift, Layers, Disc, Save, CheckCircle, RefreshCw, Upload, Package, Trash2, Edit2, Plus, X, Search } from 'lucide-react';

const ImageUploaderInput = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res && res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        alert('Image uploaded but no URL returned');
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input 
          type="text" 
          className="form-input" 
          value={value || ''} 
          placeholder="/Images/... or http://..."
          onChange={e => onChange(e.target.value)} 
          style={{ flex: 1 }}
        />
        <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: 0, padding: '8px 16px', whiteSpace: 'nowrap' }}>
          <Upload size={15} />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
      {value && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={value} alt="Preview" style={{ height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image Preview</span>
        </div>
      )}
    </div>
  );
};

const SareeImageUploaderCard = ({ title, subtitle, value, onChange, isPrimary = false }) => {
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res && res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        alert('Image uploaded but no URL returned');
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', margin: 0 }}>
          {title} {isPrimary && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
        {subtitle && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>

      {value ? (
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3/4',
            borderRadius: 12,
            overflow: 'hidden',
            border: '2px solid var(--primary)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            background: '#f8fafc',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <img 
            src={value} 
            alt={title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
          />

          {/* Badge */}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(0, 0, 0, 0.7)', color: '#fff',
            padding: '3px 8px', borderRadius: 4, fontSize: '0.72rem',
            fontWeight: 700, backdropFilter: 'blur(4px)'
          }}>
            3:4 Preview
          </div>

          {/* Hover Action Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(3px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s'
          }}>
            <label className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: 0 }}>
              <Upload size={14} /> Change Image
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
            </label>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => onChange('')}
            >
              <Trash2 size={14} /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          width: '100%',
          aspectRatio: '3/4',
          border: '2px dashed #cbd5e1',
          borderRadius: 12,
          background: '#f8fafc',
          cursor: uploading ? 'wait' : 'pointer',
          padding: 16,
          textAlign: 'center',
          transition: 'all 0.2s',
          position: 'relative'
        }}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
          
          <div style={{ background: '#f1f5f9', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: '1px solid #e2e8f0' }}>
            {uploading ? <RefreshCw className="spinner" size={22} color="var(--primary)" /> : <Upload size={22} color="#64748b" />}
          </div>
          
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', marginBottom: 4 }}>
            {uploading ? 'Uploading to S3...' : `Upload ${title}`}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600, marginBottom: 2 }}>
            Max 5MB (Suitable for S3 Bucket)
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            Recommended Ratio: 3:4 (e.g. 600×800px)
          </span>
        </label>
      )}

      {/* Manual URL entry fallback */}
      <div style={{ marginTop: 8 }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Or paste image URL (e.g. /Images/... or https://...)" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
          style={{ fontSize: '0.78rem', padding: '5px 10px' }}
        />
      </div>
    </div>
  );
};

export default function LimitedOfferAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [selectedSectionSlot, setSelectedSectionSlot] = useState(1);

  // ——————————————————————————————————————————————————————————————————————————
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionSaving, setSectionSaving] = useState(false);
  // Create section form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', slot: 1, startDate: '', endDate: '' });
  // Product picker modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [fabricsList, setFabricsList] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerEndDate, setOfferEndDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
  const [targetSectionId, setTargetSectionId] = useState(null);

  // Direct Saree Creation Modal states
  const [showCreateSareeModal, setShowCreateSareeModal] = useState(false);
  const [sareeForm, setSareeForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    fabric: '',
    price: '',
    mrpPrice: '',
    discountPercent: 0,
    discountAmount: 0,
    stockQuantity: 10,
    tag: 'LIMITED EDITION',
    primaryImage: '',
    secondaryImage1: '',
    secondaryImage2: '',
    weight: '500g',
    height: '45 inches',
    sareeLength: '5.5 meters',
    blouseLength: '0.8 meters',
    pattern: '',
    pallu: '',
    blouse: '',
    washCare: 'Dry Clean Only',
    returnPolicy: '7 Days Returnable',
    note: '',
    offerTitle: '',
    offerEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  // Edit section
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState({});
  // Product picker per section
  const [addingProductTo, setAddingProductTo] = useState(null); // sectionId
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);


  const [config, setConfig] = useState({
    heroSection: {
      badgeText: 'Limited Exclusive Offer',
      title: 'Exclusive Offers,',
      titleItalic: 'Limited Time',
      subtitle: 'Enjoy special prices on selected sarees for a limited period. Elevate your wardrobe with premium collections while these exclusive offers last.',
      bgImage: '/Images/limited.png',
      primaryCtaText: 'EXPLORE COLLECTION',
      secondaryCtaText: 'OUR HERITAGE',
    },
    timerSection: {
      badgeText: 'Time is running out',
      title: 'The Grand Gala Sale',
      description: 'Our most prestigious annual celebration ends soon. Secure your heritage pieces today before they return to the vault.',
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
    featuredDuoSection: {
      badgeText: 'Curated Festival Duo',
      heading: 'The Heritage Gift',
      subHeading: 'Buy 2 Sarees, Get 1 Free',
      description: 'Embrace the timeless tradition of gifting. Choose from our exquisite hand-woven silk collections and receive a complimentary heritage piece as a symbol of our festive gratitude.',
      image: '/Images/heritage.png',
      ctaText: 'Explore Collection',
    },
    offerProductsSection: {
      badgeText: 'Festive Deals',
      heading: 'Exclusive Offers',
      productTag: 'LIMITED OFFER',
    },
    eligibleGallerySection: {
      badgeText: 'Eligible Selection',
      heading: 'The Buy 2 Get 1 Gallery',
    },
    curationOfJoySection: {
      badgeText: 'Curation of Joy',
      heading: 'Bespoke Offer Tiers',
      cards: [
        { title: 'Diwali Offers', discountBadge: 'UP TO 40%', image: '/Images/diwali.png', linkTab: 'catalog' },
        { title: 'Bridal Offers', discountBadge: '20% OFF', image: '/Images/bridal.png', linkTab: 'catalog' },
        { title: 'Combo Set', discountBadge: 'SAVE 5K', image: '/Images/wedding.png', linkTab: 'catalog' },
      ],
    },
    spinningWheelSection: {
      title: 'Festival Lucky Draw',
      description: 'Spin the heritage wheel for a chance to win exclusive gift cards, artisan blouses, or a signature silk saree from our royal vault.',
      bulletPoints: [
        'Grand Prize: Royal Banarasi Saree',
        'Gift Cards worth ₹ 10,000',
        'Artisan Blouse Customizations',
      ],
      prizes: [
        'Premium Saree',
        '10% Discount',
        'Free Styling',
        'Surprise Box',
        'Artisan Blouse',
        'Free Shipping',
      ],
    },
  });

  const searchContainerRef = useRef(null);

  useEffect(() => {
    loadConfig();
    categoryAPI.getAll().then(res => setCategoriesList(res.data || [])).catch(() => {});
    fabricAPI.getAll().then(res => setFabricsList(res.data || [])).catch(() => {});
  }, []);

  const openCreateSareeModal = (slotNum, existingSection = null) => {
    setSelectedSectionSlot(slotNum);
    setTargetSectionId(existingSection ? existingSection._id : null);
    setSareeForm({
      name: '',
      shortDescription: '',
      description: '',
      category: '',
      fabric: '',
      price: '',
      mrpPrice: '',
      discountPercent: 0,
      discountAmount: 0,
      stockQuantity: '',
      tag: 'None',
      primaryImage: '',
      secondaryImage1: '',
      secondaryImage2: '',
      weight: '',
      height: '',
      sareeLength: '',
      blouseLength: '',
      pattern: '',
      pallu: '',
      blouse: '',
      washCare: '',
      returnPolicy: '',
      note: '',
      isFeatured: false,
      isActive: true,
      isScheduled: false,
      scheduledAt: '',
      offerTitle: existingSection ? existingSection.name : (slotNum === 1 ? 'Exclusive Saree Offer' : 'Buy 2 Get 1 Saree Special'),
      offerEndDate: existingSection ? new Date(existingSection.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
    setShowCreateSareeModal(true);
  };

  const handleCreateNewSaree = async () => {
    const name = (sareeForm.name || '').trim();
    if (!name) {
      alert('Please enter a Product Name for the saree.');
      return;
    }
    if (!sareeForm.price || Number(sareeForm.price) <= 0) {
      alert('Please enter a valid Sale Price (₹) for the saree.');
      return;
    }
    if (!sareeForm.primaryImage) {
      alert('Please upload a Primary Image (or paste image URL) for the saree.');
      return;
    }

    const finalCategory = sareeForm.category || categoriesList[0]?._id;
    if (!finalCategory) {
      alert('No product category found. Please add a category first.');
      return;
    }
    const finalFabric = sareeForm.fabric || fabricsList[0]?.name || 'Kanchipuram Silk';

    setSectionSaving(true);
    try {
      const images = [{ url: sareeForm.primaryImage }];
      if (sareeForm.secondaryImage1) images.push({ url: sareeForm.secondaryImage1 });
      if (sareeForm.secondaryImage2) images.push({ url: sareeForm.secondaryImage2 });

      const createPayload = {
        name,
        shortDescription: sareeForm.shortDescription || '',
        description: sareeForm.description || '',
        category: finalCategory,
        fabric: finalFabric,
        price: Number(sareeForm.price),
        mrpPrice: Number(sareeForm.mrpPrice || 0),
        tag: sareeForm.tag && sareeForm.tag !== 'None' ? sareeForm.tag : null,
        images,
        stock: Number(sareeForm.stockQuantity || 10),
        isFeatured: Boolean(sareeForm.isFeatured),
        isActive: sareeForm.isActive !== undefined ? Boolean(sareeForm.isActive) : true,
        isScheduled: Boolean(sareeForm.isScheduled),
        scheduledAt: sareeForm.isScheduled && sareeForm.scheduledAt ? sareeForm.scheduledAt : null,
        specs: {
          weight: sareeForm.weight || '',
          height: sareeForm.height || '',
          length: sareeForm.sareeLength || '',
          blouseLength: sareeForm.blouseLength || '',
          pattern: sareeForm.pattern || '',
          pallu: sareeForm.pallu || '',
          blousePiece: sareeForm.blouse || '',
          washCare: sareeForm.washCare || '',
        },
        weight: sareeForm.weight || '',
        pattern: sareeForm.pattern || '',
        pallu: sareeForm.pallu || '',
        sareeLength: sareeForm.sareeLength || '',
        blouseLength: sareeForm.blouseLength || '',
        blouse: sareeForm.blouse || '',
        height: sareeForm.height || '',
        washCare: sareeForm.washCare || '',
        returnPolicy: sareeForm.returnPolicy || '',
        note: sareeForm.note || '',
      };

      console.log('Sending Create Payload:', createPayload);
      const resProd = await productAPI.create(createPayload);
      const createdProd = resProd?.data || resProd;

      if (!createdProd?._id) {
        throw new Error('Saree created but product ID was not returned');
      }

      // Always create a dedicated new section for this saree product
      const secRes = await offerAPI.createSection({
        name: sareeForm.offerTitle || (selectedSectionSlot === 1 ? 'Exclusive Offers' : 'Buy 2 Get 1 Gallery'),
        slot: selectedSectionSlot,
        endDate: sareeForm.offerEndDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        startDate: null,
      });
      const secId = secRes?.data?._id || secRes?._id || secRes?.data?.data?._id;

      if (secId && createdProd._id) {
        await offerAPI.addProductToSection(secId, createdProd._id);
      }

      setShowCreateSareeModal(false);
      setToastMsg(`Saree "${createdProd.name || name}" created & added to Limited Offer!`);
      setTimeout(() => setToastMsg(''), 4000);
      await loadSections();
    } catch (err) {
      console.error('Create Saree Error:', err);
      alert('Failed to create saree: ' + (err.response?.data?.message || err.message));
    }
    setSectionSaving(false);
  };

  useEffect(() => {
    if (activeTab === 'section1' || activeTab === 'section2' || activeTab === 'products') loadSections();
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openProductPicker = async (slotNum, existingSection = null) => {
    setSelectedSectionSlot(slotNum);
    setTargetSectionId(existingSection ? existingSection._id : null);
    setSelectedProductIds([]);
    setPickerSearch('');
    setPickerCategory('');
    setOfferTitle(existingSection ? existingSection.name : (slotNum === 1 ? 'Exclusive Offers Sale' : 'Buy 2 Get 1 Festive Special'));
    setOfferEndDate(existingSection ? new Date(existingSection.endDate).toISOString().slice(0, 16) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setShowProductModal(true);
    setPickerLoading(true);
    try {
      const res = await productAPI.getAll('limit=100');
      const prods = res?.data?.products || res?.products || (Array.isArray(res?.data) ? res.data : []);
      setPickerProducts(prods);
    } catch (err) {
      console.error('Error loading products for picker:', err);
    }
    setPickerLoading(false);
  };

  const handleSaveModalProducts = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least 1 saree to add.');
      return;
    }
    if (!offerEndDate) {
      alert('Please select an offer end date and time.');
      return;
    }
    setSectionSaving(true);
    try {
      for (const pId of selectedProductIds) {
        const res = await offerAPI.createSection({
          name: offerTitle || (selectedSectionSlot === 1 ? 'Exclusive Offers' : 'Buy 2 Get 1 Gallery'),
          slot: selectedSectionSlot,
          endDate: offerEndDate,
          startDate: null,
        });
        const secId = res?.data?._id || res?._id || res?.data?.data?._id;
        if (secId) {
          await offerAPI.addProductToSection(secId, pId);
        }
      }
      setToastMsg(`${selectedProductIds.length} saree(s) added successfully to offer!`);
      setTimeout(() => setToastMsg(''), 4000);
      setShowProductModal(false);
      setSelectedProductIds([]);
      await loadSections();
    } catch (err) {
      alert(err.message || 'Failed to add sarees to offer');
    }
    setSectionSaving(false);
  };


  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await offerAPI.getConfig();
      if (res && res.data) {
        const d = res.data;
        setConfig(prev => ({
          heroSection: { ...prev.heroSection, ...(d.heroSection || {}) },
          timerSection: {
            ...prev.timerSection,
            ...(d.timerSection || {}),
            endDate: d.timerSection?.endDate ? new Date(d.timerSection.endDate).toISOString().slice(0, 16) : prev.timerSection.endDate
          },
          featuredDuoSection: { ...prev.featuredDuoSection, ...(d.featuredDuoSection || {}) },
          offerProductsSection: { ...prev.offerProductsSection, ...(d.offerProductsSection || {}) },
          eligibleGallerySection: { ...prev.eligibleGallerySection, ...(d.eligibleGallerySection || {}) },
          curationOfJoySection: {
            ...prev.curationOfJoySection,
            ...(d.curationOfJoySection || {}),
            cards: d.curationOfJoySection?.cards?.length ? d.curationOfJoySection.cards : prev.curationOfJoySection.cards
          },
          spinningWheelSection: {
            ...prev.spinningWheelSection,
            ...(d.spinningWheelSection || {}),
            bulletPoints: d.spinningWheelSection?.bulletPoints?.length ? d.spinningWheelSection.bulletPoints : prev.spinningWheelSection.bulletPoints,
            prizes: d.spinningWheelSection?.prizes?.length === 6 ? d.spinningWheelSection.prizes : prev.spinningWheelSection.prizes
          },
        }));
      }
    } catch (err) {
      console.error('Error loading offer config:', err);
    }
    setLoading(false);
  };


  // ——————————————————————————————————————————————————————————————————————————
  const loadSections = async () => {
    setSectionsLoading(true);
    try {
      const res = await offerAPI.getSections();
      if (res?.data) {
        let rawSections = res.data;
        let modified = false;

        for (const sec of rawSections) {
          if (sec.productIds && sec.productIds.length > 1) {
            modified = true;
            const productsToSplit = sec.productIds.slice(1);
            for (const prod of productsToSplit) {
              const pId = typeof prod === 'object' ? (prod._id || prod.id) : prod;
              if (pId) {
                await offerAPI.removeProductFromSection(sec._id, pId);
                const newSecRes = await offerAPI.createSection({
                  name: sec.name,
                  slot: sec.slot,
                  endDate: sec.endDate,
                  startDate: sec.startDate,
                });
                const newSecId = newSecRes?.data?._id || newSecRes?._id || newSecRes?.data?.data?._id;
                if (newSecId) {
                  await offerAPI.addProductToSection(newSecId, pId);
                  if (sec.isActive === false) {
                    await offerAPI.updateSection(newSecId, { isActive: false });
                  }
                }
              }
            }
          }
        }

        if (modified) {
          const reRes = await offerAPI.getSections();
          if (reRes?.data) setSections(reRes.data);
        } else {
          setSections(rawSections);
        }
      }
    } catch (err) { console.error('Error loading sections:', err); }
    setSectionsLoading(false);
  };

  const handleCreateSection = async () => {
    if (!createForm.name || !createForm.endDate) {
      alert('Section name and end date are required.');
      return;
    }
    setSectionSaving(true);
    try {
      await offerAPI.createSection({ ...createForm, slot: Number(createForm.slot) });
      setShowCreateForm(false);
      setCreateForm({ name: '', description: '', slot: 1, startDate: '', endDate: '' });
      setToastMsg('Offer section created!');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleUpdateSection = async (sectionId) => {
    setSectionSaving(true);
    try {
      await offerAPI.updateSection(sectionId, editSectionForm);
      setEditSectionId(null);
      setEditSectionForm({});
      setToastMsg('Section updated!');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleDeleteSection = async (sectionId, name) => {
    if (!window.confirm(`Delete offer section "${name}"? Products will NOT be deleted.`)) return;
    setSectionSaving(true);
    try {
      await offerAPI.deleteSection(sectionId);
      setToastMsg('Section deleted.');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleToggleSectionActive = async (section, targetProduct) => {
    setSectionSaving(true);
    try {
      let secIdToUpdate = section._id;
      const products = section.productIds || [];
      const pId = targetProduct ? (typeof targetProduct === 'object' ? (targetProduct._id || targetProduct.id) : targetProduct) : null;

      if (products.length > 1 && pId) {
        await offerAPI.removeProductFromSection(section._id, pId);
        const newSecRes = await offerAPI.createSection({
          name: section.name,
          slot: section.slot,
          endDate: section.endDate,
          startDate: section.startDate,
        });
        secIdToUpdate = newSecRes?.data?._id || newSecRes?._id || newSecRes?.data?.data?._id;
        if (secIdToUpdate) {
          await offerAPI.addProductToSection(secIdToUpdate, pId);
        }
      }

      await offerAPI.updateSection(secIdToUpdate, { isActive: !section.isActive });
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleExtendOffer = async (section, targetProduct) => {
    setSectionSaving(true);
    try {
      let secIdToUpdate = section._id;
      const products = section.productIds || [];
      const pId = targetProduct ? (typeof targetProduct === 'object' ? (targetProduct._id || targetProduct.id) : targetProduct) : null;

      if (products.length > 1 && pId) {
        await offerAPI.removeProductFromSection(section._id, pId);
        const newSecRes = await offerAPI.createSection({
          name: section.name,
          slot: section.slot,
          endDate: section.endDate,
          startDate: section.startDate,
        });
        secIdToUpdate = newSecRes?.data?._id || newSecRes?._id || newSecRes?.data?.data?._id;
        if (secIdToUpdate) {
          await offerAPI.addProductToSection(secIdToUpdate, pId);
        }
      }

      const baseTime = (section.endDate && !isNaN(new Date(section.endDate).getTime())) ? new Date(section.endDate).getTime() : Date.now();
      const newEnd = new Date(Math.max(Date.now(), baseTime) + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
      await offerAPI.updateSection(secIdToUpdate, { endDate: newEnd });
      setToastMsg(`Offer extended by 3 days for "${targetProduct?.name || section.name}"!`);
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert('Failed to extend offer: ' + err.message); }
    setSectionSaving(false);
  };

  // Product search within a section
  const handleProductSearch = async (q) => {
    setProductSearch(q);
    setSearchLoading(true);
    try {
      const query = q && q.trim() ? `search=${encodeURIComponent(q.trim())}&limit=12` : 'limit=12';
      const res = await productAPI.getAll(query);
      const prods = res?.data?.products || res?.products || (Array.isArray(res?.data) ? res.data : []);
      setSearchResults(prods);
    } catch (err) {
      console.error('Error fetching products for offer:', err);
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleAddProductToSection = async (sectionId, product) => {
    setSectionSaving(true);
    try {
      await offerAPI.addProductToSection(sectionId, product._id);
      setAddingProductTo(null);
      setProductSearch('');
      setSearchResults([]);
      setToastMsg(`"${product.name}" added to section!`);
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleRemoveProductFromSection = async (sectionId, productId, productName) => {
    const pId = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    if (!pId) {
      alert('Invalid product ID');
      return;
    }
    const pName = productName || (typeof productId === 'object' ? productId.name : 'Saree');
    if (!window.confirm(`Remove "${pName}" from this offer section?`)) return;
    setSectionSaving(true);
    try {
      await offerAPI.removeProductFromSection(sectionId, pId);

      const sec = sections.find(s => s._id === sectionId);
      if (sec) {
        const remainingProds = (sec.productIds || []).filter(p => {
          const id = typeof p === 'object' ? p._id : p;
          return id !== pId;
        });
        if (remainingProds.length === 0) {
          await offerAPI.deleteSection(sectionId);
        }
      }

      setToastMsg(`"${pName}" removed from offer section.`);
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) {
      console.error('Remove Product Error:', err);
      alert('Failed to remove saree: ' + (err.response?.data?.message || err.message));
    }
    setSectionSaving(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await offerAPI.updateConfig(config);
      if (res && res.success) {
        setToastMsg('Limited Offer page configuration saved & updated live!');
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        alert(res?.message || 'Failed to save config');
      }
    } catch (err) {
      console.error('Save config error:', err);
      alert('Failed to save config: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="loader"><div className="spinner" /></div>;
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles color="var(--primary)" size={28} /> Limited Offer Page Manager
          </h1>
          <p className="page-subtitle">Customize all sections, countdown timer, banner images, offer tiers & wheel prizes for customer storefront.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}
        >
          {saving ? <RefreshCw className="spinner" size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Live Configuration'}
        </button>
      </div>

      {toastMsg && (
        <div style={{
          background: 'rgba(22, 163, 74, 0.15)',
          border: '1px solid #16a34a',
          color: '#16a34a',
          padding: '12px 20px',
          borderRadius: 8,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600
        }}>
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        {[
          { id: 'hero', label: 'Hero Banner', icon: Sparkles },
          { id: 'timer', label: 'Countdown Timer', icon: Clock },
          { id: 'duo', label: 'Curated Duo', icon: Gift },
          { id: 'tiers', label: 'Bespoke Offer Tiers', icon: Layers },
          { id: 'wheel', label: 'Spinning Wheel', icon: Disc },
          { id: 'section1', label: 'Exclusive Offers (Grid)', icon: Package },
          { id: 'section2', label: 'Buy 2 Get 1 Gallery (Carousel)', icon: Gift },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab(t.id);
              if (t.id === 'section1') setSelectedSectionSlot(1);
              if (t.id === 'section2') setSelectedSectionSlot(2);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="card" style={{ padding: 28 }}>
        
        {/* TAB 1: HERO BANNER */}
        {activeTab === 'hero' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              1. Hero Banner Settings
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Top Pill Badge Text</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.heroSection.badgeText} 
                onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, badgeText: e.target.value } })} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Title Main Part</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.heroSection.title} 
                  onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, title: e.target.value } })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title Italic Highlight (Text Carousel Words - Comma Separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.heroSection.titleItalic} 
                  placeholder="e.g. Limited Time, Festive Deals, Royal Vault, Handloom Luxury"
                  onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, titleItalic: e.target.value } })} 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Enter multiple 2-word phrases separated by comma (,) to automatically animate in the carousel.
                </span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Subtitle Description</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={config.heroSection.subtitle} 
                onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, subtitle: e.target.value } })} 
              />
            </div>
            
            {/* Image Uploader for Hero Banner */}
            <ImageUploaderInput 
              label="Hero Background Image" 
              value={config.heroSection.bgImage} 
              onChange={url => setConfig({ ...config, heroSection: { ...config.heroSection, bgImage: url } })} 
            />
          </div>
        )}

        {/* TAB 2: COUNTDOWN TIMER */}
        {activeTab === 'timer' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              2. Countdown Timer & Event Settings
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Timer Badge Sub-Label</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.timerSection.badgeText} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, badgeText: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Event Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.timerSection.title} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, title: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Description</label>
              <textarea 
                className="form-input" 
                rows="2" 
                value={config.timerSection.description} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, description: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Event Expiry Date & Time</label>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={config.timerSection.endDate} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, endDate: e.target.value } })} 
              />
            </div>
          </div>
        )}

        {/* TAB 3: CURATED FESTIVAL DUO */}
        {activeTab === 'duo' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              3. Curated Festival Duo Section
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Section Tag Label</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.featuredDuoSection.badgeText} 
                onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, badgeText: e.target.value } })} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Main Heading</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.featuredDuoSection.heading} 
                  onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, heading: e.target.value } })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Sub-Heading / Tagline</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.featuredDuoSection.subHeading} 
                  onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, subHeading: e.target.value } })} 
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Description Text</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={config.featuredDuoSection.description} 
                onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, description: e.target.value } })} 
              />
            </div>
            
            {/* Image Uploader for Curated Duo */}
            <ImageUploaderInput 
              label="Curated Duo Banner Image" 
              value={config.featuredDuoSection.image} 
              onChange={url => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, image: url } })} 
            />
          </div>
        )}

        {/* TAB 4: BESPOKE OFFER TIERS */}
        {activeTab === 'tiers' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              4. Bespoke Offer Tier Cards (Curation of Joy)
            </h3>
            {config.curationOfJoySection.cards.map((card, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 12 }}>Card #{idx + 1}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label className="form-label">Card Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={card.title} 
                      onChange={e => {
                        const updated = [...config.curationOfJoySection.cards];
                        updated[idx].title = e.target.value;
                        setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                      }} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Discount Badge Text</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={card.discountBadge} 
                      onChange={e => {
                        const updated = [...config.curationOfJoySection.cards];
                        updated[idx].discountBadge = e.target.value;
                        setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                      }} 
                    />
                  </div>
                </div>

                {/* Card Image Uploader */}
                <ImageUploaderInput 
                  label={`Card #${idx + 1} Image`} 
                  value={card.image} 
                  onChange={url => {
                    const updated = [...config.curationOfJoySection.cards];
                    updated[idx].image = url;
                    setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SPINNING WHEEL */}
        {activeTab === 'wheel' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              5. Festival Lucky Draw Spinning Wheel
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Wheel Section Heading</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.spinningWheelSection.title} 
                onChange={e => setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, title: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Wheel Section Description</label>
              <textarea 
                className="form-input" 
                rows="2" 
                value={config.spinningWheelSection.description} 
                onChange={e => setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, description: e.target.value } })} 
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Bullet Point Benefits (3 Items)</label>
              {config.spinningWheelSection.bulletPoints.map((bp, i) => (
                <input 
                  key={i} 
                  type="text" 
                  className="form-input" 
                  style={{ marginBottom: 8 }}
                  value={bp} 
                  onChange={e => {
                    const updated = [...config.spinningWheelSection.bulletPoints];
                    updated[i] = e.target.value;
                    setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, bulletPoints: updated } });
                  }}
                />
              ))}
            </div>

            <div>
              <label className="form-label">Spinning Wheel 6 Slice Prizes</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {config.spinningWheelSection.prizes.map((pz, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slice #{i + 1}</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={pz} 
                      onChange={e => {
                        const updated = [...config.spinningWheelSection.prizes];
                        updated[i] = e.target.value;
                        setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, prizes: updated } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6 & 7: OFFER SECTIONS (Section 1: Exclusive Offers & Section 2: Buy 2 Get 1 Gallery) */}
        {(activeTab === 'section1' || activeTab === 'section2' || activeTab === 'products') && (
          <div>
            {/* Section Title & Badge Editor Card */}
            <div className="card" style={{ padding: 20, marginBottom: 24, border: '1px solid var(--border-color)', background: '#faf9f6', borderRadius: 12 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 14, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit2 size={16} /> Edit Title & Badge for {selectedSectionSlot === 1 ? 'Section 1 (Exclusive Offers Grid)' : 'Section 2 (Buy 2 Get 1 Gallery)'}
              </h4>
              
              {selectedSectionSlot === 1 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section 1 Top Badge Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={config.offerProductsSection?.badgeText || ''}
                      onChange={e => setConfig({ ...config, offerProductsSection: { ...config.offerProductsSection, badgeText: e.target.value } })}
                      placeholder="e.g. Festive Deals"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section 1 Main Heading</label>
                    <input
                      type="text"
                      className="form-input"
                      value={config.offerProductsSection?.heading || ''}
                      onChange={e => setConfig({ ...config, offerProductsSection: { ...config.offerProductsSection, heading: e.target.value } })}
                      placeholder="e.g. Exclusive Offers"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section 2 Top Badge Text</label>
                    <input
                      type="text"
                      className="form-input"
                      value={config.eligibleGallerySection?.badgeText || ''}
                      onChange={e => setConfig({ ...config, eligibleGallerySection: { ...config.eligibleGallerySection, badgeText: e.target.value } })}
                      placeholder="e.g. Eligible Selection"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section 2 Main Heading</label>
                    <input
                      type="text"
                      className="form-input"
                      value={config.eligibleGallerySection?.heading || ''}
                      onChange={e => setConfig({ ...config, eligibleGallerySection: { ...config.eligibleGallerySection, heading: e.target.value } })}
                      placeholder="e.g. The Buy 2 Get 1 Gallery"
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  {saving ? <RefreshCw className="spinner" size={14} /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save Titles & Headings'}
                </button>
              </div>
            </div>

            {/* Header & Add Product Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={20} /> Offer Products Table in {selectedSectionSlot === 1 ? 'Slot 1 (Grid View)' : 'Slot 2 (Carousel View)'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Search sarees to add directly to this offer section and set custom offer countdown timers.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '10px 18px', background: '#faf9f6', fontWeight: 600 }}
                  onClick={() => openProductPicker(selectedSectionSlot)}
                >
                  <Search size={15} /> Select Existing Sarees
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '10px 20px' }}
                  onClick={() => openCreateSareeModal(selectedSectionSlot)}
                >
                  <Plus size={16} /> Create New Saree & Add to Offer
                </button>
              </div>
            </div>

            {/* Offer Products Table View */}
            {sectionsLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading offer products table...</div>
            ) : sections.filter(s => Number(s.slot || 1) === selectedSectionSlot).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: 12 }}>
                <Package size={40} style={{ marginBottom: 12, opacity: 0.25 }} />
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No Products Added in Slot {selectedSectionSlot} Yet</div>
                <div style={{ fontSize: '0.85rem' }}>Click "Add Product to {selectedSectionSlot === 1 ? 'Exclusive Offers' : 'Buy 2 Get 1 Gallery'}" above to add sarees.</div>
              </div>
            ) : (
              <div className="table-responsive" style={{ overflowX: 'auto', background: '#fff', borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#FAF9F6', borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>Saree / Product</th>
                      <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>Offer Label</th>
                      <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>Offer End Date & Timer</th>
                      <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)' }}>Status</th>
                      <th style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--primary)', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.filter(s => Number(s.slot || 1) === selectedSectionSlot).flatMap(sec => {
                      const products = sec.productIds || [];
                      if (products.length === 0) {
                        return [{ sec, product: null }];
                      }
                      return products.map(p => ({ sec, product: p }));
                    }).map(({ sec, product }, idx) => {
                      const now = new Date();
                      const end = new Date(sec.endDate);
                      const isExpired = end < now;
                      const statusColor = !sec.isActive ? '#9ca3af' : isExpired ? '#dc2626' : '#16a34a';
                      const statusBadge = !sec.isActive ? '⚫ Paused' : isExpired ? '🔴 Expired' : '🟢 Active';
                      const isEditingTime = editSectionId === sec._id;

                      return (
                        <tr key={`${sec._id}-${product?._id || idx}`} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.12s' }}>
                          {/* Saree / Product Column */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                            {product ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <img 
                                  src={product.images?.[0]?.url || '/Images/saree1.png'} 
                                  alt={product.name} 
                                  style={{ width: 38, height: 50, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid var(--border-color)' }} 
                                />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#2D3326', fontSize: '0.86rem' }}>{product.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>
                                    ₹{product.price?.toLocaleString('en-IN')}
                                    {product.mrpPrice > product.price && (
                                      <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: 6, fontSize: '0.72rem', fontWeight: 400 }}>
                                        ₹{product.mrpPrice?.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.82rem' }}>No product attached</span>
                            )}
                          </td>

                          {/* Offer Label Column */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle', fontWeight: 600, color: '#334155' }}>
                            <span style={{ background: '#f5f0e8', color: 'var(--primary)', padding: '4px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, display: 'inline-block' }}>
                              {sec.name}
                            </span>
                          </td>

                          {/* Offer End Date & Timer Column */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                            {isEditingTime ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input 
                                  type="datetime-local" 
                                  className="form-input" 
                                  style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                  value={editSectionForm.endDate ?? end.toISOString().slice(0, 16)} 
                                  onChange={e => setEditSectionForm(f => ({ ...f, endDate: e.target.value }))} 
                                />
                                <button type="button" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => handleUpdateSection(sec._id)} disabled={sectionSaving}>Save</button>
                                <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => setEditSectionId(null)}>X</button>
                              </div>
                            ) : (
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                                  {end.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: isExpired ? '#dc2626' : '#d97706', fontWeight: 700, marginTop: 2 }}>
                                  {isExpired ? '🔴 Time Expired' : `⏱ Active Countdown`}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                            <span style={{ 
                              background: `${statusColor}18`, 
                              color: statusColor, 
                              border: `1px solid ${statusColor}40`, 
                              padding: '4px 12px', 
                              borderRadius: 20, 
                              fontWeight: 700, 
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {statusBadge}
                            </span>
                          </td>

                          {/* Actions Column */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
                              {product && (
                                <button 
                                  type="button" 
                                  style={{ padding: '5px 10px', fontSize: '0.78rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}
                                  onClick={() => {
                                    const pId = product._id || (typeof product === 'string' ? product : null);
                                    handleRemoveProductFromSection(sec._id, pId, product.name || 'Saree');
                                  }}
                                  disabled={sectionSaving}
                                  title="Remove product from this offer section"
                                >
                                  <X size={13} /> Remove Saree
                                </button>
                              )}

                              <button 
                                type="button" 
                                className="btn btn-outline" 
                                style={{ padding: '5px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, background: '#fff8e6', borderColor: '#D4AF37', color: '#B38A4A', fontWeight: 700 }}
                                onClick={() => handleExtendOffer(sec, product)}
                                disabled={sectionSaving}
                              >
                                <Clock size={13} /> Extend (+3 Days)
                              </button>

                              <button 
                                type="button" 
                                style={{ padding: '5px 10px', fontSize: '0.78rem', background: sec.isActive ? '#fef3c7' : '#dcfce7', border: '1px solid', borderColor: sec.isActive ? '#fcd34d' : '#86efac', color: sec.isActive ? '#92400e' : '#166534', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                                onClick={() => handleToggleSectionActive(sec, product)}
                                disabled={sectionSaving}
                              >
                                {sec.isActive ? 'Pause' : 'Resume'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(activeTab !== 'section1' && activeTab !== 'section2' && activeTab !== 'products') && (
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px' }}
            >
              {saving ? <RefreshCw className="spinner" size={16} /> : <Save size={16} />}
              {saving ? 'Saving Changes...' : 'Save Configuration'}
            </button>
          </div>
        )}
      </form>

      {/* Saree Product Selection Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 920,
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf9f6' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={20} /> Select Sarees for {selectedSectionSlot === 1 ? 'Exclusive Offers (Grid View)' : 'Buy 2 Get 1 Gallery (Carousel View)'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Select sarees from your store catalog to add to this limited offer section.
                </p>
              </div>
              <button type="button" onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 12, background: '#fff', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search by saree name, fabric, or tag..." 
                  value={pickerSearch} 
                  onChange={e => setPickerSearch(e.target.value)} 
                  style={{ paddingLeft: 36, fontSize: '0.85rem' }} 
                />
              </div>
              {categoriesList.length > 0 && (
                <select 
                  className="form-input" 
                  value={pickerCategory} 
                  onChange={e => setPickerCategory(e.target.value)} 
                  style={{ width: 180, fontSize: '0.85rem' }}
                >
                  <option value="">All Categories</option>
                  {categoriesList.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}
            </div>

            {/* Product List Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {pickerLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading sarees catalog...</div>
              ) : (
                (() => {
                  const filtered = pickerProducts.filter(p => {
                    const matchesSearch = !pickerSearch || p.name?.toLowerCase().includes(pickerSearch.toLowerCase()) || p.fabric?.toLowerCase().includes(pickerSearch.toLowerCase()) || p.tag?.toLowerCase().includes(pickerSearch.toLowerCase());
                    const matchesCat = !pickerCategory || (p.category?._id || p.category) === pickerCategory;
                    return matchesSearch && matchesCat;
                  });

                  if (filtered.length === 0) {
                    return <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No sarees found matching filter</div>;
                  }

                  const allSelected = filtered.length > 0 && filtered.every(p => selectedProductIds.includes(p._id));

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={allSelected} 
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedProductIds(prev => Array.from(new Set([...prev, ...filtered.map(p => p._id)])));
                              } else {
                                const filteredIds = new Set(filtered.map(p => p._id));
                                setSelectedProductIds(prev => prev.filter(id => !filteredIds.has(id)));
                              }
                            }} 
                          />
                          Select All ({filtered.length} Sarees)
                        </label>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {selectedProductIds.length} Saree(s) Selected
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                        {filtered.map(p => {
                          const isSelected = selectedProductIds.includes(p._id);
                          return (
                            <div 
                              key={p._id}
                              onClick={() => {
                                setSelectedProductIds(prev => isSelected ? prev.filter(id => id !== p._id) : [...prev, p._id]);
                              }}
                              style={{
                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                background: isSelected ? '#fcfaf5' : '#fff',
                                borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 12,
                                cursor: 'pointer', transition: 'all 0.15s'
                              }}
                            >
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => {}} 
                                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} 
                              />
                              <img src={p.images?.[0]?.url || '/Images/saree1.png'} alt={p.name} style={{ width: 44, height: 58, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.84rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#2d3326' }}>{p.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700, marginTop: 2 }}>₹{p.price?.toLocaleString('en-IN')}</div>
                                {p.tag && <span style={{ fontSize: '0.7rem', background: '#f5f0e8', padding: '1px 6px', borderRadius: 4, color: 'var(--text-muted)' }}>{p.tag}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Footer Form & Actions */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: '#faf9f6', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: 4 }}>Offer Campaign Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={offerTitle} 
                    onChange={e => setOfferTitle(e.target.value)} 
                    placeholder="e.g. Festive Exclusive Saree Sale"
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: 4 }}>Offer End Date & Time <span style={{ color: 'red' }}>*</span></label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={offerEndDate} 
                    onChange={e => setOfferEndDate(e.target.value)} 
                    style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)' }}>
                  {selectedProductIds.length} Saree(s) Selected
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowProductModal(false)}>Cancel</button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    disabled={sectionSaving || selectedProductIds.length === 0 || !offerEndDate}
                    onClick={handleSaveModalProducts}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px' }}
                  >
                    {sectionSaving ? <RefreshCw className="spinner" size={14} /> : <Plus size={14} />}
                    {sectionSaving ? 'Adding Sarees...' : `Add ${selectedProductIds.length} Sarees to Offer`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Create & Add Saree Modal (Matches Screenshot) */}
      {showCreateSareeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 1040,
            maxHeight: '92vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf9f6' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Plus size={20} /> Create New Saree & Add to {selectedSectionSlot === 1 ? 'Exclusive Offers (Grid View)' : 'Buy 2 Get 1 Gallery (Carousel View)'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Fill in saree details & specifications to create it in catalog and feature it in Limited Offer.
                </p>
              </div>
              <button type="button" onClick={() => setShowCreateSareeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
              
              {/* Left Column: Image Uploaders with 3:4 Live Previews */}
              <div>
                <SareeImageUploaderCard 
                  title="Primary Image" 
                  subtitle="(Max 5MB • Aspect Ratio 3:4)" 
                  value={sareeForm.primaryImage} 
                  onChange={url => setSareeForm(f => ({ ...f, primaryImage: url }))} 
                  isPrimary={true} 
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <SareeImageUploaderCard 
                    title="Secondary Image 1" 
                    subtitle="(3:4)" 
                    value={sareeForm.secondaryImage1} 
                    onChange={url => setSareeForm(f => ({ ...f, secondaryImage1: url }))} 
                  />

                  <SareeImageUploaderCard 
                    title="Secondary Image 2" 
                    subtitle="(3:4)" 
                    value={sareeForm.secondaryImage2} 
                    onChange={url => setSareeForm(f => ({ ...f, secondaryImage2: url }))} 
                  />
                </div>
              </div>

              {/* Right Column: Saree Fields & Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Product Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Kanchipuram Pure Zari Silk Saree"
                    value={sareeForm.name}
                    onChange={e => setSareeForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>

                {/* Simple Description */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Simple Description (Shows on Shop Card & Details Subtitle)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Handcrafted Megatron Silk Saree with Rich Brocade"
                    value={sareeForm.shortDescription}
                    onChange={e => setSareeForm(f => ({ ...f, shortDescription: e.target.value }))}
                  />
                </div>

                {/* Detailed Description */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Detailed Description (Shows on Product Details Page)</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="Detailed product description..."
                    value={sareeForm.description}
                    onChange={e => setSareeForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>

                {/* Category & Fabric */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-input"
                      value={sareeForm.category}
                      onChange={e => setSareeForm(f => ({ ...f, category: e.target.value }))}
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Fabric *</label>
                    <select 
                      className="form-input"
                      value={sareeForm.fabric}
                      onChange={e => setSareeForm(f => ({ ...f, fabric: e.target.value }))}
                    >
                      <option value="">Select Fabric</option>
                      {fabricsList.length > 0 ? (
                        fabricsList.map(f => <option key={f._id || f.name} value={f.name}>{f.name}</option>)
                      ) : (
                        <>
                          <option value="Kanchipuram Silk">Kanchipuram Silk</option>
                          <option value="Banarasi Silk">Banarasi Silk</option>
                          <option value="Soft Silk">Soft Silk</option>
                          <option value="Cotton Handloom">Cotton Handloom</option>
                          <option value="Organza">Organza</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Price & MRP */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Price (₹) *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 1800"
                      value={sareeForm.price}
                      onChange={e => {
                        const pr = Number(e.target.value);
                        const mrp = Number(sareeForm.mrpPrice);
                        const disc = mrp > pr ? Math.round(((mrp - pr) / mrp) * 100) : 0;
                        const discAmt = mrp > pr ? (mrp - pr) : 0;
                        setSareeForm(f => ({ ...f, price: e.target.value, discountPercent: disc, discountAmount: discAmt }));
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">MRP Price (₹)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 2400"
                      value={sareeForm.mrpPrice}
                      onChange={e => {
                        const mrp = Number(e.target.value);
                        const pr = Number(sareeForm.price);
                        const disc = mrp > pr ? Math.round(((mrp - pr) / mrp) * 100) : 0;
                        const discAmt = mrp > pr ? (mrp - pr) : 0;
                        setSareeForm(f => ({ ...f, mrpPrice: e.target.value, discountPercent: disc, discountAmount: discAmt }));
                      }}
                    />
                  </div>
                </div>

                {/* Discount % & Profit / Discount Amount */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Discount (%)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0"
                      value={sareeForm.discountPercent || 0}
                      onChange={e => {
                        const disc = Number(e.target.value);
                        const mrp = Number(sareeForm.mrpPrice);
                        const newPrice = mrp > 0 ? Math.round(mrp * (1 - disc / 100)) : sareeForm.price;
                        const discAmt = mrp > newPrice ? (mrp - newPrice) : 0;
                        setSareeForm(f => ({ ...f, discountPercent: disc, price: newPrice, discountAmount: discAmt }));
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Discount Amount / Profit (₹) <span style={{ fontSize: '0.72rem', color: '#B38A4A', fontWeight: 700 }}>(ADMIN ONLY)</span></label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0"
                      readOnly
                      value={sareeForm.discountAmount || 0}
                      style={{ background: '#f8fafc', color: 'var(--primary)', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Stock Quantity & Tag */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stock Quantity *</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={sareeForm.stockQuantity}
                      onChange={e => setSareeForm(f => ({ ...f, stockQuantity: e.target.value }))}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tag Badge</label>
                    <select 
                      className="form-input"
                      value={sareeForm.tag}
                      onChange={e => setSareeForm(f => ({ ...f, tag: e.target.value }))}
                    >
                      <option value="None">None</option>
                      <option value="LIMITED EDITION">LIMITED EDITION</option>
                      <option value="FESTIVAL CHOICE">FESTIVAL CHOICE</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                      <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                    </select>
                  </div>
                </div>

                {/* Product Specifications Header */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 6, marginTop: 10, marginBottom: 4 }}>
                  Product Specifications
                </h4>

                {/* Specs Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Weight</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 500g"
                      value={sareeForm.weight}
                      onChange={e => setSareeForm(f => ({ ...f, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Height</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 45 inches"
                      value={sareeForm.height}
                      onChange={e => setSareeForm(f => ({ ...f, height: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Saree Length</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 5.5 meters"
                      value={sareeForm.sareeLength}
                      onChange={e => setSareeForm(f => ({ ...f, sareeLength: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Blouse Length</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 0.8 meters"
                      value={sareeForm.blouseLength}
                      onChange={e => setSareeForm(f => ({ ...f, blouseLength: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Pattern</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Floral Motif"
                      value={sareeForm.pattern}
                      onChange={e => setSareeForm(f => ({ ...f, pattern: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Pallu</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rich Brocade"
                      value={sareeForm.pallu}
                      onChange={e => setSareeForm(f => ({ ...f, pallu: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Blouse</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Running Blouse"
                      value={sareeForm.blouse}
                      onChange={e => setSareeForm(f => ({ ...f, blouse: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Wash Care</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Dry Clean Only"
                      value={sareeForm.washCare}
                      onChange={e => setSareeForm(f => ({ ...f, washCare: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Return / Exchange Field */}
                <div style={{ marginTop: 8 }}>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    RETURN/EXCHANGE
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Not Applicable"
                    value={sareeForm.returnPolicy}
                    onChange={e => setSareeForm(f => ({ ...f, returnPolicy: e.target.value }))}
                  />
                </div>

                {/* Additional Info Section */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 4, marginTop: 12, marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  ADDITIONAL INFO
                </h4>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    NOTE
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Product Color May Slightly Vary Due To Photographic Lighting..."
                    value={sareeForm.note}
                    onChange={e => setSareeForm(f => ({ ...f, note: e.target.value }))}
                  />
                </div>

                {/* Status & Options Checkboxes Bar */}
                <div style={{
                  background: '#FAF9F6',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginTop: 14,
                  marginBottom: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', fontWeight: 600, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                      <input 
                        type="checkbox" 
                        style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        checked={!!sareeForm.isFeatured}
                        onChange={e => setSareeForm(f => ({ ...f, isFeatured: e.target.checked }))}
                      />
                      Featured Product
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', fontWeight: 600, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                      <input 
                        type="checkbox" 
                        style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        checked={!!sareeForm.isActive}
                        onChange={e => {
                          const val = e.target.checked;
                          setSareeForm(f => ({ 
                            ...f, 
                            isActive: val,
                            isScheduled: val ? false : f.isScheduled 
                          }));
                        }}
                      />
                      Active Status
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', fontWeight: 600, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                      <input 
                        type="checkbox" 
                        style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        checked={!!sareeForm.isScheduled}
                        onChange={e => {
                          const val = e.target.checked;
                          setSareeForm(f => ({ 
                            ...f, 
                            isScheduled: val,
                            isActive: val ? false : f.isActive 
                          }));
                        }}
                      />
                      Schedule Product
                    </label>
                  </div>

                  {sareeForm.isScheduled && (
                    <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem', margin: 0, whiteSpace: 'nowrap' }}>Schedule Date & Time:</label>
                      <input 
                        type="datetime-local" 
                        className="form-input" 
                        style={{ maxWidth: 240, fontSize: '0.82rem', padding: '5px 10px' }}
                        value={sareeForm.scheduledAt || ''} 
                        onChange={e => setSareeForm(f => ({ ...f, scheduledAt: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {/* Offer End Date & Campaign Title */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 6, marginTop: 14, marginBottom: 4 }}>
                  Limited Offer Countdown & Campaign
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Offer Campaign Label</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Diwali Flash Deal"
                      value={sareeForm.offerTitle}
                      onChange={e => setSareeForm(f => ({ ...f, offerTitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Offer End Date & Time *</label>
                    <input 
                      type="datetime-local" 
                      className="form-input" 
                      value={sareeForm.offerEndDate}
                      onChange={e => setSareeForm(f => ({ ...f, offerEndDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: '#faf9f6', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowCreateSareeModal(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn btn-primary" 
                disabled={sectionSaving}
                onClick={handleCreateNewSaree}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}
              >
                {sectionSaving ? <RefreshCw className="spinner" size={16} /> : <Plus size={16} />}
                {sectionSaving ? 'Creating Saree...' : 'Save & Add Saree to Limited Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
