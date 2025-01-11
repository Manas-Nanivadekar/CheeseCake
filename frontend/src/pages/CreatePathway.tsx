import { Play, Upload, LinkIcon, Plus } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import SelectedTemplates from '@/components/SelectTemplates'
import { CheesieGuide } from '@/components/ChessieGuide'

const AgendaSection = () => {
    const [currentStep, setCurrentStep] = useState<'upload' | 'name' | 'templates' | 'build'>('upload');
    const [pathwayName, setPathwayName] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [url, setUrl] = useState('');

    const toggleTemplate = useCallback((id: string) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    }, []);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileUploaded(true);
            setCurrentStep('name');
        }
    }, []);

    const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    }, []);

    const handleUrlSubmit = useCallback(() => {
        if (url.trim()) {
            setFileUploaded(true);
            setCurrentStep('name');
        }
    }, [url]);

    const handleNameSubmit = useCallback(() => {
        if (pathwayName.trim()) {
            setCurrentStep('templates');
        }
    }, [pathwayName]);

    const handleTemplateSelection = useCallback(() => {
        if (selectedTemplates.length > 0) {
            setCurrentStep('build');
        }
    }, [selectedTemplates]);

    const templates = [
        { id: '1', title: 'Fill in the blanks' },
        { id: '2', title: 'Multiple Choice Questions' },
        { id: '3', title: 'Review Based Questions' },
        { id: '4', title: 'Arrange in Correct Order' },
        { id: '5', title: 'Basic puzzles' },
    ];

    return (
        <section className="w-full bg-[#FFFC6D] min-h-screen">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-[#0A0B1F]">
                                Learning Pathway
                            </h2>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A0B1F] leading-tight">
                                Create customized pathway in minutes.
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-[#0A0B1F]/80 max-w-xl">
                            Build your plan, even for multiple days. Gather your requirements.
                            Generate a gamified pathway in seconds.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                className="bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300 px-8 py-6 text-lg rounded-full"
                            >
                                Get started
                            </Button>
                            <Button
                                variant="outline"
                                className="border-[#0A0B1F] text-[#0A0B1F] hover:bg-white hover:text-[#0A0B1F] transition-colors duration-300 px-8 py-6 text-lg rounded-full"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                See Pathway creation in action
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-[#94a4ff] rounded-2xl p-4 shadow-xl">
                            <img
                                src="/api/placeholder/400/300"
                                alt="Agenda Planner Interface"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="absolute -z-10 top-8 right-8 w-full h-full bg-[#3EEEC0]/20 rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="min-h-screen bg-[#f7f8fa] py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Upload Section */}
                        <Card className={`p-6 ${currentStep !== 'upload' ? 'opacity-50' : ''}`}>
                            <h2 className="text-2xl font-bold text-[#0A0B1F] mb-6">Create New Pathway</h2>
                            <Tabs defaultValue="file" className="w-full">
                                <TabsList className="mb-6">
                                    <TabsTrigger value="file" className="flex items-center gap-2">
                                        <Upload size={20} />
                                        Upload File
                                    </TabsTrigger>
                                    <TabsTrigger value="url" className="flex items-center gap-2">
                                        <LinkIcon size={20} />
                                        Enter URL
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="file">
                                    <div className="border-2 border-dashed border-[#94a4ff] rounded-lg p-8 text-center">
                                        <Input
                                            type="file"
                                            className="hidden"
                                            id="file-upload"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileUpload}
                                        />
                                        <Label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center cursor-pointer"
                                        >
                                            <Upload className="h-12 w-12 text-[#94a4ff] mb-4" />
                                            <span className="text-lg font-medium text-[#0A0B1F]">
                                                Drop your file here or click to upload
                                            </span>
                                            <span className="text-sm text-gray-500 mt-2">
                                                Supports PDF, DOC, DOCX
                                            </span>
                                        </Label>
                                    </div>
                                </TabsContent>
                                <TabsContent value="url">
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <Input
                                                type="url"
                                                placeholder="Enter your URL here"
                                                className="w-full p-4"
                                                value={url}
                                                onChange={handleUrlChange}
                                            />
                                            <Button 
                                                onClick={handleUrlSubmit}
                                                disabled={!url.trim()}
                                                className="bg-[#0A0B1F] text-white"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* Pathway Name */}
                        <Card className={`p-6 ${currentStep !== 'name' ? 'opacity-50' : ''}`}>
                            <Label htmlFor="pathway-name" className="text-lg font-medium text-[#0A0B1F] mb-2 block">
                                Pathway Name
                            </Label>
                            <div className="flex gap-4">
                                <Input
                                    id="pathway-name"
                                    placeholder="Enter a name for your pathway"
                                    className="w-full p-4"
                                    value={pathwayName}
                                    onChange={(e) => setPathwayName(e.target.value)}
                                />
                                <Button
                                    onClick={handleNameSubmit}
                                    disabled={!pathwayName.trim()}
                                    className="bg-[#0A0B1F] text-white"
                                >
                                    Next
                                </Button>
                            </div>
                        </Card>

                        {/* Template Selection */}
                        <div className={`space-y-6 ${currentStep !== 'templates' ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-[#0A0B1F]">
                                    Select Templates
                                </h3>
                                <span className="text-sm text-[#0A0B1F]/60">
                                    {selectedTemplates.length} selected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((template) => (
                                    <motion.div
                                        key={template.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card
                                            className={`cursor-pointer transition-colors duration-200 ${
                                                selectedTemplates.includes(template.id)
                                                    ? 'border-[#3EEEC0] bg-[#3EEEC0]/10'
                                                    : 'hover:border-[#94a4ff]'
                                            }`}
                                            onClick={() => toggleTemplate(template.id)}
                                        >
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <span className="font-medium">{template.title}</span>
                                                <Plus className={`h-5 w-5 ${
                                                    selectedTemplates.includes(template.id)
                                                        ? 'text-[#3EEEC0]'
                                                        : 'text-[#94a4ff]'
                                                }`} />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                            {selectedTemplates.length > 0 && (
                                <Button
                                    onClick={handleTemplateSelection}
                                    className="mt-6 bg-[#0A0B1F] text-white"
                                >
                                    Continue with Selected Templates
                                </Button>
                            )}
                        </div>

                        {/* Selected Templates Display */}
                        <SelectedTemplates
                            templates={templates}
                            selectedIds={selectedTemplates}
                            onRemove={toggleTemplate}
                        />

                        {/* Final Build Button */}
                        {currentStep === 'build' && (
                            <div className="flex justify-center pt-8">
                                <Button
                                    className="bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300 px-8 py-6 text-lg rounded-full"
                                >
                                    Start Building New Pathway
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cheesie Guide */}
            <CheesieGuide
                currentStep={currentStep}
                onComplete={() => console.log('Pathway creation completed!')}
            />
        </section>
    );
};

export default AgendaSection;