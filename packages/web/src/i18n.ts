import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      app: {
        title: "Film SaaS",
        dashboard: "Dashboard",
        login: "Login",
        register: "Register",
        editor: "Script Editor",
        projects: "My Projects",
        newProject: "New Project",
        logout: "Logout",
        settings: "Settings",
        language: "Language",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        rtl: "RTL",
        ltr: "LTR",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        noProjects: "No projects yet",
        createFirst: "Create your first project",
      },
      editor: {
        left: "Left",
        center: "Center",
        right: "Right",
        sceneHeading: "Scene Heading",
        action: "Action",
        character: "Character",
        dialogue: "Dialogue",
        parenthetical: "Parenthetical",
        transition: "Transition",
        exportJSON: "Export JSON",
        exportFountain: "Export Fountain",
        importFile: "Import",
      },
    },
  },
  ar: {
    translation: {
      app: {
        title: "فيلم ساس",
        dashboard: "لوحة القيادة",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        editor: "محرر السيناريو",
        projects: "مشاريعي",
        newProject: "مشروع جديد",
        logout: "تسجيل الخروج",
        settings: "الإعدادات",
        language: "اللغة",
        theme: "المظهر",
        dark: "داكن",
        light: "فاتح",
        rtl: "من اليمين لليسار",
        ltr: "من اليسار لليمين",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تعديل",
        noProjects: "لا توجد مشاريع بعد",
        createFirst: "أنشئ أول مشروع لك",
      },
      editor: {
        left: "يسار",
        center: "وسط",
        right: "يمين",
        sceneHeading: "عنوان المشهد",
        action: "فعل",
        character: "شخصية",
        dialogue: "حوار",
        parenthetical: "بين قوسين",
        transition: "انتقال",
        exportJSON: "تصدير JSON",
        exportFountain: "تصدير Fountain",
        importFile: "استيراد",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
