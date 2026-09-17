/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { initDatabase, pool, backupDatabase, restoreDatabase, resetDatabase } from './src/server/db';
import { 
  Campaign, Donation, Donor, Volunteer, CsrInquiry, Report, BlogPost, Testimonial, FAQ 
} from './src/types';

// Load environment variables
dotenv.config();

const __dirname = process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI SDK initialized successfully on server-side.');
  } catch (error) {
    console.error('Failed to initialize Gemini AI SDK:', error);
  }
} else {
  console.log('Gemini API key is not configured yet. Server will run with high-quality AI simulated drafts.');
}

// ---------------------------------------------------------
// DATABASE CONNECTIVITY VALIDATION (MySQL Laragon)
// ---------------------------------------------------------
app.use('/api', async (req, res, next) => {
  if (!pool) {
    try {
      await initDatabase();
    } catch (e) {
      // handled below
    }
  }

  if (!pool) {
    return res.status(503).json({
      error: 'LARAGON_MYSQL_OFFLINE',
      message: 'Koneksi ke basis data MySQL Laragon (127.0.0.1:3306) belum aktif atau gagal terhubung. Silakan buka aplikasi Laragon dan klik tombol "Start All" agar MySQL berjalan.'
    });
  }

  next();
});

// ---------------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT (MySQL)
// ---------------------------------------------------------

// Helper to get user by email
async function getUserByEmail(email: string) {
  const [rows]: any = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
  return rows[0] || null;
}

// Register new Admin
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, photoUrl } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan kata sandi wajib diisi.' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Alamat email ini sudah terdaftar.' });
    }

    const userId = `usr-${Date.now()}`;
    const avatar = photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';

    await pool.query(`
      INSERT INTO users (id, name, email, phone, password, role, photo_url, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, name.trim(), email.toLowerCase().trim(), phone || '', password, 'Admin', avatar, 0]);

    res.status(201).json({
      message: 'Registrasi berhasil!',
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        photoUrl: avatar,
        role: 'Admin',
        isDemo: false
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan kata sandi wajib diisi.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await getUserByEmail(cleanEmail);

    // Guaranteed Super Admin authorization
    if (cleanEmail === 'admin@amanah.org' && (password === 'admin123' || password === 'password123')) {
      if (!user) {
        try {
          await pool.query(`
            INSERT INTO users (id, name, email, phone, password, role, photo_url, is_demo)
            VALUES ('usr-superadmin', 'Ahmad Syarif', 'admin@amanah.org', '081234567890', 'admin123', 'Super Admin', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', 0)
          `);
          user = await getUserByEmail(cleanEmail);
        } catch (e) {}
      }
      return res.json({
        message: 'Login berhasil!',
        user: {
          id: user?.id || 'usr-superadmin',
          name: user?.name || 'Ahmad Syarif',
          email: 'admin@amanah.org',
          phone: user?.phone || '081234567890',
          photoUrl: user?.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'Super Admin',
          isDemo: false
        }
      });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Email atau kata sandi salah. Gunakan: admin@amanah.org / admin123' });
    }

    res.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        photoUrl: user.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: user.role,
        isDemo: Boolean(user.is_demo)
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.' });
  }
});

// Update Profile
app.put('/api/auth/profile', async (req, res) => {
  try {
    const { currentEmail, name, email, phone, photoUrl, currentPassword, newPassword } = req.body;
    
    if (!currentEmail || !name || !email) {
      return res.status(400).json({ message: 'Data profil tidak lengkap.' });
    }

    const user = await getUserByEmail(currentEmail);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    if (currentPassword && user.password !== currentPassword) {
      return res.status(400).json({ message: 'Kata sandi saat ini tidak cocok.' });
    }

    // Check if new email is taken by another user
    if (email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      const emailTaken = await getUserByEmail(email);
      if (emailTaken && emailTaken.id !== user.id) {
        return res.status(400).json({ message: 'Email baru ini sudah digunakan akun lain.' });
      }
    }

    const updatedPassword = newPassword && newPassword.length >= 6 ? newPassword : user.password;
    const updatedPhoto = photoUrl || user.photo_url;

    await pool.query(`
      UPDATE users 
      SET name = ?, email = ?, phone = ?, photo_url = ?, password = ?
      WHERE id = ?
    `, [name.trim(), email.toLowerCase().trim(), phone || '', updatedPhoto, updatedPassword, user.id]);

    res.json({
      message: 'Profil berhasil diperbarui!',
      user: {
        id: user.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
        photoUrl: updatedPhoto,
        role: user.role,
        isDemo: Boolean(user.is_demo)
      }
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Gagal memperbarui profil.' });
  }
});

// List Users
app.get('/api/auth/users', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT id, name, email, phone, role, photo_url, is_demo, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Gagal memuat daftar pengguna.' });
  }
});

// ---------------------------------------------------------
// REST API ENDPOINTS (Backed by MySQL)
// ---------------------------------------------------------

// Organization Data
app.get('/api/organization', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM organization_info LIMIT 1');
    if (rows.length > 0) {
      const r = rows[0];
      res.json({
        name: r.name,
        shortName: r.short_name,
        tagline: r.tagline,
        type: r.type,
        foundedYear: r.founded_year,
        legalNumber: r.legal_number,
        taxNumber: r.tax_number,
        operationalLicense: r.operational_license,
        address: r.address,
        email: r.email,
        phone: r.phone,
        whatsapp: r.whatsapp,
        website: r.website,
        instagram: r.instagram,
        tiktok: r.tiktok,
        youtube: r.youtube,
        facebook: r.facebook
      });
    } else {
      res.status(404).json({ message: 'Organization data not found.' });
    }
  } catch (err: any) {
    console.error('Organization fetch error:', err);
    res.status(500).json({ message: 'Error fetching organization info.' });
  }
});

app.put('/api/organization', async (req, res) => {
  try {
    const data = req.body;
    const [existing]: any = await pool.query('SELECT id FROM organization_info LIMIT 1');
    if (existing.length > 0) {
      const orgId = existing[0].id;
      await pool.query(`
        UPDATE organization_info SET
          name = ?, short_name = ?, tagline = ?, type = ?, founded_year = ?,
          legal_number = ?, tax_number = ?, operational_license = ?, address = ?,
          email = ?, phone = ?, whatsapp = ?, website = ?, instagram = ?,
          tiktok = ?, youtube = ?, facebook = ?
        WHERE id = ?
      `, [
        data.name, data.shortName, data.tagline, data.type, Number(data.foundedYear) || 2014,
        data.legalNumber, data.taxNumber, data.operationalLicense, data.address,
        data.email, data.phone, data.whatsapp, data.website, data.instagram,
        data.tiktok, data.youtube, data.facebook, orgId
      ]);
    } else {
      await pool.query(`
        INSERT INTO organization_info (name, short_name, tagline, type, founded_year, legal_number, tax_number, operational_license, address, email, phone, whatsapp, website, instagram, tiktok, youtube, facebook)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.name, data.shortName, data.tagline, data.type, Number(data.foundedYear) || 2014,
        data.legalNumber, data.taxNumber, data.operationalLicense, data.address,
        data.email, data.phone, data.whatsapp, data.website, data.instagram,
        data.tiktok, data.youtube, data.facebook
      ]);
    }
    res.json({ message: 'Informasi yayasan berhasil diperbarui dan tersimpan permanen di database.' });
  } catch (err: any) {
    console.error('Organization update error:', err);
    res.status(500).json({ message: 'Gagal memperbarui info yayasan.' });
  }
});

