import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatedList } from "@/components/ui/animated-list";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";

export function FeatureSection() {
  const containerRef = useRef<HTMLElement>(null);
  const fromRef = useRef<HTMLElement>(null);
  const toRef = useRef<HTMLElement>(null);

  const files = [
    {
      name: "course_outline.pdf",
      body: "Automatically generated course structure from your existing documentation, breaking down complex topics into digestible modules.",
    },
    {
      name: "progress_tracker.xlsx",
      body: "Track learning progress, engagement metrics, and performance analytics across all participants in real-time.",
    },
    {
      name: "achievements.svg",
      body: "Customizable badges and achievements system to recognize learner milestones and encourage continuous engagement.",
    },
    {
      name: "leaderboard.json",
      body: "Real-time competitive rankings and performance metrics to drive motivation and participation among learners.",
    },
    {
      name: "learning_path.txt",
      body: "Personalized learning journeys automatically generated from your organization's documentation and knowledge base.",
    },
  ];

  const features = [
    {
      Icon: FileTextIcon,
      name: "Automatic Course Generation",
      description:
        "Transform your existing documents into structured, engaging learning modules instantly.",
      href: "#",
      cta: "See how it works",
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
        >
          {files.map((f, idx) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white ">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote className="mt-2 text-xs">{f.body}</blockquote>
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: "Progress Tracking",
      description:
        "Monitor engagement and completion rates in real-time with smart notifications.",
      href: "#",
      cta: "View features",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedList className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
          <div>Your notification content goes here</div>
        </AnimatedList>
      ),
    },
    {
      Icon: Share2Icon,
      name: "Collaborative Learning",
      description:
        "Foster team engagement with interactive leaderboards and real-time collaboration tools.",
      href: "#",
      cta: "Explore tools",
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeam
          className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105"
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
        />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Learning Schedule",
      description:
        "Automatically organize and schedule learning modules for optimal engagement.",
      className: "col-span-3 lg:col-span-1",
      href: "#",
      cta: "Learn more",
      background: (
        <Calendar
          mode="single"
          selected={new Date(2022, 4, 11, 0, 0, 0)}
          className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
        />
      ),
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#94a4ff] to-[#7d8fff] py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-900">
            TRANSFORM YOUR KNOWLEDGE
          </div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl text-gray-900">
            Turn Your Documentation Into Engaging Learning Experiences
          </h2>
          <p className="text-lg md:text-xl text-gray-800">
            Transform your existing knowledge base into interactive, gamified
            learning journeys that keep employees engaged and motivated while
            mastering new products and developments.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <BentoGrid
          iconColor="text-blue-600"
          titleColor="text-blue-800 dark:text-blue-200"
          descriptionColor="text-blue-400"
          className="container mx-auto max-w-6xl px-4"
        >
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
