import {
  formatExpressionsAsTextList,
  parseExpressionsTextList,
} from '../domain/expressions.js';
import { strings } from '../i18n/strings.js';
import { loadExpressions, saveExpressions } from '../storage/expressionStorage.js';

function renderExpressionItems(listElement, expressions) {
  listElement.replaceChildren(
    ...expressions.map((expression) => {
      const item = document.createElement('li');
      item.className = 'rounded border border-slate-200 bg-white px-3 py-2 text-slate-800';
      item.textContent = expression;
      return item;
    }),
  );
}

export function mountApp(rootElement) {
  const initialExpressions = loadExpressions();

  rootElement.innerHTML = `
    <main class="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8 text-slate-900">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">${strings.appTitle}</h1>
        <p class="text-base text-slate-600">${strings.intro}</p>
      </header>

      <section class="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-slate-800" for="expressions-input">${strings.expressionsLabel}</label>
          <p class="text-sm text-slate-600">${strings.expressionsHint}</p>
        </div>
        <textarea
          id="expressions-input"
          class="min-h-36 w-full rounded border border-slate-300 bg-white p-3 font-mono text-sm leading-6 text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
          spellcheck="false"
        ></textarea>
        <p class="text-sm text-slate-600" role="status" aria-live="polite" data-status></p>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-slate-800">${strings.expressionsLabel}</h2>
        <ul class="grid gap-2" data-expression-list></ul>
      </section>
    </main>
  `;

  const inputElement = rootElement.querySelector('#expressions-input');
  const statusElement = rootElement.querySelector('[data-status]');
  const listElement = rootElement.querySelector('[data-expression-list]');

  inputElement.value = formatExpressionsAsTextList(initialExpressions);
  renderExpressionItems(listElement, initialExpressions);
  statusElement.textContent = initialExpressions.length > 0
    ? strings.saveStatus
    : strings.emptyStatus;

  inputElement.addEventListener('input', () => {
    const expressions = parseExpressionsTextList(inputElement.value);
    saveExpressions(expressions);
    renderExpressionItems(listElement, expressions);
    statusElement.textContent = expressions.length > 0
      ? strings.saveStatus
      : strings.emptyStatus;
  });
}
