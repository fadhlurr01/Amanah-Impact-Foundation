import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { 
  organizationMock, campaignsMock, donationsMock, donorsMock, 
  volunteersMock, csrInquiriesMock, reportsMock, blogsMock, 
  testimonialsMock, faqsMock 
} from '../mockData';

dotenv.config();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'amanah impact foundation';

export let pool: mysql.Pool;

export async function initDatabase() {
  try {
    let activeDbName = DB_NAME;

    // 1. Try connecting directly to active database first (Standard production & cPanel behavior)
    let directConnectionSuccess = false;
    try {
      const directConn = await mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: activeDbName
      });
      await directConn.end();
      directConnectionSuccess = true;
    } catch (directErr: any) {
      // If direct connection failed, check alternative name 'amanah_impact_foundation' (without spaces)
      if (activeDbName === 'amanah impact foundation') {
        try {
          const altConn = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: 'amanah_impact_foundation'
          });
          await altConn.end();
          activeDbName = 'amanah_impact_foundation';
          directConnectionSuccess = true;
        } catch (altErr) {
          // Both failed, will attempt database creation below if user has root permissions
        }
      }
    }

    // 2. If direct connection didn't work (e.g. fresh local setup with root), try to create database
    if (!directConnectionSuccess) {
      try {
        const rootConnection = await mysql.createConnection({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD
        });
        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${activeDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConnection.end();
      } catch (rootErr) {
        console.warn('[MySQL] Notice: Could not run CREATE DATABASE (normal on restricted cPanel hosting):', (rootErr as any)?.message);
      }
    }

    // Create pool connected to database
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: activeDbName,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0
    });

    console.log(`[MySQL] Successfully connected to database \`${activeDbName}\``);
    await createTablesAndSeed();
  } catch (err) {
    console.error('[MySQL] Database connection failed:', err);
  }
}

