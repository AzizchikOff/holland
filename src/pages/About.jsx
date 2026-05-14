export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        Biz haqimizda
      </h1>
      <p className="mt-4 text-gray-600 leading-relaxed">
        Holland — fast food restoran. Maqsadimiz: mijozga tez, mazali va sifatli
        taom yetkazish. Har bir mahsulot yangi tayyorlanadi va xizmat ko'rsatish
        soddaligi birinchi o'rinda.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="text-sm font-semibold text-gray-600">Tarix</div>
          <div className="mt-2 text-gray-900 font-bold text-xl">
            Qisqa hikoya
          </div>
          <p className="mt-2 text-gray-600">
            Sifatli fast food'ni hamma uchun qulay qilish g'oyasidan boshlangan.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="text-sm font-semibold text-gray-600">Missiya</div>
          <div className="mt-2 text-gray-900 font-bold text-xl">
            Tez va halol
          </div>
          <p className="mt-2 text-gray-600">
            Tez tayyorlash, halol mahsulot va barqaror ta'm.
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-6">
          <div className="text-sm font-semibold text-gray-600">
            Nega aynan biz?
          </div>
          <div className="mt-2 text-gray-900 font-bold text-xl">
            Qulay servis
          </div>
          <p className="mt-2 text-gray-600">
            Online savat va Telegram orqali buyurtma — oddiy va tez.
          </p>
        </div>
      </div>
    </div>
  );
}