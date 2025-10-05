import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

type Props = {
  /** Called whenever the signature changes (PNG as data URL) or becomes empty (null) */
  onChange?: (png: string | null) => void;
  /** Canvas height in px (width is responsive to container) */
  height?: number;
  penColor?: string;
  className?: string; // container className
};

/** Helper: trim transparent whitespace around a drawn signature */
function trimCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const { data } = imgData;

  let top = 0, bottom = height - 1, left = 0, right = width - 1;
  let found = false;

  // top
  for (let y = 0; y < height && !found; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] !== 0) { top = y; found = true; break; }
    }
  }
  // bottom
  found = false;
  for (let y = height - 1; y >= 0 && !found; y--) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] !== 0) { bottom = y; found = true; break; }
    }
  }
  // left
  found = false;
  for (let x = 0; x < width && !found; x++) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + x) * 4 + 3] !== 0) { left = x; found = true; break; }
    }
  }
  // right
  found = false;
  for (let x = width - 1; x >= 0 && !found; x--) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + x) * 4 + 3] !== 0) { right = x; found = true; break; }
    }
  }

  const trimmedW = Math.max(1, right - left + 1);
  const trimmedH = Math.max(1, bottom - top + 1);

  const copy = document.createElement("canvas");
  copy.width = trimmedW;
  copy.height = trimmedH;
  const copyCtx = copy.getContext("2d")!;
  copyCtx.drawImage(canvas, left, top, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);
  return copy;
}

export default function SigningPad({
  onChange,
  height = 200,
  penColor = "black",
  className = ""
}: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);

  // Make the canvas width responsive to the container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Emit PNG on end of stroke; emit null if cleared/empty
  const emitPng = () => {
    const inst = sigRef.current;
    if (!inst || inst.isEmpty()) {
      onChange?.(null);
      return;
    }
    const baseCanvas = inst.getCanvas(); // avoids getTrimmedCanvas bug
    const trimmed = trimCanvas(baseCanvas);
    const png = trimmed.toDataURL("image/png");
    onChange?.(png);
  };

  const clear = () => {
    sigRef.current?.clear();
    onChange?.(null);
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Sign below:</span>
        <button
          type="button"
          onClick={clear}
          className="px-2 py-1 text-sm rounded border"
        >
          Clear
        </button>
      </div>

      <SignatureCanvas
        ref={sigRef}
        penColor={penColor}
        onEnd={emitPng}
        canvasProps={{
          width: canvasWidth || 1, // avoid 0 width before measure
          height,
          className: "border rounded bg-white w-full",
        }}
      />
    </div>
  );
}