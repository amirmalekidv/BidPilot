# BidPilot

دستیار هوشمند بید برای Freelancer.com — رابط فارسی RTL با خروجی تحلیل و استراتژی به فارسی و پروپوزال به انگلیسی.

## راه‌اندازی

```bash
npm install
cp .env.example .env
# کلید API و مدل را در .env تنظیم کنید
npm run dev
```

## تنظیمات

| فایل | توضیح |
|------|--------|
| `.env` | `VITE_API_PROVIDER` (`openai` یا `deepseek`)، کلید API، و `VITE_MODEL` |
| `src/config/api.js` | مقادیر پیش‌فرض API (از env خوانده می‌شود) |
| `src/config/prompts.js` | سه پرامپت قابل ویرایش |

## جریان کار

1. paste توضیحات پروژه
2. تحلیل پروژه (فارسی + نمره ۱–۱۰)
3. استراتژی بید (فارسی)
4. تأیید نوشتن پروپوزال
5. پروپوزال انگلیسی با دکمه کپی

## نکته امنیتی

کلید API از طریق proxy سرور Vite به OpenAI ارسال می‌شود و در مرورگر expose نمی‌شود. فایل `.env` در gitignore است.
