import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

test("Page will be render", () => {
    render(<Page />)
    expect(screen.getByText("Support the Future of Volleyball in India."))
    expect(screen.getByText("Discover the organizations and individuals shaping the next generation of Indian volleyball."))
})


