// מדיניות פרטיות - עמוד ציבורי בכתובת /privacy
// נדרש לפרסום מסך ההסכמה של Google OAuth (מצב ייצור).

export function privacyPage() {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>מדיניות פרטיות - קומיקס אירועים</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px 16px; line-height: 1.8; }
  .wrap { max-width: 760px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  h1 { color: #7c3aed; font-size: 1.8rem; margin: 0 0 8px; }
  h2 { color: #334155; font-size: 1.2rem; margin: 28px 0 6px; }
  p, li { font-size: 1rem; }
  .updated { color: #64748b; font-size: 0.9rem; }
  ul { padding-right: 22px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>מדיניות פרטיות</h1>
  <p class="updated">עדכון אחרון: 26 בספטמבר 2026</p>

  <p>ברוכים הבאים למערכת הניהול של קומיקס אירועים (comics-events.co.il), מערכת לניהול לידים, אירועים ולקוחות לעסקי אירועים. מדיניות זו מסבירה איזה מידע אנו אוספים, כיצד אנו משתמשים בו, ומהן זכויותיכם.</p>

  <h2>איזה מידע אנו אוספים</h2>
  <ul>
    <li><strong>פרטי חשבון:</strong> שם, כתובת דוא"ל וסיסמה מוצפנת של משתמשי המערכת.</li>
    <li><strong>נתוני העסק שהמשתמש מזין:</strong> שמות ופרטי התקשרות של לקוחות, תאריכי אירועים, מקומות, מחירים, מסמכי מכירה ורשימות קניות.</li>
    <li><strong>נתוני יומן Google:</strong> אם בחרתם לחבר את יומן Google, אנו ניגשים לאירועי היומן שלכם כמתואר להלן.</li>
  </ul>

  <h2>כיצד אנו משתמשים במידע</h2>
  <ul>
    <li>הפעלת המערכת: ניהול לידים, אירועים, לקוחות, חיוב ומלאי עבור העסק שלכם.</li>
    <li>סנכרון אירועים ליומן Google שלכם, לבקשתכם ובאישורכם בלבד.</li>
  </ul>

  <h2>שימוש בנתוני Google</h2>
  <p>כאשר מחברים את יומן Google, האפליקציה מבקשת הרשאה לניהול אירועים ביומן (calendar.events) ומשתמשת בה אך ורק כדי ליצור, לעדכן ולמחוק אירועים שנוצרו מתוך המערכת, ביומן של המשתמש המחובר בלבד.</p>
  <p>השימוש במידע שהתקבל מ-Google APIs מוגבל לצרכים המתוארים במדיניות זו, והוא מציית ל-<a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</a>, כולל דרישות השימוש המוגבל (Limited Use): המידע אינו נמכר, אינו משמש לפרסום, אינו מועבר לצדדים שלישיים, ואינו נקרא על ידי בני אדם אלא לצורכי תמיכה טכנית באישור המשתמש.</p>

  <h2>אחסון ואבטחה</h2>
  <p>המידע מאוחסן בשרתי Cloudflare המאובטחים. הגישה למידע מוגבלת למשתמשי העסק המורשים בלבד, והחיבור לאתר מוצפן (HTTPS).</p>

  <h2>שיתוף מידע</h2>
  <p>אנו לא מוכרים, משכירים או משתפים את המידע שלכם עם צדדים שלישיים, למעט ספקי תשתית (Cloudflare) המעבדים את המידע עבורנו ובכפוף להסכמי אבטחה.</p>

  <h2>הזכויות שלכם</h2>
  <p>באפשרותכם לעדכן או למחוק את פרטי הלקוחות והאירועים בכל עת מתוך המערכת. לבקשת מחיקת חשבון או מידע נוסף, פנו אלינו בדוא"ל.</p>

  <h2>ניתוק חיבור יומן Google</h2>
  <p>ניתן לנתק את חיבור היומן בכל עת מתוך המערכת, או דרך <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">הגדרות ההרשאות בחשבון Google</a>.</p>

  <h2>יצירת קשר</h2>
  <p>לשאלות בנושא פרטיות: <a href="mailto:eligigi3@gmail.com">eligigi3@gmail.com</a></p>

  <h2>שינויים במדיניות</h2>
  <p>אנו עשויים לעדכן מדיניות זו מעת לעת. הנוסח העדכני יפורסם בעמוד זה.</p>
</div>
</body>
</html>`;
}
