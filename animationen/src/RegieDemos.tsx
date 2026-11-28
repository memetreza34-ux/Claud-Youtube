import React from "react";
import { Regie } from "./regie/Regie";
import * as Kurz from "./plaene/demo-short";
import * as Lang from "./plaene/demo-lang";
import * as Memes from "./plaene/demo-memes";
import * as Foto from "./plaene/demo-foto3d";

// Vorführung des Regie-Systems in beiden Formaten
export const REGIE_DEMO_SHORT_SEK = Kurz.INFO.ende;
export const REGIE_DEMO_LANG_SEK = Lang.INFO.ende;
export const RegieDemoShort: React.FC = () => <Regie plan={Kurz.PLAN} />;
export const RegieDemoLang: React.FC = () => <Regie plan={Lang.PLAN} />;
export const MEME_DEMO_SEK = Memes.INFO.ende;
export const MemeDemo: React.FC = () => <Regie plan={Memes.PLAN} />;
export const FOTO3D_DEMO_SEK = Foto.INFO.ende;
export const Foto3DDemo: React.FC = () => <Regie plan={Foto.PLAN} />;
