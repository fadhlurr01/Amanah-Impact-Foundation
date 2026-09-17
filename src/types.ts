/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OrganizationInfo {
  name: string;
  shortName: string;
  tagline: string;
  type: string;
  foundedYear: number;
  legalNumber: string;
  taxNumber: string;
  operationalLicense: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
}

export interface FundUsageBreakdown {
  item: string;
  amount: number;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'active' | 'draft' | 'completed';
  isFeatured: boolean;
  isUrgent: boolean;
  targetAmount: number;
  collectedAmount: number;
  disbursedAmount: number;
  beneficiaryTarget: number;
  beneficiaryReached: number;
  location: string;
  startDate: string;
  endDate: string;
  shortDescription: string;
  story: string;
  fundUsage: FundUsageBreakdown[];
  imageUrl?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  urgency?: 'high' | 'medium' | 'low';
}

export interface CampaignUpdate {
  id: string;
  campaignSlug: string;
  title: string;
  date: string;
  description: string;
  mediaType: 'image' | 'video' | 'text';
  imageUrl?: string;
  visibility: 'public' | 'private';
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  campaignTitle: string;
  campaignSlug: string;
  amount: number;
  category: string;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed' | 'expired' | 'manual_review' | 'refunded';
  isAnonymous: boolean;
  message?: string;
  receiptNumber: string;
  createdDate: string;
  paidDate?: string;
  certificateNumber?: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  province: string;
  type: 'Individual' | 'Corporate' | 'Community';
  segment: 'VIP Donor' | 'Regular Donor' | 'CSR Donor' | 'Anonymous Donor' | 'Community Donor';
  totalDonation: number;
  donationCount: number;
  isRecurring: boolean;
  isVIP: boolean;
  tags?: string[];
  followUpStatus?: string;
  notes?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  skills: string[];
  interestArea: string[];
  availability: string;
  experience?: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  registeredDate: string;
}

export interface CsrInquiry {
  id: string;
  companyName: string;
  picName: string;
  position: string;
  email: string;
  whatsapp: string;
  website: string;
  budgetRange: string;
  interestedProgram: string;
  locationTarget: string;
  message?: string;
  pipelineStatus: 'new' | 'contacted' | 'meeting_scheduled' | 'proposal_sent' | 'negotiation' | 'deal_won' | 'deal_lost' | 'program_running';
  createdDate: string;
}

export interface Report {
  id: string;
  title: string;
  campaignSlug: string;
  type: 'Monthly Report' | 'Annual Report' | 'Campaign Report' | 'Distribution Report' | 'Audit Report' | 'Progress Report';
  period: string;
  totalReceived: number;
  totalDisbursed: number;
  remainingBalance: number;
  publicVisibility: boolean;
  auditStatus: 'reviewed' | 'published' | 'draft';
  description: string;
  publishedDate: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  excerpt: string;
  content: string;
  language: 'id' | 'en' | 'ar' | 'zh' | 'ja';
  publishedDate: string;
  createdDate?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  message?: string;
  avatarUrl?: string;
  location?: string;
  rating: number;
  type: 'beneficiary' | 'donor' | 'csr_partner' | 'volunteer';
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export type FAQ = Faq;

export interface LanguagePack {
  navHome: string;
  navCampaigns: string;
  navZakat: string;
  navWakaf: string;
  navTransparency: string;
  navCSR: string;
  navVolunteer: string;
  navBlog: string;
  navAdmin: string;
  trustTitle: string;
  transparencyBadge: string;
  verifiedAuditBadge: string;
  urgentBadge: string;
  donateNow: string;
  seeImpact: string;
  becomeVolunteer: string;
  impactCounterYatim: string;
  impactCounterFamilies: string;
  impactCounterWells: string;
  impactCounterTotalFund: string;
  activeCampaigns: string;
  readMore: string;
  whatsappFloating: string;
}

export interface AdminUser {
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
}
