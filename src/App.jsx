import React, { useEffect, useMemo, useState } from 'react';
import { createChemical, getChemicals, readAccessToken, storeAccessToken, toApiChemical, updateChemical } from './chemicalApi';

const iconPaths = {
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></>,
  flask: <><path d="M9 3h6M10 3v6l-5.2 8.4A2.4 2.4 0 0 0 6.9 21h10.2a2.4 2.4 0 0 0 2.1-3.6L14 9V3"/><path d="M7.7 15h8.6"/></>,
  atom: <><circle cx="12" cy="12" r="1.2"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)"/></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 10h7"/></>,
  inbox: <><path d="M4 4h16l1.5 11H16l-1.5 2h-5L8 15H2.5z"/><path d="M3 20h18M9 10l3 3 3-3"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
  chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-6"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.2 2.1-1.5-.5a7.8 7.8 0 0 1-1.4.8l-.3 1.6h-2.5l-.4-1.6a7.8 7.8 0 0 1-1.5-.8l-1.5.5-1.2-2.1 1.2-1a7 7 0 0 1 0-1.7l-1.2-1 1.2-2.1 1.5.5a7.8 7.8 0 0 1 1.5-.8l.4-1.6h2.5l.3 1.6a7.8 7.8 0 0 1 1.4.8l1.5-.5 1.2 2.1-1.2 1a7 7 0 0 1-.1 1.6Z" transform="translate(-1 -1) scale(1.08)"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  down: <path d="m7 10 5 5 5-5"/>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  filter: <><path d="M4 6h16M7 12h10m-7 6h4"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  play: <path d="m8 5 11 7-11 7z"/>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M5 17v4h14v-4"/></>,
  drop: <><path d="M12 3s7 7.2 7 12a7 7 0 0 1-14 0c0-4.8 7-12 7-12Z"/><path d="M9 16a3 3 0 0 0 3 2"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
  sparkle: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
  leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z"/><path d="M4 21c3-5 7-8 13-11"/></>,
  flaskSmall: <><path d="M9 2h6M10 2v7l-5 9a2.5 2.5 0 0 0 2.2 4h9.6a2.5 2.5 0 0 0 2.2-4l-5-9V2"/><path d="M7 15h10"/></>,
};

function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.grid}</svg>;
}

const baseChemicals = [
  { id: 1, name: 'Nước tinh khiết', formula: 'H₂O', state: 'Lỏng', category: 'Dung môi', color: '#bce9f0', density: '1.000', unit: 'g/mL', danger: 0, asset: 'prefab_liquid_h2o', description: 'Dung môi phổ biến trong các mô phỏng cơ bản.' },
  { id: 2, name: 'Natri clorua', formula: 'NaCl', state: 'Rắn', category: 'Muối', color: '#e8e9e5', density: '2.165', unit: 'g/cm³', danger: 1, asset: 'prefab_solid_nacl', description: 'Tinh thể ion màu trắng, thường gọi là muối ăn.' },
  { id: 3, name: 'Axit clohidric', formula: 'HCl', state: 'Lỏng', category: 'Axit', color: '#e5f3db', density: '1.180', unit: 'g/mL', danger: 3, asset: 'prefab_liquid_hcl', description: 'Dung dịch axit mạnh; mô phỏng cần cảnh báo ăn mòn.' },
  { id: 4, name: 'Oxi', formula: 'O₂', state: 'Khí', category: 'Khí', color: '#b9d0f5', density: '1.429', unit: 'g/L', danger: 1, asset: 'prefab_gas_o2', description: 'Chất khí không màu, hỗ trợ quá trình cháy.' },
  { id: 5, name: 'Đồng(II) sunfat', formula: 'CuSO₄', state: 'Rắn', category: 'Muối', color: '#78bed4', density: '3.600', unit: 'g/cm³', danger: 2, asset: 'prefab_solid_cuso4', description: 'Tinh thể xanh lam, dùng trong phản ứng kết tủa.' },
  { id: 6, name: 'Ethanol', formula: 'C₂H₆O', state: 'Lỏng', category: 'Dung môi', color: '#f2dfb7', density: '0.789', unit: 'g/mL', danger: 2, asset: 'prefab_liquid_ethanol', description: 'Dung môi hữu cơ dễ bay hơi và dễ cháy.' },
  { id: 7, name: 'Sắt', formula: 'Fe', state: 'Rắn', category: 'Kim loại', color: '#9ca6ad', density: '7.874', unit: 'g/cm³', danger: 0, asset: 'prefab_solid_fe', description: 'Kim loại chuyển tiếp thường gặp trong phản ứng thế.' },
  { id: 8, name: 'Cacbon đioxit', formula: 'CO₂', state: 'Khí', category: 'Khí', color: '#d2dce5', density: '1.977', unit: 'g/L', danger: 1, asset: 'prefab_gas_co2', description: 'Khí không màu, tạo ra trong nhiều phản ứng cháy.' },
];

