export type QRStatus = 'Generated' | 'Assigned' | 'Activated' | 'In Stock' | 'In Transit' | 'Sold' | 'Registered' | 'Service' | 'Replaced' | 'Blocked';
export type ParentQRStatus = 'Generated' | 'Activated' | 'Packed' | 'In Transit' | 'Received' | 'Opened' | 'Retired';
export type MovementStatus = 'Planned' | 'Exit Scanned' | 'In Transit' | 'Entry Scanned' | 'Completed' | 'Exception' | 'Cancelled';
export type WarrantyStatus = 'Not Eligible' | 'Eligible' | 'Active' | 'Claim Open' | 'Under Service' | 'Approved' | 'Rejected' | 'Closed' | 'Expired';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export const organizations = [
  { id: 'ORG-001', name: 'TechFlow Electronics', type: 'Manufacturer', country: 'China', city: 'Shenzhen', status: 'Active', users: 42 },
  { id: 'ORG-002', name: 'Gulf Trade Logistics', type: 'Warehouse', country: 'UAE', city: 'Dubai', status: 'Active', users: 18 },
  { id: 'ORG-003', name: 'BritHub Fulfilment', type: 'Warehouse', country: 'UK', city: 'London', status: 'Active', users: 14 },
  { id: 'ORG-004', name: 'Al Faris Distribution', type: 'Distributor', country: 'UAE', city: 'Abu Dhabi', status: 'Active', users: 9 },
  { id: 'ORG-005', name: 'Sunrise Electronics Ltd', type: 'Distributor', country: 'UK', city: 'Manchester', status: 'Active', users: 7 },
  { id: 'ORG-006', name: 'SmartHome Gadgets LLC', type: 'Dealer', country: 'UAE', city: 'Dubai', status: 'Active', users: 5 },
  { id: 'ORG-007', name: 'Tech Direct UK', type: 'Dealer', country: 'UK', city: 'London', status: 'Active', users: 4 },
  { id: 'ORG-008', name: 'HomeConnect Arabia', type: 'Dealer', country: 'KSA', city: 'Riyadh', status: 'Suspended', users: 3 },
  { id: 'ORG-009', name: 'ProFix Service Centre', type: 'Service Centre', country: 'UAE', city: 'Dubai', status: 'Active', users: 6 },
];

export const locations = [
  { id: 'LOC-001', name: 'TechFlow Factory – Line A', org: 'ORG-001', type: 'Factory', country: 'China', city: 'Shenzhen' },
  { id: 'LOC-002', name: 'TechFlow Factory – Line B', org: 'ORG-001', type: 'Factory', country: 'China', city: 'Shenzhen' },
  { id: 'LOC-003', name: 'Gulf Trade – Main Warehouse', org: 'ORG-002', type: 'Warehouse', country: 'UAE', city: 'Dubai' },
  { id: 'LOC-004', name: 'Gulf Trade – Cold Store', org: 'ORG-002', type: 'Warehouse', country: 'UAE', city: 'Dubai' },
  { id: 'LOC-005', name: 'BritHub – East Wing', org: 'ORG-003', type: 'Warehouse', country: 'UK', city: 'London' },
  { id: 'LOC-006', name: 'Al Faris – Distribution Centre', org: 'ORG-004', type: 'Distributor', country: 'UAE', city: 'Abu Dhabi' },
  { id: 'LOC-007', name: 'Sunrise – Midlands DC', org: 'ORG-005', type: 'Distributor', country: 'UK', city: 'Manchester' },
  { id: 'LOC-008', name: 'SmartHome – Dubai Mall Store', org: 'ORG-006', type: 'Dealer', country: 'UAE', city: 'Dubai' },
  { id: 'LOC-009', name: 'Tech Direct – Oxford Street', org: 'ORG-007', type: 'Dealer', country: 'UK', city: 'London' },
  { id: 'LOC-010', name: 'ProFix Service – Deira', org: 'ORG-009', type: 'Service Centre', country: 'UAE', city: 'Dubai' },
];

