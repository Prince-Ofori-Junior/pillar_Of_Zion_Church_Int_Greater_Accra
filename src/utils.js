// utils.js
export const getClientId = () => {
  let id = localStorage.getItem('client_id');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('client_id', id);
  }
  return id;
};
