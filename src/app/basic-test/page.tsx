'use client'

export const dynamic = 'force-dynamic'

export default function BasicTest() {
  return (
    <div>
      <h1>Basic Test Page</h1>
      <p>If you can see this, Next.js is working.</p>
      <button onClick={() => alert('Button works!')}>
        Test Button
      </button>
    </div>
  )
}
