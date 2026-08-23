/** 그림·글꼴을 기다리는 시간 상한. 하나가 안 떠도 인쇄는 열려야 한다. */
const ASSET_TIMEOUT = 4000;
/** afterprint를 쏘지 않는 브라우저를 위한 보험. */
const PRINT_TIMEOUT = 3000;

/**
 * 인쇄 대화상자를 연다. 대상에서 "PDF로 저장"을 고르면 PDF가 된다.
 * 크롬·엣지·사파리는 document.title을 기본 파일 이름으로 쓰므로 잠깐 바꿔 둔다.
 * 대화상자가 닫히면 끝난다.
 */
export function printDocument(filename: string): Promise<void> {
  const original = document.title;
  document.title = filename;

  return new Promise((resolve) => {
    let timer = 0;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      document.title = original;
      window.removeEventListener("afterprint", finish);
      window.clearTimeout(timer);
      resolve();
    };

    window.addEventListener("afterprint", finish);
    timer = window.setTimeout(finish, PRINT_TIMEOUT);
    window.print();
  });
}

/**
 * 인쇄 전에 그림과 글꼴이 다 뜨기를 기다린다.
 * 기다리지 않으면 아직 못 받은 그림 자리가 빈 네모로 찍힌다.
 */
export function waitForAssets(root: ParentNode): Promise<void> {
  const images = [...root.querySelectorAll("img")].map((image) =>
    image.complete ? Promise.resolve() : image.decode().catch(() => undefined),
  );

  const ready = Promise.all([...images, document.fonts.ready]).then(() => undefined);
  const guard = new Promise<void>((resolve) => window.setTimeout(resolve, ASSET_TIMEOUT));

  return Promise.race([ready, guard]);
}