// Helper to format campaign row
function formatCampaignRow(r: any): Campaign {
  let fundUsage = [];
  try {
    fundUsage = typeof r.fund_usage === 'string' ? JSON.parse(r.fund_usage) : (r.fund_usage || []);
  } catch (e) {
    fundUsage = [];
  }
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category,
    status: r.status,
    isFeatured: Boolean(r.is_featured),
    isUrgent: Boolean(r.is_urgent),
    targetAmount: Number(r.target_amount),
    collectedAmount: Number(r.collected_amount),
    disbursedAmount: Number(r.disbursed_amount),
    beneficiaryTarget: Number(r.beneficiary_target),
    beneficiaryReached: Number(r.beneficiary_reached),
    location: r.location,
    startDate: r.start_date,
    endDate: r.end_date,
    shortDescription: r.short_description,
    story: r.story,
    fundUsage,
    imageUrl: r.image_url,
    thumbnailUrl: r.thumbnail_url,
    videoUrl: r.video_url,
    urgency: r.urgency
  };
}

// Campaigns Endpoints
app.get('/api/campaigns', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM campaigns ORDER BY is_featured DESC, is_urgent DESC, created_at DESC');
    const campaigns = rows.map(formatCampaignRow);
    res.json(campaigns);
  } catch (err: any) {
    console.error('Campaigns fetch error:', err);
    res.status(500).json({ message: 'Error fetching campaigns.' });
  }
});

app.get('/api/campaigns/:slug', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM campaigns WHERE slug = ?', [req.params.slug]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    const campaign = formatCampaignRow(rows[0]);
    const [updateRows]: any = await pool.query('SELECT * FROM campaign_updates WHERE campaign_slug = ? ORDER BY date DESC', [campaign.slug]);
    const updates = updateRows.map((u: any) => ({
      id: u.id,
      campaignSlug: u.campaign_slug,
      title: u.title,
      date: u.date,
      description: u.description,
      mediaType: u.media_type,
      imageUrl: u.image_url,
      visibility: u.visibility
    }));
    res.json({ campaign, updates });
  } catch (err: any) {
    console.error('Campaign single fetch error:', err);
    res.status(500).json({ message: 'Error fetching campaign.' });
  }
});

// Admin creates campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    const { title, category, targetAmount, shortDescription, story, fundUsage, isUrgent, isFeatured, location, imageUrl, videoUrl, userEmail } = req.body;
    
    if (!title || !category || !targetAmount) {
      return res.status(400).json({ message: 'Title, category, and target targetAmount are required.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const [existing]: any = await pool.query('SELECT id FROM campaigns WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const id = `C-${Date.now().toString().slice(-4)}`;
    const parsedUsage = fundUsage || [{ item: 'Operasional Lapangan', amount: Number(targetAmount) }];
    const defaultImage = imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200';

    await pool.query(`
      INSERT INTO campaigns (id, user_id, title, slug, category, status, is_featured, is_urgent, target_amount, collected_amount, disbursed_amount, beneficiary_target, beneficiary_reached, location, start_date, end_date, short_description, story, fund_usage, image_url, video_url, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, title, slug, category, 'active',
      isFeatured ? 1 : 0, isUrgent ? 1 : 0, Number(targetAmount), 0,
      0, 250, 0, location || 'Nasional',
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
      shortDescription || title,
      story || `${title} adalah ikhtiar bersama dalam menyalurkan bantuan berkelanjutan bagi masyarakat.`,
      JSON.stringify(parsedUsage), defaultImage, videoUrl || '', isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM campaigns WHERE id = ?', [id]);
    res.status(201).json(formatCampaignRow(created[0]));
  } catch (err: any) {
    console.error('Create campaign error:', err);
    res.status(500).json({ message: 'Gagal membuat kampanye.' });
  }
});

// Update campaign
app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const { title, category, targetAmount, status, isUrgent, isFeatured, location, shortDescription, story, imageUrl } = req.body;
    await pool.query(`
      UPDATE campaigns SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        target_amount = COALESCE(?, target_amount),
        status = COALESCE(?, status),
        is_urgent = COALESCE(?, is_urgent),
        is_featured = COALESCE(?, is_featured),
        location = COALESCE(?, location),
        short_description = COALESCE(?, short_description),
        story = COALESCE(?, story),
        image_url = COALESCE(?, image_url)
      WHERE id = ?
    `, [
      title, category, targetAmount ? Number(targetAmount) : null,
      status, isUrgent !== undefined ? (isUrgent ? 1 : 0) : null,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      location, shortDescription, story, imageUrl, req.params.id
    ]);

    const [updated]: any = await pool.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (updated.length === 0) {
      return res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
    }
    res.json(formatCampaignRow(updated[0]));
  } catch (err: any) {
    console.error('Update campaign error:', err);
    res.status(500).json({ message: 'Gagal memperbarui kampanye.' });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM campaigns WHERE id = ?', [req.params.id]);
    res.json({ message: 'Kampanye berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete campaign error:', err);
    res.status(500).json({ message: 'Gagal menghapus kampanye.' });
  }
});

// Add campaign update
app.post('/api/campaigns/:slug/updates', async (req, res) => {
  try {
    const { title, description, mediaType, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Judul dan deskripsi kabar terbaru wajib diisi.' });
    }

    const id = `U-${Date.now().toString().slice(-4)}`;
    const date = new Date().toISOString().split('T')[0];
    const img = imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600';

    await pool.query(`
      INSERT INTO campaign_updates (id, campaign_slug, title, date, description, media_type, image_url, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, req.params.slug, title, date, description, mediaType || 'image', img, 'public']);

    res.status(201).json({
      id,
      campaignSlug: req.params.slug,
      title,
      date,
      description,
      mediaType: mediaType || 'image',
      imageUrl: img,
      visibility: 'public'
    });
  } catch (err: any) {
    console.error('Add campaign update error:', err);
    res.status(500).json({ message: 'Gagal menambahkan kabar terbaru.' });
  }
});

