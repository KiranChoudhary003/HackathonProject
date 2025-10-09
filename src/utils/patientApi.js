import { postJSON } from './apiClient';

const BASE = '';

export async function getDoctorSlots(doctorId, date) {
  if (!doctorId || !date) throw new Error('doctorId and date are required');
  const url = `${BASE}/dev/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to fetch slots: ${res.status}`);
  }
  return res.json();
}

export async function createBooking({ doctor_id, hospital_id, slot_date, slot_time }) {
  return postJSON('/dev/bookings', { doctor_id, hospital_id, slot_date, slot_time });
}

export async function confirmArrival(bookingId) {
  if (!bookingId) throw new Error('bookingId required');
  const url = `/dev/booking/${bookingId}/arrive`;
  return postJSON(url, {});
}