const reactions = [
  { id: 'RX-014', name: 'Trung hòa axit - bazơ', equation: 'HCl + NaOH → NaCl + H₂O', type: 'Trung hòa', time: '4 phút', level: 'Cơ bản', color: 'mint', participants: 4, description: 'Quan sát sự tạo thành muối và nước khi axit phản ứng với bazơ.' },
  { id: 'RX-021', name: 'Sắt tác dụng với đồng sunfat', equation: 'Fe + CuSO₄ → FeSO₄ + Cu', type: 'Phản ứng thế', time: '6 phút', level: 'Trung cấp', color: 'blue', participants: 4, description: 'Mô phỏng phản ứng oxi hóa - khử và sự bám đồng trên sắt.' },
  { id: 'RX-008', name: 'Phân hủy hydrogen peroxide', equation: '2H₂O₂ → 2H₂O + O₂', type: 'Phân hủy', time: '5 phút', level: 'Cơ bản', color: 'amber', participants: 3, description: 'Theo dõi sự giải phóng khí oxi trong phản ứng phân hủy.' },
  { id: 'RX-032', name: 'Tạo kết tủa bari sunfat', equation: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl', type: 'Trao đổi', time: '7 phút', level: 'Nâng cao', color: 'violet', participants: 4, description: 'Nhận biết phản ứng trao đổi thông qua kết tủa trắng.' },
];

const assignments = [
  { id: 'LAB-024', title: 'Phản ứng trung hòa', category: 'Axit và bazơ', due: 'Hôm nay, 23:59', enrolled: 28, submitted: 22, status: 'Đang mở', score: 100, color: 'mint' },
  { id: 'LAB-023', title: 'Kim loại và dung dịch muối', category: 'Phản ứng thế', due: 'Ngày mai, 23:59', enrolled: 31, submitted: 18, status: 'Đang mở', score: 100, color: 'blue' },
  { id: 'LAB-022', title: 'Nhận biết khí oxi và cacbon đioxit', category: 'Chất khí', due: '25 thg 10, 23:59', enrolled: 26, submitted: 26, status: 'Đã đóng', score: 80, color: 'amber' },
  { id: 'LAB-021', title: 'An toàn trong phòng thí nghiệm', category: 'Kỹ năng cơ bản', due: '24 thg 10, 23:59', enrolled: 30, submitted: 29, status: 'Đã đóng', score: 50, color: 'violet' },
];

const submissions = [
  { student: 'Nguyễn Minh Anh', initials: 'MA', assignment: 'Phản ứng trung hòa', score: '96/100', time: '2 phút trước', status: 'Chờ chấm', tone: 'amber' },
  { student: 'Trần Gia Bảo', initials: 'GB', assignment: 'Kim loại và dung dịch muối', score: '88/100', time: '18 phút trước', status: 'Chờ chấm', tone: 'amber' },
  { student: 'Lê Hoàng Nam', initials: 'HN', assignment: 'Phản ứng trung hòa', score: '100/100', time: '42 phút trước', status: 'Đã chấm', tone: 'mint' },
  { student: 'Phạm Khánh Linh', initials: 'KL', assignment: 'Nhận biết khí', score: '74/80', time: '1 giờ trước', status: 'Đã chấm', tone: 'mint' },
];

const users = [
  { name: 'Lê Minh Khoa', email: 'khoa.le@chemistrylab.edu.vn', role: 'ADMIN', initials: 'LK', active: true },
  { name: 'Nguyễn Thảo Vy', email: 'vy.nguyen@chemistrylab.edu.vn', role: 'LECTURER', initials: 'TV', active: true },
  { name: 'Trần Gia Bảo', email: 'bao.tran@chemistrylab.edu.vn', role: 'STUDENT', initials: 'GB', active: true },
  { name: 'Phạm Khánh Linh', email: 'linh.pham@chemistrylab.edu.vn', role: 'STUDENT', initials: 'KL', active: false },
];

const navGroups = [
  { label: 'KHÔNG GIAN HỌC TẬP', items: [
    { id: 'overview', label: 'Tổng quan', icon: 'grid' },
    { id: 'chemicals', label: 'Thư viện hóa chất', icon: 'flask', count: '248' },
    { id: 'reactions', label: 'Phản ứng', icon: 'atom', count: '36' },
    { id: 'assignments', label: 'Bài tập', icon: 'book', count: '12' },
    { id: 'submissions', label: 'Bài nộp', icon: 'inbox', badge: '8' },
  ]},
  { label: 'QUẢN TRỊ', items: [
    { id: 'people', label: 'Người dùng', icon: 'users' },
    { id: 'analytics', label: 'Báo cáo', icon: 'chart' },
    { id: 'settings', label: 'Cài đặt', icon: 'settings' },
  ]},
];

const titleByView = {
  overview: ['Không gian học tập', 'Tổng quan'], chemicals: ['Thư viện nội dung', 'Hóa chất'], reactions: ['Thư viện nội dung', 'Phản ứng'],
  assignments: ['Lớp học', 'Bài tập'], submissions: ['Lớp học', 'Bài nộp'], people: ['Quản trị hệ thống', 'Người dùng'],
  analytics: ['Quản trị hệ thống', 'Báo cáo học tập'], settings: ['Quản trị hệ thống', 'Cài đặt'],
};

function readSavedChemicals() {
  try { return JSON.parse(localStorage.getItem('clvr-chemicals')) || baseChemicals; }
  catch { return baseChemicals; }
}

function App() {
  const [view, setView] = useState('overview');
  const [chemicals, setChemicals] = useState(readSavedChemicals);
  const [search, setSearch] = useState('');
  const [chemicalFilter, setChemicalFilter] = useState('Tất cả');
  const [modal, setModal] = useState(null);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [assignmentTab, setAssignmentTab] = useState('Tất cả');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(readAccessToken);
  const [chemicalLoading, setChemicalLoading] = useState(false);
  const [chemicalError, setChemicalError] = useState('');
  const [editingChemical, setEditingChemical] = useState(null);

  useEffect(() => {
    if (!accessToken) return undefined;
    let active = true;
    setChemicalLoading(true);
    setChemicalError('');
    getChemicals(accessToken)
      .then((items) => { if (active) setChemicals(items); })
      .catch((error) => { if (active) setChemicalError(error.message); })
      .finally(() => { if (active) setChemicalLoading(false); });
    return () => { active = false; };
  }, [accessToken]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(timeout);
  }, [toast]);

  const filteredChemicals = useMemo(() => chemicals.filter((item) => {
    const query = search.trim().toLocaleLowerCase('vi');
    const matchesQuery = !query || [item.name, item.formula, item.category, item.asset].some((value) => String(value || '').toLocaleLowerCase('vi').includes(query));
    const matchesFilter = chemicalFilter === 'Tất cả' || item.category === chemicalFilter || item.state === chemicalFilter;
    return matchesQuery && matchesFilter;
  }), [chemicals, search, chemicalFilter]);

  function changeView(id) { setView(id); setSearch(''); setMobileNav(false); }
  async function saveChemical(form) {
    const name = form.get('name')?.trim();
    const formula = form.get('formula')?.trim();
    if (!name || !formula) return;
    if (!accessToken) {
      setToast('Hãy kết nối API bằng access token trước khi lưu.');
      return;
    }
    try {
      const payload = toApiChemical(form);
      if (editingChemical) await updateChemical(accessToken, editingChemical.id, payload);
      else await createChemical(accessToken, payload);
      const items = await getChemicals(accessToken);
      setChemicals(items);
      setModal(null);
      setEditingChemical(null);
      setChemicalError('');
      setToast(editingChemical ? 'Đã cập nhật hóa chất.' : 'Đã thêm hóa chất vào thư viện.');
    } catch (error) {
      setChemicalError(error.message);
    }
  }

  async function connectChemicalApi(rawToken) {
    const token = rawToken.trim().replace(/^Bearer\s+/i, '');
    if (!token) return;
    setChemicalLoading(true);
    setChemicalError('');
    try {
      const items = await getChemicals(token);
      storeAccessToken(token);
      setAccessToken(token);
      setChemicals(items);
      setModal(null);
      setToast('Đã kết nối API hóa chất.');
    } catch (error) {
      setChemicalError(error.message);
    } finally {
      setChemicalLoading(false);
    }
  }

  function disconnectChemicalApi() {
    storeAccessToken('');
    setAccessToken('');
    setChemicalError('');
    setChemicals(readSavedChemicals());
    setToast('Đã xóa access token khỏi phiên trình duyệt.');
  }

  const pageHeading = titleByView[view] || titleByView.overview;

  return (
    <div className="app-shell">
      <div className={`mobile-scrim ${mobileNav ? 'is-visible' : ''}`} onClick={() => setMobileNav(false)} />
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="flaskSmall" size={22} /></div>
          <div><div className="brand-name">Molecule<span>Lab</span></div><div className="brand-caption">VIRTUAL CHEMISTRY</div></div>
          <button className="icon-button sidebar-close" aria-label="Đóng menu" onClick={() => setMobileNav(false)}><Icon name="close" /></button>
        </div>

        <button className="workspace-switcher" onClick={() => setToast('Bạn đang ở không gian lớp Hóa học 10A.') }>
          <div className="workspace-icon">10<span>A</span></div>
          <div className="workspace-copy"><strong>Lớp Hóa học 10A</strong><span>Không gian lớp học</span></div>
          <Icon name="down" size={15} />
        </button>

        <nav className="side-navigation" aria-label="Điều hướng chính">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            <div className="nav-group-title">{group.label}</div>
            {group.items.map((item) => <button key={item.id} className={`nav-link ${view === item.id ? 'nav-link-active' : ''}`} onClick={() => changeView(item.id)}>
              <Icon name={item.icon} size={18} /> <span>{item.label}</span>
              {item.count && <small>{item.count}</small>}{item.badge && <b className="nav-badge">{item.badge}</b>}
            </button>)}
          </div>)}
        </nav>

        <div className="sidebar-lab-card">
          <div className="lab-orbit orbit-one"/><div className="lab-orbit orbit-two"/><div className="lab-orb">H₂O</div>
          <span className="eyebrow">PHÒNG THÍ NGHIỆM ẢO</span>
          <strong>Sẵn sàng khám phá?</strong>
          <p>Bắt đầu một phiên thực hành an toàn trong không gian 3D.</p>
          <button onClick={() => setToast('Kết nối Unity sẽ được tích hợp ở giai đoạn tiếp theo.')}>Mở phòng lab <Icon name="arrow" size={15} /></button>
        </div>

        <div className="sidebar-profile">
          <div className="avatar avatar-green">LK</div>
          <div className="profile-copy"><strong>Lê Minh Khoa</strong><span>Quản trị viên</span></div>
          <button className="icon-button profile-more" aria-label="Tùy chọn tài khoản" onClick={() => setToast('Tài khoản demo · ADMIN')}><Icon name="more" /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" onClick={() => setMobileNav(true)} aria-label="Mở menu"><span className="hamburger">☰</span></button>
            <div className="breadcrumbs"><span>{pageHeading[0]}</span><Icon name="chevron" size={14} /><strong>{pageHeading[1]}</strong></div>
          </div>
          <div className="topbar-actions">
            <label className="global-search"><Icon name="search" size={17}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm trong không gian..." aria-label="Tìm kiếm"/><kbd>⌘ K</kbd></label>
            <div className="demo-pill"><span/> {accessToken ? 'API ĐÃ KẾT NỐI' : 'DỮ LIỆU DEMO'}</div>
            <div className="notification-wrap">
              <button className={`icon-button notification-button ${notificationOpen ? 'is-open' : ''}`} aria-label="Thông báo" onClick={() => setNotificationOpen((v) => !v)}><Icon name="bell" size={19}/><i/></button>
              {notificationOpen && <div className="notification-popover"><strong>Thông báo mới</strong><p><span className="notification-dot"/>8 bài nộp đang chờ chấm.</p><p><span className="notification-dot dot-blue"/>Có 2 lớp học đang hoạt động.</p><button onClick={() => { setView('submissions'); setNotificationOpen(false); }}>Xem bài nộp <Icon name="arrow" size={14}/></button></div>}
            </div>
            <div className="topbar-divider"/>
            <button className="top-user" onClick={() => setToast('Bạn đang đăng nhập với vai trò ADMIN.')}><span className="avatar avatar-mini">LK</span><span className="top-user-name">Lê Minh Khoa</span><Icon name="down" size={14}/></button>
          </div>
        </header>

        <div className="page-content">
          {view === 'overview' && <Overview chemicals={chemicals} go={changeView} setToast={setToast} />}
          {view === 'chemicals' && <ChemicalLibrary chemicals={filteredChemicals} activeFilter={chemicalFilter} setFilter={setChemicalFilter} onAdd={() => { setEditingChemical(null); setChemicalError(''); setModal(accessToken ? { type: 'chemical' } : { type: 'token' }); }} onSelect={setSelectedChemical} connected={Boolean(accessToken)} loading={chemicalLoading} error={chemicalError} onConnect={() => setModal({ type: 'token' })} onDisconnect={disconnectChemicalApi} />}
          {view === 'reactions' && <ReactionLibrary setToast={setToast} />}
          {view === 'assignments' && <Assignments tab={assignmentTab} setTab={setAssignmentTab} setToast={setToast} />}
          {view === 'submissions' && <Submissions setToast={setToast} />}
          {view === 'people' && <People setToast={setToast} />}
          {view === 'analytics' && <Analytics />}
          {view === 'settings' && <Settings setToast={setToast} />}
        </div>
      </main>

      {modal?.type === 'token' && <TokenModal onClose={() => setModal(null)} onConnect={connectChemicalApi} loading={chemicalLoading} error={chemicalError} />}
      {modal?.type === 'chemical' && <ChemicalModal chemical={editingChemical} onClose={() => { setModal(null); setEditingChemical(null); }} onSave={saveChemical} error={chemicalError} />}
      {selectedChemical && <ChemicalDetailModal chemical={selectedChemical} onClose={() => setSelectedChemical(null)} onEdit={() => { setEditingChemical(selectedChemical); setSelectedChemical(null); setChemicalError(''); setModal({ type: 'chemical' }); }} />}
      {toast && <div className="toast"><span className="toast-check"><Icon name="check" size={15}/></span>{toast}</div>}
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action, secondary }) {
  return <div className="page-title-row"><div><div className="eyebrow page-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="page-title-actions">{secondary}{action}</div></div>;
}

