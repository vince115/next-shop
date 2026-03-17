import ContentSidebarLayout from "@/components/layouts/ContentSidebarLayout";

export const metadata = {
  title: "常見問題 — NextShop",
};

const faqs = [
  {
    question: "如何下單？",
    answer: "選擇商品加入購物車並完成結帳流程，系統會即時更新庫存避免重複下單。",
  },
  {
    question: "支援哪些付款方式？",
    answer: "目前支援信用卡與線上支付，未來會加入更多電子付款選項。",
  },
  {
    question: "商品多久會出貨？",
    answer: "一般訂單會在 1–3 個工作天內出貨，若遇到缺貨或特別訂製會另行通知。",
  },
  {
    question: "如何查詢訂單進度？",
    answer: "登入帳戶後可在『我的訂單』查看每筆訂單的處理狀態與物流追蹤。",
  },
];

export default function FAQPage() {
  return (
    <ContentSidebarLayout activeHref="/faq">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">FAQ</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">常見問題</h1>
        <p className="mt-3 text-gray-600">快速找到購物流程、付款與物流的相關資訊，解決常見疑問。</p>
      </header>

      <dl className="space-y-6 text-gray-700">
        {faqs.map((item) => (
          <div key={item.question} className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
            <dt className="text-xl font-semibold text-gray-900">Q: {item.question}</dt>
            <dd className="mt-3 leading-relaxed">A: {item.answer}</dd>
          </div>
        ))}
      </dl>
    </ContentSidebarLayout>
  );
}
