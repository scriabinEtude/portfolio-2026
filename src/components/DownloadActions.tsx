import { FileDown, Printer } from "lucide-react";
import { useState } from "react";
import { downloadBlob } from "../lib/export/download";
import { printDocument } from "../lib/export/print";

type DownloadActionsProps = {
  /** 확장자를 뺀 파일 이름. 예) "임한결_이력서_2026-08" */
  readonly filename: string;
  readonly buildDocx: () => Promise<Blob>;
};

/** 상단 바에 붙는 내려받기 버튼. 문서가 아니라 사이트 껍데기에 속한다. */
function DownloadActions({ filename, buildDocx }: DownloadActionsProps) {
  const [building, setBuilding] = useState(false);
  const [failed, setFailed] = useState(false);

  const saveDocx = async () => {
    setBuilding(true);
    setFailed(false);
    try {
      downloadBlob(await buildDocx(), `${filename}.docx`);
    } catch {
      setFailed(true);
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="header-actions">
      <button
        type="button"
        className="btn btn--solid"
        aria-label="이력서를 PDF로 저장"
        onClick={() => printDocument(filename)}
        title="인쇄 대화상자에서 대상을 'PDF로 저장'으로 고르세요"
      >
        <Printer size={14} strokeWidth={1.9} aria-hidden="true" />
        <span className="btn-label">PDF</span>
      </button>

      <button
        type="button"
        className="btn btn--ghost"
        aria-label="이력서를 DOCX로 내려받기"
        onClick={saveDocx}
        disabled={building}
        title={failed ? "다시 눌러 주세요" : "Word 문서로 내려받기"}
      >
        <FileDown size={14} strokeWidth={1.9} aria-hidden="true" />
        <span className="btn-label">{building ? "생성 중" : "DOCX"}</span>
      </button>

      {failed && (
        <span className="actions-error" role="alert">
          DOCX 생성 실패
        </span>
      )}
    </div>
  );
}

export default DownloadActions;
