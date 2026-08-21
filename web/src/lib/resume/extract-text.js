/**
 * 이력서 파일 → 평문 텍스트 (PRD F1)
 *
 * 스캔본 PDF처럼 텍스트 레이어가 없는 파일은 EXTRACTION_FAILED로 올려
 * "텍스트가 포함된 PDF인지 확인해주세요"를 띄운다(§9.1).
 */

/** 이보다 짧으면 이력서로 볼 수 없다. 스캔본 PDF가 주로 여기 걸린다. */
const MIN_USEFUL_LENGTH = 50;

/** 서식 제어 문자(ZWSP·ZWNJ·ZWJ·BOM). PDF 추출물에 섞여 들어와 스킬 토큰을 깨뜨린다. */
const INVISIBLE = /\p{Cf}/gu;

/** 줄바꿈만 남기고 나머지 공백류를 하나로 모은다 (nbsp 포함). */
const HORIZONTAL_SPACE = /[^\S\n]+/g;

function extractionFailed(reason) {
  const err = new Error(`텍스트 추출 실패: ${reason}`);
  err.code = 'EXTRACTION_FAILED';
  return err;
}

/**
 * @param {File} file
 * @param {'pdf'|'txt'} ext
 * @returns {Promise<string>}
 * @throws code === 'EXTRACTION_FAILED'
 */
export async function extractResumeText(file, ext) {
  const text = ext === 'txt' ? await file.text() : await extractPdfText(file);
  const cleaned = normalize(text);

  if (cleaned.length < MIN_USEFUL_LENGTH) {
    throw extractionFailed(`본문이 ${cleaned.length}자`);
  }
  return cleaned;
}

async function extractPdfText(file) {
  // 동적 import: pdf.js는 무겁고 txt 업로드 경로에서는 필요하지 않다.
  const { extractText, getDocumentProxy } = await import('unpdf');

  try {
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  } catch (e) {
    // 암호가 걸린 PDF, 깨진 파일 등. 사용자에게는 같은 안내로 충분하다.
    throw extractionFailed(e?.message ?? 'PDF 파싱 오류');
  }
}

/**
 * 추출 결과의 공백을 정리한다.
 * 줄바꿈은 남긴다 — 이력서의 항목 구분이 사라지면 LLM이 경험 단위를 잘못 묶는다.
 */
function normalize(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(INVISIBLE, '')
    .replace(HORIZONTAL_SPACE, ' ')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
