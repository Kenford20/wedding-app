type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
};

type Invitation = {
  eventId: string;
  rsvp: string | null;
};

type Household = {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  guests: Guest[];
};

type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  isPrimaryContact: boolean;
  userId: string;
  householdId: string;
  invitations?: Invitation[];
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

type EventFormData = {
  eventName: string;
  date: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  venue: string | undefined;
  attire: string | undefined;
  description: string | undefined;
  eventId: string;
};

type EventId = string;
type RSVP = string;
type FormInvites = Record<EventId, RSVP>;

type GuestFormData = {
  guestId?: number;
  firstName: string;
  lastName: string;
  invites: FormInvites;
};

type HouseholdFormData = {
  householdId: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  notes?: string;
  guestParty: GuestFormData[];
};

export {
  type Event,
  type Invitation,
  type Household,
  type Guest,
  type User,
  type WeddingData,
  type EventFormData,
  type GuestFormData,
  type HouseholdFormData,
  type FormInvites,
};
