import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { orderAPI } from '../api/api';
import './Layout.css';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  
  const [newOrderToast, setNewOrderToast] = useState(null);
  const lastOrderIdRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  // Polling for New Orders
  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const res = await orderAPI.getAll('limit=1&page=1');
        if (res?.data?.length > 0) {
          const latestOrder = res.data[0];
          
          if (!lastOrderIdRef.current) {
            // Initial load - just set the ref
            lastOrderIdRef.current = latestOrder._id;
          } else if (lastOrderIdRef.current !== latestOrder._id) {
            // New order detected!
            lastOrderIdRef.current = latestOrder._id;
            
            // Play notification sound
            try {
              const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
              audio.volume = 0.5;
              audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (err) {
              console.log('Audio init failed:', err);
            }

            // Show Custom Toast
            setNewOrderToast(`🎉 New Order Received: ${latestOrder.orderId}`);
            setTimeout(() => {
              setNewOrderToast(null);
            }, 8000);
          }
        }
      } catch (error) {
        console.error('Order polling error:', error);
      }
    };

    // Poll every 30 seconds
    const interval = setInterval(fetchLatestOrder, 30000);
    fetchLatestOrder();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`admin-layout ${isCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Custom Toast Notification */}
      {newOrderToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#16a34a',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 99999,
          fontWeight: 'bold',
          fontSize: '16px',
          animation: 'invoiceFadeIn 0.3s ease'
        }}>
          {newOrderToast}
        </div>
      )}

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
