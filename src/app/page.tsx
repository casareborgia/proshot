"use client";

import React, { useState } from "react";
import Image from "next/image";
import UploadCard from "./components/UploadCard";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star,
  ChevronDown,
  Quote,
  UserCheck,
  Building,
  Briefcase,
  HelpCircle,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 3개의 신뢰감 있는 한국어 사용자 후기 데이터
  const testimonials = [
    {
      name: "김민지",
      role: "IT 서비스 개발자",
      style: "비즈니스 정장",
      quote:
        "링크드인 프로필 사진을 새로 바꾸려고 스튜디오 예약을 고민하다가 ProShot을 써봤습니다. 15만 원 주고 찍었던 지난 사진보다 훨씬 자연스럽고 고급스럽게 나와서 대만족입니다!",
      rating: 5,
      avatarBg: "bg-indigo-100 text-indigo-700",
    },
    {
      name: "박준서",
      role: "테크 스타트업 마케터",
      style: "스튜디오",
      quote:
        "사원증과 언론 보도용 프로필이 급하게 필요했는데, 셀카 한 장으로 3분 만에 정장 프로필이 완성됐습니다. 팀원들도 어느 스튜디오에서 찍었냐고 물어보네요.",
      rating: 5,
      avatarBg: "bg-violet-100 text-violet-700",
    },
    {
      name: "이현우",
      role: "창업가 / 대표",
      style: "야외 자연광",
      quote:
        "IR 덱과 홈페이지에 넣을 인물 사진이 없어서 난감했는데, 야외 자연광 스튜디오 스타일 사진 덕분에 신뢰도가 크게 상승했습니다. 강추합니다!",
      rating: 5,
      avatarBg: "bg-emerald-100 text-emerald-700",
    },
  ];

  // 한국어 FAQ 아코디언 데이터
  const faqs = [
    {
      question: "어떤 셀카 사진을 준비해야 결과물이 가장 자연스럽게 나오나요?",
      answer:
        "얼굴 이목구비가 명확하게 보이고, 조명이 밝은 정면 셀카 1장이면 충분합니다. 과도한 스노우/필터가 적용되지 않은 일반 카메라 원본 셀카 사진일수록 실물에 가깝고 고화질의 결과가 완성됩니다.",
    },
    {
      question: "생성된 AI 프로필 사진의 저작권은 누구에게 있으며 상업적 이용이 가능한가요?",
      answer:
        "생성된 모든 프로필 사진의 100% 소유권과 저작권은 고객님께 귀속됩니다. 링크드인, 이력서, 회사 홈페이지, 명함, 언론 보도 등 모든 상업적 목적에 자유롭게 이용하실 수 있습니다.",
    },
    {
      question: "제가 업로드한 개인 셀카 사진은 안전하게 관리되나요?",
      answer:
        "ProShot은 개인정보 보호를 최우선으로 다룹니다. 업로드된 원본 사진 및 생성 임시 데이터는 작업이 완료된 즉시 암호화 폐기 처리되며, AI 학습 데이터로 절대 활용되지 않습니다.",
    },
    {
      question: "생성 시간은 얼마나 걸리며, 결과가 마음에 들지 않으면 재시도할 수 있나요?",
      answer:
        "평균 10~20초 이내로 모든 콘셉트의 헤드샷 생성이 완료됩니다. 결과 화면에서 '다시 생성' 또는 '스타일 바꾸기' 버튼을 클릭하여 몇 번이든 다른 분위기로 쉽게 재시도하실 수 있습니다.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* 은은한 배경 오버레이 및 빛 반사 효과 (Soft Premium Background) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-sky-100/40 blur-3xl rounded-full opacity-80 animate-pulse-slow" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-2/3 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-purple-100/25 via-sky-100/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/70 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl px-1 py-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Pro<span className="text-indigo-600">Shot</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a
              href="#upload-section"
              className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
            >
              헤드샷 만들기
            </a>
            <a
              href="#gallery"
              className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
            >
              비포&아프터
            </a>
            <a
              href="#testimonials"
              className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
            >
              사용 후기
            </a>
            <a
              href="#faq"
              className="hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
            >
              FAQ
            </a>
          </nav>

          <a
            href="#upload-section"
            className="text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            지금 시작하기
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* 은은한 그라데이션 히어로 섹션 (Soft Hero Section) */}
        <section className="relative pt-16 pb-16 md:pt-24 md:pb-28 px-6 text-center bg-gradient-to-b from-indigo-50/50 via-slate-50/80 to-slate-50 border-b border-slate-200/50">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* 상단 뱃지 */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200/80 text-indigo-700 text-xs md:text-sm font-semibold mb-8 shadow-xs animate-fadeIn">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>차세대 스튜디오급 AI 프로필 솔루션</span>
            </div>

            {/* 한국어 타이포그래피 메인 헤드라인 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-6">
              셀카 한 장으로 만드는 <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                완벽한 AI 프로필 사진
              </span>
            </h1>

            {/* 1줄 서브헤드라인 */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-10">
              스튜디오 예약 없이, 3분 만에 링크드인·이력서·사원증에 어울리는 고화질 비즈니스 프로필을 완성하세요.
            </p>

            {/* 신뢰 요소 뱃지 */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-600 mb-12">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>3분 고화질 렌더링</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>100% 개인정보 안전보장</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>상업적 이용 가능</span>
              </div>
            </div>

            {/* 셀카 업로드 및 생성을 담당하는 클라이언트 컴포넌트 */}
            <div id="upload-section" className="w-full max-w-2xl">
              <UploadCard />
            </div>
          </div>
        </section>

        {/* 비포 & 아프터 비교 갤러리 섹션 */}
        <section id="gallery" className="py-24 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                BEFORE & AFTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                자연스러움과 품격이 공존하는 변환 퀄리티
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                일상 셀카 사진이 이목구비 고유의 매력을 간직한 채 스튜디오 조명 아래 찍힌 프로필로 완성됩니다.
              </p>
            </div>

            {/* rounded-2xl 비교 쇼케이스 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 카드 1: 여성 비즈니스 프로필 */}
              <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700">
                    비즈니스 클래식
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <Image
                      src="/images/selfie-casual.png"
                      alt="원본 일상 셀카 샘플"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium">
                      원본 셀카
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border-2 border-indigo-500/80 shadow-xs">
                    <Image
                      src="/images/headshot-female.png"
                      alt="ProShot AI로 생성된 여성 비즈니스 헤드샷"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" /> AI 헤드샷
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                  <span>헤어·정장·조명 완벽 자동 보정</span>
                  <span className="text-indigo-600 font-bold">10초 완성</span>
                </div>
              </div>

              {/* 카드 2: 남성 스튜디오 프로필 */}
              <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-violet-50 text-violet-700">
                    모던 워크플레이스
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 relative">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80">
                    <Image
                      src="/images/selfie-casual.png"
                      alt="원본 셀카 사진"
                      fill
                      className="object-cover grayscale opacity-75"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium">
                      원본 셀카
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border-2 border-indigo-500/80 shadow-xs">
                    <Image
                      src="/images/headshot-male.png"
                      alt="ProShot AI로 생성된 남성 모던 프로필"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" /> AI 헤드샷
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                  <span>피부 결 보정 및 섀도우 다듬기</span>
                  <span className="text-indigo-600 font-bold">10초 완성</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 사용자 후기 섹션 (Testimonials - 3 Korean quotes) */}
        <section id="testimonials" className="py-24 px-6 bg-slate-50 border-b border-slate-200/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                USER REVIEWS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                실제 고객분들이 직접 경험한 만족도
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                스튜디오 예약 부담 없이 최고의 프로필을 완성한 분들의 솔직한 후기입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-5 h-5 text-indigo-200" />
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed mb-6 font-normal">
                      &quot;{t.quote}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center ${t.avatarBg}`}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 FAQ 섹션 (Accordion) */}
        <section id="faq" className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                <HelpCircle className="w-4 h-4 text-indigo-600" /> FAQ
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                자주 묻는 질문
              </h2>
              <p className="text-slate-600 text-sm">
                ProShot 이용에 대해 궁금하신 점을 쉽게 확인해 보세요.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? "bg-indigo-50/40 border-indigo-300 shadow-xs"
                        : "bg-white border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="w-full p-5 sm:p-6 text-left font-bold text-slate-900 flex justify-between items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                    >
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? "bg-indigo-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-indigo-100/70 pt-4 animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 하단 최종 CTA 섹션 */}
        <section className="py-20 px-6 bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-indigo-300 flex items-center justify-center mx-auto mb-6 backdrop-blur-xs border border-white/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              지금 셀카 1장으로 프로필을 바꿔보세요
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base mb-8 max-w-xl mx-auto font-light leading-relaxed">
              3분만 투자하면 링크드인, 이력서, 회사 홈페이지에서 눈길을 사로잡는 최고의 비즈니스 프로필이 완성됩니다.
            </p>
            <a
              href="#upload-section"
              className="inline-flex items-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-slate-900 bg-white hover:bg-indigo-50 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <span>내 헤드샷 만들기</span>
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </a>
          </div>
        </section>
      </main>

      {/* 필수 푸터 요구사항: "ProShot — AI CITY BUILDERS" */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-6 text-center text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-semibold text-slate-700 tracking-wide">
            ProShot — AI CITY BUILDERS
          </div>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} ProShot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
