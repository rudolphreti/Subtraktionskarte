import { describe, expect, it } from 'bun:test'
import { buildSubtractionFacts, classifyFact, getHighlightContext } from './subtractionGroups'

describe('subtraction group classification', () => {
  it('builds every non-negative subtraction fact up to 20', () => {
    const facts = buildSubtractionFacts(20)

    expect(facts).toHaveLength(231)
    expect(facts[0]).toMatchObject({ minuend: 0, subtrahend: 0, result: 0 })
    expect(facts.at(-1)).toMatchObject({ minuend: 20, subtrahend: 20, result: 0 })
  })

  it('classifies the three requested subgroups inside crossing-below-ten facts', () => {
    expect(classifyFact({ minuend: 11, subtrahend: 6, result: 5 }).tags).toEqual(
      expect.arrayContaining(['crossingBelowTen', 'resultFive']),
    )
    expect(classifyFact({ minuend: 14, subtrahend: 7, result: 7 }).tags).toEqual(
      expect.arrayContaining(['crossingBelowTen', 'resultEqualsSubtrahend']),
    )
    expect(classifyFact({ minuend: 18, subtrahend: 9, result: 9 }).tags).toEqual(
      expect.arrayContaining(['crossingBelowTen', 'resultNine']),
    )
  })

  it('classifies the remaining main teaching groups', () => {
    expect(classifyFact({ minuend: 15, subtrahend: 3, result: 12 }).primaryGroup).toBe('crossingAboveTen')
    expect(classifyFact({ minuend: 18, subtrahend: 12, result: 6 }).primaryGroup).toBe('bothAtLeastTen')
    expect(classifyFact({ minuend: 9, subtrahend: 4, result: 5 }).primaryGroup).toBe('bothAtMostTen')
  })

  it('returns overlapping row, column, result, primary-group and subgroup highlights', () => {
    const context = getHighlightContext({ minuend: 14, subtrahend: 9, result: 5 })

    expect(context.rowMinuend).toBe(14)
    expect(context.columnSubtrahend).toBe(9)
    expect(context.result).toBe(5)
    expect(context.primaryGroup).toBe('crossingBelowTen')
    expect(context.subgroups).toEqual(['resultFive'])
  })
})
