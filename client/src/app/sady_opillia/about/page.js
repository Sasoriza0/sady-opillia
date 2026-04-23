export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-green-800">Про нас</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Хто ми?</h2>
        <p className="text-gray-700">
          Ми — команда ентузіастів, закоханих у природу. Вже понад <strong>10 років</strong> ми вирощуємо якісні саджанці плодових дерев. Наш пріоритет — здорові, перевірені саджанці, які приживуться у вашому саду.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Що ми пропонуємо?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>🌳 Плодові дерева — яблуні, груші, сливи, черешні.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Чому обирають нас?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>✅ Висока якість саджанців</li>
          <li>✅ Доступні ціни без посередників</li>
          <li>✅ Поради з догляду та підтримка</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Зв'яжіться з нами</h2>
        <p className="text-gray-700">
          Якщо у вас виникли питання, пишіть на <a href="mailto:sadyopillia@gmail.com" className="text-green-700 no-link-style underline">sadyopillia@gmail.com</a> або телефонуйте <a href="tel:+380971234567" className="text-green-700 no-link-style underline">+38 (097) 123-45-67</a>.
        </p>
      </section>
    </main>
  );
}
