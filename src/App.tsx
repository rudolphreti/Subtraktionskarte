import { useMemo, useState } from 'react'
import {
  buildSubtractionFacts,
  classifyFact,
  factId,
  getHighlightContext,
  type ClassifiedFact,
  type HighlightContext,
} from './domain/subtractionGroups'
import { strings } from './i18n/strings'
import { groupAccentStyles, groupStyles, subgroupRingStyles } from './ui/groupStyles'

const LIMIT = 20

const tableNumbers = Array.from({ length: LIMIT + 1 }, (_, index) => index)

const getFactButtonClasses = (fact: ClassifiedFact, active: HighlightContext | null, isSelected: boolean) => {
  const isActiveGroup = active?.primaryGroup === fact.primaryGroup
  const isActiveResult = active?.result === fact.result
  const isActiveRow = active?.rowMinuend === fact.minuend
  const isActiveColumn = active?.columnSubtrahend === fact.subtrahend
  const activeSubgroup = active?.subgroups.find((subgroup) => fact.subgroups.includes(subgroup))

  return [
    'relative flex aspect-square min-h-11 w-full min-w-11 touch-manipulation select-none items-center justify-center rounded-lg border text-[0.65rem] font-semibold transition duration-150 sm:min-h-10 sm:min-w-10 sm:text-xs lg:min-h-9 lg:min-w-9',
    groupStyles[fact.primaryGroup],
    isActiveGroup ? 'opacity-100 saturate-150' : active ? 'opacity-35 grayscale' : 'opacity-90',
    isActiveRow ? 'shadow-[inset_0_4px_0_0_rgb(30_64_175)]' : '',
    isActiveColumn ? 'outline outline-4 -outline-offset-4 outline-rose-500' : '',
    isActiveResult ? 'scale-105 border-slate-950 bg-white text-slate-950 shadow-lg' : '',
    activeSubgroup ? subgroupRingStyles[activeSubgroup] : '',
    isSelected ? 'z-20 scale-110 border-slate-950 bg-slate-950 text-white shadow-xl' : '',
    !active ? 'hover:scale-105 hover:shadow-md' : 'hover:opacity-100',
  ].join(' ')
}

const getFactDataAttributes = (fact: ClassifiedFact, active: HighlightContext | null) => ({
  'data-active-result': active?.result === fact.result ? 'true' : 'false',
  'data-active-row': active?.rowMinuend === fact.minuend ? 'true' : 'false',
  'data-active-column': active?.columnSubtrahend === fact.subtrahend ? 'true' : 'false',
  'data-active-primary-group': active?.primaryGroup === fact.primaryGroup ? fact.primaryGroup : '',
  'data-active-subgroups': active?.subgroups.filter((subgroup) => fact.subgroups.includes(subgroup)).join(' '),
})

