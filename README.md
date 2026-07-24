# ProShot — 셀카 한 장으로 AI 프로필 사진 📸

> **ProShot**은 스튜디오 방문 없이 셀카 1장으로 3분 만에 초고화질 비즈니스 헤드샷 및 AI 프로필 사진을 생성하는 웹 애플리케이션입니다.

---

## 🚀 주요 기능 및 특징

- **셀카 1장 업로드 & 미리보기**: 드래그앤드롭 및 파일 선택으로 셀카 업로드
- **비포 & 애프터(Before / After) 비교 뷰**: 원본 셀카와 AI 헤드샷 카드 나란히 비교
- **3가지 맞춤 스타일 선택**: `비즈니스 정장(corporate)`, `스튜디오(studio)`, `야외 자연광(outdoor)`
- **무료 2회 체험 제한 (`proshot_uses`)**: 브라우저별 2회 무료 제공
- **BYOK (Bring Your Own Key) 지원**: 개인 `fal.ai` API 키 등록 시 횟수 차감 없이 무제한 이용 (서버 미저장)
- **PNG 고화질 직접 다운로드**: `proshot-headshot.png` 저장
- **Vercel Serverless ready**: `@fal-ai/client` 및 Node.js 런타임 호환

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: Next.js 14 / 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Clean Light Theme)
- **Icons**: Lucide React
- **AI Engine**: `@fal-ai/client` (`fal-ai/flux-pulid`)
- **Runtime**: **Node.js Runtime** (`export const runtime = "nodejs"`)

---

## 🔐 환경 변수 (Environment Variables)

프로젝트 구동을 위해 `fal.ai` API 키가 필요합니다.

```env
# .env.local (Git 커밋 금지)
FAL_KEY=your_fal_api_key_here
```

> ⚠️ **보안 주의사항**: `.env.local` 파일과 실제 API 키는 절대 Git 저장소에 커밋하지 마세요. `.gitignore`에 의해 자동으로 제외됩니다.

---

## ⚡ Vercel 배포 가이드 (Deployment Guide)

### ⚠️ 필수 확인 사항 (Node.js Runtime)
`/src/app/api/generate/route.ts` API 라우트는 `@fal-ai/client` SDK 및 Node.js `Buffer` API를 사용하므로 Edge Runtime이 아닌 **Node.js Runtime**으로 설정되어 있습니다:
```ts
export const runtime = "nodejs";
export const maxDuration = 60;
```

---

### 방법 1: Vercel Dashboard (GitHub 연동 방식 - 추천)

1. **GitHub 저장소에 코드 Push**:
   ```bash
   git add .
   git commit -m "feat: prepare proshot for Vercel deployment"
   git push origin main
   ```

2. **Vercel 대시보드 로그인**:
   - [Vercel Dashboard](https://vercel.com/dashboard) 접속 ➔ **Add New...** ➔ **Project** 선택.

3. **GitHub 저장소 Import**:
   - `proshot` (또는 해당 프로젝트 저장소) 선택 ➔ **Import**.

4. **환경 변수(Environment Variables) 설정 (필수!)**:
   - **Environment Variables** 섹션을 확장합니다.
   - **Key**: `FAL_KEY`
   - **Value**: `fal.ai에서 발급받은 실제 API 키`
   - **Add** 버튼 클릭.

5. **Deploy 실행**:
   - **Deploy** 버튼을 누르면 약 1분 이내에 자동 빌드 및 배포가 완성됩니다.

---

### 방법 2: Vercel CLI (터미널 직접 배포 방식)

1. **Vercel CLI 설치 (미설치 시)**:
   ```bash
   npm install -g vercel
   ```

2. **Vercel 로그인**:
   ```bash
   vercel login
   ```

3. **프로젝트 배포 실행**:
   ```bash
   # proshot 디렉터리 이동 후 실행
   vercel
   ```

4. **프로덕션(Production) 배포 및 환경변수 설정**:
   ```bash
   # 환경 변수 등록
   vercel env add FAL_KEY production

   # 프로덕션 배포 완료
   vercel --prod
   ```

---

## 💻 로컬 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후 확인합니다.

---

## 📜 라이선스 & Credit

- **Developer**: ProShot Team
- **Footer**: `ProShot — AI CITY BUILDERS`
