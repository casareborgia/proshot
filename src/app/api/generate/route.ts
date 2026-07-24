import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    // 클라이언트가 전달한 사용자 개인 fal.ai API 키 (BYOK) 헤더 확인
    const userFalKey = request.headers.get("x-fal-key");

    // 우선순위: 클라이언트 BYOK 키 > 서버 공용 FAL_KEY 환경변수
    const targetFalKey = userFalKey || process.env.FAL_KEY;

    if (!targetFalKey || targetFalKey === "your_fal_api_key_here") {
      return NextResponse.json(
        { error: ".env.local 파일 또는 API 키 설정에 실제 fal.ai API 키를 입력해 주세요." },
        { status: 401 }
      );
    }

    // fal.ai SDK 설정
    fal.config({
      credentials: targetFalKey.trim(),
    });

    const body = await request.json();
    const { imageBase64, style } = body;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "유효한 셀카 이미지 데이터(base64)가 필요합니다." },
        { status: 400 }
      );
    }

    // base64 prefix 제거
    const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Clean, "base64");

    if (imageBuffer.length === 0) {
      return NextResponse.json(
        { error: "이미지 데이터 변환에 실패했습니다." },
        { status: 400 }
      );
    }

    // Buffer를 Blob(image/jpeg)으로 전환하여 fal.storage.upload에 전달
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });
    const reference_image_url = await fal.storage.upload(imageBlob);

    if (!reference_image_url) {
      return NextResponse.json(
        { error: "이미지 업로드 저장소 연결에 실패했습니다." },
        { status: 500 }
      );
    }

    // 스타일 파라미터를 영문 프롬프트로 매핑
    let prompt = "High quality professional business headshot of a person, modern professional attire, neutral studio background, crisp studio lighting, sharp focus, 8k portrait photo";
    
    if (style === "corporate") {
      prompt = "High quality professional corporate business headshot of a person wearing a sharp modern blazer, professional studio lighting, neutral background, 8k portrait photo";
    } else if (style === "studio") {
      prompt = "Clean minimalist studio portrait headshot of a person, softbox studio lighting, solid light gray backdrop, professional headshot photo, highly detailed face";
    } else if (style === "outdoor") {
      prompt = "Natural outdoor professional profile portrait headshot of a person, soft golden hour natural sunlight, elegant blurred background bokeh, professional photo";
    }

    // fal-ai/flux-pulid 구독 호출
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

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: "AI 헤드샷 이미지 생성 결과가 올바르지 않습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: generatedImageUrl });
  } catch (err: any) {
    const errorMsg = String(err?.message || err || "");
    console.error("AI Generation Server Error Details:", errorMsg);

    // 401 Unauthorized: API 키 오류
    if (errorMsg.includes("Unauthorized") || errorMsg.includes("401") || errorMsg.includes("Invalid key")) {
      return NextResponse.json(
        { error: "API 키가 올바르지 않습니다 (Unauthorized). 키 오타를 확인하거나 'API 키 삭제' 후 다시 시도해 주세요." },
        { status: 401 }
      );
    }

    // 403 Forbidden / Payment Required: 잔액(Credits) 부족
    if (errorMsg.includes("Forbidden") || errorMsg.includes("403") || errorMsg.includes("Payment") || errorMsg.includes("credit")) {
      return NextResponse.json(
        { error: "fal.ai 계정의 크레딧(잔액)이 부족하거나 이용이 제한되었습니다 (Forbidden). fal.ai 대시보드에서 잔액을 확인해 주세요." },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: `AI 헤드샷 생성 실패: ${errorMsg.slice(0, 100)}` },
      { status: 500 }
    );
  }
}
