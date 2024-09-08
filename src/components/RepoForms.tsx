'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RepoForm() {
  const [repoUrl, setRepoUrl] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const encodedUrl = encodeURIComponent(repoUrl)
    router.push(`/?repo=${encodedUrl}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Paste GitHub repo URL here"
        className="flex-grow"
      />
      <Button type="submit">Fetch Stats</Button>
    </form>
  )
}