export const products = [
  { id: 'PRD-001', sku: 'TF-THERM-200', name: 'SmartTemp Pro Thermostat', category: 'Climate Control', warrantyMonths: 24, description: 'AI-driven smart thermostat with 7-day learning' },
  { id: 'PRD-002', sku: 'TF-CAM-500', name: 'SecureView 4K Camera', category: 'Security', warrantyMonths: 12, description: '4K outdoor IP camera with night vision' },
  { id: 'PRD-003', sku: 'TF-LOCK-100', name: 'SmartLock Elite', category: 'Access Control', warrantyMonths: 36, description: 'Biometric deadbolt with remote access' },
  { id: 'PRD-004', sku: 'TF-HUB-300', name: 'ConnectHub Gateway', category: 'Networking', warrantyMonths: 24, description: 'Smart home gateway – Zigbee & Z-Wave' },
  { id: 'PRD-005', sku: 'TF-SNS-050', name: 'MotionSense Indoor', category: 'Sensors', warrantyMonths: 12, description: 'PIR motion sensor with 170° coverage' },
];

export const productionBatches = [
  { id: 'BATCH-2024-001', productId: 'PRD-001', sku: 'TF-THERM-200', quantity: 500, mfgDate: '2024-09-15', line: 'Line A', location: 'LOC-001', status: 'Complete', qrBatch: 'QRB-001' },
  { id: 'BATCH-2024-002', productId: 'PRD-002', sku: 'TF-CAM-500', quantity: 300, mfgDate: '2024-10-02', line: 'Line B', location: 'LOC-002', status: 'Complete', qrBatch: 'QRB-002' },
  { id: 'BATCH-2024-003', productId: 'PRD-003', sku: 'TF-LOCK-100', quantity: 200, mfgDate: '2024-10-18', line: 'Line A', location: 'LOC-001', status: 'Complete', qrBatch: 'QRB-003' },
  { id: 'BATCH-2024-004', productId: 'PRD-004', sku: 'TF-HUB-300', quantity: 150, mfgDate: '2024-11-05', line: 'Line B', location: 'LOC-002', status: 'In Progress', qrBatch: 'QRB-004' },
  { id: 'BATCH-2024-005', productId: 'PRD-001', sku: 'TF-THERM-200', quantity: 400, mfgDate: '2024-11-20', line: 'Line A', location: 'LOC-001', status: 'Planned', qrBatch: null },
];

export const qrBatches = [
  { id: 'QRB-001', batchId: 'BATCH-2024-001', type: 'Child', quantity: 500, parentQty: 50, generated: '2024-09-10', status: 'Assigned', assigned: 500, activated: 487 },
  { id: 'QRB-002', batchId: 'BATCH-2024-002', type: 'Child', quantity: 300, parentQty: 30, generated: '2024-09-28', status: 'Assigned', assigned: 300, activated: 300 },
  { id: 'QRB-003', batchId: 'BATCH-2024-003', type: 'Child', quantity: 200, parentQty: 20, generated: '2024-10-14', status: 'Assigned', assigned: 200, activated: 195 },
  { id: 'QRB-004', batchId: 'BATCH-2024-004', type: 'Child', quantity: 150, parentQty: 15, generated: '2024-11-01', status: 'Generated', assigned: 0, activated: 0 },
];

