import { ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr";

export default function HistoryPage() {
  return (
    <div className="wrap">
      <div className="pageHead">
        <div className="pageCrumb">진단 이력</div>
        <h1 className="pageTitle">여러 번 진단한 기록을 모아봅니다</h1>
        <p className="pageSub">
          진단 이력 저장에 동의하면 시간에 따른 커버리지 변화를 이곳에서
          확인할 수 있게 됩니다.
        </p>
      </div>

      <div
        style={{
          border: "1px dashed var(--line)",
          borderRadius: "var(--radius-lg)",
          padding: "56px 32px",
          textAlign: "center",
        }}
      >
        <ClockCounterClockwise size={30} style={{ margin: "0 auto 16px", color: "var(--ink-faint)" }} />
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>
          아직 준비 중인 기능입니다
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-faint)", marginBottom: 20 }}>
          지금은 세션이 끝나면 결과가 함께 삭제됩니다. 계정 기능이 추가되면
          이곳에서 이전 진단서를 다시 볼 수 있습니다.
        </p>
        <a href="/diagnosis" className="btn btn-ghost btn-sm">
          최근 진단서 보기
        </a>
      </div>
    </div>
  );
}
