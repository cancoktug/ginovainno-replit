import nodemailer from 'nodemailer';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private fromEmail = 'ginova@itu.edu.tr';
  private transporter: nodemailer.Transporter;

  constructor() {
    // ITU SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: 'outgoing.itu.edu.tr',
      port: 587,
      secure: false, // TLS
      auth: {
        user: 'ginova@itu.edu.tr',
        pass: 'xgmRy5f8yX'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${template.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Email templates
  generateBookingConfirmationEmail(applicantName: string, mentorName: string, date: string, time: string): EmailTemplate {
    return {
      to: '',
      subject: `Randevu Talebiniz Alındı - ${mentorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Randevu Talebi</h2>
          
          <p>Merhaba <strong>${applicantName}</strong>,</p>
          
          <p><strong>${mentorName}</strong> ile randevu talebiniz başarıyla alınmıştır.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Randevu Detayları:</h3>
            <p><strong>Mentor:</strong> ${mentorName}</p>
            <p><strong>Tarih:</strong> ${new Date(date).toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Saat:</strong> ${time}</p>
          </div>
          
          <p>Talebiniz değerlendirildikten sonra sizinle iletişime geçilecektir.</p>
          
          <p>Teşekkürler,<br>ITU Ginova Ekibi</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            İstanbul Teknik Üniversitesi<br>
            Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      `,
      text: `
        ITU Ginova - Randevu Talebi
        
        Merhaba ${applicantName},
        
        ${mentorName} ile randevu talebiniz başarıyla alınmıştır.
        
        Randevu Detayları:
        Mentor: ${mentorName}
        Tarih: ${new Date(date).toLocaleDateString('tr-TR')}
        Saat: ${time}
        
        Talebiniz değerlendirildikten sonra sizinle iletişime geçilecektir.
        
        Teşekkürler,
        ITU Ginova Ekibi
      `
    };
  }

  generateMentorNotificationEmail(mentorName: string, applicantName: string, applicantEmail: string, company: string, topic: string, date: string, time: string, phone: string, message: string): EmailTemplate {
    return {
      to: '',
      subject: `Yeni Randevu Talebi - ${applicantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Yeni Randevu Talebi</h2>
          
          <p>Merhaba <strong>${mentorName}</strong>,</p>
          
          <p>Size yeni bir randevu talebi geldi.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Başvuru Detayları:</h3>
            <p><strong>Ad Soyad:</strong> ${applicantName}</p>
            <p><strong>E-posta:</strong> ${applicantEmail}</p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Şirket/Kurum:</strong> ${company}</p>` : ''}
            <p><strong>Görüşme Konusu:</strong> ${topic}</p>
            <p><strong>Tercih Edilen Tarih:</strong> ${new Date(date).toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Tercih Edilen Saat:</strong> ${time}</p>
            ${message ? `<p><strong>Ek Mesaj:</strong> ${message}</p>` : ''}
          </div>
          
          <p>Lütfen başvuruyu değerlendirin ve uygunsa başvuru sahibi ile iletişime geçin.</p>
          
          <p>Teşekkürler,<br>ITU Ginova Ekibi</p>
        </div>
      `,
      text: `
        ITU Ginova - Yeni Randevu Talebi
        
        Merhaba ${mentorName},
        
        Size yeni bir randevu talebi geldi.
        
        Başvuru Detayları:
        Ad Soyad: ${applicantName}
        E-posta: ${applicantEmail}
        ${phone ? `Telefon: ${phone}` : ''}
        ${company ? `Şirket/Kurum: ${company}` : ''}
        Görüşme Konusu: ${topic}
        Tercih Edilen Tarih: ${new Date(date).toLocaleDateString('tr-TR')}
        Tercih Edilen Saat: ${time}
        ${message ? `Ek Mesaj: ${message}` : ''}
        
        Lütfen başvuruyu değerlendirin ve uygunsa başvuru sahibi ile iletişime geçin.
        
        ITU Ginova Ekibi
      `
    };
  }

  generateAdminNotificationEmail(mentorName: string, applicantName: string, applicantEmail: string, company: string, topic: string, date: string, time: string, phone: string, message: string): EmailTemplate {
    return {
      to: 'ginova@itu.edu.tr',
      subject: `Yeni Mentor Randevu Talebi - ${mentorName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Yeni Mentor Randevu Talebi</h2>
          
          <p>Yeni bir mentor randevu talebi alındı.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Randevu Detayları:</h3>
            <p><strong>Mentor:</strong> ${mentorName}</p>
            <p><strong>Başvuru Sahibi:</strong> ${applicantName}</p>
            <p><strong>E-posta:</strong> ${applicantEmail}</p>
            ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Şirket/Kurum:</strong> ${company}</p>` : ''}
            <p><strong>Görüşme Konusu:</strong> ${topic}</p>
            <p><strong>Tercih Edilen Tarih:</strong> ${new Date(date).toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Tercih Edilen Saat:</strong> ${time}</p>
            ${message ? `<p><strong>Ek Mesaj:</strong> ${message}</p>` : ''}
          </div>
          
          <p>Bu talep admin panelden izlenebilir ve yönetilebilir.</p>
          
          <p>ITU Ginova Sistemi</p>
        </div>
      `,
      text: `
        ITU Ginova - Yeni Mentor Randevu Talebi
        
        Yeni bir mentor randevu talebi alındı.
        
        Randevu Detayları:
        Mentor: ${mentorName}
        Başvuru Sahibi: ${applicantName}
        E-posta: ${applicantEmail}
        ${phone ? `Telefon: ${phone}` : ''}
        ${company ? `Şirket/Kurum: ${company}` : ''}
        Görüşme Konusu: ${topic}
        Tercih Edilen Tarih: ${new Date(date).toLocaleDateString('tr-TR')}
        Tercih Edilen Saat: ${time}
        ${message ? `Ek Mesaj: ${message}` : ''}
        
        Bu talep admin panelden izlenebilir ve yönetilebilir.
        
        ITU Ginova Sistemi
      `
    };
  }

  // Program Application Email Template
  generateProgramApplicationEmail(programTitle: string, applicantData: any): EmailTemplate {
    return {
      to: 'ginova@itu.edu.tr',
      subject: `Yeni Program Başvurusu - ${programTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Yeni Program Başvurusu</h2>
          
          <p><strong>${programTitle}</strong> programına yeni bir başvuru alındı.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Başvuru Detayları:</h3>
            <p><strong>Ad Soyad:</strong> ${applicantData.firstName} ${applicantData.lastName}</p>
            <p><strong>E-posta:</strong> ${applicantData.email}</p>
            <p><strong>Telefon:</strong> ${applicantData.phone}</p>
            ${applicantData.organization ? `<p><strong>Kurum/Şirket:</strong> ${applicantData.organization}</p>` : ''}
            ${applicantData.position ? `<p><strong>Pozisyon:</strong> ${applicantData.position}</p>` : ''}
            ${applicantData.experience ? `<p><strong>Deneyim:</strong> ${applicantData.experience}</p>` : ''}
            ${applicantData.motivation ? `<p><strong>Başvuru Nedeni:</strong> ${applicantData.motivation}</p>` : ''}
            ${applicantData.expectations ? `<p><strong>Beklentiler:</strong> ${applicantData.expectations}</p>` : ''}
          </div>
          
          <p>Başvuru admin panelden değerlendirilebilir.</p>
          
          <p>ITU Ginova Sistemi</p>
        </div>
      `,
      text: `
        ITU Ginova - Yeni Program Başvurusu
        
        ${programTitle} programına yeni bir başvuru alındı.
        
        Başvuru Detayları:
        Ad Soyad: ${applicantData.firstName} ${applicantData.lastName}
        E-posta: ${applicantData.email}
        Telefon: ${applicantData.phone}
        ${applicantData.organization ? `Kurum/Şirket: ${applicantData.organization}` : ''}
        ${applicantData.position ? `Pozisyon: ${applicantData.position}` : ''}
        ${applicantData.experience ? `Deneyim: ${applicantData.experience}` : ''}
        ${applicantData.motivation ? `Başvuru Nedeni: ${applicantData.motivation}` : ''}
        ${applicantData.expectations ? `Beklentiler: ${applicantData.expectations}` : ''}
        
        Başvuru admin panelden değerlendirilebilir.
        
        ITU Ginova Sistemi
      `
    };
  }

  // Event Application Email Template
  generateEventApplicationEmail(eventTitle: string, applicantData: any): EmailTemplate {
    return {
      to: 'ginova@itu.edu.tr',
      subject: `Yeni Etkinlik Başvurusu - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Yeni Etkinlik Başvurusu</h2>
          
          <p><strong>${eventTitle}</strong> etkinliğine yeni bir başvuru alındı.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Başvuru Detayları:</h3>
            <p><strong>Ad Soyad:</strong> ${applicantData.firstName} ${applicantData.lastName}</p>
            <p><strong>E-posta:</strong> ${applicantData.email}</p>
            <p><strong>Telefon:</strong> ${applicantData.phone}</p>
            ${applicantData.organization ? `<p><strong>Kurum/Şirket:</strong> ${applicantData.organization}</p>` : ''}
            ${applicantData.position ? `<p><strong>Pozisyon:</strong> ${applicantData.position}</p>` : ''}
            ${applicantData.motivation ? `<p><strong>Katılım Nedeni:</strong> ${applicantData.motivation}</p>` : ''}
            ${applicantData.expectations ? `<p><strong>Beklentiler:</strong> ${applicantData.expectations}</p>` : ''}
            ${applicantData.dietaryRestrictions ? `<p><strong>Beslenme Kısıtları:</strong> ${applicantData.dietaryRestrictions}</p>` : ''}
          </div>
          
          <p>Başvuru admin panelden değerlendirilebilir.</p>
          
          <p>ITU Ginova Sistemi</p>
        </div>
      `,
      text: `
        ITU Ginova - Yeni Etkinlik Başvurusu
        
        ${eventTitle} etkinliğine yeni bir başvuru alındı.
        
        Başvuru Detayları:
        Ad Soyad: ${applicantData.firstName} ${applicantData.lastName}
        E-posta: ${applicantData.email}
        Telefon: ${applicantData.phone}
        ${applicantData.organization ? `Kurum/Şirket: ${applicantData.organization}` : ''}
        ${applicantData.position ? `Pozisyon: ${applicantData.position}` : ''}
        ${applicantData.motivation ? `Katılım Nedeni: ${applicantData.motivation}` : ''}
        ${applicantData.expectations ? `Beklentiler: ${applicantData.expectations}` : ''}
        ${applicantData.dietaryRestrictions ? `Beslenme Kısıtları: ${applicantData.dietaryRestrictions}` : ''}
        
        Başvuru admin panelden değerlendirilebilir.
        
        ITU Ginova Sistemi
      `
    };
  }

  // Contact Form Email Template
  generateContactFormEmail(contactData: any): EmailTemplate {
    return {
      to: 'ginova@itu.edu.tr',
      subject: `Yeni İletişim Formu Mesajı - ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Yeni İletişim Mesajı</h2>
          
          <p>Website iletişim formundan yeni bir mesaj alındı.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">İletişim Detayları:</h3>
            <p><strong>Ad Soyad:</strong> ${contactData.name}</p>
            <p><strong>E-posta:</strong> ${contactData.email}</p>
            ${contactData.phone ? `<p><strong>Telefon:</strong> ${contactData.phone}</p>` : ''}
            ${contactData.subject ? `<p><strong>Konu:</strong> ${contactData.subject}</p>` : ''}
            ${contactData.company ? `<p><strong>Şirket/Kurum:</strong> ${contactData.company}</p>` : ''}
            <p><strong>Mesaj:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 10px 0;">
              ${contactData.message}
            </div>
          </div>
          
          <p>Mesaja en kısa sürede yanıt verilmesi önerilir.</p>
          
          <p>ITU Ginova Sistemi</p>
        </div>
      `,
      text: `
        ITU Ginova - Yeni İletişim Mesajı
        
        Website iletişim formundan yeni bir mesaj alındı.
        
        İletişim Detayları:
        Ad Soyad: ${contactData.name}
        E-posta: ${contactData.email}
        ${contactData.phone ? `Telefon: ${contactData.phone}` : ''}
        ${contactData.subject ? `Konu: ${contactData.subject}` : ''}
        ${contactData.company ? `Şirket/Kurum: ${contactData.company}` : ''}
        
        Mesaj:
        ${contactData.message}
        
        Mesaja en kısa sürede yanıt verilmesi önerilir.
        
        ITU Ginova Sistemi
      `
    };
  }

  // Applicant confirmation emails
  generateProgramApplicationConfirmation(applicantEmail: string, applicantName: string, programTitle: string): EmailTemplate {
    return {
      to: applicantEmail,
      subject: `Başvurunuz Alındı - ${programTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Program Başvurusu</h2>
          
          <p>Merhaba <strong>${applicantName}</strong>,</p>
          
          <p><strong>${programTitle}</strong> programına başvurunuz başarıyla alınmıştır.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Başvuru Durumu: Değerlendiriliyor</h3>
            <p>Başvurunuz inceleniyor. Sonuç hakkında en kısa sürede bilgilendirileceksiniz.</p>
          </div>
          
          <p>Başvurunuz ile ilgili herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
          
          <p>Başarılar dileriz!<br>ITU Ginova Ekibi</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            İstanbul Teknik Üniversitesi<br>
            Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      `,
      text: `
        ITU Ginova - Program Başvurusu
        
        Merhaba ${applicantName},
        
        ${programTitle} programına başvurunuz başarıyla alınmıştır.
        
        Başvuru Durumu: Değerlendiriliyor
        Başvurunuz inceleniyor. Sonuç hakkında en kısa sürede bilgilendirileceksiniz.
        
        Başvurunuz ile ilgili herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
        
        Başarılar dileriz!
        ITU Ginova Ekibi
      `
    };
  }

  generateEventApplicationConfirmation(applicantEmail: string, applicantName: string, eventTitle: string): EmailTemplate {
    return {
      to: applicantEmail,
      subject: `Başvurunuz Alındı - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Etkinlik Başvurusu</h2>
          
          <p>Merhaba <strong>${applicantName}</strong>,</p>
          
          <p><strong>${eventTitle}</strong> etkinliğine başvurunuz başarıyla alınmıştır.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Başvuru Durumu: Değerlendiriliyor</h3>
            <p>Başvurunuz inceleniyor. Sonuç hakkında en kısa sürede bilgilendirileceksiniz.</p>
          </div>
          
          <p>Başvurunuz ile ilgili herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
          
          <p>Görüşmek üzere!<br>ITU Ginova Ekibi</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            İstanbul Teknik Üniversitesi<br>
            Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      `,
      text: `
        ITU Ginova - Etkinlik Başvurusu
        
        Merhaba ${applicantName},
        
        ${eventTitle} etkinliğine başvurunuz başarıyla alınmıştır.
        
        Başvuru Durumu: Değerlendiriliyor
        Başvurunuz inceleniyor. Sonuç hakkında en kısa sürede bilgilendirileceksiniz.
        
        Başvurunuz ile ilgili herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
        
        Görüşmek üzere!
        ITU Ginova Ekibi
      `
    };
  }

  generateStatusUpdateNotification(applicantEmail: string, applicantName: string, title: string, status: string, type: 'program' | 'event' | 'mentor', reviewNotes?: string): EmailTemplate {
    const statusTexts = {
      approved: 'Onaylandı',
      rejected: 'Reddedildi',
      waitlist: 'Bekleme Listesine Alındı',
      confirmed: 'Onaylandı',
      pending: 'Değerlendiriliyor'
    };

    const statusColors = {
      approved: '#10b981',
      rejected: '#ef4444',
      waitlist: '#3b82f6',
      confirmed: '#10b981',
      pending: '#f59e0b'
    };

    const typeTexts = {
      program: 'program',
      event: 'etkinlik',
      mentor: 'mentor randevu'
    };

    const statusText = statusTexts[status as keyof typeof statusTexts] || status;
    const statusColor = statusColors[status as keyof typeof statusColors] || '#666';
    const typeText = typeTexts[type];

    return {
      to: applicantEmail,
      subject: `Başvuru Durumu Güncellendi - ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Başvuru Durumu Güncellendi</h2>
          
          <p>Merhaba <strong>${applicantName}</strong>,</p>
          
          <p><strong>${title}</strong> ${typeText} başvurunuzun durumu güncellendi.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: ${statusColor};">Durum: ${statusText}</h3>
            ${reviewNotes ? `
              <div style="background-color: white; padding: 15px; border-left: 4px solid ${statusColor}; margin-top: 15px;">
                <strong>Not:</strong><br>
                ${reviewNotes}
              </div>
            ` : ''}
          </div>
          
          <p>Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
          
          <p>Teşekkürler,<br>ITU Ginova Ekibi</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            İstanbul Teknik Üniversitesi<br>
            Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      `,
      text: `
        ITU Ginova - Başvuru Durumu Güncellendi
        
        Merhaba ${applicantName},
        
        ${title} ${typeText} başvurunuzun durumu güncellendi.
        
        Durum: ${statusText}
        ${reviewNotes ? `\nNot: ${reviewNotes}` : ''}
        
        Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.
        
        Teşekkürler,
        ITU Ginova Ekibi
      `
    };
  }

  // Password reset email
  generatePasswordResetEmail(userEmail: string, userName: string, resetToken: string): EmailTemplate {
    const resetUrl = `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    return {
      to: userEmail,
      subject: 'ITU Ginova - Şifre Sıfırlama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">ITU Ginova - Şifre Sıfırlama</h2>
          
          <p>Merhaba <strong>${userName}</strong>,</p>
          
          <p>Hesabınız için şifre sıfırlama talebinde bulunuldu. Aşağıdaki butona tıklayarak yeni şifrenizi oluşturabilirsiniz:</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          
          <p>Veya aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <strong>⚠️ Güvenlik Uyarısı:</strong><br>
            Bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın ve şifrenizi değiştirmeyin.
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Bu link 24 saat geçerlidir.
          </p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            İstanbul Teknik Üniversitesi<br>
            Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
          </p>
        </div>
      `,
      text: `
        ITU Ginova - Şifre Sıfırlama
        
        Merhaba ${userName},
        
        Hesabınız için şifre sıfırlama talebinde bulunuldu. Aşağıdaki linke tıklayarak yeni şifrenizi oluşturabilirsiniz:
        
        ${resetUrl}
        
        ⚠️ Güvenlik Uyarısı:
        Bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın ve şifrenizi değiştirmeyin.
        
        Bu link 24 saat geçerlidir.
        
        İstanbul Teknik Üniversitesi
        Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi
      `
    };
  }
}

export const emailService = new EmailService();