// ---------------------------------------------------------
// DONATIONS ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatDonationRow(r: any): Donation {
  return {
    id: r.id,
    donorName: r.donor_name,
    donorEmail: r.donor_email,
    donorPhone: r.donor_phone,
    campaignTitle: r.campaign_title,
    campaignSlug: r.campaign_slug,
    amount: Number(r.amount),
    category: r.category,
    paymentMethod: r.payment_method,
    status: r.status,
    isAnonymous: Boolean(r.is_anonymous),
    message: r.message,
    receiptNumber: r.receipt_number,
    createdDate: r.created_date,
    paidDate: r.paid_date,
    certificateNumber: r.certificate_number
  };
}

app.get('/api/donations', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM donations ORDER BY created_date DESC');
    res.json(rows.map(formatDonationRow));
  } catch (err: any) {
    console.error('Donations fetch error:', err);
    res.status(500).json({ message: 'Error fetching donations.' });
  }
});

// Submit a new donation
app.post('/api/donations', async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, campaignSlug, amount, isAnonymous, message, paymentMethod, userEmail } = req.body;
    
    const parsedAmount = Number(amount) || 0;
    if (parsedAmount < 10000) {
      return res.status(400).json({ message: 'Nominal donasi minimal adalah Rp 10.000.' });
    }

    const finalDonorName = isAnonymous ? 'Hamba Allah' : (donorName && String(donorName).trim() ? String(donorName).trim() : 'Hamba Allah');
    const finalDonorEmail = donorEmail && String(donorEmail).trim() ? String(donorEmail).trim() : (isAnonymous ? 'hamba.allah@amanah.org' : 'donatur@amanah.org');
    const requestedSlug = campaignSlug && String(campaignSlug).trim() ? String(campaignSlug).trim() : 'umum';

    // Find matched campaign or fallback to active campaign
    let matchedCampaign = null;
    if (requestedSlug && requestedSlug !== 'umum') {
      const [camps]: any = await pool.query('SELECT * FROM campaigns WHERE slug = ?', [requestedSlug]);
      if (camps.length > 0) matchedCampaign = camps[0];
    }
    
    if (!matchedCampaign) {
      const [firstActive]: any = await pool.query('SELECT * FROM campaigns WHERE status = "active" LIMIT 1');
      if (firstActive.length > 0) {
        matchedCampaign = firstActive[0];
      }
    }

    const finalCampaignSlug = matchedCampaign ? matchedCampaign.slug : requestedSlug;
    const campaignTitle = matchedCampaign ? matchedCampaign.title : 'Donasi Umum Maslahat Amanah';
    const category = matchedCampaign ? matchedCampaign.category : 'Umum';

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const id = `D-${Date.now().toString().slice(-6)}`;
    const receiptNum = `AIF-RCPT-2026-${Date.now().toString().slice(-6)}`;
    const certificateNumber = (category === 'Wakaf' || category === 'Zakat') 
      ? `AIF-CERT-${category === 'Wakaf' ? 'WK' : 'ZK'}-${Date.now().toString().slice(-4)}`
      : `AIF-CERT-GEN-${Date.now().toString().slice(-4)}`;

    const nowIso = new Date().toISOString();

    await pool.query(`
      INSERT INTO donations (id, user_id, donor_name, donor_email, donor_phone, campaign_title, campaign_slug, amount, category, payment_method, status, is_anonymous, message, receipt_number, created_date, paid_date, certificate_number, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, finalDonorName, finalDonorEmail, donorPhone || '',
      campaignTitle, finalCampaignSlug, parsedAmount, category, paymentMethod || 'QRIS',
      'success', isAnonymous ? 1 : 0, message || '', receiptNum, nowIso, nowIso, certificateNumber, isDemo
    ]);

    // Update campaign collected metrics
    if (matchedCampaign) {
      await pool.query(`
        UPDATE campaigns 
        SET collected_amount = collected_amount + ?,
            beneficiary_reached = LEAST(beneficiary_target, beneficiary_reached + 1)
        WHERE slug = ?
      `, [parsedAmount, finalCampaignSlug]);
    }

    // Update or insert into Donors CRM
    const [existingDonors]: any = await pool.query('SELECT * FROM donors WHERE LOWER(email) = LOWER(?)', [finalDonorEmail]);
    if (existingDonors.length > 0) {
      const d = existingDonors[0];
      const newTotal = Number(d.total_donation) + parsedAmount;
      const newVIP = newTotal >= 5000000;
      await pool.query(`
        UPDATE donors 
        SET total_donation = ?, donation_count = donation_count + 1,
            is_vip = ?, segment = ?
        WHERE id = ?
      `, [newTotal, newVIP ? 1 : 0, newVIP ? 'VIP Donor' : d.segment, d.id]);
    } else {
      const donorId = `DN-${Date.now().toString().slice(-4)}`;
      const isVIP = parsedAmount >= 5000000;
      await pool.query(`
        INSERT INTO donors (id, user_id, name, email, whatsapp, city, province, type, segment, total_donation, donation_count, is_recurring, is_vip, tags, follow_up_status, notes, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        donorId, userId, finalDonorName, finalDonorEmail,
        donorPhone || '+628120000000', 'Jakarta', 'DKI Jakarta', 'Individual',
        isVIP ? 'VIP Donor' : 'Regular Donor', parsedAmount, 1, 0,
        isVIP ? 1 : 0, JSON.stringify([category]), 'Baru', 'Terdaftar otomatis dari transaksi donasi.', isDemo
      ]);
    }

    const [createdDonation]: any = await pool.query('SELECT * FROM donations WHERE id = ?', [id]);
    res.status(201).json(formatDonationRow(createdDonation[0]));
  } catch (err: any) {
    console.error('Donation create error:', err);
    res.status(500).json({ message: 'Gagal memproses donasi.' });
  }
});

