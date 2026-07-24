import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  console.error("[DEBUG PROSHOT API] ===== POST /api/generate requested =====");

  try {
    // 1. FAL_KEY 검증
    const userFalKey = request.headers.get("x-fal-key");
    const targetFalKey = userFalKey || process.env.FAL_KEY;

    console.error(
      `[DEBUG PROSHOT API] FAL_KEY source: ${
        userFalKey ? "x-fal-key Header (BYOK)" : "process.env.FAL_KEY"
      }, Key present: ${Boolean(targetFalKey)}, Length: ${targetFalKey?.length || 0}`
    );

    if (!targetFalKey || targetFalKey === "your_fal_api_key_here") {
      console.error("[DEBUG PROSHOT API ERROR] FAL_KEY is missing or template default!");
      return NextResponse.json(
        { error: ".env.local 파일 또는 API 키 설정에 실제 fal.ai API 키를 입력해 주세요." },
        { status: 401 }
      );
    }

    // 2. fal.ai SDK credentials 설정
    const cleanedKey = targetFalKey.trim();
    fal.config({
      credentials: cleanedKey,
    });

    const body = await request.json();
    const { imageBase64, style } = body;

    console.error(
      `[DEBUG PROSHOT API] Style requested: '${style}', Base64 input length: ${imageBase64?.length || 0}`
    );

    if (!imageBase64 || typeof imageBase64 !== "string") {
      console.error("[DEBUG PROSHOT API ERROR] Invalid base64 image input");
      return NextResponse.json(
        { error: "유효한 셀카 이미지 데이터(base64)가 필요합니다." },
        { status: 400 }
      );
    }

    // 3. Base64 prefix 제거 (data:image/...;base64, 제거 및 순수 base64 추출)
    const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "").trim();
    const imageBuffer = Buffer.from(base64Clean, "base64");

    console.error(`[DEBUG PROSHOT API] Converted to Buffer length: ${imageBuffer.length} bytes`);

    if (imageBuffer.length === 0) {
      console.error("[DEBUG PROSHOT API ERROR] Buffer size is 0 bytes");
      return NextResponse.json(
        { error: "이미지 데이터 변환에 실패했습니다." },
        { status: 400 }
      );
    }

    // 4. Node.js 호환 File 객체 생성 후 fal.storage.upload 전달
    console.error("[DEBUG PROSHOT API] Uploading reference image to fal storage...");
    const selfieFile = new File([imageBuffer], "selfie.jpg", { type: "image/jpeg" });
    const reference_image_url = await fal.storage.upload(selfieFile);

    console.error(`[DEBUG PROSHOT API] Reference image uploaded URL: ${reference_image_url}`);

    if (!reference_image_url) {
      console.error("[DEBUG PROSHOT API ERROR] fal.storage.upload returned null/undefined");
      return NextResponse.json(
        { error: "이미지 업로드 저장소 연결에 실패했습니다." },
        { status: 500 }
      );
    }

    // 5. 스타일 매핑
    let prompt =
      "High quality professional business headshot of a person, modern professional attire, neutral studio background, crisp studio lighting, sharp focus, 8k portrait photo";

    if (style === "corporate") {
      prompt =
        "High quality professional corporate business headshot of a person wearing a sharp modern blazer, professional studio lighting, neutral background, 8k portrait photo";
    } else if (style === "studio") {
      prompt =
        "Clean minimalist studio portrait headshot of a person, softbox studio lighting, solid light gray backdrop, professional headshot photo, highly detailed face";
    } else if (style === "outdoor") {
      prompt =
        "Natural outdoor professional profile portrait headshot of a person, soft golden hour natural sunlight, elegant blurred background bokeh, professional photo";
    }

    console.error(`[DEBUG PROSHOT API] Subscribing to fal-ai/flux-pulid model...`);

    // 6. fal-ai/flux-pulid 파이프라인 수신
    const result: any = await fal.subscribe("fal-ai/flux-pulid", {
      input: {
        prompt,
        reference_image_url,
        image_size: "portrait_4_3",
        num_inference_steps: 20,
        guidance_scale: 4,
        id_weight: 1,
        negative_prompt: "blurry, low quality, distorted face, watermark, text",
      },
    });

    const generatedImageUrl = result?.data?.images?.[0]?.url;
    console.error(`[DEBUG PROSHOT API SUCCESS] Generated image URL: ${generatedImageUrl}`);

    if (!generatedImageUrl) {
      console.error("[DEBUG PROSHOT API ERROR] Result data contains no images array or URL");
      return NextResponse.json(
        { error: "AI 헤드샷 이미지 생성 결과가 올바르지 않습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: generatedImageUrl });
  } catch (err: any) {
    const errorMsg = String(err?.message || err || "Unknown error");
    const stack = String(err?.stack || "");
    console.error("[DEBUG PROSHOT API CATCH ERROR]", errorMsg);
    console.error("[DEBUG PROSHOT API STACK]", stack);

    // 401 Unauthorized: API 키 오류
    if (
      errorMsg.includes("Unauthorized") ||
      errorMsg.includes("401") ||
      errorMsg.includes("Invalid key")
    ) {
      return NextResponse.json(
        {
          error:
            "API 키가 올바르지 않습니다 (Unauthorized). 키 오타를 확인하거나 'API 키 삭제' 후 다시 시도해 주세요.",
        },
        { status: 401 }
      );
    }

    // 403 Forbidden / Payment Required: 잔액(Credits) 부족
    if (
      errorMsg.includes("Forbidden") ||
      errorMsg.includes("403") ||
      errorMsg.includes("Payment") ||
      errorMsg.includes("credit")
    ) {
      return NextResponse.json(
        {
          error:
            "fal.ai 계정의 크레딧(잔액)이 부족하거나 이용이 제한되었습니다 (Forbidden). fal.ai 대시보드에서 잔액을 확인해 주세요.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: `AI 헤드샷 생성 중 오류 발생: ${errorMsg.slice(0, 100)}` },
      { status: 500 }
    );
  }
}
