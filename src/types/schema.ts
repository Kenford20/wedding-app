type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
};

type Rsvp = {
  eventId: string;
  rsvp: string | null;
};

type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  userId: string;
  rsvps?: Rsvp[];
};

type User = {
  id: string;
  websiteUrl: string;
  email: string;
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
};

type WeddingDate = {
  standardFormat: string;
  numberFormat: string;
};

type WeddingData = {
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
  daysRemaining: number;
  websiteUrl: string;
  date: WeddingDate;
};

export { type Event, type Rsvp, type Guest, type User, type WeddingData };