export const childQRs = [
  { id: 'QR-THERM-00001', parentId: 'PAR-CART-0001', batch: 'QRB-001', productId: 'PRD-001', status: 'Registered' as QRStatus, location: 'LOC-008', lastScan: '2024-11-15 09:22', endUser: 'EU-001' },
  { id: 'QR-THERM-00002', parentId: 'PAR-CART-0001', batch: 'QRB-001', productId: 'PRD-001', status: 'In Stock' as QRStatus, location: 'LOC-003', lastScan: '2024-10-30 14:10', endUser: null },
  { id: 'QR-THERM-00003', parentId: 'PAR-CART-0001', batch: 'QRB-001', productId: 'PRD-001', status: 'In Stock' as QRStatus, location: 'LOC-003', lastScan: '2024-10-30 14:10', endUser: null },
  { id: 'QR-THERM-00004', parentId: 'PAR-CART-0002', batch: 'QRB-001', productId: 'PRD-001', status: 'In Transit' as QRStatus, location: 'LOC-003', lastScan: '2024-11-18 08:00', endUser: null },
  { id: 'QR-THERM-00005', parentId: 'PAR-CART-0002', batch: 'QRB-001', productId: 'PRD-001', status: 'In Transit' as QRStatus, location: 'LOC-003', lastScan: '2024-11-18 08:00', endUser: null },
  { id: 'QR-CAM-00001', parentId: 'PAR-CART-0003', batch: 'QRB-002', productId: 'PRD-002', status: 'Registered' as QRStatus, location: 'LOC-009', lastScan: '2024-11-12 16:34', endUser: 'EU-002' },
  { id: 'QR-CAM-00002', parentId: 'PAR-CART-0003', batch: 'QRB-002', productId: 'PRD-002', status: 'Service' as QRStatus, location: 'LOC-010', lastScan: '2024-11-20 11:00', endUser: 'EU-003' },
  { id: 'QR-CAM-00003', parentId: 'PAR-CART-0004', batch: 'QRB-002', productId: 'PRD-002', status: 'Blocked' as QRStatus, location: 'LOC-006', lastScan: '2024-11-08 13:55', endUser: null },
  { id: 'QR-LOCK-00001', parentId: 'PAR-CART-0005', batch: 'QRB-003', productId: 'PRD-003', status: 'Sold' as QRStatus, location: 'LOC-008', lastScan: '2024-11-14 10:15', endUser: null },
  { id: 'QR-LOCK-00002', parentId: 'PAR-CART-0005', batch: 'QRB-003', productId: 'PRD-003', status: 'Registered' as QRStatus, location: 'LOC-008', lastScan: '2024-11-16 09:00', endUser: 'EU-004' },
];

export const parentQRs = [
  { id: 'PAR-CART-0001', type: 'Carton', palletId: 'PAR-PALL-0001', batch: 'QRB-001', productId: 'PRD-001', status: 'Received' as ParentQRStatus, location: 'LOC-003', children: ['QR-THERM-00001','QR-THERM-00002','QR-THERM-00003'], childCount: 10, activePacked: 9, lastScan: '2024-10-30 14:05' },
  { id: 'PAR-CART-0002', type: 'Carton', palletId: 'PAR-PALL-0001', batch: 'QRB-001', productId: 'PRD-001', status: 'In Transit' as ParentQRStatus, location: 'LOC-003', children: ['QR-THERM-00004','QR-THERM-00005'], childCount: 10, activePacked: 10, lastScan: '2024-11-18 08:00' },
  { id: 'PAR-CART-0003', type: 'Carton', palletId: 'PAR-PALL-0002', batch: 'QRB-002', productId: 'PRD-002', status: 'Received' as ParentQRStatus, location: 'LOC-009', children: ['QR-CAM-00001'], childCount: 10, activePacked: 5, lastScan: '2024-11-10 12:20' },
  { id: 'PAR-CART-0004', type: 'Carton', palletId: 'PAR-PALL-0002', batch: 'QRB-002', productId: 'PRD-002', status: 'Received' as ParentQRStatus, location: 'LOC-006', children: ['QR-CAM-00002','QR-CAM-00003'], childCount: 10, activePacked: 8, lastScan: '2024-11-05 09:30' },
  { id: 'PAR-CART-0005', type: 'Carton', palletId: 'PAR-PALL-0003', batch: 'QRB-003', productId: 'PRD-003', status: 'Opened' as ParentQRStatus, location: 'LOC-008', children: ['QR-LOCK-00001','QR-LOCK-00002'], childCount: 10, activePacked: 6, lastScan: '2024-11-13 16:45' },
  { id: 'PAR-PALL-0001', type: 'Pallet', palletId: null, batch: 'QRB-001', productId: 'PRD-001', status: 'Received' as ParentQRStatus, location: 'LOC-003', children: ['PAR-CART-0001','PAR-CART-0002'], childCount: 5, activePacked: 5, lastScan: '2024-10-29 18:10' },
  { id: 'PAR-PALL-0002', type: 'Pallet', palletId: null, batch: 'QRB-002', productId: 'PRD-002', status: 'Opened' as ParentQRStatus, location: 'LOC-006', children: ['PAR-CART-0003','PAR-CART-0004'], childCount: 3, activePacked: 2, lastScan: '2024-11-04 07:55' },
  { id: 'PAR-PALL-0003', type: 'Pallet', palletId: null, batch: 'QRB-003', productId: 'PRD-003', status: 'Opened' as ParentQRStatus, location: 'LOC-008', children: ['PAR-CART-0005'], childCount: 2, activePacked: 1, lastScan: '2024-11-12 14:00' },
];