// Admin verify donation status
app.post('/api/donations/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    const [rows]: any = await pool.query('SELECT * FROM donations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Donasi tidak ditemukan.' });
    }

    const donation = rows[0];
    const oldStatus = donation.status;

    await pool.query('UPDATE donations SET status = ?, paid_date = ? WHERE id = ?', [
      status, status === 'success' ? new Date().toISOString() : donation.paid_date, req.params.id
    ]);

    // Recalculate campaign total if status changed
    if (status === 'success' && oldStatus !== 'success') {
      await pool.query('UPDATE campaigns SET collected_amount = collected_amount + ? WHERE slug = ?', [
        donation.amount, donation.campaign_slug
      ]);
    } else if (status !== 'success' && oldStatus === 'success') {
      await pool.query('UPDATE campaigns SET collected_amount = GREATEST(0, collected_amount - ?) WHERE slug = ?', [
        donation.amount, donation.campaign_slug
      ]);
    }

    const [updated]: any = await pool.query('SELECT * FROM donations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Status donasi berhasil diverifikasi.', donation: formatDonationRow(updated[0]) });
  } catch (err: any) {
    console.error('Verify donation error:', err);
    res.status(500).json({ message: 'Gagal memverifikasi donasi.' });
  }
});

// Delete donation
app.delete('/api/donations/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM donations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Donasi berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete donation error:', err);
    res.status(500).json({ message: 'Gagal menghapus donasi.' });
  }
});

// ---------------------------------------------------------
// DONORS CRM ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatDonorRow(r: any): Donor {
  let tags = [];
  try {
    tags = typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags || []);
  } catch (e) {
    tags = [];
  }
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    whatsapp: r.whatsapp,
    city: r.city,
    province: r.province,
    type: r.type,
    segment: r.segment,
    totalDonation: Number(r.total_donation),
    donationCount: Number(r.donation_count),
    isRecurring: Boolean(r.is_recurring),
    isVIP: Boolean(r.is_vip),
    tags,
    followUpStatus: r.follow_up_status,
    notes: r.notes
  };
}

app.get('/api/donors', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM donors ORDER BY total_donation DESC');
    res.json(rows.map(formatDonorRow));
  } catch (err: any) {
    console.error('Donors fetch error:', err);
    res.status(500).json({ message: 'Error fetching donors.' });
  }
});

app.post('/api/donors', async (req, res) => {
  try {
    const { name, email, whatsapp, city, province, type, segment, notes, tags, userEmail } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Nama dan email donatur wajib diisi.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const id = `DN-${Date.now().toString().slice(-4)}`;
    await pool.query(`
      INSERT INTO donors (id, user_id, name, email, whatsapp, city, province, type, segment, total_donation, donation_count, is_recurring, is_vip, tags, follow_up_status, notes, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, name, email, whatsapp || '', city || 'Indonesia', province || '',
      type || 'Individual', segment || 'Regular Donor', 0, 0, 0, 0,
      JSON.stringify(tags || ['Manual']), 'Baru', notes || '', isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM donors WHERE id = ?', [id]);
    res.status(201).json(formatDonorRow(created[0]));
  } catch (err: any) {
    console.error('Create donor error:', err);
    res.status(500).json({ message: 'Gagal menambahkan donatur.' });
  }
});

app.post('/api/donors/:id/note', async (req, res) => {
  try {
    await pool.query('UPDATE donors SET notes = ? WHERE id = ?', [req.body.notes || '', req.params.id]);
    const [rows]: any = await pool.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    res.json(formatDonorRow(rows[0]));
  } catch (err: any) {
    console.error('Update donor note error:', err);
    res.status(500).json({ message: 'Gagal memperbarui catatan donatur.' });
  }
});

app.post('/api/donors/:id/tag', async (req, res) => {
  try {
    await pool.query('UPDATE donors SET tags = ? WHERE id = ?', [JSON.stringify(req.body.tags || []), req.params.id]);
    const [rows]: any = await pool.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    res.json(formatDonorRow(rows[0]));
  } catch (err: any) {
    console.error('Update donor tags error:', err);
    res.status(500).json({ message: 'Gagal memperbarui tag donatur.' });
  }
});

app.put('/api/donors/:id', async (req, res) => {
  try {
    const { name, email, whatsapp, city, province, type, segment, notes, followUpStatus } = req.body;
    await pool.query(`
      UPDATE donors SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        whatsapp = COALESCE(?, whatsapp),
        city = COALESCE(?, city),
        province = COALESCE(?, province),
        type = COALESCE(?, type),
        segment = COALESCE(?, segment),
        notes = COALESCE(?, notes),
        follow_up_status = COALESCE(?, follow_up_status)
      WHERE id = ?
    `, [name, email, whatsapp, city, province, type, segment, notes, followUpStatus, req.params.id]);

    const [rows]: any = await pool.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Donatur tidak ditemukan.' });
    res.json(formatDonorRow(rows[0]));
  } catch (err: any) {
    console.error('Update donor error:', err);
    res.status(500).json({ message: 'Gagal memperbarui data donatur.' });
  }
});

app.delete('/api/donors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM donors WHERE id = ?', [req.params.id]);
    res.json({ message: 'Donatur berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete donor error:', err);
    res.status(500).json({ message: 'Gagal menghapus donatur.' });
  }
});

// ---------------------------------------------------------
// VOLUNTEERS ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatVolunteerRow(r: any): Volunteer {
  let skills = [];
  let interestArea = [];
  try {
    skills = typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills || []);
    interestArea = typeof r.interest_area === 'string' ? JSON.parse(r.interest_area) : (r.interest_area || []);
  } catch (e) {
    skills = [];
    interestArea = [];
  }
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    whatsapp: r.whatsapp,
    city: r.city,
    skills,
    interestArea,
    availability: r.availability,
    experience: r.experience,
    status: r.status,
    registeredDate: r.registered_date
  };
}

app.get('/api/volunteers', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM volunteers ORDER BY registered_date DESC');
    res.json(rows.map(formatVolunteerRow));
  } catch (err: any) {
    console.error('Volunteers fetch error:', err);
    res.status(500).json({ message: 'Error fetching volunteers.' });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    const { name, email, whatsapp, city, skills, interestArea, availability, experience, userEmail } = req.body;
    if (!name || !email || !whatsapp) {
      return res.status(400).json({ message: 'Nama, email, dan nomor WhatsApp wajib diisi.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const id = `V-${Date.now().toString().slice(-4)}`;
    const regDate = new Date().toISOString().split('T')[0];

    await pool.query(`
      INSERT INTO volunteers (id, user_id, name, email, whatsapp, city, skills, interest_area, availability, experience, status, registered_date, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, name, email, whatsapp, city || 'Indonesia',
      JSON.stringify(skills || ['Umum']), JSON.stringify(interestArea || ['Sosial']),
      availability || 'Weekend', experience || '', 'pending', regDate, isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM volunteers WHERE id = ?', [id]);
    res.status(201).json(formatVolunteerRow(created[0]));
  } catch (err: any) {
    console.error('Volunteer create error:', err);
    res.status(500).json({ message: 'Gagal mendaftar relawan.' });
  }
});

app.post('/api/volunteers/:id/status', async (req, res) => {
  try {
    await pool.query('UPDATE volunteers SET status = ? WHERE id = ?', [req.body.status || 'pending', req.params.id]);
    const [rows]: any = await pool.query('SELECT * FROM volunteers WHERE id = ?', [req.params.id]);
    res.json(formatVolunteerRow(rows[0]));
  } catch (err: any) {
    console.error('Update volunteer status error:', err);
    res.status(500).json({ message: 'Gagal memperbarui status relawan.' });
  }
});

app.delete('/api/volunteers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM volunteers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Relawan berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete volunteer error:', err);
    res.status(500).json({ message: 'Gagal menghapus relawan.' });
  }
});