function App() {
  const facts = useMemo(() => buildSubtractionFacts(LIMIT).map(classifyFact), [])
  const factsById = useMemo(() => new Map(facts.map((fact) => [fact.id, fact])), [facts])
  const [activeFact, setActiveFact] = useState<ClassifiedFact | null>(null)
  const activeContext = activeFact ? getHighlightContext(activeFact) : null

  const activateFact = (fact: ClassifiedFact) => setActiveFact(fact)

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-950 sm:px-5 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-4 lg:gap-6">
        <header className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-end lg:p-6">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{strings.eyebrow}</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 lg:text-5xl">{strings.appTitle}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-700">{strings.intro}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 md:max-w-xs">
            <p className="font-semibold text-slate-950">{strings.mobileHint}</p>
            <p className="mt-1 hidden md:block">{strings.desktopHint}</p>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-3 lg:p-4" aria-label="Subtraktionstabelle">
            <div className="overflow-auto overscroll-contain rounded-xl [touch-action:pan-x_pan-y_pinch-zoom]">
              <div className="grid min-w-[64rem] grid-cols-[3.5rem_repeat(21,minmax(2.55rem,1fr))] gap-1 md:min-w-0">
                <div className="sticky left-0 top-0 z-30 rounded-lg bg-slate-900 px-2 py-3 text-center text-xs font-black text-white">
                  −
                </div>
                {tableNumbers.map((subtrahend) => (
                  <div
                    key={`subtrahend-${subtrahend}`}
                    className={`sticky top-0 z-20 rounded-lg px-2 py-3 text-center text-xs font-black ${
                      activeContext?.columnSubtrahend === subtrahend ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-950'
                    }`}
                  >
                    {subtrahend}
                  </div>
                ))}

                {tableNumbers.map((minuend) => [
                  <div
                    key={`minuend-${minuend}`}
                    className={`sticky left-0 z-10 rounded-lg px-2 py-3 text-center text-xs font-black ${
                      activeContext?.rowMinuend === minuend ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-950'
                    }`}
                  >
                    {minuend}
                  </div>,
                  ...tableNumbers.map((subtrahend) => {
                    const fact = factsById.get(factId({ minuend, subtrahend }))

                    if (!fact) {
                      return <div key={`empty-${minuend}-${subtrahend}`} className="min-h-11 rounded-lg bg-slate-100/60 sm:min-h-10 lg:min-h-9" />
                    }

                    const isSelected = activeFact?.id === fact.id

                    return (
                      <button
                        key={fact.id}
                        type="button"
                        aria-label={`${fact.minuend} − ${fact.subtrahend} = ${fact.result}`}
                        aria-pressed={isSelected}
                        className={getFactButtonClasses(fact, activeContext, isSelected)}
                        onClick={() => activateFact(fact)}
                        onFocus={() => activateFact(fact)}
                        onPointerEnter={() => activateFact(fact)}
                        {...getFactDataAttributes(fact, activeContext)}
                      >
                        <span>{fact.result}</span>
                      </button>
                    )
                  }),
                ])}
              </div>
            </div>
          </section>

          <aside className="grid gap-4 xl:sticky xl:top-4 xl:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-4" role="status" aria-live="polite">
              {activeFact ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{strings.activeCalculation}</p>
                    <p className="mt-1 text-4xl font-black">
                      {activeFact.minuend} − {activeFact.subtrahend} = {activeFact.result}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm leading-6 text-slate-700">
                    <p>
                      <strong>{strings.groupPrefix}: {strings.groups[activeFact.primaryGroup].label}</strong>
                    </p>
                    <p>{strings.groups[activeFact.primaryGroup].description}</p>
                    {activeFact.subgroups.length > 0 ? (
                      <ul className="space-y-1">
                        {activeFact.subgroups.map((subgroup) => (
                          <li key={subgroup} className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-950">
                            {strings.subgroupPrefix}: {strings.subgroups[subgroup]}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <dl className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                    <div className="rounded-xl bg-blue-100 p-2 text-blue-950">
                      <dt>{strings.minuendPrefix}</dt>
                      <dd className="text-xl">{activeFact.minuend}</dd>
                    </div>
                    <div className="rounded-xl bg-rose-100 p-2 text-rose-950">
                      <dt>{strings.subtrahendPrefix}</dt>
                      <dd className="text-xl">{activeFact.subtrahend}</dd>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2 text-white">
                      <dt>{strings.resultPrefix}</dt>
                      <dd className="text-xl">{activeFact.result}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xl font-black">{strings.noSelectionTitle}</p>
                  <p className="text-sm leading-6 text-slate-700">{strings.noSelectionText}</p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h2 className="text-lg font-black">{strings.legendTitle}</h2>
              <div className="mt-3 grid gap-2 text-sm">
                {Object.entries(strings.groups).map(([group, copy]) => (
                  <div key={group} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2">
                    <span className={`h-4 w-4 rounded-full ${groupAccentStyles[group as keyof typeof groupAccentStyles]}`} />
                    <span>{copy.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