function Button({ children, variant = 'primary', icon, onClick, className = '', type = 'button' }) {
  return <button type={type} className={`button button-${variant} ${className}`} onClick={onClick}>{icon && <Icon name={icon} size={16}/>}<span>{children}</span></button>;
}

function Overview({ chemicals, go, setToast }) {
  const stats = [
    { label: 'Hóa chất trong thư viện', value: String(248 + chemicals.length - baseChemicals.length), note: '+12 trong tháng này', icon: 'flask', color: 'mint', trend: 'up' },
    { label: 'Mô phỏng phản ứng', value: '36', note: '+4 mô phỏng mới', icon: 'atom', color: 'blue', trend: 'up' },
    { label: 'Bài tập đang mở', value: '12', note: '3 lớp học', icon: 'book', color: 'amber', trend: 'neutral' },
    { label: 'Bài nộp cần chấm', value: '08', note: 'Cập nhật 5 phút trước', icon: 'inbox', color: 'violet', trend: 'alert' },
  ];
  return <>
    <PageTitle eyebrow="THỨ HAI, 20 THÁNG 10, 2026" title="Chào buổi sáng, Khoa" description="Đây là những gì đang diễn ra trong phòng thí nghiệm của bạn hôm nay." action={<Button icon="play" onClick={() => setToast('Kết nối Unity sẽ được tích hợp ở giai đoạn tiếp theo.')}>Bắt đầu mô phỏng</Button>} />
    <section className="welcome-banner">
      <div className="welcome-copy"><span className="welcome-tag"><Icon name="sparkle" size={13}/> KHÔNG GIAN THỰC HÀNH</span><h2>Học hóa học bằng cách<br/><em>tự tay khám phá.</em></h2><p>Quản lý nội dung, giao bài tập và theo dõi tiến độ học tập trong một không gian thống nhất.</p><button className="banner-link" onClick={() => go('chemicals')}>Khám phá thư viện <Icon name="arrow" size={15}/></button></div>
      <div className="welcome-art" aria-hidden="true"><div className="art-glow"/><div className="art-ring ring-a"/><div className="art-ring ring-b"/><div className="art-ring ring-c"/><div className="molecule-center">H<sub>2</sub>O</div><div className="molecule-node node-a">Na</div><div className="molecule-node node-b">O</div><div className="molecule-node node-c">Cl</div><div className="molecule-node node-d">Fe</div><span className="art-caption">VIRTUAL LAB · V.01</span></div>
      <div className="banner-index"><span>01</span><span className="index-line"/><span>03</span></div>
    </section>
    <section className="stats-grid" aria-label="Chỉ số chính">{stats.map((item) => <div className="stat-card" key={item.label}><div className={`stat-icon ${item.color}`}><Icon name={item.icon} size={18}/></div><div className="stat-note"><span className={`trend-${item.trend}`}>{item.trend === 'up' ? '↗' : item.trend === 'alert' ? '!' : '•'}</span> {item.note}</div><div className="stat-value">{item.value}</div><div className="stat-label">{item.label}</div></div>)}</section>
    <section className="dashboard-grid">
      <div className="panel activity-panel"><div className="panel-heading"><div><div className="eyebrow">HOẠT ĐỘNG</div><h3>Hoạt động gần đây</h3></div><button className="text-button" onClick={() => go('submissions')}>Xem tất cả <Icon name="arrow" size={14}/></button></div>
        <div className="activity-list">
          <ActivityItem initials="MA" color="pink" title="Nguyễn Minh Anh" detail={<>đã nộp bài <b>Phản ứng trung hòa</b></>} time="2 phút trước" icon="check"/>
          <ActivityItem initials="TV" color="lavender" title="Nguyễn Thảo Vy" detail={<>đã tạo bài tập <b>Kim loại và dung dịch muối</b></>} time="24 phút trước" icon="book"/>
          <ActivityItem initials="GB" color="blue" title="Trần Gia Bảo" detail={<>hoàn thành mô phỏng <b>Nhận biết khí</b></>} time="45 phút trước" icon="atom"/>
          <ActivityItem initials="KL" color="gold" title="Phạm Khánh Linh" detail={<>đã đạt <b>92 điểm</b> trong bài tập tuần</>} time="1 giờ trước" icon="chart"/>
        </div><button className="activity-footer" onClick={() => go('submissions')}>Mở bảng hoạt động <Icon name="arrow" size={14}/></button>
      </div>
      <div className="panel session-panel"><div className="panel-heading"><div><div className="eyebrow">PHÒNG LAB ẢO</div><h3>Phiên thực hành</h3></div><span className="live-indicator"><i/> ĐANG HOẠT ĐỘNG</span></div>
        <div className="session-visual"><div className="session-grid-lines"/><div className="beaker-wrap"><div className="beaker"><div className="liquid"><span/><span/><span/></div><div className="beaker-neck"/></div><div className="beaker-shadow"/></div><div className="session-label"><span>HÓA HỌC 10A</span><strong>Phản ứng trung hòa</strong><small><Icon name="users" size={13}/> 18 học viên đang tham gia</small></div><span className="session-code">LAB / 014</span></div>
        <div className="session-bottom"><div><span className="eyebrow">THỜI LƯỢNG TRUNG BÌNH</span><strong>08:42 <small>phút / phiên</small></strong></div><button className="round-arrow" onClick={() => go('reactions')} aria-label="Xem phản ứng"><Icon name="arrow" size={17}/></button></div>
      </div>
    </section>
    <section className="bottom-grid">
      <div className="panel quick-panel"><div className="panel-heading"><div><div className="eyebrow">TRUY CẬP NHANH</div><h3>Tiếp tục công việc</h3></div></div><div className="quick-links"><button onClick={() => go('chemicals')}><span className="quick-icon quick-mint"><Icon name="flask"/></span><span><b>Quản lý hóa chất</b><small>Cập nhật thư viện mô phỏng</small></span><Icon name="chevron" size={17}/></button><button onClick={() => go('assignments')}><span className="quick-icon quick-amber"><Icon name="book"/></span><span><b>Tạo bài tập mới</b><small>Chuẩn bị nội dung cho lớp học</small></span><Icon name="chevron" size={17}/></button></div></div>
      <div className="panel insight-panel"><div className="insight-top"><span className="insight-mark"><Icon name="sparkle" size={16}/></span><span className="eyebrow">GỢI Ý TỪ PHÒNG LAB</span></div><h3>Lớp 10A đang học tốt hơn <em>18%</em> so với tuần trước.</h3><p>Tỷ lệ hoàn thành mô phỏng trung hòa axit đang tăng đều.</p><button className="text-button" onClick={() => go('analytics')}>Xem báo cáo lớp <Icon name="arrow" size={14}/></button></div>
    </section>
  </>;
}

