import React from "react";
import { Regie } from "./regie/Regie";
import * as Kurz from "./plaene/demo-short";
import * as Lang from "./plaene/demo-lang";

// Vorführung des Regie-Systems in beiden Formaten
export const REGIE_DEMO_SHORT_SEK = Kurz.INFO.ende;
export const REGIE_DEMO_LANG_SEK = Lang.INFO.ende;
export const RegieDemoShort: React.FC = () => <Regie plan={Kurz.PLAN} />;
export const RegieDemoLang: React.FC = () => <Regie plan={Lang.PLAN} />;