// ---------------------------------------------------------
// CSR INQUIRIES ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatCsrRow(r: any): CsrInquiry {
  return {
    id: r.id,
    companyName: r.company_name,
    picName: r.pic_name,
    position: r.position,
    email: r.email,
    whatsapp: r.whatsapp,
    website: r.website,
    budgetRange: r.budget_range,
    interestedProgram: r.interested_program,
    locationTarget: r.location_target,
    message: r.message,
    pipelineStatus: r.pipeline_status,
    createdDate: r.created_date
  };
}

app.get('/api/csr-inquiries', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM csr_inquiries ORDER BY created_date DESC');
    res.json(rows.map(formatCsrRow));
  } catch (err: any) {
    console.error('CSR inquiries fetch error:', err);
    res.status(500).json({ message: 'Error fetching CSR inquiries.' });
  }
});

app.post('/api/csr-inquiries', async (req, res) => {
  try {
    const { companyName, picName, position, email, whatsapp, website, budgetRange, interestedProgram, locationTarget, message, userEmail } = req.body;
    if (!companyName || !picName || !email || !whatsapp) {
      return res.status(400).json({ message: 'Nama Perusahaan, PIC, Email, dan WhatsApp wajib diisi.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const id = `CSR-${Date.now().toString().slice(-4)}`;
    const createdDate = new Date().toISOString().split('T')[0];

    await pool.query(`
      INSERT INTO csr_inquiries (id, user_id, company_name, pic_name, position, email, whatsapp, website, budget_range, interested_program, location_target, message, pipeline_status, created_date, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, companyName, picName, position || 'PIC', email, whatsapp,
      website || '', budgetRange || 'Rp50.000.000 - Rp100.000.000',
      interestedProgram || 'Sosial', locationTarget || 'Nasional',
      message || '', 'new', createdDate, isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM csr_inquiries WHERE id = ?', [id]);
    res.status(201).json(formatCsrRow(created[0]));
  } catch (err: any) {
    console.error('CSR create error:', err);
    res.status(500).json({ message: 'Gagal mengirimkan inkuiri CSR.' });
  }
});

app.post('/api/csr-inquiries/:id/pipeline', async (req, res) => {
  try {
    await pool.query('UPDATE csr_inquiries SET pipeline_status = ? WHERE id = ?', [req.body.pipelineStatus || 'new', req.params.id]);
    const [rows]: any = await pool.query('SELECT * FROM csr_inquiries WHERE id = ?', [req.params.id]);
    res.json(formatCsrRow(rows[0]));
  } catch (err: any) {
    console.error('CSR pipeline update error:', err);
    res.status(500).json({ message: 'Gagal memperbarui status pipeline CSR.' });
  }
});

app.delete('/api/csr-inquiries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM csr_inquiries WHERE id = ?', [req.params.id]);
    res.json({ message: 'Inkuiri CSR berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete CSR error:', err);
    res.status(500).json({ message: 'Gagal menghapus inkuiri CSR.' });
  }
});

// ---------------------------------------------------------
// TRANSPARENCY REPORTS ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatReportRow(r: any): Report {
  return {
    id: r.id,
    title: r.title,
    campaignSlug: r.campaign_slug,
    type: r.type,
    period: r.period,
    totalReceived: Number(r.total_received),
    totalDisbursed: Number(r.total_disbursed),
    remainingBalance: Number(r.remaining_balance),
    publicVisibility: Boolean(r.public_visibility),
    auditStatus: r.audit_status,
    description: r.description,
    publishedDate: r.published_date
  };
}

app.get('/api/reports', async (req, res) => {
  try {
    const userEmail = req.query.user_email as string;
    const isAdmin = req.query.is_admin === 'true';

    let query = 'SELECT * FROM reports';
    let params: any[] = [];

    if (isAdmin && userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        if (user.is_demo) {
          query += ' ORDER BY published_date DESC';
        } else {
          query += ' WHERE user_id = ? ORDER BY published_date DESC';
          params = [user.id];
        }
      } else {
        query += ' ORDER BY published_date DESC';
      }
    } else {
      query += ' ORDER BY published_date DESC';
    }

    const [rows]: any = await pool.query(query, params);
    res.json(rows.map(formatReportRow));
  } catch (err: any) {
    console.error('Reports fetch error:', err);
    res.status(500).json({ message: 'Error fetching reports.' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { title, campaignSlug, type, period, totalReceived, totalDisbursed, description, userEmail } = req.body;
    if (!title || !period) {
      return res.status(400).json({ message: 'Judul dan Periode laporan wajib diisi.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const rec = Number(totalReceived) || 0;
    const disb = Number(totalDisbursed) || 0;
    const id = `RP-${Date.now().toString().slice(-4)}`;
    const pubDate = new Date().toISOString().split('T')[0];

    await pool.query(`
      INSERT INTO reports (id, user_id, title, campaign_slug, type, period, total_received, total_disbursed, remaining_balance, public_visibility, audit_status, description, published_date, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, title, campaignSlug || '', type || 'Monthly Report',
      period, rec, disb, Math.max(0, rec - disb), 1, 'published',
      description || `Laporan audit pertanggungjawaban amil untuk periode ${period}.`, pubDate, isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
    res.status(201).json(formatReportRow(created[0]));
  } catch (err: any) {
    console.error('Report create error:', err);
    res.status(500).json({ message: 'Gagal membuat laporan.' });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    const { title, campaignSlug, type, period, totalReceived, totalDisbursed, auditStatus, description } = req.body;
    const rec = Number(totalReceived) || 0;
    const disb = Number(totalDisbursed) || 0;
    const rem = Math.max(0, rec - disb);

    await pool.query(`
      UPDATE reports SET
        title = COALESCE(?, title),
        campaign_slug = COALESCE(?, campaign_slug),
        type = COALESCE(?, type),
        period = COALESCE(?, period),
        total_received = COALESCE(?, total_received),
        total_disbursed = COALESCE(?, total_disbursed),
        remaining_balance = ?,
        audit_status = COALESCE(?, audit_status),
        description = COALESCE(?, description)
      WHERE id = ?
    `, [title, campaignSlug, type, period, rec, disb, rem, auditStatus, description, req.params.id]);

    const [rows]: any = await pool.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
    res.json(formatReportRow(rows[0]));
  } catch (err: any) {
    console.error('Update report error:', err);
    res.status(500).json({ message: 'Gagal memperbarui laporan.' });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
    res.json({ message: 'Laporan berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete report error:', err);
    res.status(500).json({ message: 'Gagal menghapus laporan.' });
  }
});

// ---------------------------------------------------------
// BLOG POSTS ENDPOINTS (MySQL)
// ---------------------------------------------------------

function formatBlogRow(r: any): BlogPost {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    category: r.category,
    author: r.author,
    status: r.status,
    excerpt: r.excerpt,
    content: r.content,
    language: r.language,
    publishedDate: r.published_date,
    imageUrl: r.image_url,
    thumbnailUrl: r.thumbnail_url
  };
}

app.get('/api/blogs', async (req, res) => {
  try {
    const userEmail = req.query.user_email as string;
    const isAdmin = req.query.is_admin === 'true';

    let query = 'SELECT * FROM blog_posts';
    let params: any[] = [];

    if (isAdmin && userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        if (user.is_demo) {
          query += ' ORDER BY published_date DESC';
        } else {
          query += ' WHERE user_id = ? ORDER BY published_date DESC';
          params = [user.id];
        }
      } else {
        query += ' ORDER BY published_date DESC';
      }
    } else {
      query += ' ORDER BY published_date DESC';
    }

    const [rows]: any = await pool.query(query, params);
    res.json(rows.map(formatBlogRow));
  } catch (err: any) {
    console.error('Blogs fetch error:', err);
    res.status(500).json({ message: 'Error fetching blog posts.' });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, category, author, excerpt, content, language, imageUrl, userEmail } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Judul dan konten artikel wajib diisi.' });
    }

    let userId = 'usr-admin-demo';
    let isDemo = 1;
    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (user) {
        userId = user.id;
        isDemo = user.is_demo ? 1 : 0;
      }
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const [existing]: any = await pool.query('SELECT id FROM blog_posts WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const id = `B-${Date.now().toString().slice(-4)}`;
    const pubDate = new Date().toISOString().split('T')[0];
    const img = imageUrl || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600';

    await pool.query(`
      INSERT INTO blog_posts (id, user_id, title, slug, category, author, status, excerpt, content, language, published_date, image_url, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, title, slug, category || 'Umum', author || 'Admin AIF',
      'published', excerpt || title, content, language || 'id', pubDate, img, isDemo
    ]);

    const [created]: any = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
    res.status(201).json(formatBlogRow(created[0]));
  } catch (err: any) {
    console.error('Blog create error:', err);
    res.status(500).json({ message: 'Gagal membuat artikel.' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { title, category, author, excerpt, content, language, imageUrl, status } = req.body;
    await pool.query(`
      UPDATE blog_posts SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        author = COALESCE(?, author),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        language = COALESCE(?, language),
        image_url = COALESCE(?, image_url),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [title, category, author, excerpt, content, language, imageUrl, status, req.params.id]);

    const [rows]: any = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
    res.json(formatBlogRow(rows[0]));
  } catch (err: any) {
    console.error('Update blog error:', err);
    res.status(500).json({ message: 'Gagal memperbarui artikel.' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Artikel berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete blog error:', err);
    res.status(500).json({ message: 'Gagal menghapus artikel.' });
  }
});

// ---------------------------------------------------------
// FAQS & TESTIMONIALS (MySQL)
// ---------------------------------------------------------

app.get('/api/faqs', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM faqs ORDER BY id ASC');
    res.json(rows);
  } catch (err: any) {
    console.error('Faqs fetch error:', err);
    res.status(500).json({ message: 'Error fetching faqs.' });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { category, question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Pertanyaan dan jawaban FAQ wajib diisi.' });
    }
    const id = `F-${Date.now().toString().slice(-4)}`;
    await pool.query('INSERT INTO faqs (id, category, question, answer, is_demo) VALUES (?, ?, ?, ?, 0)', [
      id, category || 'Umum', question, answer
    ]);
    res.status(201).json({ id, category: category || 'Umum', question, answer, is_demo: 0 });
  } catch (err: any) {
    console.error('Create faq error:', err);
    res.status(500).json({ message: 'Gagal menambahkan FAQ.' });
  }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const { category, question, answer } = req.body;
    await pool.query(`
      UPDATE faqs SET
        category = COALESCE(?, category),
        question = COALESCE(?, question),
        answer = COALESCE(?, answer)
      WHERE id = ?
    `, [category, question, answer, req.params.id]);

    const [rows]: any = await pool.query('SELECT * FROM faqs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'FAQ tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err: any) {
    console.error('Update faq error:', err);
    res.status(500).json({ message: 'Gagal memperbarui FAQ.' });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ message: 'FAQ berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete faq error:', err);
    res.status(500).json({ message: 'Gagal menghapus FAQ.' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM testimonials ORDER BY id ASC');
    res.json(rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      content: r.content,
      message: r.message || r.content,
      avatarUrl: r.avatar_url,
      location: r.location,
      rating: r.rating,
      type: r.type
    })));
  } catch (err: any) {
    console.error('Testimonials fetch error:', err);
    res.status(500).json({ message: 'Error fetching testimonials.' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, content, message, avatarUrl, location, rating, type } = req.body;
    if (!name || !content) {
      return res.status(400).json({ message: 'Nama dan isi testimoni wajib diisi.' });
    }
    const id = `T-${Date.now().toString().slice(-4)}`;
    const avatar = avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
    await pool.query(`
      INSERT INTO testimonials (id, name, role, content, message, avatar_url, location, rating, type, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `, [id, name, role || 'Penerima Manfaat', content, message || content, avatar, location || 'Indonesia', Number(rating) || 5, type || 'beneficiary']);

    const [rows]: any = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    const r = rows[0];
    res.status(201).json({
      id: r.id,
      name: r.name,
      role: r.role,
      content: r.content,
      message: r.message || r.content,
      avatarUrl: r.avatar_url,
      location: r.location,
      rating: r.rating,
      type: r.type
    });
  } catch (err: any) {
    console.error('Create testimonial error:', err);
    res.status(500).json({ message: 'Gagal menambahkan testimoni.' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const { name, role, content, message, avatarUrl, location, rating, type } = req.body;
    await pool.query(`
      UPDATE testimonials SET
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        content = COALESCE(?, content),
        message = COALESCE(?, message),
        avatar_url = COALESCE(?, avatar_url),
        location = COALESCE(?, location),
        rating = COALESCE(?, rating),
        type = COALESCE(?, type)
      WHERE id = ?
    `, [name, role, content, message || content, avatarUrl, location, rating !== undefined ? Number(rating) : null, type, req.params.id]);

    const [rows]: any = await pool.query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Testimoni tidak ditemukan.' });
    const r = rows[0];
    res.json({
      id: r.id,
      name: r.name,
      role: r.role,
      content: r.content,
      message: r.message || r.content,
      avatarUrl: r.avatar_url,
      location: r.location,
      rating: r.rating,
      type: r.type
    });
  } catch (err: any) {
    console.error('Update testimonial error:', err);
    res.status(500).json({ message: 'Gagal memperbarui testimoni.' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Testimoni berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({ message: 'Gagal menghapus testimoni.' });
  }
});

// ---------------------------------------------------------
// FEEDBACKS API (MySQL)
// ---------------------------------------------------------

app.get('/api/feedbacks', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err: any) {
    console.error('Feedbacks fetch error:', err);
    res.status(500).json({ message: 'Error fetching feedbacks.' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { name, email, rating, category, message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Pesan masukan / feedback wajib diisi.' });
    }

    const id = `FB-${Date.now().toString().slice(-4)}`;
    await pool.query(`
      INSERT INTO feedbacks (id, name, email, rating, category, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, name || 'Anonim', email || '', Number(rating) || 5, category || 'Fitur Baru', message]);

    res.status(201).json({ message: 'Terima kasih atas masukan dan evaluasi Anda!' });
  } catch (err: any) {
    console.error('Create feedback error:', err);
    res.status(500).json({ message: 'Gagal mengirimkan feedback.' });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM feedbacks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Feedback berhasil dihapus.' });
  } catch (err: any) {
    console.error('Delete feedback error:', err);
    res.status(500).json({ message: 'Gagal menghapus feedback.' });
  }
});

// ---------------------------------------------------------
// ADMIN DATABASE MAINTENANCE: BACKUP, RESTORE & RESET
// ---------------------------------------------------------

app.get('/api/admin/backup', async (req, res) => {
  try {
    const backup = await backupDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=amanah_backup_${Date.now()}.json`);
    res.json(backup);
  } catch (err: any) {
    console.error('Backup error:', err);
    res.status(500).json({ message: 'Gagal melakukan backup basis data.' });
  }
});

app.post('/api/admin/restore', async (req, res) => {
  try {
    const payload = req.body;
    const result = await restoreDatabase(payload);
    res.json({ message: 'Basis data berhasil dipulihkan (Restore Sukses)!', result });
  } catch (err: any) {
    console.error('Restore error:', err);
    res.status(500).json({ message: err.message || 'Gagal memulihkan basis data.' });
  }
});

app.post('/api/admin/reset', async (req, res) => {
  try {
    await resetDatabase();
    res.json({ message: 'Basis data berhasil di-reset ke pengaturan dan seed data awal!' });
  } catch (err: any) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Gagal mereset basis data.' });
  }
});

// ---------------------------------------------------------
// TRANSLATION API (Powered by Gemini)
// ---------------------------------------------------------
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing parameter: text or targetLang' });
  }

  if (targetLang === 'id') {
    return res.json({ translation: text });
  }

  if (ai) {
    try {
      const userPrompt = `Translate the following text strictly into target language code "${targetLang}". Return ONLY the translation itself, without any introductory words, explanations, quotation marks, or markdown wrappers. Keep formatting (like paragraph breaks) if any.\n\nText: "${text}"`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: 'You are an elite, highly professional translation agent for Amanah Impact Foundation. Translate text accurately, naturally, and with high fidelity to the original human emotional and professional tone. Do not add metadata, explanations, quotes, or notes.'
        }
      });
      
      let translation = response.text || '';
      translation = translation.trim();
      
      if (translation.startsWith('"') && translation.endsWith('"')) {
        translation = translation.slice(1, -1).trim();
      } else if (translation.startsWith('\'') && translation.endsWith('\'')) {
        translation = translation.slice(1, -1).trim();
      }

      if (translation) {
        return res.json({ translation });
      }
    } catch (error) {
      console.error('Translation error using Gemini API:', error);
    }
  }

  return res.json({ translation: text });
});

