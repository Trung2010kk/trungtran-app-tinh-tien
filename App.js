import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Trash2, ChevronLeft, Layout, Printer as PrinterIcon, 
  Edit3, X, ZoomIn, Eye, ShoppingCart, History, Tag, Monitor, Smartphone 
} from 'lucide-react';

const App = () => {
  const [introStage, setIntroStage] = useState('intro');
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState(''); 
  const [discountName, setDiscountName] = useState(''); 
  const [discountAmount, setDiscountAmount] = useState(0); 
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null); 
  const [activeTab, setActiveTab] = useState('create');
  const [selectionMode, setSelectionMode] = useState(null); 
  const [paperType, setPaperType] = useState(null); 
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Kiểm tra kích thước màn hình để tự động chuyển giao diện
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    
    const timer = setTimeout(() => setIntroStage('app'), 2000); // Rút ngắn intro để anh iu dùng nhanh hơn
    return () => {
      window.removeEventListener('resize', checkScreen);
      clearTimeout(timer);
    };
  }, []);

  const services = {
    design: [
      { id: 's1', name: 'Gói 1: Sơ Cấp', price: 10000 },
      { id: 's2', name: 'Gói 2: Tiêu Chuẩn', price: 15000 },
      { id: 's3', name: 'Gói 3: Chuyên Nghiệp', price: 20000 },
    ],
    printing: {
        paperTypes: [
            { id: 'p1', name: 'Giấy Thường (A4)', icon: '📄' },
            { id: 'p2', name: 'Giấy Dày / Bìa', icon: '📁' },
            { id: 'p3', name: 'Giấy Ảnh Glossy', icon: '🖼️' },
            { id: 'p4', name: 'Giấy Decal / Nhãn', icon: '🏷️' },
        ],
        items: {
            'p1': [
                { id: 'i1', name: 'In Màu 1 mặt (Thường)', price: 3000 },
                { id: 'i2', name: 'In Màu 2 mặt (Thường)', price: 5000 },
                { id: 'i3', name: 'In Đen Trắng 1 mặt (Thường)', price: 1000 },
                { id: 'i10', name: 'In Đen Trắng 2 mặt (Thường)', price: 1800 }, 
            ],
            'p2': [
                { id: 'i4', name: 'In Màu bìa cứng', price: 7000 },
                { id: 'i5', name: 'In Đen trắng bìa', price: 3000 },
            ],
            'p3': [
                { id: 'i6', name: 'In ảnh 10x15', price: 15000 },
                { id: 'i7', name: 'In ảnh A4 Full', price: 35000 },
            ],
            'p4': [
                { id: 'i8', name: 'In Decal A4', price: 12000 },
            ]
        }
    }
  };

  const subTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const finalTotal = Math.max(0, subTotal - discountAmount);

  const addService = (service) => {
    const existing = cart.find(item => item.name === service.name);
    if (existing) {
      setCart(cart.map(item => item.name === service.name ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...service, quantity: 1, id: Date.now() }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const saveOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: `TT-${Math.floor(Math.random() * 10000)}`,
      customer: customerName || 'Khách hàng',
      note: note,
      discountName: discountName,
      discountAmount: discountAmount,
      items: [...cart],
      subTotal: subTotal,
      total: finalTotal,
      date: new Date().toLocaleString('vi-VN'),
    };
    setOrders([newOrder, ...orders]);
    setViewingOrder(newOrder); 
    setZoom(1); 
    setShowInvoice(true);
  };

  const resetForm = () => {
    setCart([]);
    setCustomerName('');
    setNote('');
    setDiscountName('');
    setDiscountAmount(0);
    setSelectionMode(null);
    setPaperType(null);
  };

  if (introStage === 'intro') {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] overflow-hidden">
        <div className="relative flex flex-col items-center animate-pulse">
            <h1 className="font-black text-blue-900 text-4xl sm:text-6xl tracking-tighter">TRUNG TRAN</h1>
            <div className="h-1.5 w-24 bg-blue-600 rounded-full my-4"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Đang khởi tạo ứng dụng...</p>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN ĐIỆN THOẠI ---
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans select-none">
        <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-black text-blue-900 text-base leading-none tracking-tight uppercase">Trung Tran Mobile</h1>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Dành riêng cho anh iu</p>
          </div>
          <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-1">
              <Smartphone size={10} className="text-blue-600"/>
              <span className="text-[10px] font-black text-blue-600">{cart.length} món</span>
          </div>
        </header>

        <main className="px-4 pt-4">
          {activeTab === 'create' ? (
            <div className="flex flex-col gap-4">
                {/* Chọn dịch vụ Mobile */}
                {!selectionMode ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSelectionMode('design')} className="bg-white p-6 rounded-3xl border flex flex-col items-center active:scale-95 transition-transform shadow-sm">
                      <div className="bg-blue-50 p-4 rounded-2xl mb-2 text-blue-600"><Layout size={24}/></div>
                      <span className="font-black text-[10px] uppercase text-slate-600">Thiết kế</span>
                    </button>
                    <button onClick={() => setSelectionMode('printing')} className="bg-white p-6 rounded-3xl border flex flex-col items-center active:scale-95 transition-transform shadow-sm">
                      <div className="bg-blue-50 p-4 rounded-2xl mb-2 text-blue-600"><PrinterIcon size={24}/></div>
                      <span className="font-black text-[10px] uppercase text-slate-600">In ấn</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-white p-2 rounded-3xl border border-slate-100">
                    <button onClick={() => paperType ? setPaperType(null) : setSelectionMode(null)} className="p-3 text-[10px] font-black uppercase text-blue-600 flex items-center gap-1">
                      <ChevronLeft size={14}/> Quay lại
                    </button>
                    <div className="p-2 space-y-2">
                        {selectionMode === 'design' && services.design.map(s => (
                            <button key={s.id} onClick={() => addService(s)} className="w-full flex justify-between items-center p-4 rounded-2xl bg-slate-50 font-black text-[11px] uppercase">
                                <span>{s.name}</span>
                                <span className="text-blue-600">{s.price.toLocaleString()}đ</span>
                            </button>
                        ))}
                        {selectionMode === 'printing' && !paperType && (
                            <div className="grid grid-cols-2 gap-2">
                                {services.printing.paperTypes.map(p => (
                                    <button key={p.id} onClick={() => setPaperType(p.id)} className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                        <span className="text-xl mb-1">{p.icon}</span>
                                        <span className="font-black text-[9px] uppercase text-center">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectionMode === 'printing' && paperType && services.printing.items[paperType].map(s => (
                            <button key={s.id} onClick={() => addService(s)} className="w-full flex justify-between items-center p-4 rounded-2xl bg-slate-50 font-black text-[11px] uppercase">
                                <span className="text-left pr-2">{s.name}</span>
                                <span className="text-blue-600">{s.price.toLocaleString()}đ</span>
                            </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Form nhập liệu Mobile */}
                <section className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100">
                  <input type="text" className="w-full border-b border-slate-200 py-3 font-black text-base uppercase text-blue-700 focus:outline-none mb-4" placeholder="TÊN KHÁCH HÀNG..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <div className="bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
                    <textarea className="w-full bg-transparent text-[10px] font-bold focus:outline-none resize-none uppercase" placeholder="GHI CHÚ..." rows={1} value={note} onChange={e => setNote(e.target.value)}/>
                  </div>
                  
                  {/* Giảm giá Mobile */}
                  <div className="bg-orange-50/50 p-3 rounded-2xl border border-dashed border-orange-200 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" className="bg-white border border-orange-100 rounded-xl px-2 py-2 text-[9px] font-black focus:outline-none text-orange-700 uppercase" placeholder="Tên ưu đãi..." value={discountName} onChange={e => setDiscountName(e.target.value)}/>
                        <input type="number" className="bg-white border border-orange-100 rounded-xl px-2 py-2 text-[9px] font-black focus:outline-none text-orange-700" placeholder="Số tiền giảm..." value={discountAmount || ''} onChange={e => setDiscountAmount(Number(e.target.value))}/>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex-1 text-[10px] font-black uppercase pr-2 leading-tight">{item.name}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white border rounded-lg shadow-sm"><Minus size={12}/></button>
                          <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white border rounded-lg shadow-sm"><Plus size={12}/></button>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 ml-1"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-900 text-white p-5 rounded-3xl shadow-xl flex justify-between items-center">
                    <div>
                        <span className="text-[9px] font-black opacity-50 uppercase block">Tổng thanh toán</span>
                        <span className="text-2xl font-black">{finalTotal.toLocaleString()}đ</span>
                    </div>
                    <button disabled={cart.length === 0} onClick={saveOrder} className="bg-blue-500 p-4 rounded-2xl shadow-lg active:scale-90 transition-transform">
                        <PrinterIcon size={24} />
                    </button>
                  </div>
                </section>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
                  <div>
                      <h3 className="font-black text-[11px] uppercase text-slate-800">{order.customer}</h3>
                      <p className="text-blue-600 font-black text-base">{order.total.toLocaleString()}đ</p>
                  </div>
                  <button onClick={() => { setViewingOrder(order); setShowInvoice(true); }} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <Eye size={20}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        <nav className="fixed bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl border border-slate-200 h-16 rounded-full shadow-2xl flex items-center justify-around z-40">
          <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center transition-all ${activeTab === 'create' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
              <ShoppingCart size={22} />
              <span className="text-[8px] font-black uppercase">Tạo đơn</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center transition-all ${activeTab === 'history' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
              <History size={22} />
              <span className="text-[8px] font-black uppercase">Lịch sử</span>
          </button>
        </nav>
      </div>
    );
  }

  // --- GIAO DIỆN MÁY TÍNH ---
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-10 font-sans">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h1 className="font-black text-blue-900 text-2xl tracking-tighter">TRUNG TRAN PC</h1>
            <div className="bg-blue-50 px-3 py-1 rounded-lg flex items-center gap-2">
                <Monitor size={16} className="text-blue-600"/>
                <span className="text-xs font-black text-blue-600 uppercase">Giao diện Máy tính</span>
            </div>
        </div>
        <nav className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('create')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'create' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>Tạo Đơn Hàng</button>
          <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>Lịch Sử Đơn</button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {activeTab === 'create' ? (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7">
              {!selectionMode ? (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSelectionMode('design')} className="bg-white p-12 rounded-[40px] border hover:shadow-xl transition-all group flex flex-col items-center">
                    <div className="bg-blue-50 p-6 rounded-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600"><Layout size={40}/></div>
                    <span className="font-black text-sm uppercase text-slate-600">Thiết kế Slide</span>
                  </button>
                  <button onClick={() => setSelectionMode('printing')} className="bg-white p-12 rounded-[40px] border hover:shadow-xl transition-all group flex flex-col items-center">
                    <div className="bg-blue-50 p-6 rounded-3xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600"><PrinterIcon size={40}/></div>
                    <span className="font-black text-sm uppercase text-slate-600">In ấn tài liệu</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-[40px] border shadow-sm animate-in fade-in duration-300">
                  <button onClick={() => paperType ? setPaperType(null) : setSelectionMode(null)} className="mb-6 text-xs font-black uppercase text-blue-600 flex items-center gap-1 hover:underline">
                    <ChevronLeft size={16}/> Quay lại danh mục
                  </button>
                  
                  {selectionMode === 'design' && (
                    <div className="grid grid-cols-1 gap-3">
                        {services.design.map(s => (
                            <button key={s.id} onClick={() => addService(s)} className="flex justify-between items-center p-5 rounded-2xl border hover:bg-blue-50 transition-all font-black text-sm uppercase">
                                <span>{s.name}</span>
                                <span className="text-blue-600">{s.price.toLocaleString()}đ</span>
                            </button>
                        ))}
                    </div>
                  )}

                  {selectionMode === 'printing' && !paperType && (
                    <div className="grid grid-cols-2 gap-4">
                        {services.printing.paperTypes.map(p => (
                            <button key={p.id} onClick={() => setPaperType(p.id)} className="bg-slate-50 p-8 rounded-3xl border hover:border-blue-500 transition-all flex flex-col items-center">
                                <span className="text-4xl mb-3">{p.icon}</span>
                                <span className="font-black text-xs uppercase">{p.name}</span>
                            </button>
                        ))}
                    </div>
                  )}

                  {selectionMode === 'printing' && paperType && (
                    <div className="grid grid-cols-1 gap-3">
                        {services.printing.items[paperType].map(s => (
                            <button key={s.id} onClick={() => addService(s)} className="flex justify-between items-center p-5 rounded-2xl border hover:bg-blue-50 transition-all font-black text-sm uppercase text-left">
                                <span>{s.name}</span>
                                <span className="text-blue-600">{s.price.toLocaleString()}đ</span>
                            </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-5">
              <div className="bg-white rounded-[40px] shadow-2xl p-8 border sticky top-24">
                <h2 className="text-xs font-black text-slate-400 uppercase mb-6 tracking-widest">Chi tiết đơn hàng</h2>
                <input type="text" className="w-full border-b-2 py-3 font-black text-xl uppercase text-blue-700 focus:outline-none mb-6" placeholder="TÊN KHÁCH HÀNG..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border flex items-start gap-3">
                        <Edit3 size={18} className="text-slate-400 mt-1"/>
                        <textarea className="w-full bg-transparent text-xs font-bold focus:outline-none resize-none uppercase" placeholder="GHI CHÚ ĐƠN HÀNG..." rows={2} value={note} onChange={e => setNote(e.target.value)}/>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-dashed border-orange-200">
                        <div className="flex items-center gap-2 mb-3 text-orange-600">
                            <Tag size={16}/>
                            <span className="font-black text-[10px] uppercase">Chương trình giảm giá</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" className="bg-white border rounded-xl px-3 py-2 text-xs font-black focus:outline-none text-orange-700 uppercase" placeholder="Tên ưu đãi..." value={discountName} onChange={e => setDiscountName(e.target.value)}/>
                            <input type="number" className="bg-white border rounded-xl px-3 py-2 text-xs font-black focus:outline-none text-orange-700" placeholder="Tiền giảm..." value={discountAmount || ''} onChange={e => setDiscountAmount(Number(e.target.value))}/>
                        </div>
                    </div>
                </div>

                <div className="max-h-[250px] overflow-auto space-y-2 mb-8 pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border">
                      <div className="flex-1 text-[11px] font-black uppercase leading-tight">{item.name}</div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white rounded-xl border p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-blue-600"><Minus size={14}/></button>
                            <span className="font-black text-xs w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-blue-600"><Plus size={14}/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && <div className="text-center py-10 text-slate-300 font-black uppercase text-[10px] tracking-widest">Đơn hàng trống</div>}
                </div>

                <div className="border-t pt-6 space-y-2 mb-6 text-sm font-black uppercase">
                    <div className="flex justify-between text-slate-400">
                        <span>Tạm tính</span>
                        <span>{subTotal.toLocaleString()}đ</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-orange-500 italic">
                            <span>-{discountName || 'Ưu đãi'}</span>
                            <span>-{discountAmount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="bg-blue-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-xl mt-4">
                        <span className="text-xs opacity-60">Tổng thanh toán</span>
                        <span className="text-3xl tracking-tighter">{finalTotal.toLocaleString()}đ</span>
                    </div>
                </div>

                <button disabled={cart.length === 0} onClick={saveOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[24px] shadow-lg uppercase text-sm transition-all active:scale-95">XUẤT HÓA ĐƠN NGAY</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-[32px] border shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">{order.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 italic">{order.date}</span>
                </div>
                <h3 className="font-black text-sm uppercase text-slate-700 mb-1">{order.customer}</h3>
                <p className="text-blue-600 font-black text-2xl mb-4">{order.total.toLocaleString()}đ</p>
                <button onClick={() => { setViewingOrder(order); setShowInvoice(true); }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Eye size={16}/> Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL HÓA ĐƠN DÙNG CHUNG CHO CẢ 2 GIAO DIỆN */}
      {showInvoice && viewingOrder && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center overflow-hidden animate-in fade-in duration-300">
          <div className="w-full bg-white/10 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10">
             <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl">
                    <ZoomIn size={16} className="text-white/60" />
                    <input type="range" min="0.5" max="1.5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-32 accent-blue-500"/>
                </div>
             </div>
             <button onClick={() => { setShowInvoice(false); if(activeTab === 'create') resetForm(); }} className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-2 rounded-xl text-[10px] uppercase shadow-lg transition-all flex items-center gap-2 mr-4">
                <X size={16}/> Đóng & Hoàn tất
             </button>
          </div>

          <div className="w-full h-full overflow-auto flex flex-col items-center pt-10 pb-32">
             <div 
                className="bg-white shadow-2xl transition-transform origin-top" 
                style={{ 
                    width: '400px', 
                    minHeight: '600px', 
                    padding: '45px 35px', 
                    transform: `scale(${zoom})`,
                    borderRadius: '2px',
                }}
             >
                <div style={{ textAlign: 'center', marginBottom: '35px', paddingBottom: '20px', borderBottom: '3px solid #003366' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#003366', textTransform: 'uppercase', lineHeight: '1', letterSpacing: '1px' }}>TRUNG TRAN</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '10px' }}>Professional Services</div>
                </div>

                <div style={{ marginBottom: '25px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b' }}>Khách hàng:</span>
                    <span style={{ color: '#0f172a' }}>{viewingOrder.customer}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8' }}>
                    <span>#{viewingOrder.id}</span>
                    <span>{viewingOrder.date}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', marginBottom: '10px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>
                    <div style={{ width: '200px' }}>Dịch vụ</div>
                    <div style={{ width: '40px', textAlign: 'center' }}>SL</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>Tiền</div>
                  </div>
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', marginBottom: '12px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#1e293b' }}>
                      <div style={{ width: '200px', lineHeight: '1.2' }}>{item.name}</div>
                      <div style={{ width: '40px', textAlign: 'center', color: '#3b82f6' }}>{item.quantity}</div>
                      <div style={{ flex: 1, textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString()}đ</div>
                    </div>
                  ))}
                  
                  {viewingOrder.discountAmount > 0 && (
                    <div style={{ display: 'flex', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#f97316' }}>
                      <div style={{ flex: 1 }}>GIẢM GIÁ: {viewingOrder.discountName || 'Ưu đãi'}</div>
                      <div style={{ textAlign: 'right' }}>-{viewingOrder.discountAmount.toLocaleString()}đ</div>
                    </div>
                  )}

                  {viewingOrder.note && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '700', color: '#64748b', fontStyle: 'italic', textTransform: 'uppercase' }}>
                        Ghi chú: {viewingOrder.note}
                    </div>
                  )}
                </div>

                <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 15px rgba(0,51,102,0.3)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', opacity: '0.7' }}>Tổng thanh toán</div>
                    <div style={{ fontSize: '28px', fontWeight: '900' }}>{viewingOrder.total.toLocaleString()}đ</div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '35px', fontSize: '9px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '3px' }}>Cảm ơn anh iu đã tin tưởng!</div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        input[type=range] { -webkit-appearance: none; background: rgba(255,255,255,0.1); border-radius: 10px; height: 4px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid white; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;