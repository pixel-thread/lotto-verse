import { NextResponse } from "next/server";
import { readFile, readdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");

    // List all files in public directory
    const files = await readdir(publicDir);
    console.log("Files in public:", files);

    // Find the first .apk file
    const apkFile = files.find((file) => file.endsWith(".apk"));

    if (!apkFile) {
      return NextResponse.json(
        {
          error: "No APK file found",
          availableFiles: files,
        },
        { status: 404 },
      );
    }

    const filePath = path.join(publicDir, apkFile);
    console.log("Found APK at:", filePath);

    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${apkFile}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      {
        error: "Download failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
