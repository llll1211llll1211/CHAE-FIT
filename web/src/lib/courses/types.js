/**
 * 국비지원(내일배움카드) 강의 스키마 — 경력공고 비교 기능의 "관련 강의" 슬롯이 쓴다.
 *
 * `fixtures/courses.json`은 HRD-Net(직업훈련포털) 훈련과정목록 엑셀을 자동 변환해
 * 만들었다 — 훈련과정명을 `jobs/tags.js`와 같은 96-태그(SK.*) 사전으로 스캔해
 * `tagIds`를 채웠다. 사람이 태그를 손으로 단 것이 아니므로, 과정명 표현이 모호하면
 * 태그가 비거나(추천 대상에서 빠짐) 부정확할 수 있다.
 *
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title              훈련과정명 원문
 * @property {string} provider           훈련기관명
 * @property {string} region             주소요약
 * @property {string|null} startDate     YYYY-MM-DD
 * @property {string|null} endDate       YYYY-MM-DD
 * @property {number|null} durationHours 총 훈련시간
 * @property {number|null} employmentRate 훈련기관 취업률(%). 정보 없으면 null
 * @property {number|null} fee           훈련비(정부지원 포함 전체 비용)
 * @property {number|null} selfPay       자비부담금(실 결제액)
 * @property {number|null} subsidyRate   1 - selfPay/fee. 정부 지원 비율 추정치
 * @property {boolean} isNationalFunded  국민내일배움카드 대상 훈련과정 여부(HRD-Net 등재 = true)
 * @property {string[]} tagIds           매칭되는 SK.* 역량 태그 (jobs/tags.js 사전과 동일 네임스페이스)
 * @property {string} sourceLabel        출처 배지 문구
 */
export {};
