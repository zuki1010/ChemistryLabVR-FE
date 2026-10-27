const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function readAccessToken() {
  return sessionStorage.getItem('clvr-access-token') || '';
}

export function storeAccessToken(token) {
  const value = token.trim();
  if (value) sessionStorage.setItem('clvr-access-token', value);
  else sessionStorage.removeItem('clvr-access-token');
}

async function request(path, { token, method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Yêu cầu thất bại (${response.status})`;
    try {
      const payload = await response.json();
      message = payload.message || payload.error || message;
    } catch {
      // Keep the HTTP status message when the backend returns an empty body.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

const stateToApi = { Lỏng: 'LIQUID', Rắn: 'SOLID', Khí: 'GAS', LIQUID: 'LIQUID', SOLID: 'SOLID', GAS: 'GAS' };
const stateToUi = { LIQUID: 'Lỏng', SOLID: 'Rắn', GAS: 'Khí', Lỏng: 'Lỏng', Rắn: 'Rắn', Khí: 'Khí' };

export function fromApiChemical(row) {
  return {
    id: row.id,
    name: row.name,
    formula: row.formula,
    state: stateToUi[row.state] || row.state || '—',
    category: 'Hóa chất',
    color: row.colorHex || row.color_hex || '#d8e8e3',
    density: row.density ?? '—',
    unit: row.unit || '',
    danger: Number(row.dangerLevel ?? row.danger_level ?? 0),
    asset: row.unityAssetId || row.unity_asset_id || 'Chưa gán asset Unity',
    description: row.description || 'Chưa có mô tả.',
  };
}

export function toApiChemical(formData) {
  const densityValue = formData.get('density')?.trim();
  return {
    name: formData.get('name')?.trim(),
    formula: formData.get('formula')?.trim(),
    state: stateToApi[formData.get('state')] || 'LIQUID',
    color_hex: formData.get('color') || '#bce9f0',
    description: formData.get('description')?.trim() || '',
    density: densityValue ? Number(densityValue) : null,
    danger_level: Number(formData.get('danger') || 0),
    unit: formData.get('unit')?.trim() || '',
  };
}

export async function getChemicals(token) {
  const rows = await request('/api/v1/chemical/all', { token });
  return rows.map(fromApiChemical);
}

export function createChemical(token, payload) {
  return request('/api/v1/chemical/create', { token, method: 'POST', body: payload });
}

export function updateChemical(token, id, payload) {
  return request(`/api/v1/chemical/update/${id}`, { token, method: 'PUT', body: payload });
}
