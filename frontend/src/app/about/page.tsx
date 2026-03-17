import ContentSidebarLayout from "@/components/layouts/ContentSidebarLayout";

export const metadata = {
  title: "品牌故事 — NextShop",
};

export default function AboutPage() {
  return (
    <ContentSidebarLayout activeHref="/about">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">About</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">品牌故事</h1>
        <p className="mt-3 text-gray-600">
          NextShop 是一個示範型電商平台，展示現代化的購物體驗與商品管理系統。我們專注於簡潔的設計、快速的瀏覽體驗與可靠的購物流程。
        </p>
      </header>

      <article className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">品牌理念</h2>
          <p className="mt-3">
            我們相信購物應該是輕鬆、透明且值得信賴的。透過直覺式介面與穩定的後端系統，讓每一次挑選商品都像瀏覽靈感畫廊般愉快。
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">平台特色</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>即時更新的商品與庫存資訊</li>
            <li>完善的會員、訂單與通知系統</li>
            <li>支援行動裝置的全響應式體驗</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">我們的願景</h2>
          <p className="mt-3">
            持續打造令人期待的購物旅程，並提供品牌故事、最新消息、購物說明與常見問題等資訊，讓使用者在 NextShop 找到靈感、完成結帳並期待收貨。
          </p>
        </div>
      </article>
    </ContentSidebarLayout>
  );
}
