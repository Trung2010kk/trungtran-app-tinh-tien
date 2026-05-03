import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, History, Calculator, 
  ArrowLeft, ShoppingCart, CheckCircle2, 
  AlertCircle, RefreshCw
} from 'lucide-react';

const App = () => {
  // --- LƯU TRỮ TRÊN ĐIỆN THOẠI ---
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('trung_tran_mobile_app');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('create');
  const [showIntro, setShowIntro] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedPrint, setSelectedPrint] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const designPackages = [
    { id: 'd1', name: 'Gói Cơ Bản', price: 150000 },
    { id: 'd2', name: 'Gói Nâng Cao', price: 350000 },
    { id: 'd3', name: 'Gói Pro', price: 750000 }
  ];

  const printServices = [
    { id: 'p1', name: 'Giấy C300', price: 2000 },
    { id: 'p2', name: 'Giấy Decal', price: 3500 },
    { id: 'p3', name: 'Giấy Mỹ Thuật', price: 8000 },
    { id: 'p4', name: 'Bạt Hiflex', price: 45000 }
  ];

  useEffect(() => {
    localStorage.setItem('trung_tran_mobile_app', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const togglePrintService = (service) => {
    const exists = selectedPrint.find(s => s.id === service.id);
    if (exists) {
      setSelectedPrint(selectedPrint.filter(s => s.id !== service.id));
    } else {
      setSelectedPrint([...selectedPrint, { ...service, quantity: 1 }]);
    }
  };

  const calculateTotal = () => {
    const designPrice = selectedDesign ? selectedDesign.price : 0;
    const printPrice = selectedPrint.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    return { finalTotal: Math.max(0, designPrice + printPrice - discount) };
  };

  const handleCompleteOrder = () => {
    if (!customerName) return alert("Nhập tên khách đã anh ơi!");
    const { finalTotal } = calculateTotal();
    const newOrder = {
      id: `ID${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      customer: customerName,
      total: finalTotal
    };
    setOrders([newOrder, ...orders]);
    setCurrentOrder(newOrder);
    setShowInvoice(true);
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center text-white">
        <Calculator size={60} className="animate-bounce" />
        <h1 className="text-xl font-black mt-4">TRUNG TRẦN MOBILE</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-24">
      {/* Header gọn nhẹ cho Mobile */}
      <div className="bg-white p-4 shadow-sm text-center font-bold text-blue-600 sticky top-0 z-20">
        TRUNG TRẦN DESIGN
      </div>

      <div className="p-4">
        {activeTab === 'create' ? (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Tên khách hàng..."
              className="w-full p-4 rounded-2xl border-none shadow-sm outline-none"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 mb-3">CHỌN THIẾT KẾ</p>
              <div className="space-y-2">
                {designPackages.map(pkg => (
                  <div 
                    key={pkg.id}
                    onClick={() => setSelectedDesign(selectedDesign?.id === pkg.id ? null : pkg)}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedDesign?.id === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-50'}`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>{pkg.name}</span>
                      <span className="text-blue-600">{pkg.price.toLocaleString()}đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-gray-400 mb-3">DỊCH VỤ IN</p>
              <div className="space-y-3">
                {printServices.map(s => {
                  const isSelected = selectedPrint.find(p => p.id === s.id);
                  return (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center" onClick={() => togglePrintService(s)}>
                        <div className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-200'}`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      {isSelected && (
                        <input 
                          type="number"
                          className="w-16 p-1 bg-gray-100 rounded text-center font-bold"
                          value={isSelected.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setSelectedPrint(selectedPrint.map(p => p.id === s.id ? {...p, quantity: val} : p));
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-sm font-bold">GIẢM GIÁ</span>
              <input 
                type="number"
                className="w-24 p-2 bg-red-50 text-red-500 rounded text-right font-bold"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>

            <button 
              onClick={handleCompleteOrder}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 active:scale-95"
            >
              XUẤT HÓA ĐƠN: {calculateTotal().finalTotal.toLocaleString()}đ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium">Chưa có đơn hàng nào</div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-white p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-gray-800">{o.customer}</div>
                    <div className="text-[10px] text-gray-400">{o.date} - {o.total.toLocaleString()}đ</div>
                  </div>
                  <button onClick={() => setOrders(orders.filter(x => x.id !== o.id))} className="text-red-300 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
            {orders.length > 0 && (
              <button onClick={() => setOrders([])} className="w-full text-xs text-gray-400 py-4 italic">Xóa toàn bộ lịch sử</button>
            )}
          </div>
        )}
      </div>

      {/* Invoice Modal cho Mobile */}
      {showInvoice && currentOrder && (
        <div className="fixed inset-0 z-50 bg-white p-6 flex flex-col">
          <button onClick={() => setShowInvoice(false)} className="mb-6"><ArrowLeft /></button>
          <div className="flex-1 border-2 border-gray-100 rounded-3xl p-6 text-center space-y-6">
            <CheckCircle2 size={60} className="mx-auto text-green-500" />
            <h2 className="text-2xl font-black">THÀNH CÔNG!</h2>
            <div className="space-y-2 py-6 border-y border-dashed">
              <p className="text-gray-500 italic">Khách hàng: <span className="text-black font-bold not-italic">{currentOrder.customer}</span></p>
              <p className="text-3xl font-black text-blue-600">{currentOrder.total.toLocaleString()}đ</p>
            </div>
            <p className="text-[10px] text-gray-400 italic">Đơn hàng đã được lưu tự động vào lịch sử hệ thống.</p>
            <button 
              onClick={() => { setCustomerName(''); setSelectedDesign(null); setSelectedPrint([]); setDiscount(0); setShowInvoice(false); }}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold"
            >
              TIẾP TỤC TẠO ĐƠN
            </button>
          </div>
        </div>
      )}

      {/* Nav đơn giản */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around">
        <button onClick={() => setActiveTab('create')} className={activeTab === 'create' ? 'text-blue-600' : 'text-gray-300'}>
          <Plus size={28} />
        </button>
        <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'text-blue-600' : 'text-gray-300'}>
          <History size={28} />
        </button>
      </nav>
    </div>
  );
};

export default App;
