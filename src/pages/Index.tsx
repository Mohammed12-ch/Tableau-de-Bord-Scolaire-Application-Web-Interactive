import React, { useState } from "react"
import { DataUpload } from "@/components/dashboard/data-upload"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { InsightsSection } from "@/components/dashboard/insights-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BarChart3 } from "lucide-react"

interface Student {
  name: string
  subjects: { [key: string]: number }
  average?: number
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([])

  const handleDataUpload = (data: Student[]) => {
    setStudents(data)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tableau de Bord Scolaire</h1>
              <p className="text-muted-foreground">Analyse et suivi des résultats académiques</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {students.length === 0 ? (
          /* État initial - Importation des données */
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mx-auto">
                <BarChart3 className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">Bienvenue dans votre tableau de bord</h2>
              <p className="text-lg text-muted-foreground">
                Importez vos données pour commencer l'analyse des résultats scolaires
              </p>
            </div>
            
            <DataUpload onDataUpload={handleDataUpload} />
            
            <Card>
              <CardHeader>
                <CardTitle>Format du fichier CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Structure attendue:</p>
                  <code className="block bg-muted p-3 rounded-lg">
                    Nom,Mathématiques,Physique,Français,Histoire<br />
                    Alice Martin,18,16,15,17<br />
                    Bob Dupont,12,14,18,13
                  </code>
                  <p className="text-muted-foreground">
                    La première ligne doit contenir les en-têtes (Nom + noms des matières)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard principal avec données */
          <div className="space-y-8">
            <StatsOverview students={students} />
            <ChartsSection students={students} />
            <InsightsSection students={students} />
            
            {/* Bouton pour réinitialiser */}
            <div className="text-center">
              <button
                onClick={() => setStudents([])}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Importer de nouvelles données
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
