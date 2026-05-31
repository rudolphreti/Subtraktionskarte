import type { TeachingGroupId, TeachingSubgroupId } from '../domain/subtractionGroups'

export const groupStyles: Record<TeachingGroupId, string> = {
  crossingBelowTen: 'border-amber-400 bg-amber-100 text-amber-950',
  crossingAboveTen: 'border-sky-400 bg-sky-100 text-sky-950',
  bothAtLeastTen: 'border-violet-400 bg-violet-100 text-violet-950',
  bothAtMostTen: 'border-emerald-400 bg-emerald-100 text-emerald-950',
}

export const groupAccentStyles: Record<TeachingGroupId, string> = {
  crossingBelowTen: 'bg-amber-500',
  crossingAboveTen: 'bg-sky-500',
  bothAtLeastTen: 'bg-violet-500',
  bothAtMostTen: 'bg-emerald-500',
}

export const subgroupRingStyles: Record<TeachingSubgroupId, string> = {
  resultFive: 'ring-4 ring-orange-500',
  resultEqualsSubtrahend: 'ring-4 ring-fuchsia-500',
  resultNine: 'ring-4 ring-cyan-500',
}
