export interface PrintMaterialInfo {
  name: string;
  feelTexture: string;
  finish: string;
  printingMethod: string;
  colourContrast: string;
  framingDisplay: string;
  shippingFormat: string;
  bestSuitedFor: string;
}

export const printMaterialFulfilmentNote =
  "All paper prints ship rolled and ready to frame. Eco Canvas arrives stretched with built-in hanging hardware.";

export const printMaterials: PrintMaterialInfo[] = [
  {
    name: "Eco Canvas",
    feelTexture:
      "A 38mm stretched canvas print on 330gsm satin-finish canvas made from recycled plastic bottles.",
    finish: "Satin canvas finish.",
    printingMethod: "Printed with water-based latex inks / UVgel.",
    colourContrast:
      "A canvas look with gentle sheen and strong display presence.",
    framingDisplay:
      "Arrives stretched over a recycled frame with built-in hanging hardware, so it is ready to hang.",
    shippingFormat:
      "Ships flat in rigid recycled cardboard boxes, not rolled.",
    bestSuitedFor:
      "Vegan-friendly, ready-to-hang wall art made from 100% recycled canvas and cardboard.",
  },
  {
    name: "Enhanced Matte Art Paper",
    feelTexture: "A natural white 200gsm fine art paper with a smooth texture.",
    finish: "Matte, low-glare finish.",
    printingMethod: "Giclee fine art print using pigment-based archival inks.",
    colourContrast:
      "Soft, low-glare colour with a clean matte look for detailed artwork.",
    framingDisplay: "Ships ready to frame.",
    shippingFormat:
      "Generally ships rolled for OpenEire's selected sizes.",
    bestSuitedFor: "Photography, bold graphics and illustrations.",
  },
  {
    name: "Hahnemuhle Photo Rag",
    feelTexture:
      "A vegan-certified 308gsm fine art photo paper made from 100% cotton rag, with a soft, lightly defined felt structure.",
    finish: "Natural white matte finish.",
    printingMethod: "Giclee fine art photo print.",
    colourContrast:
      "Excellent black saturation with a refined, museum-grade feel.",
    framingDisplay: "Ships ready to frame.",
    shippingFormat:
      "Generally ships rolled for OpenEire's selected sizes.",
    bestSuitedFor:
      "Fine art photography, refined editions and images that benefit from deep blacks on a matte surface.",
  },
  {
    name: "Lustre Photo Paper",
    feelTexture:
      "A bright white 240gsm photo paper with a subtle pearl-like texture.",
    finish: "Satin finish.",
    printingMethod: "Giclee fine art photo print.",
    colourContrast:
      "Deeper colour saturation than matte photo prints, with intense blacks and crisp detail.",
    framingDisplay: "Ships ready to frame.",
    shippingFormat:
      "Generally ships rolled for OpenEire's selected sizes.",
    bestSuitedFor: "Dramatic landscapes and photographic prints.",
  },
];