function ActivityItem({ initials, color, title, detail, time, icon }) {
  return <div className="activity-item"><div className={`activity-avatar ${color}`}>{initials}</div><div className="activity-copy"><div><b>{title}</b> {detail}</div><small><Icon name="clock" size={12}/>{time}</small></div><span className="activity-type"><Icon name={icon} size={15}/></span></div>;
}

function ChemicalLibrary({ chemicals, activeFilter, setFilter, onAdd, onSelect, connected, loading, error, onConnect, onDisconnect }) {
  const filters = ['Tất cả', 'Lỏng', 'Rắn', 'Khí'];
  return <>
    <PageTitle eyebrow="THƯ VIỆN NỘI DUNG" title="Hóa chất" description="Quản lý hồ sơ hóa chất và tài nguyên hiển thị trong phòng lab ảo." secondary={connected ? <Button variant="outline" icon="logout" onClick={onDisconnect}>Ngắt kết nối</Button> : <Button variant="outline" icon="shield" onClick={onConnect}>Kết nối API</Button>} action={<Button icon="plus" onClick={onAdd}>Thêm hóa chất</Button>} />
    {!connected && <div className="chemical-notice"><Icon name="shield" size={16}/><span>Đang hiển thị dữ liệu demo. Kết nối API bằng access token để xem và chỉnh sửa dữ liệu thật.</span><button onClick={onConnect}>Kết nối ngay</button></div>}
    {error && <div className="chemical-error" role="alert"><strong>Lỗi API:</strong> {error}</div>}
    <div className="library-summary"><div><span className="summary-mark"><Icon name="flask"/></span><span><strong>{chemicals.length}</strong><small>hóa chất {connected ? 'từ máy chủ' : 'demo'}</small></span></div><div className="summary-divider"/><div className="summary-meta"><span className="summary-dot mint-dot"/> Lỏng <span className="summary-separator">·</span><span className="summary-dot blue-dot"/> Rắn <span className="summary-separator">·</span> Khí</div><div className="library-summary-right"><span className="updated-label">{loading ? 'Đang tải dữ liệu…' : connected ? 'Đã đồng bộ với API' : 'Chế độ dữ liệu demo'}</span></div></div>
    <div className="filter-toolbar"><div className="filter-tabs">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter-active' : ''} onClick={() => setFilter(filter)}>{filter}</button>)}</div></div>
    <div className="chemical-grid">{chemicals.map((chemical) => <ChemicalCard key={chemical.id} chemical={chemical} onClick={() => onSelect(chemical)}/>)}
      {loading && <div className="empty-state"><h3>Đang tải thư viện hóa chất…</h3></div>}
      {!loading && chemicals.length === 0 && <div className="empty-state"><span className="empty-icon"><Icon name="search" size={22}/></span><h3>Không tìm thấy hóa chất</h3><p>Thử đổi bộ lọc hoặc thêm hồ sơ mới.</p></div>}
    </div>
    <div className="catalog-footer"><span>Đang hiển thị <b>{chemicals.length}</b> hóa chất</span></div>
  </>;
}

