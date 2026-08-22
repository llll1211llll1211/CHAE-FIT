'use client';

/**
 * 이력서 보유 여부 분기 (첫 화면)
 *
 * analysis도 entryMode도 없는 최초 상태에만 보인다. 선택에 따라
 * UploadSection(이력서 있음) 또는 ManualEntrySection(이력서 없음)으로 이어진다.
 */
export default function EntryChoice({ onChoose }) {
  return (
    <section className="choices" aria-label="이력서 보유 여부 선택">
      <button type="button" className="choice" onClick={() => onChoose('upload')}>
        <div className="choice__icon" aria-hidden="true">📄</div>
        <div className="choice__title">이력서가 있어요</div>
        <p className="choice__desc">PDF나 텍스트 파일을 올려서 바로 분석할게요.</p>
      </button>
      <button type="button" className="choice" onClick={() => onChoose('manual')}>
        <div className="choice__icon" aria-hidden="true">✍️</div>
        <div className="choice__title">이력서가 없어요</div>
        <p className="choice__desc">경력·활동 내용을 직접 입력해서 진단을 시작할게요.</p>
      </button>
    </section>
  );
}
