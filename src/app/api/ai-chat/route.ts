import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Будь ласка, введіть питання.' });
    }

    console.log('📩 Отримано запит:', message);

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GROQ_API_KEY не знайдено! Використовуємо локальний словник.');
      return NextResponse.json({ reply: getLocalReply(message) });
    }

    console.log('🔑 Використовуємо Groq API');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Ти — експерт-консультант з 3D-друку. Відповідай українською, дружелюбно, розгорнуто. Називай конкретні ціни (PLA – 5 грн/г, ABS – 5, PETG – 10, TPU – 8, ASA – 12, PA (нейлон) – 20). Терміни: 1-5 днів. Доставка: Нова Пошта, Укрпошта, самовивіз.`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Помилка Groq API:', response.status, data);
      return NextResponse.json({ reply: getLocalReply(message) });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'Вибачте, не вдалося отримати відповідь.';
    console.log('✅ Відповідь від Groq:', reply);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('❌ Критична помилка:', error);
    return NextResponse.json({ reply: 'Вибачте, сталася технічна помилка.' });
  }
}

// ========== ЛОКАЛЬНИЙ СЛОВНИК (FALLBACK) ==========
function getLocalReply(message: string): string {
  const lower = message.toLowerCase().trim();

  if (lower.includes('привіт') || lower.includes('добрий день') || lower.includes('здрастуйте')) {
    return 'Вітаю! Я AI-консультант з 3D-друку. Чим можу допомогти? Розкажіть, що ви хочете надрукувати.';
  }
  if (lower.includes('фігурк') || lower.includes('іграшк') || lower.includes('сувенір')) {
    return 'Ми друкуємо фігурки, іграшки та сувеніри. Ціна залежить від розміру та матеріалу. Надішліть файл моделі (STL, OBJ) для точного розрахунку.';
  }
  if (lower.includes('ціна') || lower.includes('вартість') || lower.includes('скільки коштує')) {
    return 'Вартість друку: PLA – 5 грн/г, ABS – 5 грн/г, PETG – 10 грн/г, TPU – 8 грн/г, ASA – 12 грн/г, PA (нейлон) – 20 грн/г. Точна ціна після узгодження моделі.';
  }
  if (lower.includes('термін') || lower.includes('час') || lower.includes('довго')) {
    return 'Друк займає від 1 до 5 днів. Термінові замовлення – за 24 години (за додаткову плату).';
  }
  if (lower.includes('матеріал') || lower.includes('пластик')) {
    return 'Працюємо з PLA, ABS, PETG, TPU, ASA, PA (нейлон). PLA – екологічний, ABS – міцний, PETG – універсальний, TPU – гнучкий, ASA – стійкий до УФ, PA – надміцний.';
  }
  if (lower.includes('доставка') || lower.includes('нова пошта') || lower.includes('укрпошта')) {
    return 'Доставляємо Новою Поштою (1-3 дні), Укрпоштою (2-5 днів) або самовивіз зі Стрия.';
  }
  if (lower.includes('гарантія') || lower.includes('якість') || lower.includes('брак')) {
    return '100% гарантія якості. При браку – безкоштовна заміна.';
  }
  if (lower.includes('замовити') || lower.includes('як замовити')) {
    return 'Заповніть форму на сторінці "Замовити друк". Завантажте файл моделі (STL, OBJ, 3MF). Ми зв\'яжемося протягом 12 годин.';
  }
  if (lower.includes('зсу') || lower.includes('волонтер')) {
    return 'Допомагаємо ЗСУ: друкуємо адаптери, кріплення, тактичні аксесуари безкоштовно або за собівартістю.';
  }
  if (lower.includes('контакти') || lower.includes('телефон') || lower.includes('telegram')) {
    return '📞 +380 (98) 075-17-07\n✉️ komarnytskiy.yura@gmail.com\n📱 Telegram: @3d_print\n📷 Instagram: @3d_print_ua';
  }
  if (lower.includes('дякую') || lower.includes('спасибі')) {
    return 'Будь ласка! Звертайтеся, якщо будуть питання. Гарного дня! 😊';
  }

  return `Дякую за запитання! На жаль, я ще не маю точної відповіді. Але я можу допомогти з темами: ціни (PLA – 5 грн/г, ABS – 5, PETG – 10, TPU – 8, ASA – 12, PA – 20), матеріали, терміни (1-5 днів), доставка (Нова Пошта, Укрпошта, самовивіз). Напишіть нам у Telegram @3d_print або заповніть форму на сайті – ми відповімо протягом 12 годин.`;
}