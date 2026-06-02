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

  it('sizes every table cell from both viewport width and height so the whole table stays visible', () => {
    render(<App />)

    const table = screen.getByLabelText('Subtraktionstabelle')
    const tableGrid = screen.getByTestId('subtraction-table-grid')

    expect(table).toHaveClass('h-full')
    expect(table).toHaveClass('overflow-visible')
    expect(tableGrid.className).toContain('--table-cell-size:min(calc((100vw-0.5rem-21px)/22),calc((100dvh-0.5rem-21px)/22))')
    expect(tableGrid.className).toContain('grid-cols-[repeat(22,var(--table-cell-size))]')
    expect(tableGrid.className).toContain('auto-rows-[var(--table-cell-size)]')
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
