import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Subtraction map interactions', () => {
  it('renders only the subtraction table without page header, legend, or active calculation panel', () => {
    render(<App />)

    expect(screen.getByLabelText('Subtraktionstabelle')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Subtraktionskarte bis 20/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/Legende/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Aktive Rechnung/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '11 − 6 = 5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '18 − 9 = 9' })).toBeInTheDocument()
  })

  it('uses a fluid table grid that fits the viewport instead of forcing a fixed scroll width', () => {
    render(<App />)

    const tableGrid = screen.getByTestId('subtraction-table-grid')
    expect(tableGrid).toHaveClass('w-full')
    expect(tableGrid.className).toContain('repeat(21,minmax(0,1fr))')
    expect(tableGrid.className).not.toContain('min-w-[64rem]')

    expect(screen.getByRole('button', { name: '11 − 6 = 5' }).className).not.toContain('min-w-11')
  })

  it('shows operation information in a tooltip only after clicking a fact', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '12 − 6 = 6' }))

    const tooltip = screen.getByRole('tooltip')
    expect(within(tooltip).getByText('12 − 6 = 6')).toBeInTheDocument()
    expect(within(tooltip).getByText(/Gruppe: Über den Zehner, Ergebnis unter 10/i)).toBeInTheDocument()
    expect(within(tooltip).getByText(/Untergruppe: Ergebnis ist gleich dem Subtrahenden/i)).toBeInTheDocument()
  })

  it('highlights the group, result, minuend row and subtrahend column without red or blue result styling', async () => {
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
    expect(focusedFact).not.toHaveClass('outline-rose-500')
    expect(focusedFact.className).not.toContain('rgb(30_64_175)')

    const sameResult = screen.getByRole('button', { name: '11 − 6 = 5' })
    expect(sameResult).toHaveAttribute('data-active-result', 'true')
    expect(sameResult).toHaveAttribute('data-active-primary-group', 'crossingBelowTen')
    expect(sameResult).not.toHaveClass('outline-rose-500')
    expect(sameResult.className).not.toContain('rgb(30_64_175)')

    const sameColumn = screen.getByRole('button', { name: '17 − 9 = 8' })
    expect(sameColumn).toHaveAttribute('data-active-column', 'true')
    expect(sameColumn).not.toHaveClass('outline-rose-500')
  })
})