function ChemicalCard({ chemical, onClick }) {
  const danger = chemical.danger > 2 ? 'danger-high' : chemical.danger > 0 ? 'danger-medium' : 'danger-low';
  return <button className="chemical-card" onClick={onClick}>
    <div className={`chemical-art art-${chemical.state === 'Khí' ? 'gas' : chemical.state === 'Rắn' ? 'solid' : 'liquid'}`} style={{ '--chemical-color': chemical.color }}>
      <div className="art-molecule"><span>{chemical.formula}</span></div><div className="art-sphere sphere-one"/><div className="art-sphere sphere-two"/><div className="art-sphere sphere-three"/><span className="art-code">CL / {String(chemical.id).padStart(3, '0')}</span>
      <span className="state-chip"><i className={chemical.state === 'Khí' ? 'state-gas' : chemical.state === 'Rắn' ? 'state-solid' : 'state-liquid'}/>{chemical.state}</span>
      <span className={`danger-indicator ${danger}`} title={`Mức cảnh báo demo: ${chemical.danger}`}><Icon name="shield" size={13}/><span>{chemical.danger === 0 ? 'An toàn' : `Cấp ${chemical.danger}`}</span></span>
    </div>
    <div className="chemical-card-content"><div className="chemical-category">{chemical.category}</div><div className="chemical-name-row"><h3>{chemical.name}</h3><span className="chemical-formula">{chemical.formula}</span></div><p>{chemical.description}</p><div className="chemical-card-meta"><span><Icon name="drop" size={13}/> {chemical.density} {chemical.unit}</span><span className="asset-ready"><i/> Asset sẵn sàng</span></div></div>
  </button>;
}

function ChemicalModal({ chemical, onClose, onSave, error }) {
  const stateDefault = { Lỏng: 'LIQUID', Rắn: 'SOLID', Khí: 'GAS' }[chemical?.state] || 'LIQUID';
  return <Modal title={chemical ? 'Chỉnh sửa hóa chất' : 'Thêm hóa chất mới'} subtitle="Thông tin được lưu vào backend ChemistryLabVR." onClose={onClose}>
    <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onSave(new FormData(event.currentTarget)); }}>
      <label className="form-field"><span>Tên hóa chất <b>*</b></span><input name="name" defaultValue={chemical?.name || ''} placeholder="Ví dụ: Natri clorua" required autoFocus/></label>
      <label className="form-field"><span>Công thức hóa học <b>*</b></span><input name="formula" defaultValue={chemical?.formula || ''} placeholder="Ví dụ: NaCl" required/></label>
      <label className="form-field"><span>Trạng thái</span><select name="state" defaultValue={stateDefault}><option value="LIQUID">Lỏng</option><option value="SOLID">Rắn</option><option value="GAS">Khí</option></select></label>
      <label className="form-field"><span>Khối lượng riêng</span><input name="density" type="number" step="0.001" defaultValue={chemical?.density === '—' ? '' : chemical?.density ?? ''} placeholder="1.000"/></label>
      <label className="form-field"><span>Đơn vị</span><input name="unit" defaultValue={chemical?.unit || ''} placeholder="g/mL"/></label>
      <label className="form-field"><span>Mức cảnh báo nội bộ</span><select name="danger" defaultValue={chemical?.danger ?? 0}><option value="0">0 — Thông thường</option><option value="1">1 — Thấp</option><option value="2">2 — Trung bình</option><option value="3">3 — Cao</option></select></label>
      <label className="form-field"><span>Màu mô phỏng</span><div className="color-input"><input type="color" name="color" defaultValue={chemical?.color || '#bce9f0'}/><small>Màu hiển thị trong mô phỏng</small></div></label>
      <label className="form-field form-wide"><span>Mô tả</span><textarea name="description" defaultValue={chemical?.description === 'Chưa có mô tả.' ? '' : chemical?.description || ''} rows="3" placeholder="Thông tin ngắn về hóa chất..."/></label>
      <div className="form-footnote"><Icon name="shield" size={15}/> Mức cảnh báo là nhãn demo nội bộ, không thay thế phân loại GHS hoặc SDS.</div>
      {error && <div className="chemical-error form-wide" role="alert">{error}</div>}
      <div className="modal-actions"><Button variant="ghost" onClick={onClose}>Hủy</Button><Button type="submit" icon="plus">{chemical ? 'Lưu thay đổi' : 'Lưu hóa chất'}</Button></div>
    </form>
  </Modal>;
}

function ChemicalDetailModal({ chemical, onClose, onEdit }) {
  return <Modal title={chemical.name} subtitle={`${chemical.formula} · ${chemical.category}`} onClose={onClose}>
    <div className="detail-visual" style={{ '--chemical-color': chemical.color }}><div className="art-ring ring-a"/><div className="molecule-center">{chemical.formula}</div><span className="state-chip"><i/>{chemical.state}</span></div>
    <p className="detail-description">{chemical.description}</p>
    <div className="detail-grid"><Detail label="Công thức" value={chemical.formula}/><Detail label="Trạng thái" value={chemical.state}/><Detail label="Khối lượng riêng" value={`${chemical.density} ${chemical.unit}`}/><Detail label="Mức cảnh báo demo" value={`Cấp ${chemical.danger}`}/><Detail label="Tài nguyên Unity" value={chemical.asset} wide/></div>
    <div className="detail-warning"><Icon name="shield" size={16}/> Thông tin an toàn và tính chất cần được đối chiếu với nguồn tham khảo phù hợp trước khi sử dụng trong nội dung học tập.</div>
    <div className="modal-actions detail-actions"><Button variant="ghost" onClick={onClose}>Đóng</Button><Button icon="settings" onClick={onEdit}>Chỉnh sửa</Button></div>
  </Modal>;
}

