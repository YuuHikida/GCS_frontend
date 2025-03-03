import { Global } from "@emotion/react";

const CustomGlobalStyle = () => (
  <Global
    styles={`
      [data-scope="tabs"] [data-part="trigger"].chakra-tabs__trigger {
        background: transparent !important; /* 背景色を透明に */
        box-shadow: none !important;        /* 影を無効化 */
        border: none !important;            /* ボーダーを無効化 */
        padding: 0.5rem 1rem;              /* 余白はそのまま維持 */
        display: inline-flex;              /* インラインレイアウトを維持 */
        align-items: center;               /* アイコンとテキストを縦中央揃え */
        gap: 0.5rem;                       /* アイコンとテキストの間隔 */
        cursor: pointer;                   /* クリック可能に */
        color: inherit;                    /* テキスト色はそのまま */
      }

      [data-scope="tabs"] [data-part="trigger"][data-selected] {
        border-bottom: 2px solid #3182ce !important; /* 選択状態のスタイルだけ再適用 */
        font-weight: bold;                          /* アクティブ時の太字 */
      }
    `}
  />
);




export default CustomGlobalStyle;
