import React, { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataUploadProps {
  onDataUpload: (data: any[]) => void
}

interface ParsedStudent {
  name: string
  subjects: { [key: string]: number }
  average?: number
}

export function DataUpload({ onDataUpload }: DataUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const parseCSV = (text: string): ParsedStudent[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) throw new Error('Le fichier doit contenir au moins 2 lignes (en-tête + données)')
    
    const headers = lines[0].split(',').map(h => h.trim())
    const students: ParsedStudent[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue
      
      const student: ParsedStudent = {
        name: values[0],
        subjects: {}
      }
      
      let totalGrades = 0
      let gradeCount = 0
      
      for (let j = 1; j < headers.length; j++) {
        const grade = parseFloat(values[j])
        if (!isNaN(grade)) {
          student.subjects[headers[j]] = grade
          totalGrades += grade
          gradeCount++
        }
      }
      
      student.average = gradeCount > 0 ? totalGrades / gradeCount : 0
      students.push(student)
    }
    
    return students
  }

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text()
      const students = parseCSV(text)
      
      if (students.length === 0) {
        throw new Error('Aucune donnée valide trouvée dans le fichier')
      }
      
      onDataUpload(students)
      setUploadStatus({
        type: 'success',
        message: `${students.length} étudiants importés avec succès`
      })
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'importation'
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'))
    
    if (csvFile) {
      handleFileUpload(csvFile)
    } else {
      setUploadStatus({
        type: 'error',
        message: 'Veuillez sélectionner un fichier CSV'
      })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const loadSampleData = () => {
    const sampleData: ParsedStudent[] = [
      {
        name: "Alice Martin",
        subjects: { "Mathématiques": 18, "Physique": 16, "Français": 15, "Histoire": 17 },
        average: 16.5
      },
      {
        name: "Bob Dupont", 
        subjects: { "Mathématiques": 12, "Physique": 14, "Français": 18, "Histoire": 13 },
        average: 14.25
      },
      {
        name: "Claire Bernard",
        subjects: { "Mathématiques": 15, "Physique": 17, "Français": 16, "Histoire": 19 },
        average: 16.75
      },
      {
        name: "David Rousseau",
        subjects: { "Mathématiques": 9, "Physique": 11, "Français": 14, "Histoire": 12 },
        average: 11.5
      },
      {
        name: "Emma Leroy",
        subjects: { "Mathématiques": 19, "Physique": 18, "Français": 17, "Histoire": 16 },
        average: 17.5
      }
    ]
    
    onDataUpload(sampleData)
    setUploadStatus({
      type: 'success',
      message: 'Données d\'exemple chargées avec succès'
    })
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importer les données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            Déposez votre fichier CSV ici
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Format: Nom, Matière1, Matière2, ...
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Choisir un fichier
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {uploadStatus.type !== 'idle' && (
          <div
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg text-sm",
              uploadStatus.type === 'success'
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {uploadStatus.message}
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ou essayez avec des données d'exemple
          </p>
          <Button onClick={loadSampleData} variant="secondary">
            Charger des données d'exemple
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}