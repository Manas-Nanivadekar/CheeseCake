import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm"
            >
              <span className="font-medium">{entry.name}</span>
              <span className="text-primary">{entry.score}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Leaderboard