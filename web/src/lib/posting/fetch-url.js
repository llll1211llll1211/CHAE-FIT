/**
 * 공고 URL → 본문 텍스트 (PRD §8.3 · §12)
 *
 * **이건 보조 수단이다.** 채용 플랫폼 대부분이 스크래핑을 약관으로 제한하거나
 * JS 렌더링을 요구하므로, 여기서의 실패는 버그가 아니라 정상 경로다.
 * 실패하면 URL_FETCH_FAILED로 올려 "본문을 직접 붙여넣어 주세요"를 띄운다.
 */

const TIMEOUT_MS = 8000;
const MAX_BYTES = 2 * 1024 * 1024;

/** 이보다 짧으면 JS 렌더링 페이지의 빈 껍데기를 받은 것으로 본다. */
const MIN_USEFUL_LENGTH = 200;

/** 본문이 아닌 것이 확실한 태그 — 내용까지 통째로 버린다. */
const NOISE_TAGS = /<(script|style|noscript|svg|head|nav|footer|iframe)\b[^>]*>[\s\S]*?<\/\1>/gi;

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
  '&quot;': '"', '&#39;': "'", '&apos;': "'", '&middot;': '·',
};

function urlFetchFailed(reason) {
  const err = new Error(`URL 본문 확보 실패: ${reason}`);
  err.code = 'URL_FETCH_FAILED';
  return err;
}

/** HTML → 평문. 블록 태그 경계를 줄바꿈으로 남겨 자격요건 목록의 행 구분을 지킨다. */
export function htmlToText(html) {
  return html
    .replace(NOISE_TAGS, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6]|section|article|td|th)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;|&#\d+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? ' ')
    .replace(/\p{Cf}/gu, '')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * @param {string} rawUrl
 * @returns {Promise<string>} 공고 본문 텍스트
 * @throws code === 'URL_FETCH_FAILED'
 */
export async function fetchPostingText(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw urlFetchFailed('URL 형식이 아님');
  }
  // http(s)만 허용한다. file:, data: 등으로 서버 내부를 찔러보게 두지 않는다.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw urlFetchFailed(`지원하지 않는 프로토콜 ${url.protocol}`);
  }

  let res;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        // 봇 차단 페이지 대신 실제 문서를 받을 확률을 올린다.
        'user-agent': 'Mozilla/5.0 (compatible; chafit/1.0; +https://chafit.vercel.app)',
        accept: 'text/html,application/xhtml+xml',
        'accept-language': 'ko-KR,ko;q=0.9',
      },
    });
  } catch (e) {
    throw urlFetchFailed(e?.name === 'TimeoutError' ? '응답 시간 초과' : '네트워크 실패');
  }

  if (!res.ok) throw urlFetchFailed(`HTTP ${res.status}`);

  const type = res.headers.get('content-type') ?? '';
  if (!/text\/html|text\/plain|application\/xhtml/i.test(type)) {
    throw urlFetchFailed(`본문이 HTML이 아님 (${type || 'unknown'})`);
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength > MAX_BYTES) throw urlFetchFailed('문서가 너무 큼');

  const text = htmlToText(new TextDecoder('utf-8').decode(buf));

  // 여기 걸리는 대표 사례가 JS 렌더링 페이지와 로그인 게이트다. 둘 다 붙여넣기로 유도한다.
  if (text.length < MIN_USEFUL_LENGTH) throw urlFetchFailed('본문을 찾지 못함');

  return text;
}
