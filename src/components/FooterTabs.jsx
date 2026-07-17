// ============================================================
// 固定フッタータブ（タイトル一覧 / リスト / 会場マップ）
// 選択状態: アイコン=アクセント色(#F96A2E) / ラベル=#000000
// 非選択状態: #4b4b4b（仕様書指定）
// ============================================================
import { MagnifierIcon, ListIcon, PinIcon } from "./Icons.jsx";

const TABS = [
  { key: "titles", label: "タイトル", Icon: MagnifierIcon },
  { key: "checklist", label: "リスト", Icon: ListIcon },
  { key: "map", label: "会場マップ", Icon: PinIcon },
];

export default function FooterTabs({ active, onChange }) {
  return (
    <nav className="footer-tabs">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            className={`footer-tab${isActive ? " active" : ""}`}
            onClick={() => onChange(key)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon color={isActive ? "var(--accent)" : "var(--tab-inactive)"} size={26} />
            <span className="footer-tab-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
