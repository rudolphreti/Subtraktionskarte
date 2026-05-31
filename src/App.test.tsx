import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Subtraction map interactions', () => {
  it('renders German UI text and the requested subtraction facts', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /Subtraktionskarte bis 20/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '11 − 6 = 5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '18 − 9 = 9' })).toBeInTheDocument()
  })

  it('highlights a touched or hovered fact, its group, result, minuend row and subtrahend column', async () => {
    const user = userEvent.setup()
    render(<App />)

    const focusedFact = screen.getByRole('button', { name: '14 − 9 = 5' })
    await user.click(focusedFact)

    expect(focusedFact).toHaveAttribute('aria-pressed', 'true')
    expect(focusedFact).toHaveAttribute('data-active-result', 'true')
    expect(focusedFact).toHaveAttribute('data-active-row', 'true')
    expect(focusedFact).toHaveAttribute('data-active-column', 'true')
    expect(focusedFact).toHaveAttribute('data-active-primary-group', 'crossingBelowTen')
    expect(focusedFact).toHaveAttribute('data-active-subgroups', 'resultFive')

    const sameResult = screen.getByRole('button', { name: '11 − 6 = 5' })
    expect(sameResult).toHaveAttribute('data-active-result', 'true')
    expect(sameResult).toHaveAttribute('data-active-primary-group', 'crossingBelowTen')

    const sameColumn = screen.getByRole('button', { name: '17 − 9 = 8' })
    expect(sameColumn).toHaveAttribute('data-active-column', 'true')
  })

  it('shows a non-covering inline explanation panel for the active group', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '12 − 6 = 6' }))

    const panel = screen.getByRole('status')
    expect(within(panel).getByText(/Gruppe: Über den Zehner, Ergebnis unter 10/i)).toBeInTheDocument()
    expect(within(panel).getByText(/Untergruppe: Ergebnis ist gleich dem Subtrahenden/i)).toBeInTheDocument()
  })
})
