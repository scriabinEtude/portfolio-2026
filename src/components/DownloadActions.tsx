import { FileDown, Printer } from "lucide-react";
import { useState } from "react";
import { downloadBlob } from "../lib/export/download";
import { printDocument } from "../lib/export/print";

type DownloadActionsProps = {
  /** 무엇을 내려받는지. 도움말과 aria-label에 들어간다. 예) "이력서" */
  readonly subject: string;
  /** 확장자를 뺀 파일 이름. 예) "임한결_이력서_2026-08" */
  readonly filename: string;
  readonly buildDocx: () => Promise<Blob>;
  /** PDF 버튼 동작. 없으면 지금 화면을 그대로 인쇄한다. */
  readonly onPrint?: () => void;
  /** 인쇄할 판을 만드는 중. 다 되면 부르는 쪽이 인쇄를 연다. */
  readonly preparing?: boolean;
};

/** 상단 바에 붙는 내려받기 버튼. 문서가 아니라 사이트 껍데기에 속한다. */
function DownloadActions({
  subject,
  filename,
  buildDocx,
  onPrint,
  preparing = false,
}: DownloadActionsProps) {
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

  const savePdf = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    void printDocument(filename);
  };

  return (
    <div className="header-actions">
      <button
        type="button"
        className="btn btn--solid"
        aria-label={`${subject} PDF로 저장`}
        onClick={savePdf}
        disabled={preparing}
        title="인쇄 대화상자에서 대상을 'PDF로 저장'으로 고르세요"
      >
        <Printer size={14} strokeWidth={1.9} aria-hidden="true" />
        <span className="btn-label">{preparing ? "준비 중" : "PDF"}</span>
      </button>

      <button
        type="button"
        className="btn btn--ghost"
        aria-label={`${subject} DOCX로 내려받기`}
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
