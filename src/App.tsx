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
    'relative flex aspect-square w-full min-w-0 touch-manipulation select-none items-center justify-center rounded-sm border text-[0.5rem] font-semibold transition duration-150 sm:rounded-md sm:text-[0.65rem] md:rounded-lg lg:text-xs',
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
    <main className="min-h-screen bg-slate-50 px-1 py-2 text-slate-950 sm:px-3 lg:px-4">
      <div className="w-full overflow-visible" aria-label="Subtraktionstabelle">
        <div
          data-testid="subtraction-table-grid"
          className="grid w-full grid-cols-[clamp(1.25rem,5vw,3.5rem)_repeat(21,minmax(0,1fr))] gap-0.5 sm:gap-1"
        >
          <div className="sticky left-0 top-0 z-30 rounded-sm bg-slate-900 px-0.5 py-1 text-center text-[0.55rem] font-black text-white sm:rounded-lg sm:px-2 sm:py-3 sm:text-xs">
            −
          </div>
          {tableNumbers.map((subtrahend) => (
            <div
              key={`subtrahend-${subtrahend}`}
              className={`sticky top-0 z-20 rounded-sm px-0.5 py-1 text-center text-[0.55rem] font-black sm:rounded-lg sm:px-2 sm:py-3 sm:text-xs ${
                activeContext?.columnSubtrahend === subtrahend ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-950'
              }`}
            >
              {subtrahend}
            </div>
          ))}

          {tableNumbers.map((minuend) => [
            <div
              key={`minuend-${minuend}`}
              className={`sticky left-0 z-10 rounded-sm px-0.5 py-1 text-center text-[0.55rem] font-black sm:rounded-lg sm:px-2 sm:py-3 sm:text-xs ${
                activeContext?.rowMinuend === minuend ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-950'
              }`}
            >
              {minuend}
            </div>,
            ...tableNumbers.map((subtrahend) => {
              const fact = factsById.get(factId({ minuend, subtrahend }))

              if (!fact) {
                return <div key={`empty-${minuend}-${subtrahend}`} className="aspect-square w-full rounded-sm bg-slate-100/60 sm:rounded-lg" />
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
