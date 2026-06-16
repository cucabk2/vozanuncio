import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loading = false;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loading) {
    // wait until it's ready
    await new Promise<void>((res) => {
      const check = setInterval(() => {
        if (ffmpegInstance) { clearInterval(check); res(); }
      }, 100);
    });
    return ffmpegInstance!;
  }
  loading = true;
  const ffmpeg = new FFmpeg();
  // Single-threaded core — no SharedArrayBuffer / COOP-COEP needed
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  ffmpegInstance = ffmpeg;
  loading = false;
  return ffmpeg;
}

export async function webmToMp4(
  webmBlob: Blob,
  onProgress?: (ratio: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  ffmpeg.on("progress", ({ progress }) => onProgress?.(progress));
  await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));
  // remux only (copy streams) — fast, no re-encode quality loss
  await ffmpeg.exec(["-i", "input.webm", "-c", "copy", "-movflags", "+faststart", "output.mp4"]);
  const data = await ffmpeg.readFile("output.mp4");
  await ffmpeg.deleteFile("input.webm");
  await ffmpeg.deleteFile("output.mp4");
  // FileData = Uint8Array | string; binary output is always Uint8Array
  const u8 = (data as unknown) as Uint8Array;
  const copy = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
  return new Blob([copy], { type: "video/mp4" });
}
