"use client";

import { useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { useFilters } from "@/lib/filter-context";
import {
  AI_QUICK_QUERIES,
  answerFreeText,
  answerQuery,
  type AiAnswer,
  type AiQueryId,
  type AiStatTone,
} from "@/lib/ai-assistant";

interface Exchange {
  id: number;
  question: string;
  answer: AiAnswer | null;
}

const STAT_TONE_CLASS: Record<AiStatTone, string> = {
  positive: "text-accent",
  negative: "text-risk",
  warning: "text-warning",
  neutral: "text-ink",
};

const ANSWER_DELAY_MS = 700;

export function AiAssistant() {
  const { year, period, scope } = useFilters();
  const [open, setOpen] = useState(false);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [inputValue, setInputValue] = useState("");
  const counter = useRef(0);
  const feedRef = useRef<HTMLDivElement | null>(null);

  function pushQuestion(question: string, resolve: () => AiAnswer) {
    counter.current += 1;
    const id = counter.current;
    setExchanges((prev) => [...prev, { id, question, answer: null }]);
    requestAnimationFrame(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    });
    setTimeout(() => {
      const answer = resolve();
      setExchanges((prev) => prev.map((ex) => (ex.id === id ? { ...ex, answer } : ex)));
      requestAnimationFrame(() => {
        feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
      });
    }, ANSWER_DELAY_MS);
  }

  function handleQuickQuery(queryId: AiQueryId, label: string) {
    pushQuestion(label, () => answerQuery(queryId, { year, period, scope }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    pushQuestion(text, () => answerFreeText(text, { year, period, scope }));
  }

  return (
    <>
      <div className="group fixed bottom-6 right-6 z-[85]">
        <span className="pointer-events-none absolute bottom-1/2 right-full mr-3 translate-y-1/2 whitespace-nowrap rounded-lg bg-primary-dark px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
          AI-помощник
        </span>
        <button
          type="button"
          aria-label="AI-помощник"
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform duration-150 hover:scale-105 hover:bg-primary-dark active:scale-95"
        >
          <Sparkles size={24} />
        </button>
      </div>

      <div className={`fixed inset-0 z-[90] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          aria-label="Закрыть AI-помощника"
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-black/30 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`fixed right-0 top-0 flex h-full w-[420px] max-w-[92vw] flex-col border-l border-line bg-white shadow-lg transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas-4 text-primary-dark">
                <Sparkles size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-ink">AI-помощник Smart Budget 360</h3>
                <p className="mt-0.5 text-sm text-ink-muted">Анализ бюджета, отклонений и рисков</p>
              </div>
            </div>
            <button
              aria-label="Закрыть"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-md p-1 text-ink-muted hover:bg-canvas-2 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-line-soft px-5 py-3">
            {AI_QUICK_QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuery(q.id, q.label)}
                className="rounded-full border border-line-soft bg-canvas-3 px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-teal hover:bg-canvas-4 hover:text-primary-dark"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div ref={feedRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {exchanges.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-muted">
                Выберите один из быстрых запросов выше или задайте свой вопрос ниже — помощник
                проанализирует текущие данные бюджета.
              </p>
            ) : (
              <div className="flex flex-col gap-5">
                {exchanges.map((ex) => (
                  <div key={ex.id} className="animate-[fade-slide-in_0.25s_ease-out] flex flex-col gap-2.5">
                    <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-canvas-4 px-3.5 py-2 text-sm font-medium text-primary-dark">
                      {ex.question}
                    </div>
                    {ex.answer === null ? (
                      <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                        <span className="inline-flex gap-0.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal" />
                        </span>
                        Анализирую данные…
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 rounded-xl border border-line-soft bg-white p-3.5">
                        {ex.answer.paragraphs.map((p, i) => (
                          <p key={i} className="text-sm leading-relaxed text-ink-soft">
                            {p}
                          </p>
                        ))}
                        {ex.answer.stats.length > 0 && (
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {ex.answer.stats.map((stat, i) => (
                              <div
                                key={i}
                                className="rounded-lg border border-line-soft bg-canvas-3 px-3 py-2"
                              >
                                <p className="truncate text-xs text-ink-muted">{stat.label}</p>
                                <p className={`text-sm font-bold ${STAT_TONE_CLASS[stat.tone ?? "neutral"]}`}>
                                  {stat.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        {ex.answer.recommendations && ex.answer.recommendations.length > 0 && (
                          <div className="rounded-lg bg-canvas-2 p-3">
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                              Рекомендации
                            </p>
                            <ul className="flex flex-col gap-1">
                              {ex.answer.recommendations.map((r, i) => (
                                <li key={i} className="text-sm text-ink-soft">
                                  • {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2 border-t border-line-soft px-4 py-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Задайте вопрос о бюджете…"
              className="min-w-0 flex-1 rounded-full border border-line-soft bg-canvas-3 px-4 py-2 text-sm text-ink outline-none focus:border-teal"
            />
            <button
              type="submit"
              aria-label="Отправить"
              disabled={!inputValue.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
