100 — Thin (Hairline)
200 — Extra Light (Ultra Light)
300 — Light
400 — Normal (Regular)
500 — Medium
600 — Semi Bold (Demi Bold)
700 — Bold
800 — Extra Bold (Ultra Bold)
900 — Black (Heavy)
950 — Extra Black (Ultra Black)

Результат підключення Variable Fonts (наприклад, Inter):

@font-face {
font-family: 'Inter';
src: url('../fonts/Inter-Variable.woff2') format('woff2-variations');
font-weight: 100 900; // весь діапазон
font-style: normal;
font-display: swap;
}

Якщо шрифт мае тільки латиницю ,а другий тільки кирилицю то використовуємо - unicode-range !
Це оптимальний сучасний підхід: браузер сам вирішує, який шрифт використовувати для якого алфавіту, якщо ти правильно це вкажеш у @font-face.

1.  Налаштування @font-face:

// Латиниця
@font-face {
font-family: 'ProjectFont';
src: url('/fonts/LatinFont.woff2') format('woff2');
font-weight: 400;
font-style: normal;
font-display: swap;
unicode-range: U+0000-00FF; // Basic Latin
}

// Кирилиця
@font-face {
font-family: 'ProjectFont';
src: url('/fonts/CyrillicFont.woff2') format('woff2');
font-weight: 400;
font-style: normal;
font-display: swap;
unicode-range: U+0400-04FF; // Cyrillic
}
Обидва шрифти мають однакову font-family, але різний unicode-range, тому браузер автоматично покаже правильний шрифт в одному слові або абзаці, якщо мови змішані.

body {
font-family: 'ProjectFont', sans-serif;
}
І все — без потреби ручного розділення на .en, .uk і т.п., браузер все робить сам.Якщо використовуєш кирилицю й латиницю в одному UI (навіть у одному слові), тільки unicode-range забезпечує 100% коректність.
