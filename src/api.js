const BASE = '/api';

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Businesses ──────────────────────────────────────────────
export const api = {
  businesses: {
    list: () => req('GET', '/businesses'),
    create: (body) => req('POST', '/businesses', body),
    update: (id, body) => req('PATCH', `/businesses/${id}`, body),
    delete: (id) => req('DELETE', `/businesses/${id}`),
  },

  cashbooks: {
    list: (bizId) => req('GET', `/businesses/${bizId}/cashbooks`),
    create: (bizId, body) => req('POST', `/businesses/${bizId}/cashbooks`, body),
    rename: (bizId, bookId, name) => req('PATCH', `/businesses/${bizId}/cashbooks/${bookId}`, { name }),
    delete: (bizId, bookId) => req('DELETE', `/businesses/${bizId}/cashbooks/${bookId}`),
  },

  transactions: {
    list: (bizId, bookId) => req('GET', `/businesses/${bizId}/cashbooks/${bookId}/transactions`),
    create: (bizId, bookId, body) => req('POST', `/businesses/${bizId}/cashbooks/${bookId}/transactions`, body),
    update: (bizId, bookId, txnId, body) => req('PATCH', `/businesses/${bizId}/cashbooks/${bookId}/transactions/${txnId}`, body),
    delete: (bizId, bookId, txnId) => req('DELETE', `/businesses/${bizId}/cashbooks/${bookId}/transactions/${txnId}`),
  },

  parties: {
    list: (bizId, bookId) => req('GET', `/businesses/${bizId}/cashbooks/${bookId}/parties`),
    create: (bizId, bookId, body) => req('POST', `/businesses/${bizId}/cashbooks/${bookId}/parties`, body),
    delete: (bizId, bookId, partyId) => req('DELETE', `/businesses/${bizId}/cashbooks/${bookId}/parties/${partyId}`),
  },

  members: {
    list: (bizId, bookId) => req('GET', `/businesses/${bizId}/cashbooks/${bookId}/members`),
    add: (bizId, bookId, body) => req('POST', `/businesses/${bizId}/cashbooks/${bookId}/members`, body),
    updateRole: (bizId, bookId, memberId, role) => req('PATCH', `/businesses/${bizId}/cashbooks/${bookId}/members/${memberId}`, { role }),
    remove: (bizId, bookId, memberId) => req('DELETE', `/businesses/${bizId}/cashbooks/${bookId}/members/${memberId}`),
  },

  users: {
    lookupByEmail: (email) => req('GET', `/users/lookup?email=${encodeURIComponent(email)}`),
  },

  team: {
    list:     (bizId)                   => req('GET',    `/businesses/${bizId}/team`),
    add:      (bizId, body)             => req('POST',   `/businesses/${bizId}/team`, body),
    update:   (bizId, id, body)         => req('PATCH',  `/businesses/${bizId}/team/${id}`, body),
    remove:   (bizId, id)               => req('DELETE', `/businesses/${bizId}/team/${id}`),
    getBooks:       (bizId, memberId)              => req('GET',    `/businesses/${bizId}/team/${memberId}/books`),
    addToBook:      (bizId, memberId, body)        => req('POST',   `/businesses/${bizId}/team/${memberId}/books`, body),
    updateBookRole: (bizId, memberId, bookId, role)=> req('PATCH',  `/businesses/${bizId}/team/${memberId}/books/${bookId}`, { role }),
    removeFromBook: (bizId, memberId, bookId)      => req('DELETE', `/businesses/${bizId}/team/${memberId}/books/${bookId}`),
  },
};
