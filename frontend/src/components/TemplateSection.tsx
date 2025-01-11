import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"

export function TemplateSection() {
    return (
        <section className="w-full bg-[#fe8080] py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-2 text-sm font-semibold uppercase tracking-wider">
                        TEMPLATES
                    </div>
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                        Steal our templates and get started quick
                    </h2>
                    <p className="text-lg md:text-xl">
                        Get inspired by expert-made templates from our community
                    </p>
                </div>
            </div>
            <div className="container mx-auto mt-16 px-4">
                <Tabs defaultValue="workshops" className="w-full">
                    <TabsList className="h-auto w-full justify- gap-2 rounded-full bg-transparent p-1">
                        <TabsTrigger
                            value="workshops"
                            className="rounded-full px-6 py-2.5 text-[#000c] text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Workshops
                        </TabsTrigger>
                        <TabsTrigger
                            value="trainings"
                            className="rounded-full px-6 text-[#000c] py-2.5 text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Trainings
                        </TabsTrigger>
                        <TabsTrigger
                            value="meetings"
                            className="rounded-full px-6 text-[#000c] py-2.5 text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Meetings
                        </TabsTrigger>
                        <TabsTrigger
                            value="townhall"
                            className="rounded-full px-6 text-[#000c] py-2.5 text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Townhall & All-hands
                        </TabsTrigger>
                        <TabsTrigger
                            value="agile"
                            className="rounded-full px-6 text-[#000c] py-2.5 text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Agile sessions
                        </TabsTrigger>
                        <TabsTrigger
                            value="community"
                            className="rounded-full px-6 text-[#000c] py-2.5 text-base data-[state=active]:bg-[#0A0B1F] data-[state=active]:text-white"
                        >
                            Community events
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="workshops" className="mt-6">
                        {/* Workshop content will go here */}
                    </TabsContent>
                    <TabsContent value="trainings" className="mt-6">
                        {/* Training content will go here */}
                    </TabsContent>
                    <TabsContent value="meetings" className="mt-6">
                        {/* Meetings content will go here */}
                    </TabsContent>
                    <TabsContent value="townhall" className="mt-6">
                        {/* Townhall content will go here */}
                    </TabsContent>
                    <TabsContent value="agile" className="mt-6">
                        {/* Agile sessions content will go here */}
                    </TabsContent>
                    <TabsContent value="community" className="mt-6">
                        {/* Community events content will go here */}
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

