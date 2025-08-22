import React from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Users, BookOpen, TrendingUp, Award } from "lucide-react"

interface Student {
  name: string
  subjects: { [key: string]: number }
  average?: number
}

interface StatsOverviewProps {
  students: Student[]
}

export function StatsOverview({ students }: StatsOverviewProps) {
  if (students.length === 0) {
    return null
  }

  // Calculs des statistiques
  const totalStudents = students.length
  const allSubjects = new Set<string>()
  const allGrades: number[] = []
  
  students.forEach(student => {
    Object.keys(student.subjects).forEach(subject => allSubjects.add(subject))
    Object.values(student.subjects).forEach(grade => allGrades.push(grade))
  })
  
  const totalSubjects = allSubjects.size
  const classAverage = allGrades.length > 0 
    ? allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length 
    : 0
  
  const successRate = allGrades.filter(grade => grade >= 10).length / allGrades.length * 100
  
  // Calcul de la tendance (simulation)
  const previousAverage = classAverage - (Math.random() * 2 - 1) // Simulation
  const trend = classAverage - previousAverage

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <StatCard
        title="Étudiants"
        value={totalStudents}
        description="Total des étudiants"
        icon={<Users />}
        variant="primary"
      />
      
      <StatCard
        title="Matières"
        value={totalSubjects}
        description="Matières enseignées"
        icon={<BookOpen />}
        variant="secondary"
      />
      
      <StatCard
        title="Moyenne générale"
        value={`${classAverage.toFixed(1)}/20`}
        description="Moyenne de la promotion"
        icon={<TrendingUp />}
        trend={{
          value: Math.abs(trend),
          isPositive: trend >= 0
        }}
      />
      
      <StatCard
        title="Taux de réussite"
        value={`${successRate.toFixed(1)}%`}
        description="Notes ≥ 10/20"
        icon={<Award />}
        variant={successRate >= 70 ? "success" : successRate >= 50 ? "warning" : "destructive"}
      />
    </div>
  )
}