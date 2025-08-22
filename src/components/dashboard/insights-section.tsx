import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, User, BookOpen } from "lucide-react"

interface Student {
  name: string
  subjects: { [key: string]: number }
  average?: number
}

interface InsightsSectionProps {
  students: Student[]
}

export function InsightsSection({ students }: InsightsSectionProps) {
  if (students.length === 0) {
    return null
  }

  // Analyse des performances par étudiant
  const studentInsights = students.map(student => {
    const grades = Object.values(student.subjects)
    const average = student.average || 0
    const bestSubject = Object.entries(student.subjects).reduce((best, current) => 
      current[1] > best[1] ? current : best
    )
    const worstSubject = Object.entries(student.subjects).reduce((worst, current) => 
      current[1] < worst[1] ? current : worst
    )
    
    return {
      ...student,
      bestSubject: bestSubject[0],
      bestGrade: bestSubject[1],
      worstSubject: worstSubject[0],
      worstGrade: worstSubject[1],
      needsImprovement: average < 12
    }
  })

  // Analyse des matières
  const subjectPerformance = new Map<string, { total: number; count: number; grades: number[] }>()
  
  students.forEach(student => {
    Object.entries(student.subjects).forEach(([subject, grade]) => {
      if (!subjectPerformance.has(subject)) {
        subjectPerformance.set(subject, { total: 0, count: 0, grades: [] })
      }
      const current = subjectPerformance.get(subject)!
      current.total += grade
      current.count += 1
      current.grades.push(grade)
    })
  })
  
  const subjectInsights = Array.from(subjectPerformance.entries()).map(([subject, data]) => {
    const average = data.total / data.count
    const successRate = data.grades.filter(grade => grade >= 10).length / data.grades.length
    return {
      subject,
      average,
      successRate,
      isStrong: average >= 14,
      needsAttention: average < 12 || successRate < 0.7
    }
  })

  // Top et bottom performers
  const sortedStudents = [...studentInsights].sort((a, b) => (b.average || 0) - (a.average || 0))
  const topPerformers = sortedStudents.slice(0, 3)
  const strugglingStudents = sortedStudents.filter(s => s.needsImprovement).slice(-3)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Étudiants performants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Top étudiants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topPerformers.map((student, index) => (
            <div key={student.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Point fort: {student.bestSubject} ({student.bestGrade}/20)
                  </p>
                </div>
              </div>
              <Badge variant="secondary">
                {student.average?.toFixed(1)}/20
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Étudiants à accompagner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-warning" />
            Étudiants à accompagner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {strugglingStudents.length > 0 ? (
            strugglingStudents.map((student) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    À améliorer: {student.worstSubject} ({student.worstGrade}/20)
                  </p>
                </div>
                <Badge variant="destructive">
                  {student.average?.toFixed(1)}/20
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Tous les étudiants ont une moyenne satisfaisante !
            </p>
          )}
        </CardContent>
      </Card>

      {/* Matières performantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Matières performantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjectInsights
            .filter(subject => subject.isStrong)
            .map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <span className="font-medium">{subject.subject}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {subject.average.toFixed(1)}/20
                  </Badge>
                  <Badge variant="outline">
                    {(subject.successRate * 100).toFixed(0)}% réussite
                  </Badge>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Matières à renforcer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Matières à renforcer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subjectInsights
            .filter(subject => subject.needsAttention)
            .map((subject) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <span className="font-medium">{subject.subject}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">
                    {subject.average.toFixed(1)}/20
                  </Badge>
                  <Badge variant="outline">
                    {(subject.successRate * 100).toFixed(0)}% réussite
                  </Badge>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}