export type TeachingGroupId =
  | 'crossingBelowTen'
  | 'crossingAboveTen'
  | 'bothAtLeastTen'
  | 'bothAtMostTen'

export type TeachingSubgroupId = 'resultFive' | 'resultEqualsSubtrahend' | 'resultNine'

export type SubtractionFact = {
  minuend: number
  subtrahend: number
  result: number
}

export type ClassifiedFact = SubtractionFact & {
  id: string
  primaryGroup: TeachingGroupId
  tags: Array<TeachingGroupId | TeachingSubgroupId>
  subgroups: TeachingSubgroupId[]
}

export type HighlightContext = {
  rowMinuend: number
  columnSubtrahend: number
  result: number
  primaryGroup: TeachingGroupId
  subgroups: TeachingSubgroupId[]
}

const isCrossingBelowTen = ({ minuend, subtrahend, result }: SubtractionFact) =>
  minuend > 10 && subtrahend < 10 && result < 10

const isCrossingAboveTen = ({ minuend, subtrahend, result }: SubtractionFact) =>
  minuend > 10 && subtrahend < 10 && result >= 10

const isBothAtLeastTen = ({ minuend, subtrahend }: SubtractionFact) => minuend >= 10 && subtrahend >= 10

const isBothAtMostTen = ({ minuend, subtrahend }: SubtractionFact) => minuend <= 10 && subtrahend <= 10

export const factId = ({ minuend, subtrahend }: Pick<SubtractionFact, 'minuend' | 'subtrahend'>) =>
  `${minuend}-${subtrahend}`

export const buildSubtractionFacts = (limit = 20): SubtractionFact[] => {
  const facts: SubtractionFact[] = []

  for (let minuend = 0; minuend <= limit; minuend += 1) {
    for (let subtrahend = 0; subtrahend <= minuend; subtrahend += 1) {
      facts.push({ minuend, subtrahend, result: minuend - subtrahend })
    }
  }

  return facts
}

export const getSubgroups = (fact: SubtractionFact): TeachingSubgroupId[] => {
  if (!isCrossingBelowTen(fact)) {
    return []
  }

  const subgroups: TeachingSubgroupId[] = []

  if (fact.result === 5) {
    subgroups.push('resultFive')
  }

  if (fact.result === fact.subtrahend) {
    subgroups.push('resultEqualsSubtrahend')
  }

  if (fact.result === 9) {
    subgroups.push('resultNine')
  }

  return subgroups
}

export const getPrimaryGroup = (fact: SubtractionFact): TeachingGroupId => {
  if (isCrossingBelowTen(fact)) {
    return 'crossingBelowTen'
  }

  if (isCrossingAboveTen(fact)) {
    return 'crossingAboveTen'
  }

  if (isBothAtLeastTen(fact)) {
    return 'bothAtLeastTen'
  }

  if (isBothAtMostTen(fact)) {
    return 'bothAtMostTen'
  }

  return 'crossingBelowTen'
}

export const classifyFact = (fact: SubtractionFact): ClassifiedFact => {
  const primaryGroup = getPrimaryGroup(fact)
  const subgroups = getSubgroups(fact)

  return {
    ...fact,
    id: factId(fact),
    primaryGroup,
    subgroups,
    tags: [primaryGroup, ...subgroups],
  }
}

export const getHighlightContext = (fact: SubtractionFact): HighlightContext => {
  const classified = classifyFact(fact)

  return {
    rowMinuend: fact.minuend,
    columnSubtrahend: fact.subtrahend,
    result: fact.result,
    primaryGroup: classified.primaryGroup,
    subgroups: classified.subgroups,
  }
}
