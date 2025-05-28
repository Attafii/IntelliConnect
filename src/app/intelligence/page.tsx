"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UploadCloud, FileText, AlertCircle, MessageSquare, Brain, BarChartBig, Lightbulb } from 'lucide-react';

// Placeholder types - replace with actual data structures
interface ProjectSummary {
  projectName: string;
  timeline: string;
  milestones: string[];
  tasks: { name: string; status: string; assignee: string; deadline: string }[];
  resources: string;
  budgetVsActual: string;
  risks: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
}

interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  type: 'delay' | 'cm_risk' | 'opportunity';
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const IntelligencePage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/pdf')) {
      setUploadedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setError(null);
      setIsLoading(true);

      // Simulate API call for file upload and analysis
      try {
        const formData = new FormData();
        formData.append('file', file);
        // const response = await fetch('/api/analysis/upload', { method: 'POST', body: formData });
        // if (!response.ok) throw new Error('File processing failed');
        // const data = await response.json();
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
        const mockSummary: ProjectSummary = {
          projectName: 'Project Phoenix',
          timeline: 'Q1 2024 - Q4 2024',
          milestones: ['Alpha Release', 'Beta Release', 'GA'],
          tasks: [
            { name: 'UI Design', status: 'Completed', assignee: 'Alice', deadline: '2024-03-15' },
            { name: 'Backend Dev', status: 'In Progress', assignee: 'Bob', deadline: '2024-06-30' },
          ],
          resources: '5 Developers, 2 Designers',
          budgetVsActual: '$50,000 / $45,000',
          risks: ['Potential delay in backend integration'],
        };
        const mockInsights: PredictiveInsight[] = [
          { id: '1', title: 'Potential Delay', description: 'Backend integration might take longer than expected.', type: 'delay' },
          { id: '2', title: 'CM at Risk', description: 'Current burn rate suggests CM might be lower.', type: 'cm_risk' },
        ];
        setSummary(mockSummary);
        setPredictiveInsights(mockInsights);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setSummary(null);
        setPredictiveInsights([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Invalid file type. Please upload a .csv or .pdf file.');
      setUploadedFile(null);
      setFilePreview(null);
    }
  }, []);

  const handleChatMessageSend = async () => {
    if (!chatInput.trim()) return;
    const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      // const response = await fetch('/api/analysis/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: chatInput, context: summary }) // Send summary as context
      // });
      // if (!response.ok) throw new Error('Chat API failed');
      // const data = await response.json();
      
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1500));
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Regarding "${chatInput}", the data suggests... (mock response)`,
      };
      setChatMessages(prev => [...prev, agentResponse]);

    } catch (err) {
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Sorry, I couldn't process that: ${err instanceof Error ? err.message : 'Unknown error'}`,
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 bg-background text-foreground">
      <motion.div {...fadeInUp}>
        <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center">
          <Lightbulb className="w-10 h-10 mr-3 text-accent" /> Project Intelligence Agent
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload your project files (.csv, .pdf) to get insights, summaries, and ask questions.
        </p>
      </motion.div>

      <Separator />

      {/* Upload Section */}
      <motion.div {...fadeInUp}>
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center"><UploadCloud className="mr-2 text-primary" /> Upload Project File</CardTitle>
            <CardDescription>Accepted formats: .csv, .pdf</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="file" accept=".csv,.pdf" onChange={handleFileUpload} className="border-dashed border-2 border-primary/50 p-4 hover:border-primary transition-colors duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            {filePreview && (
              <motion.div {...fadeIn} className="mt-4 p-4 border rounded-lg bg-muted/50 flex items-center space-x-3">
                <FileText className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-semibold">{uploadedFile?.name}</p>
                  <p className="text-sm text-muted-foreground">{(uploadedFile?.size || 0 / 1024).toFixed(2)} KB</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <motion.div {...fadeIn} className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="ml-3 text-muted-foreground">Analyzing your document...</p>
        </motion.div>
      )}

      {error && (
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center"><AlertCircle className="mr-2 text-destructive" /> Error</AlertDialogTitle>
              <AlertDialogDescription>{error}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setError(null)}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Intelligence Summary Section */}
      {summary && !isLoading && (
        <motion.section {...fadeInUp} variants={staggerChildren} className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center"><Brain className="mr-2 text-primary" /> Intelligence Summary</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Project Name</CardTitle></CardHeader>
                <CardContent><p className="text-lg font-medium text-primary">{summary.projectName}</p></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Timeline & Milestones</CardTitle></CardHeader>
                <CardContent>
                  <p><strong>Timeline:</strong> {summary.timeline}</p>
                  <p><strong>Milestones:</strong></p>
                  <ul className="list-disc list-inside ml-4">
                    {summary.milestones.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Task Lists</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {summary.tasks.map((task, i) => (
                    <div key={i} className="p-2 border rounded-md bg-muted/30">
                      <p><strong>{task.name}</strong> (<Badge variant={task.status === 'Completed' ? 'default' : 'secondary'}>{task.status}</Badge>)</p>
                      <p className="text-sm">Assignee: {task.assignee}, Deadline: {task.deadline}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Resource Allocations</CardTitle></CardHeader>
                <CardContent><p>{summary.resources}</p></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Budget vs. Actual</CardTitle></CardHeader>
                <CardContent><p>{summary.budgetVsActual}</p></CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
                <CardHeader><CardTitle>Risks or Delays</CardTitle></CardHeader>
                <CardContent>
                  {summary.risks.length > 0 ? (
                    <ul className="list-disc list-inside ml-4 text-destructive">
                      {summary.risks.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  ) : <p className="text-green-500">No major risks identified.</p>}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Predictive Insights Panel */}
      {predictiveInsights.length > 0 && !isLoading && (
        <motion.section {...fadeInUp} className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center"><BarChartBig className="mr-2 text-primary" /> Predictive Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {predictiveInsights.map(insight => (
              <motion.div key={insight.id} variants={fadeInUp}>
                <Card className={`bg-card/80 backdrop-blur-sm shadow-md border-border/50 ${insight.type === 'delay' || insight.type === 'cm_risk' ? 'border-destructive/50' : 'border-green-500/50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {insight.type === 'delay' && <AlertCircle className="mr-2 text-destructive" />}
                      {insight.type === 'cm_risk' && <AlertCircle className="mr-2 text-destructive" />}
                      {insight.type === 'opportunity' && <Lightbulb className="mr-2 text-green-500" />}
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{insight.description}</p>
                    <Badge variant={insight.type === 'delay' || insight.type === 'cm_risk' ? 'destructive' : 'default'} className="mt-2">
                      {insight.type === 'delay' && '🔮 Potential Delay'}
                      {insight.type === 'cm_risk' && '📉 CM at Risk'}
                      {insight.type === 'opportunity' && '✨ Opportunity'}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Chat Interface */}
      {summary && !isLoading && (
        <motion.section {...fadeInUp} className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center"><MessageSquare className="mr-2 text-primary" /> Chat with Your Data</h2>
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg border-border/50">
            <CardContent className="p-4 space-y-4">
              <div className="h-64 overflow-y-auto p-3 border rounded-md bg-muted/30 space-y-3 flex flex-col">
                {chatMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: msg.sender === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-lg max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground self-end' : 'bg-muted text-foreground self-start'}`}>
                    {msg.text}
                  </motion.div>
                ))}
                 {chatMessages.length === 0 && <p className="text-center text-muted-foreground">Ask a question about the uploaded document.</p>}
              </div>
              <div className="flex space-x-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about project risks, budget, timelines..."
                  className="flex-grow resize-none"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChatMessageSend())}
                />
                <Button onClick={handleChatMessageSend} disabled={isLoading || !chatInput.trim()} className="h-auto">
                  Send
                  {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground ml-2"></div>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

    </div>
  );
};

export default IntelligencePage;