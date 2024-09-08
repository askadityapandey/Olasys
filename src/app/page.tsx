import RepoForm from '../components/RepoForms'
import RepoStats from '../components/RepoStats'
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">GitHub Repository Statistics</h1>
      <RepoForm />
      <RepoStats />
    </main>
  )
}