export const movements = [
  { id: 'MOV-2024-001', origin: 'LOC-001', originName: 'TechFlow Factory – Line A', destination: 'LOC-003', destinationName: 'Gulf Trade – Main Warehouse', carrier: 'DHL Freight', reference: 'DHL-SH-20241015', status: 'Completed' as MovementStatus, type: 'Factory→Warehouse', created: '2024-10-15', exitScan: '2024-10-16 06:30', entryScan: '2024-10-28 14:15', items: 50, parentItems: 5, risk: 'Low' as RiskLevel },
  { id: 'MOV-2024-002', origin: 'LOC-003', originName: 'Gulf Trade – Main Warehouse', destination: 'LOC-006', destinationName: 'Al Faris – Distribution Centre', carrier: 'Emirates Express', reference: 'EXP-20241105', status: 'In Transit' as MovementStatus, type: 'Warehouse→Distributor', created: '2024-11-04', exitScan: '2024-11-05 08:00', entryScan: null, items: 80, parentItems: 8, risk: 'Low' as RiskLevel },
  { id: 'MOV-2024-003', origin: 'LOC-001', originName: 'TechFlow Factory – Line B', destination: 'LOC-005', destinationName: 'BritHub – East Wing', carrier: 'FedEx Freight', reference: 'FX-INT-20241108', status: 'Completed' as MovementStatus, type: 'Factory→Warehouse', created: '2024-11-08', exitScan: '2024-11-09 07:00', entryScan: '2024-11-18 10:30', items: 30, parentItems: 3, risk: 'Low' as RiskLevel },
  { id: 'MOV-2024-004', origin: 'LOC-005', originName: 'BritHub – East Wing', destination: 'LOC-007', destinationName: 'Sunrise – Midlands DC', carrier: 'XPO Logistics', reference: 'XPO-UK-20241118', status: 'Exit Scanned' as MovementStatus, type: 'Warehouse→Distributor', created: '2024-11-17', exitScan: '2024-11-18 08:00', entryScan: null, items: 20, parentItems: 2, risk: 'Medium' as RiskLevel },
  { id: 'MOV-2024-005', origin: 'LOC-006', originName: 'Al Faris – Distribution Centre', destination: 'LOC-008', destinationName: 'SmartHome – Dubai Mall Store', carrier: 'Aramex', reference: 'ARX-20241120', status: 'Planned' as MovementStatus, type: 'Distributor→Dealer', created: '2024-11-20', exitScan: null, entryScan: null, items: 15, parentItems: 2, risk: 'Low' as RiskLevel },
  { id: 'MOV-2024-006', origin: 'LOC-008', originName: 'SmartHome – Dubai Mall Store', destination: null, destinationName: 'HomeConnect Arabia – Riyadh', carrier: 'Self-Delivery', reference: 'SD-UAE-001', status: 'Exception' as MovementStatus, type: 'Dealer→Dealer', created: '2024-11-10', exitScan: '2024-11-11 09:00', entryScan: null, items: 5, parentItems: 1, risk: 'High' as RiskLevel },
];

