import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface Student {
  name: string
  subjects: { [key: string]: number }
  average?: number
}

interface ChartsSectionProps {
  students: Student[]
}

export function ChartsSection({ students }: ChartsSectionProps) {
  if (students.length === 0) {
    return null
  }

  // Données pour le graphique en barres (moyennes par matière)
  const subjectAverages = new Map<string, { total: number; count: number }>()
  
  students.forEach(student => {
    Object.entries(student.subjects).forEach(([subject, grade]) => {
      if (!subjectAverages.has(subject)) {
        subjectAverages.set(subject, { total: 0, count: 0 })
      }
      const current = subjectAverages.get(subject)!
      current.total += grade
      current.count += 1
    })
  })
  
  const subjectData = Array.from(subjectAverages.entries()).map(([subject, data]) => ({
    subject,
    moyenne: data.total / data.count
  }))

  // Données pour le graphique linéaire (évolution des moyennes par étudiant)
  const studentData = students.map(student => ({
    name: student.name.split(' ')[0], // Prénom seulement
    moyenne: student.average || 0
  })).sort((a, b) => b.moyenne - a.moyenne)

  // Données pour le camembert (répartition des notes)
  const gradeDistribution = [
    { name: "Excellent (16-20)", value: 0, color: "#10b981" },
    { name: "Bien (14-16)", value: 0, color: "#3b82f6" },
    { name: "Assez bien (12-14)", value: 0, color: "#f59e0b" },
    { name: "Passable (10-12)", value: 0, color: "#ef4444" },
    { name: "Insuffisant (<10)", value: 0, color: "#6b7280" }
  ]

  students.forEach(student => {
    Object.values(student.subjects).forEach(grade => {
      if (grade >= 16) gradeDistribution[0].value++
      else if (grade >= 14) gradeDistribution[1].value++
      else if (grade >= 12) gradeDistribution[2].value++
      else if (grade >= 10) gradeDistribution[3].value++
      else gradeDistribution[4].value++
    })
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres - Moyennes par matière */}
        <Card>
          <CardHeader>
            <CardTitle>Moyennes par matière</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 20]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}/20`, 'Moyenne']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="moyenne" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique linéaire - Classement des étudiants */}
        <Card>
          <CardHeader>
            <CardTitle>Classement des étudiants</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 20]} />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}/20`, 'Moyenne']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="moyenne" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique camembert - Répartition des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={gradeDistribution.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Nombre de notes']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}