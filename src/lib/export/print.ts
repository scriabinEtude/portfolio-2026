/**
 * 인쇄 대화상자를 연다. 대상에서 "PDF로 저장"을 고르면 PDF가 된다.
 * 크롬·엣지·사파리는 document.title을 기본 파일 이름으로 쓰므로 잠깐 바꿔 둔다.
 */
export function printDocument(filename: string): void {
  const original = document.title;
  document.title = filename;

  const restore = () => {
    document.title = original;
    window.removeEventListener("afterprint", restore);
  };

  window.addEventListener("afterprint", restore);
  window.print();

  // afterprint를 쏘지 않는 브라우저를 위한 보험.
  window.setTimeout(restore, 3000);
}
