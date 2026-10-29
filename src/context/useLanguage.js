import { useContext } from "react";
import { LanguageContext } from "./LanguageContextValue.js";

export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error("LanguageProvider missing");return context;}
