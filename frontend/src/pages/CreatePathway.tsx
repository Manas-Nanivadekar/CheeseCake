import { Play } from 'lucide-react'
import { useState } from 'react'
import { Upload, LinkIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import SelectedTemplates from '@/components/SelectTemplates'

const AgendaSection = () => {

    const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])

    const toggleTemplate = (id: string) => {
        setSelectedTemplates(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    const templates = [
        { id: '1', title: 'Basic Learning Path' },
        { id: '2', title: 'Advanced Course' },
        { id: '3', title: 'Workshop Series' },
        { id: '4', title: 'Certification Track' },
        { id: '5', title: 'Onboarding Program' },
        { id: '6', title: 'Skill Development' },
        { id: '7', title: 'Team Training' },
        { id: '8', title: 'Leadership Course' },
        { id: '9', title: 'Custom Template' },
    ]


    return (
        <section className="w-full bg-[#FFFC6D] min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    {/* Left Column */}
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
                            Generate a gamified pathway in seconds. Thanks to the
                            Cheese Cake, your pathways will practically created themselves.
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

                    {/* Right Column */}
                    <div className="relative">
                        <div className="bg-[#94a4ff] rounded-2xl p-4 shadow-xl">
                            <img
                                src={`https://res.cloudinary.com/dnvh2fya6/image/upload/v1730044621/MyBus/redbus-logo-5B2A75C4DA-seeklogo.com_kheclj.png`}
                                alt="Agenda Planner Interface"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -z-10 top-8 right-8 w-full h-full bg-[#3EEEC0]/20 rounded-2xl"></div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-[#f7f8fa] py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Upload Section */}
                        <Card className="p-6">
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
                                        <Input
                                            type="url"
                                            placeholder="Enter your URL here"
                                            className="w-full p-4"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>

                        {/* Pathway Name */}
                        <Card className="p-6">
                            <Label htmlFor="pathway-name" className="text-lg font-medium text-[#0A0B1F] mb-2 block">
                                Pathway Name
                            </Label>
                            <Input
                                id="pathway-name"
                                placeholder="Enter a name for your pathway"
                                className="w-full p-4"
                            />
                        </Card>

                        {/* Template Grid */}
                        <div className="space-y-6">
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
                                            className={`cursor-pointer transition-colors duration-200 ${selectedTemplates.includes(template.id)
                                                    ? 'border-[#3EEEC0] bg-[#3EEEC0]/10'
                                                    : 'hover:border-[#94a4ff]'
                                                }`}
                                            onClick={() => toggleTemplate(template.id)}
                                        >
                                            <CardContent className="p-6 flex items-center justify-between">
                                                <span className="font-medium">{template.title}</span>
                                                <Plus className={`h-5 w-5 ${selectedTemplates.includes(template.id)
                                                        ? 'text-[#3EEEC0]'
                                                        : 'text-[#94a4ff]'
                                                    }`} />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Selected Templates Component */}
                        <SelectedTemplates
                            templates={templates}
                            selectedIds={selectedTemplates}
                            onRemove={toggleTemplate}
                        />

                        {/* Start Building Button */}
                        <div className="flex justify-center pt-8">
                            <Button
                                className="bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300 px-8 py-6 text-lg rounded-full"
                                disabled={selectedTemplates.length === 0}
                            >
                                Start Building New Pathway
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AgendaSection