app.post('/api/translate-batch', async (req, res) => {
  const { texts, targetLang } = req.body;
  if (!Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ error: 'Missing parameter: texts (array) or targetLang' });
  }

  const results: Record<string, string> = {};

  if (targetLang === 'id') {
    for (const txt of texts) {
      results[txt] = txt;
    }
    return res.json({ translations: results });
  }

  if (ai && texts.length > 0) {
    try {
      const userPrompt = `Translate the following list of Indonesian texts into target language code "${targetLang}". Return a JSON object with the original texts as keys and translated texts as values.\n\nTexts to translate:\n${JSON.stringify(texts)}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: `You are an elite, highly professional translation agent for Amanah Impact Foundation. Return ONLY a valid JSON object containing translated strings.`
        }
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        for (const [orig, trans] of Object.entries(parsed)) {
          results[orig] = String(trans);
        }
      } catch (e) {
        console.error('Error parsing JSON response from Gemini API:', e);
      }
    } catch (error) {
      console.error('Batch translation error using Gemini API:', error);
    }
  }

  for (const rawText of texts) {
    if (results[rawText] === undefined) {
      results[rawText] = rawText;
    }
  }

  res.json({ translations: results });
});

// ---------------------------------------------------------
// DATABASE BACKUP, RESTORE & RESET ENDPOINTS (Admin Maintenance)
// ---------------------------------------------------------
app.get('/api/admin/backup', async (req, res) => {
  try {
    const backup = await backupDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=amanah_backup_${Date.now()}.json`);
    return res.json(backup);
  } catch (err: any) {
    console.error('Backup error:', err);
    return res.status(500).json({ message: err.message || 'Gagal membuat cadangan basis data.' });
  }
});