export const endUsers = [
  { id: 'EU-001', name: 'Ahmed Al Rashidi', email: 'ahmed.rashidi@email.ae', phone: '+971 50 234 5678', country: 'UAE', city: 'Dubai', registeredQR: 'QR-THERM-00001', product: 'SmartTemp Pro Thermostat', dealer: 'SmartHome Gadgets LLC', registrationDate: '2024-11-15', purchaseDate: '2024-11-14', invoiceNo: 'INV-SHG-004512', warrantyStatus: 'Active' as WarrantyStatus },
  { id: 'EU-002', name: 'James Thompson', email: 'j.thompson@email.co.uk', phone: '+44 78 1234 5678', country: 'UK', city: 'London', registeredQR: 'QR-CAM-00001', product: 'SecureView 4K Camera', dealer: 'Tech Direct UK', registrationDate: '2024-11-12', purchaseDate: '2024-11-11', invoiceNo: 'INV-TDK-002341', warrantyStatus: 'Active' as WarrantyStatus },
  { id: 'EU-003', name: 'Fatima Al Mansoori', email: 'f.mansoori@email.ae', phone: '+971 55 876 5432', country: 'UAE', city: 'Abu Dhabi', registeredQR: 'QR-CAM-00002', product: 'SecureView 4K Camera', dealer: 'SmartHome Gadgets LLC', registrationDate: '2024-10-05', purchaseDate: '2024-10-04', invoiceNo: 'INV-SHG-003892', warrantyStatus: 'Claim Open' as WarrantyStatus },
  { id: 'EU-004', name: 'Mohammed Al Zahrani', email: 'm.zahrani@email.sa', phone: '+966 50 345 6789', country: 'KSA', city: 'Riyadh', registeredQR: 'QR-LOCK-00002', product: 'SmartLock Elite', dealer: 'HomeConnect Arabia', registrationDate: '2024-11-16', purchaseDate: '2024-11-15', invoiceNo: 'INV-HCA-001023', warrantyStatus: 'Active' as WarrantyStatus },
  { id: 'EU-005', name: 'Sarah Mitchell', email: 's.mitchell@email.co.uk', phone: '+44 77 9876 5432', country: 'UK', city: 'Manchester', registeredQR: 'QR-LOCK-00003', product: 'SmartLock Elite', dealer: 'Tech Direct UK', registrationDate: '2024-11-08', purchaseDate: '2024-11-07', invoiceNo: 'INV-TDK-002108', warrantyStatus: 'Active' as WarrantyStatus },
];

export const warrantyPolicies = [
  { id: 'WP-001', productId: 'PRD-001', sku: 'TF-THERM-200', months: 24, startEvent: 'Registration', coverage: ['Parts', 'Labour', 'Replacement'], maxClaims: 2 },
  { id: 'WP-002', productId: 'PRD-002', sku: 'TF-CAM-500', months: 12, startEvent: 'Purchase Date', coverage: ['Parts', 'Labour'], maxClaims: 1 },
  { id: 'WP-003', productId: 'PRD-003', sku: 'TF-LOCK-100', months: 36, startEvent: 'Registration', coverage: ['Parts', 'Labour', 'Replacement', 'Extended Support'], maxClaims: 3 },
  { id: 'WP-004', productId: 'PRD-004', sku: 'TF-HUB-300', months: 24, startEvent: 'Purchase Date', coverage: ['Parts', 'Labour'], maxClaims: 2 },
];