async function createTablesAndSeed() {
  // 1. Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(64),
      password VARCHAR(255) NOT NULL,
      role VARCHAR(64) DEFAULT 'admin',
      photo_url TEXT,
      is_demo TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 2. Organization Info table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS organization_info (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255),
      short_name VARCHAR(64),
      tagline TEXT,
      type VARCHAR(255),
      founded_year INT,
      legal_number VARCHAR(255),
      tax_number VARCHAR(255),
      operational_license VARCHAR(255),
      address TEXT,
      email VARCHAR(255),
      phone VARCHAR(64),
      whatsapp VARCHAR(64),
      website VARCHAR(255),
      instagram VARCHAR(255),
      tiktok VARCHAR(255),
      youtube VARCHAR(255),
      facebook VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 3. Campaigns table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(100),
      status ENUM('active', 'draft', 'completed') DEFAULT 'active',
      is_featured TINYINT(1) DEFAULT 0,
      is_urgent TINYINT(1) DEFAULT 0,
      target_amount BIGINT NOT NULL DEFAULT 0,
      collected_amount BIGINT NOT NULL DEFAULT 0,
      disbursed_amount BIGINT NOT NULL DEFAULT 0,
      beneficiary_target INT DEFAULT 0,
      beneficiary_reached INT DEFAULT 0,
      location VARCHAR(255),
      start_date VARCHAR(64),
      end_date VARCHAR(64),
      short_description TEXT,
      story LONGTEXT,
      fund_usage JSON,
      image_url TEXT,
      thumbnail_url TEXT,
      video_url TEXT,
      urgency VARCHAR(32) DEFAULT 'medium',
      is_demo TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 4. Campaign Updates
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_updates (
      id VARCHAR(64) PRIMARY KEY,
      campaign_slug VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(64),
      description LONGTEXT,
      media_type ENUM('image', 'video', 'text') DEFAULT 'image',
      image_url TEXT,
      visibility ENUM('public', 'private') DEFAULT 'public',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 5. Donations
  await pool.query(`
    CREATE TABLE IF NOT EXISTS donations (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      donor_name VARCHAR(255) NOT NULL,
      donor_email VARCHAR(255) NOT NULL,
      donor_phone VARCHAR(64),
      campaign_title VARCHAR(255),
      campaign_slug VARCHAR(255) NOT NULL,
      amount BIGINT NOT NULL,
      category VARCHAR(100),
      payment_method VARCHAR(100),
      status ENUM('pending', 'success', 'failed', 'expired', 'manual_review', 'refunded') DEFAULT 'pending',
      is_anonymous TINYINT(1) DEFAULT 0,
      message TEXT,
      receipt_number VARCHAR(128),
      created_date VARCHAR(64),
      paid_date VARCHAR(64),
      certificate_number VARCHAR(128),
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 6. Donors CRM
  await pool.query(`
    CREATE TABLE IF NOT EXISTS donors (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(64),
      city VARCHAR(100),
      province VARCHAR(100),
      type VARCHAR(64) DEFAULT 'Individual',
      segment VARCHAR(64) DEFAULT 'Regular Donor',
      total_donation BIGINT DEFAULT 0,
      donation_count INT DEFAULT 0,
      is_recurring TINYINT(1) DEFAULT 0,
      is_vip TINYINT(1) DEFAULT 0,
      tags JSON,
      follow_up_status VARCHAR(64) DEFAULT 'Baru',
      notes TEXT,
      is_demo TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 7. Volunteers
  await pool.query(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(64),
      city VARCHAR(100),
      skills JSON,
      interest_area JSON,
      availability VARCHAR(100),
      experience TEXT,
      status ENUM('pending', 'approved', 'rejected', 'inactive') DEFAULT 'pending',
      registered_date VARCHAR(64),
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 8. CSR Inquiries
  await pool.query(`
    CREATE TABLE IF NOT EXISTS csr_inquiries (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      company_name VARCHAR(255) NOT NULL,
      pic_name VARCHAR(255) NOT NULL,
      position VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      whatsapp VARCHAR(64),
      website VARCHAR(255),
      budget_range VARCHAR(100),
      interested_program VARCHAR(100),
      location_target VARCHAR(100),
      message TEXT,
      pipeline_status ENUM('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'deal_won', 'deal_lost', 'program_running') DEFAULT 'new',
      created_date VARCHAR(64),
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 9. Reports
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      title VARCHAR(255) NOT NULL,
      campaign_slug VARCHAR(255),
      type VARCHAR(100),
      period VARCHAR(100),
      total_received BIGINT DEFAULT 0,
      total_disbursed BIGINT DEFAULT 0,
      remaining_balance BIGINT DEFAULT 0,
      public_visibility TINYINT(1) DEFAULT 1,
      audit_status ENUM('reviewed', 'published', 'draft') DEFAULT 'published',
      description LONGTEXT,
      published_date VARCHAR(64),
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 10. Blog Posts
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(100),
      author VARCHAR(100),
      status ENUM('draft', 'published') DEFAULT 'published',
      excerpt TEXT,
      content LONGTEXT,
      language VARCHAR(10) DEFAULT 'id',
      published_date VARCHAR(64),
      image_url TEXT,
      thumbnail_url TEXT,
      is_demo TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 11. Testimonials
  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(100),
      content TEXT,
      message TEXT,
      avatar_url TEXT,
      location VARCHAR(100),
      rating INT DEFAULT 5,
      type VARCHAR(50) DEFAULT 'beneficiary',
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // 12. FAQs
  await pool.query(`
    CREATE TABLE IF NOT EXISTS faqs (
      id VARCHAR(64) PRIMARY KEY,
      category VARCHAR(100),
      question TEXT NOT NULL,
      answer LONGTEXT NOT NULL,
      is_demo TINYINT(1) DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Check and seed default Admin User
  const [users]: any = await pool.query('SELECT COUNT(*) as count FROM users');
  if (users[0].count === 0) {
    console.log('[MySQL] Seeding default Demo Admin User...');
    await pool.query(`
      INSERT INTO users (id, name, email, phone, password, role, photo_url, is_demo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'usr-admin-demo',
      'Ahmad Syarif',
      'admin@amanah.org',
      '081234567890',
      'admin123',
      'Super Admin',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      1
    ]);
  }

  // Check and seed Organization Info
  const [orgs]: any = await pool.query('SELECT COUNT(*) as count FROM organization_info');
  if (orgs[0].count === 0) {
    console.log('[MySQL] Seeding Organization Info...');
    await pool.query(`
      INSERT INTO organization_info (name, short_name, tagline, type, founded_year, legal_number, tax_number, operational_license, address, email, phone, whatsapp, website, instagram, tiktok, youtube, facebook)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      organizationMock.name, organizationMock.shortName, organizationMock.tagline, organizationMock.type,
      organizationMock.foundedYear, organizationMock.legalNumber, organizationMock.taxNumber, organizationMock.operationalLicense,
      organizationMock.address, organizationMock.email, organizationMock.phone, organizationMock.whatsapp,
      organizationMock.website, organizationMock.instagram, organizationMock.tiktok, organizationMock.youtube, organizationMock.facebook
    ]);
  }

  // Check and seed Campaigns
  const [camps]: any = await pool.query('SELECT COUNT(*) as count FROM campaigns');
  if (camps[0].count === 0) {
    console.log('[MySQL] Seeding Campaigns...');
    for (const c of campaignsMock) {
      await pool.query(`
        INSERT INTO campaigns (id, user_id, title, slug, category, status, is_featured, is_urgent, target_amount, collected_amount, disbursed_amount, beneficiary_target, beneficiary_reached, location, start_date, end_date, short_description, story, fund_usage, image_url, video_url, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        c.id, 'usr-admin-demo', c.title, c.slug, c.category, c.status,
        c.isFeatured ? 1 : 0, c.isUrgent ? 1 : 0, c.targetAmount, c.collectedAmount,
        c.disbursedAmount, c.beneficiaryTarget, c.beneficiaryReached, c.location,
        c.startDate, c.endDate, c.shortDescription, c.story, JSON.stringify(c.fundUsage || []),
        c.imageUrl || '', c.videoUrl || '', 1
      ]);
    }
  }

  // Check and seed Campaign Updates
  const [updates]: any = await pool.query('SELECT COUNT(*) as count FROM campaign_updates');
  if (updates[0].count === 0) {
    console.log('[MySQL] Seeding Campaign Updates...');
    const demoUpdates = [
      { id: 'U-01', campaign_slug: 'beasiswa-1000-anak-yatim-dhuafa', title: '642 Anak Telah Menerima Bantuan Beasiswa', date: '2026-05-20', description: 'Alhamdulillah, bantuan beasiswa tahap kedua telah sukses disalurkan kepada 642 anak asnaf dan dhuafa di wilayah Jabodetabek. Penerima menerima dana bantuan tuntas, paket tas sekolah, dan buku pelajaran.', media_type: 'image', image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600', visibility: 'public' },
      { id: 'U-02', campaign_slug: 'wakaf-pembangunan-pesantren-tahfidz', title: 'Proses Pembangunan Asrama Mencapai 55%', date: '2026-05-12', description: 'Proses pembangunan fisik asrama santri tahfidz di Cianjur kini telah memasuki perakitan konstruksi atap baja ringan dan pemasangan instalasi listrik interior.', media_type: 'video', image_url: '', visibility: 'public' },
      { id: 'U-03', campaign_slug: 'sumur-bersih-desa-kekeringan', title: '3 Titik Sumur Bor Baru Siap Pakai di NTT', date: '2026-04-30', description: 'Tiga titik sumur bor dalam di wilayah Lombok Timur dan NTT kini sudah rampung dipasangi pipa dan motor penggerak submersible bertenaga surya. Air mengalir lancar.', media_type: 'image', image_url: 'https://images.unsplash.com/photo-1541829011853-89101397013e?auto=format&fit=crop&q=80&w=600', visibility: 'public' }
    ];
    for (const u of demoUpdates) {
      await pool.query(`
        INSERT INTO campaign_updates (id, campaign_slug, title, date, description, media_type, image_url, visibility)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [u.id, u.campaign_slug, u.title, u.date, u.description, u.media_type, u.image_url, u.visibility]);
    }
  }

  // Check and seed Donations
  const [dons]: any = await pool.query('SELECT COUNT(*) as count FROM donations');
  if (dons[0].count === 0) {
    console.log('[MySQL] Seeding Donations...');
    for (const d of donationsMock) {
      await pool.query(`
        INSERT INTO donations (id, user_id, donor_name, donor_email, donor_phone, campaign_title, campaign_slug, amount, category, payment_method, status, is_anonymous, message, receipt_number, created_date, paid_date, certificate_number, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        d.id, 'usr-admin-demo', d.donorName, d.donorEmail, d.donorPhone, d.campaignTitle,
        d.campaignSlug, d.amount, d.category, d.paymentMethod, d.status,
        d.isAnonymous ? 1 : 0, d.message || '', d.receiptNumber, d.createdDate,
        d.paidDate || '', d.certificateNumber || '', 1
      ]);
    }
  }

  // Check and seed Donors
  const [dnrs]: any = await pool.query('SELECT COUNT(*) as count FROM donors');
  if (dnrs[0].count === 0) {
    console.log('[MySQL] Seeding Donors...');
    for (const d of donorsMock) {
      await pool.query(`
        INSERT INTO donors (id, user_id, name, email, whatsapp, city, province, type, segment, total_donation, donation_count, is_recurring, is_vip, tags, follow_up_status, notes, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        d.id, 'usr-admin-demo', d.name, d.email, d.whatsapp, d.city, d.province,
        d.type, d.segment, d.totalDonation, d.donationCount, d.isRecurring ? 1 : 0,
        d.isVIP ? 1 : 0, JSON.stringify(d.tags || []), d.followUpStatus || 'Baru', d.notes || '', 1
      ]);
    }
  }

  // Check and seed Volunteers
  const [vols]: any = await pool.query('SELECT COUNT(*) as count FROM volunteers');
  if (vols[0].count === 0) {
    console.log('[MySQL] Seeding Volunteers...');
    for (const v of volunteersMock) {
      await pool.query(`
        INSERT INTO volunteers (id, user_id, name, email, whatsapp, city, skills, interest_area, availability, experience, status, registered_date, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        v.id, 'usr-admin-demo', v.name, v.email, v.whatsapp, v.city,
        JSON.stringify(v.skills || []), JSON.stringify(v.interestArea || []),
        v.availability, v.experience || '', v.status, v.registeredDate, 1
      ]);
    }
  }

  // Check and seed CSR Inquiries
  const [csrs]: any = await pool.query('SELECT COUNT(*) as count FROM csr_inquiries');
  if (csrs[0].count === 0) {
    console.log('[MySQL] Seeding CSR Inquiries...');
    for (const c of csrInquiriesMock) {
      await pool.query(`
        INSERT INTO csr_inquiries (id, user_id, company_name, pic_name, position, email, whatsapp, website, budget_range, interested_program, location_target, message, pipeline_status, created_date, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        c.id, 'usr-admin-demo', c.companyName, c.picName, c.position, c.email,
        c.whatsapp, c.website, c.budgetRange, c.interestedProgram, c.locationTarget,
        c.message || '', c.pipelineStatus, c.createdDate, 1
      ]);
    }
  }

  // Check and seed Reports
  const [reps]: any = await pool.query('SELECT COUNT(*) as count FROM reports');
  if (reps[0].count === 0) {
    console.log('[MySQL] Seeding Reports...');
    for (const r of reportsMock) {
      await pool.query(`
        INSERT INTO reports (id, user_id, title, campaign_slug, type, period, total_received, total_disbursed, remaining_balance, public_visibility, audit_status, description, published_date, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        r.id, 'usr-admin-demo', r.title, r.campaignSlug, r.type, r.period,
        r.totalReceived, r.totalDisbursed, r.remainingBalance, r.publicVisibility ? 1 : 0,
        r.auditStatus, r.description, r.publishedDate, 1
      ]);
    }
  }

  // Check and seed Blogs
  const [bgs]: any = await pool.query('SELECT COUNT(*) as count FROM blog_posts');
  if (bgs[0].count === 0) {
    console.log('[MySQL] Seeding Blogs...');
    for (const b of blogsMock) {
      await pool.query(`
        INSERT INTO blog_posts (id, user_id, title, slug, category, author, status, excerpt, content, language, published_date, image_url, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        b.id, 'usr-admin-demo', b.title, b.slug, b.category, b.author,
        b.status, b.excerpt, b.content, b.language, b.publishedDate, b.imageUrl || '', 1
      ]);
    }
  }

  // Check and seed Testimonials
  const [tsts]: any = await pool.query('SELECT COUNT(*) as count FROM testimonials');
  if (tsts[0].count === 0) {
    console.log('[MySQL] Seeding Testimonials...');
    for (const t of testimonialsMock) {
      await pool.query(`
        INSERT INTO testimonials (id, name, role, content, message, avatar_url, location, rating, type, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        t.id, t.name, t.role, t.content, t.message || t.content,
        t.avatarUrl || '', t.location || '', t.rating || 5, t.type || 'beneficiary', 1
      ]);
    }
  }

  // 13. Feedbacks table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      rating INT DEFAULT 5,
      category VARCHAR(100) DEFAULT 'Fitur Baru',
      message LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Check and seed Feedbacks
  const [fbs]: any = await pool.query('SELECT COUNT(*) as count FROM feedbacks');
  if (fbs[0].count === 0) {
    console.log('[MySQL] Seeding Feedbacks...');
    await pool.query(`
      INSERT INTO feedbacks (id, name, email, rating, category, message)
      VALUES 
      ('FB-01', 'Hendra Kusuma', 'hendra@example.com', 5, 'UI/UX', 'Tampilan platform sangat bersih, transparan, dan memudahkan kami melacak penyaluran zakat secara live!'),
      ('FB-02', 'Dewi Lestari', 'dewi.lestari@corporate.id', 5, 'Fitur Baru', 'Fitur pipeline CSR dan download sertifikat wakaf digital sangat membantu pelaporan ESG perusahaan kami.')
    `);
  }

  console.log('[MySQL] Database tables and seed datasets verified successfully!');
}

// Full Database Backup function
export async function backupDatabase() {
  const tables = [
    'users', 'organization_info', 'campaigns', 'campaign_updates',
    'donations', 'donors', 'volunteers', 'csr_inquiries',
    'reports', 'blog_posts', 'testimonials', 'faqs', 'feedbacks'
  ];

  const backupData: Record<string, any[]> = {};
  for (const table of tables) {
    const [rows]: any = await pool.query(`SELECT * FROM \`${table}\``);
    backupData[table] = rows;
  }

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: DB_NAME,
    data: backupData
  };
}

// Full Database Restore function
export async function restoreDatabase(backupPayload: any) {
  if (!backupPayload || !backupPayload.data) {
    throw new Error('Format file backup tidak valid.');
  }

  const data = backupPayload.data;
  const tables = Object.keys(data);

  for (const table of tables) {
    if (!Array.isArray(data[table])) continue;

    // Truncate existing table
    await pool.query(`TRUNCATE TABLE \`${table}\``);

    // Insert rows
    for (const row of data[table]) {
      const keys = Object.keys(row);
      if (keys.length === 0) continue;

      const placeholders = keys.map(() => '?').join(', ');
      const columns = keys.map(k => `\`${k}\``).join(', ');
      const values = keys.map(k => {
        const val = row[k];
        if (typeof val === 'object' && val !== null && !(val instanceof Date)) {
          return JSON.stringify(val);
        }
        return val;
      });

      await pool.query(`INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`, values);
    }
  }

  return { success: true, restoredTables: tables };
}

// Reset Database function (Drops all tables and re-initializes clean demo data)
export async function resetDatabase() {
  const tables = [
    'users', 'organization_info', 'campaigns', 'campaign_updates',
    'donations', 'donors', 'volunteers', 'csr_inquiries',
    'reports', 'blog_posts', 'testimonials', 'faqs', 'feedbacks'
  ];

  for (const table of tables) {
    await pool.query(`DROP TABLE IF EXISTS \`${table}\``);
  }

  await createTablesAndSeed();
  return { success: true };
}
