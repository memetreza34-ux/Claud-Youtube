// Freistellen mit macOS Vision (wie „Motiv anheben“ in Fotos) – lokal, ohne Modell-Download.
//   tools/freistellen.sh <bild> <ziel.png> [--zuschneiden]
// Ergebnis: PNG mit transparentem Hintergrund (Objekt einzeln animierbar).
import AppKit
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
  FileHandle.standardError.write("Aufruf: freistellen <bild> <ziel.png> [--zuschneiden]\n".data(using: .utf8)!)
  exit(2)
}
let quelle = URL(fileURLWithPath: args[1])
let ziel = URL(fileURLWithPath: args[2])
let zuschneiden = args.contains("--zuschneiden")

guard let ci = CIImage(contentsOf: quelle) else {
  FileHandle.standardError.write("Bild nicht lesbar: \(quelle.path)\n".data(using: .utf8)!)
  exit(1)
}
let handler = VNImageRequestHandler(ciImage: ci)
let anfrage = VNGenerateForegroundInstanceMaskRequest()
do {
  try handler.perform([anfrage])
  guard let ergebnis = anfrage.results?.first, !ergebnis.allInstances.isEmpty else {
    FileHandle.standardError.write("Kein Motiv gefunden.\n".data(using: .utf8)!)
    exit(3)
  }
  let puffer = try ergebnis.generateMaskedImage(ofInstances: ergebnis.allInstances, from: handler, croppedToInstancesExtent: zuschneiden)
  let bild = CIImage(cvPixelBuffer: puffer)
  let kontext = CIContext()
  try kontext.writePNGRepresentation(of: bild, to: ziel, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  print("\(ziel.path)  (\(ergebnis.allInstances.count) Motiv(e))")
} catch {
  FileHandle.standardError.write("Fehler: \(error)\n".data(using: .utf8)!)
  exit(1)
}
