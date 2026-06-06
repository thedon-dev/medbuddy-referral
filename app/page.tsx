import ReferralForm from "./components/ReferralForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Medbuddy Referrals
          </h1>
          <p className="text-gray-600 mt-2">
            Send referral follow-up emails to your users
          </p>
        </div>
        <ReferralForm />
      </div>
    </main>
  );
}
