import { Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white text-card-foreground py-6 border-t">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-start">
                    <div className="w-1/2">
                        <h2 className="text-xl font-bold mb-2">CheeseCake</h2>
                        <p className="text-sm text-muted-foreground">
                            TAGLINE
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            HACKATHON PROJECT
                        </p>
                    </div>
                    <div className="w-1/2 space-y-1 text-right">
                        <div className="flex items-center gap-2 text-sm justify-end">
                            <Github className="text-gray-600" size={14} />
                            <a href="https://github.com/Jatin-Khanijoan" className="hover:underline">Jatin-Khanijoan</a>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t text-sm text-center text-muted-foreground">
                    {/* <p>&copy; </p> */}
                    <p>Project by team CheeseCake</p>
                </div>
            </div>
        </footer>
    );
}