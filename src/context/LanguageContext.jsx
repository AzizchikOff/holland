import { createContext, useContext, useEffect, useState } from "react";
const translations = {
 uz: {home:"Bosh sahifa",menu:"Menyu",about:"Biz haqimizda",contact:"Aloqa",cart:"Savat",all:"Barchasi",choose:"Kategoriyani tanlang va mahsulotlarni savatga qo‘şing.",details:"Tavsif va tarkibni ko‘riş",add:"Savatga qo‘şiş",description:"Mahsulot haqida",ingredients:"Tarkibi",pending:"Aniq tarkib restoran tomonidan tasdiqlanişi kutilmoqda.",close:"Yopiş"},
 ru: {home:"Главная",menu:"Меню",about:"О нас",contact:"Контакты",cart:"Корзина",all:"Все",choose:"Выберите категорию и добавьте товары в корзину.",details:"Описание и состав",add:"В корзину",description:"Описание",ingredients:"Состав",pending:"Точный состав ожидает подтверждения ресторана.",close:"Закрыть"},
 en: {home:"Home",menu:"Menu",about:"About us",contact:"Contact",cart:"Cart",all:"All",choose:"Choose a category and add items to your cart.",details:"Description & ingredients",add:"Add to cart",description:"Description",ingredients:"Ingredients",pending:"Exact ingredients are awaiting restaurant confirmation.",close:"Close"},
 tr: {home:"Ana sayfa",menu:"Menü",about:"Hakkımızda",contact:"İletişim",cart:"Sepet",all:"Tümü",choose:"Bir kategori seçin ve ürünleri sepetinize ekleyin.",details:"Açıklama ve içerik",add:"Sepete ekle",description:"Açıklama",ingredients:"İçindekiler",pending:"Kesin içerik restoran onayı bekliyor.",close:"Kapat"}
};
const LanguageContext=createContext(null);
export function LanguageProvider({children}){
 const [lang,setLang]=useState(()=>{try{return ["uz","ru","en","tr"].includes(localStorage.getItem("holland_lang"))?localStorage.getItem("holland_lang"):"uz";}catch{return "uz";}});
 useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem("holland_lang",lang);}catch{}},[lang]);
 return <LanguageContext.Provider value={{lang,setLang,t:(key)=>translations[lang][key]||translations.uz[key]||key}}>{children}</LanguageContext.Provider>;
}
export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error("LanguageProvider missing");return context;}
