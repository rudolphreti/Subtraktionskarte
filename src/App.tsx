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
import { groupStyles, subgroupRingStyles } from './ui/groupStyles'

const LIMIT = 20

const tableNumbers = Array.from({ length: LIMIT + 1 }, (_, index) => index)

const getFactButtonClasses = (fact: ClassifiedFact, active: HighlightContext | null, isSelected: boolean) => {
  const isActiveGroup = active?.primaryGroup === fact.primaryGroup
  const isActiveResult = active?.result === fact.result
  const activeSubgroup = active?.subgroups.find((subgroup) => fact.subgroups.includes(subgroup))

  return [
    'relative flex h-full w-full min-w-0 touch-manipulation select-none items-center justify-center rounded-[2px] border text-[clamp(0.35rem,1.6vmin,0.75rem)] font-semibold transition duration-150 sm:rounded-md',
    groupStyles[fact.primaryGroup],
    isActiveGroup ? 'opacity-100 saturate-150' : active ? 'opacity-35 grayscale' : 'opacity-90',
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

  const getTooltipId = (fact: ClassifiedFact) => `tooltip-${fact.id}`

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 p-1 text-slate-950">
      <div className="flex h-full w-full items-center justify-center overflow-visible" aria-label="Subtraktionstabelle">
        <div
          data-testid="subtraction-table-grid"
          className="grid [--table-cell-size:min(calc((100vw-0.5rem-21px)/22),calc((100dvh-0.5rem-21px)/22))] auto-rows-[var(--table-cell-size)] grid-cols-[repeat(22,var(--table-cell-size))] gap-px"
        >
          <div className="sticky left-0 top-0 z-30 flex items-center justify-center rounded-[2px] bg-slate-900 text-center text-[clamp(0.35rem,1.6vmin,0.75rem)] font-black text-white sm:rounded-md">
            −
          </div>
          {tableNumbers.map((subtrahend) => (
            <div
              key={`subtrahend-${subtrahend}`}
              className={`sticky top-0 z-20 flex items-center justify-center rounded-[2px] text-center text-[clamp(0.35rem,1.6vmin,0.75rem)] font-black sm:rounded-md ${
                activeContext?.columnSubtrahend === subtrahend ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {subtrahend}
            </div>
          ))}

          {tableNumbers.map((minuend) => [
            <div
              key={`minuend-${minuend}`}
              className={`sticky left-0 z-10 flex items-center justify-center rounded-[2px] text-center text-[clamp(0.35rem,1.6vmin,0.75rem)] font-black sm:rounded-md ${
                activeContext?.rowMinuend === minuend ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-950'
              }`}
            >
              {minuend}
            </div>,
            ...tableNumbers.map((subtrahend) => {
              const fact = factsById.get(factId({ minuend, subtrahend }))

              if (!fact) {
                return <div key={`empty-${minuend}-${subtrahend}`} className="h-full w-full rounded-[2px] bg-slate-100/60 sm:rounded-md" />
              }

              const isSelected = activeFact?.id === fact.id

              return (
                <button
                  key={fact.id}
                  type="button"
                  aria-label={`${fact.minuend} − ${fact.subtrahend} = ${fact.result}`}
                  aria-describedby={isSelected ? getTooltipId(fact) : undefined}
                  aria-pressed={isSelected}
                  className={getFactButtonClasses(fact, activeContext, isSelected)}
                  onClick={() => activateFact(fact)}
                  {...getFactDataAttributes(fact, activeContext)}
                >
                  <span>{fact.result}</span>
                  {isSelected ? (
                    <span
                      id={getTooltipId(fact)}
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 w-[min(18rem,90vw)] -translate-x-1/2 rounded-xl border border-slate-900 bg-white p-3 text-left text-xs font-semibold leading-5 text-slate-950 shadow-xl"
                    >
                      <span className="block text-base font-black">
                        {fact.minuend} − {fact.subtrahend} = {fact.result}
                      </span>
                      <span className="mt-2 block">
                        {strings.groupPrefix}: {strings.groups[fact.primaryGroup].label}
                      </span>
                      <span className="mt-1 block font-normal text-slate-700">{strings.groups[fact.primaryGroup].description}</span>
                      {fact.subgroups.map((subgroup) => (
                        <span key={subgroup} className="mt-2 block rounded-lg bg-slate-100 px-2 py-1">
                          {strings.subgroupPrefix}: {strings.subgroups[subgroup]}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              )
            }),
          ])}
        </div>
      </div>
    </main>
  )
}

export default App
