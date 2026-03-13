import { getUserProfile } from "@/lib/userApi";
import { getMyOrders } from "@/lib/orderApi";
import { Order } from "@/types/order";
import ProfileSection from "@/components/account/ProfileSection";
import OrdersSection from "@/components/account/OrdersSection";

export default async function AccountPage() {
  // TODO: Get token from auth context/cookie
  const token = ""; // Placeholder - needs auth implementation
  
  let profile = null;
  let orders: Order[] = [];

  try {
    if (token) {
      profile = await getUserProfile(token);
      orders = await getMyOrders(token);
    }
  } catch (error) {
    console.error("Failed to load account data:", error);
  }

  if (!token || !profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your account.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="space-y-8">
        <ProfileSection profile={profile} />
        <OrdersSection orders={orders} />
      </div>
    </main>
  );
}
