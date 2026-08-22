import { FileDown, Printer } from "lucide-react";
import { useState } from "react";
import { downloadBlob } from "../lib/export/download";
import { printDocument } from "../lib/export/print";

type DownloadBarProps = {
  /** 확장자를 뺀 파일 이름. 예) "임한결_이력서_2026-08" */
  readonly filename: string;
  readonly buildDocx: () => Promise<Blob>;
};

function DownloadBar({ filename, buildDocx }: DownloadBarProps) {
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
    <div>
      <div className="actions">
        <button
          type="button"
          className="btn btn--solid"
          onClick={() => printDocument(filename)}
          aria-describedby="pdf-hint"
        >
          <Printer size={15} strokeWidth={1.9} aria-hidden="true" />
          PDF로 저장
        </button>

        <button type="button" className="btn btn--ghost" onClick={saveDocx} disabled={building}>
          <FileDown size={15} strokeWidth={1.9} aria-hidden="true" />
          {building ? "만드는 중" : "DOCX 내려받기"}
        </button>

        <span className="actions-note" id="pdf-hint">
          인쇄 대화상자에서 대상을 &lsquo;PDF로 저장&rsquo;으로
        </span>
      </div>

      {failed && (
        <p className="actions-error" role="alert">
          DOCX를 만들지 못했습니다. 다시 눌러 주세요. 계속 실패하면 PDF로 저장을 이용하세요.
        </p>
      )}
    </div>
  );
}

export default DownloadBar;
