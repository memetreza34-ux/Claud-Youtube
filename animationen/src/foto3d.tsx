import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { continueRender, delayRender, Easing, interpolate, staticFile } from "remotion";
import { useFlaeche } from "./format";

// 2,5D-Foto: Ein flaches Foto wird mit seiner Tiefenkarte (tools/tiefe.sh) zur räumlichen Fläche,
// eine echte 3D-Kamera fährt hinein. Optional steht ein freigestelltes Motiv (tools/freistellen.sh,
// z. B. die Figur) als eigene Ebene davor und bewegt sich stärker – echte Parallaxe.

export type Foto3DBewegung = "rein" | "raus" | "links" | "rechts" | "hoch" | "kreisen";
export type Foto3DVorne = { bild: string; hoehe: number; x?: number; y?: number }; // hoehe/x/y relativ zur Bildfläche (0..1), y = Unterkante

const VERT = `
uniform sampler2D tiefe;
uniform float staerke;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  p.z += texture2D(tiefe, uv).r * staerke;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const FRAG = `
uniform sampler2D bild;
uniform float hell;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(bild, vUv);
  gl_FragColor = vec4(c.rgb * hell, c.a);
}`;

const FOV = 40;

// Texturen über useTexture (Suspense): <ThreeCanvas> wartet damit schon beim ersten Bild, bis alles geladen ist
const Inhalt: React.FC<{ t: number; bildSrc: string; tiefeSrc: string; vorneV?: Foto3DVorne; bewegung: Foto3DBewegung; staerke: number; hell: number; fokus: [number, number]; bereit: () => void }> = ({ t, bildSrc, tiefeSrc, vorneV, bewegung, staerke, hell, fokus, bereit }) => {
  const quellen = [bildSrc, tiefeSrc, ...(vorneV ? [staticFile(vorneV.bild)] : [])];
  const tex = useTexture(quellen) as THREE.Texture[];
  tex.forEach((t2, i) => {
    t2.colorSpace = i === 2 ? THREE.SRGBColorSpace : THREE.NoColorSpace; // Foto/Tiefe roh für den eigenen Shader
    t2.minFilter = THREE.LinearFilter;
    t2.generateMipmaps = false;
  });
  const [bild, tiefe] = tex;
  const vorne = vorneV ? { tex: tex[2], v: vorneV } : undefined;
  const { camera, size, advance } = useThree();
  // Beim Rendern zeichnet R3F nur bei Bildwechseln, im ersten Bild eines Render-Tabs kommen die Texturen
  // aber erst danach an → nach dem Laden selbst zeichnen und dann die Sperre von außen (Foto3D) lösen.
  React.useLayoutEffect(() => {
    if (size.width > 0 && size.height > 0) {
      advance(performance.now());
      bereit();
    }
  }, [size.width, size.height, advance, bereit]);
  const img = bild.image as { width: number; height: number };
  const a = img.width / img.height;
  const sa = size.width / size.height;
  // Ebene so groß, dass sie den Bildschirm im Abstand 1 mit Rand zum Bewegen füllt
  const vh = 2 * Math.tan(((FOV / 2) * Math.PI) / 180);
  const vw = vh * sa;
  const rand = 1.32;
  const PW = Math.max(vw, vh * a) * rand;
  const PH = PW / a;
  const tiefeZ = staerke * PH; // wie weit nahe Teile nach vorn kommen
  // Bildausschnitt: der Fokuspunkt (0..1 im Foto) rückt in die Bildmitte, ohne dass Ränder sichtbar werden
  const spielX = Math.max(0, (PW - vw * 1.12) / 2);
  const spielY = Math.max(0, (PH - vh * 1.12) / 2);
  const versatzX = Math.max(-spielX, Math.min(spielX, -(fokus[0] - 0.5) * PW));
  const versatzY = Math.max(-spielY, Math.min(spielY, (fokus[1] - 0.5) * PH));

  const e = Easing.bezier(0.45, 0, 0.25, 1)(Math.min(1, Math.max(0, t)));
  const weg = 0.06 * PW;
  const pos: [number, number, number] =
    bewegung === "rein" ? [0.02 * PW * e, 0, interpolate(e, [0, 1], [1, 0.8])]
    : bewegung === "raus" ? [0, 0, interpolate(e, [0, 1], [0.8, 1])]
    : bewegung === "links" ? [interpolate(e, [0, 1], [weg, -weg]), 0, 0.95]
    : bewegung === "rechts" ? [interpolate(e, [0, 1], [-weg, weg]), 0, 0.95]
    : bewegung === "hoch" ? [0, interpolate(e, [0, 1], [-weg, weg]) / a, 0.95]
    : [Math.sin(e * Math.PI) * weg * 0.8, Math.cos(e * Math.PI) * weg * 0.3, interpolate(e, [0, 1], [1, 0.88])];
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = FOV;
  if (size.height > 0) cam.aspect = size.width / size.height;
  cam.near = 0.01;
  cam.far = 10;
  cam.position.set(pos[0], pos[1], pos[2]);
  cam.lookAt(pos[0] * 0.4, pos[1] * 0.4, -1); // fast geradeaus: maximale Parallaxe
  cam.updateProjectionMatrix();

  const uni = React.useMemo(() => ({ bild: { value: bild }, tiefe: { value: tiefe }, staerke: { value: tiefeZ }, hell: { value: hell } }), [bild, tiefe, tiefeZ, hell]);

  let vorneMesh: React.ReactNode = null;
  if (vorne) {
    const vi = vorne.tex.image as { width: number; height: number };
    const zf = 0.4; // Ebene des Vordergrunds, deutlich vor dem Foto
    const d = 0.95 - zf; // Abstand zur Kamera in Grundstellung
    const h = vorne.v.hoehe * vh * d;
    const w = h * (vi.width / vi.height);
    const x = ((vorne.v.x ?? 0.5) - 0.5) * vw * d;
    const yUnten = -((vorne.v.y ?? 1) - 0.5) * vh * d;
    vorneMesh = (
      <mesh position={[x, yUnten + h / 2, zf]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={vorne.tex} transparent toneMapped={false} />
      </mesh>
    );
  }

  return (
    <>
      <mesh position={[versatzX, versatzY, 0]}>
        <planeGeometry args={[PW, PH, 320, Math.round(320 / a)]} />
        <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uni} />
      </mesh>
      {vorneMesh}
    </>
  );
};

export const Foto3D: React.FC<{ s: number; ab: number; bis: number; bild: string; tiefe: string; bewegung?: Foto3DBewegung; staerke?: number; hell?: number; vorne?: Foto3DVorne; fokus?: [number, number] }> = ({ s, ab, bis, bild, tiefe, bewegung = "rein", staerke = 0.22, hell = 1, vorne, fokus = [0.5, 0.5] }) => {
  const { W, H } = useFlaeche();
  const t = (s - ab) / Math.max(0.1, bis - ab);
  // Sperre im Commit anlegen (nie in einem Render, den React verwerfen könnte), lösen, sobald gezeichnet ist
  const sperre = React.useRef<number | null>(null);
  React.useLayoutEffect(() => {
    sperre.current = delayRender("Foto3D: erstes Bild zeichnen");
    return () => {
      if (sperre.current !== null) continueRender(sperre.current);
      sperre.current = null;
    };
  }, []);
  const bereit = React.useCallback(() => {
    if (sperre.current !== null) {
      continueRender(sperre.current);
      sperre.current = null;
    }
  }, []);
  return (
    <ThreeCanvas width={W} height={H} style={{ background: "#050506" }} gl={{ antialias: true }}>
      <React.Suspense fallback={null}>
        <Inhalt t={t} bildSrc={staticFile(bild)} tiefeSrc={staticFile(tiefe)} vorneV={vorne} bewegung={bewegung} staerke={staerke} hell={hell} fokus={fokus} bereit={bereit} />
      </React.Suspense>
    </ThreeCanvas>
  );
};
