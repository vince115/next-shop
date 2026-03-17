import ContentSidebarLayout from "@/components/layouts/ContentSidebarLayout";

export const metadata = {
  title: "最新消息 — NextShop",
};

const newsItems = [
  { date: "2026 / 03 / 10", title: "NextShop 正式上線" },
  { date: "2026 / 02 / 20", title: "新增商品分類與購物車功能" },
  { date: "2026 / 01 / 05", title: "導入會員中心與訂單追蹤" },
];

export default function NewsPage() {
  return (
    <ContentSidebarLayout activeHref="/news">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">News</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">最新消息</h1>
        <p className="mt-3 text-gray-600">追蹤 NextShop 的開發進度、平台活動以及最新功能釋出。</p>
      </header>

      <div className="space-y-6">
        {newsItems.map((item) => (
          <article
            key={`${item.date}-${item.title}`}
            className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm"
          >
            <p className="text-sm font-medium tracking-wide text-gray-500">{item.date}</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-gray-600">
              我們持續優化購物流程，並投入更多資源於會員體驗、營運工具與跨裝置整合。
            </p>
          </article>
        ))}
      </div>
    </ContentSidebarLayout>
  );
}