function TokenModal({ onClose, onConnect, loading, error }) {
  return <Modal title="Kết nối API hóa chất" subtitle="Dán access token vừa nhận từ API đăng nhập." onClose={onClose}>
    <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onConnect(new FormData(event.currentTarget).get('token') || ''); }}>
      <label className="form-field form-wide"><span>Access token <b>*</b></span><textarea name="token" rows="4" placeholder="eyJhbGciOiJIUzI1NiJ9…" required autoFocus/></label>
      <div className="form-footnote form-wide"><Icon name="shield" size={15}/> Token chỉ được giữ trong sessionStorage của tab hiện tại và sẽ bị xóa khi ngắt kết nối hoặc đóng tab. Không chia sẻ token.</div>
      {error && <div className="chemical-error form-wide" role="alert">{error}</div>}
      <div className="modal-actions"><Button variant="ghost" onClick={onClose}>Hủy</Button><Button type="submit" icon="shield">{loading ? 'Đang kết nối…' : 'Kiểm tra và kết nối'}</Button></div>
    </form>
  </Modal>;
}

function Detail({ label, value, wide }) { return <div className={`detail-cell ${wide ? 'detail-wide' : ''}`}><span>{label}</span><strong>{value || '—'}</strong></div>; }

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => { const onKey = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal-card" role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><div><div className="eyebrow">THƯ VIỆN HÓA CHẤT</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Đóng"><Icon name="close"/></button></div>{children}</section></div>;
}