export const warranties = [
  { id: 'WAR-0001', endUserId: 'EU-001', qr: 'QR-THERM-00001', product: 'SmartTemp Pro Thermostat', sku: 'TF-THERM-200', startDate: '2024-11-15', endDate: '2026-11-15', status: 'Active' as WarrantyStatus, claims: 0, maxClaims: 2 },
  { id: 'WAR-0002', endUserId: 'EU-002', qr: 'QR-CAM-00001', product: 'SecureView 4K Camera', sku: 'TF-CAM-500', startDate: '2024-11-11', endDate: '2025-11-11', status: 'Active' as WarrantyStatus, claims: 0, maxClaims: 1 },
  { id: 'WAR-0003', endUserId: 'EU-003', qr: 'QR-CAM-00002', product: 'SecureView 4K Camera', sku: 'TF-CAM-500', startDate: '2024-10-04', endDate: '2025-10-04', status: 'Claim Open' as WarrantyStatus, claims: 1, maxClaims: 1 },
  { id: 'WAR-0004', endUserId: 'EU-004', qr: 'QR-LOCK-00002', product: 'SmartLock Elite', sku: 'TF-LOCK-100', startDate: '2024-11-15', endDate: '2027-11-15', status: 'Active' as WarrantyStatus, claims: 0, maxClaims: 3 },
  { id: 'WAR-0005', endUserId: 'EU-005', qr: 'QR-LOCK-00003', product: 'SmartLock Elite', sku: 'TF-LOCK-100', startDate: '2024-11-07', endDate: '2027-11-07', status: 'Active' as WarrantyStatus, claims: 0, maxClaims: 3 },
];

export const serviceClaims = [
  { id: 'SVC-0001', warrantyId: 'WAR-0003', endUserId: 'EU-003', qr: 'QR-CAM-00002', product: 'SecureView 4K Camera', issue: 'Night vision stopped working after firmware update', raised: '2024-11-18', technician: 'Khalid Saeed', status: 'Under Service', centre: 'ProFix Service – Deira', diagnosis: 'IR sensor module failure', action: 'Component replacement', eta: '2024-11-25' },
  { id: 'SVC-0002', warrantyId: null, endUserId: 'EU-001', qr: 'QR-THERM-00001', product: 'SmartTemp Pro Thermostat', issue: 'Display flickering intermittently', raised: '2024-11-10', technician: null, status: 'Open', centre: null, diagnosis: null, action: null, eta: null },
];

export const riskEvents = [
  { id: 'RSK-001', type: 'Duplicate Scan', qr: 'QR-CAM-00003', product: 'SecureView 4K Camera', level: 'High' as RiskLevel, location: 'LOC-006', expectedLocation: 'LOC-003', timestamp: '2024-11-08 13:55', description: 'Product QR scanned at Al Faris Distribution Centre. Last valid custody was Gulf Trade Warehouse with no valid exit movement recorded.', status: 'Open', score: 78 },
  { id: 'RSK-002', type: 'Impossible Movement', qr: 'QR-THERM-00004', product: 'SmartTemp Pro Thermostat', level: 'Critical' as RiskLevel, location: 'LOC-008', expectedLocation: 'LOC-003', timestamp: '2024-11-17 07:22', description: 'QR scanned in Dubai Mall at 07:22. Last scan was in Shenzhen Factory at 06:15 same day. Geographic impossibility detected.', status: 'Open', score: 95 },
  { id: 'RSK-003', type: 'Unauthorized Movement', qr: 'PAR-CART-0004', product: 'SecureView 4K Camera (Carton)', level: 'High' as RiskLevel, location: 'LOC-009', expectedLocation: 'LOC-006', timestamp: '2024-11-12 09:10', description: 'Parent carton QR scanned at Tech Direct UK. No movement record exists from Al Faris to this location.', status: 'Under Review', score: 82 },
  { id: 'RSK-004', type: 'QR Reuse Attempt', qr: 'QR-LOCK-00001', product: 'SmartLock Elite', level: 'Medium' as RiskLevel, location: 'LOC-010', expectedLocation: 'LOC-008', timestamp: '2024-11-14 22:30', description: 'Product marked as Sold/Registered. QR scanned at service centre without any open service ticket. Possible counterfeit replacement label.', status: 'Reviewed', score: 55 },
  { id: 'RSK-005', type: 'Out of Sequence Scan', qr: 'MOV-2024-004', product: 'Movement Entry Without Exit', level: 'Medium' as RiskLevel, location: 'LOC-007', expectedLocation: null, timestamp: '2024-11-18 12:00', description: 'Entry scan attempted at Sunrise Midlands DC before exit scan was confirmed at BritHub East Wing.', status: 'Resolved', score: 40 },
  { id: 'RSK-006', type: 'High Frequency Scan', qr: 'QR-THERM-00005', product: 'SmartTemp Pro Thermostat', level: 'Low' as RiskLevel, location: 'LOC-003', expectedLocation: 'LOC-003', timestamp: '2024-11-16 15:00', description: 'QR code scanned 14 times in 2 hours from 3 different devices at same warehouse location.', status: 'Reviewed', score: 28 },
];

