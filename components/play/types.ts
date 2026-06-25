export interface Booking {
  id: string;
  venueName: string;
  courtName: string;
  pitchType: string;
  imageUrl: string;
  dateLabel: string;
  timeRange: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}