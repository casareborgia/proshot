"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Building2,
  Sun,
  Building,
  Loader2,
  Download,
  RefreshCw,
  Sliders,
  Key,
  ShieldCheck,
  Lock,
  ArrowRight,
} from "lucide-react";

export type ProfileStyle = "corporate" | "studio" | "outdoor";

interface UploadCardProps {
  onGenerateSuccess?: (imageUrl: string) => void;
}

export default function UploadCard({ onGenerateSuccess }: UploadCardProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<ProfileStyle>("corporate");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // 무료 사용 제한 및 BYOK 관리 State
  const [usesCount, setUsesCount] = useState<number>(0);
  const [byokKey, setByokKey] = useState<string>("");
  const [inputByokKey, setInputByokKey] = useState<string>("");
  const [isLimitModalOpen, setIsLimitModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 localStorage 값 동기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUses = parseInt(localStorage.getItem("proshot_uses") || "0", 10);
      setUsesCount(isNaN(storedUses) ? 0 : storedUses);

      const storedByok = localStorage.getItem("proshot_byok") || "";
      setByokKey(storedByok);
      setInputByokKey(storedByok);
    }
  }, []);

  const styleOptions: { id: ProfileStyle; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "corporate",
      label: "비즈니스 정장",
      desc: "링크드인 & 신분증 추천",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "studio",
      label: "스튜디오",
      desc: "깔끔한 화이트 프로필",
      icon: <Building className="w-5 h-5" />,
    },
    {
      id: "outdoor",
      label: "야외 자연광",
      desc: "자연스럽고 화사한 분위기",
      icon: <Sun className="w-5 h-5" />,
    },
  ];

  const handleFileProcess = (file: File) => {
    setError(null);
    setResultImageUrl(null);

    // 이미지 타입 검증
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일(JPG, PNG, WEBP 등)만 업로드 가능합니다.");
      return;
    }

    // 파일 용량 8MB 제한 검증
    const maxSizeBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError("파일 크기는 8MB 이하이어야 합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageBase64(result);
      setFileName(file.name);
    };
    reader.onerror = () => {
      setError("파일을 읽는 중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    setFileName("");
    setError(null);
    setResultImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveByok = () => {
    const trimmed = inputByokKey.trim();
    if (!trimmed) {
      setError("유효한 fal.ai API 키를 입력해 주세요.");
      return;
    }
    localStorage.setItem("proshot_byok", trimmed);
    setByokKey(trimmed);
    setIsLimitModalOpen(false);
    setError(null);
  };

  const handleClearByok = () => {
    localStorage.removeItem("proshot_byok");
    setByokKey("");
    setInputByokKey("");
  };

  const handleGenerateClick = async () => {
    if (!imageBase64 || isLoading) return;

    // BYOK 키가 없는 상태에서 무료 2회 횟수 한도 도달 시 모달 팝업
    if (!byokKey && usesCount >= 2) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (byokKey) {
        headers["x-fal-key"] = byokKey;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageBase64,
          style: selectedStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI 헤드샷 생성에 실패했습니다.");
      }

      if (data?.imageUrl) {
        setResultImageUrl(data.imageUrl);

        if (!byokKey) {
          const nextCount = usesCount + 1;
          setUsesCount(nextCount);
          localStorage.setItem("proshot_uses", String(nextCount));
        }

        if (onGenerateSuccess) {
          onGenerateSuccess(data.imageUrl);
        }
      } else {
        throw new Error("결과 이미지 주소를 받지 못했습니다.");
      }
    } catch (err: any) {
      console.error("Generate error:", err);
      setError(err?.message || "AI 헤드샷 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // PNG 파일으로 고화질 직접 다운로드
  const handleDownloadPng = async () => {
    if (!resultImageUrl) return;
    setIsDownloading(true);
    try {
      const res = await fetch(resultImageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "proshot-headshot.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PNG download failed:", err);
      // Fallback: 새 탭에서 열기
      window.open(resultImageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40 relative">
      {/* 상단 뱃지 및 사용 상태 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-500">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>
            {byokKey ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                개인 API 키(BYOK) 적용됨 • 무제한
              </span>
            ) : (
              <span>
                무료 체험: <strong className="text-indigo-600">{usesCount}</strong> / 2회 사용
              </span>
            )}
          </span>
        </div>

        {byokKey ? (
          <button
            type="button"
            onClick={handleClearByok}
            className="text-slate-400 hover:text-rose-600 transition-colors text-[11px] underline"
          >
            API 키 삭제
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsLimitModalOpen(true)}
            className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Key className="w-3.5 h-3.5" /> API 키 입력
          </button>
        )}
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
          {resultImageUrl ? "AI 헤드샷 비포 & 애프터" : "셀카 사진 업로드"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          {resultImageUrl
            ? "선택한 원본 셀카와 완성된 AI 헤드샷의 차이를 비교해 보세요."
            : "얼굴이 잘 나온 정면 셀카 1장을 선택해 주세요 (최대 8MB)"}
        </p>
      </div>

      {/* 파일 입력 폼 (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
        id="selfie-file-input"
        disabled={isLoading}
      />

      {/* 로딩 스켈레톤 UI (생성 진행 중) */}
      {isLoading && (
        <div className="py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-center animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto mb-6">
            {/* 왼쪽: 원본 썸네일 */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-2">원본</span>
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shadow-sm opacity-80">
                {imageBase64 && (
                  <Image src={imageBase64} alt="원본 셀카" fill className="object-cover" />
                )}
              </div>
            </div>

            {/* 오른쪽: AI 헤드샷 생성 스켈레톤 */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-indigo-600 mb-2">AI 헤드샷</span>
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-slate-100 border-2 border-indigo-300 shadow-md flex flex-col items-center justify-center p-4">
                <div className="w-full h-full absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3 animate-bounce shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-indigo-900">AI 헤드샷 생성 중...</p>
                <p className="text-[11px] text-slate-500 mt-1">조명과 질감을 다듬는 중입니다</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <span>AI가 사진을 만드는 중... (약 10~20초 소요)</span>
          </div>
        </div>
      )}

      {/* 결과 비포 / 애프터 (Before / After) 뷰 */}
      {!isLoading && resultImageUrl && (
        <div className="animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* 왼쪽: 원본 셀카 카드 */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/90 shadow-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 px-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 text-xs font-bold">
                  원본
                </span>
                <span className="text-[11px] text-slate-400">업로드 이미지</span>
              </div>
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300">
                {imageBase64 && (
                  <Image
                    src={imageBase64}
                    alt="원본 셀카"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* 오른쪽: AI 헤드샷 카드 */}
            <div className="rounded-2xl bg-indigo-50/40 p-4 border-2 border-indigo-400/80 shadow-md flex flex-col items-center relative">
              <div className="flex items-center justify-between w-full mb-3 px-1">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" /> AI 헤드샷
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold">ProShot AI</span>
              </div>
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 border border-indigo-300 shadow-sm">
                <Image
                  src={resultImageUrl}
                  alt="AI 헤드샷 결과물"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* 하단 조작 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloading}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>PNG 다운로드</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateClick}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>다시 생성</span>
            </button>

            <button
              type="button"
              onClick={() => setResultImageUrl(null)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-semibold text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>스타일 바꾸기</span>
            </button>
          </div>
        </div>
      )}

      {/* 업로드 & 스타일 설정 폼 (생성 전 및 로딩 전) */}
      {!isLoading && !resultImageUrl && (
        <>
          {/* 이미지 업로드 및 미리보기 영역 */}
          {!imageBase64 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/20"
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                클릭하여 셀카 사진 선택 또는 드래그앤드롭
              </p>
              <p className="text-xs text-slate-400">JPG, PNG, WEBP 지원 (8MB 이내)</p>
            </div>
          ) : (
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-xs">
                <Image
                  src={imageBase64}
                  alt="선택된 셀카 미리보기"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium mb-2">
                  <Check className="w-3.5 h-3.5" /> 셀카 선택 완료
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate mb-1" title={fileName}>
                  {fileName || "선택된 이미지"}
                </p>
                <p className="text-xs text-slate-500 mb-3">AI 변환 준비가 되었습니다.</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" /> 다른 사진으로 변경
                </button>
              </div>
            </div>
          )}

          {/* 에러 메시지 한국어 토스트 */}
          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-400 hover:text-rose-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 스타일 피커 (Style Picker) */}
          <div className="mt-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              프로필 스타일 선택
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {styleOptions.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-2xl p-4 text-left border transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-950 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50"
                    } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {style.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{style.label}</div>
                      <div className="text-[11px] text-slate-500 leading-tight">
                        {style.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 헤드샷 생성 버튼 */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={!imageBase64 || isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                imageBase64 && !isLoading
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>헤드샷 생성</span>
            </button>
          </div>
        </>
      )}

      {/* 무료 체험 2회 소진 시 한도 한계 모달 */}
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsLimitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                무료 체험 2회를 모두 사용했어요
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                무제한 이용을 위해 아래 옵션 중 하나를 선택해 주세요.
              </p>
            </div>

            <div className="space-y-6">
              {/* Option A: BYOK */}
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <span>옵션 A: 내 fal.ai API 키 사용 (BYOK)</span>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  본인의 fal.ai API 키를 등록하면 제한 없이 계속 헤드샷을 생성하실 수 있습니다.
                </p>

                <div className="space-y-3">
                  <input
                    type="password"
                    value={inputByokKey}
                    onChange={(e) => setInputByokKey(e.target.value)}
                    placeholder="fal.ai API Key 입력 (예: 12345-abc...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={handleSaveByok}
                    className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                  >
                    API 키 저장 및 바로 적용
                  </button>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-white/80 p-2.5 rounded-xl border border-slate-200/60 leading-normal">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      입력하신 API 키는 브라우저(localStorage)에만 안전하게 저장되며, 고객님의 요청 처리에만 사용됩니다 (서버 저장을 절대 하지 않습니다).
                    </span>
                  </div>
                </div>
              </div>

              {/* Option B: 유료 결제 비활성화 버튼 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                <div className="text-xs font-bold text-slate-500 mb-2">
                  옵션 B: 유료 이용권 구매
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed border border-slate-300/50"
                >
                  정식 버전 준비 중
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