export const auditLogs = [
  { id: 'AUD-0001', action: 'Movement Completed', entity: 'MOV-2024-001', user: 'Ali Hassan', org: 'Gulf Trade Logistics', timestamp: '2024-10-28 14:15', details: 'Entry scan confirmed 50 items received.' },
  { id: 'AUD-0002', action: 'QR Blocked', entity: 'QR-CAM-00003', user: 'System', org: 'TechFlow Electronics', timestamp: '2024-11-08 13:58', details: 'Auto-blocked after RSK-001 critical threshold breach.' },
  { id: 'AUD-0003', action: 'Warranty Claim Opened', entity: 'WAR-0003', user: 'Fatima Al Mansoori', org: 'End User', timestamp: '2024-11-18 09:30', details: 'Claim raised via mobile app. Issue: night vision failure.' },
  { id: 'AUD-0004', action: 'Risk Event Reviewed', entity: 'RSK-003', user: 'Layla Karim', org: 'TechFlow Electronics', timestamp: '2024-11-13 11:00', details: 'Status changed to Under Review. Awaiting channel partner response.' },
  { id: 'AUD-0005', action: 'End User Registered', entity: 'EU-004', user: 'Mohammed Al Zahrani', org: 'End User', timestamp: '2024-11-16 09:00', details: 'Product QR-LOCK-00002 registered. Warranty WAR-0004 activated.' },
  { id: 'AUD-0006', action: 'Movement Exit Scan', entity: 'MOV-2024-004', user: 'Tom Bradley', org: 'BritHub Fulfilment', timestamp: '2024-11-18 08:00', details: 'Exit scan completed. 20 items, 2 parent cartons. Status: In Transit.' },
];

export const dashboardKPIs = {
  totalQRCodes: 1150,
  activeProducts: 843,
  inTransitMovements: 3,
  openRiskEvents: 3,
  registeredEndUsers: 5,
  activeWarranties: 4,
  weeklyScans: 2847,
  counterfeitAlerts: 2,
};

export const inventorySummary = [
  { locationId: 'LOC-001', locationName: 'TechFlow Factory – Line A', parent: 12, child: 210, inTransit: 0 },
  { locationId: 'LOC-003', locationName: 'Gulf Trade – Main Warehouse', parent: 8, child: 145, inTransit: 2 },
  { locationId: 'LOC-005', locationName: 'BritHub – East Wing', parent: 3, child: 30, inTransit: 2 },
  { locationId: 'LOC-006', locationName: 'Al Faris – Distribution Centre', parent: 4, child: 58, inTransit: 1 },
  { locationId: 'LOC-007', locationName: 'Sunrise – Midlands DC', parent: 0, child: 0, inTransit: 2 },
  { locationId: 'LOC-008', locationName: 'SmartHome – Dubai Mall Store', parent: 2, child: 22, inTransit: 0 },
  { locationId: 'LOC-009', locationName: 'Tech Direct – Oxford Street', parent: 1, child: 14, inTransit: 0 },
];
