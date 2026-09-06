import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALE_STORAGE_KEY, resolveLocale, type Locale } from "@/lib/locale";
export type { Locale } from "@/lib/locale";

const id = {
  "Primary navigation": "Navigasi utama",
  Home: "Beranda",
  Practice: "Latihan",
  Progress: "Progres",
  League: "Liga",
  "Daily forge": "Tempa harian",
  "Build a drill": "Buat latihan",
  "2 minute warm-up": "Pemanasan 2 menit",
  "Forge faster math, one answer at a time.": "Asah matematika, satu jawaban setiap kali.",
  "Pip has a fresh gear ready. Build accuracy first—speed will follow.":
    "Pip sudah menyiapkan roda gigi baru. Utamakan ketepatan—kecepatan akan mengikuti.",
  "Start quick practice": "Mulai latihan cepat",
  Subject: "Subjek",
  Arithmetic: "Aritmetika",
  Algebra: "Aljabar",
  Operation: "Operasi",
  Multiply: "Perkalian",
  "Times tables": "Tabel perkalian",
  Add: "Penjumlahan",
  Sums: "Penjumlahan",
  Subtract: "Pengurangan",
  Differences: "Selisih",
  Divide: "Pembagian",
  "Exact quotients": "Hasil bagi tepat",
  Mix: "Campuran",
  "All four": "Semua operasi",
  "Table focus": "Fokus tabel",
  All: "Semua",
  Mode: "Mode",
  Sprint: "Sprint",
  Streak: "Beruntun",
  "60 seconds": "60 detik",
  "3 misses and out": "3 kesalahan lalu selesai",
  "20 problems": "20 soal",
  Range: "Tingkat",
  Easy: "Mudah",
  Medium: "Sedang",
  Hard: "Sulit",
  "0–10": "0–10",
  "to 12": "hingga 12",
  "bigger numbers": "angka lebih besar",
  "Start drill": "Mulai latihan",
  "Quick warm-up": "Pemanasan cepat",
  "Daily streak": "Rangkaian harian",
  "Practiced today": "Sudah latihan hari ini.",
  "Finish one answer today to light your streak.": "Jawab satu soal hari ini untuk menyalakan rangkaianmu.",
  Answered: "Dijawab",
  Accuracy: "Akurasi",
  "Best streak": "Rangkaian terbaik",
  "View progress": "Lihat progres",
  "View leaderboard": "Lihat papan peringkat",
  "Open profile": "Buka profil",
  Unmute: "Aktifkan suara",
  Mute: "Bisukan",
  "Close profile": "Tutup profil",
  Legal: "Legal",
  "Privacy Policy": "Kebijakan Privasi",
  Terms: "Ketentuan",
  "Cloud smith": "Smith cloud",
  "Guest smith": "Smith tamu",
  "Display name": "Nama tampilan",
  Save: "Simpan",
  Restore: "Pulihkan",
  "Progress saved to your account.": "Progres tersimpan ke akunmu.",
  "Cloud progress restored.": "Progres cloud berhasil dipulihkan.",
  "No cloud save yet.": "Belum ada simpanan cloud.",
  "Sync failed. Please try again.": "Sinkronisasi gagal. Coba lagi.",
  "Saved on this device": "Tersimpan di perangkat ini",
  "Keep playing as a guest, or connect to protect your progress.":
    "Lanjutkan sebagai tamu, atau hubungkan akun untuk melindungi progresmu.",
  "Save across devices": "Simpan lintas perangkat",
  Language: "Bahasa",
  "Change language": "Ganti bahasa",
  Appearance: "Tampilan",
  "Choose light or dark mode": "Pilih mode terang atau gelap",
  English: "English",
  Indonesian: "Bahasa Indonesia",
  Back: "Kembali",
  "Weekly league": "Liga mingguan",
  Leaderboard: "Papan peringkat",
  "Loading leaderboard": "Memuat papan peringkat",
  "Leaderboard unavailable.": "Papan peringkat tidak tersedia.",
  "Your local practice still works.": "Latihan lokalmu tetap dapat digunakan.",
  "The podium is open": "Podium masih terbuka",
  "Be the first verified smith this week.": "Jadilah smith terverifikasi pertama minggu ini.",
  "Guests can view the league.": "Tamu dapat melihat liga.",
  "Sign in": "Masuk",
  "to submit verified scores.": "untuk mengirim skor terverifikasi.",
  "Solve for x": "Cari nilai x",
  "Forge the answer": "Tempa jawabannya",
  "Almost. You entered": "Hampir benar. Jawabanmu",
  Score: "Skor",
  Correct: "Benar",
  Missed: "Terlewat",
  "Best combo": "Kombo terbaik",
  "Best ever": "Terbaik",
  "Review these": "Pelajari lagi",
  "Submit verified score": "Kirim skor terverifikasi",
  "Submitting…": "Mengirim…",
  "Sign in to join the leaderboard": "Masuk untuk bergabung ke papan peringkat",
  "Score added to this week's league.": "Skor ditambahkan ke liga minggu ini.",
  "Score could not be submitted.": "Skor tidak dapat dikirim.",
  "Drill again": "Latihan lagi",
  "See progress": "Lihat progres",
  "Change drill": "Ubah latihan",
  "New personal best — the forge is hot!": "Rekor pribadi baru—tempaanmu sedang panas!",
  "Start with a quick warm-up": "Mulai dengan pemanasan cepat",
  "This starts a simple 20-question drill. You can play as a guest right away.":
    "Ini memulai latihan sederhana berisi 20 soal. Kamu bisa langsung bermain sebagai tamu.",
  "Build your own drill": "Buat latihanmu sendiri",
  "Practice lets you choose the subject, operation, difficulty, and play mode.":
    "Latihan memungkinkanmu memilih subjek, operasi, tingkat kesulitan, dan mode bermain.",
  "Try your first drill": "Coba latihan pertamamu",
  "Set up the drill, then press this button. Use the keypad to answer and build your streak.":
    "Atur latihan, lalu tekan tombol ini. Gunakan keypad untuk menjawab dan membangun rangkaian.",
  "See what to forge next": "Lihat apa yang perlu ditempa berikutnya",
  "Progress shows your accuracy, completed problems, and facts that need another round.":
    "Progres menunjukkan akurasi, soal yang selesai, dan materi yang perlu dilatih lagi.",
  "Join the weekly league": "Ikuti liga mingguan",
  "Browse the standings anytime. Sign in only when you want to submit verified scores.":
    "Lihat klasemen kapan saja. Masuk hanya saat ingin mengirim skor terverifikasi.",
  Guide: "Panduan",
  of: "dari",
  "Skip tour": "Lewati panduan",
  Next: "Lanjut",
  Done: "Selesai",
} as const;

export type Message = keyof typeof id;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (message: Message) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Keep the server and first hydration render identical. useLayoutEffect runs
  // before paint, so a saved locale is restored without an English flash.
  const [locale, setLocaleState] = useState<Locale>("en");

  useLayoutEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const next = saved ? resolveLocale(saved) : resolveLocale(window.navigator.language);
    setLocaleState(next);
    applyLocale(next);
  }, []);

  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale(next) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.cookie = `${LOCALE_STORAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      applyLocale(next);
      setLocaleState(next);
    },
    t(message) {
      return locale === "id" ? id[message] : message;
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
