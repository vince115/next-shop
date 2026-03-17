import ContentSidebarLayout from "@/components/layouts/ContentSidebarLayout";

export const metadata = {
  title: "購物說明 — NextShop",
};

export default function ShoppingGuidePage() {
  const sections = [
    {
      title: "購物流程",
      body: "挑選喜愛的商品加入購物車，登入帳戶後即可進入結帳。確認配送資訊與付款方式後送出訂單。",
    },
    {
      title: "付款方式",
      body: "目前支援信用卡、Apple Pay 與線上支付服務，未來將導入更多安全便利的支付解決方案。",
    },
    {
      title: "配送方式",
      body: "一般訂單以宅配寄送，支援超商取貨與國內主要物流。特殊商品或海外訂單會顯示額外時程。",
    },
    {
      title: "退換貨政策",
      body: "收到商品後若有瑕疵或與訂單不符，可在七日鑑賞期內聯絡客服辦理退換貨。我們將盡快協助處理。",
    },
  ];

  return (
    <ContentSidebarLayout activeHref="/shopping">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Guide</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">購物說明</h1>
        <p className="mt-3 text-gray-600">
          熟悉我們的購物流程、付款方式與售後服務，享受順暢安心的消費體驗。
        </p>
      </header>

      <div className="space-y-6 text-gray-700">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
            <p className="mt-3 leading-relaxed">{section.body}</p>
          </article>
        ))}
      </div>
    </ContentSidebarLayout>
  );
}