function ReactionLibrary({ setToast }) {
  const [query, setQuery] = useState('');
  const list = reactions.filter((item) => `${item.name} ${item.equation} ${item.type}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  return <>
    <PageTitle eyebrow="THƯ VIỆN NỘI DUNG" title="Phản ứng hóa học" description="Tổ chức các mô phỏng phản ứng và hiệu ứng trực quan cho lớp học." action={<Button icon="plus" onClick={() => setToast('Biểu mẫu tạo phản ứng sẽ kết nối với API ở giai đoạn tiếp theo.')}>Tạo phản ứng</Button>} />
    <div className="reaction-toolbar"><div className="search-control"><Icon name="search"/><input placeholder="Tìm theo tên hoặc phương trình..." value={query} onChange={(e) => setQuery(e.target.value)}/></div><button className="filter-button"><Icon name="filter"/> Loại phản ứng <Icon name="down" size={14}/></button><button className="filter-button"><Icon name="chart"/> Mức độ <Icon name="down" size={14}/></button></div>
    <div className="reaction-feature"><div className="feature-content"><span className="feature-tag"><Icon name="sparkle" size={13}/> ĐƯỢC SỬ DỤNG NHIỀU NHẤT</span><h2>Phản ứng hóa học<br/>trở nên trực quan.</h2><p>Khám phá biến đổi của chất qua mô phỏng 3D, hiệu ứng và hướng dẫn từng bước.</p><button className="banner-link" onClick={() => setToast('Kết nối phòng thực hành Unity sẽ được tích hợp sau.')}>Mở phòng thực hành <Icon name="arrow" size={15}/></button></div><div className="feature-equation"><div className="equation-orbit eq-one"/><div className="equation-orbit eq-two"/><span className="equation-reactant">HCl</span><span className="equation-plus">+</span><span className="equation-reactant">NaOH</span><span className="equation-arrow">→</span><span className="equation-product">NaCl</span><span className="equation-plus">+</span><span className="equation-product">H₂O</span><div className="eq-caption">PHẢN ỨNG TRUNG HÒA · RX-014</div></div></div>
    <div className="section-header"><div><div className="eyebrow">DANH MỤC MÔ PHỎNG</div><h3>Tất cả phản ứng <span className="muted-count">36</span></h3></div><button className="text-button">Sắp xếp: Gần đây <Icon name="down" size={14}/></button></div>
    <div className="reaction-grid">{list.map((item) => <ReactionCard key={item.id} item={item} onClick={() => setToast(`${item.name} · ${item.description}`)}/>)}{!list.length && <div className="empty-state"><h3>Không tìm thấy phản ứng</h3></div>}</div>
  </>;
}

function ReactionCard({ item, onClick }) {
  return <button className="reaction-card" onClick={onClick}><div className={`reaction-art ${item.color}`}><div className="reaction-art-orbit"/><div className="reaction-art-orbit orbit-small"/><div className="reaction-art-molecule"><span>{item.equation.split('→')[0].trim().split(' + ')[0]}</span><i>→</i><span>{item.equation.split('→')[1]?.trim().split(' + ')[0]}</span></div><span className="reaction-level">{item.level}</span></div><div className="reaction-card-body"><div className="reaction-card-meta"><span>{item.id}</span><span>{item.type}</span></div><h3>{item.name}</h3><div className="equation-text">{item.equation}</div><div className="reaction-card-footer"><span><Icon name="clock" size={13}/>{item.time}</span><span><Icon name="flask" size={13}/>{item.participants} chất tham gia</span><span className="reaction-open"><Icon name="arrow" size={15}/></span></div></div></button>;
}

function Assignments({ tab, setTab, setToast }) {
  const tabs = ['Tất cả', 'Đang mở', 'Đã đóng'];
  const shown = assignments.filter((item) => tab === 'Tất cả' || item.status === tab);
  return <>
    <PageTitle eyebrow="LỚP HỌC · HÓA HỌC 10A" title="Bài tập" description="Thiết kế hoạt động thực hành và theo dõi tiến độ hoàn thành của học viên." secondary={<Button variant="outline" icon="filter">Lọc lớp</Button>} action={<Button icon="plus" onClick={() => setToast('Biểu mẫu tạo bài tập sẽ được kết nối với backend ở bước tiếp theo.')}>Tạo bài tập</Button>} />
    <div className="assignment-hero"><div><span className="eyebrow">TỔNG QUAN LỚP HỌC</span><h2>Hóa học 10A <span className="class-live"><i/> ĐANG HỌC</span></h2><p>32 học viên <span>·</span> Giảng viên Nguyễn Thảo Vy <span>·</span> Học kỳ I</p></div><div className="assignment-hero-stat"><span>HOÀN THÀNH TRUNG BÌNH</span><strong>78<small>%</small></strong><div className="progress-track"><i style={{ width: '78%' }}/></div></div><div className="hero-decoration"><div>10</div><span>A</span></div></div>
    <div className="assignment-summary-grid"><MiniStat label="Bài tập đang mở" value="2" note="Có hạn trong 48 giờ" color="mint"/><MiniStat label="Tổng lượt giao" value="115" note="Trong học kỳ này" color="blue"/><MiniStat label="Tỷ lệ hoàn thành" value="82%" note="Tăng 6% so với tuần trước" color="amber"/></div>
    <div className="section-header assignment-list-header"><div><div className="eyebrow">NỘI DUNG GIẢNG DẠY</div><h3>Danh sách bài tập <span className="muted-count">12</span></h3></div><div className="segmented-tabs">{tabs.map((item) => <button key={item} className={tab === item ? 'segment-active' : ''} onClick={() => setTab(item)}>{item}</button>)}</div></div>
    <div className="assignment-list">{shown.map((item) => <AssignmentRow key={item.id} item={item} onClick={() => setToast(`Đang mở bài tập: ${item.title}`)}/>)}</div>
  </>;
}

function MiniStat({ label, value, note, color }) { return <div className="mini-stat"><div className={`mini-stat-icon ${color}`}><Icon name={color === 'mint' ? 'book' : color === 'blue' ? 'users' : 'chart'} size={17}/></div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }

function AssignmentRow({ item, onClick }) {
  const progress = Math.round(item.submitted / item.enrolled * 100);
  return <button className="assignment-row" onClick={onClick}><span className={`assignment-type-icon ${item.color}`}><Icon name="book" size={19}/></span><span className="assignment-row-main"><span className="assignment-row-id">{item.id} <i>·</i> {item.category}</span><strong>{item.title}</strong><span className="assignment-row-due"><Icon name="clock" size={13}/>{item.due}</span></span><span className="assignment-progress"><span><b>{item.submitted}</b>/{item.enrolled} học viên</span><span className="progress-track"><i style={{ width: `${progress}%` }}/></span></span><span className={`status-pill ${item.status === 'Đang mở' ? 'status-open' : 'status-closed'}`}><i/>{item.status}</span><span className="assignment-score"><b>{item.score}</b><small>điểm tối đa</small></span><Icon name="chevron" className="row-chevron" size={17}/></button>;
}

function Submissions({ setToast }) {
  return <>
    <PageTitle eyebrow="LỚP HỌC · HÓA HỌC 10A" title="Bài nộp" description="Theo dõi kết quả thực hành và phản hồi bài làm của học viên." secondary={<Button variant="outline" icon="download" onClick={() => setToast('Đang chuẩn bị bảng điểm demo.')}>Xuất bảng điểm</Button>} action={<Button icon="filter">Lọc bài tập</Button>} />
    <div className="submission-stats"><div><span className="submission-stat-icon pending"><Icon name="clock"/></span><span><small>CHỜ CHẤM</small><b>08</b></span></div><div><span className="submission-stat-icon complete"><Icon name="check"/></span><span><small>ĐÃ CHẤM TUẦN NÀY</small><b>42</b></span></div><div><span className="submission-stat-icon average"><Icon name="chart"/></span><span><small>ĐIỂM TRUNG BÌNH</small><b>86.4<small>/100</small></b></span></div><div className="submission-stats-right"><span className="eyebrow">LỚP HÓA HỌC 10A</span><strong>32 học viên</strong><small>Cập nhật lần cuối 5 phút trước</small></div></div>
    <div className="panel submissions-panel"><div className="submission-table-head"><div><div className="eyebrow">KẾT QUẢ HỌC TẬP</div><h3>Bài nộp gần đây <span className="muted-count">50</span></h3></div><div className="table-actions"><div className="search-control compact"><Icon name="search"/><input placeholder="Tìm học viên..."/></div><button className="filter-button"><Icon name="filter"/> Lọc</button></div></div>
      <div className="responsive-table"><table><thead><tr><th>HỌC VIÊN</th><th>BÀI TẬP</th><th>ĐIỂM SỐ</th><th>THỜI GIAN NỘP</th><th>TRẠNG THÁI</th><th/></tr></thead><tbody>{submissions.map((item) => <tr key={item.student}><td><div className="student-cell"><span className={`avatar avatar-${item.tone}`}>{item.initials}</span><strong>{item.student}</strong></div></td><td>{item.assignment}</td><td><b className="score-cell">{item.score}</b></td><td className="muted-cell">{item.time}</td><td><span className={`status-pill ${item.status === 'Chờ chấm' ? 'status-review' : 'status-graded'}`}><i/>{item.status}</span></td><td><button className="table-row-action" onClick={() => setToast(`Mở bài nộp của ${item.student}`)}>Xem bài <Icon name="arrow" size={14}/></button></td></tr>)}</tbody></table></div>
      <div className="table-pagination"><span>Hiển thị <b>1–4</b> trong <b>50</b> bài nộp</span><div className="pagination"><button disabled>Trước</button><button className="page-current">1</button><button>2</button><button>3</button><span>…</span><button>13</button><button>Tiếp <Icon name="arrow" size={13}/></button></div></div>
    </div>
  </>;
}

function People({ setToast }) {
  const [selectedRole, setSelectedRole] = useState('Tất cả');
  const filtered = users.filter((u) => selectedRole === 'Tất cả' || u.role === selectedRole);
  return <>
    <PageTitle eyebrow="QUẢN TRỊ HỆ THỐNG" title="Người dùng" description="Quản lý tài khoản và vai trò trong không gian học tập." action={<Button icon="plus" onClick={() => setToast('Tạo tài khoản sẽ kết nối với API quản trị người dùng.')}>Mời thành viên</Button>} />
    <div className="people-summary"><MiniStat label="Tổng thành viên" value="184" note="Trong 6 lớp học" color="blue"/><MiniStat label="Giảng viên" value="12" note="3 người đang hoạt động" color="mint"/><MiniStat label="Học viên" value="168" note="96% tài khoản hoạt động" color="amber"/></div>
    <div className="panel people-panel"><div className="submission-table-head"><div><div className="eyebrow">DANH SÁCH TÀI KHOẢN</div><h3>Thành viên <span className="muted-count">184</span></h3></div><div className="table-actions"><div className="search-control compact"><Icon name="search"/><input placeholder="Tìm tên hoặc email..."/></div><select className="small-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}><option>Tất cả</option><option>ADMIN</option><option>LECTURER</option><option>STUDENT</option></select></div></div>
      <div className="responsive-table"><table><thead><tr><th>THÀNH VIÊN</th><th>VAI TRÒ</th><th>TRẠNG THÁI</th><th>HOẠT ĐỘNG GẦN ĐÂY</th><th/></tr></thead><tbody>{filtered.map((user) => <tr key={user.email}><td><div className="student-cell"><span className="avatar avatar-green">{user.initials}</span><span><strong>{user.name}</strong><small className="email-line">{user.email}</small></span></div></td><td><span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span></td><td><span className={`status-pill ${user.active ? 'status-open' : 'status-closed'}`}><i/>{user.active ? 'Hoạt động' : 'Tạm khóa'}</span></td><td className="muted-cell">{user.active ? 'Hôm nay, 09:42' : '20 thg 10, 14:08'}</td><td><button className="icon-button table-more" onClick={() => setToast(`Tùy chọn tài khoản ${user.name}`)}><Icon name="more"/></button></td></tr>)}</tbody></table></div></div>
  </>;
}

function Analytics() {
  const bars = [42, 55, 47, 68, 61, 77, 69, 88, 76, 95, 82, 100];
  return <>
    <PageTitle eyebrow="QUẢN TRỊ HỆ THỐNG" title="Báo cáo học tập" description="Tổng hợp mức độ tham gia và kết quả thực hành trong tháng này." secondary={<Button variant="outline" icon="clock">30 ngày qua <Icon name="down" size={13}/></Button>} action={<Button variant="outline" icon="download">Tải báo cáo</Button>} />
    <section className="analytics-stats"><Metric label="Lượt mô phỏng" value="2,840" change="+18.6%" icon="atom"/><Metric label="Thời lượng học" value="486 giờ" change="+12.4%" icon="clock"/><Metric label="Tỷ lệ hoàn thành" value="84.2%" change="+6.2%" icon="check"/><Metric label="Điểm trung bình" value="86.4" change="+3.8 điểm" icon="chart"/></section>
    <div className="analytics-grid"><div className="panel chart-panel"><div className="panel-heading"><div><div className="eyebrow">MỨC ĐỘ THAM GIA</div><h3>Hoạt động mô phỏng <span className="chart-period">12 tuần gần nhất</span></h3></div><button className="text-button">Theo tuần <Icon name="down" size={14}/></button></div><div className="chart-legend"><span><i/> Lượt bắt đầu</span><span><i/> Hoàn thành</span></div><div className="bar-chart"><div className="chart-y-labels"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div><div className="chart-bars">{bars.map((height, index) => <div className="bar-group" key={index}><div className="bar-pair"><i style={{ height: `${height}%` }}/><b style={{ height: `${Math.max(height - 18, 12)}%` }}/></div><small>{['T1','T2','T3','T4','T1','T2','T3','T4','T1','T2','T3','T4'][index]}</small></div>)}</div></div></div><div className="panel progress-panel"><div className="panel-heading"><div><div className="eyebrow">THEO LỚP HỌC</div><h3>Lớp học nổi bật</h3></div><button className="icon-button"><Icon name="more"/></button></div><ClassProgress name="Hóa học 10A" students="32 học viên" value={88} color="mint"/><ClassProgress name="Hóa học 11B" students="28 học viên" value={76} color="blue"/><ClassProgress name="Hóa học 10C" students="30 học viên" value={71} color="amber"/><ClassProgress name="Hóa học 12A" students="26 học viên" value={64} color="violet"/></div></div>
    <div className="insight-strip"><span className="insight-mark"><Icon name="sparkle"/></span><div><b>Nhận định nổi bật</b><p>Phản ứng trung hòa có tỷ lệ hoàn thành cao nhất trong tháng (94%). Chủ đề phản ứng thế cần thêm hướng dẫn từng bước.</p></div><button className="text-button">Chi tiết <Icon name="arrow" size={14}/></button></div>
  </>;
}

function Metric({ label, value, change, icon }) { return <div className="metric-card"><span className="metric-icon"><Icon name={icon}/></span><span className="metric-label">{label}</span><strong>{value}</strong><small><b>↗ {change}</b> so với tháng trước</small></div>; }
function ClassProgress({ name, students, value, color }) { return <div className="class-progress"><div><span><b>{name}</b><small>{students}</small></span><strong>{value}%</strong></div><div className="progress-track"><i className={`progress-${color}`} style={{ width: `${value}%` }}/></div></div>; }

function Settings({ setToast }) {
  const [toggles, setToggles] = useState({ email: true, weekly: false, public: true });
  const toggle = (name) => setToggles((current) => ({ ...current, [name]: !current[name] }));
  return <>
    <PageTitle eyebrow="QUẢN TRỊ HỆ THỐNG" title="Cài đặt" description="Tùy chỉnh không gian lớp học và cách nhận thông báo." action={<Button onClick={() => setToast('Đã lưu cài đặt trình diễn.')}>Lưu thay đổi</Button>} />
    <div className="settings-layout"><div className="settings-nav panel"><button className="settings-nav-active"><Icon name="grid"/> Tổng quan</button><button><Icon name="users"/> Lớp học</button><button><Icon name="bell"/> Thông báo</button><button><Icon name="shield"/> Bảo mật</button></div><div className="settings-content"><section className="panel settings-section"><div className="panel-heading"><div><div className="eyebrow">THÔNG TIN CHUNG</div><h3>Không gian học tập</h3></div></div><div className="settings-fields"><label className="form-field"><span>Tên không gian</span><input defaultValue="ChemistryLabVR — Hóa học 10A"/></label><label className="form-field"><span>Múi giờ</span><select defaultValue="Asia/Ho_Chi_Minh"><option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option><option>UTC</option></select></label><label className="form-field form-wide"><span>Mô tả</span><textarea rows="3" defaultValue="Không gian học tập và thực hành hóa học ảo."/></label></div></section><section className="panel settings-section"><div className="panel-heading"><div><div className="eyebrow">THÔNG BÁO</div><h3>Tùy chọn nhận tin</h3></div></div><SettingToggle title="Thông báo bài nộp mới" detail="Nhận thông báo khi học viên gửi bài tập." checked={toggles.email} onClick={() => toggle('email')}/><SettingToggle title="Tóm tắt hoạt động hàng tuần" detail="Gửi báo cáo tổng hợp vào sáng thứ Hai." checked={toggles.weekly} onClick={() => toggle('weekly')}/></section><section className="panel settings-section"><div className="panel-heading"><div><div className="eyebrow">TÍCH HỢP</div><h3>Kết nối phòng lab Unity</h3></div><span className="status-pill status-closed"><i/> Chưa kết nối</span></div><p className="settings-copy">Kết nối Unity để mở mô phỏng 3D và đồng bộ mã tài nguyên hóa chất với thư viện.</p><Button variant="outline" icon="atom" onClick={() => setToast('Cấu hình tích hợp Unity chưa được thiết lập.')}>Thiết lập kết nối</Button></section></div></div>
  </>;
}

function SettingToggle({ title, detail, checked, onClick }) { return <div className="setting-toggle-row"><span><b>{title}</b><small>{detail}</small></span><button className={`toggle-switch ${checked ? 'toggle-on' : ''}`} onClick={onClick} role="switch" aria-checked={checked}><i/></button></div>; }

export default App;