app.post('/api/admin/restore', async (req, res) => {
  try {
    const result = await restoreDatabase(req.body);
    return res.json(result);
  } catch (err: any) {
    console.error('Restore error:', err);
    return res.status(500).json({ message: err.message || 'Gagal memulihkan basis data.' });
  }
});

app.post('/api/admin/reset', async (req, res) => {
  try {
    const result = await resetDatabase();
    return res.json(result);
  } catch (err: any) {
    console.error('Reset error:', err);
    return res.status(500).json({ message: err.message || 'Gagal mereset basis data.' });
  }
});

// AI Assistant endpoint
app.post('/api/ai/assist', async (req, res) => {
  const { contentType, prompt, textToTranslate, targetLanguage } = req.body;

  if (!contentType) {
    return res.status(400).json({ error: 'Missing parameter: contentType' });
  }

  let systemInstruction = 'Anda adalah asisten AI profesional untuk Yayasan Amanah Impact Foundation. ';
  let userPrompt = '';

  switch (contentType) {
    case 'campaign':
      systemInstruction += 'Tugas Anda menulis cerita kampanye donasi sosial yang bernada humanis, emosional, transparan, dan menggugah hati pembaca.';
      userPrompt = `Buatkan draf deskripsi cerita dan target program untuk usulan kampanye ini: "${prompt}". Sertakan latar belakang masalah, solusi yang ditawarkan, dan rincian penggunaan dana dalam bentuk poin-poin rapi.`;
      break;
    case 'faq':
      systemInstruction += 'Tugas Anda menjawab pertanyaan donatur seputar zakat, wakaf, sedekah, transparansi audit, dan penyaluran dana secara ramah, syariah, dan tuntas.';
      userPrompt = `Pertanyaan donatur: "${prompt}". Jawab sesingkat, sejelas, dan seramah mungkin berlandaskan syariah amil dan pedoman modern.`;
      break;
    case 'impact':
      systemInstruction += 'Tugas Anda merangkum narasi dampak sosial dari laporan penyaluran dana agar korporasi (CSR) maupun perorangan bersemangat mendukung.';
      userPrompt = `Buat narasi laporan dampak (impact report story) berdasarkan detail bantuan berikut: "${prompt}". Buat agar kaya emosi, bersyukur, dan menonjolkan transparansi dana.`;
      break;
    case 'reply':
      systemInstruction += 'Tugas Anda menyusun draf balasan pesan WhatsApp / Email yang ramah dan apresiatif bagi donatur atau sukarelawan.';
      userPrompt = `Susun pesan balasan ramah terimakasih atau follow up berdasarkan situasi ini: "${prompt}". Sisipkan salam Islami yang sopan dan tautan konfirmasi.`;
      break;
    case 'translate':
      systemInstruction += 'Tugas Anda menerjemahkan konten yayasan sosial dengan sangat akurat dan melestarikan nada humanisnya ke bahasa target.';
      userPrompt = `Terjemahkan teks berikut ke bahasa "${targetLanguage || 'English'}":\n\n"${textToTranslate || prompt}"`;
      break;
    default:
      userPrompt = prompt;
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });
      return res.json({ result: response.text, isSimulated: false });
    } catch (error: any) {
      console.error('Error invoking Gemini API:', error);
    }
  }

  // Graceful fallback
  const simulatedDraft = getMockAIDraft(contentType, prompt || textToTranslate, targetLanguage);
  return res.json({
    result: `[Integrasi Gemini Real-Time berjalan dalam Mode Simulasi]\n\n${simulatedDraft}`,
    isSimulated: true
  });
});

