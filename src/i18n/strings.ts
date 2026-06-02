import type { TeachingGroupId, TeachingSubgroupId } from '../domain/subtractionGroups'

type TeachingGroupCopy = {
  label: string
  description: string
}

export const strings = {
  appTitle: 'Subtraktionskarte bis 20',
  eyebrow: 'Didaktische Gruppen fürs Subtrahieren',
  intro:
    'Tippe eine Rechnung an. Die Karte markiert dann die passende didaktische Gruppe farbig.',
  noSelectionTitle: 'Noch keine Rechnung ausgewählt',
  noSelectionText: 'Tippe eine Rechnung an, um die passende Gruppe deutlich zu sehen.',
  activeCalculation: 'Aktive Rechnung',
  groupPrefix: 'Gruppe',
  noTeachingGroup: 'Keine der vier Gruppen',
  subgroupPrefix: 'Untergruppe',
  resultPrefix: 'Ergebnis',
  minuendPrefix: 'Minuend',
  subtrahendPrefix: 'Subtrahend',
  legendTitle: 'Legende',
  mobileHint: 'Am Handy kannst du die Karte mit zwei Fingern zoomen und seitlich verschieben.',
  desktopHint: 'Auf mittleren und großen Bildschirmen passt sich die Karte an die verfügbare Breite an.',
  groups: {
    crossingBelowTen: {
      label: 'Über den Zehner, Ergebnis unter 10',
      description: 'Minuend ist größer als 10, Subtrahend kleiner als 10 und das Ergebnis liegt unter 10.',
    },
    crossingAboveTen: {
      label: 'Über den Zehner, Ergebnis über 10',
      description: 'Minuend ist größer als 10, Subtrahend kleiner als 10 und das Ergebnis bleibt über 10.',
    },
    bothAtLeastTen: {
      label: 'Beide Zahlen mindestens 10',
      description: 'Minuend und Subtrahend sind beide 10 oder größer.',
    },
    bothAtMostTen: {
      label: 'Beide Zahlen höchstens 10',
      description: 'Minuend und Subtrahend sind beide 10 oder kleiner.',
    },
  } satisfies Record<TeachingGroupId, TeachingGroupCopy>,
  subgroups: {
    resultFive: 'Ergebnis ist 5',
    resultEqualsSubtrahend: 'Ergebnis ist gleich dem Subtrahenden',
    resultNine: 'Ergebnis ist 9',
  } satisfies Record<TeachingSubgroupId, string>,
}
