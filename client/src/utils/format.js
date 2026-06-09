export const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '-');

export const hours = (value = 0) => `${Number(value).toFixed(2)} h`;
