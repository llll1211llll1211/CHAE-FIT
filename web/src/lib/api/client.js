/**
 * 브라우저 → API 호출 (PRD §9.1)
 *
 * 에러 문구를 프론트가 만들지 않는 것이 요점이다. 서버가 내려준 `error.message`를
 * 그대로 ErrorBanner에 띄운다. `error.code`는 분기용이며 화면에 표시하지 않는다.
 */

/** 서버가 내려주지 못한 경우(네트워크 단절 등)에만 쓰는 최후 문구. */
const FALLBACK_MESSAGE = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

/** 서버 응답에서 뽑아낸 에러. code로 분기하고 message를 그대로 노출한다. */
export class ApiError extends Error {
  constructor(message, code) {
    super(message ?? FALLBACK_MESSAGE);
    this.code = code ?? 'INTERNAL';
  }
}

async function send(path, init) {
  let res;
  try {
    res = await fetch(path, init);
  } catch {
    throw new ApiError('네트워크 연결을 확인해주세요.', 'NETWORK');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error?.message, data?.error?.code);
  return data;
}

/** POST application/json */
export function postJson(path, body) {
  return send(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** POST multipart/form-data (이력서 업로드) */
export function postFile(path, field, file) {
  const form = new FormData();
  form.append(field, file);
  return send(path, { method: 'POST', body: form });
}