function getMockAIDraft(type: string, input: string, targetLang?: string): string {
  if (type === 'campaign') {
    return `### DRAFT KAMPANYE: ${input || 'Peduli Masa Depan Sesama'}\n\n**Latar Belakang:**\nDi tengah berbagai kesulitan ekonomi, banyak keluarga dhuafa harus berjuang ekstra keras bahkan sekadar untuk mendapatkan pangan harian sehat dan biaya sekolah dasar anak-anak mereka.\n\n**Solusi:**\nMelalui program gotong-royong di Amanah Impact Foundation (AIF), mari salurkan santunan terstruktur, bantuan pemenuhan nutrisi, dan beasiswa berkelanjutan sehingga impian mereka tetap tumbuh mekar.\n\n**Rincian Penggunaan Dana:**\n- 60% Pembelian Kit Nutrisi & Beasiswa Pendidikan\n- 25% Biaya Mentor & Kegiatan Pendampingan\n- 15% Distribusi Lapangan & Pelaporan Transparansi`;
  }
  if (type === 'faq') {
    return `Halo Kak! Terima kasih banyak atas pertanyaan hangatnya mengenai program di AIF.\n\nSetiap dana zakat dan wakaf yang diamanahkan kepada Amanah Impact Foundation (AIF) disalurkan secara profesional dan transparan merujuk pedoman syariah MUI (untuk Zakat) dan Nadzir Wakaf BWI (untuk Wakaf). Kami merilis Laporan Penyaluran serta Audit Keuangan lengkap secara terbuka di halaman Transparansi setiap bulannya.`;
  }
  if (type === 'impact') {
    return `### LAPORAN DAMPAK: Bergerak Memberi Manfaat\n\nAlhamdulillah, berkat kedermawanan dan kepercayaan penuh para muzakki dan donatur sekalian, bantuan sosial ini telah tersalurkan secara tuntas. Dampak nyata dari inisiatif ini:\n- **Peningkatan Gizi Anak**: Sebelas keluarga kini memiliki persediaan pangan cukup.\n- **Impian Sekolah Berlanjut**: Santri asnaf menerima paket beasiswa belajar.`;
  }
  if (type === 'reply') {
    return `Assalamu’alaikum Warahmatullahi Wabarakatuh Kak,\n\nTerima kasih banyak atas kedermawanan luar biasa yang Kakak berikan melalui Amanah Impact Foundation. Kami mengonfirmasi bahwa amanah donasi Kakak sebesar nominal yang ditransfer telah kami terima dan akan langsung kami salurkan tuntas demi kemaslahatan program.\n\nSalam hangat,\n**Tim Amil Amanah Impact Foundation**`;
  }
  return `Berikut adalah draf masukan asisten digital: \nRealisasi rincian "${input || 'Program Sosial'}" akan dialokasikan penuh demi kesejahteraan mustahik dhuafa.`;
}

// ---------------------------------------------------------
// VITE OR STATIC BUILD MIDDLEWARE
// ---------------------------------------------------------
async function startServer() {
  // Initialize MySQL Database
  await initDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Using Vite development server middleware.');
  } else {
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      if (fs.existsSync(path.join(process.cwd(), 'index.html'))) {
        distPath = process.cwd();
      } else if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
        distPath = path.join(__dirname, 'dist');
      } else if (fs.existsSync(path.join(__dirname, 'index.html'))) {
        distPath = __dirname;
      }
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving build production from directory: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NGO Platform dev server active on: http://localhost:${PORT}`);
  });
}

startServer();
